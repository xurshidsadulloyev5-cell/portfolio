/* Theme (dark/light), language (UZ/EN), typed roles, reveal, tilt */
(() => {
  const $ = s => document.querySelector(s), root = document.documentElement;
  const get = (k, d) => { try { return localStorage.getItem(k) || d } catch { return d } };
  const put = (k, v) => { try { localStorage.setItem(k, v) } catch { } };
  let theme = get('theme', matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'), lang = get('lang', 'uz');
  const ty = { i: 0, j: 0, del: false };

  function setTheme(t) {
    theme = t; root.dataset.theme = t; put('theme', t);
    window.FX && FX.colors(); window.BG3D && BG3D.colors();
  }
  function setLang(l) {
    lang = l; root.lang = l; put('lang', l); $('#lang').textContent = l === 'uz' ? 'EN' : 'UZ';
    document.querySelectorAll('[data-i18n]').forEach(e => e.textContent = I18N[l][e.dataset.i18n]);
    ty.i = ty.j = 0; ty.del = false;
  }
  (function tick() { // typewriter
    const w = I18N[lang].roles[ty.i % I18N[lang].roles.length];
    ty.j += ty.del ? -1 : 1; $('#typed').textContent = w.slice(0, ty.j);
    let d = ty.del ? 40 : 90;
    if (!ty.del && ty.j >= w.length) { ty.del = true; d = 1400 }
    else if (ty.del && ty.j <= 0) { ty.del = false; ty.i++; d = 300 }
    setTimeout(tick, d);
  })();

  $('#theme').onclick = () => setTheme(theme === 'dark' ? 'light' : 'dark');
  $('#lang').onclick = () => setLang(lang === 'uz' ? 'en' : 'uz');
  $('#shuffle').onclick = () => { window.FX && FX.shuffle(); window.BG3D && BG3D.shuffle() };
  $('#y').textContent = new Date().getFullYear();

  const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && e.target.classList.add('in')), { threshold: .12 });
  document.querySelectorAll('.rv').forEach(e => io.observe(e));

  addEventListener('pointermove', e => { root.style.setProperty('--mx', e.clientX + 'px'); root.style.setProperty('--my', e.clientY + 'px') });
  document.querySelectorAll('.card').forEach(c => {
    c.addEventListener('pointermove', e => {
      const b = c.getBoundingClientRect();
      c.style.setProperty('--ry', ((e.clientX - b.left) / b.width - .5) * 14 + 'deg');
      c.style.setProperty('--rx', (.5 - (e.clientY - b.top) / b.height) * 14 + 'deg');
    });
    c.addEventListener('pointerleave', () => { c.style.setProperty('--rx', '0deg'); c.style.setProperty('--ry', '0deg') });
  });
  setTheme(theme); setLang(lang);
})();
