const { site, esc, img, price, icon, statusClass } = require('./util');
const { leadForm } = require('./layout');

const sectionHead = (eyebrow, title, sub, center = true) => `
<div class="section-head${center ? ' section-head--center' : ''} reveal">
  ${eyebrow ? `<p class="eyebrow">${eyebrow}</p>` : ''}
  <h2>${title}</h2>
  ${sub ? `<p class="section-sub">${sub}</p>` : ''}
</div>`;

const configLabel = (p) => p.configs.join(' · ');

function projectCard(p, { sizes = '(min-width: 1100px) 33vw, (min-width: 700px) 50vw, 100vw' } = {}) {
  const budget = p.priceFrom;
  return `
<article class="project-card reveal" data-city="${esc(p.city)}" data-location="${esc(p.location)}" data-type="${esc(p.type)}"
  data-status="${esc(p.status)}" data-price="${budget}" data-bhk="${p.bhk.join(',')}">
  <a href="/projects/${p.slug}/" class="project-card-media" tabindex="-1" aria-hidden="true">
    ${img(p.hero, `${p.name}, ${p.location}`, { w: 800, ratio: 4 / 3, sizes })}
    <span class="tag tag--${statusClass(p.status)}">${esc(p.status)}</span>
  </a>
  <div class="project-card-body">
    <p class="project-card-loc">${icon('map-pin', 15)} ${esc(p.sector)}, ${esc(p.location)}, ${esc(p.city)}</p>
    <h3><a href="/projects/${p.slug}/">${esc(p.name)}</a></h3>
    <p class="project-card-config">${esc(configLabel(p))}</p>
    <div class="project-card-foot">
      <div><small>Starting from</small><strong>${price(p.priceFrom)}<sup>*</sup></strong></div>
      <a href="/projects/${p.slug}/" class="link-arrow">Details ${icon('arrow-right', 16)}</a>
    </div>
  </div>
</article>`;
}

function enquirySection({ project = '', title = 'Let\'s find your dream home', sub } = {}) {
  return `
<section class="section enquiry-section" id="enquire">
  <div class="enquiry-bg">${img('photo-1600607687939-ce8a6c25118c', '', { w: 1600, sizes: '100vw' })}</div>
  <div class="container enquiry-grid">
    <div class="enquiry-copy reveal">
      <p class="eyebrow">Enquire now</p>
      <h2>${title}</h2>
      <p>${sub || 'Speak to a property advisor for current offers, price sheets and floor plans. We usually respond within 30 minutes.'}</p>
      <ul class="check-list">
        <li>${icon('check', 18)} Exclusive launch &amp; festive offers</li>
        <li>${icon('check', 18)} Free pick-up &amp; drop for site visits</li>
        <li>${icon('check', 18)} Home-loan assistance from 15+ banks</li>
      </ul>
      <div class="enquiry-quick">
        <a href="tel:${site.phoneRaw}" class="btn btn--outline-light">${icon('phone', 18)} Call now</a>
        <a href="https://wa.me/${site.whatsapp}" target="_blank" rel="noopener" class="btn btn--outline-light">${icon('whatsapp', 18)} WhatsApp</a>
      </div>
    </div>
    <div class="enquiry-card reveal">${leadForm({ kind: 'enquiry', project, submit: 'Get a Callback' })}</div>
  </div>
</section>`;
}

function emiCalculator({ amount = 15000000 } = {}) {
  return `
<div class="emi" data-emi>
  <div class="emi-inputs">
    <div class="range-field">
      <div class="range-label"><label for="emi-amount">Loan amount</label><output data-out="amount"></output></div>
      <input id="emi-amount" type="range" min="1000000" max="100000000" step="500000" value="${amount}" data-in="amount">
      <div class="range-scale"><span>₹10 L</span><span>₹10 Cr</span></div>
    </div>
    <div class="range-field">
      <div class="range-label"><label for="emi-rate">Interest rate (p.a.)</label><output data-out="rate"></output></div>
      <input id="emi-rate" type="range" min="6" max="14" step="0.05" value="8.5" data-in="rate">
      <div class="range-scale"><span>6%</span><span>14%</span></div>
    </div>
    <div class="range-field">
      <div class="range-label"><label for="emi-tenure">Tenure</label><output data-out="tenure"></output></div>
      <input id="emi-tenure" type="range" min="1" max="30" step="1" value="20" data-in="tenure">
      <div class="range-scale"><span>1 yr</span><span>30 yrs</span></div>
    </div>
  </div>
  <div class="emi-result">
    <p>Monthly EMI</p>
    <strong class="emi-value" data-out="emi">—</strong>
    <div class="emi-bar" aria-hidden="true"><span data-bar="principal"></span></div>
    <dl class="emi-breakdown">
      <div><dt><i class="dot dot--principal"></i>Principal</dt><dd data-out="principal"></dd></div>
      <div><dt><i class="dot dot--interest"></i>Total interest</dt><dd data-out="interest"></dd></div>
      <div><dt>Total payable</dt><dd data-out="total"></dd></div>
    </dl>
    <button class="btn btn--gold btn--block" data-open="enquiry-modal">Get home-loan assistance</button>
    <p class="fine">Indicative only. Actual EMI depends on the lender's terms.</p>
  </div>
</div>`;
}

// Simple schematic floor plan so every configuration has a visual even before real plans are uploaded.
function floorPlanSvg(plan, project) {
  const W = 480, H = 320, pad = 10;
  const stroke = 'stroke="#0b1f3a" stroke-width="2.5" fill="#fbf8f2"';
  const room = (x, y, w, h, label, sub = '') => `
    <rect x="${x}" y="${y}" width="${w}" height="${h}" ${stroke}/>
    <text x="${x + w / 2}" y="${y + h / 2 - (sub ? 4 : -4)}" text-anchor="middle" font-size="12" font-weight="600" fill="#0b1f3a">${label}</text>
    ${sub ? `<text x="${x + w / 2}" y="${y + h / 2 + 12}" text-anchor="middle" font-size="10" fill="#5b6475">${sub}</text>` : ''}`;
  let inner = '';
  const iw = W - pad * 2, ih = H - pad * 2;
  if (project.type === 'Plots') {
    inner = `<rect x="${pad + 40}" y="${pad + 20}" width="${iw - 80}" height="${ih - 60}" stroke="#0b1f3a" stroke-width="2.5" stroke-dasharray="8 6" fill="#eef3ea"/>
      <text x="${W / 2}" y="${H / 2 - 6}" text-anchor="middle" font-size="16" font-weight="600" fill="#0b1f3a">${esc(plan.config)}</text>
      <text x="${W / 2}" y="${H / 2 + 14}" text-anchor="middle" font-size="11" fill="#5b6475">${plan.carpet.toLocaleString('en-IN')} sq ft plot area</text>
      <rect x="${pad}" y="${H - pad - 30}" width="${iw}" height="30" fill="#d9d4ca"/><text x="${W / 2}" y="${H - pad - 11}" text-anchor="middle" font-size="11" fill="#0b1f3a">12 m wide road</text>`;
  } else if (project.type === 'Commercial') {
    inner = room(pad, pad, iw * 0.72, ih * 0.78, esc(plan.config), 'Open-plan space') +
      room(pad + iw * 0.72, pad, iw * 0.28, ih * 0.39, 'Pantry') +
      room(pad + iw * 0.72, pad + ih * 0.39, iw * 0.28, ih * 0.39, 'Toilet') +
      `<rect x="${pad}" y="${pad + ih * 0.78}" width="${iw}" height="${ih * 0.22}" fill="#e7dcc6" stroke="#0b1f3a" stroke-width="2.5"/><text x="${W / 2}" y="${pad + ih * 0.9 + 4}" text-anchor="middle" font-size="12" fill="#0b1f3a">Glass frontage · Common corridor</text>`;
  } else {
    const beds = Math.min(4, parseInt(plan.config, 10) || 4);
    const topH = ih * 0.45, botH = ih * 0.4, balH = ih * 0.15;
    const bw = iw / beds;
    for (let i = 0; i < beds; i++) inner += room(pad + i * bw, pad, bw, topH, i === 0 ? 'Master Bed' : `Bedroom ${i + 1}`, i === 0 ? '14\'×16\'' : '12\'×14\'');
    inner += room(pad, pad + topH, iw * 0.55, botH, 'Living &amp; Dining', '26\'×14\'') +
      room(pad + iw * 0.55, pad + topH, iw * 0.25, botH, 'Kitchen', '10\'×12\'') +
      room(pad + iw * 0.8, pad + topH, iw * 0.2, botH, /study|servant/i.test(plan.config) ? (/study/i.test(plan.config) ? 'Study' : 'Staff Rm') : 'Utility');
    inner += `<rect x="${pad}" y="${pad + topH + botH}" width="${iw}" height="${balH}" fill="#e7dcc6" stroke="#0b1f3a" stroke-width="2.5"/><text x="${W / 2}" y="${pad + topH + botH + balH / 2 + 4}" text-anchor="middle" font-size="12" fill="#0b1f3a">Wrap-around Balcony</text>`;
  }
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Indicative floor plan — ${esc(plan.config)}, ${esc(project.name)}" font-family="Inter, sans-serif">${inner}</svg>`;
}

module.exports = { sectionHead, projectCard, enquirySection, emiCalculator, floorPlanSvg, configLabel };
