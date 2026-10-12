const projects = require('../../data/projects');
const content = require('../../data/content');
const posts = require('../../data/blog');
const { site, esc, img, src, icon, absUrl, fmtDate } = require('../util');
const { pageHero, breadcrumbSchema, leadForm } = require('../layout');
const { sectionHead, projectCard, enquirySection, emiCalculator } = require('../components');
const { postCard } = require('./home');

const uniq = (arr) => [...new Set(arr)];

function projectsListing() {
  const crumbs = [{ name: 'Projects', path: '/projects/' }];
  const sel = (name, label, opts) => `
    <div class="filter"><label for="f-${name}">${label}</label>
      <select id="f-${name}" name="${name}" data-filter="${name}">${opts.map(([v, l]) => `<option value="${esc(v)}">${esc(l)}</option>`).join('')}</select></div>`;
  const body = `
${pageHero('Our projects', 'Luxury residences, commercial landmarks and gated plots across Gurgaon and Noida.', 'photo-1486406146926-c627a92ad1ab', crumbs)}
<section class="section section--tight">
  <div class="container">
    <h2 class="sr-only">All projects</h2>
    <form class="filters" data-filters aria-label="Filter projects">
      ${sel('city', 'City', [['', 'All cities'], ...uniq(projects.map((p) => p.city)).map((c) => [c, c])])}
      ${sel('location', 'Location', [['', 'All locations'], ...uniq(projects.map((p) => p.location)).map((c) => [c, c])])}
      ${sel('type', 'Type', [['', 'All types'], ['Residential', 'Residential'], ['Commercial', 'Commercial'], ['Plots', 'Plots']])}
      ${sel('status', 'Status', [['', 'Any status'], ['New Launch', 'New Launch'], ['Under Construction', 'Under Construction'], ['Ready to Move', 'Ready to Move']])}
      ${sel('budget', 'Budget', [['', 'Any budget'], ['0-150', 'Under ₹1.5 Cr'], ['150-250', '₹1.5 – 2.5 Cr'], ['250-400', '₹2.5 – 4 Cr'], ['400-99999', 'Above ₹4 Cr']])}
      ${sel('bhk', 'BHK', [['', 'Any BHK'], ['3', '3 BHK'], ['4', '4 BHK'], ['5', 'Penthouse']])}
      <button type="reset" class="btn btn--sm btn--ghost" data-reset>Clear filters</button>
    </form>
    <p class="results-count" aria-live="polite" data-count-label>${projects.length} projects</p>
    <div class="project-grid" data-project-grid>
      ${projects.map((p) => projectCard(p)).join('')}
    </div>
    <div class="empty-state" data-empty hidden>
      <h3>No projects match these filters</h3>
      <p>Tell us what you're looking for and we'll alert you about upcoming launches.</p>
      <button class="btn btn--gold" data-open="enquiry-modal">Get launch alerts</button>
    </div>
  </div>
</section>
${enquirySection()}`;
  return {
    path: '/projects/',
    title: 'Projects in Gurgaon & Noida — Apartments, Commercial & Plots',
    description: 'Browse all Cyber Heights Properties projects: new launch, under-construction and ready-to-move apartments, commercial spaces and plots on Golf Course Extension Road, Dwarka Expressway, Sector 65 and Noida.',
    body,
    schema: [
      breadcrumbSchema(crumbs),
      { '@type': 'ItemList', name: 'Cyber Heights Properties projects', itemListElement: projects.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: absUrl(`/projects/${p.slug}/`), name: p.name })) },
    ],
  };
}

function about() {
  const crumbs = [{ name: 'About Us', path: '/about/' }];
  const body = `
${pageHero('About Cyber Heights Properties', `Two decades of building trust, one landmark at a time.`, 'photo-1460317442991-0ec209397118', crumbs)}
<section class="section">
  <div class="container split-grid">
    <div class="split-copy reveal">
      <p class="eyebrow">Our story</p>
      <h2>From a single 2-acre project to 18 million sq ft.</h2>
      <p>${esc(site.name)} began in ${site.founded} with a simple promise to our first 64 families: we would deliver what we showed, when we said we would. That promise has guided every project since — from boutique residences to Gurgaon's most recognisable towers.</p>
      <p>Today, a team of 900+ architects, engineers and customer-care professionals carries that promise forward across Gurgaon and Noida, with 9 million sq ft currently under development.</p>
    </div>
    <div class="split-media reveal">${img('photo-1497366216548-37526070297c', 'Cyber Heights Properties corporate office', { w: 900, ratio: 4 / 5, sizes: '(min-width: 900px) 45vw, 100vw' })}</div>
  </div>
</section>
<section class="section section--cream">
  <div class="container vm-grid">
    <div class="vm-card reveal"><span class="why-icon">${icon('globe', 28)}</span><h3>Vision</h3><p>To be India's most trusted real estate brand, creating communities that stand the test of time.</p></div>
    <div class="vm-card reveal"><span class="why-icon">${icon('trending', 28)}</span><h3>Mission</h3><p>To deliver thoughtfully designed, sustainable homes and workplaces — on time, every time, with complete transparency.</p></div>
    <div class="vm-card reveal"><span class="why-icon">${icon('shield', 28)}</span><h3>Values</h3><p>Integrity in every transaction. Quality in every detail. Respect for every customer, partner and neighbour.</p></div>
  </div>
</section>
<section class="stats" aria-label="Key numbers">
  <div class="container stats-grid">${content.stats.map((s) => `<div class="stat reveal"><strong><span data-count="${s.value}">0</span>${s.suffix}</strong><span>${s.label}</span></div>`).join('')}</div>
</section>
<section class="section">
  <div class="container">
    ${sectionHead('Leadership', 'The people behind the promise', '')}
    <div class="team-grid">
      ${content.team.map((t) => `
      <article class="team-card reveal">
        ${img(t.image, `${t.name}, ${t.role}`, { w: 500, ratio: 4 / 5, sizes: '(min-width: 1000px) 25vw, 50vw' })}
        <h3>${t.name}</h3><p class="team-role">${t.role}</p><p>${t.bio}</p>
      </article>`).join('')}
    </div>
  </div>
</section>
<section class="section section--navy">
  <div class="container">
    ${sectionHead('Milestones', 'Our journey', '')}
    <ol class="timeline">
      ${content.timeline.map((t) => `<li class="reveal"><span class="timeline-year">${t.year}</span><div><h3>${t.title}</h3><p>${t.text}</p></div></li>`).join('')}
    </ol>
  </div>
</section>
${enquirySection()}`;
  return { path: '/about/', title: 'About Us — Our Story, Vision & Leadership', description: `${site.name} has delivered 18 million sq ft and 12,500+ homes in Gurgaon and NCR since ${site.founded}. Meet our leadership and explore our journey.`, body, schema: [breadcrumbSchema(crumbs)] };
}

function contact() {
  const crumbs = [{ name: 'Contact', path: '/contact/' }];
  const body = `
${pageHero('Contact us', 'Visit an experience centre, call us, or leave your details for a callback.', 'photo-1497366811353-6870744d04b2', crumbs)}
<section class="section">
  <div class="container contact-grid">
    <div class="reveal">
      <p class="eyebrow">Talk to us</p>
      <h2>We'd love to hear from you</h2>
      <div class="contact-quick">
        <a href="tel:${site.phoneRaw}" class="contact-tile">${icon('phone', 26)}<span><small>Call sales</small><strong>${site.phone}</strong></span></a>
        <a href="https://wa.me/${site.whatsapp}" target="_blank" rel="noopener" class="contact-tile">${icon('whatsapp', 26)}<span><small>WhatsApp</small><strong>Chat with an advisor</strong></span></a>
        <a href="mailto:${site.email}" class="contact-tile">${icon('mail', 26)}<span><small>Email</small><strong>${site.email}</strong></span></a>
        <div class="contact-tile">${icon('clock', 26)}<span><small>Hours</small><strong>Mon – Sun, 9:30 AM – 7:30 PM</strong></span></div>
      </div>
    </div>
    <div class="enquiry-card enquiry-card--light reveal"><h3>Send an enquiry</h3>${leadForm({ kind: 'contact', submit: 'Send Enquiry' })}</div>
  </div>
</section>
<section class="section section--cream">
  <div class="container">
    ${sectionHead('Our offices', 'Visit us', '')}
    <div class="office-grid">
      ${site.offices.map((o) => `
      <article class="office-card reveal">
        <div class="map-embed map-embed--sm" data-map="https://maps.google.com/maps?q=${o.lat ? `${o.lat},${o.lng}` : encodeURIComponent(o.address)}&z=15&output=embed" data-title="Map: ${esc(o.name)}">
          <button class="map-placeholder" type="button">${icon('map-pin', 28)}<span>Load map</span></button>
        </div>
        <div class="office-body">
          <h3>${esc(o.name)}</h3>
          <p>${esc(o.address)}</p>
          <p><a href="tel:${o.phone.replace(/\s/g, '')}">${icon('phone', 16)} ${o.phone}</a></p>
          <a class="link-arrow" target="_blank" rel="noopener" href="https://www.google.com/maps/dir/?api=1&destination=${o.lat ? `${o.lat},${o.lng}` : encodeURIComponent(o.address)}">Get directions ${icon('arrow-right', 16)}</a>
        </div>
      </article>`).join('')}
    </div>
  </div>
</section>`;
  return {
    path: '/contact/', title: 'Contact Us — Offices, Phone & WhatsApp', description: `Contact ${site.name}: call ${site.phone}, WhatsApp, email or visit our offices on Golf Course Road, Dwarka Expressway and Noida.`, body,
    schema: [breadcrumbSchema(crumbs), { '@type': 'ContactPage', url: absUrl('/contact/'), name: 'Contact ' + site.name }],
  };
}

function blogIndex() {
  const crumbs = [{ name: 'News & Blog', path: '/blog/' }];
  const sorted = [...posts].sort((a, b) => b.date.localeCompare(a.date));
  const body = `
${pageHero('News &amp; insights', 'Market insights, buyer guides and company news.', 'photo-1554224155-6726b3ff858f', crumbs)}
<section class="section"><div class="container"><div class="blog-grid">${sorted.map(postCard).join('')}</div></div></section>`;
  return { path: '/blog/', title: 'News & Blog — Real Estate Insights for Gurgaon & NCR', description: 'Real estate market insights, RERA guides, NRI investment advice and Cyber Heights Properties company news.', body, schema: [breadcrumbSchema(crumbs)] };
}

function blogPost(p) {
  const path = `/blog/${p.slug}/`;
  const crumbs = [{ name: 'News & Blog', path: '/blog/' }, { name: p.title, path }];
  const related = posts.filter((x) => x.slug !== p.slug).slice(0, 3);
  const body = `
${pageHero(p.title, `<span class="post-meta post-meta--light">${p.category} · <time datetime="${p.date}">${fmtDate(p.date)}</time> · ${p.author}</span>`, p.image, crumbs)}
<article class="section"><div class="container prose reveal">${p.body}
  <div class="share">Share: <a target="_blank" rel="noopener" href="https://wa.me/?text=${encodeURIComponent(p.title + ' ' + absUrl(path))}">${icon('whatsapp', 18)} WhatsApp</a>
  <a target="_blank" rel="noopener" href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(absUrl(path))}">${icon('linkedin', 18)} LinkedIn</a></div>
</div></article>
<section class="section section--cream"><div class="container">${sectionHead('Keep reading', 'Related articles', '')}<div class="blog-grid">${related.map(postCard).join('')}</div></div></section>
${enquirySection()}`;
  return {
    path, title: p.title, description: p.excerpt, image: src(p.image, 1200, 630), body,
    schema: [breadcrumbSchema(crumbs), {
      '@type': 'BlogPosting', headline: p.title, description: p.excerpt, image: src(p.image, 1200), datePublished: p.date, dateModified: p.date,
      author: { '@type': 'Organization', name: `${site.name} — ${p.author}` }, publisher: { '@id': `${site.url}/#org` }, mainEntityOfPage: absUrl(path),
    }],
  };
}

function careers() {
  const crumbs = [{ name: 'Careers', path: '/careers/' }];
  const body = `
${pageHero('Careers at Cyber Heights', 'Build landmarks. Build a career.', 'photo-1497366216548-37526070297c', crumbs)}
<section class="section">
  <div class="container">
    ${sectionHead('Why work with us', 'A place to do the best work of your life', '')}
    <div class="why-grid why-grid--3">
      ${[['trending', 'Grow fast', 'Structured learning, leadership programmes and clear career paths.'], ['users', 'Great people', '900+ colleagues who care about craft and customers.'], ['shield', 'Strong values', 'A culture of integrity, safety and respect on every site.']]
        .map(([i, t, d]) => `<div class="why-card reveal"><span class="why-icon">${icon(i, 28)}</span><h3>${t}</h3><p>${d}</p></div>`).join('')}
    </div>
  </div>
</section>
<section class="section section--cream">
  <div class="container">
    ${sectionHead('Open positions', 'Current openings', '')}
    <ul class="jobs">
      ${content.jobs.map((j) => `
      <li class="job reveal">
        <div><h3>${j.title}</h3><p>${icon('briefcase', 16)} ${j.dept} · ${icon('map-pin', 16)} ${j.location} · ${j.type} · ${j.exp}</p></div>
        <a class="btn btn--outline btn--sm" href="mailto:${site.careersEmail}?subject=${encodeURIComponent('Application: ' + j.title)}">Apply ${icon('arrow-right', 16)}</a>
      </li>`).join('')}
    </ul>
    <p class="center muted">Don't see a fit? Send your CV to <a href="mailto:${site.careersEmail}">${site.careersEmail}</a>.</p>
  </div>
</section>`;
  return {
    path: '/careers/', title: 'Careers — Join Our Team', description: `Explore careers at ${site.name} in sales, projects, design and marketing across Gurgaon and Noida.`, body,
    schema: [breadcrumbSchema(crumbs), ...content.jobs.map((j) => ({
      '@type': 'JobPosting', title: j.title, description: `${j.title} — ${j.dept}, ${j.exp} experience.`, datePosted: '2026-09-01', employmentType: 'FULL_TIME',
      hiringOrganization: { '@id': `${site.url}/#org` },
      jobLocation: { '@type': 'Place', address: { '@type': 'PostalAddress', addressLocality: j.location.split(' /')[0], addressCountry: 'IN' } },
    }))],
  };
}

function nri() {
  const crumbs = [{ name: 'NRI Corner', path: '/nri-corner/' }];
  const steps = [
    ['globe', 'Explore remotely', 'Live video tours of the site and sample flat, scheduled in your time zone.'],
    ['file', 'Digital documentation', 'KYC, booking form and agreements completed online with e-sign and courier support.'],
    ['briefcase', 'Home loan & FEMA help', 'Tie-ups with leading banks for NRI home loans; guidance on NRE/NRO payments.'],
    ['key', 'Handover & leasing', 'Power of Attorney support, registration, and optional rental management after possession.'],
  ];
  const body = `
${pageHero('NRI Corner', 'Invest in India from anywhere in the world — with a dedicated NRI desk at every step.', 'photo-1436491865332-7a61a109cc05', crumbs)}
<section class="section">
  <div class="container">
    ${sectionHead('How it works', 'Buying from abroad, made simple', 'Our NRI desk serves customers in the UAE, USA, UK, Singapore, Australia and beyond.')}
    <div class="why-grid">
      ${steps.map(([i, t, d], n) => `<div class="why-card reveal"><span class="why-icon">${icon(i, 28)}</span><p class="step-no">Step ${n + 1}</p><h3>${t}</h3><p>${d}</p></div>`).join('')}
    </div>
  </div>
</section>
<section class="section section--navy">
  <div class="container split-grid">
    <div class="reveal">
      <p class="eyebrow">Why invest in Gurgaon</p>
      <h2>Global city. Local advantage.</h2>
      <ul class="check-list check-list--light">
        <li>${icon('check', 18)} Home to 250+ Fortune 500 company offices</li>
        <li>${icon('check', 18)} 20–30 minutes to IGI Airport from key corridors</li>
        <li>${icon('check', 18)} Strong rental demand from corporate professionals</li>
        <li>${icon('check', 18)} Infrastructure growth: Dwarka Expressway, metro extensions, SPR</li>
      </ul>
    </div>
    <div class="enquiry-card reveal"><h3>Talk to an NRI specialist</h3>${leadForm({ kind: 'nri', submit: 'Request a Call', compact: true })}</div>
  </div>
</section>
<section class="section">
  <div class="container narrow">
    ${sectionHead('FAQs', 'Frequently asked questions', '')}
    <div class="faq">${content.nriFaqs.map((f) => `<details class="reveal"><summary>${f.q}${icon('chevron-down', 20)}</summary><p>${f.a}</p></details>`).join('')}</div>
    <p class="fine center">General information only, based on FEMA guidelines as understood at the time of writing. Please consult a tax/legal advisor.</p>
  </div>
</section>`;
  return {
    path: '/nri-corner/', title: 'NRI Corner — Property Investment Guide for NRIs', description: 'Guide for NRIs and OCI cardholders buying property in Gurgaon & Noida: FEMA rules, NRI home loans, payments, power of attorney, taxation and repatriation.', body,
    schema: [breadcrumbSchema(crumbs), { '@type': 'FAQPage', mainEntity: content.nriFaqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }],
  };
}

function emi() {
  const crumbs = [{ name: 'EMI Calculator', path: '/emi-calculator/' }];
  const body = `
${pageHero('Home loan EMI calculator', 'Estimate your monthly instalment in seconds.', 'photo-1600585154340-be6161a56a0c', crumbs)}
<section class="section"><div class="container">${emiCalculator()}</div></section>
<section class="section section--cream"><div class="container narrow prose">
  <h2>How is EMI calculated?</h2>
  <p>EMI = P × r × (1 + r)<sup>n</sup> / ((1 + r)<sup>n</sup> − 1), where P is the loan amount, r is the monthly interest rate (annual rate ÷ 12 ÷ 100), and n is the number of monthly instalments.</p>
  <p>Banks typically finance up to 75–80% of the property value for loans above ₹75 lakh. Our home-loan desk works with 15+ banks and NBFCs to get you competitive rates.</p>
</div></section>
${enquirySection({ title: 'Need help with your home loan?' })}`;
  return { path: '/emi-calculator/', title: 'Home Loan EMI Calculator', description: 'Calculate your home loan EMI, total interest and total payable instantly. Get home-loan assistance from 15+ banks with Cyber Heights Properties.', body, schema: [breadcrumbSchema(crumbs)] };
}

function legal(path, title, desc, html) {
  const crumbs = [{ name: title, path }];
  return {
    path, title, description: desc, schema: [breadcrumbSchema(crumbs)],
    body: `${pageHero(title, '', 'photo-1486406146926-c627a92ad1ab', crumbs)}<section class="section"><div class="container narrow prose">${html}<p class="fine">Last updated: 1 October 2026. Placeholder text — have this reviewed by your legal counsel.</p></div></section>`,
  };
}

const legalPages = () => [
  legal('/privacy-policy/', 'Privacy Policy', `How ${site.name} collects, uses and protects your personal data.`, `
<p>${esc(site.legalName)} ("we", "us") respects your privacy. This policy explains how we handle personal data collected through this website, in line with the Digital Personal Data Protection Act, 2023.</p>
<h2>Information we collect</h2><p>When you submit a form, we collect your name, phone number, email address, project of interest and, for site visits, your preferred date and time. We also collect basic analytics (pages visited, device type, campaign source).</p>
<h2>How we use it</h2><ul><li>To respond to your enquiry and arrange site visits</li><li>To share project information, offers and updates you have consented to</li><li>To improve our website and services</li></ul>
<h2>Sharing</h2><p>We do not sell your data. We may share it with our CRM, telephony and channel partners strictly for responding to your enquiry, and with authorities when required by law.</p>
<h2>Your rights</h2><p>You may request access, correction or deletion of your data, or withdraw consent, by writing to <a href="mailto:${site.email}">${site.email}</a>.</p>
<h2>Cookies</h2><p>We use essential and analytics cookies. You can disable cookies in your browser settings.</p>`),
  legal('/disclaimer/', 'Disclaimer', 'Website disclaimer for Cyber Heights Properties.', `
<p>The content on this website is for information purposes only and does not constitute an offer, invitation or contract of any kind. Images, renders, floor plans, specifications and amenities shown are artistic impressions and indicative; they are subject to change as per approvals and the developer's discretion.</p>
<p>Prices, offers and payment plans are subject to change without prior notice. Prices are exclusive of GST, stamp duty, registration and other statutory charges unless stated otherwise.</p>
<p>Purchasers are advised to verify all details, including the RERA registration, approved plans and specifications, before making a booking. Nothing on this website is investment advice.</p>
<p>By submitting your details, you authorise ${esc(site.name)} and its representatives to contact you via call, SMS, email or WhatsApp, overriding any DNC/NDNC registration.</p>`),
  legal('/rera-disclosures/', 'RERA Disclosures', 'RERA registration numbers for all Cyber Heights Properties projects.', `
<p>All ${esc(site.name)} projects offered for sale are registered under the Real Estate (Regulation and Development) Act, 2016. Project details, approvals and quarterly progress reports can be verified on the respective state RERA portals.</p>
<div class="table-wrap"><table class="price-table"><thead><tr><th scope="col">Project</th><th scope="col">Location</th><th scope="col">RERA registration no.</th><th scope="col">Authority</th></tr></thead><tbody>
${projects.map((p) => `<tr><th scope="row"><a href="/projects/${p.slug}/">${esc(p.name)}</a></th><td>${esc(p.sector)}, ${esc(p.city)}</td><td>${esc(p.rera)}</td><td>${p.city === 'Noida' ? 'UP-RERA' : 'HARERA Gurugram'}</td></tr>`).join('')}
</tbody></table></div>
<p>Haryana RERA: <a href="https://haryanarera.gov.in" rel="noopener" target="_blank">haryanarera.gov.in</a> · UP RERA: <a href="https://up-rera.in" rel="noopener" target="_blank">up-rera.in</a></p>`),
];

function notFound() {
  return {
    path: '/404.html', title: 'Page not found', description: 'The page you are looking for does not exist.', noindex: true,
    body: `<section class="section notfound"><div class="container narrow center"><p class="eyebrow">404</p><h1>This address isn't on our map.</h1><p>The page you're looking for may have moved. Try one of our projects instead.</p><p><a class="btn btn--gold" href="/projects/">Explore projects</a> <a class="btn btn--outline" href="/">Go home</a></p></div></section>`,
  };
}

module.exports = { projectsListing, about, contact, blogIndex, blogPost, careers, nri, emi, legalPages, notFound };
