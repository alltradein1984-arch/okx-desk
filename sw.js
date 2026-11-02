// OKX Desk service worker: shows push alerts from the box and opens the app on tap (only URLs inside this app).
const SCOPE = self.registration.scope;
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));
self.addEventListener("push", e => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (err) { d = {}; }
  e.waitUntil(self.registration.showNotification(String(d.t || "OKX Desk").slice(0, 80), {
    body: String(d.b || "").slice(0, 200), tag: d.g ? String(d.g).slice(0, 64) : undefined, renotify: !!d.g,
    icon: "icon-192.png", badge: "icon-192.png", data: {u: d.u}
  }));
});
self.addEventListener("notificationclick", e => {
  e.notification.close();
  let target = SCOPE;
  try { const u = new URL(e.notification.data && e.notification.data.u); if (u.protocol === "https:" && u.href.startsWith(SCOPE)) target = u.href; } catch (err) {}
  e.waitUntil(self.clients.matchAll({type: "window"}).then(ws => { for (const w of ws) if (w.url.startsWith(SCOPE)) return w.focus(); return self.clients.openWindow(target); }));
});
