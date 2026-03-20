import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const CIRCUIT_PATH =
  'm4.447 290.28c0.13184 1.3988 0.74128 2.2328 1.7024 3.099 3.1469 2.8362 3.8732 2.3848 55.153-34.244' +
  ' 9.0175-6.4412 22.107-15.77 29.088-20.731 6.9814-4.9613 16.982-12.298 22.221-16.304' +
  ' 11.174-8.5434 12.382-8.6379 13.16-1.0174 0.54917 5.3802 2.4784 8.4052 5.1728 8.1124' +
  ' 2.8403-0.30871 42.138-7.3767 46.568-8.3756 7.9514-1.7928 19.679-6.7943 48.071-20.501' +
  ' 32.219-15.554 31.603-15.443 51.861-9.2555 43.482 13.281 49.67 17.893 74.11 55.221' +
  ' 24.907 38.042 51.388 59.761 81.957 67.22 23.646 5.77 29.868 2.9279 43.646-19.937' +
  ' 14.583-24.2 13.956-28.601-5.4188-38.008-42.141-20.461-41.397-19.922-42.514-30.746' +
  '-0.47537-4.6053-0.14507-6.2471 1.9454-9.6576 5.1232-8.3583 5.3844-15.657 0.83218-23.295' +
  '-4.202-7.0498-5.1079-7.4255-46.575-19.273-57.071-16.305-61.474-19.592-63.138-47.139' +
  '-1.3409-22.191 2.522-26.753 28.962-34.216 38.939-10.991 52.214-15.463 71.271-24.002' +
  ' 27.146-12.163 25.84-12.368 39.668 6.2288 15.126 20.343 27.926 24.049 33.803 9.784' +
  ' 3.2206-7.8173 2.0733-9.7848-23.497-40.265-33.33-39.73-30.5-38.063-52.21-30.777' +
  '-16.833 5.6483-18.917 5.4528-25.042-2.3521-3.4734-4.4259-7.0086-5.9408-12.528-5.3669' +
  '-3.732 0.38809-9.7271 2.6943-72.638 27.956-113.06 45.398-110.63 44.288-129.17 59.016' +
  '-30.773 24.434-45.366 34.512-52.808 36.471-17.988 4.7355-24.603 9.4903-30.154 21.676' +
  '-3.8076 8.3581-9.6687 15.229-32.851 38.511-32.393 32.533-39.987 43.72-53.2 78.344' +
  '-5.6978 14.931-7.7238 20.746-7.4337 23.823z';

interface PoiSpec { label: string; value: string; accent?: boolean; }

interface Poi {
  id: string; label: string; tag: string; year: string; fraction: number;
  specs: PoiSpec[]; description: string;
  photoBefore: string | null; photoAfter: string | null;
  yearBefore: string; yearAfter: string;
  photoBeforePosition?: string; photoAfterPosition?: string;
}

const SPA_POIS: Poi[] = [
  {
    id: 'la-source', label: 'LA SOURCE', tag: 'Zone 01', year: '1994', fraction: 0.0,
    yearBefore: 'Avant 1994', yearAfter: 'Après 1994',
    photoBefore: '/spa/la-source-avant.jpg', photoAfter: '/spa/la-source-apres.jpg',
    photoBeforePosition: '25% center',
    specs: [
      { label: 'Type', value: 'Virage en épingle' },
      { label: 'Modification', value: 'Chicane temporaire', accent: true },
      { label: 'Contexte', value: 'Post-Senna / Ratzenberger' },
      { label: 'Impact vitesse', value: '−30 km/h à l\'entrée', accent: true },
    ],
    description: 'Suite aux décès d\'Ayrton Senna et Roland Ratzenberger à Imola 1994, la FIA a imposé des chicanes d\'urgence sur tous les circuits. À Spa, La Source a été resserrée et les zones de gravier élargies pour absorber les sorties de piste.',
  },
  {
    id: 'eau-rouge', label: 'EAU ROUGE / RAIDILLON', tag: 'Zone 02', year: '2022', fraction: 0.87,
    yearBefore: 'Avant 2022', yearAfter: 'Après 2022',
    photoBefore: '/spa/eau-rouge-avant.jpg', photoAfter: '/spa/eau-rouge-apres.jpg',
    specs: [
      { label: 'Type', value: 'Combinaison de virages' },
      { label: 'Fermeture', value: '2021 — Hubert 2019', accent: true },
      { label: 'Réouverture', value: '2022 — rénovation complète' },
      { label: 'Dégagement', value: '+340 % de surface', accent: true },
    ],
    description: 'La mort d\'Anthoine Hubert en 2019 et l\'accident de Norris en 2021 ont provoqué la refonte totale du Raidillon. Les zones de dégagement ont été massivement élargies, les barrières repositionnées et l\'asphalte entièrement refait.',
  },
  {
    id: 'pouhon', label: 'POUHON', tag: 'Zone 03', year: '2022', fraction: 0.50,
    yearBefore: 'Avant 2022', yearAfter: 'Après 2022',
    photoBefore: '/spa/pouhon-avant.jpg', photoAfter: '/spa/pouhon-apres.jpg',
    photoAfterPosition: '25% center',
    specs: [
      { label: 'Type', value: 'Double gauche rapide' },
      { label: 'Vitesse passage', value: '280 – 300 km/h', accent: true },
      { label: 'Protection', value: 'Barrières TecPro' },
      { label: 'Dégagement', value: 'Gravier → asphalte + gravier', accent: true },
    ],
    description: 'Longtemps encadré de gravier pur, Pouhon a été repensé lors de la rénovation de Spa en 2022. Les larges zones d\'échappatoire asphaltées permettent désormais aux pilotes de récupérer une sortie de piste, tandis qu\'une bande de gravier en retrait conserve un effet dissuasif.',
  },
  {
    id: 'bus-stop', label: 'BUS STOP', tag: 'Zone 04', year: '1994', fraction: 0.1,
    yearBefore: 'Avant 1994', yearAfter: 'Après 1994',
    photoBefore: '/spa/bus-stop-avant.webp', photoAfter: '/spa/bus-stop-apres.png',
    specs: [
      { label: 'Type', value: 'Chicane lente' },
      { label: 'Modification', value: 'Chicane resserrée', accent: true },
      { label: 'Contexte', value: 'Saison 1994' },
      { label: 'Vitesse passage', value: '80 km/h (−40 %)', accent: true },
    ],
    description: 'La chicane du Bus Stop a été considérablement resserrée après les tragiques événements d\'Imola. Conçue pour casser la vitesse avant le dernier virage, elle a radicalement changé la fin du tour — sacrifiant le spectacle pour la sécurité.',
  },
];

export default function SpaSafety() {
  const [activeIndex, setActiveIndex] = useState(-1);
  const [visibleActiveIndex, setVisibleActiveIndex] = useState(-1);
  const pathRef  = useRef<SVGPathElement>(null);
  const traceRef = useRef<SVGPathElement>(null);
  const traceTweenRef = useRef<gsap.core.Tween | null>(null);
  const [pathLength, setPathLength] = useState(0);
  const [poiPoints, setPoiPoints]   = useState<{ x: number; y: number }[]>([]);

  useEffect(() => {
    if (!pathRef.current) return;
    const len = pathRef.current.getTotalLength();
    setPathLength(len);
    setPoiPoints(SPA_POIS.map(poi => {
      const pt = pathRef.current!.getPointAtLength(len * poi.fraction);
      return { x: pt.x, y: pt.y };
    }));
  }, []);

  useEffect(() => {
    if (!pathLength || !traceRef.current) return;
    gsap.set(traceRef.current, { strokeDashoffset: -pathLength });
    return () => {
      traceTweenRef.current?.kill();
    };
  }, [pathLength]);

  useEffect(() => {
    const handler = (e: Event) => {
      setActiveIndex((e as CustomEvent<{ index: number }>).detail.index);
    };
    window.addEventListener('spa-poi-change', handler);
    return () => window.removeEventListener('spa-poi-change', handler);
  }, []);

  useEffect(() => {
    if (!pathLength || !traceRef.current) return;
    // Le path SVG va dans le sens inverse du circuit réel.
    // On anime en sens inverse (dashoffset négatif) : -f*L révèle la fin du path,
    // ce qui correspond au sens La Source → Eau Rouge → Pouhon → Stavelot → Bus Stop.
    traceTweenRef.current?.kill();
    const isComplete = activeIndex === SPA_POIS.length;
    let targetOffset: number;
    if (isComplete) {
      targetOffset = 0; // tout le path visible
    } else if (activeIndex <= 0) {
      targetOffset = -pathLength; // rien affiché (La Source = point de départ)
    } else {
      targetOffset = -SPA_POIS[activeIndex].fraction * pathLength;
    }
    setVisibleActiveIndex(-1);
    traceTweenRef.current = gsap.to(traceRef.current, {
      strokeDashoffset: targetOffset,
      duration: isComplete ? 1.0 : 1.4,
      ease: 'power2.inOut',
      onComplete: () => {
        setVisibleActiveIndex(isComplete ? -1 : activeIndex);
      },
    });
  }, [activeIndex, pathLength]);

  const activePoi = activeIndex >= 0 && activeIndex < SPA_POIS.length ? SPA_POIS[activeIndex] : null;
  const navigate = (dir: number) =>
    window.dispatchEvent(new CustomEvent('spa-nav-click', { detail: { direction: dir } }));

  return (
    <div className="spa-section">

      {/* ── Moitié gauche : circuit ── */}
      <div className="spa-left">
        <div className="spa-left__header">
          <p className="section__eyebrow">Spa-Francorchamps · Belgique</p>
          <h2 className="section__title">Un circuit<br />qui apprend<br />de ses blessures</h2>
        </div>

        <div className="spa-map-wrap">
          <svg viewBox="0 0 501.68 320.49" className="spa-svg" xmlns="http://www.w3.org/2000/svg">
            <path ref={pathRef} d={CIRCUIT_PATH} stroke="rgba(255,255,255,0.15)" strokeWidth="5" fill="none" strokeLinejoin="round" />
            {pathLength > 0 && (
              <path ref={traceRef} d={CIRCUIT_PATH} stroke="var(--red)" strokeWidth="5" fill="none"
                strokeLinejoin="round" strokeDasharray={`${pathLength} ${pathLength}`}
                strokeDashoffset={-pathLength} className="spa-trace" />
            )}
            {poiPoints.map((pt, i) => {
              const current = visibleActiveIndex === i;
              const future  = activeIndex < i;
              return (
                <g key={i}>
                  {current && <circle cx={pt.x} cy={pt.y} r={16} fill="none" stroke="rgba(232,0,45,0.35)" strokeWidth="1.5" />}
                  <circle cx={pt.x} cy={pt.y} r={current ? 7 : 5}
                    fill={future ? 'rgba(255,255,255,0.18)' : 'var(--red)'}
                    className={`spa-poi-dot${current ? ' is-active' : ''}`} />
                </g>
              );
            })}
          </svg>
        </div>

        <div className="spa-left__nav">
          <button className="spa-nav-btn" onClick={() => navigate(-1)} disabled={activeIndex <= 0}>‹</button>
          <span className="spa-nav-count">
            {activeIndex >= 0
              ? `${String(Math.min(activeIndex + 1, SPA_POIS.length)).padStart(2, '0')} / ${String(SPA_POIS.length).padStart(2, '0')}`
              : `— / ${String(SPA_POIS.length).padStart(2, '0')}`}
          </span>
          <button className="spa-nav-btn" onClick={() => navigate(1)} disabled={activeIndex >= SPA_POIS.length - 1}>›</button>
        </div>
      </div>

      {/* ── Séparateur ── */}
      <div className="spa-divider" />

      {/* ── Moitié droite : infobox ── */}
      <div className="spa-right">
        {activePoi ? (
          <div className="spa-right__content" key={activeIndex}>
            <div className="spa-right__meta">
              <span className="ib-tag">{activePoi.tag} · {activePoi.year}</span>
              <h3 className="spa-right__title">{activePoi.label}</h3>
            </div>

            <div className="spa-right__specs">
              {activePoi.specs.map(s => (
                <div className="ib-spec" key={s.label}>
                  <span className="spec-label">{s.label}</span>
                  <span className="spec-dots" />
                  <span className={`spec-value${s.accent ? ' accent' : ''}`}>{s.value}</span>
                </div>
              ))}
            </div>

            <p className="ib-desc">{activePoi.description}</p>

            <div className="spa-photos">
              <div className="spa-photo"
                style={activePoi.photoBefore ? { backgroundImage: `url(${activePoi.photoBefore})`, backgroundPosition: activePoi.photoBeforePosition ?? 'center' } : undefined}>
                <div className="spa-photo__placeholder" />
                <span className="spa-photo__label">{activePoi.yearBefore}</span>
              </div>
              <div className="spa-photo"
                style={activePoi.photoAfter ? { backgroundImage: `url(${activePoi.photoAfter})`, backgroundPosition: activePoi.photoAfterPosition ?? 'center' } : undefined}>
                <div className="spa-photo__placeholder" />
                <span className="spa-photo__label">{activePoi.yearAfter}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="spa-right__empty">
            <span>↑ Défiler pour explorer le circuit</span>
          </div>
        )}
      </div>

    </div>
  );
}
