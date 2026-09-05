#!/usr/bin/env node
// Computes the quantitative analysis (coverage, scoring, top candidates) used to
// write report_en.md, using the exact same scoring model as the live dashboard.
const fs = require('fs');
const path = require('path');

global.window = {};
global.sessionStorage = { getItem(){return null}, setItem(){} };
global.document = { querySelectorAll: () => [], getElementById: () => null, addEventListener: () => {}, documentElement: {} };

const APP_DIR = path.join(__dirname, '..', 'BG_partner_intelligence');
eval(fs.readFileSync(path.join(APP_DIR, 'data.js'), 'utf8'));
eval(fs.readFileSync(path.join(APP_DIR, 'app-core.js'), 'utf8'));
const AC = window.AppCore;

const RETAIL = window.RETAIL_DATA;
const PROY = window.PROYECTOS_DATA;
const DEV = window.DEVELOPMENTS_DATA;

function scored(list, channel) {
  return list.map(r => ({ r, score: AC.computeScore(r, channel, 'en') }));
}

const retailScored = scored(RETAIL, 'retail');
const proyScored = scored(PROY, 'proyectos');

// ---- Coverage: typology x exhibition, by city (retail) ----
console.log('=== RETAIL: typology x exhibition, by city ===');
const cities = [...new Set(RETAIL.map(r => r.city))].sort();
cities.forEach(city => {
  console.log('--', city, '(' + RETAIL.filter(r=>r.city===city).length + ' total)');
  const byTypology = {};
  RETAIL.filter(r => r.city === city).forEach(r => {
    byTypology[r.typology] = byTypology[r.typology] || { Yes: 0, No: 0, 'Not determinable': 0 };
    byTypology[r.typology][r.physical_exhibition] = (byTypology[r.typology][r.physical_exhibition] || 0) + 1;
  });
  Object.keys(byTypology).sort().forEach(ty => {
    const c = byTypology[ty];
    console.log('   ', ty.padEnd(26), 'Yes:', c.Yes||0, ' No:', c.No||0, ' ND:', c['Not determinable']||0);
  });
});

console.log('\n=== RETAIL: price_range distribution ===');
const priceCount = {};
RETAIL.forEach(r => priceCount[r.price_range] = (priceCount[r.price_range]||0)+1);
console.log(priceCount);

console.log('\n=== RETAIL: service_scope distribution ===');
const svcCount = {};
RETAIL.forEach(r => svcCount[r.service_scope] = (svcCount[r.service_scope]||0)+1);
console.log(svcCount);

console.log('\n=== PROYECTOS: typology x project_type ===');
const pt = {};
PROY.forEach(r => {
  pt[r.typology] = pt[r.typology] || { Volume: 0, Tourism: 0 };
  pt[r.typology][r.project_type] = (pt[r.typology][r.project_type]||0) + 1;
});
Object.keys(pt).sort().forEach(ty => console.log('   ', ty.padEnd(22), pt[ty]));

console.log('\n=== PROYECTOS: exhibition ===');
const pe = {};
PROY.forEach(r => pe[r.physical_exhibition] = (pe[r.physical_exhibition]||0)+1);
console.log(pe);

// ---- Competitive materials mentioned ----
console.log('\n=== Competitive materials/brands mentioned (retail) ===');
console.log(AC.computeCompetitive(RETAIL).slice(0, 15));
console.log('\n=== Competitive materials/brands mentioned (proyectos) ===');
console.log(AC.computeCompetitive(PROY).slice(0, 15));

// ---- Top candidates overall (retail + proyectos combined) ----
console.log('\n=== TOP 20 CANDIDATES BY SCORE (all channels) ===');
const combined = retailScored.map(x => ({...x, channel: 'Retail'})).concat(proyScored.map(x => ({...x, channel: x.r.project_type === 'Tourism' ? 'Projects-Tourism' : 'Projects-Volume'})));
combined.sort((a,b) => b.score.total - a.score.total);
combined.slice(0, 20).forEach((x, i) => {
  console.log((i+1)+'.', x.r.name, '|', x.channel, '|', x.r.city, '|', x.r.typology, '| score', x.score.total, x.score.tier, '| exhib:', x.r.physical_exhibition, '| price:', x.r.price_range);
});

console.log('\n=== High-tier count ===');
console.log('Retail High:', retailScored.filter(x=>x.score.tier==='High').length, '/ Medium:', retailScored.filter(x=>x.score.tier==='Medium').length, '/ Low:', retailScored.filter(x=>x.score.tier==='Low').length);
console.log('Proyectos High:', proyScored.filter(x=>x.score.tier==='High').length, '/ Medium:', proyScored.filter(x=>x.score.tier==='Medium').length, '/ Low:', proyScored.filter(x=>x.score.tier==='Low').length);

console.log('\n=== Developments by status ===');
const devStatus = {};
DEV.forEach(d => devStatus[d.status] = (devStatus[d.status]||0)+1);
console.log(devStatus);

console.log('\n=== All developments (name | developer | location | status) ===');
DEV.forEach(d => console.log('-', d.project_name, '|', d.developer, '|', d.location, '|', d.status));
