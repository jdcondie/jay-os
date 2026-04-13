// ── PAGE CACHE ────────────────────────────────────────────────────
const pageCache = {};

async function showPage(id) {
  // Load page HTML if not cached
  if (!pageCache[id]) {
    const res = await fetch(`pages/${id}.html`);
    pageCache[id] = await res.text();
  }

  // Inject into main
  const main = document.getElementById('main-content');
  main.innerHTML = pageCache[id];
  main.querySelector('.page')?.classList.add('active');

  // Update nav active state
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const navItem = document.querySelector(`.nav-item[data-page="${id}"]`);
  if (navItem) navItem.classList.add('active');

  // Update mobile top bar
  const title = document.getElementById('mobile-title');
  if (title && navItem) title.textContent = navItem.textContent.trim();

  // Update bottom tab bar
  updateBtab(id);

  // Close mobile menu
  closeMenu();

  // Scroll to top
  window.scrollTo(0, 0);

  // Run page-specific init
  if (id === 'home')   initHome();
  if (id === 'nonneg') nnRenderAll();
  if (id === 'rhythm') initRhythm();
  if (id === '7day')   initDayTabs();
  if (id === 'scenes') initScenes();
  if (id === 'manifestos') initManifestos();
}

// ── MOBILE MENU ───────────────────────────────────────────────────
function toggleMenu() {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('overlay').classList.toggle('visible');
  document.getElementById('hamburger').classList.toggle('open');
}
function closeMenu() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('overlay').classList.remove('visible');
  document.getElementById('hamburger').classList.remove('open');
}

// ── BOTTOM TAB BAR ────────────────────────────────────────────────
const BTAB_MAP = {
  home: 'btab-home',
  machine: 'btab-all', identity: 'btab-all',
  unstuck: 'btab-moment', fuel: 'btab-moment', spiral: 'btab-moment',
  rhythm: 'btab-worksheets', deepwork: 'btab-worksheets',
  filters: 'btab-worksheets', 'daily-sheet': 'btab-worksheets',
  weekly: 'btab-worksheets', '7day': 'btab-worksheets',
  annual: 'btab-worksheets', rules: 'btab-worksheets',
  nonneg: 'btab-worksheets',
  scenes: 'btab-vision', manifestos: 'btab-vision',
  manifestation: 'btab-vision', presence: 'btab-vision',
  irreversible: 'btab-all', prompts: 'btab-all',
  rewiring: 'btab-all', traits: 'btab-all',
};
function updateBtab(pageId) {
  document.querySelectorAll('.btab').forEach(b => b.classList.remove('active'));
  const t = document.getElementById(BTAB_MAP[pageId] || 'btab-all');
  if (t) t.classList.add('active');
}
function btabNav(pageId) {
  showPage(pageId);
}

// ── PROTOCOL SELECTOR (unstuck page) ─────────────────────────────
function selectProtocol(id) {
  document.querySelectorAll('.unstuck-btn').forEach(b => b.classList.remove('selected'));
  document.querySelectorAll('.protocol-box').forEach(b => b.classList.remove('visible'));
  event.currentTarget.classList.add('selected');
  const box = document.getElementById('proto-' + id);
  if (box) box.classList.add('visible');
}

// ── CHECKBOX TOGGLE ───────────────────────────────────────────────
function toggleCheck(checkbox) {
  checkbox.closest('.check-item').classList.toggle('checked', checkbox.checked);
}

// ── TAB SWITCHERS ─────────────────────────────────────────────────
function showTab(prefix, id) {
  document.querySelectorAll(`[id^="tab-${prefix}-"]`).forEach(el => {
    if (el.classList.contains('tab-content')) el.classList.remove('visible');
    if (el.classList.contains('tab-pill'))    el.classList.remove('active');
  });
  document.getElementById(`tab-${prefix}-${id}`)?.classList.add('visible');
  document.getElementById(`tab-${prefix}-btn-${id}`)?.classList.add('active');
}

// ── RHYTHM PAGE ───────────────────────────────────────────────────
function initRhythm() {
  document.querySelectorAll('.day-type-card').forEach(card => {
    const label = card.querySelector('.day-type-label')?.textContent.trim();
    if (label === homeState.dayType) card.classList.add('selected');
    card.addEventListener('click', () => {
      document.querySelectorAll('.day-type-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      setDayType(label, null);
    });
  });
}

// ── 7-DAY PAGE ────────────────────────────────────────────────────
function initDayTabs() {
  showDay(1);
}
function showDay(n) {
  document.querySelectorAll('.day-content').forEach(el => el.classList.remove('visible'));
  document.querySelectorAll('[id^="day-btn-"]').forEach(el => el.classList.remove('active'));
  const el = document.getElementById('day-' + n);
  const btn = document.getElementById('day-btn-' + n);
  if (el)  el.classList.add('visible');
  if (btn) btn.classList.add('active');
}

// ── SCENES PAGE ───────────────────────────────────────────────────
function initScenes() {
  showScene(1);
}
function showScene(n) {
  document.querySelectorAll('.scene-content').forEach(el => el.classList.remove('visible'));
  document.querySelectorAll('[id^="sc-btn-"]').forEach(el => el.classList.remove('active'));
  const el  = document.getElementById('scene-' + n);
  const btn = document.getElementById('sc-btn-' + n);
  if (el)  el.classList.add('visible');
  if (btn) btn.classList.add('active');
}

// ── MANIFESTOS PAGE ───────────────────────────────────────────────
function initManifestos() {
  showManifesto('storm');
}
function showManifesto(id) {
  document.querySelectorAll('.manifesto-content').forEach(el => el.classList.remove('visible'));
  document.querySelectorAll('[id^="mn-btn-"]').forEach(el => el.classList.remove('active'));
  const el  = document.getElementById('mn-' + id);
  const btn = document.getElementById('mn-btn-' + id);
  if (el)  el.classList.add('visible');
  if (btn) btn.classList.add('active');
}

// ── INIT ──────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => showPage('home'));
