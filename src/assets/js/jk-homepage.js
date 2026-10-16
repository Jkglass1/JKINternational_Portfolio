/* ==========================================================================
   JK International - Seamless Automatic Hero Carousel
   Smooth Auto-Sliding across 3 distinct preview styles
   Zero navigation arrows or indicators
   ========================================================================== */

(function () {
  'use strict';

  var slides = document.querySelectorAll('.hero-slide');
  if (!slides.length) return;

  var current = 0;
  var total = slides.length;
  var AUTOPLAY_DELAY = 5200; // 5.2 seconds fixed interval
  var autoplayTimer = null;

  function showSlide(idx) {
    slides.forEach(function (s, i) {
      if (i === idx) {
        s.classList.add('active');
        s.setAttribute('aria-hidden', 'false');
      } else {
        s.classList.remove('active');
        s.setAttribute('aria-hidden', 'true');
      }
    });
    current = idx;
  }

  function nextSlide() {
    showSlide((current + 1) % total);
  }

  function startAutoplay() {
    if (autoplayTimer) clearInterval(autoplayTimer);
    autoplayTimer = setInterval(nextSlide, AUTOPLAY_DELAY);
  }

  // Check URL query param or hash for initial slide if present
  var urlParams = new URLSearchParams(window.location.search);
  var initSlide = parseInt(urlParams.get('slide'), 10);
  if (isNaN(initSlide) || initSlide < 0 || initSlide >= total) {
    initSlide = 0;
  }

  // Initialize slide and start hands-free autoplay
  showSlide(initSlide);
  startAutoplay();

  // Handle tab visibility cleanly
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      clearInterval(autoplayTimer);
    } else {
      startAutoplay();
    }
  });
})();
