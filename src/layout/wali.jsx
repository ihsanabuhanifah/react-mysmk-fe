// Layout area Wali Santri (mobile-first, siap PWA):
// - HP: header ringkas + navigasi bawah (bottom nav) + menu lengkap di panel geser
// - Desktop: sidebar tetap di kiri
import React from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { MdClose, MdLogout, MdMoreHoriz, MdWifiOff, MdGetApp, MdIosShare } from "react-icons/md";
import {
  IoStatsChart,
  IoCalendarOutline,
  IoBookOutline,
  IoSchoolOutline,
  IoRibbonOutline,
  IoHomeOutline,
  IoCarOutline,
  IoMegaphoneOutline,
  IoPersonOutline,
} from "react-icons/io5";
import LogoMySMK from "../image/MySMK.png";
import { ModalLogout } from "../components";
import { useProfileWali } from "../api/wali";
import { useInstallPrompt, useOnline } from "../pwa";
import { VERSION_TEXT } from "../utils/appVersion";

export const WALI_MENU = [
  { to: "dashboard", title: "Beranda", icon: IoStatsChart },
  { to: "kehadiran", title: "Kehadiran", icon: IoCalendarOutline },
  { to: "halaqoh", title: "Halaqoh", icon: IoBookOutline },
  { to: "nilai", title: "Nilai & Rapor", icon: IoSchoolOutline },
  { to: "catatan", title: "Pelanggaran & Prestasi", icon: IoRibbonOutline },
  { to: "kunjungan", title: "Izin Kunjungan", icon: IoHomeOutline },
  { to: "pulang", title: "Izin Pulang", icon: IoCarOutline },
  { to: "pengumuman", title: "Pengumuman", icon: IoMegaphoneOutline },
  { to: "profil", title: "Profil", icon: IoPersonOutline },
];

// 4 menu utama di navigasi bawah HP (+ tombol "Lainnya")
const BOTTOM_NAV = [
  { to: "dashboard", title: "Beranda", icon: IoStatsChart },
  { to: "kehadiran", title: "Kehadiran", icon: IoCalendarOutline },
  { to: "nilai", title: "Nilai", icon: IoSchoolOutline },
  { to: "kunjungan", title: "Izin", icon: IoHomeOutline },
];

const SAFE_BOTTOM = { paddingBottom: "env(safe-area-inset-bottom)" };
const SAFE_TOP = { paddingTop: "env(safe-area-inset-top)" };

function SidebarWali({ onNavigate, onLogout }) {
  const { data: profile } = useProfileWali();
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-20 items-center px-5">
        <img src={LogoMySMK} alt="MySMK" className="max-h-10" />
      </div>

      <div className="mx-3 mb-4 rounded-lg bg-[#18a558] p-3 text-white">
        <p className="m-0 text-xs text-white/80">Wali dari</p>
        <p className="m-0 truncate text-sm font-black">{profile?.nama_siswa || "-"}</p>
      </div>

      <nav id="scrollbar" className="flex-1 space-y-1 overflow-auto px-3 pb-6">
        {WALI_MENU.map(({ to, title, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex min-h-[44px] items-center gap-3 rounded-lg px-3 py-2.5 font-poppins text-sm transition-colors ${
                isActive ? "bg-green-50 font-black text-[#18a558]" : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              }`
            }
          >
            <Icon className="h-5 w-5 flex-shrink-0" />
            <span>{title}</span>
          </NavLink>
        ))}
      </nav>

      <div className="border-t px-3 py-4" style={SAFE_BOTTOM}>
        <InstallButton />
        <button
          type="button"
          onClick={onLogout}
          className="flex min-h-[44px] w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-500 hover:bg-red-50 hover:text-red-600"
        >
          <MdLogout className="h-5 w-5" />
          <span>Keluar</span>
        </button>
        <p className="m-0 mt-2 px-3 text-[11px] text-gray-400">MySMK · {VERSION_TEXT}</p>
      </div>
    </div>
  );
}

/** Tombol "Pasang aplikasi" (Android/desktop) atau petunjuk untuk iPhone. */
function InstallButton() {
  const { canInstall, showIOSHint, install } = useInstallPrompt();
  const [hint, setHint] = React.useState(false);
  if (!canInstall && !showIOSHint) return null;
  return (
    <div className="mb-2">
      <button
        type="button"
        onClick={() => (canInstall ? install() : setHint((v) => !v))}
        className="flex min-h-[44px] w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-[#18a558] hover:bg-green-50"
      >
        <MdGetApp className="h-5 w-5" />
        <span>Pasang aplikasi</span>
      </button>
      {hint && (
        <p className="m-0 mt-1 rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-600">
          Di iPhone/iPad: ketuk <MdIosShare className="inline h-4 w-4 align-text-bottom" /> <b>Bagikan</b> di Safari, lalu pilih{" "}
          <b>Tambah ke Layar Utama</b>.
        </p>
      )}
    </div>
  );
}

function BottomNav({ onMore, moreActive }) {
  return (
    <nav className="flex-shrink-0 border-t bg-white xl:hidden" style={SAFE_BOTTOM} aria-label="Menu utama">
      <div className="grid grid-cols-5">
        {BOTTOM_NAV.map(({ to, title, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex min-h-[56px] flex-col items-center justify-center gap-0.5 text-[11px] font-semibold ${
                isActive ? "text-[#18a558]" : "text-gray-400"
              }`
            }
          >
            <Icon className="h-6 w-6" />
            <span>{title}</span>
          </NavLink>
        ))}
        <button
          type="button"
          onClick={onMore}
          className={`flex min-h-[56px] flex-col items-center justify-center gap-0.5 text-[11px] font-semibold ${
            moreActive ? "text-[#18a558]" : "text-gray-400"
          }`}
        >
          <MdMoreHoriz className="h-6 w-6" />
          <span>Lainnya</span>
        </button>
      </div>
    </nav>
  );
}

export default function LayoutWali() {
  const [open, setOpen] = React.useState(false);
  const [logout, setLogout] = React.useState(false);
  const { pathname } = useLocation();
  const online = useOnline();
  const mainRef = React.useRef(null);

  React.useEffect(() => {
    document.title = "MySMK - Wali Santri";
  }, []);

  // pindah halaman: tutup menu & kembali ke atas
  React.useEffect(() => {
    setOpen(false);
    mainRef.current?.scrollTo?.(0, 0);
  }, [pathname]);

  const halaman = pathname.split("/")[2];
  const moreActive = !BOTTOM_NAV.some((m) => m.to === halaman);

  return (
    // 100dvh = tinggi layar HP sebenarnya (tidak tertutup bar browser); h-screen sebagai cadangan
    <div className="flex h-screen overflow-hidden bg-gray-50 text-gray-700 antialiased" style={{ height: "100dvh" }}>
      <ModalLogout open={logout} setOpen={setLogout} />

      {/* Sidebar desktop */}
      <aside className="hidden w-64 flex-shrink-0 border-r bg-white xl:block">
        <SidebarWali onLogout={() => setLogout(true)} />
      </aside>

      {/* Menu lengkap (HP) */}
      {open && (
        <div className="fixed inset-0 z-40 xl:hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <aside className="absolute bottom-0 left-0 top-0 w-72 max-w-[85%] bg-white shadow-xl" style={SAFE_TOP}>
            <button
              type="button"
              aria-label="Tutup menu"
              onClick={() => setOpen(false)}
              className="absolute right-2 top-4 flex h-11 w-11 items-center justify-center text-gray-500"
              style={SAFE_TOP}
            >
              <MdClose className="h-7 w-7" />
            </button>
            <SidebarWali onNavigate={() => setOpen(false)} onLogout={() => setLogout(true)} />
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex-shrink-0 border-b bg-white xl:hidden" style={SAFE_TOP}>
          <div className="flex h-14 items-center justify-between px-4">
            <img src={LogoMySMK} alt="MySMK" className="max-h-8" />
            <span className="text-xs font-semibold text-gray-400">Wali Santri</span>
          </div>
        </header>

        {!online && (
          <div className="flex flex-shrink-0 items-center gap-2 bg-yellow-50 px-4 py-2 text-xs font-semibold text-yellow-800">
            <MdWifiOff className="h-4 w-4" />
            Anda sedang offline. Data terbaru akan dimuat saat koneksi kembali.
          </div>
        )}

        <main ref={mainRef} id="scrollbar" className="flex-1 overflow-auto">
          <Outlet />
        </main>

        <BottomNav onMore={() => setOpen(true)} moreActive={moreActive} />
      </div>
    </div>
  );
}

/** Kerangka standar halaman wali: judul + isi. */
export function WaliPage({ title, subtitle, actions, children }) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-5 lg:px-8 lg:py-8">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <h1 className="m-0 font-poppins text-xl font-bold lg:text-2xl">{title}</h1>
          {subtitle && <p className="m-0 mt-1 text-sm text-gray-500">{subtitle}</p>}
        </div>
        {actions}
      </div>
      {children}
    </div>
  );
}
