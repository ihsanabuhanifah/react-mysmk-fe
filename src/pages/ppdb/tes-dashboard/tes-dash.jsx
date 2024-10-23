import React from "react";
import { useDetailPembayaran } from "../../../api/ppdb/pembayaran";
import { useProfileCalonSantri } from "../../../api/ppdb/profile";
import LayoutPpdb from "../../../module/layoutPpdb";

export default function TesDashboard() {
  const { profileData, isLoading, isError, error } = useProfileCalonSantri();
  const { dataPb, isFetching } = useDetailPembayaran(); // Ambil data pembayaran
  const hasNullData =
    !profileData || Object.values(profileData).some((value) => value === null);

  const isPembayaranSelesai =
    Array.isArray(dataPb) && dataPb.some((pembayaran) => pembayaran.bukti_tf);

  const isDataLengkap = (profileData) => {
    return (
      profileData.nama_siswa &&
      profileData.nis &&
      profileData.nik &&
      profileData.nisn &&
      profileData.tempat_lahir &&
      profileData.tanggal_lahir &&
      profileData.alamat &&
      profileData.sekolah &&
      profileData.jenis_kelamin &&
      profileData.nama_ayah &&
      profileData.nama_ibu &&
      profileData.pekerjaan_ayah &&
      profileData.pekerjaan_ibu
    );
  };

  const isBerkasLengkap = (profileData) => {
    return (
      profileData.kk &&
      profileData.skb &&
      profileData.ijazah &&
      profileData.akte &&
      profileData.surat_pernyataan
    );
  };

  const data = [
    {
      title: "Registrasi Akun",
      status: hasNullData ? "Belum Selesai" : "Selesai",
      icon: "📝",
    },
    {
      title: "Pembayaran PPDB",
      subtitle: "Lihat Bukti Pembayaran",
      status: isPembayaranSelesai ? "Selesai" : "Belum Selesai",
      icon: "💼",
    },
    {
      title: "Lengkapi Biodata",
      subtitle: "Cek Biodata",
      status: hasNullData ? "Belum Selesai" : "Selesai",
      icon: "👤",
    },
    {
      title: "Lengkapi Berkas",
      subtitle: "Upload Berkas",
      status: isBerkasLengkap(profileData) ? "Selesai" : "Belum Selesai",
      icon: "📄",
    },
    { title: "Tes Masuk", status: "Belum Selesai", icon: "📝" },
    {
      title: "Pengumuman Hasil Tes",
      subtitle: "Harap untuk menyelesaikan Tes terlebih dahulu",
      status: "Belum Selesai",
      icon: "📢",
    },
    { title: "Daftar Ulang", status: "Belum Selesai", icon: "🔄" },
  ];
  return (
    <LayoutPpdb>
      Tes Halaman Dashboard Terbaru
      {/* Step-based progress */}
      <div className="grid grid-cols-2 gap-8 p-10">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="text-6xl mb-4">{item.icon}</div>
            <h3 className="text-lg font-bold mb-2">{item.title}</h3>
            {item.subtitle && <p className="text-sm mb-2">{item.subtitle}</p>}
            <button
              className={`px-4 py-2 rounded-full ${
                item.status === "Selesai"
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {item.status}
            </button>
          </div>
        ))}
      </div>
    </LayoutPpdb>
  );
}
