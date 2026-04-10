// ── KEYS ──────────────────────────────────────────────────────────
const NN_KEY   = 'jay-nonneg-v3';
const HOME_KEY = 'jay-home-v1';

// ── HELPERS ───────────────────────────────────────────────────────
function getToday() {
  return new Date().toISOString().split('T')[0];
}

function loadState(key, defaults) {
  try {
    const r = localStorage.getItem(key);
    if (r) {
      const s = JSON.parse(r);
      if (s.date === getToday()) return s;
    }
  } catch(e) {}
  return { date: getToday(), ...defaults };
}

function saveState(key, state) {
  try { localStorage.setItem(key, JSON.stringify(state)); } catch(e) {}
}

// ── STATE OBJECTS ─────────────────────────────────────────────────
let nnState   = loadState(NN_KEY,   { checked: {}, streak: 0 });
let homeState = loadState(HOME_KEY, { dayType: null, intention: '' });
