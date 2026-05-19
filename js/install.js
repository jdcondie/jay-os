// ── IDENTITY INSTALL — 30-DAY PROTOCOL ─────────────────────────────
const INSTALL_KEY = 'jay-install-v1';

// ── DEFAULT STATE ─────────────────────────────────────────────────
function installDefaults() {
  return {
    startDate: null,
    setup: {
      spec: {
        typicalTuesday: '', morning: '', work: '', financial: '',
        people: '', stoppedTolerating: '', automatic: '', feeling: ''
      },
      competing: { protectFrom: '', ifSucceeds: '', ifFails: '' },
      burning: {
        exitsOpen: ['', '', ''],
        closingThisWeek: { exit: '', how: '', by: '' }
      },
      settlement: { statement: '', kindOfPerson: '', handles: '' }
    },
    days: {},
    audits: {},
    stallsLogged: []
  };
}

function dayDefaults() {
  return {
    date: '', amIntention: '', oneThing: '', excited: '',
    gratitudeNow: ['', ''], gratitudeFuture: ['', ''],
    congruent: { text: '', done: false },
    hardMomentRehearsal: '',
    primers: { a: false, b: false, c: false, d: false, e: false },
    middayVersion: '',
    deposits: { effort: '', success: '', progress: '' },
    newIdentityDid: '', drained: '', energized: '',
    body: { contracted: 0, numb: 0, activated: 0 },
    presenceWin: '',
    tomorrow: { congruent: '', hardMoment: '' }
  };
}

function auditDefaults() {
  return {
    specificity: 0, embodiment: 0, settlement: 0, bank: 0,
    congruent: 0, burning: 0, presence: 0, detachment: 0,
    installing: '', stalling: '', belief: '', standard: ''
  };
}

// ── PERSISTENCE ───────────────────────────────────────────────────
let installState = loadInstall();

function loadInstall() {
  try {
    const raw = localStorage.getItem(INSTALL_KEY);
    if (!raw) return installDefaults();
    return Object.assign(installDefaults(), JSON.parse(raw));
  } catch (e) {
    return installDefaults();
  }
}
function saveInstall() {
  try { localStorage.setItem(INSTALL_KEY, JSON.stringify(installState)); } catch (e) {}
}

// ── HELPERS ───────────────────────────────────────────────────────
function instToday() {
  return new Date().toISOString().split('T')[0];
}
function instDaysBetween(start, end) {
  const a = new Date(start + 'T00:00:00');
  const b = new Date(end + 'T00:00:00');
  return Math.floor((b - a) / 86400000);
}
function instCurrentDay() {
  if (!installState.startDate) return null;
  const d = instDaysBetween(installState.startDate, instToday()) + 1;
  return Math.max(1, Math.min(30, d));
}
function instCurrentWeek() {
  const d = instCurrentDay();
  if (!d) return null;
  return Math.min(4, Math.ceil(d / 7));
}
function instGetDay(n) {
  if (!installState.days[n]) installState.days[n] = dayDefaults();
  return installState.days[n];
}
function instGetAudit(w) {
  if (!installState.audits[w]) installState.audits[w] = auditDefaults();
  return installState.audits[w];
}
function instSetupComplete() {
  const s = installState.setup;
  return !!(s.settlement.statement && s.competing.ifFails && s.burning.closingThisWeek.exit);
}
function instEsc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// ── TAB ROUTING ───────────────────────────────────────────────────
let installActiveTab = 'today';

function installShowTab(id) {
  installActiveTab = id;
  document.querySelectorAll('.install-pane').forEach(p => p.classList.remove('visible'));
  document.querySelectorAll('.install-tab').forEach(b => b.classList.remove('active'));
  document.getElementById('install-pane-' + id)?.classList.add('visible');
  document.getElementById('install-btn-' + id)?.classList.add('active');
  installRender(id);
}

function installRender(id) {
  if (id === 'today')        renderInstallToday();
  if (id === 'setup')        renderInstallSetup();
  if (id === 'bank')         renderInstallBank();
  if (id === 'grid')         renderInstallGrid();
  if (id === 'audit')        renderInstallAudit();
  if (id === 'troubleshoot') renderInstallTroubleshoot();
}

function initInstall() {
  installState = loadInstall();
  const startTab = instSetupComplete() ? 'today' : 'setup';
  installShowTab(startTab);
}

// ── PROGRESS BAR ──────────────────────────────────────────────────
function progressBlock() {
  if (!installState.startDate) return '';
  const d = instCurrentDay();
  const w = instCurrentWeek();
  return `
    <div class="inst-progress">
      <div><div class="label">Day</div><div class="val">${d} / 30</div></div>
      <div><div class="label">Week</div><div class="val">${w} / 4</div></div>
      <div style="flex:1;text-align:right;">
        <div class="label">Started</div>
        <div style="font-size:13px;color:var(--gray-700);font-weight:600;">${installState.startDate}</div>
      </div>
    </div>
  `;
}

// ── SETUP ─────────────────────────────────────────────────────────
function renderInstallSetup() {
  const s = installState.setup;
  const pane = document.getElementById('install-pane-setup');
  pane.innerHTML = `
    ${progressBlock()}

    <h2>Phase 01 — The Model</h2>
    <div class="quote-block"><strong>Identity filters reality.</strong> Fix the identity. The strategy appears automatically. Wanting lives at conscious desire. Being lives at identity. Your nervous system acts on identity, not goals.</div>

    <h2>Phase 02 — Spec the State</h2>
    <p style="font-size:13px;color:var(--gray-500);">A typical Tuesday, present tense. Specificity is the precision of the signal your subconscious can act on.</p>

    ${specField('typicalTuesday', 'It is [date]. I am living and working from')}
    ${specField('morning', 'On a typical morning, I')}
    ${specField('work', 'My work is, and how it feels is')}
    ${specField('financial', 'My financial state, specifically')}
    ${specField('people', 'The people around me, and the quality of relationships')}
    ${specField('stoppedTolerating', 'What I have stopped tolerating')}
    ${specField('automatic', 'What I now do automatically that used to require effort')}
    ${specField('feeling', 'The feeling of my daily life is')}

    <h2>Phase 02 — Competing Identity</h2>
    <p style="font-size:13px;color:var(--gray-500);">Every identity has survival value. Name what the old one protects. Skipping this means the old identity surfaces under pressure every time.</p>
    ${compField('protectFrom', 'What does the old identity protect me from?')}
    ${compField('ifSucceeds', 'What becomes true about me if the new identity succeeds?')}
    ${compField('ifFails', 'What becomes true if it fails? (this is usually what the old identity is protecting you from)')}

    <h2>Phase 03 — Burn the Alternates</h2>
    <p style="font-size:13px;color:var(--gray-500);">Every backup identity you maintain is a drain on the primary one. The person who could always go back has not actually decided.</p>

    <div class="inst-label">Exits I'm keeping open</div>
    ${[0, 1, 2].map(i => `
      <div class="inst-field">
        <input type="text" class="inst-input" placeholder="Exit ${i + 1}"
          value="${instEsc(s.burning.exitsOpen[i])}"
          oninput="installSetExit(${i}, this.value)">
      </div>
    `).join('')}

    <div class="inst-label">Close one this week — the one with the most identity weight</div>
    <div class="inst-field">
      <input type="text" class="inst-input" placeholder="The exit"
        value="${instEsc(s.burning.closingThisWeek.exit)}"
        oninput="installSetClosing('exit', this.value)">
    </div>
    <div class="inst-field">
      <input type="text" class="inst-input" placeholder="How I'm closing it"
        value="${instEsc(s.burning.closingThisWeek.how)}"
        oninput="installSetClosing('how', this.value)">
    </div>
    <div class="inst-field">
      <input type="text" class="inst-input" placeholder="By when (date and time)"
        value="${instEsc(s.burning.closingThisWeek.by)}"
        oninput="installSetClosing('by', this.value)">
    </div>

    <h2>Phase 04 — The Settlement Statement</h2>
    <div class="quote-block">An affirmation says 'I am wealthy' while doubt runs underneath. A settlement says 'this is just what's true about me now.' Non-negotiable. Not requiring proof. The target register is the same certainty as your name.</div>

    ${setField('statement', 'I am someone who…')}
    ${setField('kindOfPerson', 'I am the kind of person who automatically…')}
    ${setField('handles', 'I handle [situation] with [quality]')}

    <div style="margin-top:24px;display:flex;gap:10px;align-items:center;">
      <button class="inst-btn" onclick="installStartProtocol()">
        ${installState.startDate ? 'Update Install' : 'Start the 30 Days'}
      </button>
      ${installState.startDate ? `<button class="inst-btn ghost" onclick="installReset()">Reset Install</button>` : ''}
      <span style="font-size:12px;color:var(--gray-500);">
        ${instSetupComplete() ? 'Setup complete. You can start today.' : 'Fill the Settlement Statement, the "if it fails" answer, and the exit to close.'}
      </span>
    </div>
  `;

  function specField(key, label) {
    return `
      <div class="inst-field">
        <label class="inst-label">${label}</label>
        <textarea class="inst-textarea" oninput="installSetSpec('${key}', this.value)">${instEsc(s.spec[key])}</textarea>
      </div>`;
  }
  function compField(key, label) {
    return `
      <div class="inst-field">
        <label class="inst-label">${label}</label>
        <textarea class="inst-textarea" oninput="installSetComp('${key}', this.value)">${instEsc(s.competing[key])}</textarea>
      </div>`;
  }
  function setField(key, label) {
    return `
      <div class="inst-field">
        <label class="inst-label">${label}</label>
        <textarea class="inst-textarea" oninput="installSetSettlement('${key}', this.value)">${instEsc(s.settlement[key])}</textarea>
      </div>`;
  }
}

function installSetSpec(key, val)       { installState.setup.spec[key] = val; saveInstall(); }
function installSetComp(key, val)       { installState.setup.competing[key] = val; saveInstall(); }
function installSetExit(i, val)         { installState.setup.burning.exitsOpen[i] = val; saveInstall(); }
function installSetClosing(key, val)    { installState.setup.burning.closingThisWeek[key] = val; saveInstall(); }
function installSetSettlement(key, val) { installState.setup.settlement[key] = val; saveInstall(); }

function installStartProtocol() {
  if (!instSetupComplete()) {
    alert('Fill in: Settlement Statement, the "if it fails" answer, and at least one exit to close.');
    return;
  }
  if (!installState.startDate) installState.startDate = instToday();
  saveInstall();
  installShowTab('today');
}
function installReset() {
  if (!confirm('Reset the entire install? All 30 days of entries will be cleared.')) return;
  installState = installDefaults();
  saveInstall();
  installShowTab('setup');
}

// ── TODAY ─────────────────────────────────────────────────────────
function renderInstallToday() {
  const pane = document.getElementById('install-pane-today');
  if (!instSetupComplete()) {
    pane.innerHTML = `
      <div class="quote-block">Setup isn't complete yet. Spec the state, name the competing identity, and write the settlement statement before starting the 30 days.</div>
      <button class="inst-btn" onclick="installShowTab('setup')">Go to Setup</button>
    `;
    return;
  }
  if (!installState.startDate) {
    pane.innerHTML = `
      <div class="quote-block">Ready to begin. Click "Start the 30 Days" on the Setup tab to set today as Day 01.</div>
      <button class="inst-btn" onclick="installShowTab('setup')">Open Setup</button>
    `;
    return;
  }

  const n = instCurrentDay();
  const day = instGetDay(n);
  if (!day.date) day.date = instToday();
  const prevDay = n > 1 ? installState.days[n - 1] : null;
  const stmt = installState.setup.settlement.statement;

  pane.innerHTML = `
    ${progressBlock()}

    <div class="inst-hero">
      <div class="label">Settlement Statement — Read out loud</div>
      <div class="body">I am someone who ${instEsc(stmt)}. This is not a goal I am working toward. This is what's true about me now.</div>
    </div>

    ${prevDay && (prevDay.deposits.effort || prevDay.deposits.success || prevDay.deposits.progress) ? `
      <h2>Yesterday's Deposits — Open today from a full account</h2>
      <div class="inst-deposit">
        <div class="inst-deposit-cell"><div class="label">Effort</div>${instEsc(prevDay.deposits.effort) || '—'}</div>
        <div class="inst-deposit-cell"><div class="label">Success</div>${instEsc(prevDay.deposits.success) || '—'}</div>
        <div class="inst-deposit-cell"><div class="label">Progress</div>${instEsc(prevDay.deposits.progress) || '—'}</div>
      </div>
    ` : ''}

    <h2>AM Ritual — 15 min</h2>

    <div class="inst-field">
      <label class="inst-label">Today's intention — I am ___, and that's why today I ___</label>
      <textarea class="inst-textarea" oninput="installSetDay(${n}, 'amIntention', this.value)">${instEsc(day.amIntention)}</textarea>
    </div>

    <div class="grid-2">
      <div class="inst-field">
        <label class="inst-label">The one thing that moves the needle</label>
        <textarea class="inst-textarea" oninput="installSetDay(${n}, 'oneThing', this.value)">${instEsc(day.oneThing)}</textarea>
      </div>
      <div class="inst-field">
        <label class="inst-label">What I'm excited about</label>
        <textarea class="inst-textarea" oninput="installSetDay(${n}, 'excited', this.value)">${instEsc(day.excited)}</textarea>
      </div>
    </div>

    <div class="grid-2">
      <div class="inst-field">
        <label class="inst-label">Gratitude — right now</label>
        <input type="text" class="inst-input" style="margin-bottom:6px;" value="${instEsc(day.gratitudeNow[0])}" oninput="installSetDayArr(${n}, 'gratitudeNow', 0, this.value)">
        <input type="text" class="inst-input" value="${instEsc(day.gratitudeNow[1])}" oninput="installSetDayArr(${n}, 'gratitudeNow', 1, this.value)">
      </div>
      <div class="inst-field">
        <label class="inst-label">Gratitude — that will happen</label>
        <input type="text" class="inst-input" style="margin-bottom:6px;" value="${instEsc(day.gratitudeFuture[0])}" oninput="installSetDayArr(${n}, 'gratitudeFuture', 0, this.value)">
        <input type="text" class="inst-input" value="${instEsc(day.gratitudeFuture[1])}" oninput="installSetDayArr(${n}, 'gratitudeFuture', 1, this.value)">
      </div>
    </div>

    <div class="inst-field">
      <label class="inst-label">Today's congruent action — only the new identity would take it</label>
      <div style="display:flex;gap:10px;align-items:center;">
        <input type="checkbox" id="cong-${n}" ${day.congruent.done ? 'checked' : ''}
               onchange="installToggleCongruent(${n}, this.checked)" style="width:18px;height:18px;">
        <input type="text" class="inst-input" placeholder="The one action"
               value="${instEsc(day.congruent.text)}" oninput="installSetCongruentText(${n}, this.value)">
      </div>
    </div>

    <div class="inst-field">
      <label class="inst-label">Hard moment rehearsal</label>
      <input type="text" class="inst-input" value="${instEsc(day.hardMomentRehearsal)}" oninput="installSetDay(${n}, 'hardMomentRehearsal', this.value)">
    </div>

    <div class="rule">
      <strong>15 seconds each. No journaling. Just sit in the feeling.</strong>
    </div>
    ${primerLine(n, 'a', 'If I were already enough, how would I feel today?', day)}
    ${primerLine(n, 'b', 'What new decision feels more powerful to hold instead?', day)}
    ${primerLine(n, 'c', 'What part of me no longer needs to be protected?', day)}
    ${primerLine(n, 'd', 'If this had already worked out, how would I show up today?', day)}
    ${primerLine(n, 'e', 'Just sit in the feeling — let it land as truth.', day)}

    <h2>Midday Check — 3 min</h2>
    <div class="inst-field">
      <label class="inst-label">What version showed up this morning?</label>
      <textarea class="inst-textarea" oninput="installSetDay(${n}, 'middayVersion', this.value)">${instEsc(day.middayVersion)}</textarea>
    </div>

    <h2>PM Ritual — 5 min</h2>
    <div class="inst-label">Bank account deposits — today, while fresh</div>
    <div class="inst-deposit">
      <div class="inst-deposit-cell">
        <div class="label">Effort</div>
        <textarea class="inst-textarea" style="background:transparent;border:none;padding:0;min-height:50px;" oninput="installSetDeposit(${n}, 'effort', this.value)">${instEsc(day.deposits.effort)}</textarea>
      </div>
      <div class="inst-deposit-cell">
        <div class="label">Success</div>
        <textarea class="inst-textarea" style="background:transparent;border:none;padding:0;min-height:50px;" oninput="installSetDeposit(${n}, 'success', this.value)">${instEsc(day.deposits.success)}</textarea>
      </div>
      <div class="inst-deposit-cell">
        <div class="label">Progress</div>
        <textarea class="inst-textarea" style="background:transparent;border:none;padding:0;min-height:50px;" oninput="installSetDeposit(${n}, 'progress', this.value)">${instEsc(day.deposits.progress)}</textarea>
      </div>
    </div>

    <div class="inst-field">
      <label class="inst-label">What did the new identity do today?</label>
      <textarea class="inst-textarea" oninput="installSetDay(${n}, 'newIdentityDid', this.value)">${instEsc(day.newIdentityDid)}</textarea>
    </div>

    <div class="grid-2">
      <div class="inst-field">
        <label class="inst-label">What drained me</label>
        <textarea class="inst-textarea" oninput="installSetDay(${n}, 'drained', this.value)">${instEsc(day.drained)}</textarea>
      </div>
      <div class="inst-field">
        <label class="inst-label">What gave me energy</label>
        <textarea class="inst-textarea" oninput="installSetDay(${n}, 'energized', this.value)">${instEsc(day.energized)}</textarea>
      </div>
    </div>

    <div class="inst-label">Body check (1 contracted → 10 expansive / numb → excited / activated → settled)</div>
    ${bodyRow(n, 'contracted', 'Contracted → Expansive', day)}
    ${bodyRow(n, 'numb', 'Numb → Excited', day)}
    ${bodyRow(n, 'activated', 'Activated → Settled', day)}

    <div class="inst-field" style="margin-top:18px;">
      <label class="inst-label">Presence win — I showed calm, conviction, or presence when…</label>
      <textarea class="inst-textarea" oninput="installSetDay(${n}, 'presenceWin', this.value)">${instEsc(day.presenceWin)}</textarea>
    </div>

    <h2>Tomorrow's Setup — Plant the seed before sleep</h2>
    <div class="grid-2">
      <div class="inst-field">
        <label class="inst-label">Tomorrow's congruent action</label>
        <input type="text" class="inst-input" value="${instEsc(day.tomorrow.congruent)}" oninput="installSetTomorrow(${n}, 'congruent', this.value)">
      </div>
      <div class="inst-field">
        <label class="inst-label">Hard moment likely to come</label>
        <input type="text" class="inst-input" value="${instEsc(day.tomorrow.hardMoment)}" oninput="installSetTomorrow(${n}, 'hardMoment', this.value)">
      </div>
    </div>
  `;
  saveInstall();

  function primerLine(n, k, label, day) {
    return `
      <label class="check-item" style="display:flex;align-items:flex-start;gap:10px;padding:8px 0;border-bottom:1px solid var(--gray-100);cursor:pointer;">
        <input type="checkbox" ${day.primers[k] ? 'checked' : ''} onchange="installSetPrimer(${n}, '${k}', this.checked)">
        <span style="font-size:13px;color:var(--gray-700);">${label}</span>
      </label>`;
  }
  function bodyRow(n, key, label, day) {
    let buttons = '';
    for (let i = 1; i <= 10; i++) {
      buttons += `<button class="${day.body[key] === i ? 'on' : ''}" onclick="installSetBody(${n}, '${key}', ${i})">${i}</button>`;
    }
    return `
      <div class="inst-slider-row">
        <div class="name">${label}</div>
        <div class="inst-slider">${buttons}</div>
      </div>`;
  }
}

function installSetDay(n, key, val)            { instGetDay(n)[key] = val; saveInstall(); }
function installSetDayArr(n, key, i, val)      { instGetDay(n)[key][i] = val; saveInstall(); }
function installSetCongruentText(n, val)       { instGetDay(n).congruent.text = val; saveInstall(); }
function installToggleCongruent(n, checked)    { instGetDay(n).congruent.done = checked; saveInstall(); }
function installSetPrimer(n, k, checked)       { instGetDay(n).primers[k] = checked; saveInstall(); }
function installSetDeposit(n, key, val)        { instGetDay(n).deposits[key] = val; saveInstall(); }
function installSetBody(n, key, val)           { instGetDay(n).body[key] = val; saveInstall(); renderInstallToday(); }
function installSetTomorrow(n, key, val)       { instGetDay(n).tomorrow[key] = val; saveInstall(); }

// ── BANK ACCOUNT ──────────────────────────────────────────────────
let bankFilterWeek = 'all';
function renderInstallBank() {
  const pane = document.getElementById('install-pane-bank');
  const entries = [];
  for (let n = 1; n <= 30; n++) {
    const d = installState.days[n];
    if (!d) continue;
    const w = Math.ceil(n / 7);
    if (bankFilterWeek !== 'all' && parseInt(bankFilterWeek) !== w) continue;
    ['effort', 'success', 'progress'].forEach(k => {
      if (d.deposits[k]) entries.push({ day: n, week: w, type: k, text: d.deposits[k] });
    });
  }
  const total = entries.length;

  pane.innerHTML = `
    ${progressBlock()}

    <div class="rule">
      <strong>The Bank Account.</strong> Confidence is a running total of evidence. Every memory of effort, success, progress is a deposit. Every rehearsed failure is a withdrawal.
    </div>

    <div style="display:flex;gap:6px;margin:18px 0;flex-wrap:wrap;">
      ${['all', 1, 2, 3, 4].map(w => `
        <button class="inst-btn ${bankFilterWeek == w ? '' : 'ghost'}" onclick="installSetBankFilter('${w}')">
          ${w === 'all' ? `All (${total})` : `Week ${w}`}
        </button>
      `).join('')}
    </div>

    ${entries.length === 0 ? `
      <div class="quote-block">No deposits yet. The first one lands when you complete the PM ritual for Day 01.</div>
    ` : entries.map(e => `
      <div class="card" style="padding:14px 18px;margin-bottom:8px;">
        <div style="display:flex;gap:10px;align-items:center;margin-bottom:6px;">
          <span class="tag tag-orange">Day ${e.day}</span>
          <span class="tag tag-gray">Week ${e.week}</span>
          <span class="tag ${e.type === 'effort' ? 'tag-blue' : e.type === 'success' ? 'tag-green' : 'tag-orange'}">${e.type.toUpperCase()}</span>
        </div>
        <div style="font-size:14px;color:var(--gray-700);line-height:1.5;">${instEsc(e.text)}</div>
      </div>
    `).join('')}
  `;
}
function installSetBankFilter(w) { bankFilterWeek = w; renderInstallBank(); }

// ── 30-DAY GRID ───────────────────────────────────────────────────
function renderInstallGrid() {
  const pane = document.getElementById('install-pane-grid');
  const today = instCurrentDay();
  const cells = [];
  for (let n = 1; n <= 30; n++) {
    const d = installState.days[n] || dayDefaults();
    const hasDeposit = !!(d.deposits.effort || d.deposits.success || d.deposits.progress);
    const hasCongruent = d.congruent.done;
    const hasPresence = !!d.presenceWin;
    const isToday = n === today;
    const isFuture = today && n > today;
    cells.push(`
      <div class="inst-grid-day ${isToday ? 'active' : ''} ${isFuture ? 'future' : ''}"
           ${isFuture ? '' : `onclick="installOpenDay(${n})"`}>
        <div class="num">${n}</div>
        <div class="dots">
          <div class="dot ${hasDeposit ? 'on' : ''}" title="Deposit"></div>
          <div class="dot ${hasCongruent ? 'on' : ''}" title="Congruent action"></div>
          <div class="dot ${hasPresence ? 'on' : ''}" title="Presence win"></div>
        </div>
      </div>
    `);
  }
  pane.innerHTML = `
    ${progressBlock()}
    <div class="rule"><strong>The Minimum Viable Day.</strong> Did I deposit? Did I take the congruent action? Did I close the loop? Missed days are data, not failure.</div>
    <div style="display:grid;grid-template-columns:repeat(6,1fr);gap:8px;margin-top:18px;">${cells.join('')}</div>
    <div style="display:flex;gap:14px;margin-top:18px;font-size:11px;color:var(--gray-500);font-weight:600;">
      <div style="display:flex;gap:6px;align-items:center;"><div class="dot on" style="width:7px;height:7px;border-radius:50%;background:var(--green);"></div> Deposit / Congruent / Presence</div>
    </div>
  `;
}
function installOpenDay(n) {
  if (!installState.startDate) { alert('Start the install first.'); return; }
  alert(`Day ${n}: ${installState.days[n] ? 'opened' : 'empty'}. Today's entry is on the Today tab. Past days are read-only in v1 — the data persists in the Bank Account view.`);
}

// ── WEEKLY AUDIT ──────────────────────────────────────────────────
const AUDIT_DIMENSIONS = [
  { key: 'specificity', label: 'Specificity', sub: 'Spec is sharp and used' },
  { key: 'embodiment',  label: 'Embodiment',  sub: 'Visualization landed in body' },
  { key: 'settlement',  label: 'Settlement',  sub: 'Statement read with no felt gap' },
  { key: 'bank',        label: 'Bank account', sub: 'Three deposits, every day' },
  { key: 'congruent',   label: 'Congruent action', sub: 'Done daily, no partial credit' },
  { key: 'burning',     label: 'Burning',     sub: 'Exits closed, no re-litigation' },
  { key: 'presence',    label: 'Presence',    sub: 'Held under pressure this week' },
  { key: 'detachment',  label: 'Detachment',  sub: 'No compulsive result-checking' }
];

let auditViewWeek = null;

function renderInstallAudit() {
  const pane = document.getElementById('install-pane-audit');
  const currentWeek = instCurrentWeek();
  if (auditViewWeek == null) auditViewWeek = currentWeek || 1;
  const a = instGetAudit(auditViewWeek);

  const weeks = [1, 2, 3, 4];
  pane.innerHTML = `
    ${progressBlock()}
    <div class="quote-block">Decision sets the destination. Detachment removes resistance. Trust stabilizes the walk.</div>

    <div style="display:flex;gap:6px;margin:18px 0;flex-wrap:wrap;">
      ${weeks.map(w => {
        const unlocked = currentWeek && currentWeek >= w;
        return `<button class="inst-btn ${auditViewWeek === w ? '' : 'ghost'}" ${unlocked ? '' : 'disabled'} onclick="installSetAuditWeek(${w})">Week ${w}${unlocked ? '' : ' (locked)'}</button>`;
      }).join('')}
    </div>

    <h2>Week ${auditViewWeek} — score 1 to 5</h2>
    ${AUDIT_DIMENSIONS.map(dim => {
      let buttons = '';
      for (let i = 1; i <= 5; i++) {
        buttons += `<button class="${a[dim.key] === i ? 'on' : ''}" onclick="installSetAuditScore(${auditViewWeek}, '${dim.key}', ${i})">${i}</button>`;
      }
      return `
        <div class="inst-slider-row">
          <div class="name"><strong>${dim.label}.</strong> ${dim.sub}</div>
          <div class="inst-slider">${buttons}</div>
        </div>`;
    }).join('')}

    <h2>Pattern review</h2>
    ${auditField(auditViewWeek, 'installing', "What's installing? Which dimensions are above 3?")}
    ${auditField(auditViewWeek, 'stalling',   "What's stalling? Which are below 3 for the second week?")}
    ${auditField(auditViewWeek, 'belief',     'What belief has been quietly shaping my reality this week?')}
    ${auditField(auditViewWeek, 'standard',   "What's the one standard I'm no longer willing to lower?")}

    ${renderStallAlerts()}
  `;

  function auditField(w, key, label) {
    const aud = instGetAudit(w);
    return `
      <div class="inst-field">
        <label class="inst-label">${label}</label>
        <textarea class="inst-textarea" oninput="installSetAuditField(${w}, '${key}', this.value)">${instEsc(aud[key])}</textarea>
      </div>`;
  }
}
function installSetAuditWeek(w)              { auditViewWeek = w; renderInstallAudit(); }
function installSetAuditScore(w, key, val)   { instGetAudit(w)[key] = val; saveInstall(); renderInstallAudit(); }
function installSetAuditField(w, key, val)   { instGetAudit(w)[key] = val; saveInstall(); }

// ── STALL DETECTION ───────────────────────────────────────────────
// Any dimension below 3 for 2 consecutive weeks → flagged.
function instDetectStalls() {
  const flagged = new Set();
  for (let w = 2; w <= 4; w++) {
    const a = installState.audits[w];
    const prev = installState.audits[w - 1];
    if (!a || !prev) continue;
    AUDIT_DIMENSIONS.forEach(dim => {
      if (a[dim.key] && a[dim.key] < 3 && prev[dim.key] && prev[dim.key] < 3) {
        flagged.add(dim.key);
      }
    });
  }
  return flagged;
}

function renderStallAlerts() {
  const flagged = instDetectStalls();
  if (flagged.size === 0) return '';
  const map = {
    specificity: 1, embodiment: 2, settlement: 3, congruent: 4,
    burning: 5, detachment: 6, presence: 7, bank: 8
  };
  const stallIds = [...flagged].map(k => map[k]).filter(Boolean);
  return `
    <div class="rule" style="border-left-color:var(--red);background:var(--red-bg);margin-top:24px;">
      <strong style="color:var(--red);">Stalls flagged.</strong> Two dimensions below 3 for two weeks. Open the Troubleshoot tab for Stalls ${stallIds.join(', ')}.
    </div>
    <button class="inst-btn" style="margin-top:10px;" onclick="installShowTab('troubleshoot')">Go to Troubleshooting</button>
  `;
}

// ── TROUBLESHOOTING ───────────────────────────────────────────────
const STALLS = [
  { id: 1, key: 'specificity',
    title: 'Competing identity has not been named.',
    pattern: "The old identity is not passive. It was built to protect you from something. Until you name what that is, it surfaces under pressure every time and overrides the new declaration.",
    correction: 'Sit with this: what becomes true about me if the new identity succeeds? What becomes true if it fails? The answer to the second is usually what the old one is protecting you from. Name it.' },
  { id: 2, key: 'embodiment',
    title: 'Visualizing from an activated state.',
    pattern: "If you're running the visualization while stressed, distracted, or physiologically activated, the imagery isn't reaching identity depth. You're practicing on top of anxiety.",
    correction: 'Regulate first. The 6-second exhale, the dropped shoulders, the softened eyes. These aren\'t optional. They\'re the precondition for effective installation.' },
  { id: 3, key: 'settlement',
    title: 'Declaration still has hedge language.',
    pattern: "Read your statement out loud. Listen for future tense ('will have'), process language ('am working on'), conditional language ('when I have X, I will Y').",
    correction: "Rewrite until the declaration is present tense, unconditional, and non-negotiable. If there's any felt gap between you and the statement, the language is still hedged." },
  { id: 4, key: 'congruent',
    title: 'No behavioral confirmation under load.',
    pattern: "You're doing the visualization but not taking congruent action, especially under pressure. The action is the mechanism. Without it, you're rehearsing the concept.",
    correction: "Find one thing this week that only the new identity would do, that your current circumstances make uncomfortable, and do it. That's your install action." },
  { id: 5, key: 'burning',
    title: 'Environment is running the old script.',
    pattern: "If you haven't audited and adjusted your environment, you're swimming upstream. The visual field, the content, the default conversations. All of it runs identity scripts.",
    correction: 'This week: remove three things from your environment that belong to the old identity. Add three that belong to the new.' },
  { id: 6, key: 'detachment',
    title: 'Decision has become desperation.',
    pattern: "You're doing the protocol, but the energy underneath shifted from settled certainty to anxious urgency. You check for results compulsively. Slow days feel like evidence against the identity.",
    correction: 'Shift focus from outcome monitoring to input execution. Track what you did, not what happened. Reinstate the regulation step. Remind yourself: delay is not denial.' },
  { id: 7, key: 'presence',
    title: 'Presence collapses under load.',
    pattern: "The identity is installed at rest, but you lose it in high-pressure moments. You revert to monitoring. Watching yourself instead of being yourself.",
    correction: "Run C-B-A before every high-stakes interaction. Every time. Not only when you feel flat. Track micro-victories: 'I showed up as myself in that one.' Write it down." },
  { id: 8, key: 'bank',
    title: 'The account is running a deficit.',
    pattern: "You're taking more withdrawals than deposits. The mental account is thin. Confidence in the moment requires something to draw on, and right now there isn't enough.",
    correction: 'Immediate Progress Review. After any completed task, pause for 30 seconds. What went well? What progressed? Write it down. Even on bad days, this finds something.' }
];

function renderInstallTroubleshoot() {
  const pane = document.getElementById('install-pane-troubleshoot');
  const flagged = instDetectStalls();
  const flaggedStallIds = new Set(STALLS.filter(s => flagged.has(s.key)).map(s => s.id));

  pane.innerHTML = `
    ${progressBlock()}
    <div class="rule"><strong>Troubleshooting.</strong> If you're doing the protocol and the identity is not installing, one of these is the cause. Find the match. Run the correction. Resume.</div>

    ${flaggedStallIds.size > 0 ? `
      <div class="rule" style="border-left-color:var(--red);background:var(--red-bg);">
        <strong style="color:var(--red);">${flaggedStallIds.size} stall${flaggedStallIds.size > 1 ? 's' : ''} flagged from your audits.</strong> Marked below.
      </div>
    ` : ''}

    ${STALLS.map(s => {
      const log = installState.stallsLogged.find(l => l.stallId === s.id);
      const isFlagged = flaggedStallIds.has(s.id);
      return `
        <div class="inst-stall ${isFlagged ? 'flagged' : ''}">
          <span class="stall-num">STALL ${String(s.id).padStart(2, '0')}</span>
          ${isFlagged ? '<span class="tag tag-red" style="margin-left:8px;">FLAGGED</span>' : ''}
          <div class="stall-title">${s.title}</div>
          <div class="stall-block"><div class="lbl">The pattern</div>${s.pattern}</div>
          <div class="stall-block" style="background:var(--orange-light);"><div class="lbl" style="color:var(--orange);">The correction</div>${s.correction}</div>
          <div class="inst-field" style="margin-top:12px;">
            <label class="inst-label">Correction applied (what you did)</label>
            <textarea class="inst-textarea" oninput="installLogStall(${s.id}, this.value)">${instEsc(log?.correctionApplied || '')}</textarea>
            ${log ? `<div style="font-size:11px;color:var(--gray-500);margin-top:4px;">Logged ${log.date}</div>` : ''}
          </div>
        </div>`;
    }).join('')}
  `;
}

function installLogStall(stallId, text) {
  let log = installState.stallsLogged.find(l => l.stallId === stallId);
  if (!log) {
    log = { stallId, correctionApplied: '', date: instToday(), week: instCurrentWeek() || 0 };
    installState.stallsLogged.push(log);
  }
  log.correctionApplied = text;
  log.date = instToday();
  saveInstall();
}
