import { Link, useNavigate } from "react-router-dom";
import LayoutPpdb from "../../../module/layoutPpdb";
import { useProfileCalonSantri } from "../../../api/ppdb/profile";
import { useEffect, useState } from "react";
import ProfileImage from "../../../image/ppdb/profile.png";
import {
  ListLampiranBuktiTransfer,
  ListPembayaran,
  useDetailPembayaran,
  useGetHasilPembayaran,
} from "../../../api/ppdb/pembayaran";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListCheck, faCheck } from "@fortawesome/free-solid-svg-icons";
import { object } from "yup";
const DashboardPpdb = () => {
  const navigate = useNavigate();
  const { profileData, isLoading, isError, error } = useProfileCalonSantri();
  const { dataPb, isFetching } = useDetailPembayaran(); // Ambil data pembayaran
  const { dataPembayaran } = useDetailPembayaran();

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

  const hasNullData =
    !profileData || Object.values(profileData).some((value) => value === null);

  // Check for null values in payment data
  const hasNullPaymentData =
    !dataPembayaran ||
    Object.values(dataPembayaran).some((value) => value === null);

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

  return (
    <LayoutPpdb title="Halaman Utama">
      <Link
        to="/ppdb/biodata/update"
        className={`flex items-center p-4 mb-4 text-md text-black hover:text-white ${
          hasNullData
            ? "bg-red-300 hover:bg-red-400"
            : "bg-green-300 hover:bg-green-500"
        } rounded-lg transition-colors duration-200`}
        role="alert"
      >
        <p>
          {hasNullData
            ? "Silahkan Lengkapi Biodata Diri Anda Terlebih Dahulu!"
            : "Biodata Kamu sudah Lengkap, Terima kasih"}
        </p>
      </Link>

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
                    hasNullData
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
                    {hasNullData
                      ? "Silahkan Lengkapi Biodata Diri Anda Terlebih Dahulu!"
                      : "Alhamdulillah, anda telah resmi menjadi calon santri"}
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

            {/* Step 2 */}
            <div className="flex items-start justify-between">
              <div className="flex items-start">
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${
                    !hasNullPaymentData
                      ? dataPembayaran.status === 1
                        ? "border-green-500 text-green-500"
                        : "border-gray-500 text-gray-500"
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
                    {!hasNullPaymentData
                      ? "Anda telah mengunggah bukti pembayaran."
                      : "Silakan unggah bukti pembayaran Anda untuk melanjutkan."}{" "}
                    <Link
                      to="/ppdb/bukti-transfer"
                      className="text-green-500 font-semibold hover:underline"
                    >
                      {dataPembayaran?.status === 1
                        ? "Lihat Bukti Pembayaran"
                        : "Upload Bukti Pembayaran"}
                    </Link>
                  </p>
                </div>
              </div>
              <div className="">
                <p
                  className={`${
                    !hasNullPaymentData
                      ? dataPembayaran.status === 1
                        ? "text-green-600"
                        : "text-gray-600"
                      : "text-gray-600"
                  }`}
                >
                  {!hasNullPaymentData
                    ? dataPembayaran.status === 1
                      ? "Selesai"
                      : "Belum"
                    : "Belum"}
                </p>
              </div>
            </div>

            <div className="border-l-2 border-gray-300 ml-6"></div>

            {/* Step 3 */}
            <div className="flex items-start justify-between">
              <div className="flex items-start">
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${
                    hasNullData
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
                    {hasNullData
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
                    hasNullData ? "text-gray-600" : "text-green-600"
                  }`}
                >
                  {hasNullData ? "Belum" : "Selesai"}
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
        <div className="mt-6 md:p-6 p-12 bg-gradient-to-r from-green-50 to-white shadow-lg rounded-xl w-full  md:w-[450px] border border-gray-300">
          <div className="flex flex-col items-center">
            <h3 className="text-xl md:text-2xl font-bold text-green-600 mb-4">
              Bukti Transfer
            </h3>
            <p className="text-lg font-medium text-gray-700">
              Biaya Pendaftaran
            </p>
          </div>
          <p className="mt-4 text-gray-600 text-center text-sm md:text-base">
            Apabila anda sudah transfer biaya pendaftaran, silahkan upload bukti
            transfernya melalui menu di bawah ini.
          </p>

          {/* Tambahkan Card di dalam Card utama dengan status pembayaran */}
          <div
            className={`mt-8 md:p-4 p-6 ${
              !dataPembayaran ||
              hasNullPaymentData ||
              dataPembayaran?.status === 0
                ? "bg-red-200"
                : "bg-green-200"
            } text-black rounded-lg text-base md:text-xl font-semibold flex items-center justify-between shadow-md`}
          >
            <span className="font-bold">Rp 450.000</span>
            <div
              className={`font-medium text-sm ${
                !dataPembayaran ||
                hasNullPaymentData ||
                dataPembayaran?.status === 0
                  ? "text-red-700"
                  : "text-green-700"
              }`}
            >
              {!dataPembayaran || hasNullPaymentData
                ? "Belum Transfer"
                : dataPembayaran?.status === 1
                ? "Selesai"
                : "Belum"}
            </div>
          </div>

          <div className="flex justify-center">
            <Link
              to="/ppdb/bukti-transfer"
              className="inline-block mt-8 md:mt-12 px-6 md:px-8 py-4 md:py-3 text-sm md:text-base text-white hover:text-white bg-green-600 rounded-full hover:bg-green-700 transition-colors duration-200 shadow-md"
            >
              {!dataPembayaran || hasNullPaymentData
                ? "Upload Bukti Transfer"
                : dataPembayaran?.status === 1
                ? "Lihat Bukti Transfer"
                : "Upload Bukti Transfer"}
            </Link>
          </div>
        </div>

        {/* Card Profile */}
        <div className="mt-6 p-4 bg-white shadow-md rounded-lg md:w-[450px] w-full border-2">
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
              className="inline-block mt-4 px-6 md:py-2 py-4 text-white hover:text-white bg-green-500 rounded-lg hover:bg-green-700 transition-colors duration-200"
            >
              Perbarui Profil
            </Link>
          </div>
        </div>

        {/* Card Tes Calon Santri */}
        <div className="mt-6 p-6 bg-gradient-to-r from-green-50 to-white shadow-lg rounded-xl md:w-[450px] w-full border border-gray-300">
          <div className="flex flex-col items-center">
            <h3 className="text-2xl font-bold text-green-600 mb-4">
              Tes Calon Santri
            </h3>
            <p className="text-lg font-medium text-gray-700">
              Biaya Pendaftaran
            </p>
          </div>
          <p className="mt-4 text-gray-600 text-center">
            Apabila anda sudah transfer biaya pendaftaran, maka anda dapat
            mengikuti tes berikut:
          </p>
          <ul className="mt-4 space-y-2">
            <li className="flex items-center text-gray-700">
              <svg
                className="w-5 h-5 mr-2 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 9h4a1 1 0 110 2H8a1 1 0 110-2zm0-3h4a1 1 0 110 2H8a1 1 0 110-2z"></path>
              </svg>
              Tes Baca Al-quran
            </li>
            <li className="flex items-center text-gray-700">
              <svg
                className="w-5 h-5 mr-2 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 9h4a1 1 0 110 2H8a1 1 0 110-2zm0-3h4a1 1 0 110 2H8a1 1 0 110-2z"></path>
              </svg>
              Tes Matematika
            </li>
            <li className="flex items-center text-gray-700">
              <svg
                className="w-5 h-5 mr-2 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 9h4a1 1 0 110 2H8a1 1 0 110-2zm0-3h4a1 1 0 110 2H8a1 1 0 110-2z"></path>
              </svg>
              Tes Bahasa Inggris
            </li>
            <li className="flex items-center text-gray-700">
              <svg
                className="w-5 h-5 mr-2 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 9h4a1 1 0 110 2H8a1 1 0 110-2zm0-3h4a1 1 0 110 2H8a1 1 0 110-2z"></path>
              </svg>
              Tes Psikotes
            </li>
          </ul>
          <div className="flex justify-center">
            <Link
              to="/ppdb/exam"
              className="inline-block mt-8 px-8 py-3 text-white hover:text-white bg-green-600 rounded-full hover:bg-green-700 transition-colors duration-200 shadow-md"
            >
              Lihat Ujian
            </Link>
          </div>
        </div>
      </div>
    </LayoutPpdb>
  );
};

export default DashboardPpdb;
