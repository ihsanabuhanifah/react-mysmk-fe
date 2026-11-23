import React from "react";
import { WaliPage } from "../../layout/wali";
import { useAbsensiHalaqoh, useHasilHalaqoh } from "../../api/wali";
import { Card, StatCard, Badge, DataState, PeriodeFilter, ResponsiveList, Pager, usePeriode, tanggalIndo } from "./shared";

const PAGE_SIZE = 20;
const ayat = (surat, no) => (surat ? `${surat}${no ? ` : ${no}` : ""}` : "-");

export default function HalaqohWali() {
  const [periode, setPeriode] = usePeriode();
  const [page, setPage] = React.useState(1);
  React.useEffect(() => setPage(1), [periode]);

  const { data: hasil = [] } = useHasilHalaqoh();
  const { data = [], isLoading, isError, isFetching } = useAbsensiHalaqoh({ ...periode, page, pageSize: PAGE_SIZE });

  const totalHalaman = hasil.reduce((s, r) => s + (Number(r.total_halaman) || 0), 0);
  const juzTerakhir = hasil.find((r) => r.juz_ke)?.juz_ke;

  const columns = [
    { key: "tanggal", title: "Tanggal", render: (r) => tanggalIndo(r.tanggal, { hari: true }) },
    { key: "tipe", title: "Jenis", render: (r) => <span className="capitalize">{r.tipe || "-"}</span> },
    { key: "dari", title: "Dari", render: (r) => ayat(r.dari_surat, r.dari_ayat) },
    { key: "sampai", title: "Sampai", render: (r) => ayat(r.sampai_surat, r.sampai_ayat) },
    { key: "total_halaman", title: "Halaman", render: (r) => r.total_halaman ?? "-" },
    { key: "status_kehadiran", title: "Kehadiran", render: (r) => <Badge>{r.status_kehadiran}</Badge> },
    { key: "nama_guru", title: "Musyrif" },
  ];

  return (
    <WaliPage title="Halaqoh Al-Qur'an" subtitle="Setoran hafalan dan kehadiran halaqoh ananda">
      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-3">
        <StatCard label="Total setoran" value={hasil.length} hint="sejak awal" tone="green" />
        <StatCard label="Total halaman" value={totalHalaman} tone="blue" />
        <StatCard label="Juz terakhir" value={juzTerakhir ?? "-"} tone="gray" />
      </div>

      <PeriodeFilter value={periode} onChange={setPeriode} />

      <Card>
        <DataState isLoading={isLoading} isError={isError} data={data} empty="Belum ada catatan halaqoh pada periode ini">
          <div className={isFetching ? "opacity-60" : ""}>
            <ResponsiveList
              data={data}
              columns={columns}
              renderMobile={(r) => (
                <>
                  <div className="flex items-start justify-between gap-3">
                    <p className="m-0 text-xs text-gray-500">{tanggalIndo(r.tanggal, { hari: true })}</p>
                    <Badge>{r.status_kehadiran}</Badge>
                  </div>
                  <p className="m-0 mt-1 font-semibold">
                    {ayat(r.dari_surat, r.dari_ayat)} – {ayat(r.sampai_surat, r.sampai_ayat)}
                  </p>
                  <p className="m-0 text-xs text-gray-500">
                    <span className="capitalize">{r.tipe || "-"}</span> · {r.total_halaman ?? 0} halaman · {r.nama_guru || "-"}
                  </p>
                </>
              )}
            />
          </div>
        </DataState>
        <Pager page={page} setPage={setPage} hasNext={data.length === PAGE_SIZE} />
      </Card>
    </WaliPage>
  );
}
