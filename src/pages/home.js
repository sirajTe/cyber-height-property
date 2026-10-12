const projects = require('../../data/projects');
const content = require('../../data/content');
const posts = require('../../data/blog');
const { site, esc, img, src, price, icon, fmtDate } = require('../util');
const { sectionHead, projectCard, enquirySection } = require('../components');
const { societies } = require('../../data/sector76');
const listings = require('../../data/listings');

module.exports = function home() {
  const bySlug = Object.fromEntries(projects.map((p) => [p.slug, p]));
  const featured = projects.filter((p) => p.featured);

  const slides = content.heroSlides
    .map((s, i) => {
      const p = bySlug[s.project];
      return `
    <div class="hero-slide${i === 0 ? ' is-active' : ''}" data-slide aria-hidden="${i !== 0}">
      ${img(s.image, `${p.name} — ${p.location}`, { w: 1600, sizes: '100vw', eager: i === 0, cls: 'hero-img' })}
      <div class="hero-slide-meta">
        <span>${esc(s.kicker)}</span>
        <a href="/projects/${p.slug}/">${esc(p.name)} · ${esc(p.configs.slice(0, 2).join(' & '))} from ${price(p.priceFrom)}* ${icon('arrow-right', 16)}</a>
      </div>
    </div>`;
    })
    .join('');

  const body = `
<section class="hero" data-hero-slider>
  <div class="hero-slides">${slides}</div>
  <div class="hero-overlay"></div>
  <div class="container hero-content">
    <p class="eyebrow eyebrow--light rise">Since ${site.founded} · Gurgaon · Noida</p>
    <h1 class="rise">Crafting landmarks.<br><em>Elevating lifestyles.</em></h1>
    <p class="hero-sub rise">Luxury residences, Grade-A commercial spaces and gated plots in Gurgaon and NCR — built on 22 years of on-time delivery.</p>
    <div class="hero-ctas rise">
      <a href="/projects/" class="btn btn--gold btn--lg">Explore Projects</a>
      <button class="btn btn--outline-light btn--lg" data-open="site-visit-modal">${icon('calendar', 18)} Book a Site Visit</button>
    </div>
  </div>
  <div class="container hero-controls">
    <div class="hero-dots" role="tablist" aria-label="Featured projects">
      ${content.heroSlides.map((s, i) => `<button role="tab" aria-label="Slide ${i + 1}: ${esc(bySlug[s.project].name)}" aria-selected="${i === 0}" data-dot="${i}"></button>`).join('')}
    </div>
  </div>
</section>

<section class="quick-search">
  <form class="container quick-search-inner" action="/projects/" method="get" aria-label="Search projects">
    <div class="qs-field"><label for="qs-city">City</label><select id="qs-city" name="city"><option value="">All cities</option><option>Gurgaon</option><option>Noida</option></select></div>
    <div class="qs-field"><label for="qs-type">Property type</label><select id="qs-type" name="type"><option value="">All types</option><option>Residential</option><option>Commercial</option><option>Plots</option></select></div>
    <div class="qs-field"><label for="qs-budget">Budget</label><select id="qs-budget" name="budget"><option value="">Any budget</option><option value="0-150">Under ₹1.5 Cr</option><option value="150-250">₹1.5 – 2.5 Cr</option><option value="250-400">₹2.5 – 4 Cr</option><option value="400-99999">Above ₹4 Cr</option></select></div>
    <button class="btn btn--navy" type="submit">Search Projects ${icon('arrow-right', 18)}</button>
  </form>
</section>

<section class="section">
  <div class="container">
    ${sectionHead('Sector 76, Gurgaon', 'Rent or buy in Sector 76', `We work in all ${societies.length} societies in the sector, from Suncity Avenue 76 and Pyramid Pride to Ninex City and DLF Privana.`)}
    <div class="rb-tiles">
      <a class="rb-tile reveal" href="/rent/">
        ${img('photo-1600566753190-17f0baa2a6c3', '', { w: 900, sizes: '(min-width: 760px) 50vw, 100vw' })}
        <h3>Flats for rent</h3>
        <p>${listings.filter((l) => l.purpose === 'rent').length} verified rentals · 2, 3 &amp; 4 BHK from ₹15,000/month</p>
        <span class="link-arrow">Browse rentals ${icon('arrow-right', 16)}</span>
      </a>
      <a class="rb-tile reveal" href="/buy/">
        ${img('photo-1600585154340-be6161a56a0c', '', { w: 900, sizes: '(min-width: 760px) 50vw, 100vw' })}
        <h3>Flats for sale</h3>
        <p>${listings.filter((l) => l.purpose === 'buy').length} resale &amp; new bookings · from ₹${Math.min(...societies.map((s) => s.buy[0]))} lakh</p>
        <span class="link-arrow">Browse flats for sale ${icon('arrow-right', 16)}</span>
      </a>
    </div>
    <nav class="society-chips" aria-label="Sector 76 societies">
      ${societies.map((s) => `<a href="/sector-76/${s.slug}/">${esc(s.name)}</a>`).join('')}
    </nav>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-head-row">
      ${sectionHead('Featured projects', 'Addresses that define the skyline', '', false)}
      <div class="carousel-nav" data-carousel-nav="featured">
        <button aria-label="Previous projects" data-prev>${icon('chevron-left')}</button>
        <button aria-label="Next projects" data-next>${icon('chevron-right')}</button>
      </div>
    </div>
    <div class="carousel" data-carousel="featured" tabindex="0" aria-label="Featured projects carousel">
      ${featured.map((p) => projectCard(p, { sizes: '(min-width: 1100px) 33vw, (min-width: 700px) 50vw, 85vw' })).join('')}
    </div>
    <p class="center"><a class="btn btn--outline" href="/projects/">View all projects</a></p>
  </div>
</section>

<section class="stats" aria-label="Key numbers">
  <div class="container stats-grid">
    ${content.stats.map((s) => `
    <div class="stat reveal">
      <strong><span data-count="${s.value}">0</span>${s.suffix}</strong>
      <span>${s.label}</span>
    </div>`).join('')}
  </div>
</section>

<section class="section section--cream">
  <div class="container">
    ${sectionHead('Why choose us', 'Trust, built into every square foot', 'Over two decades, we have earned the confidence of 12,500+ families by doing a few things exceptionally well.')}
    <div class="why-grid">
      ${content.whyUs.map((w) => `
      <div class="why-card reveal">
        <span class="why-icon">${icon(w.icon, 28)}</span>
        <h3>${w.title}</h3>
        <p>${w.text}</p>
      </div>`).join('')}
    </div>
  </div>
</section>

<section class="awards" aria-label="Awards and recognition">
  <div class="container">
    <p class="eyebrow center">Awards &amp; recognition</p>
    <div class="awards-track">
      <ul class="awards-list">
        ${[...content.awards, ...content.awards].map((a, i) => `<li${i >= content.awards.length ? ' aria-hidden="true"' : ''}>${icon('award', 30)}<div><strong>${a.title}</strong><span>${a.by}</span></div></li>`).join('')}
      </ul>
    </div>
  </div>
</section>

<section class="section split-feature">
  <div class="container split-grid">
    <div class="split-media reveal">${img('photo-1600566753190-17f0baa2a6c3', 'Living room interior of an Cyber Heights residence', { w: 900, ratio: 4 / 5, sizes: '(min-width: 900px) 45vw, 100vw' })}</div>
    <div class="split-copy reveal">
      <p class="eyebrow">Our philosophy</p>
      <h2>Homes designed around light, air and the way you live.</h2>
      <p>From the master plan to the door handles, every decision at Cyber Heights is guided by one question — will it make life better for the people who live here? That is why our projects give more land to open greens, more height to ceilings, and more privacy to every family.</p>
      <a href="/about/" class="link-arrow">Discover our story ${icon('arrow-right', 16)}</a>
    </div>
  </div>
</section>

<section class="section section--navy testimonials">
  <div class="container">
    ${sectionHead('Testimonials', 'In the words of our homeowners', '')}
    <div class="testimonial-slider" data-testimonials>
      ${content.testimonials.map((t, i) => `
      <figure class="testimonial${i === 0 ? ' is-active' : ''}" data-testimonial aria-hidden="${i !== 0}">
        <div class="stars" role="img" aria-label="5 out of 5 stars">${icon('star', 18).repeat(5)}</div>
        <blockquote>“${t.quote}”</blockquote>
        <figcaption>
          ${img(t.image, t.name, { w: 120, ratio: 1, sizes: '64px' })}
          <div><strong>${t.name}</strong><span>${t.role} · ${t.project}</span></div>
        </figcaption>
      </figure>`).join('')}
      <div class="testimonial-nav">
        <button aria-label="Previous testimonial" data-prev>${icon('chevron-left')}</button>
        <div class="testimonial-dots">${content.testimonials.map((_, i) => `<button aria-label="Testimonial ${i + 1}" data-dot="${i}"${i === 0 ? ' aria-current="true"' : ''}></button>`).join('')}</div>
        <button aria-label="Next testimonial" data-next>${icon('chevron-right')}</button>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-head-row">
      ${sectionHead('News &amp; insights', 'Latest from Cyber Heights', '', false)}
      <a class="link-arrow" href="/blog/">All articles ${icon('arrow-right', 16)}</a>
    </div>
    <div class="blog-grid">
      ${posts.slice(0, 3).map(postCard).join('')}
    </div>
  </div>
</section>

${enquirySection()}
`;

  return {
    path: '/',
    title: `${site.name} — Luxury Apartments, Commercial & Plots in Gurgaon | RERA Approved`,
    description: `${site.name}: premium 3 & 4 BHK luxury apartments, commercial spaces and plots on Golf Course Extension Road, Dwarka Expressway and Sector 65 Gurgaon. 22+ years, 12,500+ happy families.`,
    overlay: true,
    bodyClass: 'page-home',
    preload: `<link rel="preload" as="image" href="${src(content.heroSlides[0].image, 1600)}" imagesrcset="${[800, 1200, 1600, 2000].map((w) => `${src(content.heroSlides[0].image, w)} ${w}w`).join(', ')}" imagesizes="100vw" fetchpriority="high">`,
    schema: [{ '@type': 'WebSite', '@id': `${site.url}/#website`, url: site.url + '/', name: site.name, publisher: { '@id': `${site.url}/#org` } }],
    body,
  };
};

function postCard(p) {
  return `
<article class="post-card reveal">
  <a href="/blog/${p.slug}/" class="post-card-media" tabindex="-1" aria-hidden="true">${img(p.image, '', { w: 640, ratio: 16 / 10, sizes: '(min-width: 900px) 33vw, 100vw' })}</a>
  <div class="post-card-body">
    <p class="post-meta"><span>${p.category}</span> · <time datetime="${p.date}">${fmtDate(p.date)}</time></p>
    <h3><a href="/blog/${p.slug}/">${p.title}</a></h3>
    <p>${p.excerpt}</p>
  </div>
</article>`;
}
module.exports.postCard = postCard;
