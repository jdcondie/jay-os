// ── PROGRAMS ──────────────────────────────────────────────────────
// Multi-day trackers. One runs at a time — the Rewiring protocol's own
// rule is to run one target at a time, and it applies to all of them.
const PROGRAMS = [
  { id: 'install',  page: 'install',  name: 'Identity Install',    days: 30,
    sub: 'Decide at depth until what you want becomes what you are.' },
  { id: 'rewiring', page: 'rewiring', name: 'Behavior Rewiring',   days: 14,
    sub: 'Install one automatic behavior. One target at a time.' },
  { id: 'cycle7',   page: '7day',     name: '7-Day Identity Cycle', days: 7,
    sub: 'One page a day. Run the cycle weekly.' },
];

function progState(id) {
  const p = OS.programs;
  return p[id] || (p[id] = {});
}

function progDay(id, len) {
  const s = progState(id).startDate;
  if (!s) return null;
  const n = Math.floor(
    (new Date(getToday() + 'T00:00:00') - new Date(s + 'T00:00:00')) / 86400000) + 1;
  return Math.max(1, Math.min(len, n));
}

function progStart(id) {
  const active = OS.programs.active;
  if (active && active !== id) {
    const other = PROGRAMS.find(p => p.id === active);
    if (!confirm('You are running ' + (other ? other.name : active) +
        '. One target at a time — switch to this one?')) return;
  }
  progState(id).startDate = getToday();
  OS.programs.active = id;
  saveOS();
  renderPrograms();
}

function progStop(id) {
  if (!confirm('Stop this program? Everything you have written is kept.')) return;
  delete progState(id).startDate;
  if (OS.programs.active === id) OS.programs.active = null;
  saveOS();
  renderPrograms();
}

function renderPrograms() {
  const wrap = document.getElementById('prog-list');
  if (!wrap) return;
  wrap.innerHTML = '';
  PROGRAMS.forEach(p => {
    const day    = progDay(p.id, p.days);
    const active = OS.programs.active === p.id;
    const pct    = day ? Math.round((day / p.days) * 100) : 0;
    const el = document.createElement('div');
    el.className = 'prog-card' + (active ? ' active' : '');
    el.innerHTML =
      '<div class="prog-top">' +
        '<div><div class="prog-name">' + p.name +
          (active ? '<span class="prog-badge">RUNNING</span>' : '') + '</div>' +
          '<div class="prog-sub">' + p.sub + '</div></div>' +
        '<div class="prog-day">' + (day ? 'Day ' + day + ' / ' + p.days : p.days + ' days') + '</div>' +
      '</div>' +
      (day ? '<div class="prog-bar"><div class="prog-fill" style="width:' + pct + '%"></div></div>' : '') +
      '<div class="prog-actions">' +
        '<button class="prog-open" onclick="showPage(\'' + p.page + '\')">Open</button>' +
        (day
          ? '<button class="prog-ghost" onclick="progStop(\'' + p.id + '\')">Stop</button>'
          : '<button class="prog-start" onclick="progStart(\'' + p.id + '\')">Start</button>') +
      '</div>';
    wrap.appendChild(el);
  });
}

// ── WEEKLY ────────────────────────────────────────────────────────
const WEEKLY_QS = [
  ['northStar',   'North Star: what am I pretending not to know?'],
  ['outcomes',    'Top 1–2 outcomes this week'],
  ['cost',        'Cost audit: what quietly taxed me last week?'],
  ['subtraction', 'Subtraction list: what gets removed to protect the outcomes?'],
  ['avoidance',   'Avoidance audit: what must happen within 72 hours?'],
  ['system',      'System move: what gets standardized so willpower is not required?'],
  ['missTwice',   'Never miss twice: what slipped once? How do I prevent the second?'],
];

function lastWeekKey() {
  const d = new Date();
  d.setDate(d.getDate() - 7);
  return isoWeek(fmtDate(d));
}

function weekReview() {
  let closed = 0, yes = 0, blocks = 0, minutes = 0, typed = 0;
  for (let i = 0; i < 7; i++) {
    const d = OS.days[dayKeyOffset(i)] || {};
    if (d.closed) closed++;
    if (d.closed === 'yes') yes++;
    if (d.intention) typed++;
    (d.sessions || []).forEach(s => { blocks++; minutes += s.minutes || 0; });
  }
  return { closed, yes, blocks, minutes, typed };
}

function renderWeekly() {
  const wrap = document.getElementById('weekly-body');
  if (!wrap) return;
  const prev = OS.weeks[lastWeekKey()] || {};
  const r = weekReview();

  let html =
    '<div class="wk-review">' +
      '<div class="wk-stat"><div class="wk-num">' + r.yes + ' / 7</div><div class="wk-lab">Dominant move done</div></div>' +
      '<div class="wk-stat"><div class="wk-num">' + r.blocks + '</div><div class="wk-lab">Focus blocks</div></div>' +
      '<div class="wk-stat"><div class="wk-num">' + r.minutes + '</div><div class="wk-lab">Deep work minutes</div></div>' +
      '<div class="wk-stat"><div class="wk-num">' + r.typed + ' / 7</div><div class="wk-lab">Days with a move set</div></div>' +
    '</div>';

  html += WEEKLY_QS.map(q =>
    '<div class="ws-field"><div class="ws-label">' + q[1] + '</div>' +
    '<textarea class="ws-input" rows="2" data-persist="week.' + q[0] + '"></textarea>' +
    (prev[q[0]] ? '<div class="wk-prev">Last week: ' + esc(prev[q[0]]) + '</div>' : '') +
    '</div>').join('');

  // Layer 3 is the weekly sweep. It was being asked for daily.
  const checked = thisWeek().nn || (thisWeek().nn = {});
  const weeklyNN = (typeof NN_DATA !== 'undefined' ? NN_DATA : []).filter(d => d.layer === 3);
  if (weeklyNN.length) {
    html += '<div class="wk-sub">Weekly guardrails</div>';
    html += weeklyNN.map(item =>
      '<div class="nn-row' + (checked[item.id] ? ' on' : '') + '" onclick="weeklyNNToggle(\'' + item.id + '\')">' +
      '<div class="nn-box">' + (checked[item.id] ? '✓' : '') + '</div>' +
      '<div class="nn-text">' + item.text + '</div></div>').join('');
  }

  html += '<div class="wk-sub">One rule to tighten next week</div>' +
    '<textarea class="ws-input" rows="2" data-persist="week.tighten" ' +
    'placeholder="The single rule that gets stricter..."></textarea>' +
    '<div class="wk-gate">Gate: if the week has priorities but no subtraction, you are lying.</div>';

  wrap.innerHTML = html;
  hydrate(wrap);
}

function weeklyNNToggle(id) {
  const c = thisWeek().nn || (thisWeek().nn = {});
  if (c[id]) delete c[id]; else c[id] = true;
  saveOS();
  renderWeekly();
}

// ── ANNUAL ────────────────────────────────────────────────────────
function renderAnnualNN() {
  const wrap = document.getElementById('annual-nn');
  if (!wrap || typeof NN_DATA === 'undefined') return;
  const st = OS.programs.annual || (OS.programs.annual = {});
  const checked = st.nn || (st.nn = {});
  wrap.innerHTML = NN_DATA.filter(d => d.layer === 1).map(item =>
    '<div class="nn-row' + (checked[item.id] ? ' on' : '') + '" onclick="annualNNToggle(\'' + item.id + '\')">' +
    '<div class="nn-box">' + (checked[item.id] ? '✓' : '') + '</div>' +
    '<div class="nn-text">' + item.text + '</div></div>').join('');
}

function annualNNToggle(id) {
  const st = OS.programs.annual || (OS.programs.annual = {});
  const c  = st.nn || (st.nn = {});
  if (c[id]) delete c[id]; else c[id] = true;
  saveOS();
  renderAnnualNN();
}

// ── PAGE ──────────────────────────────────────────────────────────
function initPrograms() {
  renderPrograms();
  renderWeekly();
  progShowTab(location.hash === '#programs-weekly' ? 'weekly' : 'trackers');
}

function progShowTab(id, btn) {
  document.querySelectorAll('.prog-pane').forEach(p => p.classList.remove('visible'));
  document.querySelectorAll('.prog-tab').forEach(b => b.classList.remove('active'));
  document.getElementById('prog-pane-' + id)?.classList.add('visible');
  (btn || document.getElementById('prog-tab-' + id))?.classList.add('active');
  if (id === 'weekly') renderWeekly();
  if (id === 'annual') renderAnnualNN();
}
