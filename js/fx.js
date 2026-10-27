/* Random effect engine: seeded PRNG (mulberry32) + 3 generative effects */
(() => {
  const cv = document.getElementById('fx'), c = cv.getContext('2d'), hud = document.getElementById('hud');
  const TAU = Math.PI * 2, D = Math.min(devicePixelRatio || 1, 2), modes = ['flow', 'net', 'rain'];
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let W, H, mode, seed, rnd, k, P = [], S = [], cols = [], mx = -1e4, my = -1e4, last = 0;
  const prng = a => () => { a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296 };
  const css = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  const colors = () => { cols = [css('--a1'), css('--a2'), css('--a3')] };

  function build() {
    const r = prng(seed);
    c.clearRect(0, 0, W, H);
    P = mode === 'rain'
      ? Array.from({ length: Math.ceil(W / (k.s * D)) }, () => ({ y: r() * H, v: .5 + r() }))
      : Array.from({ length: mode === 'flow' ? k.n * 4 : k.n }, () => ({ x: r() * W, y: r() * H, a: r() * TAU, c: r() * 3 | 0 }));
  }
  function roll() { // new seed -> new effect + new random parameters
    seed = Math.random() * 9999 | 0; rnd = prng(seed);
    const pool = modes.filter(m => m !== mode);
    mode = pool[rnd() * pool.length | 0];
    k = { n: 60 + rnd() * 50 | 0, v: .6 + rnd() * 1.2, f: .0008 + rnd() * .003, p: rnd() * TAU, d: 110 + rnd() * 90, s: 14 + rnd() * 8 | 0 };
    hud.textContent = mode + ' #' + seed;
    build();
  }
  function flow(t) {
    for (const p of P) {
      p.a = Math.sin(p.x * k.f + k.p + t * 2e-4) * Math.cos(p.y * k.f * 1.3 - k.p) * TAU;
      p.x += Math.cos(p.a) * k.v * D; p.y += Math.sin(p.a) * k.v * D;
      if (p.x < 0 || p.x > W || p.y < 0 || p.y > H) { p.x = rnd() * W; p.y = rnd() * H }
      c.fillStyle = cols[p.c]; c.fillRect(p.x, p.y, 1.6 * D, 1.6 * D);
    }
  }
  function net() {
    for (const p of P) {
      p.x += Math.cos(p.a) * k.v * .4 * D; p.y += Math.sin(p.a) * k.v * .4 * D;
      if (p.x < 0 || p.x > W) p.a = Math.PI - p.a;
      if (p.y < 0 || p.y > H) p.a = -p.a;
      const dx = p.x - mx, dy = p.y - my, d = Math.hypot(dx, dy) || 1;
      if (d < 160 * D) { p.x += dx / d * 1.5 * D; p.y += dy / d * 1.5 * D }
      c.fillStyle = cols[p.c]; c.beginPath(); c.arc(p.x, p.y, 2 * D, 0, TAU); c.fill();
    }
    c.lineWidth = D * .8;
    for (let i = 0; i < P.length; i++) for (let j = i + 1; j < P.length; j++) {
      const a = P[i], b = P[j], d = Math.hypot(a.x - b.x, a.y - b.y);
      if (d < k.d * D) { c.strokeStyle = cols[a.c]; c.globalAlpha = 1 - d / (k.d * D); c.beginPath(); c.moveTo(a.x, a.y); c.lineTo(b.x, b.y); c.stroke() }
    }
    c.globalAlpha = 1;
  }
  function rain() {
    const s = k.s * D, ch = '01{}<>/;=+*#$%&';
    c.font = `${s}px "JetBrains Mono",monospace`;
    P.forEach((p, i) => {
      c.fillStyle = cols[i % 3]; c.fillText(ch[rnd() * ch.length | 0], i * s, p.y);
      p.y += s * p.v; if (p.y > H && rnd() > .975) p.y = 0;
    });
  }
  function sparks() { // click bursts
    for (let i = S.length; i--;) {
      const s = S[i]; s.x += s.vx; s.y += s.vy; s.vy += .05 * D; s.l -= .02;
      if (s.l <= 0) { S.splice(i, 1); continue }
      c.globalAlpha = s.l; c.fillStyle = cols[s.c]; c.fillRect(s.x, s.y, 3 * D, 3 * D);
    }
    c.globalAlpha = 1;
  }
  function frame(t) {
    requestAnimationFrame(frame);
    if (document.hidden || (calm && last)) return;
    if (mode === 'rain' && t - last < 55) return;
    last = t;
    c.globalCompositeOperation = 'destination-out';
    c.fillStyle = `rgba(0,0,0,${{ flow: .07, net: 1, rain: .12 }[mode]})`;
    c.fillRect(0, 0, W, H);
    c.globalCompositeOperation = 'source-over';
    ({ flow, net, rain })[mode](t);
    sparks();
  }
  function resize() { W = cv.width = innerWidth * D; H = cv.height = innerHeight * D; k && build() }

  addEventListener('resize', resize);
  addEventListener('pointermove', e => { mx = e.clientX * D; my = e.clientY * D });
  addEventListener('pointerdown', e => {
    for (let i = 0; i < 28; i++) { const a = Math.random() * TAU, v = (1 + Math.random() * 4) * D; S.push({ x: e.clientX * D, y: e.clientY * D, vx: Math.cos(a) * v, vy: Math.sin(a) * v, l: 1, c: i % 3 }) }
  });
  colors(); resize(); roll(); requestAnimationFrame(frame);
  setInterval(() => { if (!document.hidden) { roll(); window.BG3D && BG3D.shuffle() } }, 35000);
  window.FX = { colors, shuffle: roll };
})();
