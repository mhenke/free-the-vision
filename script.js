/* ============================================================
   Free the Vision — Campaign Script
   Days tracker, count-up, share, smooth scroll
   ============================================================ */

(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- Days in Preview Counter ---
  function initDaysCounter() {
    var els = document.querySelectorAll('.community__number[data-target], .community__metric-value[data-target]');
    els.forEach(function (el) {
      if (el.getAttribute('data-target') === '450') {
        var startDate = new Date('2025-03-01');
        var now = new Date();
        var diff = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));
        el.textContent = diff + '+';
      }
    });
  }

  // --- Community Number Count-Up ---
  function initCountUp() {
    // Add aria-live to the live signal block for screen readers
    var communitySignal = document.querySelector('.community__signal');
    if (communitySignal) {
      communitySignal.setAttribute('aria-live', 'polite');
      communitySignal.setAttribute('aria-atomic', 'true');
    }

    if (prefersReducedMotion) {
      document.querySelectorAll('.community__number[data-target], .community__metric-value[data-target]').forEach(function (el) {
        var target = parseInt(el.getAttribute('data-target') || '0', 10);
        var suffix = el.getAttribute('data-suffix') || '';

        if (String(target) === '450') return;

        el.textContent = target + suffix;
        el.setAttribute('aria-label', target + suffix + ' total');
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var target = parseInt(el.getAttribute('data-target') || '0', 10);
          var suffix = el.getAttribute('data-suffix') || '';
          var duration = 1500;
          var startTime = null;

          if (el.dataset.animated === 'true' || el.getAttribute('data-target') === '450') return;
          el.dataset.animated = 'true';

          // Announce start for screen readers
          el.setAttribute('aria-label', 'Loading');

          function animate(timestamp) {
            if (!startTime) startTime = timestamp;
            var progress = Math.min((timestamp - startTime) / duration, 1);
            var eased = 1 - (1 - progress) * (1 - progress);
            var current = Math.floor(eased * target);
            el.textContent = current + suffix;
            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              el.textContent = target + suffix;
              // Announce final value
              el.setAttribute('aria-label', target + suffix + ' total');
            }
          }

          requestAnimationFrame(animate);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.3 });

    document.querySelectorAll('.community__number[data-target], .community__metric-value[data-target]').forEach(function (el) {
      observer.observe(el);
    });
  }

  // --- Share Buttons ---
  function initShareButtons() {
    var shareText = '\uD83D\uDC33 Copilot Vision has been trapped in preview since 2025. Time to free it! #FreeTheVision';
    var shareUrl = 'https://mhenke.github.io/free-the-vision/';

    function openShare(btn) {
      var platform = btn.getAttribute('data-share');
      var url;

      if (platform === 'twitter') {
        url = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(shareText) + '&url=' + encodeURIComponent(shareUrl);
      } else if (platform === 'linkedin') {
        url = 'https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(shareUrl);
      } else if (platform === 'bluesky') {
        url = 'https://bsky.app/intent/compose?text=' + encodeURIComponent(shareText) + '&url=' + encodeURIComponent(shareUrl);
      } else if (platform === 'hackernews') {
        url = 'https://news.ycombinator.com/submitlink?u=' + encodeURIComponent(shareUrl) + '&t=' + encodeURIComponent(shareText);
      }

      if (url) {
        window.open(url, '_blank', 'width=600,height=400');
      }
    }

    document.querySelectorAll('[data-share]').forEach(function (btn) {
      btn.addEventListener('click', function () { openShare(btn); });
      btn.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openShare(btn);
        }
      });
    });
  }

  // --- Smooth Scroll with Focus Management ---
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var targetId = link.getAttribute('href');
        if (targetId === '#') return;
        var target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          // Set tabindex if not already focusable for focus management
          if (!target.getAttribute('tabindex') && target.tagName !== 'A' && target.tagName !== 'BUTTON') {
            target.setAttribute('tabindex', '-1');
          }
          target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
          // Move focus to target after scroll completes
          setTimeout(function () {
            target.focus({ preventScroll: true });
          }, 500);
        }
      });
    });
  }

  // --- Nav Background on Scroll ---
  function initNavScroll() {
    var nav = document.querySelector('.nav');
    if (!nav) return;

    var scrolled = false;

    function updateNavState() {
      var next = window.scrollY > 100;
      if (next === scrolled) return;
      scrolled = next;
      nav.classList.toggle('nav--scrolled', scrolled);
    }

    updateNavState();
    window.addEventListener('scroll', updateNavState, { passive: true });
  }

  // --- Nav Active State ---
  function initNavActive() {
    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('.nav__links a');
    var activeId = '';

    function setActive(id) {
      if (!id || id === activeId) return;
      activeId = id;

      navLinks.forEach(function (link) {
        var isActive = link.getAttribute('href') === '#' + id;
        link.classList.toggle('is-active', isActive);
        if (isActive) {
          link.setAttribute('aria-current', 'page');
        } else {
          link.removeAttribute('aria-current');
        }
      });
    }
    
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          setActive(entry.target.getAttribute('id'));
        }
      });
    }, { threshold: 0.3, rootMargin: '-80px 0px -50% 0px' });

    sections.forEach(function (section) {
      observer.observe(section);
    });

    if (sections[0]) {
      setActive(sections[0].getAttribute('id'));
    }
  }

  // --- Live GitHub Reactions ---
  var REACTION_MAP = {
    THUMBS_UP: '👍',
    THUMBS_DOWN: '👎',
    LAUGH: '😄',
    CONFUSED: '😕',
    HEART: '❤️',
    HOORAY: '🎉',
    ROCKET: '🚀',
    EYES: '👀',
    THINKING: '🤔',
    RED_HEART: '❤️',
  };

  function aggregateReactionGroups(reactionGroups) {
    var totals = {};
    reactionGroups.forEach(function (group) {
      var count = group.users.totalCount;
      if (count > 0) {
        totals[group.content] = (totals[group.content] || 0) + count;
      }
    });
    return totals;
  }

  function fetchReactions() {
    var query = '{ repository(owner: "community", name: "community") { discussion(number: 188040) { reactionGroups { content users { totalCount } } comments(first: 100) { nodes { reactionGroups { content users { totalCount } } } } } } }';

    fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: { 'Accept': 'application/vnd.github+json' },
      body: JSON.stringify({ query: query }),
    })
      .then(function (res) {
        if (!res.ok) throw new Error('GitHub API ' + res.status);
        return res.json();
      })
      .then(function (data) {
        var discussion = data.data && data.data.repository && data.data.repository.discussion;
        if (!discussion) throw new Error('No discussion data');

        var totals = aggregateReactionGroups(discussion.reactionGroups);

        discussion.comments.nodes.forEach(function (comment) {
          var commentTotals = aggregateReactionGroups(comment.reactionGroups);
          Object.keys(commentTotals).forEach(function (key) {
            totals[key] = (totals[key] || 0) + commentTotals[key];
          });
        });

        var reactions = [];
        var total = 0;
        Object.keys(totals).forEach(function (content) {
          var emoji = REACTION_MAP[content];
          if (emoji && totals[content] > 0) {
            reactions.push({ emoji: emoji, count: totals[content] });
            total += totals[content];
          }
        });

        if (reactions.length === 0) throw new Error('No reactions found');

        reactions.sort(function (a, b) { return b.count - a.count; });
        updateReactionsDOM(total, reactions);
      })
      .catch(function (err) {
        // Show reaction emojis as symbolic cues without fabricated counts
        var reactionsContainer = document.querySelector('.community__signal .community__reactions');
        if (reactionsContainer) {
          reactionsContainer.innerHTML = '';
          var staticEmojis = ['👍', '🎉', '🚀', '❤️', '👀'];
          staticEmojis.forEach(function (emoji) {
            var span = document.createElement('span');
            span.className = 'community__emoji community__emoji--static';
            span.setAttribute('role', 'img');
            span.setAttribute('aria-label', 'Reactions include ' + emoji);
            span.textContent = emoji;
            reactionsContainer.appendChild(span);
          });
        }
        console.log('GitHub reactions unavailable, showing symbolic emoji cues:', err.message);
      });
  }

  function updateReactionsDOM(total, reactions) {
    var targetSignal = document.querySelector('.community__signal');
    if (!targetSignal) return;

    var numberEl = targetSignal.querySelector('.community__number');
    if (numberEl) {
      numberEl.setAttribute('data-target', String(total));
      if (prefersReducedMotion) {
        numberEl.textContent = String(total);
        numberEl.setAttribute('aria-label', total + ' total');
      }
    }

    var container = targetSignal.querySelector('.community__reactions');
    if (container) {
      container.innerHTML = '';
      reactions.forEach(function (r) {
        var span = document.createElement('span');
        span.className = 'community__emoji';
        span.setAttribute('role', 'img');
        span.setAttribute('aria-label', r.count + ' ' + r.emoji);
        span.innerHTML = r.emoji + ' <strong>' + r.count + '</strong>';
        container.appendChild(span);
      });
    }
  }

  // --- Init ---
  document.addEventListener('DOMContentLoaded', function () {
    initDaysCounter();
    initCountUp();
    initShareButtons();
    initSmoothScroll();
    initNavScroll();
    initNavActive();
    fetchReactions();

    // Mobile nav toggle
    var toggle = document.querySelector('.nav__toggle');
    var navLinks = document.querySelector('.nav__links');
    if (toggle && navLinks) {
      toggle.addEventListener('click', function () {
        var expanded = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', String(!expanded));
        navLinks.classList.toggle('is-open');
      });
      navLinks.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
          toggle.setAttribute('aria-expanded', 'false');
          navLinks.classList.remove('is-open');
        });
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && navLinks.classList.contains('is-open')) {
          toggle.setAttribute('aria-expanded', 'false');
          navLinks.classList.remove('is-open');
          toggle.focus();
        }
      });
    }

    // Back to top
    var backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
      var hero = document.querySelector('.hero');
      var backToTopVisible = false;

      function setBackToTopVisibility(visible) {
        if (visible === backToTopVisible) return;
        backToTopVisible = visible;
        backToTop.hidden = !visible;
        backToTop.classList.toggle('is-visible', visible);
      }

      setBackToTopVisibility(false);
      window.addEventListener('scroll', function () {
        setBackToTopVisibility(Boolean(hero && window.scrollY > hero.offsetHeight));
      });
      backToTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
        var nav = document.querySelector('.nav__logo');
        if (nav) setTimeout(function () { nav.focus({ preventScroll: true }); }, 500);
      });
    }
  });
})();
