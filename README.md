# Cyber Heights Properties — Real Estate Website

Zero-dependency static site generator (Node 18+). All brand names, projects, RERA numbers, prices, people and testimonials are **sample placeholders**.

```bash
npm run build   # generates ./dist
npm run serve   # preview at http://localhost:4175
npm run dev     # build + serve
```

Deploy the `dist/` folder to any static host (Netlify, Vercel, Cloudflare Pages, S3 + CloudFront).

## Where to edit
| What | File |
|---|---|
| Brand name, phone, WhatsApp, email, offices, lead endpoint, popup delay | `site.config.js` |
| Sector 76 locality facts + societies (each → /sector-76/&lt;slug&gt;/) | `data/sector76.js` |
| Flats for rent / sale (shown on /rent/, /buy/ and the society page) | `data/listings.js` |
| Projects (each entry → full project page, brochure page, listing card, sitemap, schema) | `data/projects.js` |
| Hero slides, stats, why-us, awards, testimonials, team, timeline, jobs, NRI FAQs | `data/content.js` |
| Blog posts | `data/blog.js` |
| Colours / fonts (CSS tokens at the top) | `assets/css/main.css` |
| Interactions (sliders, forms, filters, EMI, popup) | `assets/js/main.js` |
| Page templates | `src/pages/*.js`, shared layout in `src/layout.js` |

## Adding a rent / sale listing
Add an object to `data/listings.js` with a unique `id`, `purpose: 'rent'` or `'buy'`, and the `society` slug from `data/sector76.js`. Rent is in ₹/month; sale price is in ₹ lakhs. Run `npm run build`. Enquiries from a listing reach the API with the intent, society and listing ID in the `project` field, e.g. `Rent · Pyramid Pride · R-7605`.

## Adding a project
Copy an object in `data/projects.js`, change the `slug` and details, run `npm run build`. Images accept an Unsplash photo ID, a full URL, or a local `/assets/...` path. Set `video` to a YouTube ID to enable the walkthrough player.

## Leads — FastAPI backend
Every form posts to the FastAPI service in `backend/` (see `backend/README.md`):
```bash
npm run api:setup   # first time
npm run api         # API on http://localhost:8002 (docs: /docs)
npm run dev         # website on http://localhost:4175
```
For production, build with `LEAD_ENDPOINT=https://api.yourdomain.com/api/leads npm run build`.
Building with `LEAD_ENDPOINT=""` falls back to storing leads in the browser's `localStorage` (offline demo).
