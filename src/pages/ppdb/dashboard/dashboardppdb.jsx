import { Link, useNavigate } from "react-router-dom";
import LayoutPpdb from "../../../module/layoutPpdb";
import { useProfileCalonSantri } from "../../../api/ppdb/profile";
import { useEffect } from "react";
import ProfileImage from "../../../image/ppdb/profile.png";
import { useDetailPembayaran } from "../../../api/ppdb/pembayaran";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faListCheck,
  faUserPlus,
  faIdCard,
  faMoneyBillWave,
  faFileUpload,
  faClipboardCheck,
  faFileAlt,
} from "@fortawesome/free-solid-svg-icons";

const DashboardPpdb = () => {
  const navigate = useNavigate();
  const { profileData, isLoading, isError, error } = useProfileCalonSantri();
  const { dataPembayaran } = useDetailPembayaran();

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
    return <p className="text-center">Loading...</p>;
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
      profileData.nama_siswa !== null &&
      profileData.nis !== null &&
      profileData.nik !== null &&
      profileData.nisn !== null &&
      profileData.tempat_lahir !== null &&
      profileData.tanggal_lahir !== null &&
      profileData.alamat !== null &&
      profileData.sekolah !== null &&
      profileData.jenis_kelamin !== null &&
      profileData.nama_ayah !== null &&
      profileData.nama_ibu !== null &&
      profileData.pekerjaan_ayah !== null &&
      profileData.pekerjaan_ibu !== null
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
    <LayoutPpdb title="Dashboard PPDB">
      <Link
        to="/ppdb/biodata/update"
        className={`flex items-center p-4 mb-4 text-md text-black hover:text-white ${
          !isDataLengkap(profileData)
            ? "bg-red-300 hover:bg-red-400"
            : "bg-green-300 hover:bg-green-500"
        } rounded-lg transition-colors duration-200`}
        role="alert"
      >
        <p>
          {!isDataLengkap(profileData)
            ? "Silahkan Lengkapi Biodata Diri Anda Terlebih Dahulu!"
            : "Biodata Kamu sudah Lengkap, Terima kasih"}
        </p>
      </Link>

      {/* Alur PSB Online */}
      <div className="flex items-center">
        <FontAwesomeIcon
          icon={faListCheck}
          className="text-green-500 mr-3"
          size="2x"
        />

        <h2 className="text-xl font-semibold pb-7">Alur Pendaftaran Online</h2>
      </div>

      <div className="mt-3 flex flex-col items-center lg:flex-row  justify-center">
        {/* Step 1 - Registrasi  */}
        <Link
          to="/ppdb/biodata/update"
          className={`relative border-2 ${
            !isDataLengkap(profileData)
              ? "border-gray-200 text-gray-400"
              : "border-green-400 text-green-400"
          } bg-imageAbstrak w-full max-w-full sm:max-w-[220px] md:max-w-full h-auto min-h-[260px] flex flex-col items-center justify-center rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out transform hover:-translate-y-2 m-2 p-4`}
        >
          {/* Nomor di Pojok Kiri Atas */}
          <div
            className={`absolute top-2 left-2 border-2 w-8 h-8 flex items-center justify-center rounded-full font-bold shadow-md ${
              !isDataLengkap(profileData)
                ? "border-gray-400 text-gray-400"
                : "border-green-400 text-green-400"
            }`}
          >
            1
          </div>

          <div className="mb-4">
            <FontAwesomeIcon
              icon={faUserPlus}
              className={`text-7xl text-center ${
                !isDataLengkap(profileData) ? "text-gray-400" : "text-green-400"
              }`}
            />
          </div>
          <h3 className="text-xl font-semibold text-black mb-4 text-center">
            Registrasi
          </h3>
          <p className="text-center px-4 text-black">
            {!isDataLengkap(profileData)
              ? "Silahkan Lengkapi Biodata Diri Anda Terlebih Dahulu!"
              : "Alhamdulillah, anda telah resmi menjadi calon santri"}
          </p>
          <button
            className={`px-6 py-2 mt-[30px] rounded-full text-sm font-medium shadow-md transform hover:scale-105 transition-transform duration-300 ${
              !isDataLengkap(profileData)
                ? "bg-white text-gray-500"
                : "bg-green-400 text-white"
            }`}
          >
            {!isDataLengkap(profileData) ? "Belum" : "Selesai"}
          </button>
        </Link>
        {/* Step 2 - Lengkapi Biodata */}
        <Link
          to="/ppdb/biodata/update"
          className={`relative border-2 ${
            !isDataLengkap(profileData)
              ? "border-gray-200 text-gray-400"
              : "border-green-400 text-green-400"
          } bg-imageAbstrak w-full max-w-full sm:max-w-[220px] h-auto min-h-[260px] flex flex-col items-center justify-center rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out transform hover:-translate-y-2 m-2 p-4`}
        >
          {/* Nomor di Pojok Kiri Atas */}
          <div
            className={`absolute top-2 left-2 border-2 w-8 h-8 flex items-center justify-center rounded-full font-bold shadow-md ${
              !isDataLengkap(profileData)
                ? "border-gray-400 text-gray-400"
                : "border-green-400 text-green-400"
            }`}
          >
            2
          </div>

          {/* Icon Lengkapi Biodata */}
          <div className="mb-4">
            <FontAwesomeIcon
              icon={faIdCard}
              className={`text-7xl text-center ${
                !isDataLengkap(profileData) ? "text-gray-400" : "text-green-400"
              }`}
            />
          </div>

          {/* Judul */}
          <h3 className="text-xl font-semibold text-black mb-4 text-center">
            Lengkapi Biodata
          </h3>

          {/* Deskripsi */}
          <p className="text-center px-4 text-black">
            {!isDataLengkap(profileData)
              ? "Silakan lengkapi biodata Anda untuk melanjutkan."
              : "Biodata Anda telah lengkap."}
            <br />
            <Link
              to="/ppdb/biodata/update"
              className="text-black hover:text-gray-500 font-semibold hover:underline"
              onClick={(e) => e.stopPropagation()} // Mencegah klik pada link ini mengaktifkan Link utama
            >
              Cek Biodata
            </Link>
          </p>

          {/* Tombol Status */}
          <button
            className={`px-6 py-2 mt-[40px] rounded-full text-sm font-medium shadow-md transform hover:scale-105 transition-transform duration-300 ${
              !isDataLengkap(profileData)
                ? "bg-white text-gray-500"
                : "bg-green-400 text-white"
            }`}
          >
            {!isDataLengkap(profileData) ? "Belum" : "Selesai"}
          </button>
        </Link>
        {/* Step 3 - Pembayaran PPDB */}
        <Link
          to="/ppdb/bukti-transfer"
          className={`bg-imageAbstrak border-2 ${
            !hasNullPaymentData
                ? dataPembayaran.status === 1
                  ? "border-green-400"
                  : "border-gray-200"
                : "border-gray-200"
          } w-full max-w-full sm:max-w-[220px] h-auto min-h-[260px] flex flex-col items-center justify-center rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out transform hover:-translate-y-2 m-2 p-4`}
        >
          {/* Nomor di Pojok Kiri Atas */}
          <div
            className={`absolute top-2 left-2 border-2 ${
              !hasNullPaymentData
                ? dataPembayaran.status === 1
                  ? "border-green-400 text-green-400"
                  : "border-gray-200 text-gray-500"
                : "border-gray-200 text-gray-500"
            } w-8 h-8 flex items-center justify-center rounded-full font-bold shadow-md`}
          >
            3
          </div>

          {/* Icon Pembayaran */}
          <div className="mb-4">
            <FontAwesomeIcon
              icon={faMoneyBillWave}
              className={`text-7xl text-center ${
                !hasNullPaymentData
                ? dataPembayaran.status === 1
                  ? "text-green-400"
                  : "text-gray-500"
                :  "text-gray-500"
              }`}
            />
          </div>

          {/* Judul */}
          <h3 className="text-xl font-semibold text-black mb-4 text-center">
            Pembayaran PPDB
          </h3>

          {/* Deskripsi */}
          <p className="text-center px-2 sm:px-4 text-black">
            {!hasNullPaymentData
              ? "Anda telah mengunggah bukti pembayaran."
              : "Silakan unggah bukti pembayaran Anda untuk melanjutkan."}
            <br />
            <Link
              to="/ppdb/bukti-transfer"
              className="text-black hover:text-gray-500 font-semibold hover:underline"
              onClick={(e) => e.stopPropagation()} // Menghentikan link ini agar tidak mengaktifkan Link utama
            >
              {dataPembayaran?.status === 1
                ? "Lihat Bukti Pembayaran"
                : "Upload Bukti Pembayaran"}
            </Link>
          </p>

          {/* Tombol Status */}
          <button
            className={`px-6 py-2 mt-4 rounded-full text-sm font-medium shadow-md transform hover:scale-105 transition-transform duration-300 ${
              !hasNullPaymentData
                ? dataPembayaran.status === 1
                  ? "bg-green-400 text-white"
                  : "bg-white-400 text-gray-500"
                : "bg-white text-gray-500"
            }`}
          >
            {/* Teks Status */}
            <p
              className={`${
                !hasNullPaymentData
                  ? dataPembayaran.status === 1
                    ? "text-white"
                    : "text-gray-400"
                  : "text-gray-500"
              }`}
            >
              {!hasNullPaymentData
                ? dataPembayaran.status === 1
                  ? "Selesai"
                  : "Belum"
                : "Belum"}
            </p>
          </button>
        </Link>
        {/* Step 4 - Lengkapi Berkas */}
        <Link
          to="/ppdb/berkas"
          className={`bg-imageAbstrak border-2 w-full max-w-full sm:max-w-[220px] h-auto min-h-[260px] flex flex-col items-center justify-center rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out transform hover:-translate-y-2 m-2 p-4 ${
            isBerkasLengkap(profileData)
              ? "border-green-400 text-green-400"
              : "border-gray-200 text-gray-200"
          }`}
        >
          {/* Nomor di Pojok Kiri Atas */}
          <div
            className={`absolute top-2 left-2 border-2 w-8 h-8 flex items-center justify-center rounded-full font-bold shadow-md ${
              isBerkasLengkap(profileData)
                ? "border-green-400 text-green-400"
                : "border-gray-400 text-gray-300"
            }`}
          >
            4
          </div>

          {/* Icon Lengkapi Berkas */}
          <div className="mb-4">
            <FontAwesomeIcon
              icon={faFileUpload}
              className={`text-7xl text-center ${
                isBerkasLengkap(profileData)
                  ? "text-green-400"
                  : "text-gray-400"
              }`}
            />
          </div>

          {/* Judul */}
          <h3 className="text-xl font-semibold text-black mb-4 text-center">
            Lengkapi Berkas
          </h3>

          {/* Deskripsi */}
          <p className="text-center px-4 text-black">
            {isBerkasLengkap(profileData)
              ? "Anda telah melengkapi semua berkas yang diperlukan."
              : "Silakan lengkapi berkas Anda untuk melanjutkan."}
            <br />
            <Link
              to="/ppdb/biodata/berkas"
              className="text-black font-semibold hover:underline"
              onClick={(e) => e.stopPropagation()} // Mencegah Link utama di card
            >
              Upload Berkas
            </Link>
          </p>

          {/* Tombol Status */}
          <button
            className={`px-6 py-2 rounded-full text-sm font-medium shadow-md transform hover:scale-105 transition-transform duration-300 ${
              isBerkasLengkap(profileData)
                ? "bg-green-400 text-white"
                : "bg-white text-gray-500"
            }`}
          >
            {isBerkasLengkap(profileData) ? "Selesai" : "Belum"}
          </button>
        </Link>
        {/* Step 5 - Tes Masuk */}
        <Link
          to="/ppdb/exam"
          className={`bg-imageAbstrak border-2 w-full max-w-full sm:max-w-[220px] h-auto min-h-[260px] flex flex-col items-center justify-center rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out transform hover:-translate-y-2 m-2 p-4 ${
            hasNullData
              ? "border-gray-200 text-gray-200"
              : "border-green-400 text-green-400"
          }`}
        >
          {/* Nomor di Pojok Kiri Atas */}
          <div
            className={`absolute top-2 left-2 border-2 w-8 h-8 flex items-center justify-center rounded-full font-bold shadow-md ${
              hasNullData
                ? "border-gray-400 text-gray-300"
                : "border-green-400 text-green-400"
            }`}
          >
            5
          </div>

          {/* Icon Tes Masuk */}
          <div className="mb-4">
            <FontAwesomeIcon
              icon={faFileAlt}
              className={`text-7xl text-center ${
                hasNullData ? "text-gray-400" : "text-green-400"
              }`}
            />
          </div>

          {/* Judul */}
          <h3 className="text-xl font-semibold text-black mb-4 text-center">
            Tes Masuk
          </h3>

          {/* Deskripsi */}
          <p className="text-center px-4 text-black">
            {hasNullData
              ? "Anda harus melunasi Biaya Pendaftaran dan melengkapi Biodata serta Berkas untuk mengikuti Tes Masuk."
              : "Anda siap mengikuti Tes Masuk setelah melengkapi semua syarat."}
          </p>

          {/* Tombol Status */}
          <button
            className={`px-6 py-2 rounded-full text-sm font-medium shadow-md transform hover:scale-105 transition-transform duration-300 ${
              hasNullData ? "bg-white text-gray-500" : "bg-green-400 text-white"
            }`}
          >
            {hasNullData ? "Belum" : "Selesai"}
          </button>
        </Link>
        {/* Step 6 - Pengumuman */}
        <Link
          to="/ppdb/hasil-test"
          className={`bg-imageAbstrak border-2 w-full max-w-full sm:max-w-[220px] h-auto min-h-[260px] flex flex-col items-center justify-center rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out transform hover:-translate-y-2 m-2 p-4 ${
            hasNullData
              ? "border-gray-200 text-gray-200"
              : "border-green-400 text-green-400"
          }`}
        >
          {/* Nomor di Pojok Kiri Atas */}
          <div
            className={`absolute top-2 left-2 border-2 w-8 h-8 flex items-center justify-center rounded-full font-bold shadow-md ${
              hasNullData
                ? "border-gray-400 text-gray-300"
                : "border-green-400 text-green-400"
            }`}
          >
            6
          </div>

          {/* Icon Pengumuman Hasil */}
          <div className="mb-4">
            <FontAwesomeIcon
              icon={faClipboardCheck}
              className={`text-7xl text-center ${
                hasNullData ? "text-gray-400" : "text-green-400"
              }`}
            />
          </div>

          {/* Judul */}
          <h3 className="text-xl font-semibold text-black mb-4 text-center">
            Pengumuman Hasil
          </h3>

          {/* Deskripsi */}
          <p className="text-center px-4 text-black">
            {hasNullData
              ? "Anda harus menyelesaikan seluruh rangkaian tes untuk bisa melihat pengumuman hasil tes."
              : "Tes telah selesai. Silakan cek pengumuman hasil tes."}
          </p>

          {/* Tombol Status */}
          <button
            className={`px-6 py-2 rounded-full text-sm font-medium shadow-md transform hover:scale-105 transition-transform duration-300 ${
              hasNullData ? "bg-white text-gray-500" : "bg-green-400 text-white"
            }`}
          >
            {hasNullData ? "Belum" : "Selesai"}
          </button>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        {/* Card Pembayaran */}
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
              className="inline-block mt-8 md:mt-12 px-6 md:px-8 py-4 md:py-3 text-sm md:text-base text-white hover:text-white bg-green-400 rounded-full hover:bg-green-700 transition-colors duration-200 shadow-md"
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
              className="w-24 h-24 rounded-full mb-2 mt-6 border-2 border-black shadow-md"
            />
            <h3 className="text-xl font-semibold mb-4">
              {profileData.nama_siswa}
            </h3>{" "}
            {/* Ganti dengan nama yang sesuai */}
            {/* Status */}
            <div
              className={`flex items-center p-4 mb-4 text-md text-black hover:text-white ${
                !isDataLengkap(profileData)
                  ? "bg-red-300 hover:bg-red-500"
                  : "bg-green-300 hover:bg-green-500"
              } rounded-lg transition-colors duration-200`}
              role="alert"
            >
              <p>
                {!isDataLengkap(profileData)
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
              className="inline-block mt-4 px-6 md:py-2 py-4 text-white hover:text-white bg-green-400 rounded-lg hover:bg-green-700 transition-colors duration-200"
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
              className="inline-block mt-8 px-8 py-3 text-white hover:text-white bg-green-400 rounded-full hover:bg-green-700 transition-colors duration-200 shadow-md"
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