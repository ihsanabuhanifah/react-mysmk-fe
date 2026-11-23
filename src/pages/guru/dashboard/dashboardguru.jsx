import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import {
  MdAccessTime,
  MdArrowForward,
  MdCheckCircle,
  MdClass,
  MdEventAvailable,
  MdFingerprint,
  MdGroups,
  MdMenuBook,
  MdPeople,
  MdSchool,
  MdTimer,
  MdWarningAmber,
  MdBadge,
} from "react-icons/md";
import LayoutPage from "../../../module/layoutPage";
import { getDashboardGuru } from "../../../api/guru/dashboard";

const NAMA_HARI = {
  ahad: "Ahad",
  senin: "Senin",
  selasa: "Selasa",
  rabu: "Rabu",
  kamis: "Kamis",
  jumat: "Jumat",
  sabtu: "Sabtu",
};

const formatTanggal = (iso) =>
  new Date(`${String(iso).slice(0, 10)}T00:00:00`).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const formatTglPendek = (iso) =>
  new Date(`${String(iso).slice(0, 10)}T00:00:00`).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
  });

const jamLabel = (j) =>
  j.jumlah_jam > 1 ? `Jam ${j.jam_ke}–${j.jam_ke + j.jumlah_jam - 1}` : `Jam ${j.jam_ke}`;

function sapaan() {
  const h = new Date().getHours();
  if (h < 11) return "Selamat pagi";
  if (h < 15) return "Selamat siang";
  if (h < 18) return "Selamat sore";
  return "Selamat malam";
}

export default function DashboardGuru() {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useQuery(["guru/dashboard"], getDashboardGuru, {
    refetchOnWindowFocus: false,
    staleTime: 60 * 1000,
    select: (r) => r.data?.data,
  });

  const pribadi = data?.pribadi;
  const sekolah = data?.sekolah;
  const perhatian = data?.perhatian;

  return (
    <LayoutPage title="Dashboard">
      {isError && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          Gagal memuat dashboard. Coba muat ulang halaman.
        </div>
      )}

      {/* Sapaan */}
      <section className="mb-5 rounded-2xl bg-gradient-to-r from-[#00BFBF] to-teal-600 p-5 text-white shadow-sm lg:p-6">
        {isLoading ? (
          <Skeleton className="h-14 w-2/3 bg-white/30" />
        ) : (
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm text-teal-50">{data && formatTanggal(data.tanggal)}</p>
              <h2 className="mt-1 text-2xl font-bold">
                {sapaan()}, {pribadi?.guru?.nama_guru?.trim() || "Ustadz/Ustadzah"}
              </h2>
              {data?.taAktif && (
                <p className="mt-1 text-sm text-teal-50">
                  Tahun ajaran {data.taAktif.nama_tahun_ajaran}
                </p>
              )}
            </div>
            {pribadi && <KehadiranBadge kehadiran={pribadi.kehadiranHariIni} onClick={() => navigate("/guru/kehadiran-guru")} />}
          </div>
        )}
      </section>

      {/* Perlu perhatian (admin) */}
      {perhatian && <Perhatian perhatian={perhatian} navigate={navigate} />}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        {/* Kolom kiri: jadwal + ringkasan pribadi */}
        <div className="space-y-5 xl:col-span-2">
          {pribadi && (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <StatCard icon={<MdAccessTime />} label="Jam mengajar / minggu" value={pribadi.ringkasan.jam_per_minggu} color="teal" />
              <StatCard icon={<MdClass />} label="Kelas diajar" value={pribadi.ringkasan.jumlah_kelas} color="blue" />
              <StatCard
                icon={<MdTimer />}
                label="Ujian berjalan"
                value={pribadi.ringkasan.ujian_berjalan}
                color="orange"
                onClick={() => navigate("/guru/ujian-berjalan")}
              />
              <StatCard icon={<MdMenuBook />} label="Kelompok halaqoh" value={pribadi.ringkasan.halaqoh} color="green" />
            </div>
          )}

          <Card
            title={pribadi?.jadwalHariIni?.length ? "Jadwal mengajar hari ini" : "Jadwal mengajar"}
            action={
              <button
                type="button"
                onClick={() => navigate("/guru/absensi")}
                className="flex items-center gap-1 text-sm font-medium text-[#00A0A0] hover:underline"
              >
                Absensi KBM <MdArrowForward />
              </button>
            }
          >
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-14" />
                <Skeleton className="h-14" />
              </div>
            ) : !pribadi ? (
              <Empty text="Akun ini belum terhubung dengan data guru." />
            ) : pribadi.jadwalHariIni.length > 0 ? (
              <JadwalList items={pribadi.jadwalHariIni} showStatus />
            ) : (
              <>
                <div className="mb-3 rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-600">
                  Tidak ada jadwal mengajar hari ini.
                </div>
                {pribadi.jadwalBerikutnya ? (
                  <>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Jadwal berikutnya · {NAMA_HARI[pribadi.jadwalBerikutnya.hari]}
                    </p>
                    <JadwalList items={pribadi.jadwalBerikutnya.jadwal} />
                  </>
                ) : (
                  <Empty text="Belum ada jadwal mengajar yang aktif." />
                )}
              </>
            )}
          </Card>

          <Card title="Tren kehadiran siswa" subtitle="7 hari terakhir yang absensinya sudah diisi">
            {isLoading ? (
              <Skeleton className="h-40" />
            ) : sekolah?.trenKehadiran?.length ? (
              <TrenKehadiran data={sekolah.trenKehadiran} />
            ) : (
              <Empty text="Belum ada data absensi." />
            )}
          </Card>
        </div>

        {/* Kolom kanan: gambaran sekolah */}
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <StatCard icon={<MdPeople />} label="Siswa aktif" value={sekolah?.siswa_aktif} color="teal" loading={isLoading} onClick={() => navigate("/guru/daftar-siswa")} />
            <StatCard icon={<MdClass />} label="Kelas" value={sekolah?.kelas_aktif} color="blue" loading={isLoading} />
            <StatCard icon={<MdBadge />} label="Guru aktif" value={sekolah?.guru_aktif} color="purple" loading={isLoading} onClick={() => navigate("/guru/daftar-guru")} />
            <StatCard icon={<MdSchool />} label="Alumni" value={sekolah?.alumni} color="gray" loading={isLoading} onClick={() => navigate("/guru/daftar-alumni")} />
          </div>

          <Card title="Siswa per kelas">
            {isLoading ? (
              <Skeleton className="h-48" />
            ) : sekolah?.siswaPerKelas?.length ? (
              <SiswaPerKelas data={sekolah.siswaPerKelas} />
            ) : (
              <Empty text="Belum ada siswa aktif." />
            )}
          </Card>
        </div>
      </div>
    </LayoutPage>
  );
}

/* ---------------- Komponen kecil ---------------- */

function Card({ title, subtitle, action, children }) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-gray-800">{title}</h3>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

const COLORS = {
  teal: "bg-teal-50 text-[#00A0A0]",
  blue: "bg-blue-50 text-blue-600",
  orange: "bg-orange-50 text-orange-600",
  green: "bg-green-50 text-green-600",
  purple: "bg-purple-50 text-purple-600",
  gray: "bg-gray-100 text-gray-600",
};

function StatCard({ icon, label, value, color = "teal", onClick, loading }) {
  const Tag = onClick ? "button" : "div";
  return (
    <Tag
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={`flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 text-left shadow-sm ${
        onClick ? "transition hover:border-[#00BFBF] hover:shadow-md" : ""
      }`}
    >
      <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg text-xl ${COLORS[color]}`}>
        {icon}
      </div>
      <div className="min-w-0">
        {loading ? (
          <Skeleton className="mb-1 h-6 w-10" />
        ) : (
          <div className="text-2xl font-bold leading-none text-gray-800">{value ?? 0}</div>
        )}
        <div className="mt-1 truncate text-xs text-gray-500">{label}</div>
      </div>
    </Tag>
  );
}

function KehadiranBadge({ kehadiran, onClick }) {
  const sudah = kehadiran?.status || kehadiran?.jam_datang;
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-3 rounded-xl bg-white/15 px-4 py-3 text-left backdrop-filter backdrop-blur transition hover:bg-white/25"
    >
      {sudah ? (
        <MdCheckCircle className="h-7 w-7 text-white" />
      ) : (
        <MdFingerprint className="h-7 w-7 text-white" />
      )}
      <div>
        <div className="text-xs text-teal-50">Kehadiran saya hari ini</div>
        <div className="font-semibold capitalize">
          {sudah
            ? `${kehadiran.status || "hadir"}${kehadiran.jam_datang ? ` · ${String(kehadiran.jam_datang).slice(0, 5)}` : ""}`
            : "Belum absen"}
        </div>
      </div>
    </button>
  );
}

const STATUS_ABSENSI = {
  sudah: { text: "Absensi sudah diisi", cls: "bg-green-50 text-green-700" },
  belum: { text: "Absensi belum diisi", cls: "bg-orange-50 text-orange-700" },
  belum_dibuat: { text: "Absensi belum dibuat", cls: "bg-gray-100 text-gray-500" },
};

function JadwalList({ items, showStatus }) {
  return (
    <ul className="divide-y divide-gray-100">
      {items.map((j) => (
        <li key={j.id} className="flex items-center gap-4 py-3">
          <div className="flex w-20 flex-shrink-0 flex-col items-center rounded-lg bg-teal-50 py-2 text-[#00A0A0]">
            <MdEventAvailable className="h-5 w-5" />
            <span className="mt-1 text-xs font-semibold">{jamLabel(j)}</span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate font-semibold text-gray-800">{j.nama_mapel}</div>
            <div className="truncate text-sm text-gray-500">{j.nama_kelas}</div>
          </div>
          {showStatus && j.status_absensi && (
            <span className={`flex-shrink-0 rounded-full px-3 py-1 text-xs font-medium ${STATUS_ABSENSI[j.status_absensi].cls}`}>
              {STATUS_ABSENSI[j.status_absensi].text}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}

function TrenKehadiran({ data }) {
  const rata = Math.round(data.reduce((a, d) => a + d.persen, 0) / data.length);
  return (
    <div>
      <div className="mb-4 flex items-baseline gap-2">
        <span className="text-3xl font-bold text-gray-800">{rata}%</span>
        <span className="text-sm text-gray-500">rata-rata hadir</span>
      </div>
      <div className="flex h-40 items-end gap-2">
        {data.map((d) => (
          <div key={d.tanggal} className="flex flex-1 flex-col items-center gap-1">
            <span className="text-xs font-medium text-gray-600">{d.persen}%</span>
            <div className="flex w-full flex-1 items-end rounded-md bg-gray-100">
              <div
                className={`w-full rounded-md ${d.persen >= 90 ? "bg-[#00BFBF]" : d.persen >= 75 ? "bg-amber-400" : "bg-red-400"}`}
                style={{ height: `${Math.max(d.persen, 4)}%` }}
                title={`${d.hadir} dari ${d.total} hadir`}
              />
            </div>
            <span className="text-[11px] text-gray-500">{formatTglPendek(d.tanggal)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SiswaPerKelas({ data }) {
  const max = Math.max(...data.map((d) => d.jumlah), 1);
  return (
    <ul className="space-y-3">
      {data.map((k) => (
        <li key={k.id}>
          <div className="mb-1 flex justify-between text-sm">
            <span className="truncate text-gray-700">{k.nama_kelas}</span>
            <span className="ml-2 font-semibold text-gray-800">{k.jumlah}</span>
          </div>
          <div className="h-2 rounded-full bg-gray-100">
            <div className="h-2 rounded-full bg-[#00BFBF]" style={{ width: `${(k.jumlah / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

function Perhatian({ perhatian, navigate }) {
  const items = [
    perhatian.siswa_tanpa_kelas > 0 && {
      text: `${perhatian.siswa_tanpa_kelas} siswa belum punya kelas`,
      aksi: "Atur kelas",
      to: "/guru/daftar-siswa/pindah-kelas?asal=baru",
    },
    perhatian.guru_nonaktif_berjadwal > 0 && {
      text: `${perhatian.guru_nonaktif_berjadwal} guru nonaktif masih punya jadwal aktif`,
      aksi: "Lihat jadwal",
      to: "/guru/jadwal",
    },
    perhatian.pindah_belum_diblokir > 0 && {
      text: `${perhatian.pindah_belum_diblokir} siswa pindah sekolah akunnya masih aktif`,
      aksi: null,
    },
  ].filter(Boolean);

  if (!items.length) return null;
  return (
    <section className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4">
      <div className="mb-2 flex items-center gap-2 font-semibold text-amber-800">
        <MdWarningAmber className="h-5 w-5" /> Perlu perhatian
      </div>
      <ul className="space-y-2">
        {items.map((it) => (
          <li key={it.text} className="flex flex-wrap items-center justify-between gap-2 text-sm text-amber-900">
            <span>• {it.text}</span>
            {it.aksi && (
              <button
                type="button"
                onClick={() => navigate(it.to)}
                className="flex items-center gap-1 font-medium text-amber-800 hover:underline"
              >
                {it.aksi} <MdArrowForward />
              </button>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

function Empty({ text }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-8 text-gray-400">
      <MdGroups className="h-8 w-8" />
      <span className="text-sm">{text}</span>
    </div>
  );
}

function Skeleton({ className = "" }) {
  return <div className={`animate-pulse rounded-lg bg-gray-200 ${className}`} />;
}
