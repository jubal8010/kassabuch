// Offline-Cache: die App läuft nach dem ersten Öffnen ohne Internet. Deine Daten liegen nicht hier, sondern im Gerätespeicher.
const C='kassabuch-v77',FILES=['./','index.html','jspdf.umd.min.js','manifest.webmanifest','icon-192.png','icon-512.png','apple-touch-icon.png','fonts/instrument-sans.woff2'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(FILES)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C&&x.startsWith('kassabuch-')).map(x=>caches.delete(x)))));self.clients.claim()});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;
  const u=new URL(e.request.url),own=u.origin===location.origin;
  // Update-Prüfung (index.html?u=…) nie zwischenspeichern – sonst wächst der Cache mit jeder Prüfung
  const keep=!(own&&u.searchParams.has('u'));
  e.respondWith(fetch(e.request).then(r=>{if(keep&&(r.ok||r.type==='opaque')){const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp))}return r})
    .catch(()=>caches.match(e.request,{ignoreSearch:true})))});
