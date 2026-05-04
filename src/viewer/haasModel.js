import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import studioGlbUrl from '../models/tunel.glb';
import { scene, camera, cam, renderer, DEV_MODE, IS_DEV2 } from '../scene/setup.js';
import { haas, nav } from '../state.js';
import { haasCamKF, devControls } from './camera.js';
import { rebuildDots } from './dots.js';
import { completeLoader, setLoaderTarget } from '../ui/loader.js';
import { goToPage } from '../navigation/pages.js';
import { CONCLUSION_PAGE } from '../navigation/constants.js';

// Tunnel/studio décor
new GLTFLoader().load(
  studioGlbUrl,
  gltf => {
    const studio = gltf.scene;
    studio.traverse(node => { if (node.isMesh) node.receiveShadow = true; });
    studio.position.z = 70;
    studio.position.x = -0.5;
    scene.add(studio);
  },
  undefined,
  err => console.warn('Studio non chargé:', err)
);

if (IS_DEV2) {
  nav.modelLoaded = true;
  rebuildDots();
  completeLoader();
  goToPage(CONCLUSION_PAGE);
} else {
  new GLTFLoader().load(
    '/haas/2026_HAASF1_CGT-V4.glb',
    gltf => {
      haas.model = gltf.scene;

      haas.model.traverse(node => {
        if (!node.isMesh) return;
        node.castShadow    = false;
        node.receiveShadow = false;
        if (node.material) {
          const mats = Array.isArray(node.material) ? node.material : [node.material];
          mats.forEach(m => {
            m.envMapIntensity = 1.8;
            if (m.map) {
              m.map.anisotropy = renderer.capabilities.getMaxAnisotropy();
              m.map.needsUpdate = true;
            }
            const emissiveSrc = m.emissiveMap?.image?.src || m.emissiveMap?.image?.currentSrc || m.emissiveMap?.name || '';
            const isIndicator = /indicator/i.test(m.name) || /indicator/i.test(node.name) || /indicator/i.test(emissiveSrc);
            if (isIndicator) {
              m.emissiveIntensity = 0;
              if (!haas.indicatorMaterials.includes(m)) haas.indicatorMaterials.push(m);
            }
            const isBacklight = /backlight/i.test(m.name) || /backlight/i.test(node.name) || /backlight/i.test(emissiveSrc);
            if (isBacklight) {
              m.emissive = new THREE.Color(1, 0, 0);
              m.emissiveIntensity = 0;
              if (!haas.backlightMaterials.includes(m)) haas.backlightMaterials.push(m);
            }
            m.needsUpdate = true;
          });
        }
      });

      const box0  = new THREE.Box3().setFromObject(haas.model);
      const size0 = box0.getSize(new THREE.Vector3());
      haas.model.scale.setScalar(4 / Math.max(size0.x, size0.y, size0.z));

      const box    = new THREE.Box3().setFromObject(haas.model);
      const center = box.getCenter(new THREE.Vector3());
      const size   = box.getSize(new THREE.Vector3());
      haas.model.position.sub(center);
      haas.model.position.y += size.y / 2;
      haas.model.position.x -= 0.6;

      cam.px = haasCamKF[0].pos.x;    cam.py = haasCamKF[0].pos.y;    cam.pz = haasCamKF[0].pos.z;
      cam.tx = haasCamKF[0].target.x; cam.ty = haasCamKF[0].target.y; cam.tz = haasCamKF[0].target.z;

      if (DEV_MODE && devControls) {
        camera.position.set(cam.px, cam.py, cam.pz);
        devControls.target.set(cam.tx, cam.ty, cam.tz);
        devControls.update();
      }

      haas.model.visible = DEV_MODE ? true : false;
      scene.add(haas.model);

      nav.modelLoaded = true;
      rebuildDots();
      completeLoader();
    },
    xhr => {
      if (xhr.lengthComputable) {
        setLoaderTarget(20 + (xhr.loaded / xhr.total) * 72);
      }
    },
    err => {
      console.error(err);
      const stepEl = document.getElementById('loader-step');
      if (stepEl) stepEl.textContent = 'Erreur';
    }
  );
}
