import React from "react";
import { Link } from "react-router-dom";
import { WaliPage } from "../../layout/wali";
import {
  useProfileWali,
  useRekapAbsensi,
  useHasilHalaqoh,
  usePelanggaran,
  usePrestasi,
  useNotice,
  useIzinList,
  getWaliToken,
} from "../../api/wali";
import { Card, StatCard, Badge, Empty, Skeleton, tanggalIndo } from "./shared";

const LinkMore = ({ to }) => (
  <Link to={to} className="text-xs font-semibold text-[#18a558] hover:underline">
    Lihat semua
  </Link>
);

export default function DashboardWali() {
  const token = getWaliToken();
  const periode = { tahunAjaran: token?.tahunAjaranAktif, semester: token?.semesterAktif };

  const { data: profile } = useProfileWali();
  const { data: rekap, isLoading: loadRekap } = useRekapAbsensi(periode);
  const { data: halaqoh = [], isLoading: loadHalaqoh } = useHasilHalaqoh();
  const { data: pelanggaran = [] } = usePelanggaran(periode);
  const { data: prestasi = [] } = usePrestasi(periode);
  const { data: notice = [], isLoading: loadNotice } = useNotice();
  const { data: kunjungan = [] } = useIzinList("kunjungan");
  const { data: pulang = [] } = useIzinList("pulang");

  const totalPoin = pelanggaran.reduce((sum, p) => sum + (Number(p.point) || 0), 0);
  const izinMenunggu = [...kunjungan, ...pulang].filter((i) => i.status_approval === "menunggu").length;
  const setoranTerakhir = halaqoh[0];

  return (
    <WaliPage
      title={`Assalamu'alaikum, ${token?.name?.split(" ")[0] || "Bapak/Ibu"}`}
      subtitle={
        periode.tahunAjaran
          ? `Perkembangan ananda tahun ajaran ${periode.tahunAjaran}, semester ${periode.semester}`
          : "Perkembangan ananda di sekolah"
      }
    >
      <Card className="mb-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-xl font-black text-[#18a558]">
            {(profile?.nama_siswa || "?").charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="m-0 truncate text-lg font-black">{profile?.nama_siswa || "-"}</p>
            <p className="m-0 text-sm text-gray-500">
              {[profile?.kelas && `Kelas ${profile.kelas}`, profile?.siswa?.nis && `NIS ${profile.siswa.nis}`]
                .filter(Boolean)
                .join(" · ") || "Data kelas belum tersedia"}
            </p>
          </div>
          <Link
            to="../profil"
            className="rounded-lg border px-3 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50"
          >
            Profil santri
          </Link>
        </div>
      </Card>

      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label="Kehadiran kelas"
          value={loadRekap ? "…" : rekap?.jumlah_absensi > 0 ? rekap.persentase_kehadiran.replace(" ", "") : "-"}
          hint={rekap?.jumlah_absensi > 0 ? `${rekap.hadir} dari ${rekap.jumlah_absensi} sesi` : "Belum ada data"}
          tone="green"
        />
        <StatCard
          label="Tidak hadir tanpa keterangan"
          value={rekap?.tanpa_keterangan ?? "-"}
          hint="sesi semester ini"
          tone={rekap?.tanpa_keterangan > 0 ? "red" : "gray"}
        />
        <StatCard label="Poin pelanggaran" value={totalPoin} hint={`${pelanggaran.length} catatan`} tone={totalPoin > 0 ? "amber" : "gray"} />
        <StatCard label="Prestasi" value={prestasi.length} hint="semester ini" tone="blue" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Setoran halaqoh terakhir" action={<LinkMore to="../halaqoh" />}>
          {loadHalaqoh ? (
            <Skeleton rows={2} />
          ) : !setoranTerakhir ? (
            <Empty text="Belum ada setoran halaqoh" />
          ) : (
            <div>
              <p className="m-0 text-xs text-gray-500">{tanggalIndo(setoranTerakhir.tanggal, { hari: true })}</p>
              <p className="m-0 mt-1 text-base font-bold">
                {setoranTerakhir.dari_surat} {setoranTerakhir.dari_ayat} – {setoranTerakhir.sampai_surat}{" "}
                {setoranTerakhir.sampai_ayat}
              </p>
              <p className="m-0 mt-1 text-sm text-gray-500">
                {setoranTerakhir.total_halaman ?? 0} halaman
                {setoranTerakhir.juz_ke ? ` · Juz ${setoranTerakhir.juz_ke}` : ""}
              </p>
            </div>
          )}
        </Card>

        <Card title="Perizinan" action={<LinkMore to="../kunjungan" />}>
          <p className="m-0 text-sm text-gray-600">
            {izinMenunggu > 0
              ? `${izinMenunggu} pengajuan izin masih menunggu persetujuan.`
              : "Tidak ada pengajuan izin yang menunggu."}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link to="../kunjungan" className="rounded-lg bg-[#18a558] px-3 py-2 text-sm font-semibold text-white hover:opacity-90">
              Ajukan kunjungan
            </Link>
            <Link to="../pulang" className="rounded-lg border px-3 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50">
              Ajukan izin pulang
            </Link>
          </div>
        </Card>

        <Card title="Pengumuman terbaru" action={<LinkMore to="../pengumuman" />} className="lg:col-span-2">
          {loadNotice ? (
            <Skeleton rows={3} />
          ) : notice.length === 0 ? (
            <Empty text="Belum ada pengumuman" />
          ) : (
            <ul className="m-0 list-none divide-y p-0">
              {notice.slice(0, 3).map((n) => (
                <li key={n.id} className="py-2.5">
                  <p className="m-0 font-semibold">{n.judul_notice}</p>
                  <p className="m-0 text-xs text-gray-500">{tanggalIndo(n.tanggal_pengumuman || n.createdAt)}</p>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {pelanggaran.length > 0 && (
          <Card title="Catatan pelanggaran terbaru" action={<LinkMore to="../catatan" />} className="lg:col-span-2">
            <ul className="m-0 list-none divide-y p-0">
              {pelanggaran.slice(0, 3).map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-3 py-2.5">
                  <div className="min-w-0">
                    <p className="m-0 truncate font-semibold">{p.nama_pelanggaran}</p>
                    <p className="m-0 text-xs text-gray-500">{tanggalIndo(p.tanggal)}</p>
                  </div>
                  <Badge>{p.kategori}</Badge>
                </li>
              ))}
            </ul>
          </Card>
        )}
      </div>
    </WaliPage>
  );
}
