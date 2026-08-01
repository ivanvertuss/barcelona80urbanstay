const CACHE='b80-urbanstay-v6.0';
const CORE=['./','./index.html','./styles.css?v=6.0','./app.js','./data.js','./parking.html','./parking.css','./parking.js'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).catch(()=>{}))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{if(e.request.mode==='navigate'){e.respondWith(fetch(e.request).then(r=>{const x=r.clone();caches.open(CACHE).then(c=>c.put(e.request,x));return r}).catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html'))));return;}e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(n=>{const x=n.clone();caches.open(CACHE).then(c=>c.put(e.request,x));return n}))) });
