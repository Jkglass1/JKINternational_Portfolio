/* ==========================================================================
   JK International - Site-wide UX Enhancements
   Scroll progress, back-to-top, animated counters, button ripples,
   image fade-in and the mobile quick-action bar.
   Paired with assets/css/jk-ux.css. No dependencies.
   ========================================================================== */

(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var PHONE_HREF = 'tel:+917814653907';
  var WHATSAPP_HREF = 'https://wa.me/918566008869?text=Hello%20JK%20International,%20I%20am%20interested%20in%20your%20Glass,%20Aluminium%20or%20uPVC%20solutions.';

  /* --- Images fade in as they load ---
     A capture-phase listener also catches images cloned later (e.g. by slick). */
  if (!reduceMotion) {
    document.querySelectorAll('img').forEach(function (img) {
      if (!img.complete) img.classList.add('jk-img-loading');
    });
    var revealImage = function (e) {
      var img = e.target;
      if (img.tagName === 'IMG' && img.classList.contains('jk-img-loading')) {
        img.classList.remove('jk-img-loading');
        img.classList.add('jk-img-loaded');
      }
    };
    document.addEventListener('load', revealImage, true);
    document.addEventListener('error', revealImage, true);
    window.addEventListener('load', function () {
      document.querySelectorAll('img.jk-img-loading').forEach(function (img) {
        if (img.complete) revealImage({ target: img });
      });
    });
  }

  /* --- Scroll progress bar + back-to-top button --- */
  var progressBar = document.createElement('div');
  progressBar.className = 'jk-scroll-progress';
  progressBar.setAttribute('aria-hidden', 'true');
  document.body.appendChild(progressBar);

  var RING_LENGTH = 2 * Math.PI * 22;
  var topBtn = document.createElement('button');
  topBtn.type = 'button';
  topBtn.className = 'jk-back-to-top';
  topBtn.setAttribute('aria-label', 'Back to top');
  topBtn.innerHTML =
    '<svg viewBox="0 0 48 48" aria-hidden="true">' +
      '<circle class="jk-ring-track" cx="24" cy="24" r="22"></circle>' +
      '<circle class="jk-ring-fill" cx="24" cy="24" r="22" stroke-dasharray="' + RING_LENGTH + '" stroke-dashoffset="' + RING_LENGTH + '"></circle>' +
      '<path class="jk-arrow" d="M17 27l7-7 7 7"></path>' +
    '</svg>';
  document.body.appendChild(topBtn);
  var ringFill = topBtn.querySelector('.jk-ring-fill');

  topBtn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  /* --- Mobile quick-action bar (Call / WhatsApp / Quote) --- */
  var headerQuote = document.querySelector('.header-btn-quote');
  var quoteHref = headerQuote ? headerQuote.getAttribute('href') : 'contact.html';
  var mobileBar = document.createElement('nav');
  mobileBar.className = 'jk-mobile-bar';
  mobileBar.setAttribute('aria-label', 'Quick contact');
  mobileBar.innerHTML =
    '<a href="' + PHONE_HREF + '" class="jk-bar-call">' +
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 10.8a15.1 15.1 0 006.6 6.6l2.2-2.2a1 1 0 011-.25 11.4 11.4 0 003.6.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.57a1 1 0 01-.25 1z"/></svg>Call</a>' +
    '<a href="' + WHATSAPP_HREF + '" class="jk-bar-wa" target="_blank" rel="noopener">' +
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 00-8.6 15.1L2 22l5-1.3A10 10 0 1012 2zm5.3 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.5-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.8s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.1.1.3 0 .5l-.3.5-.4.4c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1c.2-.3.4-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.2.1.7-.1 1.3z"/></svg>WhatsApp</a>' +
    '<a href="' + quoteHref + '" class="jk-bar-quote">' +
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>Get Quote</a>';
  document.body.appendChild(mobileBar);
  document.body.classList.add('jk-has-mobile-bar');

  var ticking = false;
  function onScroll() {
    var doc = document.documentElement;
    var scrolled = window.pageYOffset || doc.scrollTop;
    var max = doc.scrollHeight - window.innerHeight;
    var ratio = max > 0 ? Math.min(scrolled / max, 1) : 0;

    progressBar.style.transform = 'scaleX(' + ratio + ')';
    ringFill.setAttribute('stroke-dashoffset', RING_LENGTH * (1 - ratio));
    topBtn.classList.toggle('is-visible', scrolled > 500);
    mobileBar.classList.toggle('is-visible', scrolled > 200);
    document.body.classList.toggle('jk-mobile-bar-on', scrolled > 200);
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(onScroll);
    }
  }, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* --- Ripple feedback on buttons --- */
  var RIPPLE_SELECTOR = [
    '.hero-btn-primary', '.hero-btn-outline', '.header-btn-quote', '.header-btn-phone',
    '.cat-btn-details', '.cat-btn-enquire', '.division-action-btn', '.jk-btn-quote-submit',
    '.btn-hero-solid', '.btn-hero-trans', '.facility-btn-action', '.facility-btn-link',
    '.jk-mobile-bar a', '.btn'
  ].join(',');

  if (!reduceMotion) {
    document.addEventListener('pointerdown', function (e) {
      var host = e.target.closest && e.target.closest(RIPPLE_SELECTOR);
      if (!host) return;
      if (window.getComputedStyle(host).position === 'static') host.style.position = 'relative';
      host.classList.add('jk-ripple-host');

      var rect = host.getBoundingClientRect();
      var size = Math.max(rect.width, rect.height);
      var ripple = document.createElement('span');
      ripple.className = 'jk-ripple';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      host.appendChild(ripple);
      ripple.addEventListener('animationend', function () { ripple.remove(); });
    });
  }

  /* --- Animated stat counters ---
     Counts "20+", "50,000+", "100%" etc. up from zero. Years ("1996") and
     ranges ("30-40") are left as written. */
  var COUNTER_SELECTOR = '.trust-stat-num, .mfg-metric-num';
  var COUNTER_PATTERN = /^(\D*?)(\d[\d,]*)(\D*)$/;

  function parseCounter(el) {
    if (el.jkCounter !== undefined) return el.jkCounter;
    var text = el.textContent.trim();
    var match = text.match(COUNTER_PATTERN);
    var value = match ? parseInt(match[2].replace(/,/g, ''), 10) : NaN;
    var isYear = match && /^\d{4}$/.test(match[2]) && value >= 1900 && value <= 2100;
    el.jkCounter = (!match || isNaN(value) || isYear) ? null : {
      prefix: match[1],
      suffix: match[3],
      value: value,
      commas: match[2].indexOf(',') !== -1,
      text: text
    };
    return el.jkCounter;
  }

  function formatCount(n, commas) {
    return commas ? n.toLocaleString('en-US') : String(n);
  }

  function runCounter(el) {
    var c = parseCounter(el);
    if (!c) return;
    if (el.jkCounterFrame) window.cancelAnimationFrame(el.jkCounterFrame);
    var duration = 1400;
    var start = null;
    el.classList.add('jk-counting');

    function step(ts) {
      if (start === null) start = ts;
      var t = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - t, 3);
      el.textContent = c.prefix + formatCount(Math.round(c.value * eased), c.commas) + c.suffix;
      if (t < 1) {
        el.jkCounterFrame = window.requestAnimationFrame(step);
      } else {
        el.textContent = c.text;
        el.classList.remove('jk-counting');
      }
    }
    el.jkCounterFrame = window.requestAnimationFrame(step);
  }

  if (!reduceMotion) {
    var counters = Array.prototype.slice.call(document.querySelectorAll(COUNTER_SELECTOR));

    // Hero slides: replay their counters each time a slide becomes active
    document.querySelectorAll('.hero-slide').forEach(function (slide) {
      var slideCounters = slide.querySelectorAll(COUNTER_SELECTOR);
      if (!slideCounters.length) return;
      var wasActive = false;
      var check = function () {
        var isActive = slide.classList.contains('active');
        if (isActive && !wasActive) slideCounters.forEach(runCounter);
        wasActive = isActive;
      };
      new MutationObserver(check).observe(slide, { attributes: true, attributeFilter: ['class'] });
      check();
      counters = counters.filter(function (el) { return !slide.contains(el); });
    });

    // Everything else: count once when scrolled into view
    if ('IntersectionObserver' in window && counters.length) {
      var counterObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            runCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.6 });
      counters.forEach(function (el) { counterObserver.observe(el); });
    }
  }
})();

/* --- Pillar cards: soft glow follows the cursor --- */
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!window.matchMedia('(hover: hover)').matches) return;
  document.querySelectorAll('.jk-pillar').forEach(function (card) {
    card.addEventListener('pointermove', function (e) {
      var r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });
})();

/* --- Footer: always show the current year --- */
(function () {
  var year = String(new Date().getFullYear());
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = year; });
})();
