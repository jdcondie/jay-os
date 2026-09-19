// ── JAY.OS STATE ──────────────────────────────────────────────────
// One key. Full history. Today is days[getToday()], the week is
// weeks[isoWeek(today)], multi-day trackers live under programs.
const OS_KEY = 'jay-os-v4';

function osDefaults() {
  return { v: 4, days: {}, weeks: {}, programs: {}, meta: {} };
}

// ── DATES ─────────────────────────────────────────────────────────
// Local date, not UTC — toISOString() rolled the day over at 6pm Mountain.
function fmtDate(d) {
  return d.getFullYear() + '-' +
         String(d.getMonth() + 1).padStart(2, '0') + '-' +
         String(d.getDate()).padStart(2, '0');
}
function getToday() {
  return fmtDate(new Date());
}
function dayKeyOffset(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return fmtDate(d);
}
function isoWeek(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  const t = new Date(d);
  t.setDate(t.getDate() + 3 - ((d.getDay() + 6) % 7));   // nearest Thursday
  const jan4 = new Date(t.getFullYear(), 0, 4);
  const week = 1 + Math.round(((t - jan4) / 86400000 - 3 + ((jan4.getDay() + 6) % 7)) / 7);
  return t.getFullYear() + '-W' + String(week).padStart(2, '0');
}

// ── LOAD / SAVE ───────────────────────────────────────────────────
let OS = loadOS();

function loadOS() {
  let saved = null;
  try { saved = JSON.parse(localStorage.getItem(OS_KEY) || 'null'); } catch (e) {}
  const s = Object.assign(osDefaults(), saved || {});
  s.days     = s.days     || {};
  s.weeks    = s.weeks    || {};
  s.programs = s.programs || {};
  s.meta     = s.meta     || {};
  if (!s.meta.migrated) migrateLegacy(s);
  return s;
}

let saveTimer = null;
function saveOS() {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(flushSave, 250);
}
function flushSave() {
  if (saveTimer) { clearTimeout(saveTimer); saveTimer = null; }
  try { localStorage.setItem(OS_KEY, JSON.stringify(OS)); } catch (e) {}
}
window.addEventListener('beforeunload', flushSave);
document.addEventListener('visibilitychange', () => { if (document.hidden) flushSave(); });

// Two tabs open would otherwise clobber each other: each holds OS in memory
// and writes the whole object. Reload from disk when the other tab saves.
window.addEventListener('storage', e => {
  if (e.key !== OS_KEY || !e.newValue) return;
  try { OS = Object.assign(osDefaults(), JSON.parse(e.newValue)); } catch (err) { return; }
  if (typeof showPage === 'function') showPage(currentPageId || 'home');
});

// ── BUCKETS ───────────────────────────────────────────────────────
function today() {
  const k = getToday();
  return OS.days[k] || (OS.days[k] = {});
}
function thisWeek() {
  const k = isoWeek(getToday());
  return OS.weeks[k] || (OS.weeks[k] = {});
}

// ── PATHS ─────────────────────────────────────────────────────────
// data-persist="day.sheet.gratNow" → OS.days[today].sheet.gratNow
function resolveScope(path) {
  const i     = path.indexOf('.');
  const scope = i === -1 ? path : path.slice(0, i);
  const rest  = i === -1 ? ''   : path.slice(i + 1);
  if (scope === 'day')     return [today(), rest];
  if (scope === 'week')    return [thisWeek(), rest];
  if (scope === 'program') return [OS.programs, rest];
  if (scope === 'meta')    return [OS.meta, rest];
  return [null, rest];
}
function getPath(obj, rest) {
  if (!obj) return undefined;
  if (!rest) return obj;
  return rest.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
}
function setPath(obj, rest, val) {
  const keys = rest.split('.');
  const last = keys.pop();
  let o = obj;
  keys.forEach(k => {
    if (typeof o[k] !== 'object' || o[k] === null) o[k] = {};
    o = o[k];
  });
  o[last] = val;
}
function persistGet(path) {
  const [root, rest] = resolveScope(path);
  return getPath(root, rest);
}
function persistSet(path, val) {
  const [root, rest] = resolveScope(path);
  if (!root || !rest) { console.warn('jay-os: bad persist path', path); return; }
  setPath(root, rest, val);
  saveOS();
}

// Fill in anything a saved or imported object is missing, at any depth.
// A hand-edited backup with a partial object used to crash the page that read it.
function deepDefaults(defaults, saved) {
  if (saved == null) return defaults;
  if (typeof defaults !== 'object' || Array.isArray(defaults)) return saved;
  if (typeof saved !== 'object' || Array.isArray(saved)) return saved;
  const out = Object.assign({}, defaults, saved);
  Object.keys(defaults).forEach(k => { out[k] = deepDefaults(defaults[k], saved[k]); });
  return out;
}

// ── HISTORY ───────────────────────────────────────────────────────
// Streak counts back from today. If today isn't closed yet it doesn't
// break the run — you still have the day.
function computeStreak(pred) {
  let i = 0;
  if (!pred(OS.days[dayKeyOffset(0)] || {})) i = 1;
  let streak = 0;
  while (pred(OS.days[dayKeyOffset(i)] || {})) { streak++; i++; }
  return streak;
}
function lastDays(n) {
  const out = [];
  for (let i = 0; i < n; i++) out.push(OS.days[dayKeyOffset(i)] || {});
  return out;
}

// ── MIGRATION ─────────────────────────────────────────────────────
// Legacy keys stay on disk for one release so a rollback loses nothing.
function migrateLegacy(s) {
  try {
    const h = JSON.parse(localStorage.getItem('jay-home-v1') || 'null');
    if (h && h.date) {
      const d = s.days[h.date] || (s.days[h.date] = {});
      if (h.dayType)   d.dayType   = h.dayType;
      if (h.intention) d.intention = h.intention;
    }
  } catch (e) {}
  try {
    const n = JSON.parse(localStorage.getItem('jay-nonneg-v3') || 'null');
    if (n && n.date && n.checked) {
      const d = s.days[n.date] || (s.days[n.date] = {});
      d.nn = n.checked;
    }
  } catch (e) {}
  try {
    const i = JSON.parse(localStorage.getItem('jay-install-v1') || 'null');
    if (i) s.programs.install = i;
  } catch (e) {}
  s.meta.migrated = true;
  s.meta.lastOpen = getToday();
  try { localStorage.setItem(OS_KEY, JSON.stringify(s)); } catch (e) {}
}

// ── EXPORT / IMPORT ───────────────────────────────────────────────
function exportJSON() {
  flushSave();
  const blob = new Blob([JSON.stringify(OS, null, 2)], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url;
  a.download = 'jay-os-' + getToday() + '.json';
  a.click();
  URL.revokeObjectURL(url);
}
function importJSON(text) {
  let data;
  try { data = JSON.parse(text); } catch (e) { alert('That file is not valid JSON.'); return; }
  if (!data || data.v !== 4 || !data.days) { alert('That does not look like a Jay.OS backup.'); return; }
  if (!confirm('Replace everything currently saved with this backup?')) return;
  OS = Object.assign(osDefaults(), data);
  flushSave();
  showPage(currentPageId || 'home');
}
function importFile(input) {
  const f = input.files && input.files[0];
  if (!f) return;
  f.text().then(importJSON);
  input.value = '';
}
