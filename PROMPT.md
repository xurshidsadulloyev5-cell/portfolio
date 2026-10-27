# Prompt — Creative Portfolio Landing Page

Quyidagi promptni istalgan AI ga bering (ism, kasb va rasm nomlarini oʻzingiznikiga almashtiring):

---
Dasturchi uchun **creative portfolio landing page** yarat.

**Ma’lumotlar:** Ism — Xurshid Sadulloyev. Kasb — dasturchi (HTML, CSS, JS, Three.js). Profil rasmi — `images/profile.png`.

**Texnik talablar**
- Faqat sof HTML, CSS, JavaScript (framework yoʻq). Three.js faqat CDN orqali (cdnjs, r128).
- Papkalar: `index.html`, `css/style.css`, `js/` (`i18n.js`, `fx.js`, `bg3d.js`, `main.js`), `images/` (`profile.png`, `project-1..3` placeholder).
- Barcha matnlar `js/i18n.js` da, `data-i18n` atributlari orqali.

**Funksiyalar**
1. Dark/Light rejim: CSS oʻzgaruvchilari (`--bg --fg --a1 --a2 --a3`), tugma bilan almashadi, `localStorage` da saqlanadi, tizim rejimini hisobga oladi.
2. Ikki til UZ/EN: sahifani qayta yuklamasdan almashadi, tanlov saqlanadi.
3. Random effekt algoritmi (`fx.js`): seed asosidagi PRNG (mulberry32); 3 effekt — flow field, constellation (sichqoncha bilan oʻzaro taʼsir), code rain; har 35 soniyada yoki 🎲 tugmasi bilan tasodifiy yangi effekt va parametrlar; bosganda uchqunlar (click burst); effekt nomi va seed koʻrsatiladi; ranglar rejimga moslashadi.
4. 3D fon (`bg3d.js`): Three.js — wireframe geometriya (icosahedron / torus knot / octahedron / torus / dodecahedron) + 1600 zarracha, sichqoncha parallaksi, scroll bilan aylanish va yaqinlashish, 🎲 bilan geometriya almashadi, ranglar rejimga moslashadi.
5. Dizayn: glassmorphism kartalar, gradient matn animatsiyasi, morph shakldagi profil rasm (conic-gradient glow), typewriter rollar, scroll reveal, 3D tilt kartalar, kursor glow.

**Boʻlimlar:** Hero, About (kod-oynasi + texnologiya chiplari), Projects (3 karta), Contact, Footer.

**Sifat:** mobilga moslashgan (responsive), `prefers-reduced-motion` hurmat qilinadi, semantik HTML, toza va izohli kod. Har bir faylni alohida, toʻliq yozib ber.
---
