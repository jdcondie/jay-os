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

  // Restore intention
  const intentEl = document.getElementById('home-intention');
  if (intentEl) intentEl.value = homeState.intention || '';

  // Restore day type
  if (homeState.dayType) {
    document.querySelectorAll('.home-day-btn').forEach(btn => {
      if (btn.querySelector('.home-day-label')?.textContent.trim() === homeState.dayType)
        btn.classList.add('selected');
    });
    updateStartBtn(homeState.dayType);
  }

  updateHomeStats();
}

// ── SET DAY TYPE ──────────────────────────────────────────────────
function setDayType(type, btn) {
  homeState.dayType = type;
  saveState(HOME_KEY, homeState);
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

// ── SAVE INTENTION ────────────────────────────────────────────────
function saveIntention(val) {
  homeState.intention = val;
  saveState(HOME_KEY, homeState);
}

// ── HOME STATS ────────────────────────────────────────────────────
function updateHomeStats() {
  const total   = typeof NN_DATA !== 'undefined' ? NN_DATA.length : 30;
  const checked = Object.keys(nnState.checked || {}).length;
  const pct     = Math.round((checked / total) * 100);

  const bar    = document.getElementById('home-nn-bar');
  const txt    = document.getElementById('home-nn-txt');
  const pctEl  = document.getElementById('home-nonneg-pct');
  const streak = document.getElementById('home-streak');

  if (bar)   { bar.style.width = pct + '%'; bar.style.background = pct >= 100 ? 'var(--green)' : 'var(--orange)'; }
  if (txt)   txt.textContent = `${checked} / ${total}`;
  if (pctEl) { pctEl.textContent = pct + '%'; pctEl.style.color = pct >= 100 ? 'var(--green)' : 'var(--gray-500)'; }
  if (streak) streak.textContent = (nnState.streak || 0) + ' day streak';
}
