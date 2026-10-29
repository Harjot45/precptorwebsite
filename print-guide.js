/* Standalone printable guide: deliberately avoids modal printing and external dependencies. */
(() => {
  'use strict';
  const article = document.querySelector('#print-article');
  const id = new URLSearchParams(location.search).get('article');
  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const guide = (window.PP?.guides ?? []).find(item => item.id === id);
  const back = document.querySelector('#return-to-guide');
  if (guide) back.href = 'resources.html?article=' + encodeURIComponent(guide.id);
  function readSaved() {
    try {
      const items = JSON.parse(localStorage.getItem('pp-v3-guide-' + id) || '[]');
      return Array.isArray(items) ? items.map(Number).filter(Number.isInteger) : [];
    } catch { return []; }
  }
  function saveSelected() {
    const picked = Array.from(document.querySelectorAll('[data-print-check]:checked'), node => Number(node.dataset.printCheck));
    try { localStorage.setItem('pp-v3-guide-' + id, JSON.stringify(picked)); } catch { /* local storage optional */ }
    document.querySelector('#completed-total').textContent = `${picked.length} / ${guide.checklist.length} items marked`;
  }
  if (!guide) {
    article.innerHTML = `<div class="invalid"><h1>Guide unavailable</h1><p>Choose a guide from the Resources library to view or print it.</p><p><a href="resources.html">Browse resources →</a></p></div>`;
    document.querySelectorAll('.print-button').forEach(button => button.disabled = true);
    return;
  }
  document.title = guide.title + ' — Printable Guide | Placement Preceptor';
  const selected = readSaved();
  article.innerHTML = `
    <div class="document-head">
      <div class="document-brand"><span class="brand-mark">p<span>✳</span></span><span class="brand-word">placement<strong>preceptor<span class="brand-dot">.</span></strong></span></div>
      <span class="edition">CLINICAL PLACEMENT NOTEBOOK<br>PRINTABLE RESOURCE</span>
    </div>
    <div class="document-rule"></div>
    <header class="guide-title-block"><p class="eyebrow">${esc(guide.category)} / ${esc(guide.level)} / ${esc(guide.time)}</p><h1>${esc(guide.title)}</h1><p class="intro">${esc(guide.summary)}</p></header>
    <div class="guide-sections">${guide.sections.map((section, i) => `<section class="guide-section"><div class="section-index">${String(i+1).padStart(2, '0')}</div><div><h2>${esc(section.heading)}</h2><p>${esc(section.body)}</p></div></section>`).join('')}</div>
    <section class="print-checklist"><div class="checklist-heading"><h2>Your personal action checklist</h2><span id="completed-total">${selected.length} / ${guide.checklist.length} items marked</span></div><p class="check-help no-print">Update your checklist here before printing. Checked items may sync with the resource page in this browser.</p>
    <ul>${guide.checklist.map((item, i) => `<li><label><input type="checkbox" data-print-check="${i}" ${selected.includes(i) ? 'checked' : ''}><span>${esc(item)}</span></label></li>`).join('')}</ul></section>
    <p class="educational-note"><strong>Important:</strong> Educational guidance only. School, employer and clinical-site policies take precedence. Marking a checklist item does not constitute verification, school approval, or an authorized clinical start.</p>
    <footer class="document-footer"><span>PLACEMENT PRECEPTOR · EDUCATIONAL DESIGN CONCEPT</span><span>For personal planning · Not an official approval form</span></footer>`;
  document.querySelectorAll('[data-print-check]').forEach(input => input.addEventListener('change', saveSelected));
  document.querySelectorAll('.print-button').forEach(button => button.addEventListener('click', () => window.print()));
})();
