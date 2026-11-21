# The landing page (plan 17.6)

Inscrybe's page and its support page in one: <https://armandojimenez.dev/inscrybe/> (English) and `/es/` (Spanish),
served by GitHub Pages from `armandojimenez/inscrybe` (local: `~/development/landings/inscrybe_landing`), its generator in
`src/` (moved from the iOS repo's `store-release/landing` at Android's 16.4, 2026-11-20, as the owner's other landings
keep theirs; `src/app.json` holds the stores' ids and the contact address). The support
link the App Store shows is the page's Support section (`#support`).

## What it is made of

- **Words:** `strings/en.mjs`, `strings/es.mjs`. Headlines are the store deck's, word for word, with its accent; the rest
  is the approved listing's sentences and the app's own labels (`Localizable.xcstrings`). The dossier's house rules hold
  (`brand.dontSay`): no counts, no dashes, no soft or AI talk, nothing called free or paid.
- **The page:** `page.mjs` (one function, both languages), `site/style.css`, `site/light.js` (the hero: the App Store
  header's art live, its recipes ported from the screenshot tool's `header/art.js` and `header.js`).
- **Pictures:** every section's is the deck's own slide composition, moved onto a page canvas by the screenshot tool
  (`~/development/tools/inscrybe-screenshots`: `config/web.js`, `web-export.mjs`); the hero's screen is the player's real
  capture with its "Play 2 of 3" lifted; the share cards are the header; the icon is Icon Composer's render of
  `AppIcon.icon` (`site/icon-1024.png`).

## Making it again

```sh
cd ~/development/tools/inscrybe-screenshots
./capture.sh max en && ./capture.sh max es && ./capture.sh watch en && ./capture.sh watch es
node web-export.mjs
cd ~/development/landings/inscrybe_landing
python3 -I src/assets.py      # pictures → the site's assets (trimmed, WebP), assets/manifest.json
node src/build.mjs            # index.html, es/index.html, style, scripts, sitemap
node ~/.claude/skills/app-landing-page/scripts/validate-landing.mjs . --pages=en,es \
  --dossier=~/development/vibe/inscrybe_android/store-release/dossier.json \
  --ledger=~/development/vibe/inscrybe_android/store-release/ledger.json
```

The captures and the tool's exports are deleted once the site is built (CLAUDE.md › Mandatory phase cleanup); the site's
assets are the kept copy.

## When Inscrybe is accepted and on sale

The page says "Coming soon" until then, and `build.mjs` decides it by asking the App Store's public lookup
(`itunes.apple.com/lookup?id=6823235991`) at build time. The day version 1.0 is out:

```sh
cd ~/development/landings/inscrybe_landing && node src/build.mjs     # prints "Inscrybe is on the App Store"
git commit -am "The App Store badge links to Inscrybe" && git push
```

That one build changes, in both languages: the badge becomes a link to the App Store, "Coming soon" goes from beside it
(the devices stay), the closing line says Inscrybe is on the App Store, Safari shows the Smart App Banner, and the
structured data gets the download link. `--on-sale` / `--not-on-sale` override the lookup. Then check both pages live.
