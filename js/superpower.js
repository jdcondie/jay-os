// ── SUPERPOWER PAGE FILTERS ───────────────────────────────────────
function _spApplyFilter(matchFn) {
  const grid = document.getElementById('sp-card-grid');
  if (!grid) return;
  grid.querySelectorAll('.card').forEach(card => {
    card.style.display = matchFn(card) ? '' : 'none';
  });
}
function _spClearIdentity() {
  document.querySelectorAll('#sp-identity-row .sp-identity').forEach(t => t.classList.remove('sp-identity-active'));
}
function _spClearPills() {
  document.querySelectorAll('#sp-filter-row .tab-pill').forEach(b => b.classList.remove('active'));
}
function filterSuperpowers(cat, btn) {
  _spClearPills();
  _spClearIdentity();
  if (btn) btn.classList.add('active');
  _spApplyFilter(card => cat === 'all' || card.dataset.spcat === cat);
}
function filterByTag(tag, el) {
  const wasActive = el.classList.contains('sp-identity-active');
  _spClearIdentity();
  _spClearPills();
  if (wasActive) {
    const allBtn = document.querySelector('#sp-filter-row .tab-pill');
    if (allBtn) allBtn.classList.add('active');
    _spApplyFilter(() => true);
    return;
  }
  el.classList.add('sp-identity-active');
  _spApplyFilter(card => (card.dataset.sptags || '').split(',').includes(tag));
  document.getElementById('sp-card-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
