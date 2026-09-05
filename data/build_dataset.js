#!/usr/bin/env node
/*
 * Builds BG_partner_intelligence/data.js from the raw research JSON files.
 * Mirrors the field shape consumed by app-core.js (ported from
 * Uzbekistan 2.0 / Russia partner-intelligence apps): RETAIL_DATA,
 * PROYECTOS_DATA, DEVELOPMENTS_DATA.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const RESEARCH = path.join(ROOT, 'research');
const OUT = path.join(ROOT, 'BG_partner_intelligence', 'data.js');

function readJSON(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function slugify(s) {
  return String(s)
    .toLowerCase()
    .replace(/[^a-z0-9а-я]+/gi, (m) => transliterate(m))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Minimal Cyrillic -> Latin transliteration so ids stay ASCII-safe.
const CYR_MAP = {
  а:'a',б:'b',в:'v',г:'g',д:'d',е:'e',ж:'zh',з:'z',и:'i',й:'y',к:'k',л:'l',м:'m',
  н:'n',о:'o',п:'p',р:'r',с:'s',т:'t',у:'u',ф:'f',х:'h',ц:'ts',ч:'ch',ш:'sh',щ:'sht',
  ъ:'a',ь:'',ю:'yu',я:'ya'
};
function transliterate(s) {
  return s.split('').map((ch) => CYR_MAP[ch.toLowerCase()] || ch).join('');
}
function makeSlug(name, city) {
  return slugify(transliterate(String(name).toLowerCase()) + '-' + String(city || ''));
}

const usedIds = {};
function uniqueId(base) {
  let id = base || 'actor';
  let n = 2;
  while (usedIds[id]) {
    id = base + '-' + n;
    n++;
  }
  usedIds[id] = true;
  return id;
}

const SERVICE_SCOPE_MAP = {
  'Design only': 'Design only',
  'Design+installation+supply': 'Design+Install+Supply',
  'Design+construction+development': 'Design+Construction+Development',
  'Not determinable': 'Not determinable',
  '': 'Not determinable'
};

const MAIN_CHANNEL_MAP = {
  'Own website': 'Website',
  'Instagram': 'Instagram',
  'Facebook': 'Facebook',
  'LinkedIn': 'LinkedIn',
  'Multiple': 'Multiple'
};

function joinArr(arr, sep) {
  if (!Array.isArray(arr) || !arr.length) return '';
  return arr.join(sep);
}

function buildRawNotes(rec, extra) {
  const parts = [];
  if (rec.summary) parts.push(rec.summary);
  if (extra) parts.push(extra);
  return parts.join(' ');
}

function normalizeActor(rec, opts) {
  opts = opts || {};
  const city = rec.city_or_zone || 'Unknown';
  const base = makeSlug(rec.name, city);
  const id = uniqueId(base);

  let extraNote = '';
  if (rec.project_name && rec.project_name !== 'No commercial name identified') {
    extraNote = 'Linked project: ' + rec.project_name + '.';
  }

  return {
    id_actor: id,
    name: rec.name,
    city: city,
    typology: rec.typology,
    typology_detail: rec.hybrid_detail || '',
    channel: opts.channel,
    canal_secundario: '',
    project_type: opts.projectType || '',
    physical_exhibition: rec.physical_exposure || 'Not determinable',
    exhibition_evidence: rec.physical_exposure_evidence || '',
    price_range: rec.price_signal || 'Not determinable',
    price_signal: rec.price_evidence || '',
    service_scope: SERVICE_SCOPE_MAP[rec.service_breadth] || 'Not determinable',
    email: rec.email || '',
    phone: rec.phone || '',
    address: rec.address || 'Not determinable',
    main_channel: MAIN_CHANNEL_MAP[rec.source_channel] || 'Multiple',
    source_language: rec.content_language || 'Not determinable',
    source_url: joinArr(rec.source_urls, ' ; '),
    materials_brands_mentioned: joinArr(rec.materials_brands, ', '),
    key_messages: joinArr(rec.key_messages, ' | '),
    project_volume_note: rec.project_volume_note || '',
    raw_notes: buildRawNotes(rec, extraNote),
    data_source: 'firecrawl_research_2026_09',
    tool_used: 'firecrawl_search + firecrawl_scrape',
    _source_file: opts.sourceFile
  };
}

function normalizeDevelopment(dev) {
  return {
    project_name: dev.project_name,
    developer: dev.developer || 'Not determinable',
    location: dev.location || 'Not determinable',
    status: dev.status || 'Not determinable',
    scale: dev.scale || 'Not determinable',
    estimated_delivery: dev.estimated_delivery || 'Not determinable',
    source_url: joinArr(dev.source_urls, ' ; '),
    notes: joinArr(dev.linked_actors, ', ') ? ('Linked actors: ' + joinArr(dev.linked_actors, ', ')) : ''
  };
}

// ---- Retail ----
const retailFiles = ['retail_sofia.json', 'retail_plovdiv.json', 'retail_varna.json', 'retail_burgas.json'];
let RETAIL_DATA = [];
retailFiles.forEach((f) => {
  const recs = readJSON(path.join(RESEARCH, f));
  recs.forEach((r) => {
    RETAIL_DATA.push(normalizeActor(r, { channel: 'Retail', sourceFile: f }));
  });
});

// ---- Proyectos (Volume + Tourism) ----
let PROYECTOS_DATA = [];
const volumeRecs = readJSON(path.join(RESEARCH, 'projects_volume.json'));
volumeRecs.forEach((r) => {
  PROYECTOS_DATA.push(normalizeActor(r, { channel: 'Proyectos', projectType: 'Volume', sourceFile: 'projects_volume.json' }));
});
const tourismRecs = readJSON(path.join(RESEARCH, 'projects_tourism.json'));
tourismRecs.forEach((r) => {
  PROYECTOS_DATA.push(normalizeActor(r, { channel: 'Proyectos', projectType: 'Tourism', sourceFile: 'projects_tourism.json' }));
});

// ---- Developments ----
let DEVELOPMENTS_DATA = [];
const tourismDevs = readJSON(path.join(RESEARCH, 'projects_tourism_developments.json'));
tourismDevs.forEach((d) => DEVELOPMENTS_DATA.push(normalizeDevelopment(d)));
const volumeDevs = readJSON(path.join(ROOT, 'data', 'developments_volume.json'));
volumeDevs.forEach((d) => DEVELOPMENTS_DATA.push(normalizeDevelopment(d)));

// ---- Write output ----
const banner = '/*!\n * Bulgaria Partner Intelligence — dataset.\n' +
  ' * Generated by data/build_dataset.js from research/*.json — do not hand-edit.\n' +
  ' * RETAIL_DATA: ' + RETAIL_DATA.length + ' | PROYECTOS_DATA: ' + PROYECTOS_DATA.length + ' | DEVELOPMENTS_DATA: ' + DEVELOPMENTS_DATA.length + '\n */\n';

const out = banner +
  'window.RETAIL_DATA = ' + JSON.stringify(RETAIL_DATA, null, 2) + ';\n' +
  'window.PROYECTOS_DATA = ' + JSON.stringify(PROYECTOS_DATA, null, 2) + ';\n' +
  'window.DEVELOPMENTS_DATA = ' + JSON.stringify(DEVELOPMENTS_DATA, null, 2) + ';\n';

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, out, 'utf8');

console.log('Wrote', OUT);
console.log('RETAIL_DATA:', RETAIL_DATA.length);
console.log('PROYECTOS_DATA:', PROYECTOS_DATA.length, '(Volume:', PROYECTOS_DATA.filter(r => r.project_type === 'Volume').length, '/ Tourism:', PROYECTOS_DATA.filter(r => r.project_type === 'Tourism').length, ')');
console.log('DEVELOPMENTS_DATA:', DEVELOPMENTS_DATA.length);

// Sanity check: duplicate ids should be impossible given uniqueId(), but verify anyway.
const allIds = RETAIL_DATA.concat(PROYECTOS_DATA).map(r => r.id_actor);
const dupes = allIds.filter((id, i) => allIds.indexOf(id) !== i);
if (dupes.length) {
  console.error('DUPLICATE IDS FOUND:', dupes);
  process.exit(1);
}
