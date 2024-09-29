import { Link, useNavigate } from "react-router-dom";
import LayoutPpdb from "../../../module/layoutPpdb";
import { useProfileCalonSantri } from "../../../api/ppdb/profile";
import { useEffect, useState } from "react";
import ProfileImage from "../../../image/ppdb/profile.png";
import {
  ListLampiranBuktiTransfer,
  ListPembayaran,
  useGetHasilPembayaran,
} from "../../../api/ppdb/pembayaran";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListCheck, faCheck } from "@fortawesome/free-solid-svg-icons";
const DashboardPpdb = () => {
  const navigate = useNavigate();
  const { profileData, isLoading, isError, error } = useProfileCalonSantri();
  const { dataPb, isFetching } = useGetHasilPembayaran(); // Ambil data pembayaran

  // Cek apakah dataPb ada dan merupakan array, kemudian cek apakah user sudah pernah meng-upload bukti transfer
  const isPembayaranSelesai =
    Array.isArray(dataPb) && dataPb.some((pembayaran) => pembayaran.bukti_tf);
  useEffect(() => {
    if (isError && error?.response?.status === 404) {
      navigate("/ppdb/pendaftaran");
    }

    if (isError && error?.response?.status === 403) {
      alert("Anda Tidak Memiliki Akses ke Halaman Dashboard");
      navigate("/landingpage/login");
    }
  }, [isError, error, navigate]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error loading profile data: {error.message}</p>;
  }

  if (!profileData) {
    return <p>No profile data available</p>;
  }

  const hasNullData = Object.values(profileData).some(
    (value) => value === null
  );

  const isBerkasLengkap = (profileData) => {
    return (
      profileData.kk &&
      profileData.skb &&
      profileData.ijazah &&
      profileData.akte &&
      profileData.surat_pernyataan
    );
  };

  return (
    <LayoutPpdb title="Halaman Utama">
      <Link
        to="/ppdb/biodata/update"
        className={`flex items-center p-4 mb-4 text-md text-black hover:text-white ${
          hasNullData & isBerkasLengkap
            ? "bg-red-300 hover:bg-red-400"
            : "bg-green-300 hover:bg-green-500"
        } rounded-lg transition-colors duration-200`}
        role="alert"
      >
        <p>
          {hasNullData & isBerkasLengkap
            ? "Silahkan Lengkapi Biodata Diri Anda Terlebih Dahulu!"
            : "Biodata Kamu sudah Lengkap, Terima kasih"}
        </p>
      </Link>
      <div>
        <h2>Status Berkas:</h2>
        {/* Cek apakah berkas lengkap atau tidak */}
        {isBerkasLengkap(profileData) ? (
          <p>Status: Selesai</p>
        ) : (
          <p>Status: Belum</p>
        )}
      </div>

      {/* <div className="p-4 border-b border-gray-300">
        <h2 className="text-lg font-semibold mb-4">Data Profil Calon Santri</h2>
        <p>Nama Calon Santri: {profileData.nama_siswa}</p>
        <p>Jenis Kelamin: {profileData.jenis_kelamin}</p>
        <p>Tempat Lahir: {profileData.tempat_lahir}</p>
        <p>Tanggal Lahir: {profileData.tanggal_lahir}</p>
        <p>Alamat: {profileData.alamat}</p>
        <p>NIK: {profileData.nik}</p>
        <p>NIS: {profileData.nis}</p>
        <p>NISN: {profileData.nisn}</p>
        <p>Asal Sekolah: {profileData.sekolah_asal}</p>
        <p>Nama Ayah: {profileData.nama_ayah}</p>
        <p>Pekerjaan Ayah: {profileData.pekerjaan_ayah}</p>
        <p>Nama Ibu: {profileData.nama_ibu}</p>
        <p>Pekerjaan Ibu: {profileData.pekerjaan_ibu}</p>
        <p>Nama Wali: {profileData.nama_wali}</p>
        <p>Hubungan dengan Wali: {profileData.hubungan}</p>
        <p>Kartu Keluarga: {profileData.kk}</p>
        <p>Ijazah Sekolah: {profileData.ijazah}</p>
        <p>Akte Kelahiran: {profileData.akte}</p>
        <p>Surat Pernyataan: {profileData.surat_pernyataan}</p>
      </div> */}

      <div className="p-4 border-b border-gray-300">
        <div className="space-y-6">
          {/* Alur PSB Online */}
          <div className="flex items-center">
            <FontAwesomeIcon
              icon={faListCheck}
              className="text-green-500 mr-3"
              size="2x"
            />
            <h2 className="text-xl font-semibold pb-7">Alur PSB Online</h2>
          </div>

          {/* Alur */}
          <div className="space-y-4">
            {/* Step 1 */}
            <div className="flex items-start justify-between">
              <div className="flex items-start">
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${
                    hasNullData & isBerkasLengkap
                      ? "border-gray-500 text-gray-500"
                      : "border-green-500 text-green-500"
                  }  font-semibold`}
                >
                  01
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold mb-1">
                    Registrasi Akun
                  </h3>
                  <p>
                    {hasNullData & isBerkasLengkap
                      ? "Silahkan Lengkapi Biodata Diri Anda Terlebih Dahulu!"
                      : "Alhamdulillah, anda telah resmi menjadi calon santri"}
                  </p>
                  {/* <p>Alhamdulillah, anda telah resmi menjadi calon santri</p> */}
                </div>
              </div>
              <div className="">
                <p
                  className={`${
                    hasNullData & isBerkasLengkap
                      ? "text-gray-600"
                      : "text-green-600"
                  }`}
                >
                  {hasNullData & isBerkasLengkap ? "Belum" : "Selesai"}
                </p>
              </div>
            </div>
            <div className="border-l-2 border-gray-300 ml-6"></div>

            {/* Step 2 */}
            <div className="flex items-start justify-between">
              <div className="flex items-start">
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${
                    isPembayaranSelesai
                      ? "border-green-500 text-green-500"
                      : "border-gray-500 text-gray-500"
                  } font-semibold`}
                >
                  04
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold mb-1">
                    Pembayaran PPDB
                  </h3>
                  <p>
                    {isPembayaranSelesai
                      ? "Anda telah mengunggah bukti pembayaran."
                      : "Silakan unggah bukti pembayaran Anda untuk melanjutkan."}{" "}
                    <Link
                      to="/ppdb/transfer"
                      className="text-green-500 font-semibold hover:underline"
                    >
                      Upload Bukti Pembayaran
                    </Link>
                  </p>
                </div>
              </div>
              <div className="">
                <p
                  className={`${
                    isPembayaranSelesai ? "text-green-600" : "text-gray-600"
                  }`}
                >
                  {isPembayaranSelesai ? "Selesai" : "Belum"}
                </p>
              </div>
            </div>
            <div className="border-l-2 border-gray-300 ml-6"></div>

            {/* Step 3 */}
            <div className="flex items-start justify-between">
              <div className="flex items-start">
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${
                    hasNullData & isBerkasLengkap
                      ? "border-gray-500 text-gray-500"
                      : "border-green-500 text-green-500"
                  } font-semibold`}
                >
                  03
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold mb-1">
                    Lengkapi Biodata
                  </h3>
                  <p>
                    {hasNullData & isBerkasLengkap
                      ? "Silakan lengkapi biodata Anda untuk melanjutkan."
                      : "Biodata Anda telah lengkap."}{" "}
                    <Link
                      to="/ppdb/biodata/update"
                      className="text-green-500 font-semibold hover:underline"
                    >
                      Cek Biodata
                    </Link>
                  </p>
                </div>
              </div>
              <div className="">
                <p
                  className={`${
                    hasNullData & isBerkasLengkap
                      ? "text-gray-600"
                      : "text-green-600"
                  }`}
                >
                  {hasNullData & isBerkasLengkap ? "Belum" : "Selesai"}
                </p>
              </div>
            </div>
            <div className="border-l-2 border-gray-300 ml-6"></div>

            {/* Step 4 */}
            <div className="flex items-start justify-between">
              <div className="flex items-start">
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${
                    isBerkasLengkap(profileData)
                      ? "border-green-500 text-green-500"
                      : "border-gray-500 text-gray-500"
                  } font-semibold`}
                >
                  04
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold mb-1">
                    Lengkapi Berkas
                  </h3>
                  <p>
                    {isBerkasLengkap(profileData)
                      ? "Anda telah melengkapi semua berkas yang diperlukan."
                      : "Silakan lengkapi berkas Anda untuk melanjutkan."}{" "}
                    <Link
                      to="/ppdb/biodata/berkas"
                      className="text-green-500 font-semibold hover:underline"
                    >
                      Upload Berkas
                    </Link>
                  </p>
                </div>
              </div>
              <div className="">
                <p
                  className={`${
                    isBerkasLengkap(profileData)
                      ? "text-green-600"
                      : "text-gray-600"
                  }`}
                >
                  {isBerkasLengkap(profileData) ? "Selesai" : "Belum"}
                </p>
              </div>
            </div>

            <div className="border-l-2 border-gray-300 ml-6"></div>

            {/* Step 5 */}
            <div className="flex items-start justify-between">
              <div className="flex items-start">
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${
                    hasNullData
                      ? "border-gray-500 text-gray-500"
                      : "border-green-500 text-green-500"
                  } font-semibold`}
                >
                  05
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold mb-1">Tes Masuk</h3>
                  <p>
                    {hasNullData
                      ? "Anda harus melunasi Biaya Pendaftaran dan melengkapi Biodata serta Berkas untuk mengikuti Tes Masuk."
                      : "Anda siap mengikuti Tes Masuk setelah melengkapi semua syarat."}
                  </p>
                </div>
              </div>
              <div className="">
                <p
                  className={`${
                    hasNullData ? "text-gray-600" : "text-green-600"
                  }`}
                >
                  {hasNullData ? "Belum" : "Selesai"}
                </p>
              </div>
            </div>
            <div className="border-l-2 border-gray-300 ml-6"></div>
            {/* Step 6 */}
            <div className="flex items-start justify-between">
              <div className="flex items-start">
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${
                    hasNullData
                      ? "border-gray-500 text-gray-500"
                      : "border-green-500 text-green-500"
                  } font-semibold`}
                >
                  06
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold mb-1">
                    Pengumuman Hasil Tes
                  </h3>
                  <p>
                    {hasNullData
                      ? "Anda harus menyelesaikan seluruh rangkaian tes untuk bisa melihat pengumuman hasil tes."
                      : "Tes telah selesai. Silakan cek pengumuman hasil tes."}
                  </p>
                </div>
              </div>
              <div className="">
                <p
                  className={`${
                    hasNullData ? "text-gray-600" : "text-green-600"
                  }`}
                >
                  {hasNullData ? "Belum" : "Selesai"}
                </p>
              </div>
            </div>
            <div className="border-l-2 border-gray-300 ml-6"></div>
            {/* Step 7 */}
            <div className="flex items-start justify-between">
              <div className="flex items-start">
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${
                    hasNullData
                      ? "border-gray-500 text-gray-500"
                      : "border-green-500 text-green-500"
                  } font-semibold`}
                >
                  07
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold mb-1">Daftar Ulang</h3>
                  <p>
                    {hasNullData
                      ? "Menunggu pengumuman hasil tes."
                      : "Anda telah berhasil melakukan daftar ulang."}
                  </p>
                </div>
              </div>
              <div className="">
                <p
                  className={`${
                    hasNullData ? "text-gray-600" : "text-green-600"
                  }`}
                >
                  {hasNullData ? "Belum" : "Selesai"}
                </p>
              </div>
            </div>
            <div className="border-l-2 border-gray-300 ml-6"></div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        {/* Card Utama */}
        <div className="mt-6 p-4 bg-white shadow-md rounded-lg w-[450px] border-2">
          <div className="flex flex-col">
            <h3 className="text-xl font-semibold mb-4">Bukti Transfer</h3>
            <p>Biaya Pendaftaran</p>
          </div>
          <p className="mt-6">
            Apabila anda sudah transfer biaya pendaftaran, silahkan upload bukti
            transfernya melalui menu di bawah ini.
          </p>

          {/* Tambahkan Card di dalam Card utama dengan status pembayaran */}
          <div
            className={`mt-12 p-4 ${
              isPembayaranSelesai ? "bg-green-300" : "bg-red-300"
            } text-black rounded-lg text-xl font-semibold flex items-center justify-between shadow-xl`}
          >
            Rp.450.000
            <div className="text-black font-medium text-sm">
              {isPembayaranSelesai ? "Selesai" : "Belum Transfer"}
            </div>
          </div>
          <div className="flex justify-center">
            <Link
              to="/ppdb/transfer"
              className="inline-block mt-12 px-6 py-2 text-white hover:text-white bg-green-500 rounded-lg hover:bg-green-700 transition-colors duration-200"
            >
              Upload Bukti Transfer
            </Link>
          </div>
        </div>
        {/* Tambahkan Card Profile */}
        <div className="mt-6 p-4 bg-white shadow-md rounded-lg w-[450px] border-2">
          <div className="flex flex-col items-center bg-gray-100 p-4 rounded-lg">
            <img
              src={ProfileImage}
              alt="Foto Profil"
              className="w-24 h-24 rounded-full mb-2 mt-6 border-2 border-black shadow-md" // Border hitam dengan shadow
            />
            <h3 className="text-xl font-semibold mb-4">
              {profileData.nama_siswa}
            </h3>{" "}
            {/* Ganti dengan nama yang sesuai */}
            {/* Status */}
            <div
              className={`flex items-center p-4 mb-4 text-md text-black hover:text-white ${
                hasNullData
                  ? "bg-red-300 hover:bg-red-500"
                  : "bg-green-300 hover:bg-green-500"
              } rounded-lg transition-colors duration-200`}
              role="alert"
            >
              <p>
                {hasNullData
                  ? "Belum Verifikasi Biodata"
                  : "Berhasil Verfikasi Biodata"}
              </p>
            </div>
            {/* Ganti dengan status yang sesuai */}
          </div>

          <p className="mt-6 text-center">
            Apabila ada perubahan data profil, silahkan perbarui melalui menu di
            bawah ini.
          </p>

          <div className="flex justify-center">
            <Link
              to="/ppdb/biodata/update"
              className="inline-block mt-4 px-6 py-2 text-white hover:text-white bg-green-500 rounded-lg hover:bg-green-700 transition-colors duration-200"
            >
              Perbarui Profil
            </Link>
          </div>
        </div>
      </div>
    </LayoutPpdb>
  );
};

export default DashboardPpdb;
