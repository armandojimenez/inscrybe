// The landing page (plan 17.6): English at the root, Spanish at /es/, from strings/<locale>.mjs and page.mjs, into the
// landing's own repository, this one (~/development/landings/inscrybe_landing, served at https://armandojimenez.dev/inscrybe/;
// the generator in src/ since Android's 16.4, moved from the iOS repo's store-release/landing).
// The pictures are assets.py's (assets/manifest.json); the styles and the hero's light are site/'s; behavior.js is the
// landing skill's (contact copy, snackbar, the header's scrolled state).
//   node build.mjs

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { page } from './page.mjs';
import en from './strings/en.mjs';
import es from './strings/es.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SITE = path.resolve(HERE, '..');
const SKILL = path.join(os.homedir(), '.claude/skills/app-landing-page');
const ORIGIN = 'https://armandojimenez.dev/inscrybe/';
// The stores' ids and the contact address (app.json: the apps' ledgers' and dossiers' own values)
const APP = JSON.parse(fs.readFileSync(path.join(HERE, 'app.json'), 'utf8'));
// "Coming soon" until Inscrybe is on sale: the build asks the App Store (its public lookup) whether the app is out. Not yet:
// the badge links nowhere, "Coming soon" sits beside it, the closing says it's coming. Out: the badge links to its page,
// the closing says it's on the App Store, Safari shows the Smart App Banner and the structured data gets the download
// link. So once version 1.0 is out (17.10), building again and pushing the landing is the whole change. `--on-sale` or
// `--not-on-sale` decides instead.
// A lookup that doesn't say either way (no answer, a server error, a redirect to a consent page) stops the build:
// building "Coming soon" over a store page that may be live would take the badge's link off the page.
function undecided(store, why, flags) {
  console.error(`✗ the ${store} lookup didn't say (${why}): build again, or decide with ${flags}`);
  process.exit(1);
}
async function onSale(id) {
  if (process.argv.includes('--on-sale')) return true;
  if (process.argv.includes('--not-on-sale')) return false;
  const flags = '--on-sale or --not-on-sale';
  let r, body;
  try {
    r = await fetch(`https://itunes.apple.com/lookup?id=${id}&country=us`, { signal: AbortSignal.timeout(8000) });
  } catch (err) { undecided('App Store', err.message, flags); }
  if (!r.ok) undecided('App Store', `HTTP ${r.status}`, flags);
  try { body = await r.json(); } catch { undecided('App Store', 'not JSON', flags); }
  if (typeof body.resultCount !== 'number') undecided('App Store', 'no resultCount', flags);
  return body.resultCount > 0;
}
const ON_SALE = await onSale(APP.ascAppId);
console.log(ON_SALE ? '✓ Inscrybe is on the App Store: the badge links to it' : '· Inscrybe is not on sale yet: "Coming soon"');

// Google Play the same way (Android's 16.4): its listing's public page answers once Inscrybe is published there (a 404
// before), so 16.5's production release and one build more turn the Play badge into a link. `--on-play` or `--not-on-play`
// decides instead.
const PLAY_URL = `https://play.google.com/store/apps/details?id=${APP.packageName}`;
async function onPlay() {
  if (process.argv.includes('--on-play')) return true;
  if (process.argv.includes('--not-on-play')) return false;
  const flags = '--on-play or --not-on-play';
  let r;
  try {
    r = await fetch(`${PLAY_URL}&hl=en`, { signal: AbortSignal.timeout(8000), redirect: 'manual' });
  } catch (err) { undecided('Google Play', err.message, flags); }
  if (r.status === 200) return true;
  if (r.status === 404) return false;
  undecided('Google Play', `HTTP ${r.status}`, flags);
}
const ON_PLAY = await onPlay();
console.log(ON_PLAY ? '✓ Inscrybe is on Google Play: its badge links to it' : '· Inscrybe is not on Google Play yet: "Coming soon"');

const manifest = JSON.parse(fs.readFileSync(path.join(SITE, 'assets/manifest.json'), 'utf8'));
const copy = (from, to) => { fs.mkdirSync(path.dirname(to), { recursive: true }); fs.copyFileSync(from, to); };
const hash = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex').slice(0, 10);

copy(path.join(HERE, 'site/style.css'), path.join(SITE, 'style.css'));
copy(path.join(HERE, 'site/light.js'), path.join(SITE, 'light.js'));
copy(path.join(SKILL, 'assets/scaffold/behavior.js'), path.join(SITE, 'behavior.js'));
copy(path.join(SKILL, 'assets/app-store-badge.svg'), path.join(SITE, 'assets/app-store-badge.svg'));
copy(path.join(SKILL, 'assets/google-play-badge.svg'), path.join(SITE, 'assets/google-play-badge.svg'));
// Google's Spanish badge (play.google.com/intl/es-419/badges: "Descargar en Google Play"), its clear margin trimmed
copy(path.join(HERE, 'site/google-play-badge-es.png'), path.join(SITE, 'assets/google-play-badge-es.png'));
copy(path.join(HERE, 'site/app-store-badge-es.svg'), path.join(SITE, 'assets/app-store-badge-es.svg'));
fs.writeFileSync(path.join(SITE, '.nojekyll'), '');

const hashes = { css: hash(path.join(SITE, 'style.css')), light: hash(path.join(SITE, 'light.js')), behavior: hash(path.join(SITE, 'behavior.js')) };

for (const s of [en, es]) {
  const m = manifest.locales[s.locale];
  const depth = s.path ? '../' : '';
  const html = page(s, {
    locale: s.locale,
    root: depth,
    origin: ORIGIN,
    toOther: s.other.path ? s.other.path : '../',
    live: ON_SALE,
    appId: APP.ascAppId,
    appStoreUrl: `https://apps.apple.com/app/id${APP.ascAppId}`,
    playLive: ON_PLAY,
    playUrl: PLAY_URL,
    email: APP.contactEmail,
    images: m.images,
    screens: { player: m.player, plays: m.plays },
    hash: hashes,
  });
  const out = path.join(SITE, s.path, 'index.html');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, html);
  console.log(`✓ ${path.relative(SITE, out)} (${(html.length / 1024).toFixed(1)} KB)`);
}

// Crawlers read robots.txt only at the origin's root (the root sitemap index finds this one at deploy); both kept here
// for completeness. Each page lists the other as its alternate.
const today = new Date().toISOString().slice(0, 10);
const alternates = [['en', ''], ['es', 'es/'], ['x-default', '']]
  .map(([lang, p]) => `    <xhtml:link rel="alternate" hreflang="${lang}" href="${ORIGIN}${p}"/>`).join('\n');
const urls = ['', 'es/'].map((p) => `  <url>\n    <loc>${ORIGIN}${p}</loc>\n    <lastmod>${today}</lastmod>\n${alternates}\n  </url>`).join('\n');
fs.writeFileSync(path.join(SITE, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>\n`);
fs.writeFileSync(path.join(SITE, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${ORIGIN}sitemap.xml\n`);
console.log('✓ sitemap.xml, robots.txt');
