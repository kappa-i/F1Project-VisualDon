import * as THREE from 'three';
import { GLTFLoader }      from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import gsap from 'gsap';
import React from 'react';
import { createRoot } from 'react-dom/client';
import ShaderReveal from './components/ShaderReveal.tsx';
import CrashTitles from './components/CrashTitles.tsx';
import BottomSectionNav from './components/BottomSectionNav.tsx';
import SpaSafety from './components/SpaSafety.tsx';
import shaderFrontUrl from './assets/f1-merco.avif';
import shaderBackUrl from './assets/verso-srl.avif';
import studioGlbUrl from './models/studio.glb';
import ferrariGlbUrl from './models/Ferrari_SF26_2026.glb';

const shaderRevealMount = document.getElementById('shader-reveal-root');

if (shaderRevealMount) {
  const revealRoot = createRoot(shaderRevealMount);
  revealRoot.render(
    React.createElement(ShaderReveal, {
      frontImage: shaderFrontUrl,
      backImage: shaderBackUrl,
      style: { width: '100%', height: '100%' },
      mouseForce: 65,
      cursorSize: 520,
      resolution: 0.5,
      iterationsViscous: 22,
      iterationsPoisson: 26,
      revealStrength: 2.8,
      revealSoftness: 1.0,
      autoDemo: true,
      autoSpeed: 1.0,
      autoIntensity: 3.2,
      autoResumeDelay: 1500,
      viscous: 18,
      dt: 0.016,
      BFECC: true,
    }),
  );
}

const crashTitlesMount = document.getElementById('crash-titles-root');

if (crashTitlesMount) {
  const crashTitlesRoot = createRoot(crashTitlesMount);
  crashTitlesRoot.render(React.createElement(CrashTitles));
}

const bottomNavMount = document.getElementById('bottom-nav-root');

if (bottomNavMount) {
  const bottomNavRoot = createRoot(bottomNavMount);
  bottomNavRoot.render(React.createElement(BottomSectionNav));
}

const spaMount = document.getElementById('spa-root');

if (spaMount) {
  const spaRoot = createRoot(spaMount);
  spaRoot.render(React.createElement(SpaSafety));
}

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

// ── lighting ──────────────────────────────────────────────────────────────
scene.add(new THREE.AmbientLight(0xffe0b0, 0.5));

const key = new THREE.DirectionalLight(0xffcc80, 1.6);
key.position.set(2.96, 3.59, 2.83);
key.castShadow = true;
key.shadow.mapSize.set(1024, 1024);
key.shadow.camera.left = key.shadow.camera.bottom = -6;
key.shadow.camera.right = key.shadow.camera.top = 6;
key.shadow.bias = -0.001;
scene.add(key);

const fillLight = new THREE.DirectionalLight(0xff9060, 0.4);
fillLight.position.set(-5, 2, 3);
scene.add(fillLight);

const rimLight = new THREE.DirectionalLight(0xffaa50, 0.8);
rimLight.position.set(-1, 4, -8);
scene.add(rimLight);

const underLight = new THREE.PointLight(0xe8002d, 0.2, 2);
underLight.position.set(0, 0.4, 0);
scene.add(underLight);

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

// ── ground ────────────────────────────────────────────────────────────────
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(40, 40),
  new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9, metalness: 0.0 })
);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

const grid = new THREE.GridHelper(40, 40, 0x3a000a, 0x0e0e0e);
grid.material.opacity = 0.3;
grid.material.transparent = true;
scene.add(grid);

// ── environment ───────────────────────────────────────────────────────────
const pmrem = new THREE.PMREMGenerator(renderer);
pmrem.compileEquirectangularShader();
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
scene.environmentIntensity = 0.2;

// ── navigation par pages ──────────────────────────────────────────────────
//
// Pages virtuelles :
//   0 → hero     (translateY 0vh)
//   1 → era      (translateY -100vh)
//   2 → turning  (translateY -200vh)
//   3–50 → crash scrub 48 pas (translateY -300vh, vidéo pinnée)
//   51 → viewer cam0  (translateY -400vh)
//   52 → viewer cam1  (translateY -400vh, caméra change)
//   53 → viewer cam2  (translateY -400vh, caméra change)
//   54 → viewer cam3  (translateY -400vh, caméra arrière)
//   55–58 → spa 4 POI (translateY -500vh)
//   59 → data     (translateY -600vh)
//   60 → conclusion   (translateY -700vh)

const CRASH_PAGE_START = 3;
const CRASH_PAGE_STEPS = 48;
const CRASH_PAGE_END = CRASH_PAGE_START + CRASH_PAGE_STEPS - 1;
const VIEWER_PAGE_START = CRASH_PAGE_END + 1;
const VIEWER_PAGE_END = VIEWER_PAGE_START + 3;
const SPA_PAGE_START = VIEWER_PAGE_END + 1;
const SPA_PAGE_COUNT = 4;
const SPA_PAGE_END = SPA_PAGE_START + SPA_PAGE_COUNT - 1;
const DATA_PAGE = SPA_PAGE_END + 1;
const CONCLUSION_PAGE = DATA_PAGE + 1;
const HAAS_PAGE_START = CONCLUSION_PAGE + 1;
const HAAS_PAGE_END = HAAS_PAGE_START + 7;
const PAGE_COUNT = HAAS_PAGE_END + 1;
const CRASH_SCROLL_DISTANCE = 7000;
const CRASH_EXIT_DISTANCE = 220;
const CRASH_FRAME_COUNT = 301;
const CRASH_VELOCITY_GAIN = 1.1;
const CRASH_VELOCITY_FRICTION = 0.9;
const CRASH_VELOCITY_EPSILON = 0.01;
const WHEEL_GESTURE_GAP = 140;
const WHEEL_NAV_THRESHOLD = 42;
const WHEEL_NAV_LOCK_MS = 1150;
const INFOBOXES  = {
  [VIEWER_PAGE_START + 1]: 'ib-2',
  [VIEWER_PAGE_START + 2]: 'ib-3',
  [VIEWER_PAGE_START + 3]: 'ib-4',
};
const HAAS_INFOBOXES = {
  [HAAS_PAGE_START + 1]: 'ib-haas-2',
  [HAAS_PAGE_START + 2]: 'ib-haas-3',
  [HAAS_PAGE_START + 3]: 'ib-haas-4',
  [HAAS_PAGE_START + 4]: 'ib-haas-5',
  [HAAS_PAGE_START + 5]: 'ib-haas-6',
  [HAAS_PAGE_START + 7]: 'ib-haas-7',
};

const crashFrameEl = document.getElementById('crash-frame');
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

function renderCrashFrame(frameIndex) {
  const clamped = THREE.MathUtils.clamp(frameIndex, 0, CRASH_FRAME_COUNT - 1);
  if (!crashFrameEl || crashFrameSrcIndex === clamped) return;
  crashFrameEl.src = crashFrameUrls[clamped];
  crashFrameSrcIndex = clamped;
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

  if (nextTitleIndex === activeCrashTitleIndex) return;
  activeCrashTitleIndex = nextTitleIndex;
  window.dispatchEvent(new CustomEvent('crash-title-change', {
    detail: { index: nextTitleIndex },
  }));
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

renderCrashFrame(0);
updateCrashTitles(0);

function pageToY(idx) {
  if (idx <= 3) return -idx * 100;
  if (idx <= CRASH_PAGE_END) return -300;
  if (idx <= VIEWER_PAGE_END) return -400;
  if (idx <= SPA_PAGE_END) return -500;
  if (idx === DATA_PAGE) return -600;
  if (idx === CONCLUSION_PAGE) return -700;
  return -800;
}

function pageToCamera(idx) {
  // Retourne l'index camKF correspondant, ou -1 si pas une page caméra
  if (idx === VIEWER_PAGE_START) return 0;
  if (idx === VIEWER_PAGE_START + 1) return 1;
  if (idx === VIEWER_PAGE_START + 2) return 2;
  if (idx === VIEWER_PAGE_START + 3) return 3;
  if (idx === HAAS_PAGE_START) return 0;
  if (idx === HAAS_PAGE_START + 1) return 1;
  if (idx === HAAS_PAGE_START + 2) return 2;
  if (idx === HAAS_PAGE_START + 3) return 3;
  if (idx === HAAS_PAGE_START + 4) return 4;
  if (idx === HAAS_PAGE_START + 5) return 5;
  if (idx === HAAS_PAGE_START + 6) return 6;
  if (idx === HAAS_PAGE_START + 7) return 7;
  return -1;
}

let currentPage  = 0;
let isTransitioning = false;
let modelLoaded  = false;
let camKF        = [];
let ferrariModel = null;
let haasModel    = null;
let haasIndicatorMaterials = [];
let haasBlinkerAnim = null;
let haasBacklightMaterials = [];
let haasBacklightAnim = null;
const haasCamKF = [
  { pos: new THREE.Vector3(-0.59, 0.42,  3.09), target: new THREE.Vector3(-0.48,  0.00, -0.05) },
  { pos: new THREE.Vector3( 0.99, 0.55,  1.71), target: new THREE.Vector3(-0.79, -0.00,  0.32) },
  { pos: new THREE.Vector3( 0.29, 0.38,  1.11), target: new THREE.Vector3(-0.93,  0.06,  0.87) },
  { pos: new THREE.Vector3(-0.57, 1.26,  1.35), target: new THREE.Vector3(-0.63,  0.54,  0.37) },
  { pos: new THREE.Vector3(-1.24, 0.62,  0.60), target: new THREE.Vector3(-0.78,  0.54,  0.18) }, // blinkers
  { pos: new THREE.Vector3(-0.93, 1.11,  0.09), target: new THREE.Vector3(-0.79,  0.96, -0.13) },
  { pos: new THREE.Vector3(-1.51, 0.35, -3.24), target: new THREE.Vector3(-0.03,  0.49, -0.73) }, // backlights
  { pos: new THREE.Vector3(-0.70, 0.42, -2.18), target: new THREE.Vector3(-0.03,  0.49, -0.73) }, // backlights
];
let wheelGestureAccum = 0;
let wheelGestureDirection = 0;
let wheelLastEventAt = 0;
let wheelUnlockAt = 0;

const pageEl = document.getElementById('page');
let lastSectionNavProgress = -1;
let lastSectionNavIndex = -1;

function isSpaPage(idx) {
  return idx >= SPA_PAGE_START && idx <= SPA_PAGE_END;
}

function isHaasPage(idx) {
  return idx >= HAAS_PAGE_START && idx <= HAAS_PAGE_END;
}

function dispatchSpaPoiChange(pageIdx) {
  const index = isSpaPage(pageIdx) ? pageIdx - SPA_PAGE_START : -1;
  window.dispatchEvent(new CustomEvent('spa-poi-change', { detail: { index } }));
}

function pageToSectionIndex(pageIdx) {
  if (pageIdx <= 0) return 0;
  if (pageIdx === 1) return 1;
  if (pageIdx === 2) return 2;
  if (pageIdx >= CRASH_PAGE_START && pageIdx <= CRASH_PAGE_END) return 3;
  if (pageIdx >= VIEWER_PAGE_START && pageIdx <= VIEWER_PAGE_END) return 4;
  if (pageIdx >= SPA_PAGE_START && pageIdx <= SPA_PAGE_END) return 5;
  if (pageIdx === DATA_PAGE) return 6;
  if (pageIdx === CONCLUSION_PAGE) return 7;
  return 8;
}

function pageToSectionProgress(pageIdx) {
  if (pageIdx <= 2) return pageIdx;
  if (pageIdx >= CRASH_PAGE_START && pageIdx <= CRASH_PAGE_END) {
    return 3 + crashFrameToProgress(crashRenderedFrame) * 0.92;
  }
  if (pageIdx >= VIEWER_PAGE_START && pageIdx <= VIEWER_PAGE_END) {
    const viewerProgress = (pageIdx - VIEWER_PAGE_START) / Math.max(1, VIEWER_PAGE_END - VIEWER_PAGE_START);
    return 4 + viewerProgress * 0.92;
  }

  if (pageIdx >= SPA_PAGE_START && pageIdx <= SPA_PAGE_END) {
    const spaProgress = (pageIdx - SPA_PAGE_START) / Math.max(1, SPA_PAGE_END - SPA_PAGE_START);
    return 5 + spaProgress * 0.92;
  }
  if (pageIdx === DATA_PAGE) return 6;
  if (pageIdx === CONCLUSION_PAGE) return 7;
  const haasProgress = (pageIdx - HAAS_PAGE_START) / Math.max(1, HAAS_PAGE_END - HAAS_PAGE_START);
  return 8 + haasProgress * 0.92;
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
  if (sectionIdx === 1) return 1;
  if (sectionIdx === 2) return 2;
  if (sectionIdx === 3) return CRASH_PAGE_START;
  if (sectionIdx === 4) return VIEWER_PAGE_START;
  if (sectionIdx === 5) return SPA_PAGE_START;
  if (sectionIdx === 6) return DATA_PAGE;
  if (sectionIdx === 7) return CONCLUSION_PAGE;
  return HAAS_PAGE_START;
}

window.addEventListener('section-nav-jump', event => {
  const sectionIdx = event.detail?.sectionIndex;
  if (typeof sectionIdx !== 'number') return;
  goToPage(sectionToPage(sectionIdx));
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
  const isHaas = isHaasPage(currentPage);
  const startPage = isHaas ? HAAS_PAGE_START : VIEWER_PAGE_START;
  const endPage   = isHaas ? HAAS_PAGE_END   : VIEWER_PAGE_END;
  for (let i = 0; i <= endPage - startPage; i++) {
    const pageIdx = startPage + i;
    const d = document.createElement('div');
    d.style.cssText = `
      width:6px; height:6px; border-radius:50%;
      background:${currentPage === pageIdx ? '#e8002d' : 'rgba(255,255,255,0.2)'};
      transition:background .4s, transform .4s;
    `;
    dotsEl.appendChild(d);
  }
}

function updateDots() {
  const isHaas    = isHaasPage(currentPage);
  const startPage = isHaas ? HAAS_PAGE_START : VIEWER_PAGE_START;
  dotsEl.querySelectorAll('div').forEach((d, i) => {
    const pageIdx = startPage + i;
    d.style.background = currentPage === pageIdx ? '#e8002d' : 'rgba(255,255,255,0.2)';
    d.style.transform  = currentPage === pageIdx ? 'scale(1.5)' : 'scale(1)';
  });
}

// ── HUD ───────────────────────────────────────────────────────────────────
let _lastViewerKind = '';
function updateHUD(pageIdx) {
  const isFerrari = pageIdx >= VIEWER_PAGE_START && pageIdx <= VIEWER_PAGE_END;
  const isHaas = isHaasPage(pageIdx);
  const isAnyViewer = isFerrari || isHaas;
  const kind = isHaas ? 'haas' : isFerrari ? 'ferrari' : '';
  if (kind !== _lastViewerKind) { _lastViewerKind = kind; rebuildDots(); }
  document.body.classList.toggle('hud-active', isAnyViewer);
  dotsEl.style.opacity = isAnyViewer ? '1' : '0';
  if (!isAnyViewer) {
    document.querySelectorAll('.infobox').forEach(el => el.classList.remove('visible'));
  }
  if (ferrariModel) ferrariModel.visible = isFerrari;
  if (haasModel) haasModel.visible = isHaas;
  if (!isHaas) { stopHaasBlinker(); stopHaasBacklight(); }
  const topbarEl = document.getElementById('topbar');
  const statusbarEl = document.getElementById('statusbar');
  if (topbarEl && statusbarEl) {
    if (isHaas) {
      topbarEl.innerHTML = '<div><div class="brand-team">MoneyGram Haas F1</div><div class="brand-car"><span>VF</span>-26</div></div><div class="season">Formule 1 · Saison 2026</div>';
      statusbarEl.innerHTML = '<div class="stat-block"><div class="stat-label">Châssis</div><div class="stat-value">VF-26/C1</div></div><div class="sep"></div><div class="stat-block"><div class="stat-label">Groupe motopropulseur</div><div class="stat-value">Ferrari 066/11</div></div><div class="sep"></div><div class="stat-block"><div class="stat-label">Pilotes</div><div class="stat-value hi">Bearman · Ocon</div></div><div class="sep"></div><div class="stat-block" style="text-align:right"><div class="stat-label">Contrôles</div><div class="stat-value">Drag · Scroll · Clic droit</div></div>';
    } else if (isFerrari) {
      topbarEl.innerHTML = '<div><div class="brand-team">Scuderia Ferrari HP</div><div class="brand-car"><span>SF</span>-26</div></div><div class="season">Formule 1 · Saison 2026</div>';
      statusbarEl.innerHTML = '<div class="stat-block"><div class="stat-label">Châssis</div><div class="stat-value">SF-26/C1</div></div><div class="sep"></div><div class="stat-block"><div class="stat-label">Groupe motopropulseur</div><div class="stat-value">Ferrari 066/11</div></div><div class="sep"></div><div class="stat-block"><div class="stat-label">Pilotes</div><div class="stat-value hi">Leclerc · Hamilton</div></div><div class="sep"></div><div class="stat-block" style="text-align:right"><div class="stat-label">Contrôles</div><div class="stat-value">Drag · Scroll · Clic droit</div></div>';
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
  const usingHaas = isHaasPage(currentPage);
  const kf = usingHaas ? haasCamKF : camKF;
  if (!kf[camIdx]) { onDone?.(); return; }

  document.querySelectorAll('.infobox').forEach(el => el.classList.remove('visible'));

  gsap.to(cam, {
    px: kf[camIdx].pos.x,    py: kf[camIdx].pos.y,    pz: kf[camIdx].pos.z,
    tx: kf[camIdx].target.x, ty: kf[camIdx].target.y, tz: kf[camIdx].target.z,
    duration: 1.2,
    ease: 'power2.inOut',
    onComplete: () => {
      const ibId = usingHaas
        ? HAAS_INFOBOXES[HAAS_PAGE_START + camIdx]
        : INFOBOXES[VIEWER_PAGE_START + camIdx];
      if (ibId) document.getElementById(ibId)?.classList.add('visible');
      if (usingHaas && camIdx === 4) startHaasBlinker(); else stopHaasBlinker();
      if (usingHaas && (camIdx === 6 || camIdx === 7)) startHaasBacklight(); else stopHaasBacklight();
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

  // Si on reste sur la même section (viewer) → seulement la caméra change
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
      if (isCrashPage(idx)) {
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
      } else {
        updateSectionNav(idx);
        isTransitioning = false;
      }
    },
  });
}

const heroScrollBtn = document.getElementById('hero-scroll-btn');
if (heroScrollBtn) {
  heroScrollBtn.addEventListener('click', e => {
    e.preventDefault();
    if (!modelLoaded || isTransitioning) return;
    goToPage(1);
  });
}

// ── wheel : 1 tick = 1 page ───────────────────────────────────────────────
window.addEventListener('wheel', e => {
  e.preventDefault();
  if (!modelLoaded || isTransitioning) return;

  const delta = normalizeWheelDelta(e);
  if (Math.abs(delta) < 1) return;

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
    if (crashExitDistance >= CRASH_EXIT_DISTANCE) goToPage(2);
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

// ── keyboard navigation ───────────────────────────────────────────────────
window.addEventListener('keydown', e => {
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
  scene.add(studio);
}, undefined, err => console.warn('Studio non chargé:', err));

new GLTFLoader().load(
  ferrariGlbUrl,
  gltf => {
    ferrariModel = gltf.scene;
    const model = ferrariModel;

    model.traverse(node => {
      if (!node.isMesh) return;
      const n = node.name || '', pn = node.parent?.name || '';
      if (/inter|wet/i.test(n) || /inter|wet/i.test(pn)) { node.visible = false; return; }
      node.castShadow = true;
      node.receiveShadow = true;
    });

    const box0      = new THREE.Box3().setFromObject(model);
    const size0     = box0.getSize(new THREE.Vector3());
    model.scale.setScalar(5 / Math.max(size0.x, size0.y, size0.z));

    const box    = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    const size   = box.getSize(new THREE.Vector3());
    model.position.sub(center);
    model.position.y += size.y / 2;
    model.position.x -= 0.6;

    ground.position.y = 0;
    grid.position.y   = 0.01;
    scene.add(model);

    camKF = [
      { pos: new THREE.Vector3(1.00,  1.16,  3.69), target: new THREE.Vector3(-0.70, 0.09, 0.41) },
      { pos: new THREE.Vector3(0.02,  1.00,  1.07), target: new THREE.Vector3(-0.51, 0.49, 0.29) },
      { pos: new THREE.Vector3(-0.89, 1.02, -0.43), target: new THREE.Vector3(-0.63, 0.44, 0.34) },
      { pos: new THREE.Vector3(-0.58, 1.08, -4.55), target: new THREE.Vector3(-0.58, 0.70, -1.95) },
    ];

    cam.px = camKF[0].pos.x;    cam.py = camKF[0].pos.y;    cam.pz = camKF[0].pos.z;
    cam.tx = camKF[0].target.x; cam.ty = camKF[0].target.y; cam.tz = camKF[0].target.z;

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

new GLTFLoader().load(
  '/haas/2026_HAASF1_CGT-V3.glb',
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

    haasModel.visible = false;
    scene.add(haasModel);
  },
  undefined,
  err => console.warn('Haas model non chargé:', err)
);

// ── resize ────────────────────────────────────────────────────────────────
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
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

  const targetFrameIndex = Math.round(crashTargetFrame);
  if (crashRenderedFrame < targetFrameIndex) {
    crashRenderedFrame += 1;
    renderCrashFrame(crashRenderedFrame);
    updateCrashTitles(crashRenderedFrame);
  } else if (crashRenderedFrame > targetFrameIndex) {
    crashRenderedFrame -= 1;
    renderCrashFrame(crashRenderedFrame);
    updateCrashTitles(crashRenderedFrame);
  } else {
    renderCrashFrame(crashRenderedFrame);
    updateCrashTitles(crashRenderedFrame);
  }

  if (isCrashPage(currentPage)) {
    currentPage = THREE.MathUtils.clamp(
      Math.round(CRASH_PAGE_START + crashFrameToProgress(crashRenderedFrame) * (CRASH_PAGE_STEPS - 1)),
      CRASH_PAGE_START,
      CRASH_PAGE_END,
    );
  }

  updateSectionNav(currentPage);

  if (!shouldRenderScene()) return;
  camera.position.set(cam.px, cam.py, cam.pz);
  camera.lookAt(cam.tx, cam.ty, cam.tz);
  renderer.render(scene, camera);
})();
