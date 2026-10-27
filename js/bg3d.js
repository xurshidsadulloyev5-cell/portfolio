/* 3D background: Three.js wireframe + particle field (mouse parallax, scroll rotation) */
(() => {
  const cv = document.getElementById('bg3d');
  if (!window.THREE || !cv) return; // CDN yuklanmasa sayt baribir ishlaydi
  const T = THREE, r = new T.WebGLRenderer({ canvas: cv, alpha: true, antialias: true });
  const sc = new T.Scene(), cam = new T.PerspectiveCamera(60, 1, .1, 100);
  cam.position.z = 8; r.setPixelRatio(Math.min(devicePixelRatio, 2));
  const G = [() => new T.IcosahedronGeometry(2.6, 1), () => new T.TorusKnotGeometry(1.7, .5, 160, 18), () => new T.OctahedronGeometry(2.8, 2), () => new T.TorusGeometry(2.3, .75, 18, 64), () => new T.DodecahedronGeometry(2.7, 1)];
  const mat = new T.MeshBasicMaterial({ wireframe: true, transparent: true, opacity: .32 });
  const mesh = new T.Mesh(G[0](), mat), core = new T.Mesh(new T.IcosahedronGeometry(.9, 0), new T.MeshBasicMaterial({ wireframe: true }));
  const pos = new Float32Array(1600 * 3).map(() => (Math.random() - .5) * 30);
  const pm = new T.PointsMaterial({ size: .045, transparent: true, opacity: .85 });
  const pts = new T.Points(new T.BufferGeometry().setAttribute('position', new T.BufferAttribute(pos, 3)), pm);
  sc.add(mesh, core, pts);

  let mx = 0, my = 0;
  addEventListener('pointermove', e => { mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5 });
  const size = () => { r.setSize(innerWidth, innerHeight, false); cam.aspect = innerWidth / innerHeight; cam.updateProjectionMatrix() };
  const col = () => {
    const s = getComputedStyle(document.documentElement), v = n => s.getPropertyValue(n).trim();
    mat.color.set(v('--a1')); core.material.color.set(v('--a3')); pm.color.set(v('--a2'));
  };
  addEventListener('resize', size); size(); col();
  window.BG3D = { colors: col, shuffle() { mesh.geometry.dispose(); mesh.geometry = G[Math.random() * G.length | 0]() } };

  (function loop(t) {
    requestAnimationFrame(loop);
    if (document.hidden) return;
    const s = scrollY / innerHeight;
    mesh.rotation.set(t * 2e-4 + my * 1.4 + s, t * 3e-4 + mx * 1.8, 0);
    core.rotation.y = -t * 6e-4; core.scale.setScalar(1 + Math.sin(t * 1e-3) * .15);
    pts.rotation.y = t * 4e-5 + s * .4;
    cam.position.z = 8 - Math.min(s, 3) * .8;
    cam.position.x += (mx * 1.5 - cam.position.x) * .04; cam.position.y += (-my * 1.2 - cam.position.y) * .04;
    cam.lookAt(0, 0, 0); r.render(sc, cam);
  })(0);
})();
