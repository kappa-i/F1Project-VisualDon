import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import gsap from 'gsap';
import { camera, cam, renderer, DEV_MODE } from '../scene/setup.js';
import { VIEWER_PAGE_START } from '../navigation/constants.js';
import { INFOBOXES } from './infoboxes.js';
import { startHaasBlinker, stopHaasBlinker, startHaasBacklight, stopHaasBacklight } from './haasAnimations.js';

export const haasCamKF = [
  { pos: new THREE.Vector3( 0.86,  0.96,  3.31), target: new THREE.Vector3(-0.49,  0.26,  0.89) }, // 0: vue d'ensemble
  { pos: new THREE.Vector3( 0.99,  0.43,  1.57), target: new THREE.Vector3(-0.49,  0.26,  0.89) }, // 1: freins carbone céramique
  { pos: new THREE.Vector3(-0.60,  0.62,  0.90), target: new THREE.Vector3(-0.59,  0.59,  0.51) }, // 2: halo
  { pos: new THREE.Vector3(-1.29,  0.69,  0.59), target: new THREE.Vector3(-0.70,  0.44,  0.17) }, // 3: rétroviseurs warning
  { pos: new THREE.Vector3(-1.04,  0.81,  0.19), target: new THREE.Vector3(-0.69,  0.70, -0.11) }, // 4: cheminée
  { pos: new THREE.Vector3(-0.66,  0.60,  0.22), target: new THREE.Vector3(-0.38,  0.27,  0.85) }, // 5: volant anti-retour
  { pos: new THREE.Vector3(-1.39,  0.36, -3.04), target: new THREE.Vector3( 0.08,  0.49,  0.73) }, // 6: feux arrières
  { pos: new THREE.Vector3(-0.72,  0.33, -2.22), target: new THREE.Vector3( 0.04,  0.58, -0.10) }, // 7: fin (backlight)
];

export function setViewerIntro(visible) {
  const el = document.getElementById('viewer-intro');
  if (el) el.classList.toggle('visible', visible);
}

export function snapCamera(camIdx, onDone) {
  const kf = haasCamKF;
  if (!kf[camIdx]) { onDone?.(); return; }

  document.querySelectorAll('.infobox').forEach(el => el.classList.remove('visible'));
  setViewerIntro(camIdx === 0);

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

// ── Dev mode ──────────────────────────────────────────────────────────────
export let devControls = null;
let _devPosEl    = null;
let _devTargetEl = null;

export function _devUpdatePanel() {
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
