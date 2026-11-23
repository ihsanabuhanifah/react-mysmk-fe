import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { formatTahun } from "../../utils";
import {
  MdClose,
  MdLogout,
  MdOutlineDashboard,
  MdMonitor,
  MdClass,
  MdGroups,
  MdEventAvailable,
  MdMenuBook,
  MdHowToReg,
  MdFingerprint,
  MdQuiz,
  MdAssignment,
  MdToday,
  MdTimer,
  MdInsights,
  MdMosque,
  MdGavel,
  MdEmojiEvents,
  MdDirectionsWalk,
  MdFamilyRestroom,
  MdBusinessCenter,
  MdAssignmentInd,
  MdUploadFile,
  MdSchool,
  MdBadge,
  MdTune,
  MdHistory,
} from "react-icons/md";
import { checkRole } from "../../utils";
import LogoMySMK from "../../image/MySMK.png";
import { ModalLogout } from "../../components";
import useList from "../../hook/useList";

export default function SidebarGuru({ setSidebar }) {
  let date = new Date();
  const { roles } = useList();
  const { pathname } = useLocation();
  const url = pathname.split("/")[2];
  const [open, setOpen] = React.useState(false);

  const handleSidebar = () => setSidebar(false);

  const GURU = ["Guru"];
  const ADMIN = ["Admin", "Super Administrator"];
  const ic = "h-5 w-5";

  // path = segmen pertama URL setelah /guru/ (dipakai untuk menandai menu aktif)
  const navigationItems = [
    {
      category: "Utama",
      items: [
        { to: "dashboard", path: "dashboard", title: "Dashboard", icon: <MdOutlineDashboard className={ic} />, roles: GURU },
      ],
    },
    {
      category: "Kelas & Santri",
      items: [
        { to: "halaqoh-siswa", path: "halaqoh-siswa", title: "Daftar Halaqoh", icon: <MdGroups className={ic} />, roles: GURU },
        { to: "monitor/harian", path: "monitor", title: "Monitor KBM", icon: <MdMonitor className={ic} />, roles: GURU },
      ],
    },
    {
      category: "Absensi",
      items: [
        { to: "absensi", path: "absensi", title: "Absensi KBM", icon: <MdEventAvailable className={ic} />, roles: GURU },
        { to: `halaqoh/absensi/${formatTahun(date)}`, path: "halaqoh", title: "Absensi Halaqoh", icon: <MdMenuBook className={ic} />, roles: GURU },
        { to: "pengampu/halaqoh/absensi", path: "pengampu", title: "Absensi Pengampu", icon: <MdHowToReg className={ic} />, roles: GURU },
        { to: "kehadiran-guru", path: "kehadiran-guru", title: "Absensi Guru", icon: <MdFingerprint className={ic} />, roles: GURU },
      ],
    },
    {
      category: "Ujian & Penilaian",
      items: [
        { to: "bank-soal", path: "bank-soal", title: "Bank Soal", icon: <MdQuiz className={ic} />, roles: GURU },
        { to: "exam", path: "exam", title: "Assesmen", icon: <MdAssignment className={ic} />, roles: GURU },
        { to: "ujian-hari-ini", path: "ujian-hari-ini", title: "Ujian Hari Ini", icon: <MdToday className={ic} />, roles: GURU },
        { to: "ujian-berjalan", path: "ujian-berjalan", title: "Ujian Berjalan", icon: <MdTimer className={ic} />, roles: GURU },
        { to: "hasil-belajar", path: "hasil-belajar", title: "Hasil Belajar", icon: <MdInsights className={ic} />, roles: GURU },
      ],
    },
    {
      category: "Kesantrian",
      items: [
        { to: "sholat", path: "sholat", title: "Sholat", icon: <MdMosque className={ic} />, roles: GURU },
        { to: "pelanggaran", path: "pelanggaran", title: "Pelanggaran", icon: <MdGavel className={ic} />, roles: GURU },
        { to: "prestasi", path: "prestasi", title: "Prestasi", icon: <MdEmojiEvents className={ic} />, roles: GURU },
      ],
    },
    {
      category: "Perizinan",
      items: [
        { to: "perizinan-pulang", path: "perizinan-pulang", title: "Izin Pulang", icon: <MdDirectionsWalk className={ic} />, roles: GURU },
        { to: "perizinan-kunjungan", path: "perizinan-kunjungan", title: "Kunjungan", icon: <MdFamilyRestroom className={ic} />, roles: GURU },
      ],
    },
    {
      category: "PKL & Laporan",
      items: [
        { to: "fitur-siswa-pkl", path: "fitur-siswa-pkl", title: "Siswa PKL", icon: <MdBusinessCenter className={ic} />, roles: GURU },
        { to: "laporan-guru-piket", path: "laporan-guru-piket", title: "Laporan Guru Piket", icon: <MdAssignmentInd className={ic} />, roles: GURU },
      ],
    },
    {
      category: "Administrasi",
      items: [
        { to: "daftar-siswa", path: "daftar-siswa", title: "Daftar Kelas", icon: <MdClass className={ic} />, roles: GURU },
        { to: "daftar-alumni", path: "daftar-alumni", title: "Daftar Alumni", icon: <MdSchool className={ic} />, roles: GURU },
        { to: "daftar-guru", path: "daftar-guru", title: "Daftar Guru", icon: <MdBadge className={ic} />, roles: GURU },
        { to: "data-master", path: "data-master", title: "Data Master", icon: <MdTune className={ic} />, roles: ADMIN },
        { to: "import-data", path: "import-data", title: "Import Data", icon: <MdUploadFile className={ic} />, roles: ADMIN },
        { to: "audit-log", path: "audit-log", title: "Audit Log", icon: <MdHistory className={ic} />, roles: ADMIN },
      ],
    },
  ];

  const canSee = (item) => item.roles.some((r) => checkRole(roles, r));
  const visibleSections = navigationItems
    .map((section) => ({ ...section, items: section.items.filter(canSee) }))
    .filter((section) => section.items.length > 0);

  return (
    <div className="flex h-full flex-col bg-white shadow-lg">
      <ModalLogout open={open} setOpen={setOpen} />

      {/* Mobile Header */}
      <div className="flex items-center justify-between border-b p-4 lg:hidden">
        <img className="h-10 object-contain" src={LogoMySMK} alt="MySMK Logo" />
        <button
          onClick={handleSidebar}
          className="rounded-full p-2 text-gray-600 hover:bg-gray-100"
        >
          <MdClose className="h-6 w-6" />
        </button>
      </div>

      {/* Desktop Logo */}
      <div className="hidden items-center justify-center border-b p-4 lg:flex">
        <img className="h-14 object-contain" src={LogoMySMK} alt="MySMK Logo" />
      </div>

      {/* Navigation - Scrollable Area */}
      <div id="scrollbar" className="flex-1 overflow-y-auto ">
        <nav className="px-2 py-4">
          {visibleSections.map((section) => (
            <div key={section.category} className="mb-4">
              <h3 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                {section.category}
              </h3>
              <div className="space-y-1 whitespace-nowrap">
                {section.items.map((item) => (
                  <NavButton
                    key={item.to}
                    to={item.to}
                    path={item.path}
                    title={item.title}
                    icon={item.icon}
                    handleSidebar={handleSidebar}
                    isActive={url === item.path}
                  />
                ))}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Logout - Fixed at Bottom */}
      <div className="border-t p-4">
        <button
          onClick={() => setOpen(true)}
          className="flex w-full items-center rounded-lg px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
        >
          <MdLogout className="h-5 w-5 text-gray-500" />
          <span className="ml-3 font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}

function NavButton({ to, path, title, icon, handleSidebar, isActive }) {
  const navigate = useNavigate();

  const handleClick = () => {
    handleSidebar();
    navigate(to);
  };

  return (
    <button
      onClick={handleClick}
      className={`flex w-full items-center rounded-lg px-4 py-3 text-sm transition-colors ${
        isActive
          ? "bg-[#00BFBF] text-white font-medium"
          : "text-gray-600 hover:bg-gray-50"
      }`}
    >
      <div className={isActive ? "text-white" : "text-gray-500"}>
        {icon}
      </div>
      <span className="ml-3">{title}</span>
    </button>
  );
}


export function LogoutButton({ title, logo, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center rounded-lg px-4 py-3 text-sm text-blue-100 transition-colors duration-200 hover:bg-blue-600 hover:text-white"
    >
      <div className="text-blue-300">{logo}</div>
      <span className="ml-3 font-medium">{title}</span>
    </button>
  );
}