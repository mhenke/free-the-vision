/* ============================================================
   Free the Vision — Campaign Script
   Days tracker, count-up, share, smooth scroll
   ============================================================ */

(function () {
  'use strict';

  // --- Days in Preview Counter ---
  function initDaysCounter() {
    var els = document.querySelectorAll('.impact__number[data-target]');
    els.forEach(function (el) {
      if (el.getAttribute('data-target') === '450') {
        var startDate = new Date('2025-03-01');
        var now = new Date();
        var diff = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));
        el.textContent = diff + '+';
      }
    });
  }

  // --- Impact Number Count-Up ---
  function initCountUp() {
    // Add aria-live to impact grid for screen readers
    var impactGrid = document.querySelector('.impact__grid');
    if (impactGrid) {
      impactGrid.setAttribute('aria-live', 'polite');
      impactGrid.setAttribute('aria-atomic', 'true');
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

    document.querySelectorAll('.impact__number[data-target]').forEach(function (el) {
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
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

    window.addEventListener('scroll', function () {
      if (window.scrollY > 100) {
        nav.style.background = 'rgba(255, 255, 255, 0.95)';
      } else {
        nav.style.background = 'rgba(255, 255, 255, 0.8)';
      }
    });
  }

  // --- Nav Active State ---
  function initNavActive() {
    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('.nav__links a');
    
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.getAttribute('id');
          navLinks.forEach(function (link) {
            if (link.getAttribute('href') === '#' + id) {
              link.style.color = 'var(--ink)';
              link.style.fontWeight = '600';
            } else {
              link.style.color = '';
              link.style.fontWeight = '';
            }
          });
        }
      });
    }, { threshold: 0.3, rootMargin: '-80px 0px -50% 0px' });
    
    sections.forEach(function (section) {
      observer.observe(section);
    });
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
      .catch(function () {
        var statEls = document.querySelectorAll('.impact__stat');
        statEls.forEach(function (el) {
          if (el.querySelector('.impact__reactions')) {
            el.style.display = 'none';
          }
        });
      });
  }

  function updateReactionsDOM(total, reactions) {
    var statEls = document.querySelectorAll('.impact__stat');
    var targetStat = null;
    statEls.forEach(function (el) {
      var num = el.querySelector('.impact__number');
      if (num && num.getAttribute('data-target') === '11') {
        targetStat = el;
      }
    });
    if (!targetStat) return;

    var numberEl = targetStat.querySelector('.impact__number');
    if (numberEl) {
      numberEl.setAttribute('data-target', String(total));
    }

    var container = targetStat.querySelector('.impact__reactions');
    if (container) {
      container.innerHTML = '';
      reactions.forEach(function (r) {
        var span = document.createElement('span');
        span.className = 'impact__emoji';
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
      window.addEventListener('scroll', function () {
        if (hero && window.scrollY > hero.offsetHeight) {
          backToTop.classList.add('is-visible');
        } else {
          backToTop.classList.remove('is-visible');
        }
      });
      backToTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        var nav = document.querySelector('.nav__logo');
        if (nav) setTimeout(function () { nav.focus(); }, 500);
      });
    }
  });
})();
