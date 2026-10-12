// ─────────────────────────────────────────────────────────────────────────────
// LISTINGS — flats for RENT and for SALE (BUY). Add, edit or remove an entry and
// run `npm run build`. Each listing appears on /rent/ or /buy/ and on its
// society's page (/sector-76/<society>/).
//
//   id        unique reference shared with clients (e.g. on WhatsApp)
//   purpose   'rent' | 'buy'
//   society   slug from data/sector76.js
//   price     rent → ₹ per month · buy → ₹ lakhs (100 = ₹1 Cr)
//   area      sq ft, areaType: 'carpet' | 'super' | 'built-up'
//   furnishing 'Unfurnished' | 'Semi-furnished' | 'Fully furnished'
//   sale      buy only: 'Resale' | 'New booking' | 'Allotment transfer'
//   image     Unsplash photo ID, full URL or /assets/... path
//
// The entries below are SAMPLE listings priced on current Sector 76 market
// rates — replace them with your live inventory.
// ─────────────────────────────────────────────────────────────────────────────
const IMG = {
  living: 'photo-1600607687939-ce8a6c25118c',
  living2: 'photo-1600210492486-724fe5c67fb0',
  bedroom: 'photo-1560448204-e02f11c3d0e2',
  bedroom2: 'photo-1502672260266-1c1ef2d93688',
  kitchen: 'photo-1600210492486-724fe5c67fb0',
  room: 'photo-1522708323590-d24dbb6b0267',
  tower: 'photo-1545324418-cc1a3fa10c00',
  tower2: 'photo-1460317442991-0ec209397118',
};

module.exports = [
  // ── RENT ──────────────────────────────────────────────────────────────────
  { id: 'R-7601', purpose: 'rent', society: 'suncity-avenue-76', bhk: 2, bath: 2, area: 682, areaType: 'super', price: 22000, furnishing: 'Semi-furnished', floor: '10 of 14', facing: 'East', available: 'Immediate', tenants: 'Family', image: IMG.living2 },
  { id: 'R-7602', purpose: 'rent', society: 'suncity-avenue-76', bhk: 2, bath: 2, area: 735, areaType: 'super', price: 36000, furnishing: 'Fully furnished', floor: '8 of 14', facing: 'North', available: 'Immediate', tenants: 'Any', image: IMG.living },
  { id: 'R-7603', purpose: 'rent', society: 'suncity-avenue-76', bhk: 2, bath: 2, area: 582, areaType: 'carpet', price: 24000, furnishing: 'Semi-furnished', floor: '3 of 12', facing: 'West', available: '1 Nov 2026', tenants: 'Family', image: IMG.bedroom },
  { id: 'R-7604', purpose: 'rent', society: 'suncity-avenue-76', bhk: 2, bath: 2, area: 635, areaType: 'built-up', price: 21000, furnishing: 'Unfurnished', floor: '3 of 14', facing: 'East', available: 'Immediate', tenants: 'Any', image: IMG.room },
  { id: 'R-7605', purpose: 'rent', society: 'pyramid-pride', bhk: 2, bath: 2, area: 680, areaType: 'built-up', price: 25000, furnishing: 'Fully furnished', floor: '1 of 15', facing: 'North-East', available: 'Immediate', tenants: 'Any', image: IMG.living2 },
  { id: 'R-7606', purpose: 'rent', society: 'pyramid-pride', bhk: 2, bath: 2, area: 698, areaType: 'super', price: 15000, furnishing: 'Unfurnished', floor: '9 of 15', facing: 'South', available: 'Immediate', tenants: 'Family', image: IMG.bedroom2 },
  { id: 'R-7607', purpose: 'rent', society: 'pyramid-pride', bhk: 2, bath: 2, area: 600, areaType: 'built-up', price: 18000, furnishing: 'Semi-furnished', floor: '5 of 14', facing: 'East', available: '15 Nov 2026', tenants: 'Bachelors', image: IMG.room },
  { id: 'R-7608', purpose: 'rent', society: 'corona-gracieux', bhk: 3, bath: 3, area: 1960, areaType: 'super', price: 45000, furnishing: 'Fully furnished', floor: '6 of 14', facing: 'East', available: 'Immediate', tenants: 'Family', image: IMG.living },
  { id: 'R-7609', purpose: 'rent', society: 'corona-gracieux', bhk: 3, bath: 3, area: 1765, areaType: 'super', price: 36000, furnishing: 'Semi-furnished', floor: '2 of 14', facing: 'North', available: 'Immediate', tenants: 'Family', image: IMG.kitchen },
  { id: 'R-7610', purpose: 'rent', society: 'corona-gracieux', bhk: 4, bath: 4, area: 2650, areaType: 'super', price: 50000, furnishing: 'Semi-furnished', floor: '11 of 14', facing: 'Park-facing', available: '1 Dec 2026', tenants: 'Family', image: IMG.living2 },
  { id: 'R-7611', purpose: 'rent', society: 'ninex-city', bhk: 4, bath: 4, area: 2842, areaType: 'built-up', price: 55000, furnishing: 'Semi-furnished', floor: '8 of 25', facing: 'East', available: 'Immediate', tenants: 'Family', image: IMG.living },
  { id: 'R-7612', purpose: 'rent', society: 'ninex-city', bhk: 3, bath: 3, area: 1952, areaType: 'super', price: 45000, furnishing: 'Semi-furnished', floor: '14 of 25', facing: 'North-East', available: 'Immediate', tenants: 'Any', image: IMG.bedroom },
  { id: 'R-7613', purpose: 'rent', society: 'ninex-city', bhk: 4, bath: 5, area: 2842, areaType: 'super', price: 69000, furnishing: 'Fully furnished', floor: '20 of 25', facing: 'Park-facing', available: '1 Nov 2026', tenants: 'Family', image: IMG.kitchen },
  { id: 'R-7614', purpose: 'rent', society: 'whiteland-blissville', bhk: 3, bath: 3, area: 1672, areaType: 'super', price: 45000, furnishing: 'Semi-furnished', floor: '2 of 4', facing: 'East', available: 'Immediate', tenants: 'Family', image: IMG.room },
  { id: 'R-7615', purpose: 'rent', society: 'whiteland-blissville', bhk: 3, bath: 3, area: 1662, areaType: 'built-up', price: 47000, furnishing: 'Semi-furnished', floor: '1 of 4', facing: 'North', available: 'Immediate', tenants: 'Family', image: IMG.living2 },

  // ── BUY ───────────────────────────────────────────────────────────────────
  { id: 'S-7601', purpose: 'buy', sale: 'Resale', society: 'suncity-avenue-76', bhk: 2, bath: 2, area: 682, areaType: 'carpet', price: 84, furnishing: 'Semi-furnished', floor: '7 of 14', facing: 'East', image: IMG.living2 },
  { id: 'S-7602', purpose: 'buy', sale: 'Resale', society: 'suncity-avenue-76', bhk: 2, bath: 2, area: 735, areaType: 'carpet', price: 90, furnishing: 'Unfurnished', floor: '12 of 14', facing: 'North', image: IMG.room },
  { id: 'S-7603', purpose: 'buy', sale: 'Resale', society: 'pyramid-pride', bhk: 2, bath: 2, area: 678, areaType: 'carpet', price: 67, furnishing: 'Unfurnished', floor: '4 of 15', facing: 'East', image: IMG.bedroom2 },
  { id: 'S-7604', purpose: 'buy', sale: 'Resale', society: 'pyramid-pride', bhk: 2, bath: 2, area: 698, areaType: 'carpet', price: 70, furnishing: 'Semi-furnished', floor: '11 of 15', facing: 'West', image: IMG.living },
  { id: 'S-7605', purpose: 'buy', sale: 'Resale', society: 'corona-gracieux', bhk: 3, bath: 3, area: 1960, areaType: 'super', price: 225, furnishing: 'Semi-furnished', floor: '9 of 14', facing: 'East', image: IMG.living },
  { id: 'S-7606', purpose: 'buy', sale: 'Resale', society: 'corona-gracieux', bhk: 4, bath: 4, area: 2650, areaType: 'super', price: 305, furnishing: 'Semi-furnished', floor: '12 of 14', facing: 'Park-facing', image: IMG.kitchen },
  { id: 'S-7607', purpose: 'buy', sale: 'Resale', society: 'ninex-city', bhk: 3, bath: 3, area: 1952, areaType: 'super', price: 115, furnishing: 'Unfurnished', floor: '5 of 25', facing: 'North', image: IMG.bedroom },
  { id: 'S-7608', purpose: 'buy', sale: 'Resale', society: 'ninex-city', bhk: 4, bath: 4, area: 2863, areaType: 'super', price: 175, furnishing: 'Semi-furnished', floor: '16 of 25', facing: 'East', image: IMG.living2 },
  { id: 'S-7609', purpose: 'buy', sale: 'Resale', society: 'whiteland-blissville', bhk: 3, bath: 3, area: 1600, areaType: 'super', price: 245, furnishing: 'Unfurnished', floor: '3 of 4', facing: 'East', image: IMG.room },
  { id: 'S-7610', purpose: 'buy', sale: 'Allotment transfer', society: 'whiteland-the-aspen', bhk: 3, bath: 4, area: 2937, areaType: 'super', price: 445, furnishing: 'Unfurnished', floor: 'Mid floor', facing: 'Aravalli-facing', image: IMG.tower },
  { id: 'S-7611', purpose: 'buy', sale: 'New booking', society: 'whiteland-the-aspen', bhk: 4, bath: 5, area: 4054, areaType: 'super', price: 620, furnishing: 'Unfurnished', floor: 'High floor', facing: 'Golf-facing', image: IMG.tower2 },
  { id: 'S-7612', purpose: 'buy', sale: 'New booking', society: 'whiteland-aspen-one', bhk: 3, bath: 4, area: 2750, areaType: 'super', price: 450, furnishing: 'Unfurnished', floor: 'Mid floor', facing: 'East', image: IMG.tower },
  { id: 'S-7613', purpose: 'buy', sale: 'Allotment transfer', society: 'dlf-privana-south', bhk: 4, bath: 5, area: 3577, areaType: 'super', price: 790, furnishing: 'Unfurnished', floor: 'High floor', facing: 'Central green', image: IMG.tower2 },
  { id: 'S-7614', purpose: 'buy', sale: 'Allotment transfer', society: 'dlf-privana-west', bhk: 4, bath: 5, area: 3577, areaType: 'super', price: 900, furnishing: 'Unfurnished', floor: 'Mid floor', facing: 'East', image: IMG.tower },
  { id: 'S-7615', purpose: 'buy', sale: 'New booking', society: 'dlf-privana-north', bhk: 4, bath: 5, area: 3977, areaType: 'super', price: 994, furnishing: 'Unfurnished', floor: 'High floor', facing: 'Aravalli-facing', image: IMG.tower2 },
];
