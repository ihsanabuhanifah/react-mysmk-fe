// Komponen & util kecil yang dipakai bersama oleh halaman Wali Santri.
import React from "react";
import { useQuery } from "react-query";
import { MdInbox } from "react-icons/md";
import { listTahunAjaran } from "../../api/list";
import { getWaliToken } from "../../api/wali";

const BULAN = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

/** "2026-11-23" / ISO -> "23 November 2026" */
export function tanggalIndo(value, { hari = false } = {}) {
  if (!value) return "-";
  const d = new Date(String(value).length === 10 ? `${value}T00:00:00` : value);
  if (isNaN(d)) return String(value);
  const teks = `${d.getDate()} ${BULAN[d.getMonth()]} ${d.getFullYear()}`;
  if (!hari) return teks;
  return `${d.toLocaleDateString("id-ID", { weekday: "long" })}, ${teks}`;
}


export function Card({ title, action, children, className = "" }) {
  return (
    <section className={`rounded-xl border bg-white p-4 shadow-sm lg:p-5 ${className}`}>
      {(title || action) && (
        <div className="mb-3 flex items-center justify-between gap-2">
          {title && <h2 className="m-0 font-poppins text-base font-bold">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function StatCard({ label, value, hint, tone = "green" }) {
  const tones = {
    green: "bg-green-50 text-green-700",
    blue: "bg-blue-50 text-blue-700",
    amber: "bg-yellow-50 text-yellow-700",
    red: "bg-red-50 text-red-700",
    gray: "bg-gray-100 text-gray-700",
  };
  return (
    <div className={`rounded-xl p-4 ${tones[tone] || tones.gray}`}>
      <p className="m-0 text-xs font-medium opacity-80">{label}</p>
      <p className="m-0 mt-1 text-2xl font-black">{value ?? "-"}</p>
      {hint && <p className="m-0 mt-1 text-xs opacity-80">{hint}</p>}
    </div>
  );
}

const BADGE = {
  hadir: "bg-green-100 text-green-700",
  sudah: "bg-green-100 text-green-700",
  disetujui: "bg-green-100 text-green-700",
  "tepat waktu": "bg-green-100 text-green-700",
  sakit: "bg-blue-100 text-blue-700",
  izin: "bg-blue-100 text-blue-700",
  "izin pulang": "bg-blue-100 text-blue-700",
  dispensasi: "bg-blue-100 text-blue-700",
  menunggu: "bg-yellow-100 text-yellow-700",
  belum: "bg-yellow-100 text-yellow-700",
  terlambat: "bg-red-100 text-red-700",
  ditolak: "bg-red-100 text-red-700",
  alpha: "bg-red-100 text-red-700",
  "tanpa keterangan": "bg-red-100 text-red-700",
};

export function Badge({ children }) {
  const key = String(children || "").toLowerCase();
  const cls = BADGE[key] || "bg-gray-100 text-gray-700";
  return (
    <span className={`inline-block whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${cls}`}>
      {children || "-"}
    </span>
  );
}

export function Empty({ text = "Belum ada data" }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-gray-400">
      <MdInbox className="mb-2 h-10 w-10" />
      <p className="m-0 text-sm">{text}</p>
    </div>
  );
}

export function Skeleton({ rows = 4 }) {
  return (
    <div className="space-y-3 py-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-12 animate-pulse rounded-lg bg-gray-100" />
      ))}
    </div>
  );
}

/** Tampilkan loading / kosong / isi. */
export function DataState({ isLoading, isError, data, empty, children }) {
  if (isLoading) return <Skeleton />;
  if (isError) return <Empty text="Data gagal dimuat. Coba muat ulang halaman." />;
  if (!data || (Array.isArray(data) && data.length === 0)) return <Empty text={empty} />;
  return children;
}

export function useTahunAjaranOptions() {
  return useQuery(["list_tahun_ajaran"], () => listTahunAjaran(), {
    staleTime: 1000 * 60 * 60 * 12,
    refetchOnWindowFocus: false,
    select: (res) => {
      const list = res?.data?.data ?? res?.data ?? [];
      return Array.isArray(list) ? list.map((t) => t.nama_tahun_ajaran).filter(Boolean) : [];
    },
  });
}

/** Filter tahun ajaran + semester (default: periode aktif dari token login). */
export function usePeriode() {
  const token = getWaliToken();
  const [periode, setPeriode] = React.useState({
    tahunAjaran: token?.tahunAjaranAktif || "",
    semester: token?.semesterAktif ? String(token.semesterAktif) : "",
  });
  return [periode, setPeriode];
}

const selectCls =
  "h-10 rounded-lg border border-gray-300 bg-white px-3 text-base md:text-sm focus:border-[#18a558] focus:outline-none";

export function PeriodeFilter({ value, onChange, children }) {
  const { data: tahunAjaran = [] } = useTahunAjaranOptions();
  const opsiTa = value.tahunAjaran && !tahunAjaran.includes(value.tahunAjaran)
    ? [value.tahunAjaran, ...tahunAjaran]
    : tahunAjaran;
  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      <select
        aria-label="Tahun ajaran"
        className={selectCls}
        value={value.tahunAjaran}
        onChange={(e) => onChange({ ...value, tahunAjaran: e.target.value })}
      >
        <option value="">Semua tahun ajaran</option>
        {opsiTa.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
      <select
        aria-label="Semester"
        className={selectCls}
        value={value.semester}
        onChange={(e) => onChange({ ...value, semester: e.target.value })}
      >
        <option value="">Semua semester</option>
        <option value="1">Semester 1</option>
        <option value="2">Semester 2</option>
      </select>
      {children}
    </div>
  );
}

export { selectCls };

/** Tabel responsif sederhana: tabel di layar lebar, kartu di HP. */
export function ResponsiveList({ data, columns, rowKey = "id", renderMobile }) {
  return (
    <>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b text-xs uppercase text-gray-500">
              {columns.map((c) => (
                <th key={c.key} className="whitespace-nowrap px-3 py-2 font-semibold">
                  {c.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={row[rowKey] ?? i} className="border-b last:border-0 hover:bg-gray-50">
                {columns.map((c) => (
                  <td key={c.key} className="px-3 py-2.5 align-top">
                    {c.render ? c.render(row, i) : row[c.key] ?? "-"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="space-y-2 md:hidden">
        {data.map((row, i) => (
          <div key={row[rowKey] ?? i} className="rounded-lg border p-3">
            {renderMobile(row, i)}
          </div>
        ))}
      </div>
    </>
  );
}

/** Navigasi halaman sederhana (endpoint lama tidak mengirim total data). */
export function Pager({ page, setPage, hasNext }) {
  if (page === 1 && !hasNext) return null;
  const btn =
    "rounded-lg border px-3 py-1.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40";
  return (
    <div className="mt-4 flex items-center justify-end gap-2">
      <button type="button" className={btn} disabled={page <= 1} onClick={() => setPage(page - 1)}>
        Sebelumnya
      </button>
      <span className="text-sm text-gray-500">Halaman {page}</span>
      <button type="button" className={btn} disabled={!hasNext} onClick={() => setPage(page + 1)}>
        Berikutnya
      </button>
    </div>
  );
}
