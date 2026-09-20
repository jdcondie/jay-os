// ── PAGE CACHE ────────────────────────────────────────────────────
const pageCache = {};
let currentPageId = 'home';

const REDIRECTS = { 'daily-sheet': 'home' };

async function showPage(id) {
  if (REDIRECTS[id]) id = REDIRECTS[id];
  currentPageId = id;
  // Sync URL hash so refresh + back/forward restore the current page
  if (location.hash.slice(1) !== id) {
    history.replaceState(null, '', '#' + id);
  }

  // Load page HTML if not cached
  if (!pageCache[id]) {
    const res = await fetch(`pages/${id}.html`);
    pageCache[id] = await res.text();
  }

  // Inject into main
  const main = document.getElementById('main-content');
  main.innerHTML = pageCache[id];
  main.querySelector('.page')?.classList.add('active');

  // Fill saved values back in. Runs every time, not just the first fetch —
  // the page cache re-injects fresh DOM on every visit.
  rolloverCheck(true);
  hydrate(main);

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
  if (id === '7day')   initDayTabs();
  if (id === 'scenes') initScenes();
  if (id === 'manifestos') initManifestos();
  if (id === 'install') initInstall();
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
const PAGES = ['home','unstuck','library','install','rewiring','7day','weekly','annual',
  'machine','identity','superpower','traits','rules','nonneg','fuel','spiral','filters',
  'irreversible','rhythm','deepwork','scenes','manifestos','manifestation','presence','prompts'];

const BTAB_MAP = {
  home: 'btab-home',
  unstuck: 'btab-fix', fuel: 'btab-fix', spiral: 'btab-fix',
  filters: 'btab-fix', irreversible: 'btab-fix',
  install: 'btab-programs', rewiring: 'btab-programs', '7day': 'btab-programs',
  weekly: 'btab-programs', annual: 'btab-programs',
};
function updateBtab(pageId) {
  document.querySelectorAll('.btab').forEach(b => b.classList.remove('active'));
  const t = document.getElementById(BTAB_MAP[pageId] || 'btab-library');
  if (t) t.classList.add('active');
}
function btabNav(pageId) {
  showPage(pageId);
}

// ── PROTOCOL SELECTOR (unstuck page) ─────────────────────────────
function selectProtocol(id, btn) {
  document.querySelectorAll('.unstuck-btn').forEach(b => b.classList.remove('selected'));
  document.querySelectorAll('.protocol-box').forEach(b => b.classList.remove('visible'));
  (btn || document.querySelector('.unstuck-btn[data-proto="' + id + '"]'))?.classList.add('selected');
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
  showScene(0);
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

// ── PERSISTENCE ───────────────────────────────────────────────────
// One delegated listener for the whole app. Pages are injected with
// innerHTML, so per-element listeners would die on every navigation.
function onPersist(e) {
  const el = e.target;
  const path = el && el.dataset && el.dataset.persist;
  if (!path) return;
  if (el.type === 'checkbox') {
    persistSet(path, el.checked);
    el.closest('.check-item')?.classList.toggle('checked', el.checked);
  } else {
    persistSet(path, el.value);
  }
}
document.addEventListener('input',  onPersist);
document.addEventListener('change', onPersist);

function hydrate(root) {
  root.querySelectorAll('[data-persist]').forEach(el => {
    const v = persistGet(el.dataset.persist);
    if (el.type === 'checkbox') {
      el.checked = !!v;
      el.closest('.check-item')?.classList.toggle('checked', !!v);
    } else if (v != null) {
      el.value = v;
    }
  });
  root.querySelectorAll('[data-autodate]').forEach(el => {
    el.value = new Date().toLocaleDateString('en-US',
      { weekday: 'long', month: 'long', day: 'numeric' });
  });
}

// ── MIDNIGHT ROLLOVER ─────────────────────────────────────────────
// The tab can sit open across midnight. Writes always resolve today()
// at write time, so this only has to repaint.
function rolloverCheck(quiet) {
  const t = getToday();
  if (OS.meta.lastOpen === t) return;
  flushSave();
  OS.meta.lastOpen = t;
  flushSave();
  if (!quiet) showPage(currentPageId);
}
setInterval(() => rolloverCheck(false), 60000);
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) rolloverCheck(false);
});

// ── INIT ──────────────────────────────────────────────────────────
function initialPageId() {
  const h = location.hash.slice(1);
  return PAGES.includes(h) || REDIRECTS[h] ? h : 'home';
}
document.addEventListener('DOMContentLoaded', () => showPage(initialPageId()));
window.addEventListener('hashchange', () => {
  const id = location.hash.slice(1);
  if (PAGES.includes(id) || REDIRECTS[id]) showPage(id);
});
