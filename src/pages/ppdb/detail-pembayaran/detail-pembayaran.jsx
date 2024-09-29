import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetHasilPembayaranDetail } from "../../../api/ppdb/pembayaran";
import { useProfileCalonSantri } from "../../../api/ppdb/profile";

const DetailPembayaran = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetHasilPembayaranDetail(id);
  const { profileData } = useProfileCalonSantri();
  const [showPopup, setShowPopup] = useState(false);

  const handlePopupToggle = () => {
    setShowPopup(!showPopup);
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading data.</p>;

  return (
    <div>
      {/* Card Section */}
      <div className="bg-white shadow-lg rounded-lg p-6 w-full mx-auto mt-8">
        <h2 className="text-2xl font-bold mb-4">Panduan Pembayaran Pendaftaran</h2>

        <div className="mb-4">
          <p className="text-gray-700">
            Kepada ananda <span>{profileData.nama_siswa}</span>, harap melunasi biaya
            pendaftaran sebagai syarat untuk bisa mengikuti rangkaian proses penerimaan
            santri baru SMK Madinatul Quran.
          </p>
          <p className="text-gray-700 flex flex-col">
            Nominal yang harus dibayarkan sebesar:
            <span className="font-semibold text-green-600 text-xl">450.000</span>
          </p>
        </div>

        <div className="flex flex-col items-start mt-4">
          <p className="text-lg font-semibold">Untuk pembayarannya dapat dibayarkan ke rekening berikut:</p>
          <p className="text-lg font-bold text-gray-500">
            Bank Muamalat
            <br />
            Nomor Rekening: 3310006100
            <br />
            Kode Bank: (147)
            <br />
            Atas Nama: Yayasan Wisata Al Islam
          </p>
        </div>

        <div className="mt-6">
          <p>
            Setelah melakukan pembayaran, mohon untuk melampirkan Bukti Transfer melalui menu di bawah ini:
          </p>
        </div>
      </div>

      <h1 className="text-2xl font-bold mt-8">Detail Pembayaran</h1>
      {data ? (
        <div className="bg-white shadow-lg rounded-lg p-6 w-full mx-auto mt-8">
          <p>
            <strong>ID Pembayaran:</strong> {data.id}
          </p>
          <p>
            <strong>ID User:</strong> {data.user_id}
          </p>
          <p>
            <strong>Nominal:</strong> {data.nominal}
          </p>
          <p>
            <strong>Keterangan:</strong> {data.keterangan}
          </p>

          <button
            onClick={handlePopupToggle}
            className="bg-blue-500 text-white px-4 py-2 mt-4 rounded"
          >
            Lihat Detail
          </button>

          {/* Pop-up untuk menampilkan bukti transfer */}
          {showPopup && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
              onClick={handlePopupToggle}
            >
              <div
                className="bg-white p-6 rounded-lg shadow-lg relative"
                onClick={(e) => e.stopPropagation()} // Prevent click inside pop-up from closing it
              >
                {data.bukti_tf ? (
                  <img
                    src={data.bukti_tf}
                    alt="Bukti Transfer"
                    style={{ width: "300px", height: "auto" }}
                  />
                ) : (
                  <p>Bukti transfer tidak tersedia.</p>
                )}
                <button
                  onClick={handlePopupToggle}
                  className="bg-red-500 text-white px-4 py-2 mt-4 rounded absolute top-2 right-2"
                >
                  Tutup
                </button>
              </div>
            </div>
          )}

          <p className="mt-4">
            <strong>Nama Guru:</strong> {data.guru.nama_guru}
          </p>
        </div>
      ) : (
        <p>No data found.</p>
      )}
    </div>
  );
};

export default DetailPembayaran;
