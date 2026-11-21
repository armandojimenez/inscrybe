"""The landing page's pictures, made from their sources into the site (plan 17.6). Run with `python3 -I assets.py`
when a picture changes; build.mjs makes the pages from what this writes (assets/manifest.json).

- The app icon: site/icon-1024.png, Icon Composer's own render of AppIcon.icon (`ictool AppIcon.icon --export-image
  --platform iOS --rendition Default --width 1024 --height 1024 --scale 1`).
- The share cards: the approved App Store header (store-release/header/<lang>/header.png) at 1200x630.
- The hero's screen: the player's real capture (~/development/tools/inscrybe-screenshots, ./capture.sh max <lang>).
- Every section's picture and the hero's lifted pieces: that tool's web export (node web-export.mjs), its alpha kept.
"""
import json
import os
import sys
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
# The App Store header's art (the iOS hub's header/<locale>/header.png) for the share cards
HUB = os.path.expanduser('~/development/vibe/inscrybe/store-release')
TOOL = os.path.expanduser('~/development/tools/inscrybe-screenshots')
SITE = os.path.dirname(HERE)
ASSETS = os.path.join(SITE, 'assets')
LOCALES = ['en', 'es']
NIGHT = (8, 6, 26)


def webp(im, path, width, quality=86):
    """`im` at `width` (never larger than it is) as WebP, alpha kept"""
    w = min(width, im.width)
    h = round(im.height * w / im.width)
    out = im.resize((w, h), Image.LANCZOS) if w != im.width else im
    os.makedirs(os.path.dirname(path), exist_ok=True)
    out.save(path, 'WEBP', quality=quality, method=6, alpha_quality=92)
    return w


def trimmed(im, name):
    """The picture without the empty canvas around it (its shadows kept): a shadow cut by the canvas's edge is an error,
    so the tool's canvas is made larger instead"""
    alpha = im.getchannel('A').point(lambda a: 255 if a > 2 else 0)
    box = alpha.getbbox()
    if box is None:
        raise SystemExit(f'{name}: empty')
    left, top, right, bottom = box
    edges = [side for side, hit in [('left', left == 0), ('top', top == 0), ('right', right == im.width), ('bottom', bottom == im.height)] if hit]
    if edges:
        raise SystemExit(f'{name}: cut at the canvas\'s {", ".join(edges)} (make its canvas larger in config/web.js)')
    pad = 4
    return im.crop((max(0, left - pad), max(0, top - pad), min(im.width, right + pad), min(im.height, bottom + pad)))


def sized(im, folder, name, widths, quality=86):
    """Every width of `widths` the picture reaches (the largest at its own size), as name-<w>.webp"""
    made = []
    for width in widths:
        w = webp(im, os.path.join(folder, f'{name}-{min(width, im.width)}.webp'), width, quality)
        if w not in made:
            made.append(w)
    return made


def main():
    manifest = {'locales': {}}
    os.makedirs(ASSETS, exist_ok=True)

    icon = Image.open(os.path.join(HERE, 'site', 'icon-1024.png')).convert('RGBA')
    for side, name in [(64, 'icon-64.png'), (256, 'icon-256.png'), (512, 'icon-512.png'), (32, 'favicon-32.png')]:
        icon.resize((side, side), Image.LANCZOS).save(os.path.join(ASSETS, name), optimize=True)
    # Home Screen bookmarks: square and opaque (iOS rounds its corners)
    touch = Image.new('RGBA', icon.size, NIGHT + (255,))
    touch.alpha_composite(icon)
    touch.convert('RGB').resize((180, 180), Image.LANCZOS).save(os.path.join(ASSETS, 'apple-touch-icon.png'), optimize=True)

    for locale in LOCALES:
        entry = {}
        # The share card: the header's middle at 1200x630 (its glass at the center, the line across)
        header = Image.open(os.path.join(HUB, 'header', locale, 'header.png')).convert('RGB')
        cw = round(header.height * 1200 / 630)
        left = (header.width - cw) // 2
        header.crop((left, 0, left + cw, header.height)).resize((1200, 630), Image.LANCZOS) \
            .save(os.path.join(ASSETS, f'og-{locale}.png'), optimize=True)

        screens = os.path.join(ASSETS, 'screens', locale)
        player = Image.open(os.path.join(TOOL, 'captures', locale, 'max', 'player.png')).convert('RGB')
        entry['player'] = {'widths': sized(player, screens, 'player', [480, 720, 960], 88), 'width': player.width, 'height': player.height}

        web = json.load(open(os.path.join(TOOL, 'exports', 'web', locale, 'web.json')))
        pictures = os.path.join(ASSETS, 'web', locale)
        entry['images'] = {}
        for name, meta in web.items():
            im = Image.open(os.path.join(TOOL, 'exports', 'web', locale, f'{name}.png')).convert('RGBA')
            if name == 'plays':
                # "Play 2 of 3": its place on the capture (the page lays it over its own device)
                a = meta['anchor']
                entry['plays'] = {
                    'widths': sized(im, screens, 'plays', [360, 720]), 'width': im.width, 'height': im.height,
                    'x': round(100 * a['x'] / meta['capture']['w'], 3), 'y': round(100 * a['y'] / meta['capture']['h'], 3),
                    'w': round(100 * meta['share'] * 440 / 478, 3),
                }
                continue
            if name == 'hidden-art':
                # The introduction's demo, drawn in light on its own dark page: laid over the section with lighten
                entry['images'][name] = {'widths': sized(im.convert('RGB'), pictures, name, [500, 1000], 88), 'width': im.width, 'height': im.height}
                continue
            im = trimmed(im, f'{locale}/{name}')
            entry['images'][name] = {'widths': sized(im, pictures, name, [600, 900, 1200]), 'width': im.width, 'height': im.height}
        manifest['locales'][locale] = entry

    with open(os.path.join(ASSETS, 'manifest.json'), 'w') as f:
        json.dump(manifest, f, indent=1)
        f.write('\n')
    total = 0
    for root, _, files in os.walk(ASSETS):
        total += sum(os.path.getsize(os.path.join(root, n)) for n in files)
    print(f'assets → {ASSETS} ({total / 1e6:.1f} MB)')


if __name__ == '__main__':
    sys.exit(main())
