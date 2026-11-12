const CACHE="k4-v2-camera-fix-1";
const CORE=["./","./index.html","./styles.css","./app.js","./manifest.json"];
self.addEventListener("install",event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting()));
});
self.addEventListener("activate",event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(key=>key.startsWith("k4-")&&key!==CACHE).map(key=>caches.delete(key)));
    await self.clients.claim();
  })());
});
self.addEventListener("fetch",event=>{
  const request=event.request;
  if(request.method!=="GET"||new URL(request.url).origin!==self.location.origin)return;
  const path=new URL(request.url).pathname;
  const isAppFile=/\/(app\.js|index\.html|styles\.css|manifest\.json|sw\.js)$/.test(path)||path.endsWith("/");
  if(isAppFile){
    event.respondWith((async()=>{
      try{
        const response=await fetch(request,{cache:"no-store"});
        if(response.ok){const cache=await caches.open(CACHE);cache.put(request,response.clone());}
        return response;
      }catch(error){
        const cached=await caches.match(request);
        return cached||caches.match("./index.html");
      }
    })());
  }else{
    event.respondWith(caches.match(request).then(cached=>cached||fetch(request)));
  }
});