// Pemberitahuan "versi baru tersedia": membandingkan ID build aplikasi yang sedang berjalan
// dengan /version.json di server (dibuat otomatis saat build, lihat craco.config.js).
import React from "react";
import { useLocation } from "react-router-dom";
import { MdSystemUpdate, MdClose } from "react-icons/md";
import { BUILD_ID } from "../utils/appVersion";

const CURRENT = BUILD_ID;
const INTERVAL = 15 * 60 * 1000; // cek tiap 15 menit

async function cekVersiServer() {
  const res = await fetch(`/version.json?t=${Date.now()}`, { cache: "no-store" });
  if (!res.ok) return null;
  const data = await res.json();
  return data?.version ? { id: data.version, appVersion: data.appVersion } : null;
}

async function muatUlang() {
  try {
    const reg = await navigator.serviceWorker?.getRegistration?.();
    await reg?.update?.();
  } catch (e) {
    // abaikan, tetap muat ulang
  }
  window.location.reload();
}

export default function UpdateBanner() {
  const [baru, setBaru] = React.useState(null);
  const [tutup, setTutup] = React.useState(false);
  const { pathname } = useLocation();

  React.useEffect(() => {
    // hanya di build produksi
    if (process.env.NODE_ENV !== "production" || !CURRENT) return;
    let aktif = true;
    const cek = async () => {
      try {
        const versi = await cekVersiServer();
        if (aktif && versi && versi.id !== CURRENT) setBaru(versi);
      } catch (e) {
        // offline / gagal: coba lagi nanti
      }
    };
    const onVisible = () => document.visibilityState === "visible" && cek();

    cek();
    const timer = setInterval(cek, INTERVAL);
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("online", cek);
    return () => {
      aktif = false;
      clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("online", cek);
    };
  }, []);

  // Jangan ganggu santri yang sedang mengerjakan ujian
  const sedangUjian = /^\/siswa\/ujian\/[^/]+/.test(pathname);
  if (!baru || tutup || sedangUjian) return null;

  return (
    <div
      role="status"
      className="fixed left-1/2 z-[9999] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 transform"
      style={{ top: "calc(env(safe-area-inset-top) + 12px)" }}
    >
      <div className="flex items-center gap-3 rounded-xl bg-gray-900 px-4 py-3 text-white shadow-lg">
        <MdSystemUpdate className="h-6 w-6 flex-shrink-0 text-green-400" />
        <p className="m-0 flex-1 text-sm">
          Versi baru MySMK{baru.appVersion ? ` ${baru.appVersion}` : ""} tersedia.
        </p>
        <button
          type="button"
          onClick={muatUlang}
          className="min-h-[36px] rounded-lg bg-[#18a558] px-3 text-sm font-semibold text-white hover:opacity-90"
        >
          Muat ulang
        </button>
        <button
          type="button"
          aria-label="Nanti saja"
          onClick={() => setTutup(true)}
          className="flex h-9 w-9 items-center justify-center text-gray-400 hover:text-white"
        >
          <MdClose className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
