// ── DAY TYPE ROUTING ──────────────────────────────────────────────
const DAY_TYPE_PAGE = {
  Sales: 'filters', Creation: 'deepwork', Strategy: 'filters',
  Ops: 'unstuck', Recovery: 'fuel', Relationship: 'daily-sheet'
};
const DAY_TYPE_LABEL = {
  Sales: 'Decision Filters →', Creation: 'Deep Work OS →',
  Strategy: 'Decision Filters →', Ops: 'Unstuck Protocol →',
  Recovery: 'Fuel Tank →', Relationship: 'Daily Sheet →'
};

// ── INIT HOME ─────────────────────────────────────────────────────
function initHome() {
  // Set date
  const d = new Date();
  const dateEl = document.getElementById('home-date');
  if (dateEl) dateEl.textContent = d.toLocaleDateString('en-US',
    { weekday: 'long', month: 'long', day: 'numeric' }).toUpperCase();

  // Intention hydrates from data-persist. Day type needs the button state.
  const dayType = today().dayType;
  if (dayType) {
    document.querySelectorAll('.home-day-btn').forEach(btn => {
      if (btn.querySelector('.home-day-label')?.textContent.trim() === dayType)
        btn.classList.add('selected');
    });
    updateStartBtn(dayType);
  }

  updateHomeStats();
}

// ── SET DAY TYPE ──────────────────────────────────────────────────
function setDayType(type, btn) {
  today().dayType = type;
  saveOS();
  document.querySelectorAll('.home-day-btn').forEach(b => b.classList.remove('selected'));
  if (btn) btn.classList.add('selected');
  updateStartBtn(type);
}

// ── UPDATE START BUTTON ───────────────────────────────────────────
function updateStartBtn(type) {
  const btn = document.getElementById('home-start-btn');
  if (!btn) return;
  btn.textContent = DAY_TYPE_LABEL[type] || 'Unstuck Protocol →';
  btn.onclick = () => showPage(DAY_TYPE_PAGE[type] || 'unstuck');
}

// ── HOME STATS ────────────────────────────────────────────────────
function dayWasWon(d) {
  if (d.closed === 'no')  return false;
  if (d.closed === 'yes') return true;
  return NN_DAILY.every(id => d.nn && d.nn[id]);
}

function updateHomeStats() {
  const total   = typeof NN_DATA !== 'undefined' ? NN_DATA.length : 30;
  const checked = Object.keys(today().nn || {}).length;
  const pct     = Math.round((checked / total) * 100);

  const bar    = document.getElementById('home-nn-bar');
  const txt    = document.getElementById('home-nn-txt');
  const pctEl  = document.getElementById('home-nonneg-pct');
  const streak = document.getElementById('home-streak');

  if (bar)   { bar.style.width = pct + '%'; bar.style.background = pct >= 100 ? 'var(--green)' : 'var(--orange)'; }
  if (txt)   txt.textContent = `${checked} / ${total}`;
  if (pctEl) { pctEl.textContent = pct + '%'; pctEl.style.color = pct >= 100 ? 'var(--green)' : 'var(--gray-500)'; }
  if (streak) {
    const n = computeStreak(dayWasWon);
    streak.textContent = n === 1 ? '1 day streak' : n + ' day streak';
  }
}
