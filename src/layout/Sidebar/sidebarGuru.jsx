import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { formatTahun } from "../../utils";
import {
  MdClose,
  MdOutlineDashboard,
  MdOutlineLibraryBooks,
  MdLogout,
  MdLaptopMac,
  MdPeople,
  MdOutlineSupervisorAccount,
  MdCheck,
  MdFormatAlignCenter,
  MdKeyboard,
  MdFingerprint,
  MdNavigation,
  MdPhoneForwarded,
  MdPhoneInTalk,
  MdCreate,
  MdLaptopChromebook,
  MdChatBubble,
  MdFaceUnlock,
  MdApartment,
  MdDocumentScanner,
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

  // Group navigation items by category
  const navigationItems = [
    {
      category: "Main",
      items: [
        {
          to: "dashboard",
          path: "dashboard",
          title: "Dashboard",
          icon: <MdOutlineDashboard className="h-5 w-5" />,
          roles: ["Guru"]
        }
      ]
    },
    {
      category: "Monitoring",
      items: [
        {
          to: "monitor/harian",
          path: "monitor/harian",
          title: "Monitor KBM",
          icon: <MdLaptopChromebook className="h-5 w-5" />,
          roles: ["Guru"]
        },
        {
          to: "daftar-siswa",
          path: "daftar-siswa",
          title: "Daftar Kelas",
          icon: <MdOutlineSupervisorAccount className="h-5 w-5" />,
          roles: ["Guru"]
        },
        {
          to: "halaqoh-siswa",
          path: "halaqoh-siswa",
          title: "Daftar Halaqoh",
          icon: <MdPeople className="h-5 w-5" />,
          roles: ["Guru"]
        }
      ]
    },
    {
      category: "Attendance",
      items: [
        {
          to: "kehadiran-guru",
          path: "kehadiran-guru",
          title: "Absensi Guru",
          icon: <MdFingerprint className="h-5 w-5" />,
          roles: ["Guru"]
        },
        {
          to: "absensi",
          path: "absensi",
          title: "Absensi KBM",
          icon: <MdLaptopMac className="h-5 w-5" />,
          roles: ["Guru"]
        },
        {
          to: `halaqoh/absensi/${formatTahun(date)}`,
          path: "halaqoh",
          title: "Absensi Halaqoh",
          icon: <MdLaptopChromebook className="h-5 w-5" />,
          roles: ["Guru"]
        },
        {
          to: "pengampu/halaqoh/absensi",
          path: "pengampu",
          title: "Absensi Pengampu",
          icon: <MdCheck className="h-5 w-5" />,
          roles: ["Guru"]
        }
      ]
    },
    {
      category: "Academic",
      items: [
        {
          to: "bank-soal",
          path: "bank-soal",
          title: "Bank Soal",
          icon: <MdFormatAlignCenter className="h-5 w-5" />,
          roles: ["Guru"]
        },
        {
          to: "exam",
          path: "exam",
          title: "Assesmen",
          icon: <MdKeyboard className="h-5 w-5" />,
          roles: ["Guru"]
        },
        {
          to: "ujian-berjalan",
          path: "ujian-berjalan",
          title: "Ujian Berjalan",
          icon: <MdLaptopMac className="h-5 w-5" />,
          roles: ["Guru"]
        },
        {
          to: "hasil-belajar",
          path: "hasil-belajar",
          title: "Hasil Belajar",
          icon: <MdDocumentScanner className="h-5 w-5" />,
          roles: ["Guru"]
        },
         
      ]
    },
    {
      category: "Activities",
      items: [
        {
          to: "sholat",
          path: "sholat",
          title: "Sholat",
          icon: <MdNavigation className="h-5 w-5" />,
          roles: ["Guru"]
        },
        {
          to: "pelanggaran",
          path: "pelanggaran",
          title: "Pelanggaran",
          icon: <MdOutlineLibraryBooks className="h-5 w-5" />,
          roles: ["Guru"]
        },
        {
          to: "prestasi",
          path: "prestasi",
          title: "Prestasi",
          icon: <MdOutlineLibraryBooks className="h-5 w-5" />,
          roles: ["Guru"]
        }
      ]
    },
    {
      category: "Permissions",
      items: [
        {
          to: "perizinan-pulang",
          path: "perizinan-pulang",
          title: "Pulang",
          icon: <MdPhoneForwarded className="h-5 w-5" />,
          roles: ["Guru"]
        },
        {
          to: "perizinan-kunjungan",
          path: "perizinan-kunjungan",
          title: "Kunjungan",
          icon: <MdPhoneInTalk className="h-5 w-5" />,
          roles: ["Guru"]
        }
      ]
    },
    {
      category: "Reports",
      items: [
        {
          to: "laporan-guru-piket",
          path: "laporan-guru-piket",
          title: "Laporan Guru Piket",
          icon: <MdCreate className="h-5 w-5" />,
          roles: ["Guru"]
        }
      ]
    },
    {
      category: "Others",
      items: [
        {
          to: "fitur-siswa-pkl",
          path: "fitur-siswa-pkl",
          title: "Fitur Siswa PKL",
          icon: <MdApartment className="h-5 w-5" />,
          roles: ["Guru"]
        },
        {
          to: "chat",
          path: "chat",
          title: "Chat",
          icon: <MdChatBubble className="h-5 w-5" />,
          roles: ["Guru"]
        }
      ]
    }
  ];

  


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
          {navigationItems.map((section) => (
            <div key={section.category} className="mb-4">
              <h3 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                {section.category}
              </h3>
              <div className="space-y-1 whitespace-nowrap">
                {section.items.map((item) => (
                  checkRole(roles, "Guru") && (
                    <NavButton
                      key={item.to}
                      to={item.to}
                      path={item.path}
                      title={item.title}
                      icon={item.icon}
                      handleSidebar={handleSidebar}
                      isActive={url === item.path}
                    />
                  )
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