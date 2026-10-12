// Static site generator: `npm run build` → ./dist
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const site = require('./site.config');
const projects = require('./data/projects');
const posts = require('./data/blog');
const { layout } = require('./src/layout');
const home = require('./src/pages/home');
const projectPage = require('./src/pages/project');
const P = require('./src/pages/other');

const OUT = path.join(__dirname, 'dist');
fs.rmSync(OUT, { recursive: true, force: true });

const copyDir = (from, to) => {
  fs.mkdirSync(to, { recursive: true });
  for (const f of fs.readdirSync(from, { withFileTypes: true })) {
    const a = path.join(from, f.name), b = path.join(to, f.name);
    f.isDirectory() ? copyDir(a, b) : fs.copyFileSync(a, b);
  }
};
copyDir(path.join(__dirname, 'assets'), path.join(OUT, 'assets'));
// Light CSS minification (comments + whitespace).
for (const f of ['main.css', 'brochure.css']) {
  const p = path.join(OUT, 'assets/css', f);
  fs.writeFileSync(p, fs.readFileSync(p, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').replace(/\s*([{};,>])\s*/g, '$1').replace(/;}/g, '}').trim());
}

const version = crypto.createHash('md5')
  .update(fs.readFileSync('assets/css/main.css')).update(fs.readFileSync('assets/js/main.js'))
  .digest('hex').slice(0, 8);

const write = (urlPath, html) => {
  const file = urlPath.endsWith('.html') ? path.join(OUT, urlPath) : path.join(OUT, urlPath, 'index.html');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
};

const pages = [
  home(),
  P.projectsListing(),
  ...projects.map(projectPage),
  P.about(), P.contact(), P.blogIndex(), ...posts.map(P.blogPost),
  P.careers(), P.nri(), P.emi(), ...P.legalPages(), P.notFound(),
];

const slugs = new Set();
for (const p of projects) {
  if (slugs.has(p.slug)) throw new Error(`Duplicate project slug: ${p.slug}`);
  slugs.add(p.slug);
}

for (const page of pages) write(page.path, layout({ ...page, version }));
for (const p of projects) write(`/projects/${p.slug}/brochure/`, projectPage.brochure(p));

const today = new Date().toISOString().slice(0, 10);
const urls = pages.filter((p) => !p.noindex).map((p) => p.path);
fs.writeFileSync(path.join(OUT, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((u) => `  <url><loc>${site.url}${u}</loc><lastmod>${today}</lastmod><priority>${u === '/' ? '1.0' : u.startsWith('/projects/') ? '0.9' : '0.6'}</priority></url>`)
    .join('\n')}\n</urlset>\n`);
fs.writeFileSync(path.join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /projects/*/brochure/\n\nSitemap: ${site.url}/sitemap.xml\n`);

console.log(`Built ${pages.length + projects.length} pages → dist/ (assets v${version})`);
