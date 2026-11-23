// Dukungan PWA: daftar service worker + tangkap event "pasang aplikasi".
import React from "react";

let deferredPrompt = null;
const listeners = new Set();
const notify = () => listeners.forEach((fn) => fn());

export function registerPWA() {
  if (typeof window === "undefined") return;

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault(); // tampilkan tombol sendiri, bukan banner bawaan browser
    deferredPrompt = e;
    notify();
  });
  window.addEventListener("appinstalled", () => {
    deferredPrompt = null;
    notify();
  });

  // Service worker hanya untuk build produksi (saat dev bisa bikin cache membingungkan)
  if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js").catch((err) => console.log("SW gagal didaftarkan", err));
    });
  }
}

const isStandalone = () =>
  window.matchMedia?.("(display-mode: standalone)").matches || window.navigator.standalone === true;

const isIOS = () => /iphone|ipad|ipod/i.test(window.navigator.userAgent) && !window.MSStream;

/**
 * @returns { canInstall, install, showIOSHint, installed }
 * - canInstall: Android/desktop Chrome siap dipasang lewat tombol
 * - showIOSHint: iPhone/iPad (harus lewat menu Bagikan > Tambah ke Layar Utama)
 */
export function useInstallPrompt() {
  const [, rerender] = React.useReducer((x) => x + 1, 0);
  React.useEffect(() => {
    listeners.add(rerender);
    return () => listeners.delete(rerender);
  }, []);

  const installed = isStandalone();
  const install = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice.catch(() => null);
    deferredPrompt = null;
    notify();
  };

  return {
    installed,
    canInstall: !installed && Boolean(deferredPrompt),
    showIOSHint: !installed && isIOS(),
    install,
  };
}

/** true bila perangkat sedang offline. */
export function useOnline() {
  const [online, setOnline] = React.useState(typeof navigator === "undefined" ? true : navigator.onLine);
  React.useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);
  return online;
}
