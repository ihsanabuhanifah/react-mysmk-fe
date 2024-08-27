import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import LayoutPpdb from "../../../module/layoutPpdb";
import { getProfileCalonSantri, useProfileCalonSantri } from "../../../api/ppdb/profile";
import { useQuery } from "react-query";

const DashboardPpdb = () => {
  const { profileData, isLoading, isError, error } = useProfileCalonSantri();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error loading profile data: {error.message}</p>;
  }

  if (!profileData) {
    return <p>No profile data available</p>;
  }

  return (
    <LayoutPpdb title="Dashboard">
      <Link
        to="/ppdb/biodata/update"
        className="flex items-center p-4 mb-4 text-md text-black hover:text-white bg-green-300 rounded-lg hover:bg-green-500 transition-colors duration-200"
        role="alert"
      >
        <p>Silahkan Lengkapi Biodata Diri Anda Terlebih Dahulu!</p>
      </Link>
      <p>Ini halaman dashboard PPDB</p>

      <div className="p-4 border-b border-gray-300">
        <h2 className="text-lg font-semibold mb-4">Data Profil Calon Santri</h2>
        <p>Data: {profileData.nama_siswa}</p>
        <p>Jenis Kelamin: {profileData.jenis_kelamin}</p>
        <p>Tempat Lahir: {profileData.tempat_lahir}</p>
        <p>Tanggal Lahir: {profileData.tanggal_lahir}</p>
        <p>Alamat: {profileData.alamat}</p>
        <p>NIK: {profileData.nik}</p>
        <p>NIS: {profileData.nis}</p>
        <p>NISN: {profileData.nisn}</p>
        <p>Sekolah Asal: {profileData.sekolah_asal}</p>
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
      </div>
    </LayoutPpdb>
  );
};

export default DashboardPpdb;