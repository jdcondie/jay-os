// ── NN DATA ───────────────────────────────────────────────────────
const NN_DATA = [
  // LAYER 1 — Life Architecture
  { layer:1, id:'arch1',  rank:2,  text:'Own the income source',
    sub:'Solo operator or founder, not employee in a cage.', tags:['identity','wiring'] },
  { layer:1, id:'arch2',  rank:4,  text:'Zero chronic energy drains in inner circle',
    sub:'One toxic person lowers the whole operating level.', tags:['fuel'] },
  { layer:1, id:'arch3',  rank:7,  text:'Work matches the 6554 loop',
    sub:'Investigate → Extract → Design → Experiment → Move On.', tags:['wiring'] },
  { layer:1, id:'arch4',  rank:8,  text:'90% schedule control',
    sub:'Nobody owns your time.', tags:['wiring','identity'] },
  { layer:1, id:'arch5',  rank:9,  text:'Physical environment feeds the brain',
    sub:'Mountains, trails, sunshine. Clean space. Visual clutter is mental clutter.', tags:['fuel'] },
  { layer:1, id:'arch6',  rank:10, text:'Creation is the primary work mode',
    sub:'30% learning, 40% building, 20% teaching, 10% ops.', tags:['wiring'] },
  { layer:1, id:'arch7',  rank:12, text:'Delegate or automate execution-heavy work',
    sub:'Every hour on draining tasks is stolen from your superpowers.', tags:['wiring'] },
  { layer:1, id:'arch8',  rank:14, text:'One system worth building for 5 years',
    sub:'Pick it. Let everything else orbit it.', tags:['identity','wiring'] },
  { layer:1, id:'arch9',  rank:16, text:'Faith is active and central',
    sub:'Failure is impossible. Magic is expected. Positive outcomes are inevitable.', tags:['identity'] },
  { layer:1, id:'arch10', rank:18, text:'Family is provided for, relationships feel rich',
    sub:"Alyssa, the partnership. These are the anchors. They don't get negotiated away.", tags:['identity'] },

  // LAYER 2 — Daily Operating System
  { layer:2, id:'daily1', rank:1,  text:'Move body before opening phone',
    sub:'Even 10 minutes. Brain medicine. Every protocol works better when this is done first.', tags:['fuel'] },
  { layer:2, id:'daily2', rank:3,  text:'Protect first 2 hours for deep creative work',
    sub:"Best brain, fullest tank. Don't spend it on email.", tags:['fuel','wiring'] },
  { layer:2, id:'daily3', rank:5,  text:'Create something every day — even small',
    sub:'Creation produces dopamine, the chemical gatekeeper for your TPN.', tags:['fuel','wiring'] },
  { layer:2, id:'daily4', rank:6,  text:'Phone in another room during focus blocks',
    sub:'Not face down on desk. Another room.', tags:['wiring'] },
  { layer:2, id:'daily5', rank:11, text:'Set one clear intention for the day',
    sub:'Not a list. One thing.', tags:['wiring'] },
  { layer:2, id:'daily6', rank:13, text:'Low-reward task gets morning fuel, not scraps',
    sub:'The avoided task needs the best fuel. Eat the frog.', tags:['wiring'] },
  { layer:2, id:'daily7', rank:15, text:'Work in timed focus blocks (45–90 min)',
    sub:'One tab. One task. Full-screen. Timer running.', tags:['wiring'] },
  { layer:2, id:'daily8', rank:17, text:'Bright overhead light on (first 9 hrs after waking)',
    sub:'Triggers dopamine, epinephrine. Artificial sunrise for executive function.', tags:['fuel'] },
  { layer:2, id:'daily9', rank:19, text:'No decisions from a depleted tank',
    sub:'Decisions from depletion are almost always wrong.', tags:['fuel'] },
  { layer:2, id:'daily10',rank:20, text:'Run the ownership test before key tasks',
    sub:'Is this mine? Can I find the cathedral?', tags:['identity','wiring'] },
  { layer:2, id:'daily11',rank:22, text:'Monitor above eye level — gaze up',
    sub:'Looking down activates sleepiness circuits in your brainstem.', tags:['fuel'] },
  { layer:2, id:'daily12',rank:24, text:'Coach B gets the last word',
    sub:'Shame destroys the prefrontal cortex hardware you need.', tags:['identity','fuel'] },
  { layer:2, id:'daily13',rank:26, text:'End of day: energy audit + acknowledge wins',
    sub:'What gave energy? Do more. What drained? Reduce.', tags:['fuel'] },
  { layer:2, id:'daily14',rank:28, text:'Protect sleep — dark room, consistent time',
    sub:'Non-negotiable maintenance for the operating system.', tags:['fuel'] },

  // LAYER 3 — Weekly Guardrails
  { layer:3, id:'week1',  rank:21, text:'Audit open loops on paper',
    sub:"Write every active thread. Paper doesn't expand.", tags:['wiring'] },
  { layer:3, id:'week2',  rank:23, text:'80→100% finish check on active builds',
    sub:'Reframe the finish as the next build. Declare system complete.', tags:['wiring'] },
  { layer:3, id:'week3',  rank:25, text:'Check for task displacement patterns',
    sub:'Same task avoided 3+ days = signal. Delegate, automate, or drop it.', tags:['wiring'] },
  { layer:3, id:'week4',  rank:27, text:'Confirm current project passes career filter',
    sub:'5 yeses = right track. Anything less = reassess.', tags:['wiring','identity'] },
  { layer:3, id:'week5',  rank:29, text:'Review: does this week expand or shrink freedom?',
    sub:"Prune anything that doesn't point toward freedom.", tags:['identity'] },
  { layer:3, id:'week6',  rank:30, text:'Energy givers vs. drains inventory',
    sub:"Your operating level is set by who's in the room.", tags:['fuel'] },
];

// ── FILTER STATE ──────────────────────────────────────────────────
let nnFilterVal = 'all';

// ── TAG HELPERS ───────────────────────────────────────────────────
function tagLabel(t) {
  return t === 'wiring' ? '6554 WIRING' : t === 'fuel' ? 'FUEL TANK' : 'IDENTITY';
}
function tagStyle(t) {
  if (t === 'wiring') return 'background:var(--orange-light);color:var(--orange);';
  if (t === 'fuel')   return 'background:var(--green-bg);color:var(--green);';
  return 'background:var(--yellow-bg);color:var(--yellow);';
}

// ── RENDER LAYER ─────────────────────────────────────────────────
function nnRenderLayer(layer, gridId) {
  const grid = document.getElementById(gridId);
  if (!grid) return;
  const items = NN_DATA.filter(d => d.layer === layer).sort((a, b) => a.rank - b.rank);
  grid.innerHTML = '';
  items.forEach(item => {
    const checked = !!nnState.checked[item.id];
    const visible = nnFilterVal === 'all' || item.tags.includes(nnFilterVal);
    if (!visible) return;

    const checkIcon = checked
      ? `<svg width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="8" r="7.5" fill="var(--green-bg)" stroke="var(--green)"/><path d="M5 8l2 2 4-4" stroke="var(--green)" stroke-width="2" stroke-linecap="round" fill="none"/></svg>`
      : `<svg width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="8" r="7.5" stroke="var(--gray-300)" fill="none"/></svg>`;

    const el = document.createElement('div');
    el.style.cssText = `display:flex;align-items:flex-start;gap:14px;padding:16px 18px;background:${checked ? 'var(--gray-50)' : 'var(--white)'};border:1.5px solid ${checked ? 'var(--green)' : 'var(--gray-300)'};border-radius:10px;cursor:pointer;opacity:${checked ? '0.5' : '1'};transition:all 0.15s;margin-bottom:8px;`;
    el.onclick = () => nnToggle(item.id);
    el.innerHTML = `
      <div style="font-size:10px;font-weight:800;color:var(--orange);background:var(--orange-light);border-radius:5px;padding:2px 7px;flex-shrink:0;margin-top:2px;">#${item.rank}</div>
      <div style="flex:1;min-width:0;">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
          ${checkIcon}
          <div style="font-size:14px;font-weight:700;color:var(--black);${checked ? 'text-decoration:line-through;text-decoration-color:var(--gray-300);' : ''}">${item.text}</div>
        </div>
        <div style="font-size:12px;color:var(--gray-500);line-height:1.6;margin-bottom:8px;">${item.sub}</div>
        <div style="display:flex;gap:5px;flex-wrap:wrap;">${item.tags.map(t => `<span style="font-size:10px;font-weight:700;padding:2px 7px;border-radius:4px;${tagStyle(t)}">${tagLabel(t)}</span>`).join('')}</div>
      </div>`;
    grid.appendChild(el);
  });
}

// ── UPDATE PROGRESS ───────────────────────────────────────────────
function nnUpdateProgress() {
  const total   = NN_DATA.length;
  const checked = NN_DATA.filter(d => nnState.checked[d.id]).length;
  const pct     = Math.round((checked / total) * 100);
  const bar     = document.getElementById('nn-fill');
  const label   = document.getElementById('nn-label');
  const pctEl   = document.getElementById('nn-pct');
  if (bar)   { bar.style.width = pct + '%'; bar.style.background = pct >= 100 ? 'var(--green)' : 'var(--orange)'; }
  if (label)  label.textContent = `${checked} / ${total}`;
  if (pctEl) { pctEl.textContent = pct + '%'; pctEl.style.color = pct >= 100 ? 'var(--green)' : 'var(--orange)'; }
}

// ── RENDER ALL ────────────────────────────────────────────────────
function nnRenderAll() {
  nnRenderLayer(1, 'nn-grid1');
  nnRenderLayer(2, 'nn-grid2');
  nnRenderLayer(3, 'nn-grid3');
  nnUpdateProgress();
}

// ── TOGGLE ────────────────────────────────────────────────────────
function nnToggle(id) {
  if (nnState.checked[id]) delete nnState.checked[id];
  else nnState.checked[id] = true;
  saveState(NN_KEY, nnState);
  nnRenderAll();
  if (typeof updateHomeStats === 'function') updateHomeStats();
}

// ── FILTER ────────────────────────────────────────────────────────
function nnFilter(type, btn) {
  nnFilterVal = type;
  document.querySelectorAll('[id^="nn-f-"]').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  nnRenderAll();
}

// ── RESET ─────────────────────────────────────────────────────────
function nnReset() {
  nnState.checked = {};
  saveState(NN_KEY, nnState);
  nnRenderAll();
}
