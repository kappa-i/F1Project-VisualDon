const fillEl   = document.getElementById('fill');
const pctEl    = document.getElementById('pct');
const loaderEl = document.getElementById('loader');
const stepEl   = document.getElementById('loader-step');

const LOADER_STAGES = [
  { threshold: 0,  label: 'Initialisation…' },
  { threshold: 8,  label: 'Chargement scripts…' },
  { threshold: 20, label: 'Chargement modèle 3D…' },
  { threshold: 50, label: 'Préparation des géométries…' },
  { threshold: 75, label: 'Matériaux & textures…' },
  { threshold: 92, label: 'Finalisation scène…' },
];

let _loaderCurrent = 0;
let _loaderTarget  = 0;
let _loaderDone    = false;
let _loaderRafId   = null;

function _setLoaderDisplay(p) {
  const rounded = Math.round(p);
  fillEl.style.width = rounded + '%';
  pctEl.textContent  = rounded + '%';
  if (stepEl) {
    let label = LOADER_STAGES[0].label;
    for (const s of LOADER_STAGES) { if (p >= s.threshold) label = s.label; }
    stepEl.textContent = label;
  }
}

function _startLoaderTicker() {
  const t0 = performance.now();
  const FAKE_DURATION = 25000;
  const FAKE_CEIL     = 87;

  function tick() {
    if (_loaderDone) return;
    const elapsed = performance.now() - t0;
    const t       = Math.min(elapsed / FAKE_DURATION, 1);
    const fakeTarget = FAKE_CEIL * (1 - Math.exp(-4 * t));
    if (fakeTarget > _loaderTarget) _loaderTarget = fakeTarget;
    _loaderCurrent += (_loaderTarget - _loaderCurrent) * 0.04;
    _setLoaderDisplay(_loaderCurrent);
    _loaderRafId = requestAnimationFrame(tick);
  }
  _loaderRafId = requestAnimationFrame(tick);
}

export function setLoaderTarget(value) {
  if (value > _loaderTarget) _loaderTarget = value;
}

export function completeLoader() {
  _loaderDone = true;
  if (_loaderRafId) cancelAnimationFrame(_loaderRafId);
  if (stepEl) stepEl.textContent = 'Prêt';

  let p = _loaderCurrent;
  function finish() {
    p += (100 - p) * 0.12;
    _setLoaderDisplay(p);
    if (100 - p > 0.2) {
      requestAnimationFrame(finish);
    } else {
      _setLoaderDisplay(100);
      setTimeout(() => loaderEl.classList.add('hidden'), 400);
    }
  }
  finish();
}

// Démarre le ticker immédiatement à l'import du module
_startLoaderTicker();
