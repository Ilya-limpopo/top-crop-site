export const DEFAULT_PHOTOS: Record<string, string> = {
  'aerial plantation view':  'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1200&q=82&fit=crop&auto=format',
  'banana harvest':          'https://images.unsplash.com/photo-1528825871115-3581a5387919?w=900&q=82&fit=crop&auto=format',
  'field workers':           'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=700&q=82&fit=crop&auto=format',
  'palm nursery':            'https://images.unsplash.com/photo-1448375240586-882707db888b?w=700&q=82&fit=crop&auto=format',
  'quality check':           'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=700&q=82&fit=crop&auto=format',
  'banana bunch close-up':   'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=900&q=82&fit=crop&auto=format',
  'palm fruit cluster':      'https://images.unsplash.com/photo-1586771107445-d3ca888129ce?w=900&q=82&fit=crop&auto=format',
  'ESG annual report':       'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=900&q=82&fit=crop&auto=format',
  'banana plantation rows':  'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=1400&q=82&fit=crop&auto=format',
  'palm tree canopy':        'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=700&q=82&fit=crop&auto=format',
  'harvesting team':         'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=700&q=82&fit=crop&auto=format',
  'processing facility':     'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=700&q=82&fit=crop&auto=format',
  'export packaging':        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&q=82&fit=crop&auto=format',
  'irrigation system':       'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=700&q=82&fit=crop&auto=format',
  'sunrise over farm':       'https://images.unsplash.com/photo-1476041800959-2f6bb412c8ce?w=700&q=82&fit=crop&auto=format',
  'soil sampling':           'https://images.unsplash.com/photo-1416339306562-f3d12fefd36f?w=700&q=82&fit=crop&auto=format',
};

export const DEFAULT_CONTENT: Record<string, string> = {
  'hero.headline':               "From Tanzania's Fertile Soil to the World's Table.",
  'hero.sub':                    "We grow premium bananas and sustainable palm oil across East Africa's most productive land — connecting Tanzanian agriculture to global markets.",
  'about.headline':              'Rooted in Tanzania, Reaching the World',
  'about.body1':                 "Founded in 2024, Top Crop is one of East Africa's leading agricultural producers. We operate across Tanzania's most fertile regions — from the slopes of Kilimanjaro to the coastal lowlands — cultivating bananas and oil palms with generational expertise and modern sustainability practices.",
  'about.body2':                 'Our mission is to produce the finest crops while creating lasting value for local communities, international partners, and our natural environment.',
  'products.banana.title':       'Premium Bananas',
  'products.banana.body':        'Our Cavendish and specialty banana varieties are grown at altitude across Northern Tanzania. Consistent in size, flavor, and shelf-life — ideal for export to Europe, the Middle East, and Asia.',
  'products.palm.title':         'Palm Oil',
  'products.palm.body':          'Sustainably produced crude and refined palm oil from our coastal and lowland plantations. RSPO-certified, fully traceable from field to barrel, meeting the highest global standards.',
  'sustainability.headline':     'Growth That Gives Back',
  'sustainability.body':         'At Top Crop, sustainability is not a certification — it is how we farm. We report annually against GRI standards and maintain open partnerships with NGOs and government bodies across Tanzania.',
};

export const DEFAULT_NEWS = [
  { date: 'March 2026',    category: 'Press Release',  title: 'Top Crop Expands to Morogoro Region',        body: 'We announce the acquisition of 800 additional hectares in the Morogoro valley, increasing banana production capacity by 30%.' },
  { date: 'February 2026', category: 'Sustainability', title: 'RSPO Certification Renewed for Third Year',  body: 'Our palm oil division maintained its Roundtable on Sustainable Palm Oil certification following rigorous third-party audits.' },
  { date: 'January 2026',  category: 'Partnership',    title: 'New EU Distribution Agreement Signed',       body: 'A 3-year supply agreement securing distribution across 12 European countries begins Q2 2026.' },
];

export const DEFAULT_CAREERS = [
  { title: 'Agronomy Manager',             location: 'Kilimanjaro Region',  type: 'Full-time' },
  { title: 'Export Logistics Coordinator', location: 'Dar es Salaam',       type: 'Full-time' },
  { title: 'Sustainability Analyst',       location: 'Remote / Arusha',     type: 'Full-time' },
];

export const DEFAULT_SETTINGS: Record<string, string> = {
  email:      'hello@topcrop.tz',
  phone:      '+255 27 250 4000',
  hq:         'Dar es Salaam, Tanzania',
  processing: 'Nyamwage, Rufiji District',
};

export type SiteData = {
  content:  Record<string, string>;
  news:     { id: number; date: string; category: string; title: string; body: string }[];
  careers:  { id: number; title: string; location: string; type: string }[];
  photos:   Record<string, string>;
  settings: Record<string, string>;
};
