/* Cyber Heights Properties — site interactions (vanilla JS, no dependencies) */
(() => {
  'use strict';
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const SITE = window.SITE || {};
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const store = {
    get: (k, s = sessionStorage) => { try { return s.getItem(k); } catch { return null; } },
    set: (k, v, s = sessionStorage) => { try { s.setItem(k, v); } catch { /* storage unavailable */ } },
  };

  /* ---------- Header & nav ---------- */
  const header = $('[data-header]');
  const onScroll = () => header && header.classList.toggle('is-scrolled', scrollY > 40);
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const toggle = $('[data-nav-toggle]');
  const nav = $('#main-nav');
  if (toggle && nav) {
    const setOpen = (open) => {
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      document.body.style.overflow = open ? 'hidden' : '';
    };
    toggle.addEventListener('click', () => setOpen(!nav.classList.contains('is-open')));
    nav.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
    addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
  }
  $$('.main-nav ul a').forEach((a) => {
    if (location.pathname.startsWith(a.getAttribute('href'))) a.setAttribute('aria-current', 'page');
  });

  /* ---------- Reveal on scroll ---------- */
  const revealIO = 'IntersectionObserver' in window && new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-visible'); revealIO.unobserve(en.target); } });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
  $$('.reveal').forEach((el, i) => {
    if (!revealIO) return el.classList.add('is-visible');
    el.style.transitionDelay = `${(i % 4) * 70}ms`;
    revealIO.observe(el);
  });

  /* ---------- Hero slider ---------- */
  const hero = $('[data-hero-slider]');
  if (hero) {
    const slides = $$('[data-slide]', hero);
    const dots = $$('[data-dot]', hero);
    let idx = 0, timer;
    const go = (n) => {
      idx = (n + slides.length) % slides.length;
      slides.forEach((s, i) => { s.classList.toggle('is-active', i === idx); s.setAttribute('aria-hidden', String(i !== idx)); });
      dots.forEach((d, i) => d.setAttribute('aria-selected', String(i === idx)));
    };
    const play = () => { if (reduceMotion) return; clearInterval(timer); timer = setInterval(() => go(idx + 1), 6500); };
    dots.forEach((d) => d.addEventListener('click', () => { go(+d.dataset.dot); play(); }));
    document.addEventListener('visibilitychange', () => (document.hidden ? clearInterval(timer) : play()));
    play();
  }

  /* ---------- Carousels ---------- */
  $$('[data-carousel]').forEach((track) => {
    const navEl = $(`[data-carousel-nav="${track.dataset.carousel}"]`);
    if (!navEl) return;
    const prev = $('[data-prev]', navEl), next = $('[data-next]', navEl);
    const step = () => (track.firstElementChild?.getBoundingClientRect().width || 300) + 20;
    prev.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
    next.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
    const update = () => {
      prev.disabled = track.scrollLeft < 5;
      next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 5;
    };
    track.addEventListener('scroll', update, { passive: true });
    addEventListener('resize', update);
    update();
  });

  /* ---------- Counters ---------- */
  const fmtNum = (n) => n.toLocaleString('en-IN');
  const countIO = 'IntersectionObserver' in window && new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const el = en.target, end = +el.dataset.count, t0 = performance.now(), dur = 1800;
      countIO.unobserve(el);
      if (reduceMotion) { el.textContent = fmtNum(end); return; }
      const tick = (t) => {
        const p = Math.min(1, (t - t0) / dur);
        el.textContent = fmtNum(Math.round(end * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.4 });
  $$('[data-count]').forEach((el) => (countIO ? countIO.observe(el) : (el.textContent = fmtNum(+el.dataset.count))));

  /* ---------- Testimonials ---------- */
  const tWrap = $('[data-testimonials]');
  if (tWrap) {
    const items = $$('[data-testimonial]', tWrap), dots = $$('.testimonial-dots [data-dot]', tWrap);
    let i = 0, timer;
    const go = (n) => {
      i = (n + items.length) % items.length;
      items.forEach((el, k) => { el.classList.toggle('is-active', k === i); el.setAttribute('aria-hidden', String(k !== i)); });
      dots.forEach((d, k) => (k === i ? d.setAttribute('aria-current', 'true') : d.removeAttribute('aria-current')));
    };
    const play = () => { if (reduceMotion) return; clearInterval(timer); timer = setInterval(() => go(i + 1), 7000); };
    $('[data-prev]', tWrap).addEventListener('click', () => { go(i - 1); play(); });
    $('[data-next]', tWrap).addEventListener('click', () => { go(i + 1); play(); });
    dots.forEach((d) => d.addEventListener('click', () => { go(+d.dataset.dot); play(); }));
    tWrap.addEventListener('mouseenter', () => clearInterval(timer));
    tWrap.addEventListener('mouseleave', play);
    play();
  }

  /* ---------- Tabs (floor plans) ---------- */
  $$('[data-tabs]').forEach((wrap) => {
    const tabs = $$('[role="tab"]', wrap);
    const select = (tab) => {
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
      });
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => select(t));
      t.addEventListener('keydown', (e) => {
        const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!d) return;
        const n = tabs[(i + d + tabs.length) % tabs.length];
        select(n); n.focus();
      });
    });
  });

  /* ---------- Gallery lightbox ---------- */
  const galleryLinks = $$('[data-lightbox]');
  if (galleryLinks.length) {
    const lb = document.createElement('div');
    lb.className = 'lightbox'; lb.hidden = true;
    lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true'); lb.setAttribute('aria-label', 'Image viewer');
    lb.innerHTML = `<img alt=""><button class="lb-close" aria-label="Close">✕</button><button class="lb-prev" aria-label="Previous image">‹</button><button class="lb-next" aria-label="Next image">›</button><p class="lb-count"></p>`;
    document.body.appendChild(lb);
    const im = $('img', lb), count = $('.lb-count', lb);
    let cur = 0, opener;
    const show = (n) => {
      cur = (n + galleryLinks.length) % galleryLinks.length;
      im.src = galleryLinks[cur].href;
      im.alt = $('img', galleryLinks[cur]).alt;
      count.textContent = `${cur + 1} / ${galleryLinks.length}`;
    };
    const close = () => { lb.hidden = true; document.body.style.overflow = ''; opener && opener.focus(); };
    galleryLinks.forEach((a, n) => a.addEventListener('click', (e) => {
      e.preventDefault(); opener = a; show(n); lb.hidden = false; document.body.style.overflow = 'hidden'; $('.lb-close', lb).focus();
    }));
    $('.lb-close', lb).addEventListener('click', close);
    $('.lb-prev', lb).addEventListener('click', () => show(cur - 1));
    $('.lb-next', lb).addEventListener('click', () => show(cur + 1));
    lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
    addEventListener('keydown', (e) => {
      if (lb.hidden) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(cur - 1);
      if (e.key === 'ArrowRight') show(cur + 1);
    });
    let x0 = null;
    lb.addEventListener('touchstart', (e) => (x0 = e.touches[0].clientX), { passive: true });
    lb.addEventListener('touchend', (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 40) show(cur + (dx < 0 ? 1 : -1));
      x0 = null;
    });
  }

  /* ---------- Lite YouTube & lazy maps ---------- */
  $$('[data-yt]').forEach((b) => b.addEventListener('click', () => {
    b.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(b.dataset.yt)}?autoplay=1&rel=0" title="Video walkthrough" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
  }, { once: true }));

  const loadMap = (el) => {
    if (el.dataset.loaded) return;
    el.dataset.loaded = '1';
    el.innerHTML = `<iframe src="${el.dataset.map}" title="${el.dataset.title || 'Map'}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>`;
  };
  const mapIO = 'IntersectionObserver' in window && new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { loadMap(en.target); mapIO.unobserve(en.target); } });
  }, { rootMargin: '300px' });
  $$('[data-map]').forEach((el) => {
    el.addEventListener('click', () => loadMap(el));
    mapIO && mapIO.observe(el);
  });

  /* ---------- Modals ---------- */
  const openModal = (id, trigger) => {
    const dlg = document.getElementById(id);
    if (!dlg || dlg.open) return;
    $$('dialog[open]').forEach((d) => d.close());
    const proj = trigger && trigger.dataset.project;
    if (proj) { const sel = $('select[name="project"]', dlg); if (sel) sel.value = proj; }
    if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', '');
    document.body.style.overflow = 'hidden';
  };
  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-open]');
    if (t) { e.preventDefault(); openModal(t.dataset.open, t); return; }
    const c = e.target.closest('[data-close]');
    if (c) c.closest('dialog').close();
  });
  $$('dialog.modal').forEach((d) => {
    d.addEventListener('click', (e) => { if (e.target === d) d.close(); }); // backdrop
    d.addEventListener('close', () => { document.body.style.overflow = ''; });
  });

  // Enquiry popup: after N seconds or on exit intent — once per session, never after a lead is submitted.
  const canPopup = () => !store.get('popupShown') && !store.get('leadSubmitted', localStorage) && !$('dialog[open]') && !$('.main-nav.is-open');
  const showPopup = () => { if (!canPopup()) return; store.set('popupShown', '1'); openModal('enquiry-modal'); };
  if (!store.get('popupShown')) {
    setTimeout(showPopup, (SITE.popupDelay || 15) * 1000);
    if (matchMedia('(pointer: fine)').matches) {
      document.addEventListener('mouseout', (e) => { if (!e.relatedTarget && e.clientY <= 0) showPopup(); });
    }
  }

  /* ---------- Lead forms ---------- */
  // Capture campaign parameters for attribution.
  const params = new URLSearchParams(location.search);
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid'].forEach((k) => {
    if (params.get(k)) store.set(k, params.get(k));
  });

  const today = new Date();
  const iso = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  $$('[data-min-today]').forEach((i) => (i.min = iso));

  const setError = (input, msg) => {
    const field = input.closest('.field');
    if (!field) return;
    field.classList.toggle('is-invalid', !!msg);
    let err = $('.field-error', field);
    if (msg) {
      if (!err) { err = document.createElement('span'); err.className = 'field-error'; err.id = input.id + '-err'; field.appendChild(err); }
      err.textContent = msg;
      input.setAttribute('aria-invalid', 'true');
      input.setAttribute('aria-describedby', err.id);
    } else if (err) {
      err.remove(); input.removeAttribute('aria-invalid'); input.removeAttribute('aria-describedby');
    }
  };

  const normalisePhone = (code, raw) => {
    let d = raw.replace(/\D/g, '');
    if (code === '+91') { d = d.replace(/^(91|0)(?=\d{10}$)/, ''); return /^[6-9]\d{9}$/.test(d) ? d : null; }
    return /^\d{6,12}$/.test(d) ? d : null;
  };

  const validate = (form) => {
    let ok = true;
    const v = (name) => form.elements[name];
    const name = v('name'), phone = v('phone'), email = v('email'), project = v('project');
    const rules = [
      [name, name.value.trim().length >= 2 ? '' : 'Please enter your name'],
      [phone, normalisePhone(v('country_code').value, phone.value) ? '' : (v('country_code').value === '+91' ? 'Enter a valid 10-digit mobile number' : 'Enter a valid phone number')],
      [email, /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim()) ? '' : 'Enter a valid email address'],
      [project, project.value ? '' : 'Please choose a project'],
    ];
    if (v('visit_date')) rules.push([v('visit_date'), v('visit_date').value && v('visit_date').value >= iso ? '' : 'Choose a date from today onwards']);
    if (v('visit_time')) rules.push([v('visit_time'), v('visit_time').value ? '' : 'Choose a time slot']);
    rules.forEach(([el, msg]) => { setError(el, msg); if (msg && ok) { ok = false; el.focus(); } });
    if (ok && !v('consent').checked) { ok = false; form.querySelector('.form-msg').textContent = 'Please accept the consent to continue.'; form.querySelector('.form-msg').classList.add('is-error'); }
    return ok;
  };

  class LeadError extends Error {
    constructor(message, field) { super(message); this.field = field; }
  }

  async function sendLead(data) {
    if (SITE.leadEndpoint) {
      let res;
      try {
        res = await fetch(SITE.leadEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      } catch {
        throw new LeadError('We couldn\'t reach our server. Please check your connection or call us directly.');
      }
      const body = await res.json().catch(() => ({}));
      if (res.status === 422) {
        const first = (body.errors || [])[0] || {};
        throw new LeadError(body.detail || 'Please check the details and try again.', first.field);
      }
      if (res.status === 429) throw new LeadError(body.detail || 'Too many attempts. Please try again in a minute.');
      if (!res.ok) throw new LeadError('Something went wrong. Please try again or call us directly.');
      return body;
    }
    // Development fallback — no endpoint configured.
    let leads = [];
    try { leads = JSON.parse(localStorage.getItem('leads') || '[]'); } catch { /* ignore */ }
    leads.push(data);
    store.set('leads', JSON.stringify(leads), localStorage);
    console.info('[lead captured — set leadEndpoint in site.config.js to send to your CRM]', data);
    await new Promise((r) => setTimeout(r, 500));
  }

  $$('[data-lead-form]').forEach((form) => {
    form.addEventListener('input', (e) => { if (e.target.closest('.field.is-invalid')) setError(e.target, ''); });
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const msg = $('.form-msg', form);
      msg.textContent = ''; msg.classList.remove('is-error');
      if (!validate(form)) return;
      const fd = new FormData(form);
      const kind = form.dataset.leadForm;
      const projectOpt = form.elements.project.selectedOptions[0];
      const data = {
        form: kind,
        name: fd.get('name').trim(),
        country_code: fd.get('country_code'),
        phone: normalisePhone(fd.get('country_code'), fd.get('phone')),
        email: fd.get('email').trim(),
        project: fd.get('project'),
        visit_date: fd.get('visit_date') || undefined,
        visit_time: fd.get('visit_time') || undefined,
        consent: !!fd.get('consent'),
        website: fd.get('website') || undefined, // honeypot
        page: location.pathname,
        referrer: document.referrer ? document.referrer.slice(0, 500) : undefined,
      };
      ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid'].forEach((k) => { const v = store.get(k); if (v) data[k] = v; });

      const btn = $('button[type="submit"]', form);
      const label = btn.textContent;
      btn.disabled = true; btn.textContent = 'Submitting…';
      try {
        await sendLead(data);
        store.set('leadSubmitted', '1', localStorage);
        window.dataLayer && window.dataLayer.push({ event: 'lead_submit', form_type: kind, project: data.project });
        const slug = projectOpt && projectOpt.dataset.slug;
        const first = data.name.split(' ')[0];
        const success = {
          'site-visit': ['Your visit is requested!', `Thank you, ${first}. Our team will call you shortly to confirm your visit on ${data.visit_date} (${data.visit_time}).`],
          brochure: ['Your brochure is ready', `Thank you, ${first}. ${slug ? 'The brochure is opening in a new tab.' : 'Our advisor will share the brochure on WhatsApp shortly.'}`],
        }[kind] || ['Thank you!', `Thank you, ${first}. A property advisor will call you within 30 minutes (9:30 AM – 7:30 PM).`];
        form.innerHTML = `<div class="form-success" role="status"><svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg><h3>${success[0]}</h3><p>${success[1]}</p>${slug && kind === 'brochure' ? `<a class="btn btn--gold" href="/projects/${slug}/brochure/" target="_blank" rel="noopener">Open brochure</a>` : `<a class="btn btn--outline" href="https://wa.me/${SITE.whatsapp}" target="_blank" rel="noopener">Chat on WhatsApp</a>`}</div>`;
        if (kind === 'brochure' && slug) window.open(`/projects/${slug}/brochure/`, '_blank', 'noopener');
      } catch (err) {
        btn.disabled = false; btn.textContent = label;
        // Server-side validation error on a specific field → show it next to that field.
        const fieldMap = { country_code: 'phone', visit_date: 'visit_date', visit_time: 'visit_time' };
        const input = err.field && form.elements[fieldMap[err.field] || err.field];
        if (input && input.closest && input.closest('.field')) { setError(input, err.message); input.focus(); }
        else { msg.textContent = err.message || 'Something went wrong. Please try again or call us directly.'; msg.classList.add('is-error'); }
      }
    });
  });

  /* ---------- EMI calculator ---------- */
  const inr = (n) => '₹' + Math.round(n).toLocaleString('en-IN');
  const inrShort = (n) => (n >= 1e7 ? `₹${(n / 1e7).toFixed(2)} Cr` : `₹${(n / 1e5).toFixed(1)} L`);
  $$('[data-emi]').forEach((w) => {
    const inp = (k) => $(`[data-in="${k}"]`, w), out = (k) => $(`[data-out="${k}"]`, w);
    const fill = (el) => el.style.setProperty('--p', `${((el.value - el.min) / (el.max - el.min)) * 100}%`);
    const calc = () => {
      const P = +inp('amount').value, R = +inp('rate').value / 1200, N = +inp('tenure').value * 12;
      const emi = R ? (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1) : P / N;
      const total = emi * N, interest = total - P;
      out('amount').textContent = inrShort(P);
      out('rate').textContent = `${(+inp('rate').value).toFixed(2)}%`;
      out('tenure').textContent = `${inp('tenure').value} yrs`;
      out('emi').textContent = inr(emi);
      out('principal').textContent = inrShort(P);
      out('interest').textContent = inrShort(interest);
      out('total').textContent = inrShort(total);
      $('[data-bar="principal"]', w).style.width = `${(P / total) * 100}%`;
      $$('input[type="range"]', w).forEach(fill);
    };
    $$('input', w).forEach((i) => i.addEventListener('input', calc));
    calc();
  });

  /* ---------- Project filters ---------- */
  const filters = $('[data-filters]');
  if (filters) {
    const cards = $$('[data-project-grid] .project-card');
    const label = $('[data-count-label]'), empty = $('[data-empty]');
    const sels = $$('[data-filter]', filters);
    const qs = new URLSearchParams(location.search);
    sels.forEach((s) => { const v = qs.get(s.name); if (v && [...s.options].some((o) => o.value === v)) s.value = v; });
    const apply = () => {
      const f = Object.fromEntries(sels.map((s) => [s.name, s.value]));
      let shown = 0;
      cards.forEach((c) => {
        const d = c.dataset;
        const [lo, hi] = f.budget ? f.budget.split('-').map(Number) : [0, Infinity];
        const ok = (!f.city || d.city === f.city) && (!f.location || d.location === f.location) && (!f.type || d.type === f.type)
          && (!f.status || d.status === f.status) && (+d.price >= lo && +d.price < hi)
          && (!f.bhk || d.bhk.split(',').includes(f.bhk));
        c.classList.toggle('is-hidden', !ok);
        if (ok) { shown++; c.classList.add('is-visible'); }
      });
      label.textContent = `${shown} project${shown === 1 ? '' : 's'}${shown < cards.length ? ' match your filters' : ''}`;
      empty.hidden = shown > 0;
      const p = new URLSearchParams();
      Object.entries(f).forEach(([k, v]) => v && p.set(k, v));
      history.replaceState(null, '', p.toString() ? `?${p}` : location.pathname);
    };
    sels.forEach((s) => s.addEventListener('change', apply));
    filters.addEventListener('reset', () => setTimeout(apply));
    apply();
  }

  /* ---------- Project page: sub-nav highlight & sticky enquire ---------- */
  const subnav = $('[data-subnav]');
  if (subnav && 'IntersectionObserver' in window) {
    const links = $$('a', subnav);
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        links.forEach((l) => l.classList.toggle('is-active', l.getAttribute('href') === `#${en.target.id}`));
        const active = links.find((l) => l.classList.contains('is-active'));
        const ul = $('ul', subnav);
        if (active) ul.scrollTo({ left: active.offsetLeft - ul.clientWidth / 2 + active.clientWidth / 2, behavior: 'smooth' });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    links.forEach((l) => { const s = document.getElementById(l.getAttribute('href').slice(1)); s && io.observe(s); });
  }
  const sticky = $('[data-sticky-enquire]');
  const pHero = $('.project-hero');
  if (sticky && pHero && 'IntersectionObserver' in window) {
    new IntersectionObserver(([en]) => sticky.classList.toggle('is-visible', !en.isIntersecting), { threshold: 0.1 }).observe(pHero);
  }
})();
