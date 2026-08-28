// Опциональный service worker для «Клинок и Тень».
// Работает только если игра размещена на хостинге по HTTPS — при открытии
// локального файла (file://) браузер его игнорирует, это нормально.
//
// Как использовать: положи этот файл рядом с klinok-i-ten.html на хостинге
// (в той же папке). Игра сама подключит его при загрузке по HTTPS —
// ничего больше делать не нужно.

var CACHE_NAME = 'klinok-i-ten-v1';
var CACHE_URLS = ['./', './klinok-i-ten.html'];

self.addEventListener('install', function(event){
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache){
      return cache.addAll(CACHE_URLS).catch(function(){});
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(event){
  event.waitUntil(
    caches.keys().then(function(names){
      return Promise.all(names.filter(function(n){ return n!==CACHE_NAME; }).map(function(n){ return caches.delete(n); }));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(event){
  event.respondWith(
    fetch(event.request).then(function(response){
      var copy = response.clone();
      caches.open(CACHE_NAME).then(function(cache){ cache.put(event.request, copy); });
      return response;
    }).catch(function(){
      return caches.match(event.request);
    })
  );
});
