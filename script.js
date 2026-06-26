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

    document.querySelectorAll('[data-share]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var platform = btn.getAttribute('data-share');
        var url;

        if (platform === 'twitter') {
          url = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(shareText) + '&url=' + encodeURIComponent(shareUrl);
        } else if (platform === 'linkedin') {
          url = 'https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(shareUrl);
        }

        if (url) {
          window.open(url, '_blank', 'width=600,height=400');
        }
      });
    });
  }

  // --- Smooth Scroll ---
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var targetId = link.getAttribute('href');
        if (targetId === '#') return;
        var target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

  // --- Init ---
  document.addEventListener('DOMContentLoaded', function () {
    initDaysCounter();
    initCountUp();
    initShareButtons();
    initSmoothScroll();
    initNavScroll();
    initNavActive();
  });
})();
