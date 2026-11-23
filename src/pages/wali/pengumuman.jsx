import React from "react";
import { WaliPage } from "../../layout/wali";
import { useNotice } from "../../api/wali";
import { Card, DataState, tanggalIndo } from "./shared";

// isi_notice bisa berupa HTML dari editor admin -> ambil teksnya saja.
// DOMParser tidak menjalankan script / memuat gambar, jadi aman dari XSS.
const keTeks = (html) => {
  if (!html) return "";
  const doc = new DOMParser().parseFromString(String(html), "text/html");
  return doc.body.textContent || "";
};

export default function PengumumanWali() {
  const { data = [], isLoading, isError } = useNotice();
  const [buka, setBuka] = React.useState(null);

  return (
    <WaliPage title="Pengumuman" subtitle="Informasi terbaru dari sekolah">
      <DataState isLoading={isLoading} isError={isError} data={data} empty="Belum ada pengumuman">
        <div className="grid gap-4 md:grid-cols-2">
          {data.map((n) => {
            const teks = keTeks(n.isi_notice);
            const terbuka = buka === n.id;
            return (
              <Card key={n.id}>
                {n.gambar_notice && (
                  <img src={n.gambar_notice} alt="" loading="lazy" className="mb-3 max-h-56 w-full rounded-lg object-cover" />
                )}
                <p className="m-0 text-xs text-gray-500">{tanggalIndo(n.tanggal_pengumuman || n.createdAt)}</p>
                <h2 className="m-0 mt-1 font-poppins text-base font-bold">{n.judul_notice}</h2>
                {teks && (
                  <p className={`m-0 mt-2 whitespace-pre-line text-sm text-gray-600 ${terbuka ? "" : "line-clamp-3"}`}>{teks}</p>
                )}
                <div className="mt-2 flex gap-3">
                  {teks.length > 160 && (
                    <button type="button" onClick={() => setBuka(terbuka ? null : n.id)} className="text-sm font-semibold text-[#18a558] hover:underline">
                      {terbuka ? "Tutup" : "Baca selengkapnya"}
                    </button>
                  )}
                  {n.file_notice && (
                    <a href={n.file_notice} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-[#18a558] hover:underline">
                      Lampiran
                    </a>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </DataState>
    </WaliPage>
  );
}
