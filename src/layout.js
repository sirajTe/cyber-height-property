const projects = require('../data/projects');
const { site, esc, icon, absUrl } = require('./util');

const FONTS = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Inter:wght@400;500;600&display=swap';

const NAV = [
  { href: '/projects/', label: 'Projects' },
  { href: '/about/', label: 'About' },
  { href: '/nri-corner/', label: 'NRI Corner' },
  { href: '/emi-calculator/', label: 'EMI Calculator' },
  { href: '/blog/', label: 'News & Blog' },
  { href: '/contact/', label: 'Contact' },
];

const orgSchema = {
  '@type': 'RealEstateAgent',
  '@id': `${site.url}/#org`,
  name: site.name,
  legalName: site.legalName,
  url: site.url + '/',
  logo: `${site.url}/assets/img/brand/logo-stacked.svg`,
  telephone: site.phoneRaw,
  email: site.email,
  foundingDate: String(site.founded),
  address: {
    '@type': 'PostalAddress',
    streetAddress: site.offices[0].address,
    addressLocality: 'Gurugram',
    addressRegion: 'Haryana',
    ...(/\b\d{6}\b/.test(site.offices[0].address) ? { postalCode: site.offices[0].address.match(/\b\d{6}\b/)[0] } : {}),
    addressCountry: 'IN',
  },
  sameAs: Object.values(site.social),
};

// Brand mark (assets/img/brand/logo-mark.svg), inlined with the letter in currentColor so it adapts to light/dark.
const MARK = require('fs')
  .readFileSync(require('path').join(__dirname, '../assets/img/brand/logo-mark.svg'), 'utf8')
  .replace(/^<svg[^>]*>|<\/svg>\s*$/g, '')
  .replace(/#0b1f3a/g, 'currentColor');

const logo = (light) => `
<a href="/" class="logo${light ? ' logo--light' : ''}${site.logoTop.length > 8 ? ' logo--long' : ''}">
  <svg class="logo-mark" width="44" height="44" viewBox="0 0 64 64" aria-hidden="true">${MARK}</svg>
  <span><strong>${esc(site.logoTop)}</strong><small>${esc(site.logoBottom)}</small></span>
</a>`;

const projectOptions = (selected = '') =>
  `<option value="">Select a project</option>` +
  projects.map((p) => `<option value="${esc(p.name)}" data-slug="${p.slug}"${p.slug === selected ? ' selected' : ''}>${esc(p.name)} — ${esc(p.location)}</option>`).join('') +
  `<option value="Not sure yet">Not sure yet / Help me choose</option>`;

let formSeq = 0;
// Reusable lead form. kind: enquiry | site-visit | brochure | callback
function leadForm({ kind = 'enquiry', project = '', submit = 'Submit Enquiry', compact = false, dark = false } = {}) {
  const n = ++formSeq;
  const f = (k) => `${kind}-${k}-${n}`;
  const today = new Date().toISOString().slice(0, 10);
  return `
<form class="lead-form${compact ? ' lead-form--compact' : ''}${dark ? ' lead-form--dark' : ''}" data-lead-form="${kind}" novalidate>
  <div class="field">
    <label for="${f('name')}">Full name</label>
    <input id="${f('name')}" name="name" type="text" autocomplete="name" required minlength="2" placeholder="Your name">
  </div>
  <div class="field">
    <label for="${f('phone')}">Mobile number</label>
    <div class="phone-input">
      <select name="country_code" aria-label="Country code">
        <option value="+91" selected>🇮🇳 +91</option><option value="+971">🇦🇪 +971</option><option value="+1">🇺🇸 +1</option>
        <option value="+44">🇬🇧 +44</option><option value="+65">🇸🇬 +65</option><option value="+61">🇦🇺 +61</option>
        <option value="+966">🇸🇦 +966</option><option value="+974">🇶🇦 +974</option>
      </select>
      <input id="${f('phone')}" name="phone" type="tel" inputmode="numeric" autocomplete="tel-national" required placeholder="98XXXXXXXX" maxlength="12">
    </div>
  </div>
  <div class="field">
    <label for="${f('email')}">Email</label>
    <input id="${f('email')}" name="email" type="email" autocomplete="email" required placeholder="you@example.com">
  </div>
  <div class="field">
    <label for="${f('project')}">Project of interest</label>
    <select id="${f('project')}" name="project" required>${projectOptions(project)}</select>
  </div>
  ${
    kind === 'site-visit'
      ? `<div class="field-row">
    <div class="field"><label for="${f('date')}">Preferred date</label><input id="${f('date')}" name="visit_date" type="date" min="${today}" required data-min-today></div>
    <div class="field"><label for="${f('time')}">Time slot</label>
      <select id="${f('time')}" name="visit_time" required>
        <option value="">Select</option><option>10:00 AM – 12:00 PM</option><option>12:00 PM – 2:00 PM</option>
        <option>2:00 PM – 4:00 PM</option><option>4:00 PM – 6:00 PM</option><option>Virtual tour (video call)</option>
      </select></div>
  </div>`
      : ''
  }
  <div class="hp-field" aria-hidden="true"><label>Website <input type="text" name="website" tabindex="-1" autocomplete="off"></label></div>
  <label class="consent"><input type="checkbox" name="consent" required checked> <span>I authorise ${esc(site.name)} to contact me via call, SMS, email or WhatsApp. This overrides DNC/NDNC registration.</span></label>
  <button type="submit" class="btn btn--gold btn--block">${esc(submit)}</button>
  <p class="form-msg" role="status" aria-live="polite"></p>
</form>`;
}

function header(overlay) {
  return `
<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header${overlay ? ' site-header--overlay' : ''}" data-header>
  <div class="container header-inner">
    ${logo()}
    <nav class="main-nav" aria-label="Main" id="main-nav">
      <ul>
        ${NAV.map((l) => `<li><a href="${l.href}">${l.label}</a></li>`).join('')}
      </ul>
      <div class="nav-mobile-cta">
        <a class="btn btn--gold btn--block" href="#" data-open="site-visit-modal">Book a Site Visit</a>
        <a class="btn btn--outline-light btn--block" href="tel:${site.phoneRaw}">${icon('phone', 18)} ${site.phone}</a>
      </div>
    </nav>
    <div class="header-actions">
      <a class="header-phone" href="tel:${site.phoneRaw}">${icon('phone', 18)}<span>${site.phone}</span></a>
      <button class="btn btn--gold btn--sm header-cta" data-open="site-visit-modal">Book a Site Visit</button>
      <button class="nav-toggle" aria-label="Open menu" aria-expanded="false" aria-controls="main-nav" data-nav-toggle>${icon('menu', 26)}</button>
    </div>
  </div>
</header>`;
}

function footer() {
  const year = new Date().getFullYear();
  return `
<footer class="site-footer">
  <div class="container footer-grid">
    <div class="footer-brand">
      ${logo(true)}
      <p>${esc(site.tagline)} Building trusted homes and landmarks across Gurgaon and NCR since ${site.founded}.</p>
      <div class="social">
        ${Object.entries(site.social).map(([k, v]) => `<a href="${v}" aria-label="${k}" rel="noopener" target="_blank">${icon(k, 20)}</a>`).join('')}
      </div>
    </div>
    <div>
      <h3>Projects</h3>
      <ul>${projects.map((p) => `<li><a href="/projects/${p.slug}/">${esc(p.name)}</a></li>`).join('')}</ul>
    </div>
    <div>
      <h3>Company</h3>
      <ul>
        <li><a href="/about/">About Us</a></li><li><a href="/careers/">Careers</a></li><li><a href="/blog/">News &amp; Blog</a></li>
        <li><a href="/nri-corner/">NRI Corner</a></li><li><a href="/emi-calculator/">EMI Calculator</a></li><li><a href="/contact/">Contact</a></li>
      </ul>
    </div>
    <div>
      <h3>Get in touch</h3>
      <ul class="footer-contact">
        <li>${icon('map-pin', 18)}<span>${esc(site.offices[0].address)}</span></li>
        <li>${icon('phone', 18)}<a href="tel:${site.phoneRaw}">${site.phone}</a></li>
        <li>${icon('mail', 18)}<a href="mailto:${site.email}">${site.email}</a></li>
      </ul>
    </div>
  </div>
  <div class="container footer-legal">
    <p class="rera-note">All projects are registered under RERA. Registration numbers are listed on each project page and on our <a href="/rera-disclosures/">RERA disclosures</a> page; details are available at <a href="https://haryanarera.gov.in" rel="noopener" target="_blank">haryanarera.gov.in</a> and <a href="https://up-rera.in" rel="noopener" target="_blank">up-rera.in</a>.</p>
    <div class="footer-bottom">
      <p>© ${year} ${esc(site.legalName)} All rights reserved.</p>
      <ul><li><a href="/privacy-policy/">Privacy Policy</a></li><li><a href="/disclaimer/">Disclaimer</a></li><li><a href="/rera-disclosures/">RERA Disclosures</a></li><li><a href="/sitemap.xml">Sitemap</a></li></ul>
    </div>
  </div>
</footer>`;
}

function floating(projectName) {
  const msg = encodeURIComponent(`Hi ${site.name}, I'm interested in ${projectName || 'your projects'}. Please share details.`);
  return `
<div class="floating-actions" aria-label="Quick contact">
  <a class="fab fab--wa" href="https://wa.me/${site.whatsapp}?text=${msg}" target="_blank" rel="noopener" aria-label="Chat on WhatsApp" data-track="whatsapp">${icon('whatsapp', 28)}</a>
  <a class="fab fab--call" href="tel:${site.phoneRaw}" aria-label="Call ${site.phone}" data-track="call">${icon('phone', 24)}</a>
</div>`;
}

function modal(id, title, sub, body, extraCls = '') {
  return `
<dialog class="modal ${extraCls}" id="${id}" aria-labelledby="${id}-title">
  <div class="modal-inner">
    <button class="modal-close" data-close aria-label="Close">${icon('x', 22)}</button>
    <p class="eyebrow">${esc(site.name)}</p>
    <h2 id="${id}-title">${title}</h2>
    ${sub ? `<p class="modal-sub">${sub}</p>` : ''}
    ${body}
  </div>
</dialog>`;
}

function modals(projectSlug) {
  return [
    modal('enquiry-modal', 'Get exclusive offers', 'Share your details and our property advisor will call you back within 30 minutes.',
      leadForm({ kind: 'enquiry', project: projectSlug, submit: 'Request a Callback' }), 'modal--popup'),
    modal('site-visit-modal', 'Schedule a site visit', 'Free pick-up &amp; drop available for site visits in Gurgaon &amp; Noida.',
      leadForm({ kind: 'site-visit', project: projectSlug, submit: 'Confirm Site Visit' })),
    modal('brochure-modal', 'Download brochure', 'Enter your details to get the brochure, price sheet and floor plans.',
      leadForm({ kind: 'brochure', project: projectSlug, submit: 'Download Brochure' })),
  ].join('');
}

/**
 * Wraps page content in the full HTML document.
 * page: { path, title, description, body, schema?: [], image?, overlay?, projectSlug?, projectName?, noindex? }
 */
function layout(page) {
  const canonical = absUrl(page.path);
  const image = page.image || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&h=630&q=70';
  const graph = [orgSchema, ...(page.schema || [])];
  const fullTitle = page.path === '/' ? page.title : `${page.title} | ${site.name}`;
  return `<!doctype html>
<html lang="en-IN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<script>document.documentElement.classList.add('js')</script>
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(page.description)}">
<link rel="canonical" href="${canonical}">
${page.noindex ? '<meta name="robots" content="noindex, follow">' : ''}
<meta name="theme-color" content="#0b1f3a">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(site.name)}">
<meta property="og:title" content="${esc(fullTitle)}">
<meta property="og:description" content="${esc(page.description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${esc(image)}">
<meta property="og:locale" content="en_IN">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/assets/img/logo.svg" type="image/svg+xml">
<link rel="preconnect" href="https://images.unsplash.com" crossorigin>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="style" href="${FONTS}" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="${FONTS}"></noscript>
<link rel="stylesheet" href="/assets/css/main.css?v=${page.version}">
${page.preload || ''}
<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph })}</script>
</head>
<body class="${page.bodyClass || ''}">
${header(page.overlay)}
<main id="main">
${page.body}
</main>
${footer()}
${floating(page.projectName)}
${modals(page.projectSlug)}
<script>window.SITE=${JSON.stringify({ name: site.name, leadEndpoint: site.leadEndpoint, popupDelay: site.popupDelay, whatsapp: site.whatsapp })}</script>
<script src="/assets/js/main.js?v=${page.version}" defer></script>
</body>
</html>`;
}

// Shared page section helpers
const pageHero = (title, sub, image, crumbs = []) => `
<section class="page-hero">
  <div class="page-hero-bg">${require('./util').img(image, '', { w: 1600, sizes: '100vw', eager: true })}</div>
  <div class="container page-hero-content">
    ${breadcrumbs(crumbs)}
    <h1>${title}</h1>
    ${sub ? `<p>${sub}</p>` : ''}
  </div>
</section>`;

function breadcrumbs(crumbs) {
  if (!crumbs.length) return '';
  const all = [{ name: 'Home', path: '/' }, ...crumbs];
  return `<nav class="breadcrumbs" aria-label="Breadcrumb"><ol>${all
    .map((c, i) => (i === all.length - 1 ? `<li aria-current="page">${esc(c.name)}</li>` : `<li><a href="${c.path}">${esc(c.name)}</a></li>`))
    .join('')}</ol></nav>`;
}

const breadcrumbSchema = (crumbs) => ({
  '@type': 'BreadcrumbList',
  itemListElement: [{ name: 'Home', path: '/' }, ...crumbs].map((c, i) => ({
    '@type': 'ListItem', position: i + 1, name: c.name, item: absUrl(c.path),
  })),
});

module.exports = { layout, leadForm, pageHero, breadcrumbs, breadcrumbSchema, orgSchema };
