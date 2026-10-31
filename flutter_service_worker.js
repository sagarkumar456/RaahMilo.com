// Dummy placeholder to safely satisfy and deactivate old cached Flutter service workers
self.addEventListener('install', () => {
  self.skipWaiting();
});
self.addEventListener('activate', () => {
  self.registration.unregister();
});

