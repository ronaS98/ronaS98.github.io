var CACHE_NAME = 'latihan-pwa-cache-v1';

var urlToCache = [
    '/',
    '/css/main.css',
    '/css/util.css',
    '/images/bg-01.jpg',    
    '/images/icons/icon-google.png',
    '/images/icons/map-marker.png',
    '/images/icons/favicon.ico',
    '/js/map-custom.js',
    '/js/jquery.min.js',
    '/vendor/bootstrap/css/bootstrap.min.css',
    '/vendor/animate/animate.css',
    '/vendor/css-hamburgers/hamburgers.min.css',
    '/vendor/animsition/css/animsition.min.css',
    '/vendor/select2/select2.min.css',
    '/vendor/daterangepicker/daterangepicker.css',
    '/vendor/jquery/jquery-3.2.1.min.js',
    '/vendor/animsition/js/animsition.min.js',
    '/vendor/bootstrap/js/popper.js',
    '/vendor/bootstrap/js/bootstrap.min.js',
    '/vendor/select2/select2.min.js',
    '/vendor/daterangepicker/moment.min.js',
    '/vendor/daterangepicker/daterangepicker.js',
    '/vendor/countdowntime/countdowntime.js',
    '/manifest.json',
    '/js/main.js'
];

// install cache on browser
self.addEventListener('install', function(event){
    //do install
    event.waitUntil(
        caches.open(CACHE_NAME).then(
            function(cache){
                //cek apakah cache sudah terinstall
                console.log("service worker do install . .");
                return cache.addAll(urlToCache);
            }
        )
    );
    self.skipWaiting();
});

//aktivasi service worker
self.addEventListener('activate', function(event){
    event.waitUntil(
        caches.keys().then(function(cacheName){
            return Promise.all(
                //jika sudah ada cache dengan versi beda maka di hapus
                cacheName.filter(function(cacheName){
                    return cacheName !== CACHE_NAME;
                }).map(function(cacheName){
                    return caches.delete(cacheName);
                })
            );
        })
    );
    if(self.clients && clients.claim){
        clients.claim();
    }
});

//fetch cache
self.addEventListener('fetch', function(event){
    var request = event.request;
    var url = new URL(request.url);

    /**
     * menggunakan data local cache
     */

     if(url.origin === location.origin){
         event.respondWith(
             caches.match(request).then(function(response){
                 //jika ada data di caache, maka tampilkan data cache, jika tidak maka petch request
                 return response || fetch(request);
             })
         )
     }else{
         //internet API
         event.respondWith(
             caches.open('mahasiswa-cache-v1').then(function(cache){
                 return fetch(request).then(function(liveRequest){
                     cache.put(request, liveRequest.clone());
                     //save cache to mahasiswa-cache-v1
                     return liveRequest;
                 }).catch(function(){
                     return caches.match(request).then(function(response){
                         if(response) return response;
                         return caches.match('/fallback.json');
                     })
                 })
             })
         )
     }
});