import React from "react";
import { WaliPage } from "../../layout/wali";
import { useAbsensiKelas, useRekapAbsensi } from "../../api/wali";
import {
  Card,
  StatCard,
  Badge,
  DataState,
  PeriodeFilter,
  ResponsiveList,
  Pager,
  usePeriode,
  selectCls,
  tanggalIndo,
} from "./shared";

const PAGE_SIZE = 20;

export default function KehadiranWali() {
  const [periode, setPeriode] = usePeriode();
  const [status, setStatus] = React.useState("");
  const [page, setPage] = React.useState(1);

  React.useEffect(() => setPage(1), [periode, status]);

  const { data: rekap } = useRekapAbsensi(periode);
  const { data = [], isLoading, isError, isFetching } = useAbsensiKelas({
    ...periode,
    statusKehadiran: status,
    page,
    pageSize: PAGE_SIZE,
  });

  const columns = [
    { key: "tanggal", title: "Tanggal", render: (r) => tanggalIndo(r.tanggal, { hari: true }) },
    { key: "jam_ke", title: "Jam", render: (r) => r.jam_ke ?? "-" },
    { key: "nama_mapel", title: "Mapel" },
    { key: "nama_guru", title: "Guru" },
    { key: "status_kehadiran", title: "Status", render: (r) => <Badge>{r.status_kehadiran}</Badge> },
    { key: "keterangan", title: "Keterangan", render: (r) => r.keterangan || "-" },
  ];

  return (
    <WaliPage title="Kehadiran Kelas" subtitle="Rekap kehadiran ananda di setiap jam pelajaran">
      <PeriodeFilter value={periode} onChange={setPeriode}>
        <select aria-label="Status" className={selectCls} value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Semua status</option>
          {[
            ["hadir", "Hadir"],
            ["sakit", "Sakit"],
            ["izin pulang", "Izin pulang"],
            ["dispensasi", "Dispensasi"],
            ["tanpa keterangan", "Tanpa keterangan"],
          ].map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </PeriodeFilter>

      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-5">
        <StatCard label="Hadir" value={rekap?.hadir ?? "-"} hint={rekap?.jumlah_absensi > 0 ? rekap.persentase_kehadiran : ""} tone="green" />
        <StatCard label="Sakit" value={rekap?.sakit ?? "-"} tone="blue" />
        <StatCard label="Izin" value={rekap?.izin ?? "-"} tone="blue" />
        <StatCard label="Dispensasi" value={rekap?.dispensasi ?? "-"} tone="gray" />
        <StatCard label="Tanpa keterangan" value={rekap?.tanpa_keterangan ?? "-"} tone="red" />
      </div>

      <Card>
        <DataState isLoading={isLoading} isError={isError} data={data} empty="Tidak ada data kehadiran pada periode ini">
          <div className={isFetching ? "opacity-60" : ""}>
            <ResponsiveList
              data={data}
              columns={columns}
              renderMobile={(r) => (
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="m-0 font-semibold">{r.nama_mapel}</p>
                    <p className="m-0 text-xs text-gray-500">
                      {tanggalIndo(r.tanggal, { hari: true })}
                      {r.jam_ke ? ` · Jam ke-${r.jam_ke}` : ""}
                    </p>
                    {r.keterangan && <p className="m-0 mt-1 text-xs text-gray-500">{r.keterangan}</p>}
                  </div>
                  <Badge>{r.status_kehadiran}</Badge>
                </div>
              )}
            />
          </div>
        </DataState>
        <Pager page={page} setPage={setPage} hasNext={data.length === PAGE_SIZE} />
      </Card>
    </WaliPage>
  );
}
