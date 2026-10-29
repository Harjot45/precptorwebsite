/* Placement Preceptor v6: five standalone pages, no maps, printing or checklist tools. */
(() => {
'use strict';
const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));
const page = document.body.dataset.page;
const params = new URLSearchParams(location.search);
const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const opt = (value, label, selected) => `<option value="${esc(value)}" ${value === selected ? 'selected' : ''}>${esc(label)}</option>`;
const month = value => PP.months.find(m => m[0] === value)?.[1] || value || 'Flexible';
// Some browsers restrict History API writes for websites opened directly as file://.
// The interface should still work without URL-state updates.
function updatePageURL(url) { try { history.replaceState(null, '', url.pathname + url.search + url.hash); } catch { /* local-file preview mode */ } }
const store = {
  get(key, otherwise) { try { return JSON.parse(localStorage.getItem('pp-v3-' + key)) ?? otherwise; } catch { return otherwise; } },
  set(key, value) { try { localStorage.setItem('pp-v3-' + key, JSON.stringify(value)); } catch {/* storage optional */} }
};
let saved = store.get('saved', []);
if (!Array.isArray(saved)) saved = [];
saved = saved.filter(id => PP.rotations.some(r => r.id === id));
let compare = [], layout = 'grid', wizard = null, lastFocus = null, toastTimer, savedOnly = false;
const modal = $('#modal'), content = $('#modal-content');
const monthFieldValues = PP.months;
$$('[data-specialty-options]').forEach(select => select.insertAdjacentHTML('beforeend', PP.specialties.map(s => opt(s,s)).join('')));
$$('[data-month-options]').forEach(select => select.insertAdjacentHTML('beforeend', PP.months.map(([v,l]) => opt(v,l)).join('')));

function toast(message) {
  const t = $('#toast'); if(!t) return;
  t.textContent = message;
  t.classList.add('visible'); clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('visible'), 3100);
}
function refreshSaved() {
  store.set('saved', saved);
  $$('[data-saved-count]').forEach(el => el.textContent = saved.length);
}
function openModal(html) {
  if(!modal || !content) return;
  if(!modal.open) lastFocus = document.activeElement;
  content.innerHTML = html;
  if(!modal.open) modal.showModal();
  modal.scrollTop = 0;
  document.body.classList.add('modal-open');
  $('.modal-close', modal)?.focus();
}
function closeModal() {
  if(!modal.open) return;
  modal.close(); document.body.classList.remove('modal-open'); wizard = null;
  if(lastFocus?.isConnected) lastFocus.focus();
}
$('.modal-close')?.addEventListener('click',closeModal);
modal?.addEventListener('cancel',e => {e.preventDefault();closeModal()});
modal?.addEventListener('click',e => {if(e.target===modal) closeModal()});

function renderCard(r) {
  const selected = saved.includes(r.id);
  return `<article class="rotation-card" data-rotation-card="${esc(r.id)}" tabindex="-1">
    <div class="card-art ${esc(r.color)}"><span class="sample-tag">ILLUSTRATIVE ROTATION</span><span class="art-symbol" aria-hidden="true">${esc(r.icon)}</span>
      <button type="button" class="heart ${selected?'active':''}" data-save="${esc(r.id)}" aria-label="${selected?'Remove':'Save'} ${esc(r.title)}" aria-pressed="${selected}">${selected?'♥':'♡'}</button></div>
    <div class="card-body"><div class="rotation-card-code"><span>ROTATION CODE</span><strong>${esc(r.code)}</strong></div><p class="card-specialty">${esc(r.specialty)}</p><h3>${esc(r.title)}</h3>
      <p class="card-location">⌖ ${esc(r.city)}, ${esc(r.state)} · ${esc(r.credential)}</p>
      <div class="card-tags"><span>${esc(r.hours)} example hrs</span><span>${esc(month(r.month))}</span><span>${esc(r.setting)}</span></div>
      <div class="card-footer"><button type="button" class="compare-action ${compare.includes(r.id)?'selected':''}" data-compare="${esc(r.id)}" aria-pressed="${compare.includes(r.id)}">${compare.includes(r.id)?'✓ Added to compare':'+ Compare'}</button><button type="button" data-detail="${esc(r.id)}">View details ↗</button></div></div>
  </article>`;
}
function explorerFilters() {
  return {specialty: $('#filter-specialty')?.value || '',location:$('#filter-location')?.value || '',code:$('#filter-code')?.value || '',month:$('#filter-month')?.value || '',setting:$('#filter-setting')?.value || '',minimum:Number($('#filter-hours')?.value || 0),savedOnly,saved,sort:$('#sort')?.value || 'recommended'};
}
function renderExplorer() {
  if(page !== 'explore') return;
  const f = explorerFilters();
  const rows = PP.filterRotations(PP.rotations,f).filter(r => r.hours >= f.minimum); 
  $('#results-count').innerHTML = `<strong>${rows.length}</strong> fictional rotation${rows.length===1?'':'s'} ${f.savedOnly?'saved':'to explore'}`;
  const grid = $('#rotation-grid');
  grid.classList.toggle('list-view',layout==='list');
  grid.innerHTML = rows.length ? rows.map(renderCard).join('') : `<div class="empty-state"><div class="empty-symbol">◎</div><h3>${f.savedOnly?'Your saved list is empty.':'No sample rotations found.'}</h3><p>${f.savedOnly?'Use a heart icon on any example to build your shortlist.':'Try removing a filter or searching another location. These are examples, not live availability.'}</p><button type="button" class="btn btn-dark" data-reset>Show all sample rotations ↗</button></div>`;
  const labels = [['specialty',f.specialty],['location',f.location],['code',f.code],['month',f.month?month(f.month):''],['setting',f.setting],['hours',f.minimum?f.minimum+'+ hours':''],['saved',f.savedOnly?'Saved only':'']];
  $('#active-filters').innerHTML = labels.filter(([,v])=>v).map(([k,v])=>`<button type="button" data-clear-filter="${k}" aria-label="Remove ${esc(v)} filter">${esc(v)} ×</button>`).join('');
  const url = new URL(location.href);
  ['specialty','location','code','month','setting','hours','saved'].forEach(k => url.searchParams.delete(k));
  if(f.specialty)url.searchParams.set('specialty',f.specialty);
  if(f.location)url.searchParams.set('location',f.location);
  if(f.code)url.searchParams.set('code',f.code);
  if(f.month)url.searchParams.set('month',f.month);
  if(f.setting)url.searchParams.set('setting',f.setting);
  if(f.minimum)url.searchParams.set('hours',String(f.minimum));
  if(f.savedOnly)url.searchParams.set('saved','1');
  updatePageURL(url);
  window.PP.lastExplorerRows=rows;
}
function updateSavedFilterButton(){
  const button=$('#saved-only'); if(!button)return;
  button.classList.toggle('selected',savedOnly);
  button.setAttribute('aria-pressed',String(savedOnly));
  button.textContent=savedOnly?'♥ Saved only':'♡ Saved only';
}
function resetFilters() {
  ['#filter-specialty','#filter-location','#filter-code','#filter-month','#filter-setting','#filter-hours'].forEach(s => {const el=$(s);if(el)el.value='';});
  savedOnly=false; updateSavedFilterButton();
  if($('#sort')) $('#sort').value='recommended';
  renderExplorer();
}
function clearFilter(name) {
  const keys={specialty:'#filter-specialty',location:'#filter-location',code:'#filter-code',month:'#filter-month',setting:'#filter-setting',hours:'#filter-hours',saved:'#saved-only'};
  const el=$(keys[name]); if(!el)return;
  el.value='';
  renderExplorer();
}
function toggleSaved(id) {
  saved = saved.includes(id) ? saved.filter(k=>k!==id) : [...saved,id];
  refreshSaved(); renderExplorer();
  toast(saved.includes(id)?'Saved to your browser shortlist.':'Removed from your browser shortlist.');
}
function toggleCompare(id) {
  if(compare.includes(id)) compare = compare.filter(k=>k!==id);
  else if(compare.length<3) compare.push(id);
  else { toast('You can compare up to three rotations.'); }
  updateCompare();
}
function updateCompare() {
  $('#compare-tray').hidden = !compare.length;
  $('#compare-count').textContent = compare.length;
  $('#show-compare').disabled = compare.length < 2;
  $$('[data-compare]').forEach(el => { const active=compare.includes(el.dataset.compare); el.classList.toggle('selected',active);el.setAttribute('aria-pressed',String(active));el.textContent=active?'✓ Added to compare':'+ Compare'; });
}
function detail(id) {
  const r=PP.rotations.find(r=>r.id===id);if(!r)return;
  openModal(`<p class="modal-eyebrow">ILLUSTRATIVE ROTATION · ${esc(r.id.toUpperCase())}</p><h2 id="modal-title">${esc(r.title)}</h2>
  <div class="detail-banner ${esc(r.color)}"><span aria-hidden="true">${esc(r.icon)}</span><div><h3>${esc(r.specialty)}</h3><p>${esc(r.city)}, ${esc(r.state)} · ${esc(r.setting)}</p></div></div>
  <p class="modal-lead">${esc(r.description)}</p><div class="detail-grid">${[['Rotation code',r.code],['Example credential',r.credential],['Clinical hours',r.hours+' example hrs'],['Illustrative month',month(r.month)],['Sample schedule',r.days],['Setting',r.setting],['School review','Required before clinical hours']].map(([label,value])=>`<div><small>${esc(label)}</small><strong>${esc(value)}</strong></div>`).join('')}</div>
  <h3 class="modal-h3">Learning objectives this setting could support</h3><ul class="detail-list">${r.goals.map(g=>`<li>${esc(g)}</li>`).join('')}</ul>
  <p class="modal-notice">This is not a real preceptor or bookable placement. Dates, hours and locations are sample data. Your school must approve any actual clinical arrangement.</p>
  <div class="dialog-actions"><button class="btn btn-accent" data-request="${esc(r.id)}">Build a similar brief ↗</button><button class="btn btn-ghost" data-add-compare="${esc(r.id)}">${compare.includes(id)?'Remove from comparison':'Add to comparison'}</button></div>`);
}
function showComparison() {
  const rows = compare.map(id => PP.rotations.find(r=>r.id===id)).filter(Boolean);
  if(rows.length<2)return;
  openModal(`<p class="modal-eyebrow">CLINICAL FIT, SIDE BY SIDE · SAMPLE DATA</p><h2 id="modal-title">Compare your shortlist.</h2><p class="modal-lead">Compare illustrative environments, schedules and goals before creating a placement brief.</p><div class="compare-table-wrap"><table class="compare-table"><thead><tr><th scope="col">Key detail</th>${rows.map(r=>`<th scope="col">${esc(r.title)}</th>`).join('')}</tr></thead><tbody>${[['Specialty','specialty'],['Location','city'],['Preceptor credential','credential'],['Setting','setting'],['Example hours','hours'],['Example month','month'],['Schedule','days']].map(([label,key])=>`<tr><th scope="row">${esc(label)}</th>${rows.map(r=>`<td>${esc(key==='month'?month(r[key]):key==='city'?r.city+', '+r.state:r[key])}</td>`).join('')}</tr>`).join('')}<tr><th scope="row">Next step</th>${rows.map(r=>`<td><button class="text-btn" data-request="${esc(r.id)}">Create brief ↗</button></td>`).join('')}</tr></tbody></table></div><p class="modal-notice">All details are fictional. No school approval, real availability or clinical eligibility is implied.</p>`);
}

// Guided, on-screen placement request. No email sent and no backend storage.
function startWizard(mode='student', rotationId) {
  const r = PP.rotations.find(x=>x.id===rotationId);
  wizard={mode,step:0,values:{specialty:r?.specialty || PP.specialties[0],location:r?`${r.city}, ${r.state}`:'',month:r?.month||monthFieldValues[0][0],setting:r?.setting||'Outpatient clinic',hours:r?.hours||160}};
  renderWizard();
}
const field=(label,key,type='text',placeholder='',required=true) => `<label>${esc(label)}<input name="${esc(key)}" type="${esc(type)}" placeholder="${esc(placeholder)}" value="${esc(wizard.values[key]??'')}" ${required?'required':''} maxlength="200" ${type==='number'?'min="1" max="2000" step="1"':''}></label>`;
const selectField=(label,key,values)=>`<label>${esc(label)}<select name="${esc(key)}">${values.map(item=>Array.isArray(item)?opt(item[0],item[1],wizard.values[key]):opt(item,item,wizard.values[key])).join('')}</select></label>`;
function collectWizard() {
  const form=$('#wizard-form'); if(!form || !form.reportValidity())return false;
  for(const [k,v] of new FormData(form))wizard.values[k]=v;
  return true;
}
function summaryHTML(values,mentor){
  const entries=[['Specialty',values.specialty],['Preferred location',values.location],['Clinical setting',values.setting],['Start month',month(values.month)], [mentor?'Credential':'Required clinical hours',mentor?values.credential:values.hours], [mentor?'Practice / organization':'School / program',values.organization], ...(mentor?[['Student capacity',values.capacity]]:values.requirements?[['Extra requirements',values.requirements]]:[]),['Contact name',values.name],['Contact email',values.email]];
  return `<div class="summary-grid">${entries.map(([label,value])=>`<div><small>${esc(label)}</small><span>${esc(value || '—')}</span></div>`).join('')}</div>`;
}
function renderWizard() {
  if(!wizard)return;
  const w=wizard,mentor=w.mode==='preceptor';
  const titles=mentor?['Tell us about your practice.','Set your teaching preferences.','A way to reach you.','Review your interest.']:['Find your clinical focus.','Add your school requirements.','A way to reach you.','Review your placement brief.'];
  let body='';
  if(w.step===0)body=selectField('Specialty','specialty',PP.specialties)+field(mentor?'Practice location':'Preferred rotation location','location','text','City, state')+selectField('Clinical setting','setting',['Outpatient clinic','Community health','Hospital','Other clinical setting']);
  if(w.step===1)body=selectField(mentor?'Potential teaching start':'Rotation start month','month',PP.months)+(mentor?field('Professional credential','credential','text','MD, DO, NP…')+field('Practice / organization','organization','text','Your practice name')+field('Students you could consider','capacity','number','1'):field('Clinical hours required','hours','number','160')+field('School / program','organization','text','University / track')+field('School requirements (optional)','requirements','text','Credentials, deadlines, etc.',false));
  if(w.step===2)body=field('Full name','name','text','Sample name')+field('Email address','email','email','sample@example.com')+'<p class="modal-notice wide">Demo only: use sample contact information. Data remains in the open dialog and is not sent, emailed or saved to a server.</p>';
  if(w.step===3)body=summaryHTML(w.values,mentor);
  openModal(`<p class="modal-eyebrow">${mentor?'PRECEPTOR INTEREST':'STUDENT PLACEMENT BRIEF'} · INTERACTIVE DEMO</p><div class="wizard-progress">${[0,1,2,3].map(i=>`<span class="${i<=w.step?'active':''}"></span>`).join('')}</div><p class="wizard-step-label">STEP ${w.step+1} / 4</p><h2 id="modal-title">${titles[w.step]}</h2><p class="modal-lead">${['Build a clear picture of the proposed clinical experience.','Capture the requirements that matter for a practical fit.','This is a preview of the proposed contact step.','Review your details before completing the on-screen demonstration.'][w.step]}</p><form id="wizard-form"><div class="${w.step<3?'wizard-fields':''}">${body}</div><div class="wizard-nav"><button class="text-btn" id="wizard-back" type="button">${w.step?'← Back':'Cancel'}</button><button class="btn btn-accent" type="submit">${w.step===3?'Complete demo':'Continue'} ↗</button></div></form>`);
  $('#wizard-back').addEventListener('click',()=>{
    if(w.step===0)return closeModal();
    for(const [k,v] of new FormData($('#wizard-form')))w.values[k]=v;
    w.step--;renderWizard();
  });
  $('#wizard-form').addEventListener('submit',e=>{
    e.preventDefault();if(!collectWizard())return;
    if(w.step<3){w.step++;renderWizard();}else finishWizard();
  });
}
function finishWizard(){
  const mentor=wizard.mode==='preceptor',summary=summaryHTML(wizard.values,mentor);
  openModal(`<div class="success-circle">✓</div><p class="modal-eyebrow">ON-SCREEN DEMO COMPLETE</p><h2 id="modal-title">Your ${mentor?'mentor interest':'placement brief'} is organized.</h2><p class="modal-lead">A real service could use a summary like this to begin a conversation, subject to program and practice requirements.</p>${summary}<p class="modal-notice"><strong>Nothing was submitted.</strong> No coordinator was contacted, no application was created and no rotation was reserved.</p><div class="dialog-actions"><button class="btn btn-dark" data-close>Finish demo ↗</button></div>`);
  wizard=null;
}

// Resources: category tabs, text search and full articles.
let resourceCategory='All',faqCategory='All';
function resourceCard(r){return `<a class="resource-card" href="resources.html?article=${encodeURIComponent(r.id)}" data-article="${esc(r.id)}"><div class="resource-card-art ${esc(r.tone)}"><span class="resource-number">${esc(r.art)}</span><span class="resource-symbol">✳</span><small>${esc(r.level.toUpperCase())}</small></div><div class="resource-card-content"><span class="resource-meta">${esc(r.category.toUpperCase())} · ${esc(r.time)}</span><h3>${esc(r.title)}</h3><p>${esc(r.summary)}</p><span class="arrow-link">Read full guide <b>↗</b></span></div></a>`;}
function renderResources(){
  if(page!=='resources')return;
  const q=$('#resource-search').value.trim().toLowerCase();
  const visible=PP.guides.filter(r=>(resourceCategory==='All'||r.category===resourceCategory)&&(!q||[r.title,r.summary,r.category,r.level,...r.sections.flatMap(s=>[s.heading,s.body])].join(' ').toLowerCase().includes(q)));
  $('#resource-count').textContent=`Showing ${visible.length} of ${PP.guides.length} guides`;
  $('#resource-grid').innerHTML=visible.length?visible.map(resourceCard).join(''):'<div class="resource-empty"><h3>No guides found.</h3><p>Try another topic or choose All guides.</p><button class="btn btn-dark" data-resource-reset>Show all guides ↗</button></div>';
  $$('[data-resource-category]').forEach(b=>{b.classList.toggle('active',b.dataset.resourceCategory===resourceCategory);b.setAttribute('aria-pressed',String(b.dataset.resourceCategory===resourceCategory));});
}
function openArticle(id,updateURL=true){
  const r=PP.guides.find(x=>x.id===id);if(!r)return;
  openModal(`<p class="modal-eyebrow">${esc(r.category.toUpperCase())} · ${esc(r.time)} · ${esc(r.level.toUpperCase())}</p><h2 id="modal-title">${esc(r.title)}</h2><p class="modal-lead">${esc(r.summary)}</p>
    ${r.sections.map((section,i)=>`<section class="article-section"><h3>${String(i+1).padStart(2,'0')} / ${esc(section.heading)}</h3><p>${esc(section.body)}</p></section>`).join('')}
    <p class="modal-notice">Educational information only. Your university and clinical site determine eligibility, approval and onboarding requirements.</p>
    <div class="dialog-actions"><button class="btn btn-dark" data-start="student">Find a Match ↗</button><button class="btn btn-ghost" data-close>Back to resources</button></div>`);
  if(updateURL){const url=new URL(location.href);url.searchParams.set('article',id);updatePageURL(url);}
}
function renderFaq(){
  if(page!=='resources')return;
  const rows=PP.faqs.filter(f=>faqCategory==='All'||f.category===faqCategory);
  $('#faq-list').innerHTML=rows.map((f,i)=>`<details ${i===0?'open':''}><summary>${esc(f.q)} <span>+</span></summary><p>${esc(f.a)}</p></details>`).join('');
  $$('[data-faq-category]').forEach(b=>b.classList.toggle('active',b.dataset.faqCategory===faqCategory));
}
function privacyResource(){
  const r=PP.resources.privacy;
  openModal(`<p class="modal-eyebrow">ABOUT THIS PROTOTYPE</p><h2 id="modal-title">${esc(r.title)}</h2><p class="modal-lead">${esc(r.intro)}</p><ol class="resource-list">${r.items.map(x=>`<li>${esc(x)}</li>`).join('')}</ol><p class="modal-notice">${esc(r.note)}</p><button class="btn btn-dark" data-close>Back to exploring ↗</button>`);
}

// How it works: interactive student/preceptor/school journeys.
let audience=['student','preceptor','school'].includes(params.get('audience'))?params.get('audience'):'student', journeyIndex=0;
function renderJourney(){
  if(page!=='process')return;
  const steps=PP.journey[audience],cur=steps[journeyIndex];
  $$('[data-audience]').forEach(b=>{b.classList.toggle('active',b.dataset.audience===audience);b.setAttribute('aria-pressed',String(b.dataset.audience===audience))});
  $('#journey-progress-label').textContent=`${journeyIndex+1} / ${steps.length}`;
  $('#journey-progress-fill').style.width=((journeyIndex+1)/steps.length*100)+'%';
  $('#journey-step-list').innerHTML=steps.map((s,i)=>`<button type="button" class="journey-step ${i===journeyIndex?'active':''}" data-journey-index="${i}" aria-pressed="${i===journeyIndex}"><span class="journey-step-number">${String(i+1).padStart(2,'0')}</span><span><strong>${esc(s.title)}</strong><small>${esc(s.tag)}</small></span></button>`).join('');
  $('#journey-detail-tag').textContent=cur.tag;
  $('#journey-detail-count').textContent='STEP '+String(journeyIndex+1).padStart(2,'0');
  $('#journey-detail-inner').innerHTML=`<span class="detail-symbol">✳</span><h3>${esc(cur.title)}</h3><p>${esc(cur.text)}</p><h4>WHAT TO KEEP IN VIEW</h4><ul>${cur.items.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`;
  $('#journey-prev').disabled=journeyIndex===0;
  $('#journey-next').textContent=journeyIndex===steps.length-1?'Restart guide ↻':'Next step ↗';
  const url=new URL(location.href);if(audience==='student')url.searchParams.delete('audience');else url.searchParams.set('audience',audience);
  updatePageURL(url);
}
// Shared click and change handlers. Buttons in modal and dynamic grids remain live.
document.addEventListener('click', e => {
  const el=e.target.closest('[data-save],[data-detail],[data-request],[data-add-compare],[data-clear-filter],[data-reset],[data-start],[data-close],[data-resource],[data-article],[data-resource-reset],[data-resource-category],[data-faq-category],[data-audience],[data-journey-index]');
  if(!el)return;
  if(el.hasAttribute('data-save'))toggleSaved(el.dataset.save);
  else if(el.hasAttribute('data-detail'))detail(el.dataset.detail);
  else if(el.hasAttribute('data-request'))startWizard('student',el.dataset.request);
  else if(el.hasAttribute('data-add-compare')){toggleCompare(el.dataset.addCompare);el.textContent=compare.includes(el.dataset.addCompare)?'Remove from comparison':'Add to comparison';}
  else if(el.hasAttribute('data-clear-filter'))clearFilter(el.dataset.clearFilter);
  else if(el.hasAttribute('data-reset'))resetFilters();
  else if(el.hasAttribute('data-start')){if(el.dataset.start==='preceptor') location.href='for-preceptors.html#become-a-preceptor';else startWizard(el.dataset.start);}
  else if(el.hasAttribute('data-close'))closeModal();
  else if(el.hasAttribute('data-resource'))privacyResource();
  else if(el.hasAttribute('data-article')){e.preventDefault();openArticle(el.dataset.article);}
  else if(el.hasAttribute('data-resource-reset')){$('#resource-search').value='';resourceCategory='All';renderResources()}
  else if(el.hasAttribute('data-resource-category')){resourceCategory=el.dataset.resourceCategory;renderResources();}
  else if(el.hasAttribute('data-faq-category')){faqCategory=el.dataset.faqCategory;renderFaq();}
  else if(el.hasAttribute('data-audience')){audience=el.dataset.audience;journeyIndex=0;renderJourney();}
  else if(el.hasAttribute('data-journey-index')){journeyIndex=Number(el.dataset.journeyIndex);renderJourney();}
});
document.addEventListener('click',e=>{
  const button=e.target.closest('button[data-compare]');
  if(button)toggleCompare(button.dataset.compare);
});

// Page mount.
$('#menu-toggle')?.addEventListener('click',()=>{const nav=$('#site-nav'),open=!nav.classList.contains('open');nav.classList.toggle('open',open);$('#menu-toggle').setAttribute('aria-expanded',String(open));$('#menu-toggle').setAttribute('aria-label',open?'Close menu':'Open menu');});
$$('#site-nav a').forEach(link=>link.addEventListener('click',()=>{$('#site-nav').classList.remove('open');$('#menu-toggle').setAttribute('aria-expanded','false');}));
function scrollUI(){const max=document.documentElement.scrollHeight-innerHeight;$('#scroll-progress').style.width=(max>0?scrollY/max*100:0)+'%';$('#site-header').classList.toggle('is-scrolled',scrollY>18)}
window.addEventListener('scroll',scrollUI,{passive:true});scrollUI();
if('IntersectionObserver'in window && !matchMedia('(prefers-reduced-motion: reduce)').matches){
  document.documentElement.classList.add('js-motion');
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('in-view');observer.unobserve(entry.target)}}),{threshold:.07});
  $$('.reveal').forEach(el=>observer.observe(el));
}
$('#home-search-form')?.addEventListener('submit',e=>{
  e.preventDefault();const f=new FormData(e.target),query=new URLSearchParams();
  for(const k of ['specialty','location','month']) if(String(f.get(k)||'').trim())query.set(k,String(f.get(k)).trim());
  location.href='explore.html'+(query.size?'?'+query.toString():'');
});
if(page==='explore'){
  const set=(id,key)=>{const el=$(id),v=params.get(key);if(el&&v!==null){if(el.tagName==='SELECT'){if([...el.options].some(o=>o.value===v))el.value=v;}else el.value=v;}};
  for(const [id,key] of [['#filter-specialty','specialty'],['#filter-location','location'],['#filter-code','code'],['#filter-month','month'],['#filter-setting','setting'],['#filter-hours','hours']])set(id,key);
  savedOnly=params.get('saved')==='1';
  updateSavedFilterButton();
  for(const id of ['#filter-specialty','#filter-location','#filter-code','#filter-month','#filter-setting','#filter-hours','#sort'])$(id).addEventListener(['#filter-location','#filter-code'].includes(id)?'input':'change',renderExplorer);
  $('#saved-only').addEventListener('click',()=>{savedOnly=!savedOnly;updateSavedFilterButton();renderExplorer();});
  $('#reset-filters').addEventListener('click',resetFilters);
  const filterToggle=$('#directory-filter-toggle');
  filterToggle.addEventListener('click',()=>{const open=$('#filter-panel').classList.toggle('open');filterToggle.setAttribute('aria-expanded',String(open));});
  $('#search-rotations')?.addEventListener('click',()=>{renderExplorer();document.querySelector('#marketplace')?.scrollIntoView({block:'start',behavior:'smooth'});});
  ['grid','list'].forEach(v=>$('#view-'+v).addEventListener('click',()=>{layout=v;['grid','list'].forEach(k=>{$('#view-'+k).classList.toggle('active',k===v);$('#view-'+k).setAttribute('aria-pressed',String(k===v));});renderExplorer();}));
  renderExplorer();
}
$('#clear-compare')?.addEventListener('click',()=>{compare=[];updateCompare();});
$('#show-compare')?.addEventListener('click',showComparison);
if(page==='process'){
  $('#journey-prev').addEventListener('click',()=>{journeyIndex=Math.max(0,journeyIndex-1);renderJourney();});
  $('#journey-next').addEventListener('click',()=>{journeyIndex=(journeyIndex+1)%PP.journey[audience].length;renderJourney();});
  renderJourney();
}
if(page==='resources'){
  $('#resource-search').addEventListener('input',renderResources);
  renderResources();renderFaq();
  const article=params.get('article');if(article&&PP.guides.some(r=>r.id===article))openArticle(article,false);
}
refreshSaved();
})();
