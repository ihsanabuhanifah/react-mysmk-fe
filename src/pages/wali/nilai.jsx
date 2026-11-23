import React from "react";
import { Link, useParams } from "react-router-dom";
import { WaliPage } from "../../layout/wali";
import { useRaport, useRaportDetail, useHasilUjian } from "../../api/wali";
import { Card, Badge, DataState, ResponsiveList, Pager, tanggalIndo, selectCls, useTahunAjaranOptions } from "./shared";

const nilaiCls = (n) => {
  const v = Number(n);
  if (n === null || n === undefined || n === "" || isNaN(v)) return "text-gray-400";
  if (v >= 85) return "text-green-700";
  if (v >= 75) return "text-gray-800";
  return "text-red-600";
};
const Nilai = ({ v }) => <span className={`font-bold ${nilaiCls(v)}`}>{v ?? "-"}</span>;

export default function NilaiWali() {
  const [tab, setTab] = React.useState("rapor");
  return (
    <WaliPage title="Nilai & Rapor" subtitle="Nilai rapor per mata pelajaran dan hasil ujian ananda">
      <div className="mb-4 inline-flex rounded-lg border bg-white p-1">
        {[
          ["rapor", "Rapor"],
          ["ujian", "Hasil ujian"],
        ].map(([k, label]) => (
          <button
            key={k}
            type="button"
            onClick={() => setTab(k)}
            className={`rounded-md px-4 py-1.5 text-sm font-semibold ${tab === k ? "bg-[#18a558] text-white" : "text-gray-600"}`}
          >
            {label}
          </button>
        ))}
      </div>
      {tab === "rapor" ? <Rapor /> : <HasilUjian />}
    </WaliPage>
  );
}

function Rapor() {
  const { data: opsiTa = [] } = useTahunAjaranOptions();
  const [ta, setTa] = React.useState("");
  const { data = [], isLoading, isError } = useRaport({ tahun_ajaran: ta });

  const columns = [
    { key: "mapel", title: "Mata pelajaran", render: (r) => <span className="font-semibold">{r.mapel?.nama_mapel}</span> },
    { key: "kelas", title: "Kelas", render: (r) => r.kelas?.nama_kelas || "-" },
    { key: "ta", title: "Tahun ajaran", render: (r) => r.tahun_ajaran?.nama_tahun_ajaran || "-" },
    { key: "tugas", title: "Tugas", render: (r) => <Nilai v={r.rata_nilai_tugas} /> },
    { key: "harian", title: "Harian", render: (r) => <Nilai v={r.rata_nilai_harian} /> },
    { key: "pts", title: "PTS", render: (r) => <Nilai v={r.rata_nilai_pts} /> },
    { key: "pas", title: "PAS", render: (r) => <Nilai v={r.rata_nilai_pas} /> },
    { key: "nilai", title: "Nilai akhir", render: (r) => <span className="text-base"><Nilai v={r.nilai} /></span> },
    {
      key: "aksi",
      title: "",
      render: (r) => (
        <Link
          to={`${r.mapel_id}/${r.kelas_id}/${r.ta_id}`}
          className="whitespace-nowrap text-sm font-semibold text-[#18a558] hover:underline"
        >
          Rincian
        </Link>
      ),
    },
  ];

  return (
    <>
      <div className="mb-4">
        <select aria-label="Tahun ajaran" className={selectCls} value={ta} onChange={(e) => setTa(e.target.value)}>
          <option value="">Semua tahun ajaran</option>
          {opsiTa.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>
      <Card>
        <DataState isLoading={isLoading} isError={isError} data={data} empty="Nilai rapor belum tersedia">
          <ResponsiveList
            data={data}
            columns={columns}
            renderMobile={(r) => (
              <Link to={`${r.mapel_id}/${r.kelas_id}/${r.ta_id}`} className="block text-gray-700 hover:text-gray-700">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="m-0 font-semibold">{r.mapel?.nama_mapel}</p>
                    <p className="m-0 text-xs text-gray-500">
                      {r.kelas?.nama_kelas} · {r.tahun_ajaran?.nama_tahun_ajaran}
                    </p>
                  </div>
                  <span className="text-xl">
                    <Nilai v={r.nilai} />
                  </span>
                </div>
                {r.deskripsi && <p className="m-0 mt-2 text-xs text-gray-600">{r.deskripsi}</p>}
              </Link>
            )}
          />
        </DataState>
      </Card>
    </>
  );
}

const PAGE_SIZE = 20;

function HasilUjian() {
  const [page, setPage] = React.useState(1);
  const { data, isLoading, isError, isFetching } = useHasilUjian({ page, pageSize: PAGE_SIZE });
  const rows = data?.rows || [];

  const columns = [
    { key: "tanggal", title: "Tanggal", render: (r) => tanggalIndo(r.jam_mulai || r.createdAt) },
    { key: "mapel", title: "Mapel", render: (r) => r.mapel?.nama_mapel || "-" },
    { key: "jenis_ujian", title: "Jenis", render: (r) => <span className="uppercase">{r.jenis_ujian || "-"}</span> },
    { key: "guru", title: "Guru", render: (r) => r.teacher?.nama_guru || "-" },
    { key: "status", title: "Status", render: (r) => <Badge>{r.status}</Badge> },
    { key: "exam_result", title: "Nilai", render: (r) => <Nilai v={r.exam_result} /> },
  ];

  return (
    <Card>
      <DataState isLoading={isLoading} isError={isError} data={rows} empty="Belum ada hasil ujian">
        <div className={isFetching ? "opacity-60" : ""}>
          <ResponsiveList
            data={rows}
            columns={columns}
            renderMobile={(r) => (
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="m-0 font-semibold">{r.mapel?.nama_mapel}</p>
                  <p className="m-0 text-xs text-gray-500">
                    <span className="uppercase">{r.jenis_ujian}</span> · {tanggalIndo(r.jam_mulai || r.createdAt)}
                  </p>
                </div>
                <span className="text-xl">
                  <Nilai v={r.exam_result} />
                </span>
              </div>
            )}
          />
        </div>
      </DataState>
      <Pager page={page} setPage={setPage} hasNext={page * PAGE_SIZE < (data?.total || 0)} />
    </Card>
  );
}

export function NilaiDetailWali() {
  const { mapel_id, kelas_id, ta_id } = useParams();
  const { data = [], isLoading, isError } = useRaportDetail({ mapel_id, kelas_id, ta_id });
  const info = data[0];

  const columns = [
    { key: "tanggal", title: "Tanggal", render: (r) => tanggalIndo(r.jam_mulai || r.createdAt) },
    { key: "jenis_ujian", title: "Jenis", render: (r) => <span className="uppercase">{r.jenis_ujian || "-"}</span> },
    { key: "guru", title: "Guru", render: (r) => r.teacher?.nama_guru || "-" },
    { key: "status", title: "Status", render: (r) => <Badge>{r.status}</Badge> },
    { key: "exam_result", title: "Nilai", render: (r) => <Nilai v={r.exam_result} /> },
  ];

  return (
    <WaliPage
      title={info?.mapel?.nama_mapel ? `Rincian ${info.mapel.nama_mapel}` : "Rincian nilai"}
      subtitle={info ? `${info.kelas?.nama_kelas || ""} · ${info.tahun_ajaran?.nama_tahun_ajaran || ""}` : undefined}
      actions={
        <Link to="/wali/nilai" className="rounded-lg border px-3 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50">
          Kembali
        </Link>
      }
    >
      <Card>
        <DataState isLoading={isLoading} isError={isError} data={data} empty="Belum ada nilai untuk mapel ini">
          <ResponsiveList
            data={data}
            columns={columns}
            renderMobile={(r) => (
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="m-0 font-semibold uppercase">{r.jenis_ujian}</p>
                  <p className="m-0 text-xs text-gray-500">{tanggalIndo(r.jam_mulai || r.createdAt)}</p>
                </div>
                <span className="text-xl">
                  <Nilai v={r.exam_result} />
                </span>
              </div>
            )}
          />
        </DataState>
      </Card>
    </WaliPage>
  );
}
