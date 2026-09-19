// ── DAY TYPES ─────────────────────────────────────────────────────
// Question, filters, rule and override per day type. Straight from the
// Morning Calibration cards — the app used to show only the question.
const DAY_TYPES = {
  Sales: {
    q: 'What conversation, sent now, advances money or truth today?',
    filters: [
      ['Signal > Persuasion', 'Am I clarifying the decision, not convincing?'],
      ['Speed Bias',          'Is this moving the deal forward today?'],
      ['Truth Tell',          "What's the real objection they're not saying?"],
      ['Finish Line',         'What clear next step am I asking for?'],
    ],
    rule: 'No content. No tweaking. Only conversations that advance a yes or a no.',
    override: 'Signal > persuasion. Ask for the next step.',
  },
  Creation: {
    q: "What asset exists tonight that didn't this morning?",
    filters: [
      ['Artifact Bias', 'Does this result in something publishable or reusable?'],
      ['Ugly First',    'Can this be version 1 and still useful?'],
      ['One Spine',     "What's the single idea everything hangs on?"],
      ['Ship Test',     'Is this good enough to release without explanation?'],
    ],
    rule: "Creation ends when it's shipped, not when it's perfect.",
    override: 'Artifact > perfection. Ship v1.',
  },
  Strategy: {
    q: 'What decision removes the most future decisions?',
    filters: [
      ['Upstream Only',    'Does this change the game, not the move?'],
      ['Constraint First', 'What must be true for this to work?'],
      ['Kill List',        'What stops immediately if this is chosen?'],
      ['90-Day Test',      'Will this still matter in three months?'],
    ],
    rule: 'Strategy is subtraction with courage.',
    override: 'Subtract. Kill the alternative.',
  },
  Ops: {
    q: 'What breaks if left untouched for 30 days?',
    filters: [
      ['Bottleneck Hunt', 'Where does work pile up or stall?'],
      ['Replace Me Test', 'Could someone else run this as written?'],
      ['Once Forever',    'Can this be systemized or automated?'],
      ['Error Cost',      'What mistake is quietly expensive?'],
    ],
    rule: 'Fix the system, not the symptom.',
    override: 'System > symptom. Write it once.',
  },
  Recovery: {
    q: "What increases tomorrow's output by doing less today?",
    filters: [
      ['Nervous System First', 'Does this calm or stimulate unnecessarily?'],
      ['Body Check',           'What does the body need, not the mind?'],
      ['Signal Silence',       'What input gets cut entirely?'],
      ['Enough Test',          'Am I done before depletion?'],
    ],
    rule: "Recovery is productive when it's intentional.",
    override: 'Nervous system first. Stop early.',
  },
  Relationship: {
    q: "Who matters long-term that I'm under-investing in?",
    filters: [
      ['Give Clean',           'Am I giving without an agenda?'],
      ['Presence Over Fixing', 'Do they need attention or a solution?'],
      ['Under-Investment',     'Who have I been meaning to reach for weeks?'],
      ['Energy Audit',         'Is this person a giver or a chronic drain?'],
    ],
    rule: 'Your operating level is set by who is in the room.',
    override: 'Give clean. No agenda.',
  },
};

// ── WALLET CARDS ──────────────────────────────────────────────────
// Mid-day: pull one, not all.
const CARDS = [
  { name: 'Upstream Filter', qs: ['Does this create leverage or consume it?', 'Does it compound tomorrow?', 'If I skip this, do I feel relief?'], rule: 'If not upstream, it waits.' },
  { name: 'Freedom Filter',  qs: ['Does this buy time, energy, or optionality?', 'Would I still choose this if money were irrelevant?'], rule: 'Freedom beats efficiency.' },
  { name: 'Subtraction Filter', qs: ['What can be deleted with zero downside?', "What's being done from habit, not impact?"], rule: 'Remove before adding.' },
  { name: 'Truth Filter',    qs: ["What am I avoiding because it's uncomfortable?", 'What decision do I already know?'], rule: 'Say it. Decide it. Move.' },
  { name: 'Finish Filter',   qs: ['What is the inevitable next step?', 'Can this be finished in one push?'], rule: 'Start = finish.' },
  { name: 'Energy Filter',   qs: ['Does this protect givers?', 'Does it remove a drain?'], rule: 'Energy first, always.' },
];

// Goals and wins are rendered into innerHTML — keep < & " intact.
function esc(t) {
  return String(t == null ? '' : t)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ── DAY WON ───────────────────────────────────────────────────────
// The evening question is the close. A fully checked day counts too.
function dayWasWon(d) {
  if (d.closed === 'no')  return false;
  if (d.closed === 'yes') return true;
  return NN_DAILY.every(id => d.nn && d.nn[id]);
}

// ── INIT ──────────────────────────────────────────────────────────
function initHome() {
  const el = document.getElementById('home-date');
  if (el) el.textContent = new Date().toLocaleDateString('en-US',
    { weekday: 'long', month: 'long', day: 'numeric' }).toUpperCase();

  renderStreak();
  renderDots();
  renderDayType();
  renderNN();
  renderBlock();
  renderCard();
  renderClosed();
  renderAvoidFlag();
  renderProgram();
}

// ── STREAK + DOTS ─────────────────────────────────────────────────
function renderStreak() {
  const n  = computeStreak(dayWasWon);
  const el = document.getElementById('home-streak');
  if (el) el.textContent = n === 1 ? '1 day' : n + ' days';

  const note = document.getElementById('home-streak-note');
  if (!note) return;
  const yesterday = OS.days[dayKeyOffset(1)] || {};
  note.textContent = (n === 0 && !dayWasWon(yesterday))
    ? 'One breath. One tiny step.'
    : 'Running.';
}

function renderDots() {
  const wrap = document.getElementById('home-dots');
  if (!wrap) return;
  wrap.innerHTML = '';
  for (let i = 6; i >= 0; i--) {
    const d   = OS.days[dayKeyOffset(i)] || {};
    const won = dayWasWon(d);
    const dot = document.createElement('div');
    dot.className = 'day-dot' + (won ? ' won' : d.closed === 'no' ? ' missed' : '');
    dot.title = dayKeyOffset(i);
    wrap.appendChild(dot);
  }
}

// ── DAY TYPE ──────────────────────────────────────────────────────
function setDayType(type) {
  today().dayType = type;
  saveOS();
  renderDayType();
}

function renderDayType() {
  const type = today().dayType;
  document.querySelectorAll('.home-day-btn').forEach(b =>
    b.classList.toggle('selected', b.dataset.type === type));

  const box = document.getElementById('home-daytype-detail');
  if (!box) return;
  const t = DAY_TYPES[type];
  if (!t) { box.innerHTML = ''; box.style.display = 'none'; return; }
  box.style.display = 'block';
  box.innerHTML =
    '<div class="dt-q">' + t.q + '</div>' +
    '<div class="dt-filters">' + t.filters.map(f =>
      '<div class="dt-filter"><div class="dt-filter-name">' + f[0] + '</div>' +
      '<div class="dt-filter-q">' + f[1] + '</div></div>').join('') + '</div>' +
    '<div class="dt-rule"><strong>Rule.</strong> ' + t.rule + '</div>' +
    '<div class="dt-override">' + t.override + '</div>';
}

// ── NON-NEGOTIABLES (the daily five) ──────────────────────────────
function renderNN() {
  const wrap = document.getElementById('home-nn');
  if (!wrap || typeof NN_DATA === 'undefined') return;
  const checked = today().nn || {};
  wrap.innerHTML = '';
  NN_DAILY.forEach(id => {
    const item = NN_DATA.find(d => d.id === id);
    if (!item) return;
    const on = !!checked[id];
    const row = document.createElement('div');
    row.className = 'nn-row' + (on ? ' on' : '');
    row.onclick = () => { nnToggle(id); renderNN(); renderStreak(); renderDots(); };
    row.innerHTML = '<div class="nn-box">' + (on ? '✓' : '') + '</div>' +
                    '<div class="nn-text">' + item.text + '</div>';
    wrap.appendChild(row);
  });
  const done = NN_DAILY.filter(id => checked[id]).length;
  const lab  = document.getElementById('home-nn-count');
  if (lab) lab.textContent = done + ' / ' + NN_DAILY.length;
}

// ── FOCUS BLOCK ───────────────────────────────────────────────────
let blockTimer = null;
let blockMinutes = 45;

function setBlockMinutes(m, btn) {
  blockMinutes = m;
  document.querySelectorAll('.blk-preset').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
}

function startBlock() {
  const goalEl = document.getElementById('blk-goal');
  const goal   = goalEl ? goalEl.value.trim() : '';
  today().block = { goal: goal, minutes: blockMinutes, startedAt: Date.now() };
  saveOS();
  renderBlock();
}

function endBlock() {
  const b = today().block;
  if (!b) return;
  b.ended = true;
  b.elapsed = Math.round((Date.now() - b.startedAt) / 60000);
  saveOS();
  renderBlock();
}

function setBlockWin(v) {
  const b = today().block;
  if (!b) return;
  b.win = v;
  saveOS();
}

function saveBlock() {
  const b = today().block;
  if (!b) return;
  const d = today();
  d.sessions = d.sessions || [];
  d.sessions.push({
    goal: b.goal, minutes: b.elapsed || b.minutes,
    win: (b.win || '').trim(), energy: b.energy || '',
  });
  delete d.block;
  saveOS();
  renderBlock();
}

function setBlockEnergy(v) {
  const b = today().block;
  if (!b) return;
  b.energy = v;
  saveOS();
  renderBlock();
}

function discardBlock() {
  delete today().block;
  saveOS();
  renderBlock();
}

function renderBlock() {
  const wrap = document.getElementById('home-block');
  if (!wrap) return;
  if (blockTimer) { clearInterval(blockTimer); blockTimer = null; }

  const d = today();
  const b = d.block;
  const sessions = d.sessions || [];
  const total = sessions.reduce((s, x) => s + (x.minutes || 0), 0);
  const tally = sessions.length
    ? '<div class="blk-tally">' + sessions.length +
      (sessions.length === 1 ? ' block' : ' blocks') + ' · ' + total + ' min' +
      (sessions.length === 1 ? ' <span>One block done. That\'s enough.</span>' : '') + '</div>'
    : '';

  // Nothing running: set one up.
  if (!b) {
    wrap.innerHTML = tally +
      '<input id="blk-goal" class="blk-goal" type="text" placeholder="Define success in one line...">' +
      '<div class="blk-row">' +
        '<button class="blk-preset' + (blockMinutes === 45 ? ' active' : '') + '" onclick="setBlockMinutes(45,this)">45 min</button>' +
        '<button class="blk-preset' + (blockMinutes === 90 ? ' active' : '') + '" onclick="setBlockMinutes(90,this)">90 min</button>' +
        '<button class="blk-preset' + (blockMinutes === 15 ? ' active' : '') + '" onclick="setBlockMinutes(15,this)">15 min</button>' +
        '<button class="blk-start" onclick="startBlock()">Start block</button>' +
      '</div>' +
      '<div class="blk-hint">Headphones on. One tab. Phone in another room.</div>';
    return;
  }

  // Finished: capture the win.
  if (b.ended) {
    wrap.innerHTML = tally +
      '<div class="blk-goal-big">' + esc(b.goal || 'Block complete') + '</div>' +
      '<div class="blk-done">' + (b.elapsed || b.minutes) + ' min done.</div>' +
      '<input id="blk-win" class="blk-goal" type="text" value="' + esc(b.win) + '"' +
        ' oninput="setBlockWin(this.value)" placeholder="One small win. Feel it land.">' +
      '<div class="blk-row">' +
        '<button class="blk-preset' + (b.energy === 'High' ? ' active' : '') + '" onclick="setBlockEnergy(\'High\')">Energy high</button>' +
        '<button class="blk-preset' + (b.energy === 'Low'  ? ' active' : '') + '" onclick="setBlockEnergy(\'Low\')">Energy low</button>' +
        '<button class="blk-start" onclick="saveBlock()">Log it</button>' +
        '<button class="blk-ghost" onclick="discardBlock()">Discard</button>' +
      '</div>' +
      (b.energy === 'Low' ? '<div class="blk-hint">Narrow the scope next time.</div>' : '');
    return;
  }

  // Running.
  const paint = () => {
    const left = b.minutes * 60000 - (Date.now() - b.startedAt);
    const over = left < 0;
    const secs = Math.floor(Math.abs(left) / 1000);
    const mm   = String(Math.floor(secs / 60)).padStart(2, '0');
    const ss   = String(secs % 60).padStart(2, '0');
    const mins = Math.floor((Date.now() - b.startedAt) / 60000);
    const nudge = mins > 0 && mins % 10 === 0
      ? '<div class="blk-nudge">Am I moving the needle?</div>' : '';
    wrap.innerHTML = tally +
      '<div class="blk-goal-big">' + esc(b.goal || 'One tab. One task.') + '</div>' +
      '<div class="blk-clock' + (over ? ' over' : '') + '">' + (over ? '+' : '') + mm + ':' + ss + '</div>' +
      nudge +
      '<div class="blk-row"><button class="blk-start" onclick="endBlock()">Done</button></div>';
  };
  paint();
  blockTimer = setInterval(() => {
    if (!today().block || today().block.ended) { clearInterval(blockTimer); blockTimer = null; return; }
    paint();
  }, 1000);
}

// ── MID-DAY CARD ──────────────────────────────────────────────────
function pullCard() {
  today().card = Math.floor(Math.random() * CARDS.length);
  saveOS();
  renderCard();
}

function renderCard() {
  const wrap = document.getElementById('home-card');
  if (!wrap) return;
  const i = today().card;
  if (i == null || !CARDS[i]) {
    wrap.innerHTML = '<button class="card-pull" onclick="pullCard()">Pull a card</button>' +
      '<div class="blk-hint">One card, not all six.</div>';
    return;
  }
  const c = CARDS[i];
  wrap.innerHTML =
    '<div class="wallet-card"><div class="wc-name">' + c.name + '</div>' +
    c.qs.map(q => '<div class="wc-q">' + q + '</div>').join('') +
    '<div class="wc-rule">' + c.rule + '</div></div>' +
    '<button class="card-pull ghost" onclick="pullCard()">Pull another</button>';
}

// ── EVENING CLOSE ─────────────────────────────────────────────────
function setClosed(v) {
  today().closed = v;
  saveOS();
  renderClosed();
  renderStreak();
  renderDots();
}

function renderClosed() {
  const c = today().closed;
  const y = document.getElementById('close-yes');
  const n = document.getElementById('close-no');
  if (y) y.classList.toggle('on', c === 'yes');
  if (n) n.classList.toggle('on', c === 'no');
  const note = document.getElementById('close-note');
  if (note) {
    note.textContent = c === 'yes' ? 'Logged. That is the whole game.'
                     : c === 'no'  ? 'Noted, not judged. Tomorrow gets one tiny step.'
                     : '';
  }
}

// ── AVOIDANCE FLAG ────────────────────────────────────────────────
// The app's own red flag: same avoidance three days running.
function renderAvoidFlag() {
  const el = document.getElementById('home-avoid-flag');
  if (!el) return;
  const vals = lastDays(3)
    .map(d => (d.am && d.am.avoiding || '').trim().toLowerCase())
    .filter(Boolean);
  const same = vals.length === 3 && vals.every(v => v === vals[0]);
  el.style.display = same ? 'block' : 'none';
  if (same) el.textContent = 'Same avoidance three days running. That is the signal, not the task.';
}

// ── ACTIVE PROGRAM ────────────────────────────────────────────────
function renderProgram() {
  const el = document.getElementById('home-program');
  if (!el) return;
  const inst = OS.programs.install;
  if (!inst || !inst.startDate) { el.style.display = 'none'; return; }
  const day = Math.max(1, Math.min(30, Math.floor(
    (new Date(getToday() + 'T00:00:00') - new Date(inst.startDate + 'T00:00:00')) / 86400000) + 1));
  el.style.display = 'inline-flex';
  el.textContent = 'Identity Install · Day ' + day + ' of 30';
  el.onclick = () => showPage('install');
}
