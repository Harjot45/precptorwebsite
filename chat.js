/* Explicitly rule-based, offline website help demo. Not AI or live human support. */
(() => {
 'use strict';
 const esc = v => String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const rule = input => {
  const q=String(input||'').toLowerCase();
  if(/(school|university|approve|eligib|credential|requirement|paperwork|documentation)/.test(q))return {text:'Your university decides whether a preceptor and clinical site meet its criteria. Check eligible credentials, setting, learning objectives, required hours, affiliation agreements, and deadlines before starting any rotation.',label:'School approval guide',href:'resources.html?article=school-approval'};
  if(/(cost|price|fee|refund|payment|deposit|money)/.test(q))return {text:'Placement Preceptor is currently a design concept. Pricing, deposits, refund terms and compensation have not been established. This demo does not take payment.',label:'How the process could work',href:'how-it-works.html'};
  if(/(preceptor|mentor|teach|doctor|provider|clinician|practice)/.test(q)&&/(become|join|apply|offer|teach|mentor|sign)/.test(q))return {text:'A future preceptor would describe their specialty, license, clinical setting, student capacity, and available dates. The practice and school would then review whether the experience is appropriate. Our preceptor page includes a planning tool.',label:'For preceptors',href:'for-preceptors.html'};
  if(/(find|search|location|city|near|specialty|rotation|available|schedule|date)/.test(q))return {text:'Open the Explore page and choose a location, specialty, or start month. You can save example rotations, view details and compare sample learning settings. There is no live inventory yet.',label:'Explore example rotations',href:'explore.html'};
  if(/(how|process|match|step|start|work)/.test(q))return {text:'The proposed student journey is: share your requirements, explore possible learning settings, review the fit, confirm school approval, and prepare to start. You can try the interactive steps on our How It Works page.',label:'See the five steps',href:'how-it-works.html'};
  if(/(resource|guide|learn|read)/.test(q))return {text:'The Resources library includes detailed guides on preceptor evaluation, clinical readiness, school approval, schedules, and questions to ask before a rotation.',label:'Browse resources',href:'resources.html'};
  if(/(hi|hello|hey|thank|help)/.test(q))return {text:'Hello! I can help explain rotation searches, school approvals, the matching process, preceptor participation, and the resource guides. Which topic would you like?',label:'How matching works',href:'how-it-works.html'};
  return {text:'I can explain the proposed clinical placement process, school approval requirements, rotation filters, resources, or becoming a preceptor. I am a rule-based demo assistant, so I cannot verify placements or connect you with a live coordinator.',label:'Explore the process',href:'how-it-works.html'};
 };
 const shell=document.createElement('div');shell.className='help-widget';shell.innerHTML=`<button type="button" class="help-launcher" id="help-launcher" aria-expanded="false" aria-controls="help-dialog" aria-label="Open placement help"><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="24" height="24"><path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5 9 9 0 0 1-4-.9L3 21l1.9-5.5a8.5 8.5 0 1 1 16.1-4Z"/><path d="M8 11.5h9M8 15h6"/></svg><span>Ask us</span></button>
 <section id="help-dialog" class="help-dialog" aria-label="Placement Preceptor website help" hidden><div class="help-header"><div class="help-avatar">✳</div><div><strong>Placement guide</strong><small><span class="help-online-dot"></span> Instant demo answers · Not live chat</small></div><button type="button" id="help-close" aria-label="Close help">×</button></div><div id="help-messages" class="help-messages" role="log" aria-live="polite" aria-relevant="additions"></div><div class="help-chips" id="help-chips"><button type="button" data-quick="How do I find a rotation?">Find a rotation</button><button type="button" data-quick="Does my school have to approve?">School approval</button><button type="button" data-quick="How to become a preceptor?">Become a preceptor</button><button type="button" data-quick="What are the costs?">Costs</button></div><form id="help-form"><label class="help-sr-only" for="help-input">Ask a question</label><input id="help-input" autocomplete="off" placeholder="Ask about rotations…" maxlength="350" required><button type="submit" aria-label="Send question">➤</button></form><p class="help-privacy">Demo guide only · No AI API · Messages stay in this page</p></section>`;
 document.body.append(shell);
 const $=sel=>shell.querySelector(sel),box=$('#help-dialog'),history=$('#help-messages'),launch=$('#help-launcher');
 let opened=false, greeted=false, previousFocus=null;
 function add(role,text,link){
  const d=document.createElement('div');d.className='help-bubble '+role;
  const p=document.createElement('p');p.textContent=text;d.append(p);
  if(link){const a=document.createElement('a');a.href=link.href;a.textContent=link.label+' ↗';d.append(a);}
  history.append(d);history.scrollTop=history.scrollHeight;
 }
 function toggle(force){opened=force??!opened;box.hidden=!opened;launch.setAttribute('aria-expanded',String(opened));launch.classList.toggle('is-open',opened);
  if(opened){previousFocus=document.activeElement;if(!greeted){add('bot','Hi! I’m the Placement Preceptor website guide. I can answer common questions about this concept and show you where to find information.');greeted=true;}$('#help-input').focus();}
  else { (previousFocus?.isConnected?previousFocus:launch).focus(); }
 }
 function send(input){const msg=String(input||'').trim();if(!msg)return;add('user',msg);const out=rule(msg);add('bot',out.text,{label:out.label,href:out.href});}
 launch.addEventListener('click',()=>toggle());$('#help-close').addEventListener('click',()=>toggle(false));
 $('#help-form').addEventListener('submit',e=>{e.preventDefault();const input=$('#help-input'),msg=input.value;input.value='';send(msg);input.focus();});
 $('#help-chips').addEventListener('click',e=>{const b=e.target.closest('[data-quick]');if(b)send(b.dataset.quick);});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&opened&&!(document.querySelector('#modal')?.open))toggle(false)});
})();
