/* eslint-disable jsx-a11y/anchor-is-valid */
import { useDetailPembayaran } from "../../../api/ppdb/pembayaran";
import { useProfileCalonSantri } from "../../../api/ppdb/profile";
import { useDetailWawancara } from "../../../api/ppdb/wawancara";
import LayoutPpdb from "../../../module/layoutPpdb";
import { useState } from "react";
import { FaSearch } from "react-icons/fa"; // Importing the search icon

const PengumumanHasil = () => {
  const { profileData, isLoading, isError, error } = useProfileCalonSantri();
  const { dataWawancara } = useDetailWawancara();

  // Cek apakah wawancara belum dilakukan atau status tes belum "sudah"
  const isWawancaraIncomplete =
    !dataWawancara || dataWawancara.status_tes === "belum";
  const isLulus = dataWawancara && dataWawancara.is_lulus === "lulus";
  const isTidakLulus =
    dataWawancara && dataWawancara.is_lulus === "tidak lulus";
  const isBelumDiUmumkan =
    dataWawancara && dataWawancara.is_lulus === "belum diumumkan";

  return (
    <LayoutPpdb title="Pengumuman Hasil Calon Santri">
      {isWawancaraIncomplete ? (
        <div className="card bg-red-100 p-4 rounded-md shadow-md">
          <p className="text-red-600 font-semibold">
            Silahkan lakukan Ujian & Wawancara terlebih dahulu!
          </p>
        </div>
      ) : isLulus ? (
        <div className="">
          <div className="card bg-green-100 p-4 rounded-md shadow-md">
            <p className="text-green-600 font-semibold">
              Selamat, Anda Lulus Wawancara!
            </p>
          </div>
          <div className="border-2 border-green-400 p-6 mt-4 shadow-md rounded-md">
            <h3 className="text-center text-green-400">
              Selamat Anda {dataWawancara.is_lulus}
            </h3>
            <p className="text-center">
              selamat atas ananda{" "}
              <a className="font-bold text-black">{profileData.nama_siswa}</a>{" "}
              telah resmi menjadi anggota keluarga besar SMK Madinatul Quran
              tahun ajaran 2026/2027
            </p>
            <p className="text-center">
              silahkan untuk melanjutkan biaya daftar ulang
            </p>
          </div>
        </div>
      ) : isTidakLulus ? (
        <div className="">
          <div className="card bg-yellow-100 p-4 rounded-md shadow-md">
            <p className="text-yellow-600 font-semibold">
              Mohon maaf, Anda belum lulus wawancara. Silahkan coba kembali.
            </p>
          </div>
          <div className="border-2 border-gray-200 p-6 mt-4 shadow-md rounded-md">
            <h3 className="text-center">
              Mohon Maaf Anda {dataWawancara.is_lulus}
            </h3>
            <p className="text-center">
              Mohon MAaf atas ananda{" "}
              <a className="font-bold text-black">{profileData.nama_siswa}</a>{" "}
              {dataWawancara.is_lulus} menjadi anggota keluarga besar SMK
              Madinatul Quran tahun ajaran 2026/2027
            </p>
          </div>
        </div>
      ) : isBelumDiUmumkan ? (
        <div className="card bg-yellow-100 p-4 rounded-md shadow-md">
          <p className="text-yellow-600 font-semibold">
            Silahkan Menunggu Hasil Wawancaranya Selesai!
          </p>
        </div>
      ) : (
        <div className=""></div>
      )}
    </LayoutPpdb>
  );
};

export default PengumumanHasil;
