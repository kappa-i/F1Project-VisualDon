import { useEffect, useRef } from "react";
import * as THREE from "three";

export interface GlitterWarpProps {
  width?: number | string;
  height?: number | string;
  speed?: number;
  color?: string;
  density?: number;
  brightness?: number;
  starSize?: number;
  focalDepth?: number;
  turbulence?: number;
  autoPlay?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16) / 255,
        g: parseInt(result[2], 16) / 255,
        b: parseInt(result[3], 16) / 255,
      }
    : { r: 1, g: 1, b: 1 };
}

const GlitterWarp: React.FC<GlitterWarpProps> = ({
  width = "100%",
  height = "100%",
  speed = 1.0,
  color = "#ffffff",
  density = 15.0,
  brightness = 1.0,
  starSize = 0.1,
  focalDepth = 0.05,
  turbulence = 0.0,
  autoPlay = true,
  className,
  style,
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const isPausedRef = useRef<boolean>(!autoPlay);
  const colorUniformRef = useRef<THREE.Vector3 | null>(null);

  // Mise à jour de la couleur sans recréer la scène
  useEffect(() => {
    if (!colorUniformRef.current) return;
    const rgb = hexToRgb(color);
    colorUniformRef.current.set(rgb.r, rgb.g, rgb.b);
  }, [color]);

  // Setup Three.js — ne se relance pas quand la couleur change
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    const rgb = hexToRgb(color);

    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setClearColor(0x000000, 0);
    // Important : setPixelRatio AVANT setSize pour que le buffer soit correctement dimensionné
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Taille initiale via getBoundingClientRect
    const rect = container.getBoundingClientRect();
    let w = rect.width > 0 ? rect.width : window.innerWidth;
    let h = rect.height > 0 ? rect.height : window.innerHeight;

    renderer.setSize(w, h, false);
    renderer.domElement.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block;";
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // Utilise getDrawingBufferSize pour avoir les vraies dimensions du buffer (avec DPR)
    const bufferSize = renderer.getDrawingBufferSize(new THREE.Vector2());

    const colorVec = new THREE.Vector3(rgb.r, rgb.g, rgb.b);
    colorUniformRef.current = colorVec;

    const uniforms = {
      iTime: { value: 0 },
      iResolution: { value: new THREE.Vector3(bufferSize.x, bufferSize.y, 1.0) },
      uColor: { value: colorVec },
      uDensity: { value: density },
      uBrightness: { value: brightness },
      uStarSize: { value: starSize },
      uFocalDepth: { value: focalDepth },
      uTurbulence: { value: turbulence },
    };

    const vertexShader = `
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      uniform float iTime;
      uniform vec3 iResolution;
      uniform vec3 uColor;
      uniform float uDensity;
      uniform float uBrightness;
      uniform float uStarSize;
      uniform float uFocalDepth;
      uniform float uTurbulence;

      void main() {
        vec2 screenPos = gl_FragCoord.xy;
        vec2 centerOffset = screenPos - (iResolution.xy * 0.5);
        vec2 normalizedCoords = centerOffset / iResolution.y;

        vec3 viewDirection = normalize(vec3(normalizedCoords, uFocalDepth));
        vec3 travelOffset = vec3(0.0, 0.0, iTime);
        vec3 spacePosition = (viewDirection * uDensity) + travelOffset;

        if (uTurbulence > 0.0) {
          spacePosition.x += sin(spacePosition.z * 0.5 + iTime) * uTurbulence;
          spacePosition.y += cos(spacePosition.z * 0.3 + iTime * 0.7) * uTurbulence;
        }

        vec3 gridCell = floor(spacePosition);
        vec3 cellOffset = fract(spacePosition);

        vec3 hashVector = vec3(2.154, -6.21, 0.42);
        vec3 starPosition = fract(cross(gridCell, hashVector));
        starPosition = (starPosition * 0.5) + 0.25;

        float distToStar = distance(cellOffset, starPosition);
        float intensityFalloff = uStarSize - distToStar;
        float starIntensity = max(0.0, intensityFalloff * 10.0 * uBrightness);
        starIntensity = starIntensity * starIntensity;

        if (starIntensity < 0.01) {
          gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
          return;
        }

        vec3 finalColor = uColor * starIntensity;
        gl_FragColor = vec4(finalColor, starIntensity);
      }
    `;

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      depthWrite: false,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    startTimeRef.current = performance.now();

    const animate = () => {
      rafRef.current = requestAnimationFrame(animate);
      if (!isPausedRef.current) {
        uniforms.iTime.value = ((performance.now() - startTimeRef.current) / 1000) * speed;
      }
      renderer.render(scene, camera);
    };
    animate();

    // ResizeObserver pour redimensionner correctement lors du scroll/transition
    const ro = new ResizeObserver(() => {
      const nr = container.getBoundingClientRect();
      const nw = nr.width > 0 ? nr.width : w;
      const nh = nr.height > 0 ? nr.height : h;
      if (nw === w && nh === h) return;
      w = nw;
      h = nh;
      renderer.setSize(nw, nh, false);
      const nb = renderer.getDrawingBufferSize(new THREE.Vector2());
      uniforms.iResolution.value.set(nb.x, nb.y, 1.0);
    });
    ro.observe(container);

    return () => {
      colorUniformRef.current = null;
      ro.disconnect();
      cancelAnimationFrame(rafRef.current);
      scene.remove(mesh);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speed, density, brightness, starSize, focalDepth, turbulence, autoPlay]);

  const widthStyle = typeof width === "number" ? `${width}px` : width;
  const heightStyle = typeof height === "number" ? `${height}px` : height;

  return (
    <div
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        width: widthStyle,
        height: heightStyle,
        ...style,
      }}
    >
      <div ref={containerRef} style={{ position: "absolute", inset: 0 }} />
      {children && (
        <div style={{ position: "relative", zIndex: 1, width: "100%", height: "100%", pointerEvents: "none" }}>
          {children}
        </div>
      )}
    </div>
  );
};

GlitterWarp.displayName = "GlitterWarp";

export default GlitterWarp;
