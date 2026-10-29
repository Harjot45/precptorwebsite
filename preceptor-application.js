/* Placement Preceptor v6 — progressive preceptor-interest application.
   Submissions are disabled until a real HTTPS form endpoint is configured.
   Contact information is never stored in localStorage or auto-sent.
*/
(() => {
  'use strict';
  const form = document.getElementById('preceptor-application');
  if (!form) return;
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const panels = $$('.application-step');
  const back = $('#application-back'), next = $('#application-next');
  const copy = $('#application-copy'), send = $('#application-send');
  const message = $('#application-submit-status'), note = $('#application-connection-note');
  const fill = $('#application-progress-fill');
  const caption = $('#application-progress-caption'), percent = $('#application-progress-percent');
  const review = $('#application-review');
  const endpoint = typeof window.PP_PRECEPTOR_ENDPOINT === 'string' ? window.PP_PRECEPTOR_ENDPOINT.trim() : '';
  const connected = /^https:\/\/[^\s]+\.[^\s]+/.test(endpoint) && !endpoint.includes('YOUR_');
  const states = [
    ['AL','Alabama'],['AK','Alaska'],['AZ','Arizona'],['AR','Arkansas'],['CA','California'],['CO','Colorado'],['CT','Connecticut'],['DE','Delaware'],['DC','District of Columbia'],['FL','Florida'],['GA','Georgia'],['HI','Hawaii'],['ID','Idaho'],['IL','Illinois'],['IN','Indiana'],['IA','Iowa'],['KS','Kansas'],['KY','Kentucky'],['LA','Louisiana'],['ME','Maine'],['MD','Maryland'],['MA','Massachusetts'],['MI','Michigan'],['MN','Minnesota'],['MS','Mississippi'],['MO','Missouri'],['MT','Montana'],['NE','Nebraska'],['NV','Nevada'],['NH','New Hampshire'],['NJ','New Jersey'],['NM','New Mexico'],['NY','New York'],['NC','North Carolina'],['ND','North Dakota'],['OH','Ohio'],['OK','Oklahoma'],['OR','Oregon'],['PA','Pennsylvania'],['RI','Rhode Island'],['SC','South Carolina'],['SD','South Dakota'],['TN','Tennessee'],['TX','Texas'],['UT','Utah'],['VT','Vermont'],['VA','Virginia'],['WA','Washington'],['WV','West Virginia'],['WI','Wisconsin'],['WY','Wyoming']
  ];
  $$('[data-us-state-select]').forEach(select => {
    for(const [value,label] of states){const option=document.createElement('option');option.value=value;option.textContent=label;select.appendChild(option);}
  });
  // Do not prepopulate a personal application with real identifying details.
  const monthField = form.elements.namedItem('startMonth');
  const now = new Date();
  const year = now.getFullYear(), month = String(now.getMonth()+1).padStart(2,'0');
  if(monthField) monthField.min=`${year}-${month}`;
  let index=0;
  const labels = [
    ['Your name','fullName'],['Credential','credential'],['Specialty','specialty'],['License state','licenseState'],['NPI (optional)','npi'],['Clinical experience','yearsExperience'],
    ['Practice','practiceName'],['City','city'],['Practice state','practiceState'],['ZIP code','zip'],['Setting','setting'],['Patient population','patientPopulation'],
    ['Potential start','startMonth'],['Student capacity','capacity'],['Days per week','days'],['Students considered','studentType'],['Teaching preferences','teachingNotes'],
    ['Email','email'],['Phone','phone'],['Preferred contact','contactPreference']
  ];
  const esc = v => String(v ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const valueFor = name => form.elements.namedItem(name)?.value?.trim() || '';
  function applicationDetails(){
    return labels.map(([label,name]) => [label,valueFor(name)]).filter(([label,value]) => value);
  }
  function summaryText(){
    return 'Placement Preceptor | Preceptor interest — preview\n'+
       applicationDetails().map(([k,v])=>`${k}: ${v}`).join('\n')+
       '\n\nNot verified or approved. Do not treat this as a confirmed placement.';
  }
  function renderReview(){
    review.innerHTML=applicationDetails().map(([label,value]) => `<div class="application-review-row"><span>${esc(label)}</span><strong>${esc(value)}</strong></div>`).join('');
  }
  function showStep(step){
    index=Math.max(0,Math.min(4,step));
    panels.forEach((panel,i)=>{panel.hidden=i!==index;});
    $$('.application-step-chips span').forEach((el,i)=>{el.classList.toggle('active',i===index);el.classList.toggle('completed',i<index)});
    const pct=Math.round((index+1)/panels.length*100);
    fill.style.width=pct+'%';caption.textContent=`Step ${index+1} of ${panels.length}`;percent.textContent=pct+'%';
    back.hidden=index===0;next.hidden=index===4;copy.hidden=index!==4||connected;send.hidden=index!==4||!connected;
    if(index===4){renderReview();note.textContent=connected
      ? 'Please review these details before submitting. Your information will be sent securely to the configured intake service for follow-up.'
      : 'Preview mode: No intake endpoint is configured. Nothing will be submitted or saved. Do not enter real contact information for testing.';
    }
    message.textContent='';message.className='application-submit-status';
  }
  function validateStep(){
    const inputs=[...panels[index].querySelectorAll('input,select,textarea')].filter(input=>input.name!=='website');
    for(const input of inputs){if(!input.checkValidity()){input.reportValidity();input.focus();return false;}}
    return true;
  }
  next.addEventListener('click',()=>{if(validateStep())showStep(index+1)});
  back.addEventListener('click',()=>showStep(index-1));
  copy.addEventListener('click',async ()=>{
    const text=summaryText();
    try{ await navigator.clipboard.writeText(text);message.textContent='Summary copied. This does not submit an application.';message.className='application-submit-status good'; }
    catch{
      const area=document.createElement('textarea');area.value=text;area.style.position='fixed';area.style.left='-10000px';document.body.appendChild(area);area.select();
      const success=document.execCommand('copy');area.remove();
      message.textContent=success?'Summary copied. Nothing was submitted.':'Unable to copy automatically. Select and copy the review details above.';
      message.className='application-submit-status '+(success?'good':'error');
    }
  });
  send.addEventListener('click',async ()=>{
    if(!connected)return;
    if(valueFor('website')){message.textContent='Unable to complete this request.';message.className='application-submit-status error';return;}
    // Check every input across all steps before sharing any contact information.
    for(let i=0;i<4;i++){
      showStep(i);
      if(!validateStep())return;
    }
    showStep(4);
    send.disabled=true;send.textContent='Submitting…';
    message.textContent='';
    try{
      const data=new FormData(form);
      data.set('formType','preceptor-interest');
      data.set('formVersion','6');
      const response=await fetch(endpoint,{method:'POST',body:data,headers:{Accept:'application/json'}});
      if(!response.ok) throw new Error('The submission service could not accept this request.');
      // An HTTP success confirms intake service acceptance, not manual review or approval.
      message.textContent='Application received by the submission service. A team member will need to review your information before any next steps.';
      message.className='application-submit-status good';
      send.textContent='Submitted ✓';back.disabled=true;
    }catch(err){
      message.textContent='Submission failed. Your information was not confirmed as received. Please try again or contact the website operator.';
      message.className='application-submit-status error';send.disabled=false;send.textContent='Try submitting again ↗';
    }
  });
  form.addEventListener('submit',e=>e.preventDefault());
  showStep(0);
})();
