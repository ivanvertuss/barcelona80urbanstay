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

// Urban Stay · actualización de agenda y usabilidad del menú lateral · 21/08/2026
if(drawer){
  drawer.style.overflowY='auto';
  drawer.style.overscrollBehavior='contain';
  drawer.style.webkitOverflowScrolling='touch';
  drawer.style.maxHeight='100dvh';
  drawer.style.paddingBottom='32px';
}

const eventsSection=document.getElementById('eventos');
if(eventsSection){
  eventsSection.innerHTML=`
<div class="section-heading">
  <span class="eyebrow">AGENDA ACTUALIZADA · AGOSTO / SEPTIEMBRE 2026</span>
  <h2>Próximos eventos en Vigo.</h2>
  <p>Una selección de fiestas, cultura, gastronomía y espectáculos próximos. Pulsa cada tarjeta para consultar la información oficial.</p>
</div>
<div class="events-grid events-grid--upcoming">
  <a class="event-card event-card--featured" href="https://hoxe.vigo.org/conecenos/f_agosto.php?lang=es" rel="noopener" target="_blank"><span class="event-date"><b>18–24</b><small>AGO</small></span><div><strong>Romería de la Virgen del Alba</strong><small>Monte Alba · celebración popular</small></div><em>Consultar fiestas</em></a>
  <a class="event-card" href="https://hoxe.vigo.org/conecenos/f_agosto.php?lang=es" rel="noopener" target="_blank"><span class="event-date"><b>22–23</b><small>AGO</small></span><div><strong>Fiesta del Rosario</strong><small>Lavadores · fiestas populares</small></div><em>Consultar fiestas</em></a>
  <a class="event-card" href="https://hoxe.vigo.org/conecenos/f_agosto.php?lang=es" rel="noopener" target="_blank"><span class="event-date"><b>30</b><small>AGO</small></span><div><strong>Fiestas de San Campio</strong><small>Valadares · último domingo de agosto</small></div><em>Consultar fiestas</em></a>
  <a class="event-card" href="https://hoxe.vigo.org/?lang=es" rel="noopener" target="_blank"><span class="event-date"><b>HASTA 06</b><small>SEP</small></span><div><strong>Artistas en construcción</strong><small>MARCO · exposición</small></div><em>Ver agenda oficial</em></a>
  <a class="event-card" href="https://hoxe.vigo.org/conecenos/f_septiembre.php?lang=es" rel="noopener" target="_blank"><span class="event-date"><b>07–09</b><small>SEP</small></span><div><strong>V Jornadas Gastronómicas y Marisqueras</strong><small>Berbés · gastronomía y marisco</small></div><em>Consultar fiestas</em></a>
  <a class="event-card" href="https://www.turismodevigo.org/es/agenda?date=2026-09&page=0%2C1" rel="noopener" target="_blank"><span class="event-date"><b>19</b><small>SEP</small></span><div><strong>Luis Piedrahita</strong><small>Apocalípticamente correcto</small></div><em>Ver agenda</em></a>
  <a class="event-card" href="https://hoxe.vigo.org/?lang=es" rel="noopener" target="_blank"><span class="event-date"><b>HASTA 20</b><small>SEP</small></span><div><strong>Laxeiro, as viñetas que non foron ao prelo</strong><small>Exposición cultural</small></div><em>Ver agenda oficial</em></a>
  <a class="event-card" href="https://www.turismodevigo.org/es/agenda?date=2026-09&page=0%2C1" rel="noopener" target="_blank"><span class="event-date"><b>26</b><small>SEP</small></span><div><strong>Escándalo en Redacción</strong><small>Espectáculo en Vigo</small></div><em>Ver agenda</em></a>
  <a class="event-card" href="https://hoxe.vigo.org/conecenos/f_septiembre.php?lang=es" rel="noopener" target="_blank"><span class="event-date"><b>27–29</b><small>SEP</small></span><div><strong>Fiestas de San Miguel de Oia</strong><small>Oia · fiestas populares</small></div><em>Consultar fiestas</em></a>
</div>
<p class="events-note">Agenda revisada el 21 de agosto de 2026. Los eventos ya finalizados se han retirado. Los programas y horarios pueden cambiar; consulta siempre la información oficial antes de desplazarte.</p>`;
}
