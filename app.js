const welcome=document.getElementById('welcome');document.getElementById('enterBtn')?.addEventListener('click',()=>{welcome.classList.add('is-hidden');sessionStorage.setItem('b80-entered','1')});if(sessionStorage.getItem('b80-entered'))welcome?.classList.add('is-hidden');
const drawer=document.getElementById('drawer'),scrim=document.getElementById('scrim'),menuBtn=document.getElementById('menuBtn');function setMenu(open){drawer.classList.toggle('is-open',open);scrim.classList.toggle('is-visible',open);drawer.setAttribute('aria-hidden',String(!open));menuBtn.setAttribute('aria-expanded',String(open))}menuBtn?.addEventListener('click',()=>setMenu(true));document.getElementById('closeMenu')?.addEventListener('click',()=>setMenu(false));scrim?.addEventListener('click',()=>setMenu(false));drawer?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
let deferredPrompt;
const installBtn=document.getElementById('installBtn');
const installAndroidBtn=document.getElementById('installAndroidBtn');
const androidInstallStatus=document.getElementById('androidInstallStatus');
function setInstallAvailable(available){
  if(installBtn)installBtn.hidden=!available;
  if(installAndroidBtn)installAndroidBtn.disabled=!available;
  if(androidInstallStatus)androidInstallStatus.textContent=available?'La aplicación está lista para instalarse.':'El botón se activará cuando Chrome permita la instalación.';
}
window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();deferredPrompt=event;setInstallAvailable(true)});
async function requestInstall(){
  if(!deferredPrompt){document.getElementById('instalar')?.scrollIntoView({behavior:'smooth'});return;}
  deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;setInstallAvailable(false);
}
installBtn?.addEventListener('click',requestInstall);
installAndroidBtn?.addEventListener('click',requestInstall);
window.addEventListener('appinstalled',()=>{deferredPrompt=null;setInstallAvailable(false);showToast('Aplicación instalada')});
setInstallAvailable(false);
if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));

const toast=document.getElementById('toast');let toastTimer;function showToast(message){if(!toast)return;toast.textContent=message;toast.classList.add('is-visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('is-visible'),2200)}
document.getElementById('copyWifi')?.addEventListener('click',async()=>{const password=document.getElementById('wifiPassword')?.textContent?.trim()||'';try{await navigator.clipboard.writeText(password);showToast('Contraseña copiada')}catch(e){const area=document.createElement('textarea');area.value=password;document.body.appendChild(area);area.select();document.execCommand('copy');area.remove();showToast('Contraseña copiada')}});

const iphoneHelp=document.getElementById('iphoneHelp');
function setIphoneHelp(open){iphoneHelp?.classList.toggle('is-open',open);iphoneHelp?.setAttribute('aria-hidden',String(!open));document.body.style.overflow=open?'hidden':''}
document.getElementById('showIphoneHelp')?.addEventListener('click',()=>setIphoneHelp(true));
document.getElementById('closeIphoneHelp')?.addEventListener('click',()=>setIphoneHelp(false));
iphoneHelp?.addEventListener('click',event=>{if(event.target===iphoneHelp)setIphoneHelp(false)});
document.addEventListener('keydown',event=>{if(event.key==='Escape')setIphoneHelp(false)});


const languageToggle=document.getElementById('languageToggle');
const languageMenu=document.getElementById('languageMenu');
languageToggle?.addEventListener('click',()=>{
  const open=languageMenu?.classList.toggle('is-open');
  languageToggle.setAttribute('aria-expanded',String(Boolean(open)));
});
document.addEventListener('click',event=>{
  if(!event.target.closest('.language-picker')){
    languageMenu?.classList.remove('is-open');
    languageToggle?.setAttribute('aria-expanded','false');
  }
});
