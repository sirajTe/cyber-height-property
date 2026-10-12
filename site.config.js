// Global site settings. Change the brand, contact details and lead endpoint here.
module.exports = {
  name: 'Cyber Heights Properties',
  shortName: 'Cyber Heights',
  // Two-line wordmark shown next to the logo symbol
  logoTop: 'CYBER HEIGHTS',
  logoBottom: 'PROPERTIES',
  legalName: 'Cyber Heights Properties',
  tagline: 'Your Trusted Real Estate Partner in Gurgaon.',
  city: 'Gurgaon',
  // Absolute production URL (no trailing slash) — used for canonical tags, sitemap and schema.
  url: 'https://chpgurgaon.com',
  founded: 2022,
  phone: '+91 95403 00008',
  phoneRaw: '+919540300008',
  whatsapp: '919540300008', // country code + number, digits only
  email: 'cyberheightsproperties005@gmail.com',
  careersEmail: 'cyberheightsproperties005@gmail.com',
  offices: [
    { name: 'Head Office', address: 'Near Radharani Marbles, Darbaripur Road, Kherki Daula, Sector 76, Gurugram, Haryana', phone: '+91 95403 00008' },
    { name: 'Suncity Avenue Office', address: 'A2-Block, Shop No. 005, Suncity Avenue, Sector 76, Gurugram, Haryana', phone: '+91 95403 00008' },
  ],
  social: {},
  // POST endpoint for every lead form — the FastAPI backend in /backend.
  // Override at build time: LEAD_ENDPOINT=https://api.yourdomain.com/api/leads npm run build
  // Set LEAD_ENDPOINT="" to fall back to saving leads in the browser's localStorage (offline demo).
  leadEndpoint: process.env.LEAD_ENDPOINT ?? 'http://localhost:8002/api/leads',
  // Seconds before the enquiry popup appears (also triggers on exit intent on desktop). Shows once per session.
  popupDelay: 15,
};
