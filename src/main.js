import * as THREE from 'three';
import { GLTFLoader }      from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { OrbitControls }  from 'three/examples/jsm/controls/OrbitControls.js';
import gsap from 'gsap';
import React from 'react';
import { createRoot } from 'react-dom/client';
import ShaderReveal from './components/ShaderReveal.tsx';
import HeroSafetyIntro from './components/HeroSafetyIntro.tsx';
import CrashTitles from './components/CrashTitles.tsx';
import ImolaModal from './components/ImolaModal.tsx';
import BottomSectionNav from './components/BottomSectionNav.tsx';
import SpaSafety from './components/SpaSafety.tsx';
import InfiniteGallery from './components/InfiniteGallery.tsx';
import EraTimeline from './components/EraTimeline.tsx';
import EraGlitter from './components/EraGlitter.tsx';
import RaceTrack   from './components/RaceTrack.tsx';
import Footer from './components/Footer.tsx';
import ConclusionGraph from './components/ConclusionGraph.tsx';
import Stats4 from './components/Stats4.tsx';

const ERA_IMAGES = [
  { url: '/ere-imgs/_107051595_79490dd6-1a63-49f3-8654-a070f0ab897e.jpg.avif', width: 480, height: 270 },
  { url: '/ere-imgs/1134655565_ys3qj0_1_hikmyd.avif', width: 3840, height: 1920 },
  { url: '/ere-imgs/1703049993791-59636.avif', width: 880, height: 474 },
  { url: '/ere-imgs/180827122834-senna-crash-1994.avif', width: 957, height: 613 },
  { url: '/ere-imgs/46A6A77C00000578-5113835-image-a-29_1511521966064.avif', width: 962, height: 664 },
  { url: '/ere-imgs/6gc5n99h8hdy.avif', width: 720, height: 518 },
  { url: '/ere-imgs/b3df09885df528c497f0e9eebcfda10a.avif', width: 563, height: 366 },
  { url: '/ere-imgs/f1_crash.avif', width: 1280, height: 961 },
  { url: '/ere-imgs/F1-crashes-robert-kubica-1024x683.avif', width: 1024, height: 683 },
  { url: '/ere-imgs/ferrari-driver-cliff-allison-adopts-an-unusual-seating-v0-YO_3qgeX8xxs3KrNkSkHStoQgQ6aG5eDQZPCseFAfnI.avif', width: 565, height: 425 },
  { url: '/ere-imgs/GettyImages-864209058.avif', width: 1920, height: 1080 },
  { url: '/ere-imgs/image.avif', width: 864, height: 486 },
  { url: '/ere-imgs/images-1.avif', width: 301, height: 168 },
  { url: '/ere-imgs/images.avif', width: 300, height: 168 },
  { url: '/ere-imgs/maxresdefault.avif', width: 1280, height: 720 },
  { url: '/ere-imgs/peterson2.avif', width: 330, height: 241 },
  { url: '/ere-imgs/sddefault.avif', width: 640, height: 480 },
];
import shaderFrontUrl from './assets/BG111.png';
import shaderBackUrl from './assets/BG222.png';
import studioGlbUrl from './models/tunel.glb';


const stats4Mount = document.getElementById('stats4-root');
if (stats4Mount) {
  createRoot(stats4Mount).render(React.createElement(Stats4));
}

const shaderRevealMount = document.getElementById('shader-reveal-root');

if (shaderRevealMount) {
  const revealRoot = createRoot(shaderRevealMount);
  revealRoot.render(
    React.createElement(ShaderReveal, {
      frontImage: shaderFrontUrl,
      backImage: shaderBackUrl,
      style: { width: '100%', height: '100%' },
      mouseForce: 68,
      cursorSize: 620,
      resolution: 0.5,
      iterationsViscous: 22,
      iterationsPoisson: 26,
      revealStrength: 2.4,
      revealSoftness: 0.75,
      autoDemo: true,
      autoSpeed: 1.4,
      autoIntensity: 1.8,
      autoResumeDelay: 5000,
      viscous: 18,
      dt: 0.016,
      BFECC: true,
    }),
  );
}

const heroSafetyIntroMount = document.getElementById('hero-safety-intro-root');
if (heroSafetyIntroMount) {
  createRoot(heroSafetyIntroMount).render(React.createElement(HeroSafetyIntro));
}

const crashTitlesMount = document.getElementById('crash-titles-root');

if (crashTitlesMount) {
  const crashTitlesRoot = createRoot(crashTitlesMount);
  crashTitlesRoot.render(React.createElement(CrashTitles));
}

const imolaModalMount = document.getElementById('imola-modal-root');
if (imolaModalMount) {
  const imolaModalRoot = createRoot(imolaModalMount);
  imolaModalRoot.render(React.createElement(ImolaModal));
}

const bottomNavMount = document.getElementById('bottom-nav-root');

if (bottomNavMount) {
  const bottomNavRoot = createRoot(bottomNavMount);
  bottomNavRoot.render(React.createElement(BottomSectionNav));
}

const footerMount = document.getElementById('footer-root');

if (footerMount) {
  const footerRoot = createRoot(footerMount);
  footerRoot.render(React.createElement(Footer));
}

const conclusionGraphMount = document.getElementById('conclusion-graph-root');

if (conclusionGraphMount) {
  const conclusionGraphRoot = createRoot(conclusionGraphMount);
  conclusionGraphRoot.render(React.createElement(ConclusionGraph));
}

const spaMount = document.getElementById('spa-root');

if (spaMount) {
  const spaRoot = createRoot(spaMount);
  spaRoot.render(React.createElement(SpaSafety));
}

const racetrackMount = document.getElementById('racetrack-root');
if (racetrackMount) {
  const racetrackRoot = createRoot(racetrackMount);
  racetrackRoot.render(React.createElement(RaceTrack));
}

const eraGlitterMount = document.getElementById('era-glitter-root');
if (eraGlitterMount) {
  createRoot(eraGlitterMount).render(React.createElement(EraGlitter));
}

const eraTimelineMount = document.getElementById('era-timeline-root');
if (eraTimelineMount) {
  const eraTimelineRoot = createRoot(eraTimelineMount);
  eraTimelineRoot.render(React.createElement(EraTimeline));
}

const eraGalleryMount = document.getElementById('era-gallery-root');

if (eraGalleryMount) {
  const eraRoot = createRoot(eraGalleryMount);
  eraRoot.render(React.createElement(InfiniteGallery, {
    width: '100%',
    height: '100%',
    images: ERA_IMAGES,
    density: 2,
    imageSize: 32,
    cellSize: 150,
    viewRange: 2,
    fogNear: 130,
    fogFar: 340,
    dragSpeed: 0.6,
    driftAmount: 6,
    friction: 0.97,
    autoZoom: false,
    imageRadius: 0.06,
    allowImageFocusOnClick: true,
    backgroundColor: '#000000',
    fogColor: '#000000',
    wheelSpeed: 0.0025,
    transparent: true,
  }));
}

const SOURCE_ENTRIES = {
  'selva-marcello-3d': {
    title: 'Source',
    url: 'https://example.com',
  },
};

function renderSourceTrigger(text, sourceId, variant = 'value') {
  return `<button class="source-link source-link--${variant} js-source-trigger" type="button" data-source-id="${sourceId}">${text}</button>`;
}

function renderStatusbar({ chassis, powerUnit, drivers, sourceLabel, sourceValue, sourceId }) {
  return `<div class="stat-block"><div class="stat-label">Châssis</div><div class="stat-value">${chassis}</div></div><div class="sep"></div><div class="stat-block"><div class="stat-label">Groupe motopropulseur</div><div class="stat-value">${powerUnit}</div></div><div class="sep"></div><div class="stat-block"><div class="stat-label">Pilotes</div><div class="stat-value hi">${drivers}</div></div><div class="sep"></div><div class="stat-block" style="text-align:right"><div class="stat-label">${renderSourceTrigger(sourceLabel, sourceId, 'label')}</div><div class="stat-value">${renderSourceTrigger(sourceValue, sourceId, 'value')}</div></div>`;
}

const sourceModalEl = document.getElementById('source-modal');
const sourceModalTitleEl = document.getElementById('source-modal-title');
const sourceModalUrlEl = document.getElementById('source-modal-url');
const sourceModalActionEl = document.getElementById('source-modal-action');
let sourceModalLastTrigger = null;

function openSourceModal(sourceId, triggerEl = null) {
  const entry = SOURCE_ENTRIES[sourceId];
  if (!entry || !sourceModalEl || !sourceModalTitleEl || !sourceModalUrlEl || !sourceModalActionEl) return;
  sourceModalLastTrigger = triggerEl;
  const titleTextEl = sourceModalTitleEl.querySelector('span:last-child');
  if (titleTextEl) titleTextEl.textContent = entry.title;
  sourceModalUrlEl.textContent = entry.url;
  sourceModalUrlEl.href = entry.url;
  sourceModalActionEl.href = entry.url;
  sourceModalEl.classList.add('is-open');
  sourceModalEl.setAttribute('aria-hidden', 'false');
  document.body.classList.add('source-modal-open');
}

function closeSourceModal() {
  if (!sourceModalEl) return;
  sourceModalEl.classList.remove('is-open');
  sourceModalEl.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('source-modal-open');
  if (sourceModalLastTrigger instanceof HTMLElement) sourceModalLastTrigger.focus();
}

document.addEventListener('click', event => {
  const trigger = event.target instanceof Element ? event.target.closest('.js-source-trigger') : null;
  if (trigger instanceof HTMLElement) {
    openSourceModal(trigger.dataset.sourceId, trigger);
    return;
  }

  const closer = event.target instanceof Element ? event.target.closest('[data-source-close]') : null;
  if (closer) closeSourceModal();
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && sourceModalEl?.classList.contains('is-open')) {
    closeSourceModal();
  }
});

window.addEventListener('spa-nav-click', e => {
  const dir = e.detail?.direction;
  if (typeof dir !== 'number') return;
  if (!isSpaPage(currentPage)) return;
  goToPage(currentPage + dir);
});

// ── rpm deco ──────────────────────────────────────────────────────────────
const rpmEl = document.getElementById('rpm-deco');
[6,9,12,10,14,11,8,13,10,7,12,9,11,8,13,10,6,9,12,10].forEach((h, i) => {
  const b = document.createElement('div');
  b.className = 'rpm-bar';
  b.style.height = h * 2 + 'px';
  b.style.animationDelay = (i * 0.06) + 's';
  rpmEl.appendChild(b);
});

// ── renderer ──────────────────────────────────────────────────────────────
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.4;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.BasicShadowMap;
document.getElementById('canvas-wrap').appendChild(renderer.domElement);

// ── scene ─────────────────────────────────────────────────────────────────
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x080808);
scene.fog = new THREE.FogExp2(0x080808, 0.018);

// ── camera ────────────────────────────────────────────────────────────────
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 1000);

// Proxy caméra animé par GSAP
const cam = { px: 4, py: 1.8, pz: 6, tx: 0, ty: 0, tz: 0 };

// ── dev mode cam ──────────────────────────────────────────────────────────
// Activé via ?dev dans l'URL  →  navigation libre + panel de coordonnées copiables
const DEV_MODE = new URLSearchParams(location.search).has('dev');
const IS_DEV2  = new URLSearchParams(location.search).has('dev2');
if (IS_DEV2) document.body.classList.add('dev2-mode');
let devControls = null;
let _devPosEl = null, _devTargetEl = null;

function _devUpdatePanel() {
  if (!_devPosEl) return;
  const p = camera.position;
  const t = devControls.target;
  const f = v => v.toFixed(2);
  _devPosEl.textContent    = `pos    ${f(p.x)}, ${f(p.y)}, ${f(p.z)}`;
  _devTargetEl.textContent = `target ${f(t.x)}, ${f(t.y)}, ${f(t.z)}`;
}

function _devTeleport(raw) {
  const groups = [...raw.matchAll(/Vector3\(\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*\)/g)];
  if (groups.length < 2) return false;
  const [px, py, pz] = groups[0].slice(1).map(Number);
  const [tx, ty, tz] = groups[1].slice(1).map(Number);
  camera.position.set(px, py, pz);
  devControls.target.set(tx, ty, tz);
  devControls.update();
  return true;
}

function _devCopy() {
  const p = camera.position;
  const t = devControls.target;
  const f = v => v.toFixed(2);
  const str = `{ pos: new THREE.Vector3(${f(p.x)}, ${f(p.y)}, ${f(p.z)}), target: new THREE.Vector3(${f(t.x)}, ${f(t.y)}, ${f(t.z)}) },`;
  navigator.clipboard.writeText(str).then(() => {
    const btn = document.getElementById('_dev-copy-btn');
    btn.textContent = 'Copié !';
    btn.style.background = '#22c55e';
    setTimeout(() => { btn.textContent = 'Copier keyframe'; btn.style.background = '#ff1800'; }, 1500);
  });
}

if (DEV_MODE) {
  document.body.classList.add('hud-active');
  document.getElementById('canvas-wrap').style.pointerEvents = 'auto';
  renderer.domElement.style.pointerEvents = 'auto';

  const devStyle = document.createElement('style');
  devStyle.textContent = 'body > *:not(#canvas-wrap):not(#_dev-panel) { display: none !important; }';
  document.head.appendChild(devStyle);

  devControls = new OrbitControls(camera, renderer.domElement);
  devControls.enableDamping = true;
  devControls.dampingFactor = 0.06;
  devControls.target.set(cam.tx, cam.ty, cam.tz);
  devControls.update();

  const panel = document.createElement('div');
  panel.id = '_dev-panel';
  panel.style.cssText = [
    'position:fixed', 'bottom:24px', 'left:50%', 'transform:translateX(-50%)',
    'background:rgba(8,8,8,0.92)', 'border:1px solid #ff1800', 'border-radius:8px',
    'padding:16px 20px', 'font-family:monospace', 'font-size:13px', 'color:#fff',
    'z-index:99999', 'min-width:460px', 'user-select:none',
    'box-shadow:0 0 30px rgba(255,24,0,0.25)',
  ].join(';');
  panel.innerHTML = `
    <div style="color:#ff1800;font-weight:bold;letter-spacing:2px;margin-bottom:10px;font-size:11px;">DEV CAM — haasCamKF</div>
    <div id="_dev-pos"    style="color:#e5e5e5;margin-bottom:4px;"></div>
    <div id="_dev-target" style="color:#e5e5e5;margin-bottom:14px;"></div>
    <button id="_dev-copy-btn" style="background:#ff1800;color:#fff;border:none;border-radius:4px;padding:7px 18px;cursor:pointer;font-family:monospace;font-size:12px;letter-spacing:0.5px;">Copier keyframe</button>
    <span style="margin-left:14px;font-size:11px;color:#555;">clic+drag · scroll · clic-droit pan</span>
    <div style="margin-top:12px;border-top:1px solid #2a2a2a;padding-top:12px;display:flex;gap:8px;align-items:center;">
      <input id="_dev-goto" placeholder="coller un keyframe ici…" style="flex:1;background:#111;border:1px solid #333;border-radius:4px;padding:6px 10px;color:#fff;font-family:monospace;font-size:12px;outline:none;" />
      <button id="_dev-goto-btn" style="background:#333;color:#fff;border:none;border-radius:4px;padding:6px 14px;cursor:pointer;font-family:monospace;font-size:12px;white-space:nowrap;">Aller →</button>
    </div>
  `;
  document.body.appendChild(panel);
  _devPosEl    = document.getElementById('_dev-pos');
  _devTargetEl = document.getElementById('_dev-target');
  document.getElementById('_dev-copy-btn').addEventListener('click', _devCopy);

  const gotoInput = document.getElementById('_dev-goto');
  const gotoBtn   = document.getElementById('_dev-goto-btn');

  function _doGoto() {
    const ok = _devTeleport(gotoInput.value);
    gotoBtn.textContent = ok ? 'OK ✓' : 'Erreur';
    gotoBtn.style.background = ok ? '#22c55e' : '#dc2626';
    setTimeout(() => { gotoBtn.textContent = 'Aller →'; gotoBtn.style.background = '#333'; }, 1200);
    if (ok) gotoInput.value = '';
  }

  gotoBtn.addEventListener('click', _doGoto);
  gotoInput.addEventListener('keydown', e => { if (e.key === 'Enter') _doGoto(); });
  gotoInput.addEventListener('paste', () => setTimeout(_doGoto, 0));
}

// ── lighting ──────────────────────────────────────────────────────────────
scene.add(new THREE.AmbientLight(0xffffff, 0.3));

const underLight = new THREE.PointLight(0xe8002d, 0.2, 2);
underLight.position.set(0, 0.4, 0);
scene.add(underLight);

// ── lumière blanche diffuse de studio (plafond → dessus F1) ──────────────
const studioTopLight = new THREE.SpotLight(0xffffff, 8.0, 12, Math.PI / 3.5, 0.45, 1.5);
studioTopLight.position.set(-0.86, 4.40, 0.19);
studioTopLight.target.position.set(-0.86, -0.04, 0.19);
scene.add(studioTopLight);
scene.add(studioTopLight.target);

const studioSideR = new THREE.SpotLight(0xffffff, 6.0, 14, Math.PI / 4, 0.5, 1.5);
studioSideR.position.set(3.29, 0.68, 0.31);
studioSideR.target.position.set(-0.86, -0.04, 0.19);
scene.add(studioSideR);
scene.add(studioSideR.target);

const studioSideL = new THREE.SpotLight(0xffffff, 6.0, 14, Math.PI / 4, 0.5, 1.5);
studioSideL.position.set(-4.06, 0.28, 0.51);
studioSideL.target.position.set(-0.86, -0.04, 0.19);
scene.add(studioSideL);
scene.add(studioSideL.target);

const studioFront = new THREE.SpotLight(0xffffff, 6.0, 8, Math.PI / 4, 0.5, 1.5);
studioFront.position.set(-0.59, 0.23, -0.10);
studioFront.target.position.set(-0.59, 0.34, 0.27);
scene.add(studioFront);
scene.add(studioFront.target);

const studioRear = new THREE.SpotLight(0xffffff, 5.0, 14, Math.PI / 4, 0.5, 1.5);
studioRear.position.set(-0.60, 0.13, -4.38);
studioRear.target.position.set(-0.17, 0.24, 0.10);
scene.add(studioRear);
scene.add(studioRear.target);

const plongeLight = new THREE.SpotLight(0xff6633, 4.0, 12, Math.PI / 3.5, 0.5, 1.5);
plongeLight.position.set(-0.64, 4.44, 0.63);
plongeLight.target.position.set(-0.62, 0.67, -0.36);
scene.add(plongeLight);
scene.add(plongeLight.target);

// ── cache noir cockpit (bouche le trou visible depuis la vue intérieure) ──
const cockpitPatch = new THREE.Mesh(
  new THREE.PlaneGeometry(0.28, 0.18),
  new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide })
);
// Orienté pour faire face à la caméra depuis (-0.67, 0.41, 0.79)
cockpitPatch.position.set(-0.65, 0.37, 0.60);
cockpitPatch.lookAt(-0.67, 0.41, 0.79);
scene.add(cockpitPatch);

// ── glow lights pour les lights Haas (intensity 0 par défaut) ─────────────
const indicatorGlowL = new THREE.PointLight(0xffaa00, 0, 0.55, 2);
indicatorGlowL.position.set(-0.15, 0.90, 0.45);
scene.add(indicatorGlowL);

const indicatorGlowR = new THREE.PointLight(0xffaa00, 0, 0.55, 2);
indicatorGlowR.position.set(-1.05, 0.90, 0.45);
scene.add(indicatorGlowR);

const backlightGlowC = new THREE.PointLight(0xff1100, 0, 0.60, 2);
backlightGlowC.position.set(-0.60, 0.45, -1.55);
scene.add(backlightGlowC);

const backlightGlowL = new THREE.PointLight(0xff1100, 0, 0.55, 2);
backlightGlowL.position.set(-0.10, 0.85, -1.45);
scene.add(backlightGlowL);

const backlightGlowR = new THREE.PointLight(0xff1100, 0, 0.55, 2);
backlightGlowR.position.set(-1.10, 0.85, -1.45);
scene.add(backlightGlowR);



// ── environment ───────────────────────────────────────────────────────────
const pmrem = new THREE.PMREMGenerator(renderer);
pmrem.compileEquirectangularShader();
new RGBELoader().load(
  '/rise-3.hdr',
  texture => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    const envMap = pmrem.fromEquirectangular(texture).texture;
    scene.environment = envMap;
    scene.background = envMap;
    scene.environmentIntensity = 0.4;
    texture.dispose();
    pmrem.dispose();
  },
  undefined,
  err => console.error('HDR non chargé:', err)
);

// ── navigation par pages ──────────────────────────────────────────────────
//
// Pages virtuelles :
//   0       → hero initial   (translateY 0vh)
//   1       → hero CTA       (translateY 0vh, 1 étape overlay)
//   2–7     → era            (translateY -100vh, 1=intro, 5 étapes timeline)
//   8–55    → crash          (translateY -200vh, 48 pas, vidéo pinnée)
//   56–63   → viewer         (translateY -300vh, 8 étapes caméra)
//   64–67   → spa            (translateY -400vh, 4 POI)
//   68      → data           (translateY -500vh)
//   69      → conclusion     (translateY -600vh)

const HERO_PAGE_START = 0;
const HERO_PAGE_STEPS = 1;
const HERO_PAGE_END = HERO_PAGE_START + HERO_PAGE_STEPS;
const ERA_PAGE_START  = HERO_PAGE_END + 1;
const ERA_PAGE_STEPS  = 5;                           // 5 cartes timeline
const ERA_PAGE_END    = ERA_PAGE_START + ERA_PAGE_STEPS;
const CRASH_PAGE_START = ERA_PAGE_END + 1;
const CRASH_PAGE_STEPS = 48;
const CRASH_PAGE_END = CRASH_PAGE_START + CRASH_PAGE_STEPS - 1;
const VIEWER_PAGE_START = CRASH_PAGE_END + 1;
const VIEWER_PAGE_END = VIEWER_PAGE_START + 7;
const SPA_PAGE_START = VIEWER_PAGE_END + 1;
const SPA_PAGE_COUNT = 4;
const SPA_PAGE_END = SPA_PAGE_START + SPA_PAGE_COUNT - 1;
const DATA_PAGE = SPA_PAGE_END + 1;
const CONCLUSION_PAGE = DATA_PAGE + 1;
const PAGE_COUNT = CONCLUSION_PAGE + 1;
const CRASH_SCROLL_DISTANCE = 7000;
const CRASH_EXIT_DISTANCE = 220;
const DATA_SCROLL_DISTANCE = 5000;   // wheel delta to complete one full lap
const DATA_EXIT_DISTANCE   = 220;    // delta needed to exit the section
const CRASH_FRAME_COUNT = 301;
const CRASH_VELOCITY_GAIN = 0.25;
const CRASH_VELOCITY_FRICTION = 0.972;
const CRASH_VELOCITY_EPSILON = 0.003;
const CRASH_LERP_FACTOR = 0.08;
const WHEEL_GESTURE_GAP = 140;
const WHEEL_NAV_THRESHOLD = 42;
const WHEEL_NAV_LOCK_MS = 1150;
const INFOBOXES  = {
  // KF0: vue d'ensemble → pas d'infobox
  [VIEWER_PAGE_START + 1]: 'ib-haas-3', // freins carbone
  [VIEWER_PAGE_START + 2]: 'ib-haas-4', // halo
  [VIEWER_PAGE_START + 3]: 'ib-haas-5', // warnings rétroviseurs
  [VIEWER_PAGE_START + 4]: 'ib-haas-6', // cheminée
  [VIEWER_PAGE_START + 5]: 'ib-haas-8', // volant anti-retour
  [VIEWER_PAGE_START + 6]: 'ib-haas-7', // feux arrières
  // KF7: fin → pas d'infobox
};

const crashFrameEl = document.getElementById('crash-frame');
const crashCtx = crashFrameEl ? crashFrameEl.getContext('2d') : null;
const crashFrameUrls = Array.from({ length: CRASH_FRAME_COUNT }, (_, index) =>
  `/crash-frames/frame_${String(index + 1).padStart(3, '0')}.jpg`
);
const crashFrameImages = crashFrameUrls.map(src => {
  const img = new Image();
  img.src = src;
  return img;
});
let crashTargetFrame = 0;
let crashRenderedFrame = 0;
let crashFrameSrcIndex = 0;
let crashExitDistance = 0;
let crashExitDirection = 0;
let crashFrameVelocity = 0;
let activeCrashTitleIndex = -1;
// -1 = hidden, 0 = showing old layout, 1 = morphed to modern
let activeImolaState = -1;
// Frame thresholds for the Imola modal
const IMOLA_SHOW_FRAME  = 90;   // modal appears ~30% into sequence
const IMOLA_MORPH_FRAME = 230;  // morphs to modern ~few scrolls before end
const IMOLA_RESET_FRAME = 20;   // reset when scrolling back to start

function resizeCrashCanvas() {
  if (!crashFrameEl || !crashCtx) return;
  crashFrameEl.width = window.innerWidth;
  crashFrameEl.height = window.innerHeight;
  // Redraw current frame after resize
  renderCrashFrame(crashRenderedFrame);
}

function renderCrashFrame(frameIndex) {
  const clamped = THREE.MathUtils.clamp(frameIndex, 0, CRASH_FRAME_COUNT - 1);
  if (!crashCtx) return;
  const img = crashFrameImages[clamped];
  if (!img.complete || img.naturalWidth === 0) return;
  // Skip redraw if same frame and canvas dimensions didn't change
  if (crashFrameSrcIndex === clamped &&
      crashFrameEl.width === window.innerWidth &&
      crashFrameEl.height === window.innerHeight) return;
  crashFrameSrcIndex = clamped;
  // Draw with object-fit: cover behaviour
  const cw = crashFrameEl.width;
  const ch = crashFrameEl.height;
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;
  const scale = Math.max(cw / iw, ch / ih);
  const dw = iw * scale;
  const dh = ih * scale;
  const dx = (cw - dw) / 2;
  const dy = (ch - dh) / 2;
  crashCtx.drawImage(img, dx, dy, dw, dh);
}

function updateCrashTitles(frameIndex) {
  const introFrames = Math.floor(CRASH_FRAME_COUNT * 0.12);
  const sequenceFrames = CRASH_FRAME_COUNT - introFrames;
  let nextTitleIndex = -1;

  if (frameIndex >= introFrames) {
    const normalizedFrame = frameIndex - introFrames;
    const titleWindow = Math.max(1, Math.floor(sequenceFrames / 3));
    nextTitleIndex = Math.min(
      2,
      Math.floor(normalizedFrame / titleWindow),
    );
  }

  if (nextTitleIndex !== activeCrashTitleIndex) {
    activeCrashTitleIndex = nextTitleIndex;
    window.dispatchEvent(new CustomEvent('crash-title-change', {
      detail: { index: nextTitleIndex },
    }));
  }

  // ── Imola modal state ────────────────────────────────────────────────
  let nextImolaState = activeImolaState;
  if (frameIndex < IMOLA_RESET_FRAME) {
    nextImolaState = -1;
  } else if (frameIndex >= IMOLA_MORPH_FRAME) {
    nextImolaState = 1;
  } else if (frameIndex >= IMOLA_SHOW_FRAME) {
    nextImolaState = 0;
  }

  if (nextImolaState !== activeImolaState) {
    activeImolaState = nextImolaState;
    if (nextImolaState === -1) {
      window.dispatchEvent(new CustomEvent('crash-imola-reset'));
    } else if (nextImolaState === 0) {
      window.dispatchEvent(new CustomEvent('crash-imola-show'));
    } else {
      window.dispatchEvent(new CustomEvent('crash-imola-morph'));
    }
  }
}

function setCrashProgress(nextProgress, immediate = false) {
  const clamped = THREE.MathUtils.clamp(nextProgress, 0, 1);
  crashTargetFrame = clamped * (CRASH_FRAME_COUNT - 1);
  if (immediate) {
    crashRenderedFrame = Math.round(crashTargetFrame);
    renderCrashFrame(crashRenderedFrame);
  }
  if (clamped > 0.005 && clamped < 0.995) {
    crashExitDistance = 0;
    crashExitDirection = 0;
  }
}

function isCrashPage(idx) {
  return idx >= CRASH_PAGE_START && idx <= CRASH_PAGE_END;
}

function crashPageToProgress(idx) {
  return (idx - CRASH_PAGE_START) / (CRASH_PAGE_STEPS - 1);
}

function crashFrameToProgress(frameIndex) {
  return frameIndex / (CRASH_FRAME_COUNT - 1);
}

function normalizeWheelDelta(event) {
  let delta = event.deltaY;
  if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) delta *= 16;
  if (event.deltaMode === WheelEvent.DOM_DELTA_PAGE) delta *= window.innerHeight;
  return delta;
}

resizeCrashCanvas();
// Draw frame 0 immediately if already decoded, otherwise wait for load
const _firstCrashImg = crashFrameImages[0];
if (_firstCrashImg.complete && _firstCrashImg.naturalWidth > 0) {
  crashFrameSrcIndex = -1; // force redraw
  renderCrashFrame(0);
} else {
  _firstCrashImg.onload = () => {
    crashFrameSrcIndex = -1;
    renderCrashFrame(0);
  };
}
updateCrashTitles(0);

function isEraPage(idx) {
  return idx >= ERA_PAGE_START && idx <= ERA_PAGE_END;
}

function isHeroPage(idx) {
  return idx >= HERO_PAGE_START && idx <= HERO_PAGE_END;
}

function dispatchHeroStepChange(pageIdx) {
  const step = pageIdx <= HERO_PAGE_START ? -1 : Math.min(HERO_PAGE_STEPS - 1, pageIdx - HERO_PAGE_START - 1);
  const heroSectionEl = document.getElementById('s-hero');
  heroSectionEl?.classList.toggle('is-story-active', step >= 0);
  window.dispatchEvent(new CustomEvent('hero-step-change', { detail: { step } }));
}

function dispatchEraStepChange(pageIdx) {
  // page ERA_PAGE_START = intro (step -1), ERA_PAGE_START+1 = step 0, …
  const step = isEraPage(pageIdx) ? pageIdx - ERA_PAGE_START - 1 : -1;
  window.dispatchEvent(new CustomEvent('era-step-change', { detail: { step } }));
}

function pageToY(idx) {
  if (isHeroPage(idx)) return 0;
  if (isEraPage(idx)) return -100;
  if (idx >= CRASH_PAGE_START && idx <= CRASH_PAGE_END) return -200;
  if (idx >= VIEWER_PAGE_START && idx <= VIEWER_PAGE_END) return -300;
  if (idx >= SPA_PAGE_START && idx <= SPA_PAGE_END) return -400;
  if (idx === DATA_PAGE) return -500;
  if (idx === CONCLUSION_PAGE) return -600;
  return -700;
}

function pageToCamera(idx) {
  // Retourne l'index camKF correspondant, ou -1 si pas une page caméra
  if (idx === VIEWER_PAGE_START) return 0;
  if (idx === VIEWER_PAGE_START + 1) return 1;
  if (idx === VIEWER_PAGE_START + 2) return 2;
  if (idx === VIEWER_PAGE_START + 3) return 3;
  if (idx === VIEWER_PAGE_START + 4) return 4;
  if (idx === VIEWER_PAGE_START + 5) return 5;
  if (idx === VIEWER_PAGE_START + 6) return 6;
  if (idx === VIEWER_PAGE_START + 7) return 7;
  if (idx === VIEWER_PAGE_START + 8) return 8;
  return -1;
}

let currentPage  = 0;
let isTransitioning = false;
let modelLoaded  = false;
let haasModel    = null;
let haasIndicatorMaterials = [];
let haasBlinkerAnim = null;
let haasBacklightMaterials = [];
let haasBacklightAnim = null;
const haasCamKF = [
  { pos: new THREE.Vector3( 0.86,  0.96,  3.31), target: new THREE.Vector3(-0.49,  0.26,  0.89) }, // 0: vue d'ensemble
  { pos: new THREE.Vector3( 0.99,  0.43,  1.57), target: new THREE.Vector3(-0.49,  0.26,  0.89) }, // 1: freins carbone céramique
  { pos: new THREE.Vector3( 0.15,  0.98,  0.82), target: new THREE.Vector3(-0.34,  0.64,  0.23) }, // 2: halo
  { pos: new THREE.Vector3(-1.29, 0.69, 0.59), target: new THREE.Vector3(-0.70, 0.44, 0.17) }, // 3: rétroviseurs warning (blinker)
  { pos: new THREE.Vector3(-1.04,  0.81,  0.19), target: new THREE.Vector3(-0.69,  0.70, -0.11) }, // 4: cheminée
  { pos: new THREE.Vector3(-0.66, 0.60, 0.22), target: new THREE.Vector3(-0.38, 0.27, 0.85) }, // 5: volant anti-retour
  { pos: new THREE.Vector3(-1.39, 0.36, -3.04), target: new THREE.Vector3(0.08, 0.49, 0.73) }, // 6: feux arrières (backlight)
  { pos: new THREE.Vector3(-0.72,  0.33, -2.22), target: new THREE.Vector3( 0.04,  0.58, -0.10) }, // 7: fin (backlight)
];
let wheelGestureAccum = 0;
let wheelGestureDirection = 0;
let wheelLastEventAt = 0;
let wheelUnlockAt = 0;

// ── DATA section state ─────────────────────────────────────────────────
let dataProgress     = 0;   // 0 → 1 (full lap)
let dataExitDistance = 0;
let dataExitDirection = 0;

function dispatchDataProgress(p) {
  window.dispatchEvent(new CustomEvent('data-anim-progress', { detail: { progress: p } }));
}

const pageEl = document.getElementById('page');
const conclusionSectionEl = document.getElementById('s-conclusion');
let lastSectionNavProgress = -1;
let lastSectionNavIndex = -1;

function isSpaPage(idx) {
  return idx >= SPA_PAGE_START && idx <= SPA_PAGE_END;
}


function dispatchSpaPoiChange(pageIdx) {
  const index = isSpaPage(pageIdx) ? pageIdx - SPA_PAGE_START : -1;
  window.dispatchEvent(new CustomEvent('spa-poi-change', { detail: { index } }));
}

function pageToSectionIndex(pageIdx) {
  if (isHeroPage(pageIdx)) return 0;
  if (isEraPage(pageIdx)) return 1;
  if (pageIdx >= CRASH_PAGE_START && pageIdx <= CRASH_PAGE_END) return 2;
  if (pageIdx >= VIEWER_PAGE_START && pageIdx <= VIEWER_PAGE_END) return 3;
  if (pageIdx >= SPA_PAGE_START && pageIdx <= SPA_PAGE_END) return 4;
  if (pageIdx === DATA_PAGE) return 5;
  if (pageIdx === CONCLUSION_PAGE) return 6;
  return 6;
}

function pageToSectionProgress(pageIdx) {
  if (isHeroPage(pageIdx)) {
    const heroProgress = pageIdx / Math.max(1, HERO_PAGE_END);
    return heroProgress * 0.92;
  }
  if (isEraPage(pageIdx)) {
    const eraProgress = (pageIdx - ERA_PAGE_START) / ERA_PAGE_STEPS;
    return 1 + eraProgress * 0.92;
  }
  if (pageIdx >= CRASH_PAGE_START && pageIdx <= CRASH_PAGE_END) {
    return 2 + crashFrameToProgress(crashRenderedFrame) * 0.92;
  }
  if (pageIdx >= VIEWER_PAGE_START && pageIdx <= VIEWER_PAGE_END) {
    const viewerProgress = (pageIdx - VIEWER_PAGE_START) / Math.max(1, VIEWER_PAGE_END - VIEWER_PAGE_START);
    return 3 + viewerProgress * 0.92;
  }
  if (pageIdx >= SPA_PAGE_START && pageIdx <= SPA_PAGE_END) {
    const spaProgress = (pageIdx - SPA_PAGE_START) / Math.max(1, SPA_PAGE_END - SPA_PAGE_START);
    return 4 + spaProgress * 0.92;
  }
  if (pageIdx === DATA_PAGE) return 5;
  if (pageIdx === CONCLUSION_PAGE) return 6;
  return 6;
}

function updateSectionNav(pageIdx = currentPage) {
  const progress = pageToSectionProgress(pageIdx);
  const activeSectionIndex = pageToSectionIndex(pageIdx);
  if (
    Math.abs(progress - lastSectionNavProgress) < 0.001 &&
    activeSectionIndex === lastSectionNavIndex
  ) {
    return;
  }

  lastSectionNavProgress = progress;
  lastSectionNavIndex = activeSectionIndex;
  window.dispatchEvent(new CustomEvent('section-nav-progress', {
    detail: { progress, activeSectionIndex },
  }));
}

function sectionToPage(sectionIdx) {
  if (sectionIdx <= 0) return 0;
  if (sectionIdx === 1) return ERA_PAGE_START;
  if (sectionIdx === 2) return CRASH_PAGE_START;
  if (sectionIdx === 3) return VIEWER_PAGE_START;
  if (sectionIdx === 4) return SPA_PAGE_START;
  if (sectionIdx === 5) return DATA_PAGE;
  if (sectionIdx === 6) return CONCLUSION_PAGE;
  return CONCLUSION_PAGE;
}

window.addEventListener('section-nav-jump', event => {
  const sectionIdx = event.detail?.sectionIndex;
  if (typeof sectionIdx !== 'number') return;
  goToPage(sectionToPage(sectionIdx));
});

window.addEventListener('hero-next-step', () => {
  if (!isHeroPage(currentPage) || currentPage >= HERO_PAGE_END) return;
  goToPage(currentPage + 1);
});

function resetWheelGesture() {
  wheelGestureAccum = 0;
  wheelGestureDirection = 0;
  wheelLastEventAt = 0;
}

// ── dots ──────────────────────────────────────────────────────────────────
const dotsEl = document.createElement('div');
dotsEl.style.cssText = `
  position:fixed; right:30px; top:50%; transform:translateY(-50%);
  display:flex; flex-direction:column; gap:10px;
  pointer-events:none; z-index:30;
  opacity:0; transition:opacity 0.6s ease;
`;
document.body.appendChild(dotsEl);

function rebuildDots() {
  dotsEl.innerHTML = '';
  const startPage = VIEWER_PAGE_START;
  const endPage   = VIEWER_PAGE_END;
  for (let i = 0; i <= endPage - startPage; i++) {
    const pageIdx = startPage + i;
    const d = document.createElement('div');
    d.style.cssText = `
      width:6px; height:6px; border-radius:50%;
      background:${currentPage === pageIdx ? '#e8002d' : 'rgba(255,255,255,0.2)'};
      transition:background .4s, transform .4s;
      cursor:pointer;
    `;
    d.addEventListener('click', () => {
      if (!modelLoaded || isTransitioning) return;
      goToPage(pageIdx);
    });
    dotsEl.appendChild(d);
  }
}

function updateDots() {
  const startPage = VIEWER_PAGE_START;
  dotsEl.querySelectorAll('div').forEach((d, i) => {
    const pageIdx = startPage + i;
    d.style.background = currentPage === pageIdx ? '#e8002d' : 'rgba(255,255,255,0.2)';
    d.style.transform  = currentPage === pageIdx ? 'scale(1.5)' : 'scale(1)';
  });
}

// ── HUD ───────────────────────────────────────────────────────────────────
let _lastViewerKind = '';
function updateHUD(pageIdx) {
  const isHaas = pageIdx >= VIEWER_PAGE_START && pageIdx <= VIEWER_PAGE_END;
  const kind = isHaas ? 'haas' : '';
  if (kind !== _lastViewerKind) { _lastViewerKind = kind; rebuildDots(); }
  document.body.classList.toggle('hud-active', isHaas);
  dotsEl.style.opacity = isHaas ? '1' : '0';
  dotsEl.style.pointerEvents = isHaas ? 'auto' : 'none';
  if (!isHaas) {
    document.querySelectorAll('.infobox').forEach(el => el.classList.remove('visible'));
  }
  if (haasModel) haasModel.visible = isHaas;
  if (!isHaas) { stopHaasBlinker(); stopHaasBacklight(); }
  const topbarEl = document.getElementById('topbar');
  const statusbarEl = document.getElementById('statusbar');
  if (topbarEl && statusbarEl) {
    if (isHaas) {
      topbarEl.innerHTML = '<div><div class="brand-team">MoneyGram Haas F1</div><div class="brand-car"><span>VF</span>-26</div></div><div class="season">Formule 1 · Saison 2026</div>';
      statusbarEl.innerHTML = renderStatusbar({
        chassis: 'VF-26/C1',
        powerUnit: 'Ferrari 066/11',
        drivers: 'Bearman · Ocon',
        sourceLabel: '3D model source',
        sourceValue: 'Selva Marcello',
        sourceId: 'selva-marcello-3d',
      });
    }
  }
}

function shouldRenderScene() {
  return document.body.classList.contains('hud-active') || isTransitioning;
}

// ── snap caméra ───────────────────────────────────────────────────────────
function startHaasBacklight() {
  if (haasBacklightAnim) return;
  const proxy = { v: 0 };
  haasBacklightAnim = gsap.to(proxy, {
    v: 1,
    duration: 0.28,
    repeat: -1,
    yoyo: true,
    ease: 'power2.inOut',
    onUpdate() {
      const i = proxy.v;
      haasBacklightMaterials.forEach(m => {
        m.emissive.setRGB(i, 0, 0);
        m.emissiveIntensity = i * 3.5;
      });
      backlightGlowC.intensity = i * 1.1;
      backlightGlowL.intensity = i * 0.9;
      backlightGlowR.intensity = i * 0.9;
    },
    onComplete() {},
  });
}

function stopHaasBacklight() {
  if (haasBacklightAnim) { haasBacklightAnim.kill(); haasBacklightAnim = null; }
  haasBacklightMaterials.forEach(m => { m.emissive.setRGB(0, 0, 0); m.emissiveIntensity = 0; });
  backlightGlowC.intensity = 0;
  backlightGlowL.intensity = 0;
  backlightGlowR.intensity = 0;
}

function startHaasBlinker() {
  if (haasBlinkerAnim) return;
  const proxy = { v: 0 };
  haasBlinkerAnim = gsap.to(proxy, {
    v: 1,
    duration: 0.38,
    repeat: -1,
    yoyo: true,
    ease: 'power2.inOut',
    onUpdate() {
      const i = proxy.v;
      haasIndicatorMaterials.forEach(m => { m.emissiveIntensity = i * 3; });
      indicatorGlowL.intensity = i * 0.9;
      indicatorGlowR.intensity = i * 0.9;
    },
  });
}

function stopHaasBlinker() {
  if (haasBlinkerAnim) { haasBlinkerAnim.kill(); haasBlinkerAnim = null; }
  haasIndicatorMaterials.forEach(m => { m.emissiveIntensity = 0; });
  indicatorGlowL.intensity = 0;
  indicatorGlowR.intensity = 0;
}

function snapCamera(camIdx, onDone) {
  const kf = haasCamKF;
  if (!kf[camIdx]) { onDone?.(); return; }

  document.querySelectorAll('.infobox').forEach(el => el.classList.remove('visible'));

  gsap.to(cam, {
    px: kf[camIdx].pos.x,    py: kf[camIdx].pos.y,    pz: kf[camIdx].pos.z,
    tx: kf[camIdx].target.x, ty: kf[camIdx].target.y, tz: kf[camIdx].target.z,
    duration: 1.2,
    ease: 'power2.inOut',
    onComplete: () => {
      const ibId = INFOBOXES[VIEWER_PAGE_START + camIdx];
      if (ibId) document.getElementById(ibId)?.classList.add('visible');
      if (camIdx === 3) startHaasBlinker(); else stopHaasBlinker();
      if (camIdx === 6 || camIdx === 7) startHaasBacklight(); else stopHaasBacklight();
      onDone?.();
    },
  });
}

// ── aller à une page ──────────────────────────────────────────────────────
function goToPage(idx, { skipSpaComplete = false } = {}) {
  if (isTransitioning || idx < 0 || idx >= PAGE_COUNT) return;

  // Compléter le tracé du circuit AVANT de quitter la section Spa
  if (currentPage === SPA_PAGE_END && idx === DATA_PAGE && !skipSpaComplete) {
    isTransitioning = true;
    resetWheelGesture();
    window.dispatchEvent(new CustomEvent('spa-poi-change', { detail: { index: SPA_PAGE_COUNT } }));
    setTimeout(() => {
      isTransitioning = false;
      goToPage(DATA_PAGE, { skipSpaComplete: true });
    }, 1200);
    return;
  }

  isTransitioning = true;
  resetWheelGesture();

  const prevPage = currentPage;
  if (prevPage !== CONCLUSION_PAGE && idx === CONCLUSION_PAGE && conclusionSectionEl) {
    conclusionSectionEl.scrollTop = 0;
  }
  if (prevPage === CONCLUSION_PAGE && idx !== CONCLUSION_PAGE && conclusionSectionEl) {
    conclusionSectionEl.scrollTop = 0;
  }
  if (isCrashPage(idx) && prevPage < CRASH_PAGE_START) {
    setCrashProgress(0, true);
  }
  if (isCrashPage(idx) && prevPage > CRASH_PAGE_END) {
    setCrashProgress(1, true);
  }
  currentPage = idx;
  updateHUD(idx);
  updateSectionNav(idx);

  const targetY  = pageToY(idx);
  const currentY = pageToY(prevPage);
  const camIdx   = pageToCamera(idx);

  // Era sub-pages : la section reste à -100vh, on dispatche juste l'étape
  if (targetY === currentY && isEraPage(idx)) {
    dispatchEraStepChange(idx);
    updateSectionNav(idx);
    isTransitioning = false;
    return;
  }

  if (targetY === currentY && isHeroPage(idx)) {
    dispatchHeroStepChange(idx);
    updateSectionNav(idx);
    isTransitioning = false;
    return;
  }

  // Si on reste sur la même section (crash) → seulement la frame change
  if (targetY === currentY && isCrashPage(idx)) {
    setCrashProgress(crashPageToProgress(idx));
    isTransitioning = false;
    return;
  }

  if (targetY === currentY && camIdx >= 0) {
    updateDots();
    snapCamera(camIdx, () => { isTransitioning = false; });
    return;
  }

  if (targetY === currentY && isSpaPage(idx)) {
    updateSectionNav(idx);
    dispatchSpaPoiChange(idx);
    isTransitioning = false;
    return;
  }

  // Sinon : on translate #page
  gsap.to(pageEl, {
    y: `${targetY}vh`,
    duration: 1.0,
    ease: 'power3.inOut',
    onComplete: () => {
      if (isHeroPage(idx)) {
        dispatchHeroStepChange(idx);
        updateSectionNav(idx);
        isTransitioning = false;
      } else if (isEraPage(idx)) {
        dispatchEraStepChange(idx);
        updateSectionNav(idx);
        isTransitioning = false;
      } else if (isCrashPage(idx)) {
        setCrashProgress(crashPageToProgress(idx), true);
        updateSectionNav(idx);
        isTransitioning = false;
      } else if (camIdx >= 0) {
        updateDots();
        updateSectionNav(idx);
        snapCamera(camIdx);
        isTransitioning = false;
      } else if (isSpaPage(idx)) {
        updateSectionNav(idx);
        dispatchSpaPoiChange(idx);
        isTransitioning = false;
      } else if (idx === DATA_PAGE) {
        dataProgress = 0;
        dataExitDistance = 0;
        dataExitDirection = 0;
        dispatchDataProgress(0);
        updateSectionNav(idx);
        isTransitioning = false;
      } else {
        updateSectionNav(idx);
        isTransitioning = false;
      }
    },
  });
}

// ── wheel : 1 tick = 1 page ───────────────────────────────────────────────
window.addEventListener('wheel', e => {
  if (DEV_MODE) return;

  if (currentPage === CONCLUSION_PAGE) {
    e.preventDefault();
    if (!modelLoaded || isTransitioning) return;

    const delta = normalizeWheelDelta(e);
    if (Math.abs(delta) < 1) return;

    if (!(conclusionSectionEl instanceof HTMLElement)) return;

    const maxScrollTop = Math.max(0, conclusionSectionEl.scrollHeight - conclusionSectionEl.clientHeight);
    const isAtTop = conclusionSectionEl.scrollTop <= 0;
    const isAtBottom = conclusionSectionEl.scrollTop >= maxScrollTop - 1;
    const direction = delta > 0 ? 1 : -1;

    if (direction > 0 && !isAtBottom) {
      conclusionSectionEl.scrollTop = Math.min(maxScrollTop, conclusionSectionEl.scrollTop + delta);
      resetWheelGesture();
      return;
    }

    if (direction < 0 && !isAtTop) {
      conclusionSectionEl.scrollTop = Math.max(0, conclusionSectionEl.scrollTop + delta);
      resetWheelGesture();
      return;
    }

    if (direction > 0) return;

    const now = performance.now();
    if (now < wheelUnlockAt) return;
    const isNewGesture = now - wheelLastEventAt > WHEEL_GESTURE_GAP || direction !== wheelGestureDirection;

    if (isNewGesture) {
      wheelGestureAccum = delta;
      wheelGestureDirection = direction;
    } else {
      wheelGestureAccum += delta;
    }

    wheelLastEventAt = now;
    if (Math.abs(wheelGestureAccum) < WHEEL_NAV_THRESHOLD) return;

    wheelUnlockAt = now + WHEEL_NAV_LOCK_MS;
    goToPage(currentPage + direction);
    return;
  }

  e.preventDefault();
  if (!modelLoaded || isTransitioning) return;

  const delta = normalizeWheelDelta(e);
  if (Math.abs(delta) < 1) return;

  if (isEraPage(currentPage)) {
    const now = performance.now();
    if (now < wheelUnlockAt) return;
    const direction = delta > 0 ? 1 : -1;
    const isNewGesture = now - wheelLastEventAt > WHEEL_GESTURE_GAP || direction !== wheelGestureDirection;
    if (isNewGesture) {
      wheelGestureAccum = delta;
      wheelGestureDirection = direction;
    } else {
      wheelGestureAccum += delta;
    }
    wheelLastEventAt = now;
    if (Math.abs(wheelGestureAccum) < WHEEL_NAV_THRESHOLD) return;
    wheelUnlockAt = now + WHEEL_NAV_LOCK_MS;
    goToPage(currentPage + direction);
    return;
  }

  if (isCrashPage(currentPage)) {
    const direction = delta > 0 ? 1 : -1;
    const distance = Math.abs(delta);

    if (direction > 0) {
      if (crashTargetFrame < CRASH_FRAME_COUNT - 1) {
        crashFrameVelocity += delta / CRASH_SCROLL_DISTANCE * (CRASH_FRAME_COUNT - 1) * CRASH_VELOCITY_GAIN;
        crashExitDistance = 0;
        crashExitDirection = 0;
        return;
      }

      if (crashExitDirection !== direction) {
        crashExitDirection = direction;
        crashExitDistance = 0;
      }
      crashExitDistance += distance;
      if (crashExitDistance >= CRASH_EXIT_DISTANCE) goToPage(VIEWER_PAGE_START);
      return;
    }

    if (crashTargetFrame > 0) {
      crashFrameVelocity += delta / CRASH_SCROLL_DISTANCE * (CRASH_FRAME_COUNT - 1) * CRASH_VELOCITY_GAIN;
      crashExitDistance = 0;
      crashExitDirection = 0;
      return;
    }

    if (crashExitDirection !== direction) {
      crashExitDirection = direction;
      crashExitDistance = 0;
    }
    crashExitDistance += distance;
    if (crashExitDistance >= CRASH_EXIT_DISTANCE) goToPage(ERA_PAGE_END);
    return;
  }

  // ── DATA section: wheel drives the lap animation ───────────────────
  if (currentPage === DATA_PAGE) {
    const direction = delta > 0 ? 1 : -1;
    const distance  = Math.abs(delta);

    if (direction > 0) {
      if (dataProgress < 1) {
        dataProgress = Math.min(1, dataProgress + distance / DATA_SCROLL_DISTANCE);
        dispatchDataProgress(dataProgress);
        dataExitDistance  = 0;
        dataExitDirection = 0;
        return;
      }
      if (dataExitDirection !== direction) { dataExitDirection = direction; dataExitDistance = 0; }
      dataExitDistance += distance;
      if (dataExitDistance >= DATA_EXIT_DISTANCE) { dataProgress = 0; goToPage(CONCLUSION_PAGE); }
      return;
    }

    if (dataProgress > 0) {
      dataProgress = Math.max(0, dataProgress - distance / DATA_SCROLL_DISTANCE);
      dispatchDataProgress(dataProgress);
      dataExitDistance  = 0;
      dataExitDirection = 0;
      return;
    }
    if (dataExitDirection !== direction) { dataExitDirection = direction; dataExitDistance = 0; }
    dataExitDistance += distance;
    if (dataExitDistance >= DATA_EXIT_DISTANCE) { dataProgress = 0; goToPage(SPA_PAGE_END); }
    return;
  }

  const now = performance.now();
  if (now < wheelUnlockAt) return;

  const direction = delta > 0 ? 1 : -1;
  const isNewGesture = now - wheelLastEventAt > WHEEL_GESTURE_GAP || direction !== wheelGestureDirection;

  if (isNewGesture) {
    wheelGestureAccum = delta;
    wheelGestureDirection = direction;
  } else {
    wheelGestureAccum += delta;
  }

  wheelLastEventAt = now;

  if (Math.abs(wheelGestureAccum) < WHEEL_NAV_THRESHOLD) return;

  wheelUnlockAt = now + WHEEL_NAV_LOCK_MS;
  goToPage(currentPage + direction);
}, { passive: false });

dispatchHeroStepChange(currentPage);

// ── keyboard navigation ───────────────────────────────────────────────────
window.addEventListener('keydown', e => {
  if (DEV_MODE) return;
  if (!modelLoaded || isTransitioning) return;
  if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;

  const direction = e.key === 'ArrowDown' ? 1 : -1;

  if (isCrashPage(currentPage)) {
    const step = (CRASH_FRAME_COUNT - 1) / CRASH_PAGE_STEPS;
    crashFrameVelocity += direction * step * CRASH_VELOCITY_GAIN;

    const now = performance.now();
    if (now < wheelUnlockAt) return;

    const atEnd   = direction > 0 && crashTargetFrame >= CRASH_FRAME_COUNT - 1;
    const atStart = direction < 0 && crashTargetFrame <= 0;

    if (atEnd)   { wheelUnlockAt = now + WHEEL_NAV_LOCK_MS; goToPage(VIEWER_PAGE_START); }
    if (atStart) { wheelUnlockAt = now + WHEEL_NAV_LOCK_MS; goToPage(CRASH_PAGE_START - 1); }
    return;
  }

  if (currentPage === DATA_PAGE) {
    const now = performance.now();
    if (now < wheelUnlockAt) return;
    if (direction > 0) {
      if (dataProgress < 1) {
        dataProgress = Math.min(1, dataProgress + 0.12);
        dispatchDataProgress(dataProgress);
        return;
      }
      wheelUnlockAt = now + WHEEL_NAV_LOCK_MS;
      dataProgress = 0;
      goToPage(CONCLUSION_PAGE);
    } else {
      if (dataProgress > 0) {
        dataProgress = Math.max(0, dataProgress - 0.12);
        dispatchDataProgress(dataProgress);
        return;
      }
      wheelUnlockAt = now + WHEEL_NAV_LOCK_MS;
      dataProgress = 0;
      goToPage(SPA_PAGE_END);
    }
    return;
  }

  const now = performance.now();
  if (now < wheelUnlockAt) return;
  wheelUnlockAt = now + WHEEL_NAV_LOCK_MS;
  goToPage(currentPage + direction);
});

// ── load glb ──────────────────────────────────────────────────────────────
const fillEl   = document.getElementById('fill');
const pctEl    = document.getElementById('pct');
const loaderEl = document.getElementById('loader');

new GLTFLoader().load(studioGlbUrl, gltf => {
  const studio = gltf.scene;
  studio.traverse(node => { if (node.isMesh) node.receiveShadow = true; });
  studio.position.z = 70;
  studio.position.x = -0.5;
  scene.add(studio);
}, undefined, err => console.warn('Studio non chargé:', err));

if (IS_DEV2) {
  modelLoaded = true;
  rebuildDots();
  loaderEl.classList.add('hidden');
  goToPage(DATA_PAGE);
} else
new GLTFLoader().load(
  '/haas/2026_HAASF1_CGT-V4.glb',
  gltf => {
    haasModel = gltf.scene;

    haasModel.traverse(node => {
      if (!node.isMesh) return;
      node.castShadow = false;
      node.receiveShadow = false;
      if (node.material) {
        const mats = Array.isArray(node.material) ? node.material : [node.material];
        mats.forEach(m => {
          m.envMapIntensity = 1.8;
          if (m.map) { m.map.anisotropy = renderer.capabilities.getMaxAnisotropy(); m.map.needsUpdate = true; }
          // Détection des matériaux indicateurs (clignotants rétroviseurs)
          const emissiveSrc = m.emissiveMap?.image?.src || m.emissiveMap?.image?.currentSrc || m.emissiveMap?.name || '';
          const isIndicator = /indicator/i.test(m.name) || /indicator/i.test(node.name) || /indicator/i.test(emissiveSrc);
          if (isIndicator) {
            m.emissiveIntensity = 0;
            if (!haasIndicatorMaterials.includes(m)) haasIndicatorMaterials.push(m);
          }
          // Détection des feux arrière (feu pluie central + endplates aileron)
          const isBacklight = /backlight/i.test(m.name) || /backlight/i.test(node.name) || /backlight/i.test(emissiveSrc);
          if (isBacklight) {
            m.emissive = new THREE.Color(1, 0, 0);
            m.emissiveIntensity = 0;
            if (!haasBacklightMaterials.includes(m)) haasBacklightMaterials.push(m);
          }
          m.needsUpdate = true;
        });
      }
    });

    const box0   = new THREE.Box3().setFromObject(haasModel);
    const size0  = box0.getSize(new THREE.Vector3());
    haasModel.scale.setScalar(4 / Math.max(size0.x, size0.y, size0.z));

    const box    = new THREE.Box3().setFromObject(haasModel);
    const center = box.getCenter(new THREE.Vector3());
    const size   = box.getSize(new THREE.Vector3());
    haasModel.position.sub(center);
    haasModel.position.y += size.y / 2;
    haasModel.position.x -= 0.6;

    cam.px = haasCamKF[0].pos.x;    cam.py = haasCamKF[0].pos.y;    cam.pz = haasCamKF[0].pos.z;
    cam.tx = haasCamKF[0].target.x; cam.ty = haasCamKF[0].target.y; cam.tz = haasCamKF[0].target.z;

    if (DEV_MODE && devControls) {
      camera.position.set(cam.px, cam.py, cam.pz);
      devControls.target.set(cam.tx, cam.ty, cam.tz);
      devControls.update();
    }

    haasModel.visible = DEV_MODE ? true : false;
    scene.add(haasModel);

    modelLoaded = true;
    rebuildDots();

    fillEl.style.width = '100%';
    pctEl.textContent  = '100%';
    setTimeout(() => loaderEl.classList.add('hidden'), 400);
  },
  xhr => {
    if (xhr.lengthComputable) {
      const p = Math.round(xhr.loaded / xhr.total * 100);
      fillEl.style.width = p + '%';
      pctEl.textContent  = p + '%';
    }
  },
  err => { console.error(err); pctEl.textContent = 'Erreur'; }
);

// ── resize ────────────────────────────────────────────────────────────────
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  resizeCrashCanvas();
});

// ── render loop ───────────────────────────────────────────────────────────
(function animate() {
  requestAnimationFrame(animate);
  if (Math.abs(crashFrameVelocity) > CRASH_VELOCITY_EPSILON) {
    const nextTargetFrame = THREE.MathUtils.clamp(
      crashTargetFrame + crashFrameVelocity,
      0,
      CRASH_FRAME_COUNT - 1,
    );
    crashTargetFrame = nextTargetFrame;
    currentPage = isCrashPage(currentPage)
      ? THREE.MathUtils.clamp(
          Math.round(CRASH_PAGE_START + crashFrameToProgress(crashTargetFrame) * (CRASH_PAGE_STEPS - 1)),
          CRASH_PAGE_START,
          CRASH_PAGE_END,
        )
      : currentPage;

    if (nextTargetFrame <= 0 || nextTargetFrame >= CRASH_FRAME_COUNT - 1) {
      crashFrameVelocity *= 0.5;
    } else {
      crashFrameVelocity *= CRASH_VELOCITY_FRICTION;
    }
  } else {
    crashFrameVelocity = 0;
  }

  // Lerp: rendered frame eases toward target — gives organic inertia on start/stop
  const lerpDelta = crashTargetFrame - crashRenderedFrame;
  if (Math.abs(lerpDelta) > 0.05) {
    crashRenderedFrame += lerpDelta * CRASH_LERP_FACTOR;
  } else {
    crashRenderedFrame = crashTargetFrame;
  }
  const renderedIndex = Math.round(crashRenderedFrame);
  renderCrashFrame(renderedIndex);
  updateCrashTitles(renderedIndex);

  if (isCrashPage(currentPage)) {
    currentPage = THREE.MathUtils.clamp(
      Math.round(CRASH_PAGE_START + crashFrameToProgress(crashRenderedFrame) * (CRASH_PAGE_STEPS - 1)),
      CRASH_PAGE_START,
      CRASH_PAGE_END,
    );
  }

  updateSectionNav(currentPage);

  if (DEV_MODE) {
    devControls.update();
    renderer.render(scene, camera);
    _devUpdatePanel();
    return;
  }
  if (!shouldRenderScene()) return;
  camera.position.set(cam.px, cam.py, cam.pz);
  camera.lookAt(cam.tx, cam.ty, cam.tz);
  renderer.render(scene, camera);
})();
