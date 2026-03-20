import * as THREE from 'three';
import { GLTFLoader }      from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import gsap from 'gsap';
import React from 'react';
import { createRoot } from 'react-dom/client';
import ShaderReveal from './components/ShaderReveal.tsx';
import shaderFrontUrl from './assets/shader-front.webp';
import shaderBackUrl from './assets/shader-back.jpg';
import studioGlbUrl from '../models/studio.glb';
import ferrariGlbUrl from '../models/Ferrari_SF26_2026.glb';

const shaderRevealMount = document.getElementById('shader-reveal-root');

if (shaderRevealMount) {
  const revealRoot = createRoot(shaderRevealMount);
  revealRoot.render(
    React.createElement(ShaderReveal, {
      frontImage: shaderFrontUrl,
      backImage: shaderBackUrl,
      style: { width: '100%', height: '100%' },
      mouseForce: 22,
      cursorSize: 110,
      resolution: 0.42,
      iterationsViscous: 14,
      iterationsPoisson: 18,
      revealStrength: 3.6,
      revealSoftness: 0.7,
      autoDemo: false,
    }),
  );
}

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
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.4;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
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
key.shadow.mapSize.set(2048, 2048);
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
//   3 → viewer cam0  (translateY -300vh)
//   4 → viewer cam1  (translateY -300vh, caméra change)
//   5 → viewer cam2  (translateY -300vh, caméra change)
//   6 → data     (translateY -400vh)
//   7 → conclusion   (translateY -500vh)

const PAGE_COUNT = 8;
const INFOBOXES  = { 4: 'ib-2', 5: 'ib-3' };

function pageToY(idx) {
  if (idx <= 2) return -idx * 100;
  if (idx <= 5) return -300;
  return -(idx - 2) * 100;
}

function pageToCamera(idx) {
  // Retourne l'index camKF correspondant, ou -1 si pas une page caméra
  if (idx === 3) return 0;
  if (idx === 4) return 1;
  if (idx === 5) return 2;
  return -1;
}

let currentPage  = 0;
let isTransitioning = false;
let modelLoaded  = false;
let camKF        = [];

const pageEl = document.getElementById('page');

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
  // 3 dots pour les 3 vues caméra (pages 3,4,5)
  [3, 4, 5].forEach(pageIdx => {
    const d = document.createElement('div');
    d.style.cssText = `
      width:6px; height:6px; border-radius:50%;
      background:${currentPage === pageIdx ? '#e8002d' : 'rgba(255,255,255,0.2)'};
      transition:background .4s, transform .4s;
    `;
    dotsEl.appendChild(d);
  });
}

function updateDots() {
  dotsEl.querySelectorAll('div').forEach((d, i) => {
    const pageIdx = i + 3;
    d.style.background = currentPage === pageIdx ? '#e8002d' : 'rgba(255,255,255,0.2)';
    d.style.transform  = currentPage === pageIdx ? 'scale(1.5)' : 'scale(1)';
  });
}

// ── HUD ───────────────────────────────────────────────────────────────────
function updateHUD(pageIdx) {
  const isViewer = pageIdx >= 3 && pageIdx <= 5;
  document.body.classList.toggle('hud-active', isViewer);
  dotsEl.style.opacity = isViewer ? '1' : '0';
  if (!isViewer) {
    document.querySelectorAll('.infobox').forEach(el => el.classList.remove('visible'));
  }
}

function shouldRenderScene() {
  return document.body.classList.contains('hud-active') || isTransitioning;
}

// ── snap caméra ───────────────────────────────────────────────────────────
function snapCamera(camIdx, onDone) {
  if (!camKF[camIdx]) { onDone?.(); return; }

  document.querySelectorAll('.infobox').forEach(el => el.classList.remove('visible'));

  gsap.to(cam, {
    px: camKF[camIdx].pos.x,    py: camKF[camIdx].pos.y,    pz: camKF[camIdx].pos.z,
    tx: camKF[camIdx].target.x, ty: camKF[camIdx].target.y, tz: camKF[camIdx].target.z,
    duration: 1.2,
    ease: 'power2.inOut',
    onComplete: () => {
      const ibId = INFOBOXES[3 + camIdx];
      if (ibId) document.getElementById(ibId)?.classList.add('visible');
      onDone?.();
    },
  });
}

// ── aller à une page ──────────────────────────────────────────────────────
function goToPage(idx) {
  if (isTransitioning || idx < 0 || idx >= PAGE_COUNT) return;
  isTransitioning = true;

  const prevPage = currentPage;
  currentPage = idx;
  updateHUD(idx);

  const targetY  = pageToY(idx);
  const currentY = pageToY(prevPage);
  const camIdx   = pageToCamera(idx);

  // Si on reste sur la même section (viewer) → seulement la caméra change
  if (targetY === currentY && camIdx >= 0) {
    updateDots();
    snapCamera(camIdx, () => { isTransitioning = false; });
    return;
  }

  // Sinon : on translate #page
  gsap.to(pageEl, {
    y: `${targetY}vh`,
    duration: 0.9,
    ease: 'power2.inOut',
    onComplete: () => {
      if (camIdx >= 0) {
        updateDots();
        snapCamera(camIdx, () => { isTransitioning = false; });
      } else {
        isTransitioning = false;
      }
    },
  });
}

// ── wheel : 1 tick = 1 page ───────────────────────────────────────────────
window.addEventListener('wheel', e => {
  e.preventDefault();
  if (!modelLoaded || isTransitioning) return;
  goToPage(currentPage + (e.deltaY > 0 ? 1 : -1));
}, { passive: false });

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
    const model = gltf.scene;

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

// ── resize ────────────────────────────────────────────────────────────────
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ── render loop ───────────────────────────────────────────────────────────
(function animate() {
  requestAnimationFrame(animate);
  if (!shouldRenderScene()) return;
  camera.position.set(cam.px, cam.py, cam.pz);
  camera.lookAt(cam.tx, cam.ty, cam.tz);
  renderer.render(scene, camera);
})();
