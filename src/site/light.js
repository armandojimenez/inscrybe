// The hero's line of light: the App Store header's picture (plan 17.5), live and laid out around the page. Its recipes are
// the header's, ported from ~/development/tools/inscrybe-screenshots/header/art.js and header.js (themselves the app's
// OnboardingLightStroke, OnboardingGlassPlane and their curve and taper): the icon's two glass planes, its line of light
// from the left edge through the glass and on behind the phone, the sound coming in as a waveform of light bars, dust of
// light drifting up, and every 5 s the glass lighting as a comet leaves along the line. Colors are Amethyst dark's art
// (tools/themes/onboarding_art.json). Everything that never moves is drawn once per size; a frame adds only what moves.
// Still and drawn once with Reduce Motion; paused off screen and in a hidden tab.

(function () {
  'use strict';

  var canvas = document.querySelector('.hero__light');
  var hero = document.querySelector('[data-hero]');
  if (!canvas || !hero || !canvas.getContext || !window.Path2D) return;
  if (!CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
      r = Math.min(typeof r === 'number' ? r : 0, w / 2, h / 2);
      this.moveTo(x + r, y);
      this.arcTo(x + w, y, x + w, y + h, r); this.arcTo(x + w, y + h, x, y + h, r);
      this.arcTo(x, y + h, x, y, r); this.arcTo(x, y, x + w, y, r);
      this.closePath();
    };
  }

  var ART = {
    glassDeep: '#3329C2', glassBody: '#5544DC', glassLit: '#8D78F6', glassBlush: '#EE6FD1', glassRim: '#F4EEFF',
    glassGlow: '#5737F2', glassSheen: '#FBFBFF', light: '#FFAE55', lightCore: '#FFF5E4', lightBloom: '#FF7A3A',
  };
  var PAGE = { night: '#08061A', dusk: '#1A1438' };
  var LOOP = 15;
  var TAU = Math.PI * 2;
  var reduce = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };

  // ── Colors ─────────────────────────────────────────────────────────────────────────────────────────
  function rgb(hex) { var n = parseInt(hex.slice(1, 7), 16); return [n >> 16, (n >> 8) & 255, n & 255]; }
  function rgba(hex, a) { var c = rgb(hex); return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + Math.max(0, Math.min(1, a)) + ')'; }
  function mix(a, b, by) {
    var x = rgb(a), y = rgb(b);
    var h = function (i) { return Math.round(x[i] + (y[i] - x[i]) * by).toString(16).padStart(2, '0'); };
    return '#' + h(0) + h(1) + h(2);
  }
  var smooth = function (x) { return x * x * (3 - 2 * x); };
  var clamp01 = function (x) { return Math.max(0, Math.min(1, x)); };
  var phase = function (t, n) { return ((t / LOOP) * (n || 1)) % 1; };
  function hash(n) { var s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); }

  // Canvas blur (ctx.filter) is missing in older Safari: a glow is then left out rather than drawn sharp
  var probe = document.createElement('canvas').getContext('2d');
  probe.filter = 'blur(2px)';
  var canBlur = probe.filter === 'blur(2px)';

  // ── The curve and its stroke (OnboardingCurve, OnboardingTaper, OnboardingLightStroke) ─────────────
  function Curve(points, per) {
    per = per || 24;
    var padded = [points[0]].concat(points, [points[points.length - 1]]);
    var samples = [points[0].slice()];
    for (var i = 1; i < padded.length - 2; i += 1) {
      var p0 = padded[i - 1], p1 = padded[i], p2 = padded[i + 1], p3 = padded[i + 2];
      var c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
      var c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      for (var s = 1; s <= per; s += 1) {
        var t = s / per, u = 1 - t;
        var a = u * u * u, b = 3 * u * u * t, c = 3 * u * t * t, d = t * t * t;
        samples.push([a * p1[0] + b * c1[0] + c * c2[0] + d * p2[0], a * p1[1] + b * c1[1] + c * c2[1] + d * p2[1]]);
      }
    }
    var lengths = [0];
    for (var j = 1; j < samples.length; j += 1) {
      lengths.push(lengths[j - 1] + Math.hypot(samples[j][0] - samples[j - 1][0], samples[j][1] - samples[j - 1][1]));
    }
    var total = Math.max(lengths[lengths.length - 1], 0.0001);
    this.samples = samples;
    this.fractions = lengths.map(function (l) { return l / total; });
    this.length = total;
  }
  Curve.prototype.point = function (f) {
    var s = this.samples, fr = this.fractions;
    if (f <= 0) return s[0];
    var i = 1;
    while (i < fr.length && fr[i] < f) i += 1;
    if (i >= fr.length) return s[s.length - 1];
    var span = fr[i] - fr[i - 1];
    var t = span > 0 ? (f - fr[i - 1]) / span : 0;
    return [s[i - 1][0] + (s[i][0] - s[i - 1][0]) * t, s[i - 1][1] + (s[i][1] - s[i - 1][1]) * t];
  };
  Curve.prototype.slice = function (from, to) {
    var out = [{ p: this.point(from), at: from }];
    for (var i = 0; i < this.samples.length; i += 1) {
      var at = this.fractions[i];
      if (at > from && at < to) out.push({ p: this.samples[i], at: at });
    }
    out.push({ p: this.point(Math.min(to, 1)), at: Math.min(to, 1) });
    return out;
  };
  Curve.prototype.yAt = function (x) {
    var s = this.samples;
    if (x <= s[0][0]) return s[0][1];
    for (var i = 1; i < s.length; i += 1) {
      if (s[i][0] >= x) return s[i - 1][1] + (s[i][1] - s[i - 1][1]) * (x - s[i - 1][0]) / Math.max(s[i][0] - s[i - 1][0], 0.0001);
    }
    return s[s.length - 1][1];
  };
  Curve.prototype.atX = function (x) {
    var s = this.samples;
    for (var i = 1; i < s.length; i += 1) if (s[i][0] >= x) return this.fractions[i];
    return 1;
  };

  function taper(start, end, endWidth) {
    return function (f) {
      var v = 1;
      if (start > 0 && f < start) { var t = f / start; v = Math.min(v, 0.25 + 0.75 * t * t * (3 - 2 * t)); }
      if (end > 0 && f > 1 - end) { var u = (f - (1 - end)) / end; v = Math.min(v, 1 - (1 - endWidth) * (u * u * (3 - 2 * u))); }
      return v;
    };
  }

  function outline(points, width) {
    var path = new Path2D();
    if (points.length < 2) return path;
    var left = [], right = [];
    points.forEach(function (q, i) {
      var before = points[Math.max(i - 1, 0)].p, after = points[Math.min(i + 1, points.length - 1)].p;
      var dx = after[0] - before[0], dy = after[1] - before[1];
      var len = Math.max(Math.hypot(dx, dy), 0.0001);
      dx /= len; dy /= len;
      var half = width(q.at) / 2;
      left.push([q.p[0] - dy * half, q.p[1] + dx * half]);
      right.push([q.p[0] + dy * half, q.p[1] - dx * half]);
    });
    path.moveTo(left[0][0], left[0][1]);
    for (var a = 1; a < left.length; a += 1) path.lineTo(left[a][0], left[a][1]);
    var end = points[points.length - 1];
    var ea = Math.atan2(left[left.length - 1][1] - end.p[1], left[left.length - 1][0] - end.p[0]);
    path.arc(end.p[0], end.p[1], Math.max(width(end.at) / 2, 0.01), ea, ea - Math.PI, true);
    for (var b = right.length - 1; b >= 0; b -= 1) path.lineTo(right[b][0], right[b][1]);
    var st = points[0];
    var sa = Math.atan2(right[0][1] - st.p[1], right[0][0] - st.p[0]);
    path.arc(st.p[0], st.p[1], Math.max(width(st.at) / 2, 0.01), sa, sa - Math.PI, true);
    path.closePath();
    return path;
  }

  function scratch(w, h) {
    var c = document.createElement('canvas');
    c.width = Math.max(1, Math.ceil(w)); c.height = Math.max(1, Math.ceil(h));
    return c;
  }

  /** Paints on a smaller canvas, blurs it, and adds it onto `ctx` (plus-lighter) */
  function addBlurred(ctx, blur, paint, scale) {
    if (!canBlur) return;
    scale = scale || 1;
    var W = ctx.canvas.width, H = ctx.canvas.height;
    var small = scratch(W * scale, H * scale);
    var s = small.getContext('2d');
    s.setTransform(scale, 0, 0, scale, 0, 0);
    paint(s);
    var blurred = scratch(small.width, small.height);
    var b = blurred.getContext('2d');
    b.filter = 'blur(' + blur * scale + 'px)';
    b.drawImage(small, 0, 0);
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.drawImage(blurred, 0, 0, W, H);
    ctx.restore();
  }

  function lightStroke(ctx, o) {
    var pieces = o.parts.map(function (part) { return part.curve.slice(part.from || 0, part.to == null ? 1 : part.to); })
      .filter(function (p) { return p.length > 1; });
    if (!pieces.length) return;
    var weight = o.weight, width = o.width || taper(0.06, 0.1, 0.25), glow = o.glow == null ? 1 : o.glow;
    var shade = o.shade || function (c, a) { return rgba(c, a); };
    var outlines = function (times) {
      var path = new Path2D();
      pieces.forEach(function (points) { path.addPath(outline(points, function (at) { return weight * times * width(at); })); });
      return path;
    };
    var lines = function () {
      var path = new Path2D();
      pieces.forEach(function (points) {
        path.moveTo(points[0].p[0], points[0].p[1]);
        for (var i = 1; i < points.length; i += 1) path.lineTo(points[i].p[0], points[i].p[1]);
      });
      return path;
    };
    addBlurred(ctx, weight * 8, function (l) {
      l.lineCap = 'round'; l.lineJoin = 'round'; l.lineWidth = weight * 15;
      l.strokeStyle = shade(ART.lightBloom, 0.4 * glow); l.stroke(lines());
    }, 0.25);
    addBlurred(ctx, weight * 2.6, function (l) { l.fillStyle = shade(ART.light, 0.75 * glow); l.fill(outlines(5)); }, 0.5);
    addBlurred(ctx, weight * 0.7, function (l) { l.fillStyle = shade(mix(ART.light, ART.lightCore, 0.4), Math.min(glow, 1)); l.fill(outlines(2)); }, 1);
    if (!canBlur) {
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = shade(ART.light, 0.35 * glow); ctx.fill(outlines(3));
      ctx.restore();
    }
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = shade(ART.lightCore, 1);
    ctx.fill(outlines(1));
    ctx.restore();
  }

  // ── The glass (OnboardingGlassPlane on a dark page), drawn once to its own canvas ─────────────────
  function rimGradient(ctx, c, lit, bright, dim) {
    var g = ctx.createConicGradient(Math.atan2(lit[1] - 0.5, lit[0] - 0.5), c, c);
    var mid = mix(bright, dim, 0.35);
    [[0, bright], [0.17, dim], [0.33, dim], [0.5, mid], [0.67, dim], [0.83, dim], [1, bright]].forEach(function (s) { g.addColorStop(s[0], s[1]); });
    return g;
  }
  function strokeBorder(ctx, x, y, side, r, lw) {
    ctx.beginPath(); ctx.roundRect(x + lw / 2, y + lw / 2, side - lw, side - lw, Math.max(r - lw / 2, 0));
    ctx.lineWidth = lw; ctx.stroke();
  }
  function glassPlane(side, lit, presence) {
    var bleed = Math.ceil(side * 0.45);
    var cv = scratch(side + bleed * 2, side + bleed * 2);
    var ctx = cv.getContext('2d');
    var r = side * 0.2, o = bleed, c = bleed + side / 2;
    var at = function (u, v) { return [o + u * side, o + v * side]; };
    var conic = !!ctx.createConicGradient;
    if (canBlur) {
      ctx.save(); ctx.filter = 'blur(' + side * 0.1 + 'px)'; ctx.globalAlpha = 0.5 * presence;
      ctx.fillStyle = ART.glassGlow; ctx.beginPath(); ctx.roundRect(o, o, side, side, r); ctx.fill(); ctx.restore();
    }
    var inside = scratch(cv.width, cv.height);
    var g = inside.getContext('2d');
    var p0 = at(0.2, 1), p1 = at(0.8, 0);
    var lg = g.createLinearGradient(p0[0], p0[1], p1[0], p1[1]);
    lg.addColorStop(0, ART.glassDeep); lg.addColorStop(0.5, ART.glassBody); lg.addColorStop(1, ART.glassLit);
    g.globalAlpha = 0.7 + 0.2 * presence; g.fillStyle = lg; g.fillRect(0, 0, inside.width, inside.height);
    var lp = at(lit[0], lit[1]);
    var rg = g.createRadialGradient(lp[0], lp[1], 0, lp[0], lp[1], side * 0.8);
    rg.addColorStop(0, rgba(ART.glassBlush, 0.95)); rg.addColorStop(0.5, rgba(ART.glassBlush, 0.4)); rg.addColorStop(1, rgba(ART.glassBlush, 0));
    g.globalAlpha = presence; g.fillStyle = rg; g.fillRect(0, 0, inside.width, inside.height);
    var fp = at(0.85, 0.12);
    var fg = g.createRadialGradient(fp[0], fp[1], 0, fp[0], fp[1], side * 0.5);
    fg.addColorStop(0, rgba(mix(ART.glassBlush, ART.glassLit, 0.6), 0.75)); fg.addColorStop(1, rgba(ART.glassLit, 0));
    g.globalAlpha = 0.85 * presence; g.fillStyle = fg; g.fillRect(0, 0, inside.width, inside.height);
    if (canBlur && conic) {
      g.save(); g.filter = 'blur(' + side * 0.045 + 'px)'; g.globalAlpha = 0.6 * presence;
      g.strokeStyle = rimGradient(g, c, lit, ART.glassBlush, ART.glassLit); strokeBorder(g, o, o, side, r, side * 0.1); g.restore();
    }
    var s0 = at(0, 0), s1 = at(1, 1);
    var sg = g.createLinearGradient(s0[0], s0[1], s1[0], s1[1]);
    sg.addColorStop(0.3, rgba(ART.glassSheen, 0)); sg.addColorStop(0.42, rgba(ART.glassSheen, 0.08)); sg.addColorStop(0.54, rgba(ART.glassSheen, 0));
    g.globalAlpha = 1; g.fillStyle = sg; g.fillRect(0, 0, inside.width, inside.height);
    g.globalCompositeOperation = 'destination-in'; g.fillStyle = '#000';
    g.beginPath(); g.roundRect(o, o, side, side, r); g.fill();
    ctx.drawImage(inside, 0, 0);
    ctx.save(); ctx.strokeStyle = rgba(ART.glassRim, 0.14 * presence);
    strokeBorder(ctx, o + side * 0.035, o + side * 0.035, side - side * 0.07, Math.max(r - side * 0.035, 0), Math.max(side * 0.004, 0.5));
    ctx.restore();
    if (conic) {
      if (canBlur) {
        ctx.save(); ctx.filter = 'blur(' + side * 0.03 + 'px)'; ctx.globalAlpha = 0.75 * presence;
        ctx.strokeStyle = rimGradient(ctx, c, lit, mix(ART.glassBlush, ART.glassRim, 0.5), mix(ART.glassGlow, ART.glassRim, 0.4));
        strokeBorder(ctx, o, o, side, r, side * 0.04); ctx.restore();
      }
      ctx.save(); ctx.globalAlpha = 0.6 + 0.4 * presence;
      ctx.strokeStyle = rimGradient(ctx, c, lit, ART.glassRim, mix(ART.glassRim, ART.glassLit, 0.45));
      strokeBorder(ctx, o, o, side, r, Math.max(side * 0.008, 1)); ctx.restore();
    } else {
      ctx.save(); ctx.globalAlpha = 0.7; ctx.strokeStyle = ART.glassRim;
      strokeBorder(ctx, o, o, side, r, Math.max(side * 0.008, 1)); ctx.restore();
    }
    return cv;
  }

  function drawPlane(ctx, plane, cx, cy, turn, alpha, op) {
    ctx.save();
    ctx.globalCompositeOperation = op || 'lighter';
    ctx.globalAlpha = alpha == null ? 1 : alpha;
    ctx.translate(cx, cy);
    ctx.rotate(turn * Math.PI / 180);
    ctx.drawImage(plane, -plane.width / 2, -plane.height / 2);
    ctx.restore();
  }

  /** A soft round sprite of light, for the comet and the bars' glow (drawn once) */
  function glowSprite(color, size) {
    var c = scratch(size, size);
    var g = c.getContext('2d');
    var r = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    r.addColorStop(0, rgba(color, 1)); r.addColorStop(0.35, rgba(color, 0.45)); r.addColorStop(1, rgba(color, 0));
    g.fillStyle = r; g.fillRect(0, 0, size, size);
    return c;
  }

  // ── The scene, laid out around the page ───────────────────────────────────────────────────────────
  var scene = null;

  function layout() {
    var box = hero.getBoundingClientRect();
    var W = box.width, H = box.height;
    if (W < 10 || H < 10) return null;
    var dpr = Math.min(window.devicePixelRatio || 1, W < 700 ? 2 : 1.75);
    var rel = function (el) {
      var r = el.getBoundingClientRect();
      return { x: r.left - box.left, y: r.top - box.top, w: r.width, h: r.height };
    };
    var phone = rel(hero.querySelector('[data-phone]'));
    var glassNode = hero.querySelector('[data-glass]');
    var glassEl = rel(glassNode);
    var text = rel(hero.querySelector('.hero__text'));
    // The page's layout says which: the glass has its own column in a wide window, none in a narrow one
    var wide = getComputedStyle(glassNode).display !== 'none';
    var side, gx, gy, points, intake, low;
    if (wide) {
      gx = glassEl.x + glassEl.w * 0.5;
      gy = glassEl.y + glassEl.h * 0.5;
      // As large as its column allows, its turned planes kept clear of the phone and of the words
      side = Math.min(glassEl.w * 1.05, H * 0.3, (phone.x - 32 - gx) / 0.78, (gx - (text.x + text.w * 0.9)) / 0.6);
      side = Math.max(side, 90);
      low = Math.min(H * 0.86, Math.max(text.y + text.h + H * 0.05, gy + side * 0.55));
      var py = phone.y + phone.h * 0.6;
      points = [
        [-W * 0.04, low + H * 0.01], [W * 0.12, low + H * 0.012], [W * 0.27, low - H * 0.004],
        [gx - side * 0.95, gy + side * 0.34], [gx, gy], [gx + side * 0.75, gy - side * 0.12 + (py - gy) * 0.35],
        // Straight on behind the phone, so it comes out where it went in, still rising a little
        [phone.x - side * 0.05, py], [phone.x + phone.w + side * 0.05, py - H * 0.03], [W + W * 0.04, py - H * 0.045],
      ];
      intake = gx - side * 0.62;
    } else {
      // A band across the room between the words and the phone, like the header on a phone: the sound coming in on the
      // left, the glass right of center, the line on out to the edge
      var top = text.y + text.h, room = Math.max(phone.y - top, 80);
      var band = top + room * 0.5;
      side = Math.min(W * 0.27, room * 0.62, 130);
      gx = W * 0.64;
      gy = band;
      points = [
        [-W * 0.08, band + side * 0.42], [W * 0.18, band + side * 0.4], [gx - side * 1.05, gy + side * 0.28], [gx, gy],
        [gx + side * 0.95, gy - side * 0.18], [W * 1.08, gy - side * 0.32],
      ];
      intake = gx - side * 0.7;
    }
    return { W: W, H: H, dpr: dpr, wide: wide, side: side, gx: gx, gy: gy, points: points, intake: intake, phone: phone };
  }

  function build() {
    var L = layout();
    if (!L) return;
    var dpr = L.dpr;
    var pw = Math.round(L.W * dpr), ph = Math.round(L.H * dpr);
    canvas.width = pw; canvas.height = ph;
    var k = function (v) { return v * dpr; };
    var curve = new Curve(L.points.map(function (p) { return [k(p[0]), k(p[1])]; }), 40);
    var side = k(L.side);
    var weight = k(Math.max(2.1, Math.min(4.2, L.W / 330)));

    // Everything that stays put, once
    var still = scratch(pw, ph);
    var ctx = still.getContext('2d');
    var g = ctx.createLinearGradient(0, 0, 0, ph);
    g.addColorStop(0, mix(PAGE.dusk, PAGE.night, 0.35)); g.addColorStop(0.3, PAGE.dusk); g.addColorStop(1, PAGE.night);
    ctx.fillStyle = g; ctx.fillRect(0, 0, pw, ph);
    var gx = k(L.gx), gy = k(L.gy);
    var halo = ctx.createRadialGradient(gx, gy, 0, gx, gy, side * 3.1);
    halo.addColorStop(0, rgba(ART.glassGlow, 0.42)); halo.addColorStop(0.35, rgba(ART.glassGlow, 0.15)); halo.addColorStop(1, rgba(ART.glassGlow, 0));
    ctx.fillStyle = halo; ctx.fillRect(0, 0, pw, ph);
    var warm = ctx.createRadialGradient(pw * 0.2, curve.yAt(pw * 0.2), 0, pw * 0.2, curve.yAt(pw * 0.2), Math.max(pw, ph) * 0.45);
    warm.addColorStop(0, rgba(ART.lightBloom, 0.07)); warm.addColorStop(1, rgba(ART.lightBloom, 0));
    ctx.fillStyle = warm; ctx.fillRect(0, 0, pw, ph);
    var fall = ctx.createLinearGradient(0, ph * 0.82, 0, ph);
    fall.addColorStop(0, rgba(PAGE.night, 0)); fall.addColorStop(1, rgba(PAGE.night, 1));

    var back = glassPlane(Math.round(side), [0.04, 0.92], 0.85);
    var front = glassPlane(Math.round(side), [0.08, 0.95], 1);
    var bx = gx - side * 0.124, by = gy + side * 0.114, fx = gx + side * 0.124, fy = gy - side * 0.114;
    drawPlane(ctx, back, bx, by, -11, 1);
    var born = curve.atX(gx + side * 0.45);
    // Faint where the sound still carries it, bright from the glass on, fading at the far end
    var shade = function (color, opacity) {
      var lg = ctx.createLinearGradient(0, 0, pw, 0);
      var gl = gx / pw;
      lg.addColorStop(0, rgba(color, opacity * 0.15));
      lg.addColorStop(Math.max(0.01, gl * 0.7), rgba(color, opacity * 0.5));
      lg.addColorStop(Math.min(0.98, gl + 0.04), rgba(color, opacity));
      lg.addColorStop(Math.min(0.99, gl + (1 - gl) * 0.55), rgba(color, opacity));
      lg.addColorStop(1, rgba(color, opacity * 0.3));
      return lg;
    };
    lightStroke(ctx, { parts: [{ curve: curve }], weight: weight, width: taper(0.3, 0.3, 0.2), shade: shade, glow: 0.9 });
    drawPlane(ctx, front, fx, fy, 12, 0.8, 'source-over');
    // Where the line crosses the glass: its core again, over the front plane, and a flare of its light
    var ca = curve.atX(gx - side * 0.62), cb = curve.atX(gx + side * 0.62);
    [[gx - side * 0.5, 0.5], [gx + side * 0.55, 0.55]].forEach(function (f) {
      var fx2 = f[0], fy2 = curve.yAt(f[0]), rad = side * 0.48;
      var fg = ctx.createRadialGradient(fx2, fy2, 0, fx2, fy2, rad);
      fg.addColorStop(0, rgba(ART.light, f[1])); fg.addColorStop(0.45, rgba(ART.lightBloom, f[1] * 0.25)); fg.addColorStop(1, rgba(ART.lightBloom, 0));
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = fg; ctx.fillRect(fx2 - rad, fy2 - rad, rad * 2, rad * 2); ctx.restore();
    });
    lightStroke(ctx, { parts: [{ curve: curve, from: ca, to: cb }], weight: weight * 0.64, width: taper(0.35, 0.35, 0.1), glow: 0.35 });
    // Where it goes behind the phone and comes out: its light on the frame's edges
    var p = L.phone;
    (L.wide ? [p.x, p.x + p.w] : []).forEach(function (x, i) {
      var ex = k(x), ey = curve.yAt(ex), rad = k(L.wide ? 70 : 46);
      var eg = ctx.createRadialGradient(ex, ey, 0, ex, ey, rad);
      eg.addColorStop(0, rgba(ART.light, i ? 0.35 : 0.5)); eg.addColorStop(1, rgba(ART.lightBloom, 0));
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = eg; ctx.fillRect(ex - rad, ey - rad, rad * 2, rad * 2); ctx.restore();
    });
    ctx.fillStyle = fall; ctx.fillRect(0, ph * 0.82, pw, ph * 0.18);

    // What moves: the bars along the line up to the glass, the dust, the comet
    var pitch = k(L.wide ? 11 : 8), barW = k(L.wide ? 4.6 : 3.4);
    var x0 = k(14), x1 = k(L.intake);
    var bars = [];
    for (var n = 0; x0 + n * pitch < x1; n += 1) {
      var x = x0 + n * pitch;
      bars.push({
        x: x, y: curve.yAt(x), n: n,
        base: 0.35 + 0.65 * (0.5 * hash(n * 1.7) + 0.5 * Math.abs(Math.sin(n * 0.37) * Math.sin(n * 0.11 + 1))),
        env: smooth(clamp01((x1 - x) / Math.max((x1 - x0) * 0.62, 1))) * smooth(clamp01((x + k(20)) / k(150))),
      });
    }
    var maxBar = k(L.wide ? Math.min(L.H * 0.2, 180) : Math.min(L.side * 0.8, 96));
    var count = Math.min(150, Math.round(L.W * L.H / 9000));
    var dust = [];
    for (var d = 0; d < count; d += 1) {
      dust.push({ x: hash(d) * pw, y: hash(d + 0.5) * ph, r: k(0.6 + hash(d + 0.3) * 1.3), i: d });
    }
    scene = {
      L: L, still: still, curve: curve, navClear: k(84), side: side, gx: gx, gy: gy, born: born, bars: bars, barW: barW, maxBar: maxBar,
      dust: dust, ph: ph, pw: pw, dpr: dpr, comet: glowSprite(ART.light, 64), core: glowSprite(ART.lightCore, 32),
      barGlow: glowSprite(ART.glassGlow, 64),
    };
  }

  // ── A frame ────────────────────────────────────────────────────────────────────────────────────────
  function beat(t) { return (((t / LOOP) * 3) % 1) * (LOOP / 3); }
  function glassLight(t) {
    var s = beat(t);
    if (s < 0.5) return smooth(s / 0.5);
    return 1 - smooth(clamp01((s - 0.5) / 1.6));
  }

  function frame(t, still) {
    if (!scene) return;
    var S = scene, ctx = canvas.getContext('2d');
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
    ctx.drawImage(S.still, 0, 0);
    ctx.globalCompositeOperation = 'lighter';

    // Dust of light drifting up, each grain round a whole number of times a loop
    var rise = 0.16 * S.ph;
    for (var i = 0; i < S.dust.length; i += 1) {
      var g = S.dust[i];
      var up = (phase(t, 1) + hash(i + 0.25)) % 1;
      var y = (g.y - up * rise + S.ph) % S.ph;
      var x = g.x + Math.sin(TAU * (phase(t, 1) + hash(i + 0.75))) * 6 * S.dpr;
      var tw = 0.5 + 0.5 * Math.sin(TAU * (phase(t, 2 + (i % 3)) + hash(i + 0.1)));
      // None under the bar at the top, where a grain beside a word reads as a dot
      var clear = clamp01((y - S.navClear) / (S.navClear * 0.6));
      ctx.globalAlpha = (0.14 + 0.4 * tw) * (0.35 + 0.65 * hash(i + 0.9)) * Math.sin(Math.PI * up) * clear;
      ctx.fillStyle = i % 4 === 0 ? ART.light : ART.glassRim;
      ctx.beginPath(); ctx.arc(x, y, g.r, 0, TAU); ctx.fill();
    }

    // The sound coming in: bars that play in waves toward the glass and fade into the line
    for (var b = 0; b < S.bars.length; b += 1) {
      var bar = S.bars[b];
      if (bar.env < 0.03) continue;
      var run = 0.55 + 0.45 * Math.sin(TAU * (phase(t, 3) - bar.n / 11));
      var swell = 0.78 + 0.22 * Math.sin(TAU * (phase(t, 2 + (bar.n % 4)) + hash(bar.n + 0.4)));
      var loud = still ? bar.base : bar.base * run * swell;
      var h = S.barW * 2 + S.maxBar * loud * bar.env;
      ctx.globalAlpha = 0.5 * bar.env;
      ctx.drawImage(S.barGlow, bar.x - S.barW * 3, bar.y - h * 0.7, S.barW * 6, h * 1.4);
      var fade = smooth(clamp01(bar.env / 0.45));
      var lg = ctx.createLinearGradient(0, bar.y - h / 2, 0, bar.y + h / 2);
      var tip = mix(ART.glassLit, ART.glassRim, 0.35);
      var mid = mix(ART.glassLit, ART.light, 0.45 * (1 - bar.env));
      lg.addColorStop(0, rgba(tip, (0.25 + 0.45 * bar.env) * fade));
      lg.addColorStop(0.5, rgba(mid, (0.45 + 0.5 * bar.env) * fade));
      lg.addColorStop(1, rgba(tip, (0.25 + 0.45 * bar.env) * fade));
      ctx.globalAlpha = 1;
      ctx.fillStyle = lg;
      ctx.beginPath(); ctx.roundRect(bar.x - S.barW / 2, bar.y - h / 2, S.barW, h, S.barW / 2); ctx.fill();
    }
    if (still) { ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; return; }

    // Three times a loop the glass lights, and a comet of light leaves along the line
    var gl = glassLight(t);
    if (gl > 0.002) {
      var rad = S.side * 1.7;
      var rg = ctx.createRadialGradient(S.gx, S.gy, 0, S.gx, S.gy, rad);
      rg.addColorStop(0, rgba(ART.glassBlush, 0.22 * gl)); rg.addColorStop(0.4, rgba(ART.glassGlow, 0.14 * gl)); rg.addColorStop(1, rgba(ART.glassGlow, 0));
      ctx.globalAlpha = 1; ctx.fillStyle = rg; ctx.fillRect(S.gx - rad, S.gy - rad, rad * 2, rad * 2);
    }
    var u = (beat(t) - 0.3) / 4;
    if (u > 0 && u < 1) {
      var eased = 1 - (1 - u) * (1 - u) * 0.55 - 0.45 * (1 - u);
      var head = S.born + (1 - S.born) * Math.min(1, eased);
      var fadeC = smooth(clamp01(u / 0.12)) * (1 - smooth(clamp01((u - 0.7) / 0.3)));
      var tail = 0.11, steps = 34;
      var size = S.side * 0.32;
      for (var c = 0; c <= steps; c += 1) {
        var f = c / steps;
        var at = head - tail * (1 - f);
        if (at < S.born) continue;
        var pt = S.curve.point(at);
        var strength = f * f * fadeC;
        ctx.globalAlpha = 0.5 * strength;
        var sz = size * (0.45 + 0.55 * f);
        ctx.drawImage(S.comet, pt[0] - sz / 2, pt[1] - sz / 2, sz, sz);
      }
      var hp = S.curve.point(head);
      ctx.globalAlpha = 0.95 * fadeC;
      ctx.drawImage(S.core, hp[0] - size * 0.22, hp[1] - size * 0.22, size * 0.44, size * 0.44);
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }

  // ── Running ────────────────────────────────────────────────────────────────────────────────────────
  var visible = true, raf = 0, last = 0, start = performance.now();
  var interval = 1000 / 30;

  function tick(now) {
    raf = 0;
    if (!visible || document.hidden || reduce.matches) return;
    if (now - last >= interval - 2) {
      last = now;
      frame(((now - start) / 1000) % LOOP, false);
    }
    raf = requestAnimationFrame(tick);
  }
  function run() {
    if (reduce.matches) { frame(2, true); return; }
    if (!raf) raf = requestAnimationFrame(tick);
  }
  function rebuild() {
    try { build(); } catch (err) { scene = null; return; }
    if (reduce.matches || !visible || document.hidden) frame(reduce.matches ? 2 : ((performance.now() - start) / 1000) % LOOP, reduce.matches);
    run();
  }

  var timer = 0, lastW = 0, lastH = 0;
  function onResize() {
    var r = hero.getBoundingClientRect();
    // Mobile browsers resize the viewport as their bars show and hide: only a real change of the hero redraws it
    if (Math.abs(r.width - lastW) < 1 && Math.abs(r.height - lastH) < 1) return;
    lastW = r.width; lastH = r.height;
    clearTimeout(timer);
    timer = setTimeout(rebuild, 120);
  }

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      if (visible) run();
    }).observe(hero);
  }
  document.addEventListener('visibilitychange', function () { if (!document.hidden) run(); });
  if (reduce.addEventListener) reduce.addEventListener('change', rebuild);
  window.addEventListener('resize', onResize, { passive: true });

  function startUp() {
    var r = hero.getBoundingClientRect();
    lastW = r.width; lastH = r.height;
    rebuild();
  }
  // The phone's picture sets the hero's layout: draw once the fonts and it are in
  var img = hero.querySelector('[data-phone] img');
  var ready = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
  Promise.all([ready, img && !img.complete ? new Promise(function (r) { img.addEventListener('load', r, { once: true }); img.addEventListener('error', r, { once: true }); }) : null])
    .then(startUp);
})();
