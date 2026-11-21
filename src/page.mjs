// The page, for one locale: `page(s, ctx)` returns the HTML for strings `s` (strings/<locale>.mjs). Every section is a
// headline from the store deck with its accent, the listing's words, and a picture composed by the store deck's own
// engine from real captures of the app (~/development/tools/inscrybe-screenshots, web.html: exports/web/<locale>/).
// The DOM contract is the landing skill's (store badges, [data-copy-email] + .snackbar, [data-nav], behavior.js).

const esc = (t) => String(t)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** A headline's lines, the accent (an exact substring of one line) set apart */
function headline(lines, accent) {
  return lines.map((line) => {
    const at = accent ? line.indexOf(accent) : -1;
    const inner = at === -1
      ? esc(line)
      : `${esc(line.slice(0, at))}<span class="accent">${esc(accent)}</span>${esc(line.slice(at + accent.length))}`;
    return `<span class="line">${inner}</span>`;
  }).join(' ');
}

/** One store's badge: a link to its page once Inscrybe is there (build.mjs asks each store), a badge that links nowhere
 *  before */
function badge(store, live, url, file, alt, h, ctx) {
  const img = `<img src="${ctx.root}assets/${file}" alt="${esc(alt)}" height="${h}" width="${Math.round(h * 135 / 40)}">`;
  return live
    ? `<a class="store-badge" data-store="${store}" href="${url}" target="_blank" rel="noopener">${img}</a>`
    : `<span class="store-badge store-badge--soon" data-store="${store}" aria-disabled="true">${img}</span>`;
}

/** The two stores' badges and what they're for: a store Inscrybe isn't in yet says "Coming soon" (naming it when the
 *  other store has it) above the devices */
function get(s, ctx, size = 'hero') {
  const h = size === 'cta' ? 56 : 48;
  // Apple's badge in the page's language (its marketing tools: the Spanish one says "Descárgalo en el App Store")
  const appleFile = s.locale === 'es' ? 'app-store-badge-es.svg' : 'app-store-badge.svg';
  const apple = badge('apple', ctx.live, ctx.appStoreUrl, appleFile, ctx.live ? s.badge.live : s.badge.soon, h, ctx);
  // Google's badge in the page's language too (its badge maker: the Spanish one says "Disponible en Google Play")
  const googleFile = s.locale === 'es' ? 'google-play-badge-es.png' : 'google-play-badge.svg';
  const google = badge('google', ctx.playLive, ctx.playUrl, googleFile, ctx.playLive ? s.badge.playLive : s.badge.playSoon, h, ctx);
  const soonWords = !ctx.live && !ctx.playLive ? s.badge.soonShort : !ctx.live ? s.badge.soon : !ctx.playLive ? s.badge.playSoon : '';
  const soon = soonWords ? `<span class="get__soon">${esc(soonWords)}</span>` : '';
  return `<div class="get get--${size}"><div class="get__badges">${apple}${google}</div><p class="get__label">${soon}<span class="get__devices">${esc(s.hero.devices)}</span></p></div>`;
}

/** A composed picture: WebP from the deck's engine, its size known so nothing moves as it loads */
function picture(ctx, id, alt, { eager = false, sizes = '(min-width: 960px) 46vw, 92vw' } = {}) {
  const img = ctx.images[id];
  if (!img) throw new Error(`no composition ${id} for ${ctx.locale}`);
  const srcset = img.widths.map((w) => `${ctx.root}assets/web/${ctx.locale}/${id}-${w}.webp ${w}w`).join(', ');
  const largest = img.widths[img.widths.length - 1];
  return `<img class="composition" src="${ctx.root}assets/web/${ctx.locale}/${id}-${largest}.webp" srcset="${srcset}" sizes="${sizes}" width="${img.width}" height="${img.height}" alt="${esc(alt)}"${eager ? ' fetchpriority="high"' : ' loading="lazy" decoding="async"'}>`;
}

function facts(list, extra = '') {
  if (!list?.length) return '';
  // Two or fewer read as a short list; more as a grid
  const kind = list.length <= 2 ? 'facts facts--short' : 'facts';
  return `<dl class="${kind}${extra ? ` ${extra}` : ''}">${list.map(([term, text]) => `<div class="fact"><dt>${esc(term)}</dt><dd>${esc(text)}</dd></div>`).join('')}</dl>`;
}

/** One feature: the deck's headline and its picture, in its look (dark or light) and its mode's accent. Layouts: `split`
 *  (words beside the picture), `flank` (the headline over the picture, its facts either side of it), `center` (the
 *  headline over the picture). `art`: a picture drawn in light (How Hidden's demo), set among the words over the
 *  section itself, so its dark page takes the section's */
function feature(s, ctx, { id, key, look, mode, flip = false, layout = 'split', art = null }) {
  const t = s.sections[key];
  const light = art ? `<img class="composition-light" src="${ctx.root}assets/web/${ctx.locale}/${art}-${ctx.images[art].widths.at(-1)}.webp" srcset="${ctx.images[art].widths.map((w) => `${ctx.root}assets/web/${ctx.locale}/${art}-${w}.webp ${w}w`).join(', ')}" sizes="(min-width: 720px) 380px, 80vw" width="${ctx.images[art].width}" height="${ctx.images[art].height}" alt="" loading="lazy" decoding="async">` : '';
  const head = `<h2 id="${id}-title" data-fit>${headline(t.title, t.accent)}</h2>
        <p class="lead">${esc(t.lead)}</p><script>fit(document.getElementById('${id}-title'))</script>`;
  const figure = `<figure class="feature__visual">${picture(ctx, key, t.alt, { sizes: layout === 'split' ? '(min-width: 720px) 46vw, 92vw' : '(min-width: 720px) 520px, 92vw' })}</figure>`;
  const classes = `feature feature--${look} mode-${mode} feature--${layout}${flip ? ' feature--flip' : ''}`;
  if (layout === 'flank') {
    const half = Math.ceil(t.facts.length / 2);
    return `
  <section class="${classes}" id="${id}" aria-labelledby="${id}-title">
    <div class="feature__inner">
      <div class="feature__text">
        ${head}
      </div>
      ${facts(t.facts.slice(0, half), 'facts--start')}
      ${figure}
      ${facts(t.facts.slice(half), 'facts--end')}
    </div>
  </section>`;
  }
  return `
  <section class="${classes}" id="${id}" aria-labelledby="${id}-title">
    <div class="feature__inner">
      <div class="feature__text">
        ${head}
        ${light}
        ${facts(t.facts)}
      </div>
      ${figure}
    </div>
  </section>`;
}

function faq(s) {
  return s.support.groups.map((g) => `
        <div class="faq__group">
          <h3>${esc(g.title)}</h3>
          ${g.items.map(([q, a]) => `<details class="faq__item"><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('\n          ')}
        </div>`).join('');
}

/** The line of light under the closing mark: the icon's tapered stroke, its comet going along it now and then */
const closingLine = `
      <svg class="mark-line" viewBox="0 0 600 60" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="ml-core" x1="0" y1="0" x2="600" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0" stop-color="#FFAE55" stop-opacity="0"/>
            <stop offset="0.22" stop-color="#FFAE55" stop-opacity="0.8"/>
            <stop offset="0.6" stop-color="#FFF5E4"/>
            <stop offset="0.88" stop-color="#FFAE55" stop-opacity="0.7"/>
            <stop offset="1" stop-color="#FFAE55" stop-opacity="0"/>
          </linearGradient>
          <filter id="ml-glow" x="-10%" y="-300%" width="120%" height="700%"><feGaussianBlur stdDeviation="6"/></filter>
        </defs>
        <path d="M4 46 C 180 44, 330 30, 596 12" fill="none" stroke="#FF7A3A" stroke-opacity="0.55" stroke-width="10" stroke-linecap="round" filter="url(#ml-glow)"/>
        <path d="M4 46 C 180 44, 330 30, 596 12" fill="none" stroke="url(#ml-core)" stroke-width="3" stroke-linecap="round"/>
        <path class="mark-line__comet" d="M4 46 C 180 44, 330 30, 596 12" pathLength="100" fill="none" stroke="#FFF5E4" stroke-width="3.2" stroke-linecap="round"/>
      </svg>`;

export function page(s, ctx) {
  const other = s.other;
  const canonical = `${ctx.origin}${s.path}`;
  const alt = (locale, path) => `<link rel="alternate" hreflang="${locale}" href="${ctx.origin}${path}">`;
  // The app as structured data: what the page already says, nothing invented (no ratings, no price: it isn't on sale
  // yet, and the download link and the store page join it once it is)
  const shot = (id, file) => ({ '@type': 'ImageObject', contentUrl: `${ctx.origin}${file}`, caption: s.sections[id]?.alt ?? s.a11y.phone });
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'MobileApplication',
    name: 'Inscrybe',
    alternateName: s.locale === 'es'
      ? ['Inscrybe: Crear Subliminales', 'Inscrybe reproductor de subliminales']
      : ['Inscrybe: Subliminal Maker', 'Inscrybe Subliminal Player'],
    description: s.meta.description,
    applicationCategory: 'MusicApplication',
    applicationSubCategory: 'LifestyleApplication',
    operatingSystem: ['iOS 26.1 or later', 'Android 10 or later'],
    inLanguage: s.htmlLang,
    url: canonical,
    image: `${ctx.origin}assets/icon-512.png`,
    screenshot: [
      shot('hero', `assets/screens/${s.locale}/player-${ctx.screens.player.widths.at(-1)}.webp`),
      ...['library', 'studio', 'hidden', 'privacy'].map((id) => shot(id, `assets/web/${s.locale}/${id}-${ctx.images[id].widths.at(-1)}.webp`)),
    ],
    publisher: { '@type': 'Organization', name: 'Believe PR', url: 'https://armandojimenez.dev/' },
    author: { '@type': 'Person', name: 'Armando Jimenez', url: 'https://armandojimenez.dev/' },
    // The stores Inscrybe is in: their pages are its download links
    ...(() => {
      const stores = [ctx.live && ctx.appStoreUrl, ctx.playLive && ctx.playUrl].filter(Boolean);
      return stores.length ? { downloadUrl: stores, installUrl: stores, sameAs: stores } : {};
    })(),
  };
  const words = s.hero.words.map((w, i) => `<span class="word word--${i + 1}">${esc(w)}</span>`).join('');

  return `<!doctype html>
<html lang="${s.htmlLang}" data-app-slug="inscrybe" data-langs="en,es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${esc(s.meta.title)}</title>
  <meta name="description" content="${esc(s.meta.description)}">
  <link rel="canonical" href="${canonical}">
  ${alt('en', '')}
  ${alt('es', 'es/')}
  ${alt('x-default', '')}
  <meta name="theme-color" content="#08061A">
  <meta name="color-scheme" content="dark light">
  ${ctx.live ? `<meta name="apple-itunes-app" content="app-id=${ctx.appId}">` : ''}
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Inscrybe">
  <meta property="og:title" content="${esc(s.meta.ogTitle)}">
  <meta property="og:description" content="${esc(s.meta.description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:locale" content="${s.ogLocale}">
  <meta property="og:locale:alternate" content="${s.locale === 'es' ? 'en_US' : 'es_MX'}">
  <meta property="og:image" content="${ctx.origin}assets/og-${s.locale}.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${esc(s.meta.ogImageAlt)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(s.meta.ogTitle)}">
  <meta name="twitter:description" content="${esc(s.meta.description)}">
  <meta name="twitter:image" content="${ctx.origin}assets/og-${s.locale}.png">
  <link rel="icon" href="${ctx.root}assets/favicon-32.png" sizes="32x32" type="image/png">
  <link rel="apple-touch-icon" href="${ctx.root}assets/apple-touch-icon.png">
  <link rel="preload" as="image" href="${ctx.root}assets/screens/${s.locale}/player-${ctx.screens.player.widths[0]}.webp" imagesrcset="${ctx.screens.player.widths.map((w) => `${ctx.root}assets/screens/${s.locale}/player-${w}.webp ${w}w`).join(', ')}" imagesizes="(min-width: 960px) 340px, 64vw" fetchpriority="high">
  <link rel="stylesheet" href="${ctx.root}style.css?v=${ctx.hash.css}">
  <script>
    // A headline keeps the deck's line breaks: its size comes down until every line fits its column (to 80% at most),
    // else its lines wrap, balanced. Run right after each headline, before it's painted, and again on resize.
    window.fit = function (h) {
      h.style.fontSize = ''; h.classList.remove('fits');
      var base = parseFloat(getComputedStyle(h).fontSize), room = h.clientWidth, widest = 0, r = document.createRange();
      h.classList.add('fits');
      h.querySelectorAll('.line').forEach(function (l) { r.selectNodeContents(l); widest = Math.max(widest, r.getBoundingClientRect().width); });
      var k = widest > room ? room / widest * 0.995 : 1;
      if (k < 0.8) h.classList.remove('fits'); else if (k < 1) h.style.fontSize = (base * k).toFixed(2) + 'px';
    };
    addEventListener('resize', function () { document.querySelectorAll('[data-fit]').forEach(fit); });
  </script>
  <script type="application/ld+json">${JSON.stringify(ld)}</script>
  <script src="${ctx.root}behavior.js?v=${ctx.hash.behavior}" defer></script>
  <script src="${ctx.root}light.js?v=${ctx.hash.light}" defer></script>
  <script>window.LANDING_STRINGS = ${JSON.stringify({ copied: s.support.copied })};</script>
</head>
<body>
  <a class="skip" href="#main">${esc(s.a11y.skip)}</a>

  <header class="nav" data-nav>
    <div class="nav__inner">
      <a class="nav__home" href="${ctx.root}${s.path}" aria-label="${esc(s.a11y.home)}">
        <img src="${ctx.root}assets/icon-64.png" alt="" width="32" height="32">
        <span class="wordmark">Inscrybe</span>
      </a>
      <nav class="nav__links" aria-label="${esc(s.a11y.nav)}">
        <a href="#player">${esc(s.nav.player)}</a>
        <a href="#studio">${esc(s.nav.studio)}</a>
        <a href="#privacy">${esc(s.nav.privacy)}</a>
        <a href="#support">${esc(s.nav.support)}</a>
      </nav>
      <a class="nav__lang" href="${ctx.toOther}" hreflang="${other.hreflang}" lang="${other.hreflang}" aria-label="${esc(s.a11y.language)}">${esc(other.short)}</a>
    </div>
  </header>

  <main id="main">
    <section class="hero" aria-labelledby="hero-title" data-hero>
      <canvas class="hero__light" aria-hidden="true"></canvas>
      <div class="hero__words" aria-hidden="true">${words}</div>
      <div class="hero__inner">
        <div class="hero__text">
          <h1 id="hero-title" data-fit>${headline(s.hero.title, s.hero.accent)}</h1>
          <p class="lead">${esc(s.hero.lead)}</p>
          ${get(s, ctx)}
          <script>fit(document.getElementById('hero-title'))</script>
        </div>
        <div class="hero__glass" data-glass aria-hidden="true"></div>
        <figure class="hero__device">
          <div class="phone" data-phone>
            <div class="phone__screen">
              <img src="${ctx.root}assets/screens/${s.locale}/player-${ctx.screens.player.widths[ctx.screens.player.widths.length - 1]}.webp" srcset="${ctx.screens.player.widths.map((w) => `${ctx.root}assets/screens/${s.locale}/player-${w}.webp ${w}w`).join(', ')}" sizes="(min-width: 960px) 340px, 64vw" width="${ctx.screens.player.width}" height="${ctx.screens.player.height}" alt="${esc(s.a11y.phone)}" fetchpriority="high">
              <span class="phone__island" aria-hidden="true"></span>
            </div>
          </div>
          <img class="phone__lift" src="${ctx.root}assets/screens/${s.locale}/plays-${ctx.screens.plays.widths[ctx.screens.plays.widths.length - 1]}.webp" width="${ctx.screens.plays.width}" height="${ctx.screens.plays.height}" alt="" aria-hidden="true" style="--lift-x:${ctx.screens.plays.x};--lift-y:${ctx.screens.plays.y};--lift-w:${ctx.screens.plays.w}">
        </figure>
      </div>
    </section>
${feature(s, ctx, { id: 'player', key: 'library', look: 'light', mode: 'player' })}
${feature(s, ctx, { id: 'sleep', key: 'sleep', look: 'dark', mode: 'player', flip: true })}
${feature(s, ctx, { id: 'visuals', key: 'visuals', look: 'light', mode: 'player' })}
${feature(s, ctx, { id: 'everywhere', key: 'everywhere', look: 'dark', mode: 'player', layout: 'center' })}
${feature(s, ctx, { id: 'stats', key: 'stats', look: 'light', mode: 'player' })}
${feature(s, ctx, { id: 'studio', key: 'studio', look: 'dark', mode: 'studio', layout: 'flank' })}
${feature(s, ctx, { id: 'voice', key: 'voice', look: 'light', mode: 'studio' })}
${feature(s, ctx, { id: 'how-hidden', key: 'hidden', look: 'dark', mode: 'studio', flip: true, art: 'hidden-art' })}
${feature(s, ctx, { id: 'privacy', key: 'privacy', look: 'light', mode: 'player' })}

    <section class="closing" id="download" aria-labelledby="download-title">
      <img class="closing__icon" src="${ctx.root}assets/icon-256.png" alt="" width="128" height="128" loading="lazy">
      <h2 id="download-title" class="closing__mark"><span class="wordmark">Inscrybe</span>${closingLine}</h2>
      <p class="lead">${esc(ctx.live ? s.download.leadLive : s.download.leadSoon)} ${esc(ctx.playLive ? s.download.playLive : s.download.playSoon)}</p>
      ${get(s, ctx, 'cta')}
    </section>

    <section class="support" id="support" aria-labelledby="support-title">
      <div class="support__inner">
        <div class="support__head">
          <h2 id="support-title">${esc(s.support.title)}</h2>
          <p class="lead">${esc(s.support.lead)}</p>
          <div class="contact">
            <h3>${esc(s.support.contactTitle)}</h3>
            <p>${esc(s.support.contactLead)}</p>
            <button type="button" class="contact__copy" data-copy-email="${ctx.email}">
              <span class="contact__email">${ctx.email}</span>
              <span class="contact__action">${esc(s.support.copy)}</span>
            </button>
            <p class="contact__app">${esc(s.support.fromApp)}</p>
          </div>
        </div>
        <div class="faq">${faq(s)}
        </div>
      </div>
    </section>
  </main>

  <footer class="footer">
    <div class="footer__inner">
      <a class="footer__home" href="${ctx.root}${s.path}" aria-label="${esc(s.a11y.home)}">
        <img src="${ctx.root}assets/icon-64.png" alt="" width="28" height="28" loading="lazy">
        <span class="wordmark">Inscrybe</span>
      </a>
      <ul class="footer__links">
        <li><a href="${s.footer.termsUrl}">${esc(s.footer.terms)}</a></li>
        <li><a href="${s.footer.privacyUrl}">${esc(s.footer.privacy)}</a></li>
        <li><a href="#support">${esc(s.nav.support)}</a></li>
        <li><a href="${ctx.toOther}" hreflang="${other.hreflang}" lang="${other.hreflang}">${esc(other.label)}</a></li>
      </ul>
      <p class="footer__legal">${esc(s.footer.copyright)} <a href="${s.footer.madeUrl}">${esc(s.footer.made)}</a></p>
      <p class="footer__apple">${esc(s.footer.apple)} ${esc(s.footer.google)}</p>
    </div>
  </footer>

  <div class="snackbar" role="status" aria-live="polite"></div>
</body>
</html>
`;
}
