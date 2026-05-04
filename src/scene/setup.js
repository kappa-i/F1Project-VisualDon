import * as THREE from 'three';

export const DEV_MODE = new URLSearchParams(location.search).has('dev');
export const IS_DEV2  = new URLSearchParams(location.search).has('dev2');

if (IS_DEV2) document.body.classList.add('dev2-mode');

export const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.4;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.BasicShadowMap;
document.getElementById('canvas-wrap').appendChild(renderer.domElement);

export const scene = new THREE.Scene();
scene.background = new THREE.Color(0x080808);
scene.fog = new THREE.FogExp2(0x080808, 0.018);

export const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 1000);

export const cam = { px: 4, py: 1.8, pz: 6, tx: 0, ty: 0, tz: 0 };
