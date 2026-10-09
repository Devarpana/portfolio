(function () {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Toast ---------- */
  const toast = $('#toast');
  let toastTimer;
  function showToast(text) {
    if (!toast) return;
    toast.textContent = text;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
  }

  /* ---------- Mobile menu ---------- */
  const hamburger = $('#hamburger');
  const navLinks = $('#nav-links');

  function setMenu(open) {
    navLinks.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
    hamburger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }

  hamburger.addEventListener('click', () => setMenu(!navLinks.classList.contains('open')));
  $$('a', navLinks).forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
  document.addEventListener('click', e => {
    if (navLinks.classList.contains('open') && !navLinks.contains(e.target) && !hamburger.contains(e.target)) {
      setMenu(false);
    }
  });

  /* ---------- Theme toggle (remembered across visits) ---------- */
  const themeToggle = $('#theme-toggle');
  const themeIcon = $('i', themeToggle);
  const metaTheme = $('meta[name="theme-color"]');

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const isDark = theme === 'dark';
    // Show the icon for the theme you would switch to
    themeIcon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    themeToggle.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
    if (metaTheme) metaTheme.setAttribute('content', isDark ? '#07030f' : '#fdf6fb');
  }

  applyTheme(document.documentElement.getAttribute('data-theme') || 'dark');

  themeToggle.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try { localStorage.setItem('theme', next); } catch (e) { /* storage unavailable */ }
  });

  /* ---------- Typewriter ---------- */
  const typedEl = $('#typed');
  const roles = ['Web Developer', 'Web Designer', 'Graphic Designer', 'Data Engineer', 'AI Enthusiast'];

  if (typedEl) {
    if (reduceMotion) {
      typedEl.textContent = roles[0];
    } else {
      let roleIndex = 0;
      let charIndex = 0;
      let deleting = false;

      (function tick() {
        const word = roles[roleIndex];
        charIndex += deleting ? -1 : 1;
        typedEl.textContent = word.slice(0, charIndex);

        let delay = deleting ? 40 : 80;
        if (!deleting && charIndex === word.length) {
          deleting = true;
          delay = 1600;
        } else if (deleting && charIndex === 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          delay = 350;
        }
        setTimeout(tick, delay);
      })();
    }
  }

  /* ---------- Header shadow, scroll progress, back-to-top ---------- */
  const header = $('.site-header');
  const progress = $('.scroll-progress');
  const toTop = $('#scrollToTopBtn');

  function onScroll() {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    header.classList.toggle('scrolled', y > 10);
    progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    toTop.classList.toggle('show', y > window.innerHeight * 0.6);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));

  /* ---------- Active nav link for the section in view ---------- */
  const navAnchors = $$('a', navLinks);
  const sections = navAnchors
    .map(a => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const id = '#' + entry.target.id;
        navAnchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === id));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(s => spy.observe(s));
  }

  /* ---------- Reveal on scroll ---------- */
  const reveals = $$('.reveal');
  // Small stagger for siblings inside grids
  reveals.forEach(el => {
    const siblings = el.parentElement ? $$(':scope > .reveal', el.parentElement) : [];
    const i = siblings.indexOf(el);
    if (i > 0) el.style.setProperty('--d', `${Math.min(i, 5) * 0.08}s`);
  });

  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('in'));
  }

  /* ---------- Hero illustration: tilt, and the message on hover or tap ---------- */
  const heroVisual = $('#hero-visual');
  const avatarRing = heroVisual && $('.avatar-ring', heroVisual);

  if (heroVisual) {
    if (!reduceMotion && window.matchMedia('(hover: hover)').matches) {
      heroVisual.addEventListener('pointermove', e => {
        const r = heroVisual.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        avatarRing.style.setProperty('--ry', `${x * 16}deg`);
        avatarRing.style.setProperty('--rx', `${y * -16}deg`);
      });
      heroVisual.addEventListener('pointerleave', () => {
        avatarRing.style.setProperty('--ry', '0deg');
        avatarRing.style.setProperty('--rx', '0deg');
      });
    }
    // Touch screens have no hover, so a tap shows the message for a moment
    let bubbleTimer;
    heroVisual.addEventListener('click', () => {
      heroVisual.classList.add('show');
      clearTimeout(bubbleTimer);
      bubbleTimer = setTimeout(() => heroVisual.classList.remove('show'), 2500);
    });
  }

  /* ---------- Contact animation, with a built-in fallback if it can't load ---------- */
  const lottieWrap = $('.lottie-wrap');
  if (lottieWrap) {
    const player = $('dotlottie-wc', lottieWrap);
    const fail = () => lottieWrap.classList.add('failed');
    const timer = setTimeout(() => {
      if (!player.dotLottie || !player.dotLottie.isLoaded) fail();
    }, 8000);
    if (window.customElements) {
      customElements.whenDefined('dotlottie-wc').then(() => {
        const watch = () => {
          if (!player.dotLottie) return setTimeout(watch, 200);
          player.dotLottie.addEventListener('loadError', () => { clearTimeout(timer); fail(); });
        };
        watch();
      });
    }
  }

  /* ---------- Animated counters ---------- */
  const counters = $$('[data-count-of], [data-count]');
  counters.forEach(el => {
    el.dataset.target = el.dataset.countOf ? String($$(el.dataset.countOf).length) : el.dataset.count;
  });

  function runCounter(el) {
    const target = Number(el.dataset.target);
    if (reduceMotion) { el.textContent = target; return; }
    const start = performance.now();
    const dur = 1100;
    (function step(now) {
      const p = Math.min((now - start) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    })(start);
  }

  if ('IntersectionObserver' in window) {
    const co = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { runCounter(entry.target); obs.unobserve(entry.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(el => co.observe(el));
  } else {
    counters.forEach(el => { el.textContent = el.dataset.target; });
  }

  /* ---------- Skill category tabs ---------- */
  const skillTabs = $$('.skill-tab');
  const skills = $$('.skill');
  skillTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const filter = tab.dataset.filter;
      skillTabs.forEach(t => {
        const on = t === tab;
        t.classList.toggle('active', on);
        t.setAttribute('aria-selected', String(on));
      });
      skills.forEach(s => {
        const show = filter === 'all' || s.dataset.cat === filter;
        s.classList.toggle('is-hidden', !show);
        s.classList.remove('pop');
        if (show) { void s.offsetWidth; s.classList.add('pop'); }
      });
    });
  });

  /* ---------- Project filters ---------- */
  const filterBtns = $$('.filter-btn');
  const projects = $$('.project-card');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      filterBtns.forEach(b => b.classList.toggle('active', b === btn));
      projects.forEach(p => {
        const cats = (p.dataset.cat || '').split(' ');
        const show = filter === 'all' || cats.includes(filter) || cats.includes('all');
        p.classList.toggle('is-hidden', !show);
      });
    });
  });

  /* ---------- Spotlight glow on service cards ---------- */
  $$('.service-card').forEach(card => {
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });

  /* ---------- Copy email ---------- */
  $$('.copy-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const text = btn.dataset.copy;
      try {
        await navigator.clipboard.writeText(text);
        showToast('Email copied to clipboard');
      } catch (e) {
        showToast(text);
      }
    });
  });

  /* ---------- Contact form ---------- */
  // Messages are delivered by FormSubmit (free, no account) to this inbox.
  // The very first message sends an activation email there; click "Activate Form" once.
  const formEndpoint = 'https://formsubmit.co/ajax/devarpanatribedi@gmail.com';
  // Older Google Sheet log, kept as a silent backup copy
  const sheetURL = 'https://script.google.com/macros/s/AKfycbx4grexFqYsMPC_o_4v04VzBbpS34JmGq30fwthCA-cKufZB6QQKPpIfjizZDwW7DjZ/exec';
  const form = document.forms.contact;
  const msg = $('#msg');

  if (form) {
    const submitBtn = $('button[type="submit"]', form);
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function setMsg(text, kind) {
      msg.textContent = text;
      msg.className = 'form-msg' + (kind ? ' ' + kind : '');
    }

    function validate() {
      let ok = true;
      $$('input[required], textarea[required]', form).forEach(field => {
        const value = field.value.trim();
        const bad = !value || (field.type === 'email' && !emailRe.test(value));
        field.parentElement.classList.toggle('invalid', bad);
        if (bad) ok = false;
      });
      return ok;
    }

    form.addEventListener('input', e => {
      if (e.target.parentElement.classList.contains('invalid')) validate();
    });

    form.addEventListener('submit', e => {
      e.preventDefault();

      // Bots fill the hidden field; quietly pretend it worked
      if (form._honey.value) { form.reset(); return; }

      if (!validate()) {
        setMsg('Please fill in your name, a valid email and a message.', 'err');
        return;
      }

      const name = form.Name.value.trim();
      const email = form.email.value.trim();
      const message = form.message.value.trim();

      submitBtn.disabled = true;
      submitBtn.classList.add('is-loading');
      setMsg('Sending…');

      // Best-effort copy to the Google Sheet; its result is ignored
      const sheetData = new FormData();
      sheetData.append('Name', name);
      sheetData.append('email', email);
      sheetData.append('message', message);
      fetch(sheetURL, { method: 'POST', body: sheetData, mode: 'no-cors' }).catch(() => {});

      fetch(formEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name,
          email,
          message,
          _subject: `Portfolio message from ${name}`,
          _replyto: email,
          _template: 'table',
          _captcha: 'false'
        })
      })
        .then(response => response.json().catch(() => ({})).then(data => {
          if (!response.ok || String(data.success) === 'false') {
            throw new Error(data.message || 'Request failed: ' + response.status);
          }
          setMsg('Thanks! Your message was sent. I will get back to you soon.', 'ok');
          form.reset();
        }))
        .catch(error => {
          console.error('Contact form error:', error);
          if (/activat/i.test(error.message)) {
            setMsg('Almost ready: the site owner needs to activate the form from their inbox first.', 'err');
          } else {
            setMsg('Sorry, something went wrong. Please email me directly at devarpanatribedi@gmail.com.', 'err');
          }
        })
        .finally(() => {
          submitBtn.disabled = false;
          submitBtn.classList.remove('is-loading');
          setTimeout(() => { if (msg.classList.contains('ok')) setMsg(''); }, 6000);
        });
    });
  }

  /* ---------- Footer year ---------- */
  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();
})();
