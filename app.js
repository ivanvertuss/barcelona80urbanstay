const welcome=document.getElementById('welcome');document.getElementById('enterBtn')?.addEventListener('click',()=>{welcome.classList.add('is-hidden');sessionStorage.setItem('b80-entered','1')});if(sessionStorage.getItem('b80-entered'))welcome?.classList.add('is-hidden');
const drawer=document.getElementById('drawer'),scrim=document.getElementById('scrim'),menuBtn=document.getElementById('menuBtn');function setMenu(open){drawer.classList.toggle('is-open',open);scrim.classList.toggle('is-visible',open);drawer.setAttribute('aria-hidden',String(!open));menuBtn.setAttribute('aria-expanded',String(open))}menuBtn?.addEventListener('click',()=>setMenu(true));document.getElementById('closeMenu')?.addEventListener('click',()=>setMenu(false));scrim?.addEventListener('click',()=>setMenu(false));drawer?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
let deferredPrompt;const installBtn=document.getElementById('installBtn');window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredPrompt=e;installBtn.hidden=false});installBtn?.addEventListener('click',async()=>{if(!deferredPrompt)return;deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;installBtn.hidden=true});
if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));

const toast=document.getElementById('toast');let toastTimer;function showToast(message){if(!toast)return;toast.textContent=message;toast.classList.add('is-visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('is-visible'),2200)}
document.getElementById('copyWifi')?.addEventListener('click',async()=>{const password=document.getElementById('wifiPassword')?.textContent?.trim()||'';try{await navigator.clipboard.writeText(password);showToast('Contraseña copiada')}catch(e){const area=document.createElement('textarea');area.value=password;document.body.appendChild(area);area.select();document.execCommand('copy');area.remove();showToast('Contraseña copiada')}});


// v4.0 multilingual interface
const b80Select=document.getElementById('languageSelect');
const b80Original=new WeakMap();
function b80Translate(lang){
  document.documentElement.lang=lang;
  localStorage.setItem('b80-language',lang);
  const dict=(window.B80_TRANSLATIONS||{})[lang]||{};
  const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,{acceptNode(n){return n.parentElement&& !['SCRIPT','STYLE','OPTION'].includes(n.parentElement.tagName)&&n.nodeValue.trim()?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT}});
  const nodes=[]; while(walker.nextNode())nodes.push(walker.currentNode);
  nodes.forEach(n=>{if(!b80Original.has(n))b80Original.set(n,n.nodeValue);const original=b80Original.get(n);const lead=original.match(/^\s*/)[0],trail=original.match(/\s*$/)[0],key=original.trim();n.nodeValue=lead+(lang==='es'?key:(dict[key]||key))+trail});
  document.querySelectorAll('[placeholder]').forEach(el=>{if(!el.dataset.originalPlaceholder)el.dataset.originalPlaceholder=el.placeholder;const key=el.dataset.originalPlaceholder;el.placeholder=lang==='es'?key:(dict[key]||key)});
  if(b80Select)b80Select.value=lang;
}
b80Select?.addEventListener('change',e=>b80Translate(e.target.value));
window.addEventListener('DOMContentLoaded',()=>b80Translate(localStorage.getItem('b80-language')||'es'));
