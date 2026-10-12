// Reusable project page template — rendered once per entry in data/projects.js.
const { site, esc, img, src, price, icon, absUrl, statusClass, AMENITY_LABELS } = require('../util');
const { breadcrumbs, breadcrumbSchema } = require('../layout');
const { sectionHead, enquirySection, emiCalculator, floorPlanSvg, configLabel } = require('../components');

const SUBNAV = [
  ['overview', 'Overview'], ['gallery', 'Gallery'], ['floor-plans', 'Floor Plans'], ['amenities', 'Amenities'],
  ['location', 'Location'], ['price-list', 'Price List'], ['progress', 'Construction'],
];

module.exports = function projectPage(p) {
  const path = `/projects/${p.slug}/`;
  const crumbs = [{ name: 'Projects', path: '/projects/' }, { name: p.name, path }];
  const maxPrice = Math.max(...p.floorPlans.map((f) => f.price));
  const unitWord = p.type === 'Residential' ? 'Residences' : p.type === 'Plots' ? 'Plots' : 'Units';

  const facts = [
    ['Configuration', configLabel(p)],
    ['Land area', p.landArea],
    ['Towers', p.towers],
    [unitWord, p.units],
    ['Possession', p.possession],
  ];

  const body = `
<section class="project-hero">
  <div class="project-hero-bg">${img(p.hero, `${p.name} — exterior view`, { w: 1600, sizes: '100vw', eager: true })}</div>
  <div class="container project-hero-content">
    ${breadcrumbs(crumbs)}
    <span class="tag tag--${statusClass(p.status)}">${esc(p.status)}</span>
    <h1>${esc(p.name)}</h1>
    <p class="project-hero-tagline">${esc(p.tagline)}</p>
    <p class="project-hero-loc">${icon('map-pin', 18)} ${esc(p.sector)}, ${esc(p.location)}, ${esc(p.city)}</p>
    <div class="project-hero-bar">
      <div><small>${esc(configLabel(p))}</small><strong>${price(p.priceFrom)}<sup>*</sup> <em>onwards</em></strong></div>
      <div class="project-hero-rera"><small>RERA No.</small><span>${esc(p.rera)}</span></div>
      <div class="project-hero-ctas">
        <button class="btn btn--gold" data-open="enquiry-modal">Enquire Now</button>
        <button class="btn btn--outline-light" data-open="brochure-modal">${icon('download', 18)} Brochure</button>
      </div>
    </div>
  </div>
</section>

<nav class="subnav" aria-label="Project sections" data-subnav>
  <div class="container subnav-inner">
    <ul>${SUBNAV.map(([id, l]) => `<li><a href="#${id}">${l}</a></li>`).join('')}</ul>
    <button class="btn btn--gold btn--sm" data-open="site-visit-modal">Book a Site Visit</button>
  </div>
</nav>

<section class="section" id="overview">
  <div class="container overview-grid">
    <div class="reveal">
      <p class="eyebrow">Overview</p>
      <h2>${esc(p.tagline)}</h2>
      <p class="lead">${esc(p.overview)}</p>
      <dl class="facts">${facts.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
    </div>
    <div class="highlights reveal">
      <h3>Project highlights</h3>
      <ul class="check-list">${p.highlights.map((h) => `<li>${icon('check', 18)} ${esc(h)}</li>`).join('')}</ul>
      <button class="btn btn--navy btn--block" data-open="brochure-modal">${icon('download', 18)} Download Brochure</button>
    </div>
  </div>
</section>

<section class="section section--cream" id="gallery">
  <div class="container">
    ${sectionHead('Gallery', 'A closer look', '')}
    <div class="gallery" data-gallery>
      ${p.gallery.map((g, i) => `
      <a href="${src(g, 1800)}" class="gallery-item${i === 0 ? ' gallery-item--wide' : ''}" data-lightbox aria-label="Open image ${i + 1} of ${p.gallery.length}">
        ${img(g, `${p.name} — gallery image ${i + 1}`, { w: i === 0 ? 1200 : 640, ratio: i === 0 ? 16 / 10 : 4 / 3, sizes: i === 0 ? '(min-width: 900px) 66vw, 100vw' : '(min-width: 900px) 33vw, 50vw' })}
      </a>`).join('')}
    </div>
    <div class="video-block reveal" id="walkthrough">
      ${p.video
        ? `<button class="lite-yt" data-yt="${esc(p.video)}" aria-label="Play ${esc(p.name)} video walkthrough">
            ${img(`https://i.ytimg.com/vi/${p.video}/hqdefault.jpg`, '', { w: 1200 })}<span class="play">${icon('play', 34)}</span></button>`
        : `<div class="video-poster">
            ${img(p.gallery[1] || p.hero, `${p.name} walkthrough preview`, { w: 1400, ratio: 16 / 9, sizes: '(min-width: 1200px) 1140px, 100vw' })}
            <div class="video-poster-copy"><span class="play">${icon('play', 34)}</span><h3>Video walkthrough</h3><p>Prefer a live video tour of the site or sample flat? We'll set one up on WhatsApp.</p>
            <a class="btn btn--gold" target="_blank" rel="noopener" href="https://wa.me/${site.whatsapp}?text=${encodeURIComponent(`Hi, I'd like a live video tour of ${p.name}.`)}">${icon('whatsapp', 18)} Request a live video tour</a></div>
          </div>`}
    </div>
  </div>
</section>

<section class="section" id="floor-plans">
  <div class="container">
    ${sectionHead('Floor plans', 'Choose your layout', 'Indicative layouts. Request the detailed, dimensioned plans with the brochure.')}
    <div class="tabs" data-tabs>
      <div class="tab-list" role="tablist" aria-label="Configurations">
        ${p.floorPlans.map((f, i) => `<button role="tab" id="fp-tab-${i}" aria-controls="fp-panel-${i}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${esc(f.config)}</button>`).join('')}
      </div>
      ${p.floorPlans.map((f, i) => `
      <div class="tab-panel fp-panel" role="tabpanel" id="fp-panel-${i}" aria-labelledby="fp-tab-${i}"${i === 0 ? '' : ' hidden'}>
        <div class="fp-plan">${floorPlanSvg(f, p)}</div>
        <div class="fp-info">
          <h3>${esc(f.config)}</h3>
          <dl class="facts facts--stack">
            <div><dt>${p.type === 'Plots' ? 'Plot area' : 'Carpet area'}</dt><dd>${f.carpet.toLocaleString('en-IN')} sq ft</dd></div>
            ${p.type === 'Plots' ? '' : `<div><dt>Super area</dt><dd>${f.superArea.toLocaleString('en-IN')} sq ft</dd></div>`}
            <div><dt>Starting price</dt><dd class="price-strong">${price(f.price)}<sup>*</sup></dd></div>
          </dl>
          <button class="btn btn--gold btn--block" data-open="brochure-modal">Get detailed floor plan</button>
          <button class="btn btn--outline btn--block" data-open="site-visit-modal">Visit the sample flat</button>
        </div>
      </div>`).join('')}
    </div>
  </div>
</section>

<section class="section section--navy" id="amenities">
  <div class="container">
    ${sectionHead('Amenities', 'Everything you need, within the gates', '')}
    <ul class="amenities">
      ${p.amenities.map((a) => `<li class="reveal">${icon(a, 32)}<span>${AMENITY_LABELS[a] || a}</span></li>`).join('')}
    </ul>
  </div>
</section>

<section class="section" id="location">
  <div class="container location-grid">
    <div class="reveal">
      <p class="eyebrow">Location advantage</p>
      <h2>${esc(p.location)}, ${esc(p.city)}</h2>
      <p class="muted">${esc(p.address)}</p>
      <ul class="landmarks">
        ${p.landmarks.map((l) => `<li>${icon(l.icon, 20)}<span>${esc(l.name)}</span><strong>${esc(l.dist)}</strong></li>`).join('')}
      </ul>
      <a class="link-arrow" target="_blank" rel="noopener" href="https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}">Get directions ${icon('arrow-right', 16)}</a>
    </div>
    <div class="map-embed reveal" data-map="https://maps.google.com/maps?q=${p.lat},${p.lng}&z=14&output=embed" data-title="Map showing ${esc(p.name)}">
      <button class="map-placeholder" type="button">${icon('map-pin', 32)}<span>Load interactive map</span></button>
    </div>
  </div>
</section>

<section class="section section--cream" id="price-list">
  <div class="container">
    ${sectionHead('Price list', 'Transparent, all-inclusive pricing', 'Prices are indicative and exclude stamp duty, registration and GST. Request the complete cost sheet.')}
    <div class="table-wrap reveal">
      <table class="price-table">
        <caption class="sr-only">${esc(p.name)} price list</caption>
        <thead><tr><th scope="col">Type</th><th scope="col">${p.type === 'Plots' ? 'Plot area' : 'Carpet area'}</th>${p.type === 'Plots' ? '' : '<th scope="col">Super area</th>'}<th scope="col">Price (₹)</th><th scope="col"><span class="sr-only">Action</span></th></tr></thead>
        <tbody>
          ${p.floorPlans.map((f) => `<tr>
            <th scope="row">${esc(f.config)}</th>
            <td>${f.carpet.toLocaleString('en-IN')} sq ft</td>
            ${p.type === 'Plots' ? '' : `<td>${f.superArea.toLocaleString('en-IN')} sq ft</td>`}
            <td class="price-strong">${price(f.price)}<sup>*</sup> onwards</td>
            <td><button class="btn btn--sm btn--outline" data-open="brochure-modal">Cost sheet</button></td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
    <p class="fine center">*Prices subject to change without notice. Payment plans: construction-linked and flexi plans available.</p>
  </div>
</section>

<section class="section">
  <div class="container">
    ${sectionHead('EMI calculator', 'Plan your investment', '')}
    ${emiCalculator({ amount: Math.round(p.priceFrom * 100000 * 0.8 / 500000) * 500000 })}
  </div>
</section>

<section class="section section--cream" id="progress">
  <div class="container">
    ${sectionHead('Construction progress', 'Watch it rise', `Updated quarterly, in line with our filings on the ${p.city === 'Noida' ? 'UP-RERA' : 'HARERA'} portal.`)}
    <ol class="progress-list">
      ${p.progress.map((u) => `
      <li class="progress-item reveal">
        <div class="progress-media">${img(u.image, `${p.name} — construction update ${u.date}`, { w: 640, ratio: 4 / 3, sizes: '(min-width: 900px) 30vw, 100vw' })}</div>
        <div class="progress-body">
          <time>${esc(u.date)}</time>
          <h3>${esc(u.title)}</h3>
          <div class="meter" role="progressbar" aria-valuenow="${u.percent}" aria-valuemin="0" aria-valuemax="100" aria-label="Overall completion"><span style="--w:${u.percent}%"></span></div>
          <small>${u.percent}% overall completion</small>
        </div>
      </li>`).join('')}
    </ol>
  </div>
</section>

${enquirySection({ project: p.slug, title: `Interested in ${esc(p.name)}?`, sub: `Get the latest price sheet, availability and offers for ${esc(p.name)} — our advisor will call you within 30 minutes.` })}

<div class="sticky-enquire" data-sticky-enquire>
  <div class="sticky-enquire-info"><strong>${esc(p.name)}</strong><span>${price(p.priceFrom)}* onwards</span></div>
  <button class="btn btn--outline-light btn--sm" data-open="brochure-modal" aria-label="Download brochure">${icon('download', 16)}<span>Brochure</span></button>
  <button class="btn btn--gold btn--sm" data-open="enquiry-modal">Enquire Now</button>
</div>
<p class="container fine rera-strip">RERA Registration No. ${esc(p.rera)} · Available at ${p.city === 'Noida' ? 'up-rera.in' : 'haryanarera.gov.in'} · *Terms &amp; conditions apply. Images are artistic impressions.</p>
`;

  const placeType = p.type === 'Residential' ? 'ApartmentComplex' : 'Place';
  const schema = [
    breadcrumbSchema(crumbs),
    {
      '@type': placeType,
      '@id': absUrl(path) + '#place',
      name: p.name,
      description: p.overview,
      url: absUrl(path),
      image: [src(p.hero, 1200), ...p.gallery.slice(0, 3).map((g) => src(g, 1200))],
      address: { '@type': 'PostalAddress', streetAddress: p.address, addressLocality: p.city === 'Noida' ? 'Noida' : 'Gurugram', addressRegion: p.city === 'Noida' ? 'Uttar Pradesh' : 'Haryana', addressCountry: 'IN' },
      geo: { '@type': 'GeoCoordinates', latitude: p.lat, longitude: p.lng },
      amenityFeature: p.amenities.map((a) => ({ '@type': 'LocationFeatureSpecification', name: AMENITY_LABELS[a] || a, value: true })),
      ...(placeType === 'ApartmentComplex' ? { numberOfAccommodationUnits: parseInt(p.units.replace(/\D/g, ''), 10) || undefined, petsAllowed: true } : {}),
    },
    {
      '@type': 'Product',
      name: `${p.name} — ${configLabel(p)}`,
      description: `${configLabel(p)} ${p.type.toLowerCase()} ${p.type === 'Plots' ? '' : 'properties '}at ${p.sector}, ${p.location}, ${p.city}. RERA: ${p.rera}.`,
      image: src(p.hero, 1200),
      brand: { '@id': `${site.url}/#org` },
      category: `Real Estate / ${p.type}`,
      offers: {
        '@type': 'AggregateOffer',
        priceCurrency: 'INR',
        lowPrice: p.priceFrom * 100000,
        highPrice: maxPrice * 100000,
        offerCount: p.floorPlans.length,
        availability: p.status === 'Ready to Move' ? 'https://schema.org/InStock' : 'https://schema.org/PreOrder',
        seller: { '@id': `${site.url}/#org` },
      },
    },
  ];

  return {
    path,
    title: `${p.name} — ${configLabel(p)} in ${p.location}, ${p.city} | Price from ${price(p.priceFrom)}`,
    description: `${p.name}: ${configLabel(p)} ${p.type.toLowerCase()} at ${p.sector}, ${p.location}, ${p.city}. Starting ${price(p.priceFrom)}*. ${p.status}. RERA ${p.rera}. View floor plans, price list & amenities.`,
    image: src(p.hero, 1200, 630),
    overlay: true,
    bodyClass: 'page-project',
    projectSlug: p.slug,
    projectName: p.name,
    preload: `<link rel="preload" as="image" href="${src(p.hero, 1600)}" imagesrcset="${[800, 1200, 1600, 2000].map((w) => `${src(p.hero, w)} ${w}w`).join(', ')}" imagesizes="100vw" fetchpriority="high">`,
    schema,
    body,
  };
};

// Printable brochure shown after the brochure form is submitted. Replace with a real PDF by setting p.brochure.
module.exports.brochure = function brochurePage(p) {
  return `<!doctype html><html lang="en-IN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(p.name)} — Brochure | ${esc(site.name)}</title><meta name="robots" content="noindex">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600&family=Inter:wght@400;600&display=swap">
<link rel="stylesheet" href="/assets/css/brochure.css">
</head><body>
<div class="toolbar"><a href="/projects/${p.slug}/">← Back to project</a><button onclick="print()">Save as PDF / Print</button></div>
<section class="cover" style="background-image:url('${src(p.hero, 1600)}')"><div><img class="cover-logo" src="/assets/img/brand/logo-horizontal-light.svg" alt="${esc(site.name)}" width="260" height="62"><h1>${esc(p.name)}</h1><h2>${esc(p.tagline)}</h2><p>${esc(p.address)}</p></div></section>
<section class="page"><h3>Overview</h3><p>${esc(p.overview)}</p>
<ul>${p.highlights.map((h) => `<li>${esc(h)}</li>`).join('')}</ul>
<table><tr><th>Configuration</th><td>${esc(configLabel(p))}</td></tr><tr><th>Land area</th><td>${esc(p.landArea)}</td></tr><tr><th>Towers</th><td>${esc(p.towers)}</td></tr><tr><th>Possession</th><td>${esc(p.possession)}</td></tr><tr><th>RERA</th><td>${esc(p.rera)}</td></tr></table></section>
<section class="page"><h3>Floor plans &amp; pricing</h3>${p.floorPlans.map((f) => `<div class="fp">${floorPlanSvg(f, p)}<p><strong>${esc(f.config)}</strong> · ${f.carpet.toLocaleString('en-IN')} sq ft ${p.type === 'Plots' ? '' : `carpet · ${f.superArea.toLocaleString('en-IN')} sq ft super`} · ${price(f.price)}* onwards</p></div>`).join('')}</section>
<section class="page"><h3>Amenities</h3><p>${p.amenities.map((a) => AMENITY_LABELS[a] || a).join(' · ')}</p><h3>Location</h3><ul>${p.landmarks.map((l) => `<li>${esc(l.name)} — ${esc(l.dist)}</li>`).join('')}</ul>
<div class="gallery">${p.gallery.slice(0, 4).map((g) => `<img src="${src(g, 600, 400)}" alt="">`).join('')}</div>
<p class="contact">${esc(site.phone)} · ${esc(site.email)} · ${esc(site.url.replace(/^https?:\/\//, ''))}</p>
<p class="fine">*Prices are indicative and exclude statutory charges. Images are artistic impressions. RERA No. ${esc(p.rera)}.</p></section>
</body></html>`;
};
