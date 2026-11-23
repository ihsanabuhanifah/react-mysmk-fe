import React from "react";
import { WaliPage } from "../../layout/wali";
import { usePelanggaran, usePrestasi } from "../../api/wali";
import { Card, StatCard, Badge, DataState, PeriodeFilter, ResponsiveList, usePeriode, tanggalIndo } from "./shared";

export default function CatatanWali() {
  const [periode, setPeriode] = usePeriode();
  const pelanggaran = usePelanggaran(periode);
  const prestasi = usePrestasi(periode);
  const dataP = pelanggaran.data || [];
  const dataPr = prestasi.data || [];
  const totalPoin = dataP.reduce((s, p) => s + (Number(p.point) || 0), 0);

  const kolomPelanggaran = [
    { key: "tanggal", title: "Tanggal", render: (r) => tanggalIndo(r.tanggal) },
    { key: "nama_pelanggaran", title: "Pelanggaran", render: (r) => <span className="font-semibold">{r.nama_pelanggaran}</span> },
    { key: "kategori", title: "Kategori", render: (r) => <Badge>{r.kategori}</Badge> },
    { key: "point", title: "Poin" },
    { key: "hukuman", title: "Tindak lanjut", render: (r) => r.hukuman || "-" },
    { key: "ditindak_oleh", title: "Ditangani", render: (r) => r.ditindak_oleh || "-" },
  ];
  const kolomPrestasi = [
    { key: "tanggal", title: "Tanggal", render: (r) => tanggalIndo(r.tanggal) },
    { key: "prestasi", title: "Prestasi", render: (r) => <span className="font-semibold">{r.prestasi}</span> },
    { key: "kategori", title: "Kategori", render: (r) => r.kategori || "-" },
  ];

  return (
    <WaliPage title="Pelanggaran & Prestasi" subtitle="Catatan kedisiplinan dan pencapaian ananda">
      <PeriodeFilter value={periode} onChange={setPeriode} />

      <div className="mb-4 grid grid-cols-3 gap-3">
        <StatCard label="Pelanggaran" value={dataP.length} tone={dataP.length ? "amber" : "gray"} />
        <StatCard label="Total poin" value={totalPoin} tone={totalPoin ? "red" : "gray"} />
        <StatCard label="Prestasi" value={dataPr.length} tone="green" />
      </div>

      <div className="grid gap-4">
        <Card title="Prestasi">
          <DataState isLoading={prestasi.isLoading} isError={prestasi.isError} data={dataPr} empty="Belum ada prestasi tercatat">
            <ResponsiveList
              data={dataPr}
              columns={kolomPrestasi}
              renderMobile={(r) => (
                <>
                  <p className="m-0 font-semibold">{r.prestasi}</p>
                  <p className="m-0 text-xs text-gray-500">
                    {tanggalIndo(r.tanggal)}
                    {r.kategori ? ` · ${r.kategori}` : ""}
                  </p>
                </>
              )}
            />
          </DataState>
        </Card>

        <Card title="Pelanggaran">
          <DataState
            isLoading={pelanggaran.isLoading}
            isError={pelanggaran.isError}
            data={dataP}
            empty="Alhamdulillah, tidak ada catatan pelanggaran"
          >
            <ResponsiveList
              data={dataP}
              columns={kolomPelanggaran}
              renderMobile={(r) => (
                <>
                  <div className="flex items-start justify-between gap-3">
                    <p className="m-0 font-semibold">{r.nama_pelanggaran}</p>
                    <Badge>{r.kategori}</Badge>
                  </div>
                  <p className="m-0 text-xs text-gray-500">
                    {tanggalIndo(r.tanggal)} · {r.point ?? 0} poin
                  </p>
                  {r.hukuman && <p className="m-0 mt-1 text-xs text-gray-600">Tindak lanjut: {r.hukuman}</p>}
                </>
              )}
            />
          </DataState>
        </Card>
      </div>
    </WaliPage>
  );
}
