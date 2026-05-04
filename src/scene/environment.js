import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { scene, renderer } from './setup.js';

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
