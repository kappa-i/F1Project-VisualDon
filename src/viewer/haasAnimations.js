import gsap from 'gsap';
import { haas } from '../state.js';
import {
  indicatorGlowL, indicatorGlowR,
  backlightGlowC, backlightGlowL, backlightGlowR,
} from '../scene/lights.js';

export function startHaasBacklight() {
  if (haas.backlightAnim) return;
  const proxy = { v: 0 };
  haas.backlightAnim = gsap.to(proxy, {
    v: 1,
    duration: 0.28,
    repeat: -1,
    yoyo: true,
    ease: 'power2.inOut',
    onUpdate() {
      const i = proxy.v;
      haas.backlightMaterials.forEach(m => {
        m.emissive.setRGB(i, 0, 0);
        m.emissiveIntensity = i * 3.5;
      });
      backlightGlowC.intensity = i * 1.1;
      backlightGlowL.intensity = i * 0.9;
      backlightGlowR.intensity = i * 0.9;
    },
  });
}

export function stopHaasBacklight() {
  if (haas.backlightAnim) { haas.backlightAnim.kill(); haas.backlightAnim = null; }
  haas.backlightMaterials.forEach(m => { m.emissive.setRGB(0, 0, 0); m.emissiveIntensity = 0; });
  backlightGlowC.intensity = 0;
  backlightGlowL.intensity = 0;
  backlightGlowR.intensity = 0;
}

export function startHaasBlinker() {
  if (haas.blinkerAnim) return;
  const proxy = { v: 0 };
  haas.blinkerAnim = gsap.to(proxy, {
    v: 1,
    duration: 0.38,
    repeat: -1,
    yoyo: true,
    ease: 'power2.inOut',
    onUpdate() {
      const i = proxy.v;
      haas.indicatorMaterials.forEach(m => { m.emissiveIntensity = i * 3; });
      indicatorGlowL.intensity = i * 0.9;
      indicatorGlowR.intensity = i * 0.9;
    },
  });
}

export function stopHaasBlinker() {
  if (haas.blinkerAnim) { haas.blinkerAnim.kill(); haas.blinkerAnim = null; }
  haas.indicatorMaterials.forEach(m => { m.emissiveIntensity = 0; });
  indicatorGlowL.intensity = 0;
  indicatorGlowR.intensity = 0;
}
