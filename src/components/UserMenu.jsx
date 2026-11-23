import React from "react";
import { MdLogout, MdKeyboardArrowDown } from "react-icons/md";
import useList from "../hook/useList";
import ModalLogout from "./ModalLogout";

const inisial = (nama = "") =>
  nama
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((k) => k[0])
    .join("")
    .toUpperCase() || "?";

/**
 * Menu pengguna di kanan atas: nama + role, klik untuk melihat detail & logout.
 * compact = hanya avatar (dipakai di header mobile).
 */
export default function UserMenu({ compact = false }) {
  const { roles } = useList();
  const [open, setOpen] = React.useState(false);
  const [logout, setLogout] = React.useState(false);
  const ref = React.useRef(null);

  const nama = roles?.name || "-";
  const semuaRole = roles?.allRole?.length ? roles.allRole : [roles?.role].filter(Boolean);

  React.useEffect(() => {
    if (!open) return;
    const tutup = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    document.addEventListener("mousedown", tutup);
    return () => document.removeEventListener("mousedown", tutup);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <ModalLogout open={logout} setOpen={setLogout} />
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-3 rounded-full border border-[#80DFDF] bg-white py-1 pl-1 pr-3 text-left shadow-sm hover:bg-[#E6F9F9]"
      >
        <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#00BFBF] text-sm font-bold text-white">
          {inisial(nama)}
        </span>
        {!compact && (
          <span className="hidden max-w-[220px] flex-col leading-tight sm:flex">
            <span className="truncate text-sm font-semibold text-gray-800">{nama}</span>
            <span className="truncate text-xs text-[#008080]">{semuaRole.join(" · ")}</span>
          </span>
        )}
        <MdKeyboardArrowDown className="h-5 w-5 text-gray-500" />
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-72 rounded-xl border border-gray-200 bg-white p-4 text-gray-700 shadow-xl">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#00BFBF] text-lg font-bold text-white">
              {inisial(nama)}
            </span>
            <div className="min-w-0">
              <p className="truncate font-semibold text-gray-800">{nama}</p>
              <p className="truncate text-xs text-gray-500">{roles?.email}</p>
            </div>
          </div>

          <p className="mb-2 mt-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Role
          </p>
          <div className="flex flex-wrap gap-2">
            {semuaRole.map((r) => (
              <span
                key={r}
                className="rounded-full border border-[#80DFDF] bg-[#E6F9F9] px-3 py-1 text-xs font-semibold text-[#008080]"
              >
                {r}
              </span>
            ))}
          </div>

          <button
            type="button"
            onClick={() => {
              setOpen(false);
              setLogout(true);
            }}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 py-2 font-semibold text-red-600 hover:bg-red-100"
          >
            <MdLogout className="h-5 w-5" /> Logout
          </button>
        </div>
      )}
    </div>
  );
}
