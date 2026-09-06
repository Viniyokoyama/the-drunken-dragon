/* ============================================================
   THE DRUNKEN DRAGON — main.js
   No dependencies. Everything degrades gracefully without JS.
   ============================================================ */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  document.documentElement.classList.add('js-ready');

  /* ---------------------------------------------------------
     Preloader
     --------------------------------------------------------- */
  var preloader = $('#preloader');
  function dismissPreloader() {
    if (!preloader || preloader.classList.contains('is-done')) return;
    preloader.classList.add('is-done');
    setTimeout(function () { preloader.setAttribute('hidden', ''); }, 800);
  }
  window.addEventListener('load', function () { setTimeout(dismissPreloader, reduced ? 0 : 900); });
  setTimeout(dismissPreloader, 3500); // never trap the visitor

  /* ---------------------------------------------------------
     Year
     --------------------------------------------------------- */
  var year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------------------------------------------------------
     Sticky nav + scroll progress + back to top
     --------------------------------------------------------- */
  var nav = $('#nav');
  var bar = $('#scrollBar');
  var toTop = $('#toTop');
  var ticking = false;

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    var max = document.documentElement.scrollHeight - window.innerHeight;

    if (nav) nav.classList.toggle('is-stuck', y > 40);
    if (bar) bar.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
    if (toTop) toTop.classList.toggle('is-visible', y > window.innerHeight * 0.8);

    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    });
  }

  /* ---------------------------------------------------------
     Mobile menu
     --------------------------------------------------------- */
  var burger = $('#burger');
  var mobileMenu = $('#mobileMenu');

  function closeMenu() {
    if (!mobileMenu || mobileMenu.hasAttribute('hidden')) return;
    mobileMenu.classList.remove('is-open');
    burger.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Open menu');
    document.body.classList.remove('is-locked');
    setTimeout(function () { mobileMenu.setAttribute('hidden', ''); }, 400);
  }
  function openMenu() {
    mobileMenu.removeAttribute('hidden');
    requestAnimationFrame(function () { mobileMenu.classList.add('is-open'); });
    burger.classList.add('is-open');
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', 'Close menu');
    document.body.classList.add('is-locked');
  }

  if (burger && mobileMenu) {
    burger.addEventListener('click', function () {
      mobileMenu.hasAttribute('hidden') ? openMenu() : closeMenu();
    });
    $$('a', mobileMenu).forEach(function (a) { a.addEventListener('click', closeMenu); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
  }

  /* ---------------------------------------------------------
     Reveal on scroll
     --------------------------------------------------------- */
  var revealables = $$('.reveal');
  if ('IntersectionObserver' in window && !reduced) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealables.forEach(function (el) { io.observe(el); });
  } else {
    revealables.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------------------------------------------------------
     Scroll spy
     --------------------------------------------------------- */
  var navLinks = $$('.nav__links a');
  var sections = navLinks
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  if (sections.length && 'IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) {
          a.classList.toggle('is-current', a.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------------------------------------------------------
     Hero parallax
     --------------------------------------------------------- */
  var parallaxEls = $$('[data-parallax]');
  if (parallaxEls.length && !reduced) {
    var pTicking = false;
    window.addEventListener('scroll', function () {
      if (pTicking) return;
      pTicking = true;
      requestAnimationFrame(function () {
        var y = window.scrollY || 0;
        parallaxEls.forEach(function (el) {
          var speed = parseFloat(el.getAttribute('data-parallax')) || 0.1;
          // a custom property, not `transform`: the float animation owns transform
          el.style.setProperty('--py', (y * speed).toFixed(2) + 'px');
        });
        pTicking = false;
      });
    }, { passive: true });
  }

  /* ---------------------------------------------------------
     Hero embers (canvas)
     --------------------------------------------------------- */
  var canvas = $('#embers');
  if (canvas && !reduced) {
    var ctx = canvas.getContext('2d');
    var embers = [];
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = 0, h = 0, raf = null;

    function resize() {
      var rect = canvas.getBoundingClientRect();
      w = rect.width; h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function spawn(initial) {
      return {
        x: Math.random() * w,
        y: initial ? Math.random() * h : h + 12,
        r: Math.random() * 1.9 + 0.5,
        vy: -(Math.random() * 0.42 + 0.14),
        vx: (Math.random() - 0.5) * 0.28,
        life: 0,
        max: Math.random() * 320 + 220,
        hue: Math.random() > 0.72 ? 28 : 45,      // mostly gold, some ember-orange
        drift: Math.random() * Math.PI * 2
      };
    }

    function seed() {
      var count = Math.round(Math.min(w / 12, 90));
      embers = [];
      for (var i = 0; i < count; i++) embers.push(spawn(true));
    }

    function tick() {
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < embers.length; i++) {
        var p = embers[i];
        p.life++;
        p.drift += 0.012;
        p.x += p.vx + Math.sin(p.drift) * 0.32;
        p.y += p.vy;

        var fade = 1 - p.life / p.max;
        if (fade <= 0 || p.y < -20) { embers[i] = spawn(false); continue; }

        var alpha = Math.max(0, Math.min(0.75, fade * 0.75));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'hsla(' + p.hue + ',78%,' + (p.hue === 28 ? 58 : 70) + '%,' + alpha + ')';
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'hsla(' + p.hue + ',85%,62%,' + (alpha * 0.7) + ')';
        ctx.fill();
      }
      ctx.shadowBlur = 0;
      raf = requestAnimationFrame(tick);
    }

    resize(); seed(); tick();

    var rt;
    window.addEventListener('resize', function () {
      clearTimeout(rt);
      rt = setTimeout(function () { resize(); seed(); }, 180);
    });

    // stop burning fuel when the hero is off-screen
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting && !raf) { raf = requestAnimationFrame(tick); }
          else if (!e.isIntersecting && raf) { cancelAnimationFrame(raf); raf = null; }
        });
      }).observe(canvas);
    }
  }

  /* ---------------------------------------------------------
     Menu tabs
     --------------------------------------------------------- */
  var tabs = $$('.tab');
  var panels = $$('.panel');

  function selectTab(tab) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    panels.forEach(function (p) {
      var on = p.id === tab.getAttribute('aria-controls');
      p.classList.toggle('is-active', on);
      on ? p.removeAttribute('hidden') : p.setAttribute('hidden', '');
    });
  }

  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { selectTab(tab); });
    tab.addEventListener('keydown', function (e) {
      var dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!dir) return;
      e.preventDefault();
      var next = tabs[(i + dir + tabs.length) % tabs.length];
      next.focus();
      selectTab(next);
    });
  });

  /* ---------------------------------------------------------
     Spell card cursor glow
     --------------------------------------------------------- */
  if (window.matchMedia('(hover: hover)').matches) {
    $$('.spell').forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        card.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
  }

  /* ---------------------------------------------------------
     Magnetic buttons
     --------------------------------------------------------- */
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches && !reduced) {
    $$('.magnetic').forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var dx = (e.clientX - (r.left + r.width / 2)) * 0.22;
        var dy = (e.clientY - (r.top + r.height / 2)) * 0.32;
        el.style.transform = 'translate(' + dx.toFixed(1) + 'px,' + dy.toFixed(1) + 'px)';
      });
      el.addEventListener('pointerleave', function () { el.style.transform = ''; });
    });
  }

  /* ---------------------------------------------------------
     The d20 oracle — every result is a real item off the menu.
     Text lives in i18n.js under or.1 … or.20 so it follows EN/NL.
     --------------------------------------------------------- */
  function t(key, fallback) {
    return (window.DD_I18N && window.DD_I18N.t(key)) || fallback || key;
  }

  var rollBtn = $('#rollBtn');
  var die = $('#die');
  var result = $('#rollResult');

  if (rollBtn && die && result) {
    var numEl = $('.oracle__num', result);
    var textEl = $('.oracle__text', result);

    var lastRoll = 0;

    rollBtn.addEventListener('click', function () {
      var n = Math.floor(Math.random() * 20) + 1;
      lastRoll = n;

      die.classList.remove('is-rolling');
      void die.offsetWidth;                       // restart the animation
      die.classList.add('is-rolling');

      result.classList.remove('is-crit', 'is-fumble');
      rollBtn.disabled = true;

      var spins = 0;
      var shuffle = setInterval(function () {
        numEl.textContent = Math.floor(Math.random() * 20) + 1;
        if (++spins > 9) {
          clearInterval(shuffle);
          numEl.textContent = n;
          textEl.textContent = t('or.' + n);
          if (n === 20) result.classList.add('is-crit');
          if (n === 1) result.classList.add('is-fumble');
          rollBtn.disabled = false;
          rollBtn.textContent = t('oracle.rollAgain');
        }
      }, reduced ? 10 : 70);
    });

    // keep the result readable after an EN/NL switch
    document.addEventListener('dd:langchange', function () {
      if (!lastRoll) return;
      textEl.textContent = t('or.' + lastRoll);
      rollBtn.textContent = t('oracle.rollAgain');
    });
  }

  /* ---------------------------------------------------------
     Booking form (front-end only — wire to a real endpoint)
     --------------------------------------------------------- */
  var form = $('#bookingForm');
  var status = $('#formStatus');

  if (form && status) {
    // no bookings in the past
    var dateInput = $('#f-date', form);
    if (dateInput) dateInput.min = new Date().toISOString().split('T')[0];

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;

      $$('input[required], textarea[required]', form).forEach(function (input) {
        var valid = input.checkValidity() && input.value.trim() !== '';
        input.closest('.field').classList.toggle('has-error', !valid);
        if (!valid && ok) { input.focus(); ok = false; }
      });

      if (!ok) {
        status.textContent = t('form.error');
        return;
      }

      status.textContent = t('form.sending');
      setTimeout(function () {
        status.textContent = t('form.sent');
        form.reset();
        if (dateInput) dateInput.min = new Date().toISOString().split('T')[0];
      }, 900);
    });

    $$('.field input, .field textarea', form).forEach(function (input) {
      input.addEventListener('input', function () {
        input.closest('.field').classList.remove('has-error');
      });
    });
  }
})();
