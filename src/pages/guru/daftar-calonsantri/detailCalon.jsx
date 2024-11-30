import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LayoutPage from "../../../module/layoutPage";
import { getCalonSantriById } from "../../../api/guru/calonSiswa";
import { FaFileAlt, FaTimesCircle, FaCheckCircle } from "react-icons/fa";

export default function DetailCalonSantri() {
  const { id } = useParams();
  const [calonSantri, setCalonSantri] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Memanggil API untuk mendapatkan data berdasarkan ID
    getCalonSantriById(id)
      .then((response) => {
        setCalonSantri(response.data.data); // Simpan data ke state
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div>Loading...</div>; // Tampilkan loading jika data sedang dimuat
  }

  return (
    <LayoutPage title="Detail Calon Santri">
      <div className="p-6 bg-white shadow-lg rounded-lg max-w-4xl mx-auto">
        <h1 className="text-3xl font-semibold text-center mb-6">Detail Calon Santri</h1>

        {calonSantri ? (
          <div>
            <div className="space-y-4 mb-6">
              <p className="text-lg">
                <strong>Nama Siswa:</strong> {calonSantri.nama_siswa}
              </p>
              <p className="text-lg">
                <strong>NIK:</strong> {calonSantri.nik}
              </p>
              <p className="text-lg">
                <strong>Tempat Lahir:</strong> {calonSantri.tempat_lahir}
              </p>
              <p className="text-lg">
                <strong>Tanggal Lahir:</strong> {calonSantri.tanggal_lahir}
              </p>
              <p className="text-lg">
                <strong>Alamat:</strong> {calonSantri.alamat}
              </p>
              <p className="text-lg">
                <strong>Sekolah Asal:</strong> {calonSantri.sekolah_asal}
              </p>
              <p className="text-lg">
                <strong>Jenis Kelamin:</strong> {calonSantri.jenis_kelamin}
              </p>
              <p className="text-lg">
                <strong>Anak Ke:</strong> {calonSantri.anak_ke}
              </p>
              <p className="text-lg">
                <strong>Pekerjaan Ayah:</strong> {calonSantri.pekerjaan_ayah}
              </p>
              <p className="text-lg">
                <strong>Pekerjaan Ibu:</strong> {calonSantri.pekerjaan_ibu}
              </p>
              <p className="text-lg">
                <strong>Status Ujian:</strong> {calonSantri.status_ujian}
              </p>
            </div>

            {/* Dokumen Section */}
            <div className="mt-6">
              <p className="text-xl font-semibold mb-4">Dokumen:</p>
              <ul className="space-y-2">
                {[
                  { label: "KK", link: calonSantri.kk },
                  { label: "Ijazah", link: calonSantri.ijazah },
                  { label: "Akte", link: calonSantri.akte },
                  { label: "SKB", link: calonSantri.skb },
                  { label: "Surat Pernyataan", link: calonSantri.surat_pernyataan },
                ].map((doc, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <FaFileAlt className="text-blue-500" />
                    <strong>{doc.label}:</strong>{" "}
                    {doc.link ? (
                      <a
                        href={doc.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        Lihat {doc.label}
                      </a>
                    ) : (
                      <span className="text-gray-500">Tidak Tersedia</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <p>No data available</p>
        )}
      </div>
    </LayoutPage>
  );
}