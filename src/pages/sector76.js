// Sector 76 locality hub, society pages and the /rent/ & /buy/ listing pages.
const { locality, societies } = require('../../data/sector76');
const listings = require('../../data/listings');
const { site, esc, img, src, price, icon, absUrl, statusClass, AMENITY_LABELS } = require('../util');
const { pageHero, breadcrumbSchema } = require('../layout');
const { sectionHead, enquirySection } = require('../components');

const HUB = '/sector-76/';
const bySlug = Object.fromEntries(societies.map((s) => [s.slug, s]));
for (const l of listings) {
  if (!bySlug[l.society]) throw new Error(`Listing ${l.id}: unknown society "${l.society}"`);
}
const ids = new Set();
for (const l of listings) {
  if (ids.has(l.id)) throw new Error(`Duplicate listing id: ${l.id}`);
  ids.add(l.id);
}

const societyPath = (s) => `${HUB}${s.slug}/`;
const inr = (n) => `₹${n.toLocaleString('en-IN')}`;
const rentShort = (n) => (n >= 100000 ? `₹${(n / 100000).toFixed(2).replace(/\.?0+$/, '')} L` : `₹${Math.round(n / 1000)}K`);
const range = (r, fmt) => (r[0] === r[1] ? fmt(r[0]) : `${fmt(r[0])} – ${fmt(r[1])}`);
const forSociety = (s, purpose) => listings.filter((l) => l.society === s.slug && l.purpose === purpose);
const bhkLabel = (l) => `${l.bhk}${l.bhk >= 5 ? '+' : ''} BHK`;

// ── Cards ───────────────────────────────────────────────────────────────────
function listingCard(l, { showSociety = true } = {}) {
  const s = bySlug[l.society];
  const rent = l.purpose === 'rent';
  const intent = rent ? 'Rent' : 'Buy';
  const title = `${bhkLabel(l)} ${rent ? 'flat for rent' : 'flat for sale'}`;
  const wa = encodeURIComponent(`Hi ${site.name}, I'm interested in listing ${l.id} — ${bhkLabel(l)} in ${s.name}, Sector 76 (${rent ? `${inr(l.price)}/month` : price(l.price)}). Please share details.`);
  const meta = [l.facing && `${l.facing} facing`, rent && l.available && `Available: ${l.available}`, rent && l.tenants && `Preferred: ${l.tenants}`, !rent && l.sale]
    .filter(Boolean).map(esc).join(' · ');
  return `
<article class="listing-card reveal" data-society="${s.slug}" data-bhk="${l.bhk}" data-price="${l.price}" data-furnishing="${esc(l.furnishing)}"${l.sale ? ` data-sale="${esc(l.sale)}"` : ''}>
  <div class="listing-media">
    ${img(l.image, `${title} in ${s.name}`, { w: 640, ratio: 3 / 2, sizes: '(min-width: 1100px) 33vw, (min-width: 700px) 50vw, 100vw' })}
    <span class="tag tag--${l.purpose}">${rent ? 'For Rent' : 'For Sale'}</span>
    <span class="listing-id">ID ${esc(l.id)}</span>
  </div>
  <div class="listing-body">
    <p class="listing-price"><strong>${rent ? inr(l.price) : `${price(l.price)}`}</strong>${rent ? '<small>/ month</small>' : ''}</p>
    <h3>${title}</h3>
    ${showSociety ? `<p class="project-card-loc">${icon('map-pin', 15)} <span><a href="${societyPath(s)}">${esc(s.name)}</a>, Sector 76</span></p>` : ''}
    <ul class="listing-specs">
      <li>${icon('home', 16)} ${l.area.toLocaleString('en-IN')} sq ft <small>${esc(l.areaType)}</small></li>
      <li>${icon('key', 16)} ${l.bath} bath</li>
      <li>${icon('building', 16)} Floor ${esc(l.floor)}</li>
      <li>${icon('check', 16)} ${esc(l.furnishing)}</li>
    </ul>
    ${meta ? `<p class="listing-meta">${meta}</p>` : ''}
    <div class="listing-actions">
      <button class="btn btn--gold btn--sm" data-open="enquiry-modal" data-project="${esc(s.name)}" data-intent="${intent}" data-ref="${esc(l.id)}">Enquire</button>
      <a class="btn btn--outline btn--sm" href="https://wa.me/${site.whatsapp}?text=${wa}" target="_blank" rel="noopener" data-track="whatsapp">${icon('whatsapp', 16)} WhatsApp</a>
    </div>
  </div>
</article>`;
}

function societyCard(s) {
  const nRent = forSociety(s, 'rent').length, nBuy = forSociety(s, 'buy').length;
  const counts = [nRent && `${nRent} for rent`, nBuy && `${nBuy} for sale`].filter(Boolean).join(' · ') || 'Enquire for availability';
  return `
<article class="project-card society-card reveal">
  <a href="${societyPath(s)}" class="project-card-media" tabindex="-1" aria-hidden="true">
    ${img(s.hero, `${s.name}, Sector 76 Gurgaon`, { w: 800, ratio: 4 / 3, sizes: '(min-width: 1100px) 33vw, (min-width: 700px) 50vw, 100vw' })}
    <span class="tag tag--${statusClass(s.status)}">${esc(s.status)}</span>
  </a>
  <div class="project-card-body">
    <p class="project-card-loc">${icon('building', 15)} ${esc(s.developer)} · ${esc(s.category)}</p>
    <h3><a href="${societyPath(s)}">${esc(s.name)}</a></h3>
    <p class="project-card-config">${esc(s.configs.join(' · '))} · ${esc(s.sizes)}</p>
    <div class="society-card-prices">
      <div><small>Buy</small><strong>${price(s.buy[0])}+</strong></div>
      <div><small>Rent</small><strong>${s.rent ? `${rentShort(s.rent[0])}+<em>/mo</em>` : '—'}</strong></div>
    </div>
    <div class="project-card-foot">
      <span class="society-card-count">${counts}</span>
      <a href="${societyPath(s)}" class="link-arrow">View ${icon('arrow-right', 16)}</a>
    </div>
  </div>
</article>`;
}

const listingGrid = (items, opts) => `<div class="listing-grid" data-listing-grid>${items.map((l) => listingCard(l, opts)).join('')}</div>`;

const ownerCta = () => `
<section class="section section--navy owner-cta">
  <div class="container owner-cta-inner reveal">
    <div>
      <p class="eyebrow">For owners</p>
      <h2>Own a flat in Sector 76?</h2>
      <p>We rent out and sell homes in every society in the sector. We bring verified tenants and buyers, handle the rent agreement and paperwork, and you pay no brokerage until the deal closes.</p>
    </div>
    <div class="owner-cta-actions">
      <button class="btn btn--gold" data-open="enquiry-modal" data-intent="Rent out my property">${icon('key', 18)} Rent out my flat</button>
      <button class="btn btn--outline-light" data-open="enquiry-modal" data-intent="Sell my property">${icon('trending', 18)} Sell my flat</button>
    </div>
  </div>
</section>`;

const mapEmbed = (q, title) => `
<div class="map-embed reveal" data-map="https://maps.google.com/maps?q=${encodeURIComponent(q)}&z=15&output=embed" data-title="${esc(title)}">
  <button class="map-placeholder" type="button">${icon('map-pin', 32)}<span>Load interactive map</span></button>
</div>`;

const placeList = (title, ico, items) => `
<div class="place-list reveal"><h3>${icon(ico, 20)} ${title}</h3><ul>${items.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>`;

// ── /sector-76/ ─────────────────────────────────────────────────────────────
function hub() {
  const crumbs = [{ name: 'Sector 76, Gurgaon', path: HUB }];
  const nRent = listings.filter((l) => l.purpose === 'rent').length;
  const nBuy = listings.length - nRent;
  const body = `
${pageHero('Sector 76, Gurgaon', `Flats for rent and sale in all ${societies.length} societies of Sector 76, from local brokers based in the sector.`, 'photo-1486406146926-c627a92ad1ab', crumbs)}

<section class="section">
  <div class="container overview-grid">
    <div class="reveal">
      <p class="eyebrow">Locality guide</p>
      <h2>Living in Sector 76</h2>
      <p class="lead">${esc(locality.intro)}</p>
      <dl class="facts">${locality.keyFacts.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
    </div>
    <div class="highlights reveal">
      <h3>Looking for a home here?</h3>
      <ul class="check-list">
        <li>${icon('check', 18)} ${nRent} flats for rent and ${nBuy} for sale right now</li>
        <li>${icon('check', 18)} Office inside Suncity Avenue, Sector 76</li>
        <li>${icon('check', 18)} Same-day site visits across every society</li>
        <li>${icon('check', 18)} Rent agreements, police verification and home-loan help</li>
      </ul>
      <a class="btn btn--gold btn--block" href="/rent/">${icon('key', 18)} Flats for rent</a>
      <a class="btn btn--navy btn--block" href="/buy/">${icon('home', 18)} Flats for sale</a>
    </div>
  </div>
</section>

<section class="section section--cream" id="societies">
  <div class="container">
    ${sectionHead('Societies', `All ${societies.length} societies in Sector 76`, 'From affordable 2 BHK communities to DLF and Whiteland luxury launches. Open a society to see its live rent and sale listings.')}
    <div class="project-grid">${societies.map(societyCard).join('')}</div>
  </div>
</section>

<section class="section" id="price-guide">
  <div class="container">
    ${sectionHead('Price guide', 'Sector 76 rent &amp; sale prices by society', 'Indicative market ranges as of Oct 2026. Exact prices depend on floor, facing and furnishing.')}
    <div class="table-wrap reveal">
      <table class="price-table">
        <caption class="sr-only">Sector 76 society price guide</caption>
        <thead><tr><th scope="col">Society</th><th scope="col">Homes</th><th scope="col">Status</th><th scope="col">Sale price</th><th scope="col">Monthly rent</th></tr></thead>
        <tbody>
          ${societies.map((s) => `<tr>
            <th scope="row"><a href="${societyPath(s)}">${esc(s.name)}</a></th>
            <td>${esc(s.configs.join(', '))}<br><small class="muted">${esc(s.sizes)}</small></td>
            <td>${esc(s.status)}${s.possession ? `<br><small class="muted">Possession ${esc(s.possession)}</small>` : ''}</td>
            <td>${range(s.buy, price)}</td>
            <td>${s.rent ? range(s.rent, inr) : '<span class="muted">After possession</span>'}</td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>
</section>

<section class="section section--cream" id="location">
  <div class="container location-grid">
    <div class="reveal">
      <p class="eyebrow">Connectivity</p>
      <h2>${esc(locality.corridor)}</h2>
      <p class="muted">Sector 76, Gurugram, Haryana ${locality.pincode} · Nearby: ${esc(locality.nearby.join(', '))}</p>
      <ul class="landmarks">
        ${locality.connectivity.map((l) => `<li>${icon(l.icon, 20)}<span>${esc(l.name)}</span><strong>${esc(l.dist)}</strong></li>`).join('')}
      </ul>
    </div>
    ${mapEmbed('Sector 76, Gurugram, Haryana', 'Map of Sector 76, Gurgaon')}
  </div>
  <div class="container place-grid">
    ${placeList('Schools', 'school', locality.schools)}
    ${placeList('Hospitals', 'hospital', locality.hospitals)}
    ${placeList('Shopping', 'shopping', locality.shopping)}
  </div>
</section>

${ownerCta()}

<section class="section">
  <div class="container narrow">
    ${sectionHead('Costs', 'Charges to budget for', '')}
    <dl class="facts facts--two reveal">${locality.charges.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
    <p class="fine center">Society details are compiled from public sources and are indicative. Verify RERA registration at haryanarera.gov.in before booking.</p>
  </div>
</section>

${enquirySection({ title: 'Tell us what you need in Sector 76', sub: 'Share your budget and the kind of home you want. We\'ll send matching flats on WhatsApp, usually within 30 minutes.' })}`;

  return {
    path: HUB,
    title: 'Sector 76 Gurgaon — Societies, Flats for Rent & Sale, Price Guide',
    description: `All ${societies.length} societies in Sector 76, Gurgaon: ${societies.slice(0, 5).map((s) => s.name).join(', ')} and more. Flats for rent and sale, price guide, connectivity, schools and hospitals.`,
    body,
    schema: [
      breadcrumbSchema(crumbs),
      { '@type': 'Place', name: 'Sector 76, Gurgaon', address: { '@type': 'PostalAddress', addressLocality: 'Gurugram', addressRegion: 'Haryana', postalCode: locality.pincode, addressCountry: 'IN' } },
      { '@type': 'ItemList', name: 'Societies in Sector 76, Gurgaon', itemListElement: societies.map((s, i) => ({ '@type': 'ListItem', position: i + 1, url: absUrl(societyPath(s)), name: s.name })) },
    ],
  };
}

// ── /sector-76/<society>/ ───────────────────────────────────────────────────
function societyPage(s) {
  const path = societyPath(s);
  const crumbs = [{ name: 'Sector 76', path: HUB }, { name: s.name, path }];
  const rent = forSociety(s, 'rent'), buy = forSociety(s, 'buy');
  const facts = [
    ['Developer', s.developer], ['Type', s.category], ['Status', s.status],
    ['Homes', s.configs.join(', ')], ['Sizes', s.sizes], ['Land area', s.landArea], ['Units', s.units],
    ...(s.possession ? [['Possession', s.possession]] : []),
  ];
  const tabs = [
    ...(s.rent || rent.length ? [['rent', `For Rent (${rent.length})`, rent]] : []),
    ['buy', `For Sale (${buy.length})`, buy],
  ];
  const emptyTab = (purpose) => `
    <div class="empty-state">
      <h3>No ${purpose === 'rent' ? 'rentals' : 'flats for sale'} listed right now</h3>
      <p>New ${purpose === 'rent' ? 'rentals' : 'resale flats'} in ${esc(s.name)} come up often. Tell us what you need and we'll let you know first.</p>
      <button class="btn btn--gold" data-open="enquiry-modal" data-project="${esc(s.name)}" data-intent="${purpose === 'rent' ? 'Rent' : 'Buy'}">Get alerts</button>
    </div>`;
  const others = societies.filter((o) => o !== s);

  const body = `
${pageHero(esc(s.name), `${esc(s.configs.join(' · '))} · ${esc(s.developer)} · Sector 76, Gurgaon`, s.hero, crumbs)}

<section class="section">
  <div class="container overview-grid">
    <div class="reveal">
      <p class="eyebrow">${esc(s.category)}</p>
      <h2>About ${esc(s.name)}</h2>
      <p class="lead">${esc(s.overview)}</p>
      <dl class="facts">${facts.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
    </div>
    <div class="highlights reveal">
      <div class="society-prices">
        <div><small>Sale price</small><strong>${range(s.buy, price)}</strong></div>
        <div><small>Monthly rent</small><strong>${s.rent ? range(s.rent, rentShort) : 'After possession'}</strong></div>
      </div>
      <ul class="check-list">${s.highlights.map((h) => `<li>${icon('check', 18)} ${esc(h)}</li>`).join('')}</ul>
      ${s.rent ? `<button class="btn btn--gold btn--block" data-open="enquiry-modal" data-project="${esc(s.name)}" data-intent="Rent">${icon('key', 18)} Rent here</button>` : ''}
      <button class="btn btn--navy btn--block" data-open="enquiry-modal" data-project="${esc(s.name)}" data-intent="Buy">${icon('home', 18)} Buy here</button>
      <button class="btn btn--outline btn--block" data-open="site-visit-modal" data-project="${esc(s.name)}">${icon('calendar', 18)} Book a visit</button>
    </div>
  </div>
</section>

<section class="section section--cream" id="listings">
  <div class="container">
    ${sectionHead('Available now', `Flats in ${esc(s.name)}`, '')}
    <div class="tabs" data-tabs>
      <div class="tab-list" role="tablist" aria-label="Listing type">
        ${tabs.map(([k, label], i) => `<button role="tab" id="lt-${k}" aria-controls="lp-${k}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${label}</button>`).join('')}
      </div>
      ${tabs.map(([k, , items], i) => `
      <div class="tab-panel" role="tabpanel" id="lp-${k}" aria-labelledby="lt-${k}"${i === 0 ? '' : ' hidden'}>
        ${items.length ? listingGrid(items, { showSociety: false }) : emptyTab(k)}
      </div>`).join('')}
    </div>
  </div>
</section>

<section class="section section--navy" id="amenities">
  <div class="container">
    ${sectionHead('Amenities', 'Inside the society', '')}
    <ul class="amenities">${s.amenities.map((a) => `<li class="reveal">${icon(a, 32)}<span>${AMENITY_LABELS[a] || a}</span></li>`).join('')}</ul>
  </div>
</section>

<section class="section" id="location">
  <div class="container location-grid">
    <div class="reveal">
      <p class="eyebrow">Location</p>
      <h2>Sector 76, Gurgaon</h2>
      <p class="muted">${esc(s.name)}, Sector 76, Gurugram, Haryana ${locality.pincode}</p>
      <ul class="landmarks">
        ${locality.connectivity.slice(0, 5).map((l) => `<li>${icon(l.icon, 20)}<span>${esc(l.name)}</span><strong>${esc(l.dist)}</strong></li>`).join('')}
      </ul>
      <a class="link-arrow" href="${HUB}">Sector 76 locality guide ${icon('arrow-right', 16)}</a>
    </div>
    ${mapEmbed(`${s.name}, Sector 76, Gurugram`, `Map showing ${s.name}`)}
  </div>
</section>

<section class="section section--cream">
  <div class="container">
    ${sectionHead('Nearby', 'Other societies in Sector 76', '')}
    <ul class="society-links reveal">${others.map((o) => `<li><a href="${societyPath(o)}"><strong>${esc(o.name)}</strong><span>${esc(o.configs.join(' · '))} · ${price(o.buy[0])}+</span></a></li>`).join('')}</ul>
  </div>
</section>

${enquirySection({ project: s.slug, title: `Looking for a flat in ${esc(s.name)}?`, sub: `Tell us your budget and move-in date. We'll share every available ${esc(s.name)} flat on WhatsApp.` })}
<p class="container fine rera-strip">Society details are indicative and compiled from public sources. Listing photos are representative. Verify RERA details at haryanarera.gov.in.</p>`;

  return {
    path,
    title: `${s.name}, Sector 76 Gurgaon — Flats for Rent & Sale`,
    description: `${s.name} by ${s.developer}, Sector 76 Gurgaon: ${s.configs.join(', ')} (${s.sizes}). Sale ${range(s.buy, price)}${s.rent ? `, rent ${range(s.rent, inr)}/month` : ''}. ${rent.length} for rent, ${buy.length} for sale.`,
    image: src(s.hero, 1200, 630),
    projectSlug: s.slug,
    projectName: s.name,
    body,
    schema: [
      breadcrumbSchema(crumbs),
      {
        '@type': 'ApartmentComplex',
        name: s.name,
        description: s.overview,
        url: absUrl(path),
        image: src(s.hero, 1200),
        address: { '@type': 'PostalAddress', streetAddress: `${s.name}, Sector 76`, addressLocality: 'Gurugram', addressRegion: 'Haryana', postalCode: locality.pincode, addressCountry: 'IN' },
        amenityFeature: s.amenities.map((a) => ({ '@type': 'LocationFeatureSpecification', name: AMENITY_LABELS[a] || a, value: true })),
      },
    ],
  };
}

// ── /rent/ and /buy/ ────────────────────────────────────────────────────────
const LISTING_PAGES = {
  rent: {
    path: '/rent/', name: 'Flats for Rent', intent: 'Rent',
    h1: 'Flats for rent in Sector 76, Gurgaon',
    sub: 'Verified 2, 3 and 4 BHK rentals in Sector 76 societies, with same-day visits.',
    hero: 'photo-1600566753190-17f0baa2a6c3',
    budget: [['', 'Any budget'], ['0-20000', 'Under ₹20K'], ['20000-30000', '₹20K – 30K'], ['30000-45000', '₹30K – 45K'], ['45000-60000', '₹45K – 60K'], ['60000-9999999', 'Above ₹60K']],
    extra: ['furnishing', 'Furnishing', [['', 'Any'], ['Unfurnished', 'Unfurnished'], ['Semi-furnished', 'Semi-furnished'], ['Fully furnished', 'Fully furnished']]],
  },
  buy: {
    path: '/buy/', name: 'Flats for Sale', intent: 'Buy',
    h1: 'Flats for sale in Sector 76, Gurgaon',
    sub: 'Resale flats, allotment transfers and new bookings, from ₹50 lakh 2 BHKs to DLF Privana 4 BHKs.',
    hero: 'photo-1600585154340-be6161a56a0c',
    budget: [['', 'Any budget'], ['0-100', 'Under ₹1 Cr'], ['100-200', '₹1 – 2 Cr'], ['200-500', '₹2 – 5 Cr'], ['500-99999', 'Above ₹5 Cr']],
    extra: ['sale', 'Sale type', [['', 'Any'], ['Resale', 'Resale'], ['New booking', 'New booking'], ['Allotment transfer', 'Allotment transfer']]],
  },
};

function listingsPage(purpose) {
  const cfg = LISTING_PAGES[purpose];
  const items = listings.filter((l) => l.purpose === purpose);
  const crumbs = [{ name: cfg.name, path: cfg.path }];
  const socs = societies.filter((s) => items.some((l) => l.society === s.slug));
  const bhks = [...new Set(items.map((l) => l.bhk))].sort();
  const sel = (name, label, opts) => `
    <div class="filter"><label for="lf-${name}">${label}</label>
      <select id="lf-${name}" name="${name}" data-lf="${name}">${opts.map(([v, l]) => `<option value="${esc(v)}">${esc(l)}</option>`).join('')}</select></div>`;
  const body = `
${pageHero(cfg.h1, cfg.sub, cfg.hero, crumbs)}
<section class="section section--tight">
  <div class="container">
    <h2 class="sr-only">${cfg.name}</h2>
    <form class="filters filters--listings" data-listing-filters aria-label="Filter listings">
      ${sel('society', 'Society', [['', 'All societies'], ...socs.map((s) => [s.slug, s.name])])}
      ${sel('bhk', 'BHK', [['', 'Any BHK'], ...bhks.map((b) => [String(b), `${b} BHK`])])}
      ${sel('budget', 'Budget', cfg.budget)}
      ${sel(...cfg.extra)}
      ${sel('sort', 'Sort by', [['', 'Recommended'], ['asc', 'Price: low to high'], ['desc', 'Price: high to low']])}
      <button type="reset" class="btn btn--sm btn--ghost" data-reset>Clear filters</button>
    </form>
    <p class="results-count" aria-live="polite" data-count-label>${items.length} flats</p>
    ${listingGrid(items)}
    <div class="empty-state" data-empty hidden>
      <h3>No flats match these filters</h3>
      <p>Tell us your requirement. New ${purpose === 'rent' ? 'rentals' : 'resale flats'} come up in Sector 76 every week.</p>
      <button class="btn btn--gold" data-open="enquiry-modal" data-intent="${cfg.intent}">Share my requirement</button>
    </div>
    <p class="fine">Photos are representative. Prices are the owner's asking price and may be negotiable. ${purpose === 'rent' ? 'Security deposit is usually two months\' rent.' : 'Stamp duty (5–7%) and registration (1%) are extra.'}</p>
  </div>
</section>
${ownerCta()}
${enquirySection({ title: `Can't find the right flat?`, sub: `Share your budget, BHK and preferred society. We'll send matching ${purpose === 'rent' ? 'rentals' : 'flats for sale'} on WhatsApp.` })}`;

  return {
    path: cfg.path,
    title: `${cfg.h1} — ${items.length} Listings`,
    description: `${items.length} ${cfg.name.toLowerCase()} in Sector 76, Gurgaon, in ${socs.slice(0, 4).map((s) => s.name).join(', ')} and more. Filter by society, BHK and budget.`,
    image: src(cfg.hero, 1200, 630),
    body,
    schema: [breadcrumbSchema(crumbs)],
  };
}

module.exports = { hub, societyPage, listingsPage, societyCard, societies, listings, HUB };
