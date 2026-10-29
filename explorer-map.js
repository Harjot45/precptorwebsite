/* Placement Preceptor v4. Approximate city-centre demonstration pins, never actual clinics. */
(() => {
  'use strict';
  if (document.body.dataset.page !== 'explore') return;
  const $ = s => document.querySelector(s);
  const esc = value => String(value ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const all = window.PP.rotations;
  let current=all.slice(), areaActive=false, map=null, markers=new Map(), selected=null, usingFallback=false, erroredTiles=0;
  function coords(r, idx=0) {
    // A small visual offset helps distinct demo markers occupying the same city center.
    const peers=all.filter(x=>x.city===r.city && x.state===r.state);
    const n=peers.findIndex(x=>x.id===r.id);
    const angle=n*Math.PI*2/Math.max(3,peers.length);
    const offset=peers.length>1?.045:0;
    return [r.lat + Math.sin(angle)*offset, r.lng + Math.cos(angle)*offset];
  }
  function popupHTML(r) {
    return `<div class="map-popup"><span>ILLUSTRATIVE · ${esc(r.code)}</span><h3>${esc(r.title)}</h3><p>${esc(r.specialty)}</p><small>⌖ ${esc(r.city)}, ${esc(r.state)} · ${esc(r.hours)} example hours</small><button data-detail="${esc(r.id)}" type="button">Explore example details ↗</button></div>`;
  }
  function selectCard(id, scroll=true){
    selected=id;
    document.querySelectorAll('[data-rotation-card]').forEach(el=>el.classList.toggle('map-highlight',el.dataset.rotationCard===id));
    const card=document.querySelector(`[data-rotation-card="${CSS.escape(id)}"]`);
    if(card && scroll){card.scrollIntoView({block:'nearest',behavior:'smooth'});}
    for(const [key, pin] of markers) pin.getElement()?.classList.toggle('pin-selected',key===id);
  }
  function showLocation(id){
    const r=all.find(x=>x.id===id);if(!r)return;
    selectCard(id,false);
    if(map){map.setView(coords(r),Math.max(11,map.getZoom()),{animate:true});markers.get(id)?.openPopup();}
    else if(usingFallback){$(`[data-fallback-pin="${id}"]`)?.focus();}
    // Return from mobile map tab when navigating back to a list card.
    if(window.innerWidth<=850)showTab('map');
  }
  function updateMap(rows){
    current=rows;
    $('#map-results-hint').textContent=`${rows.length} example ${rows.length===1?'location':'locations'} · City centers, not clinic addresses`;
    if(usingFallback) return fallbackPins();
    if(!map)return;
    for(const pin of markers.values())map.removeLayer(pin);
    markers.clear();
    for(const r of rows){
      if(typeof r.lat!=='number')continue;
      const pin=window.L.marker(coords(r),{	itle:`Example: ${r.title}, ${r.city}`,alt:`Fictional ${r.specialty} option in ${r.city}`,keyboard:true,icon:window.L.divIcon({className:'map-icon-wrap',html:'<span class="demo-map-pin"><span></span></span>',iconSize:[33,43],iconAnchor:[16,40],popupAnchor:[0,-35]})});
      pin.bindPopup(popupHTML(r),{maxWidth:275,closeButton:true,autoPan:true});
      pin.on('click',()=>selectCard(r.id));pin.addTo(map);markers.set(r.id,pin);
    }
    if(!areaActive && rows.length && rows.length<all.length) fitResults();
  }
  function fitResults(){
    if(!map || !current.length)return;
    const ll=current.filter(r=>typeof r.lat==='number').map(r=>coords(r));
    if(!ll.length)return;
    if(ll.length===1){map.setView(ll[0],11);}else map.fitBounds(window.L.latLngBounds(ll).pad(.16),{maxZoom:11,animate:true});
  }
  function resetArea(){document.dispatchEvent(new CustomEvent('pp:clear-area'));if(map){map.setView([38.2,-95.4],4,{animate:true});} }
  function searchArea(){
    if(!map){$('#map-search-area').textContent='Map connection required';return;}
    const b=map.getBounds();
    document.dispatchEvent(new CustomEvent('pp:search-area',{detail:{bounds:{south:b.getSouth(),west:b.getWest(),north:b.getNorth(),east:b.getEast()}}}));
    $('#map-search-area').textContent='✓ Area applied';setTimeout(()=>{$('#map-search-area').textContent='⌖ Search this area'},1300);
  }
  function fallbackPins(){
    const host=$('#fallback-pins');host.innerHTML='';
    for(const r of current){
      const xy=coords(r),left=Math.max(6,Math.min(94,(xy[1]+125)/59*100)),top=Math.max(12,Math.min(87,(50-xy[0])/26*100));
      const el=document.createElement('button');el.type='button';el.className='fallback-pin';el.dataset.fallbackPin=r.id;
      el.style.left=left+'%';el.style.top=top+'%';el.title=`${r.city} - ${r.specialty}`;el.setAttribute('aria-label',`Show example rotation in ${r.city}: ${r.title}`);el.textContent='⌖';
      el.addEventListener('click',()=>selectCard(r.id));host.append(el);
    }
  }
  function showFallback(){
    if(usingFallback)return;usingFallback=true;
    $('#rotation-map').hidden=true;$('#map-fallback').hidden=false;
    $('#map-search-area').disabled=true;$('#map-fit-results').disabled=true;
    fallbackPins();
  }
  function setupMap(){
    if(typeof window.L==='undefined'){showFallback();return;}
    try{
      map=window.L.map('rotation-map',{zoomControl:false,scrollWheelZoom:false,attributionControl:true,preferCanvas:true}).setView([38.2,-95.4],4);
      window.L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',{
        attribution:'&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions" target="_blank" rel="noopener">CARTO</a>',
        subdomains:'abcd',maxZoom:19
      }).on('tileerror',()=>{erroredTiles++;if(erroredTiles>5)showFallback();}).addTo(map);
      window.L.control.zoom({position:'bottomright'}).addTo(map);
      updateMap(current);
      const observer=new ResizeObserver(()=>map?.invalidateSize());observer.observe($('#rotation-map'));
    }catch(err){console.warn('Map failed to initialize',err);showFallback();}
  }
  function showTab(tab){
    const isMap=tab==='map';
    document.body.classList.toggle('mobile-map-active',isMap);
    $('#show-map-mobile').classList.toggle('active',isMap);
    $('#show-results-mobile').classList.toggle('active',!isMap);
    $('#show-map-mobile').setAttribute('aria-pressed',String(isMap));
    $('#show-results-mobile').setAttribute('aria-pressed',String(!isMap));
    setTimeout(()=>map?.invalidateSize(),100);
  }
  $('#map-search-area').addEventListener('click',searchArea);
  $('#map-fit-results').addEventListener('click',fitResults);
  $('#map-reset').addEventListener('click',resetArea);
  $('#show-map-mobile').addEventListener('click',()=>showTab('map'));
  $('#show-results-mobile').addEventListener('click',()=>showTab('results'));
  document.addEventListener('pp:focus-map',e=>showLocation(e.detail.id));
  document.addEventListener('pp:results-changed',e=>{areaActive=e.detail.areaActive;updateMap(e.detail.rows);});
  // Initial state reflects URL-provided filters even though app.js has already rendered.
  const filters={specialty:$('#filter-specialty').value,location:$('#filter-location').value,code:$('#filter-code').value,month:$('#filter-month').value,setting:$('#filter-setting').value,savedOnly:$('#saved-only').checked,saved:[],sort:$('#sort').value};
  current=window.PP.lastExplorerRows || window.PP.filterRotations(all,filters).filter(r=>r.hours>=Number($('#filter-hours').value||0));
  setupMap();
})();
