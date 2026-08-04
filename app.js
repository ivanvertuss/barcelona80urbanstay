
const L=window.URBAN_LOCALES; const C=window.PROPERTY_CONFIG;
const $=(s)=>document.querySelector(s); const $$=(s)=>[...document.querySelectorAll(s)];
function t(k){const lang=localStorage.getItem('urbanLang')||navigator.language.slice(0,2);return (L[lang]||L.es)[k]||L.es[k]||k}
function setLang(lang){if(!L[lang])lang='es';localStorage.setItem('urbanLang',lang);document.documentElement.lang=lang;$('#languageSelect').value=lang;$$('[data-i18n]').forEach(el=>{el.textContent=(L[lang]||L.es)[el.dataset.i18n]||L.es[el.dataset.i18n]||el.dataset.i18n});document.title=`${C.short} · ${C.name} · Vigo`;}
function show(view){$$('[data-view]').forEach(x=>x.classList.toggle('hidden',x.dataset.view!==view));$$('[data-route]').forEach(a=>a.classList.toggle('active',a.dataset.route===view));location.hash=view==='home'?'':view;window.scrollTo({top:0,behavior:'smooth'});}
function init(){
 document.documentElement.style.setProperty('--navy',C.colors.navy);document.documentElement.style.setProperty('--gold',C.colors.gold);
 $$('.property-name').forEach(x=>x.textContent=C.name);$$('.property-short').forEach(x=>x.textContent=C.short);$$('.property-city').forEach(x=>x.textContent=C.city);
 $$('.property-logo').forEach(x=>x.src=C.logo);$$('.hero-photo').forEach(x=>x.src=C.hero);$('#checkin').textContent=C.checkin;$('#checkout').textContent=C.checkout;
 $('#route1').href=C.parking.zone1;$('#route2').href=C.parking.zone2;$('#coveredMap').href=C.parking.covered;$('#arrivalMap').href=C.arrival;
 $$('[data-route]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();show(a.dataset.route);$('#drawer')?.classList.add('hidden')}));
 $('#languageSelect').addEventListener('change',e=>setLang(e.target.value));$('#menuBtn').addEventListener('click',()=>$('#drawer').classList.toggle('hidden'));
 const initial=(location.hash||'#home').slice(1);show(['home','parking','homeinfo','discover','events','services','checkout'].includes(initial)?initial:'home');setLang(localStorage.getItem('urbanLang')||'es');
 if(C.plausible){const s=document.createElement('script');s.async=true;s.src=C.plausible;document.head.appendChild(s)}
 if('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js').catch(()=>{});
}
document.addEventListener('DOMContentLoaded',init);
