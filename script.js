/* ============================================================
   Free the Vision — GeoCities Script
   Visitor counter, petition, days tracker, share
   ============================================================ */

(function () {
  'use strict';

  // --- Visitor Counter (localStorage) ---
  function initVisitorCounter() {
    var el = document.getElementById('visitor-count');
    if (!el) return;

    var count = parseInt(localStorage.getItem('ftv-visitor-count') || '0', 10);
    count += 1;
    localStorage.setItem('ftv-visitor-count', count.toString());

    // Pad to 6 digits
    el.textContent = String(count).padStart(6, '0');
  }

  // --- Days in Preview Counter ---
  function initDaysCounter() {
    var els = document.querySelectorAll('.impact__number[data-target]');
    els.forEach(function (el) {
      // The first stat is "days in preview" — calculate dynamically
      if (el.getAttribute('data-target') === '450') {
        var startDate = new Date('2025-03-01'); // Vision preview approximate start
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
          var start = 0;
          var startTime = null;

          // Skip if already animated or if it's the days counter (handled separately)
          if (el.dataset.animated === 'true' || el.getAttribute('data-target') === '450') return;
          el.dataset.animated = 'true';

          function animate(timestamp) {
            if (!startTime) startTime = timestamp;
            var progress = Math.min((timestamp - startTime) / duration, 1);
            // Ease out quad
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
    var shareText = '🐋 Copilot Vision has been trapped in preview since 2025. Time to free it! #FreeTheVision';
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
        nav.style.background = 'rgba(0, 0, 0, 0.95)';
      } else {
        nav.style.background = 'rgba(0, 0, 0, 0.7)';
      }
    });
  }

  // --- Init ---
  document.addEventListener('DOMContentLoaded', function () {
    initVisitorCounter();
    initDaysCounter();
    initCountUp();
    initShareButtons();
    initSmoothScroll();
    initNavScroll();
  });
})();
