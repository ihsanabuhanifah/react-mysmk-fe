import { Link, useNavigate } from "react-router-dom";
import LayoutPpdb from "../../../module/layoutPpdb";
import { useProfileCalonSantri } from "../../../api/ppdb/profile";
import { useEffect } from "react";

const BiayaPendaftaran = () => {
  const navigate = useNavigate();
  const { profileData, isLoading, isError, error } = useProfileCalonSantri();

  useEffect(() => {
    if (isError && error?.response?.status === 404) {
      navigate("/ppdb/pendaftaran"); // Ganti dengan path yang sesuai untuk halaman pendaftaran
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

  // Cek apakah ada nilai dalam data yang null
  const hasNullData = Object.values(profileData).some(
    (value) => value === null
  );

  return (
    <LayoutPpdb title="Biaya Pendaftaran">
      <p>Ini halaman Biaya Pendafatarn PPDB</p>

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

      <div className=""></div>
    </LayoutPpdb>
  );
};

export default BiayaPendaftaran;
