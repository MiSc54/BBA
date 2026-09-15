// Cache-Version erhöht (v15 -> v16), weil app.js in mehrere Module aufgeteilt
// wurde (siehe PROJECT_MAP.md). Dadurch wird sichergestellt, dass alte
// Geräte nicht eine Mischung aus altem app.js (Stand v15) und neuen
// Modul-Dateien aus dem Cache bekommen, sondern sauber auf die neue
// Struktur wechseln.
const CACHE_NAME = "bernds-body-app-v16";
const APP_SHELL = [
  "./",
  "./index.html",
  "./app.js",
  "./data/constants.js",
  "./data/equipment.js",
  "./data/exercises.js",
  "./data/icons.js",
  "./data/plans.js",
  "./storage/storage.js",
  "./storage/export.js",
  "./utils/calculations.js",
  "./utils/dates.js",
  "./styles/GlobalStyles.js",
  "./components/shared.js",
  "./components/Dashboard.js",
  "./components/EquipmentView.js",
  "./components/Exercises.js",
  "./components/PlanEditor.js",
  "./components/ActiveWorkout.js",
  "./components/Journal.js",
  "./components/Setup.js",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-maskable-512.png",
];
// Alle JavaScript-Module der App (nicht nur app.js) werden "Network First"
// behandelt: Bei jedem Laden wird zuerst versucht, die aktuelle Version vom
// Server zu holen (und der Cache aktualisiert). Nur wenn das offline fehlschlägt,
// wird die zuletzt gecachte Version verwendet. So werden Änderungen an JEDEM
// Modul (nicht mehr nur an der früheren einzelnen app.js) sofort sichtbar,
// sobald wieder eine Internetverbindung besteht.
const NETWORK_FIRST = [
  "index.html", "./", "",
  "app.js",
  "constants.js", "equipment.js", "exercises.js", "icons.js", "plans.js",
  "storage.js", "export.js",
  "calculations.js", "dates.js",
  "GlobalStyles.js",
  "shared.js", "Dashboard.js", "EquipmentView.js", "Exercises.js",
  "PlanEditor.js", "ActiveWorkout.js", "Journal.js", "Setup.js",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((names) => Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  const path = new URL(req.url).pathname.split("/").pop();
  const isNetworkFirst = NETWORK_FIRST.includes(path);

  if (isNetworkFirst) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const resClone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
          return res;
        })
        .catch(() => caches.match(req))
    );
    return;
  }

  const isAppShell = APP_SHELL.some((p) => req.url.endsWith(p.replace("./", "")));
  if (isAppShell) {
    event.respondWith(caches.match(req).then((cached) => cached || fetch(req)));
    return;
  }

  event.respondWith(
    fetch(req)
      .then((res) => {
        const resClone = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
        return res;
      })
      .catch(() => caches.match(req))
  );
});
