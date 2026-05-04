import * as THREE from 'three';
import { scene } from './setup.js';

scene.add(new THREE.AmbientLight(0xffffff, 0.3));

const underLight = new THREE.PointLight(0xe8002d, 0.2, 2);
underLight.position.set(0, 0.4, 0);
scene.add(underLight);

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

// Cache noir cockpit (bouche le trou visible depuis la vue intérieure)
const cockpitPatch = new THREE.Mesh(
  new THREE.PlaneGeometry(0.28, 0.18),
  new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide })
);
cockpitPatch.position.set(-0.65, 0.37, 0.60);
cockpitPatch.lookAt(-0.67, 0.41, 0.79);
scene.add(cockpitPatch);

export const indicatorGlowL = new THREE.PointLight(0xffaa00, 0, 0.55, 2);
indicatorGlowL.position.set(-0.15, 0.90, 0.45);
scene.add(indicatorGlowL);

export const indicatorGlowR = new THREE.PointLight(0xffaa00, 0, 0.55, 2);
indicatorGlowR.position.set(-1.05, 0.90, 0.45);
scene.add(indicatorGlowR);

export const backlightGlowC = new THREE.PointLight(0xff1100, 0, 0.60, 2);
backlightGlowC.position.set(-0.60, 0.45, -1.55);
scene.add(backlightGlowC);

export const backlightGlowL = new THREE.PointLight(0xff1100, 0, 0.55, 2);
backlightGlowL.position.set(-0.10, 0.85, -1.45);
scene.add(backlightGlowL);

export const backlightGlowR = new THREE.PointLight(0xff1100, 0, 0.55, 2);
backlightGlowR.position.set(-1.10, 0.85, -1.45);
scene.add(backlightGlowR);
