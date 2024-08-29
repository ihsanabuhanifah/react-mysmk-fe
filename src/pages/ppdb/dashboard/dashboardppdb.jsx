import { Link, useNavigate } from "react-router-dom";
import LayoutPpdb from "../../../module/layoutPpdb";
import { useProfileCalonSantri } from "../../../api/ppdb/profile";
import { useEffect, useState } from "react";
import { ListTestimoni } from "../../../api/ppdb/testimoni";
import { ListMitraSekolah } from "../../../api/ppdb/mitraSekolah";
import { ListGallery } from "../../../api/ppdb/gallery";
import { ListFasilitas } from "../../../api/ppdb/fasilitas";
const DashboardPpdb = () => {
  const navigate = useNavigate();
  const { profileData, isLoading, isError, error } = useProfileCalonSantri();
  const [testimoniData, setTestimoniData] = useState([]);
  const [mitraData, setMitraData] = useState([]);
  const [galleryData, setGalleryData] = useState([]);
  const [fasilitasData, setFasilitasData] = useState([]); 
  useEffect(() => {
    if (isError && error?.response?.status === 404) {
      navigate("/ppdb/pendaftaran");
    }
  }, [isError, error, navigate]);

  useEffect(() => {
    // Panggil API ListTestimoni
    ListTestimoni()
      .then((response) => {
        setTestimoniData(response.data.data);
      })
      .catch((err) => {
        console.error("Error fetching testimoni data:", err);
      });

    // Panggil API ListMitraSekolah
    ListMitraSekolah()
      .then((response) => {
        setMitraData(response.data.data);
      })
      .catch((err) => {
        console.error("Error fetching mitra data:", err);
      });

    ListGallery()
      .then((respone) => {
        setGalleryData(respone.data.data);
      })
      .catch((err) => {
        console.error("Error fetching mitra data:", err);
      });

      ListFasilitas().then((respone)=> {
        setFasilitasData(respone.data.data);
      }).catch((err) => {
        console.error("Error fetching mitra data:", err);
      })
  }, []);

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

  return (
    <LayoutPpdb title="Halaman Utama">
      <Link
        to="/ppdb/biodata/update"
        className={`flex items-center p-4 mb-4 text-md text-black hover:text-white ${
          hasNullData
            ? "bg-red-300 hover:bg-red-500"
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
      <p>Ini halaman dashboard PPDB</p>

      <div className="p-4 border-b border-gray-300">
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
      </div>

      {/* Tambahkan Card utama */}
      <div className="mt-6 p-4 bg-white shadow-md rounded-lg w-[450px] border-2">
        <div className="flex flex-col">
          <h3 className="text-xl font-semibold mb-4">Bukti Transfer</h3>
          <p>Biaya Pendaftaran</p>
        </div>
        <p className="mt-6">
          Apabila anda sudah transfer biaya pendaftaran, silahkan upload bukti
          transfernya melalui menu di bawah ini.
        </p>

        {/* Tambahkan Card di dalam Card utama dengan background hijau */}
        <div className="mt-12 p-4 bg-red-300 text-black rounded-lg text-xl font-semibold flex items-center justify-between shadow-xl">
          Rp.350.000
          <div className="text-black font-medium text-sm">Belum Transfer</div>
        </div>

        <Link
          to="/ppdb/biaya-pendaftaran"
          className="inline-block mt-12 px-6 py-2 text-white hover:text-white bg-green-500 rounded-lg hover:bg-green-700 transition-colors duration-200"
        >
          Upload Bukti Transfer
        </Link>
      </div>

      {/* Tampilkan List Testimoni */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-4">Testimoni Alumni</h2>
        {testimoniData.length > 0 ? (
          testimoniData.map((item) => (
            <div key={item.id} className="p-4 bg-gray-100 mb-4 rounded-lg">
              <h3 className="text-md font-semibold">{item.nama}</h3>
              <p>{item.pekerjaan_sekarang}</p>
              <p>{item.jurusan}</p>
              <p className="italic">
                "{item.testi || "No testimonial provided."}"
              </p>
            </div>
          ))
        ) : (
          <p>No testimonials available.</p>
        )}
      </div>

      {/* Tampilkan List Mitra Sekolah */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-4">Mitra Sekolah</h2>
        <div className="grid grid-cols-2 gap-4">
          {mitraData.length > 0 ? (
            mitraData.map((item) => (
              <div key={item.id} className="p-4 bg-gray-100 rounded-lg">
                <img
                  src={item.img_url}
                  alt="Mitra Sekolah"
                  className="w-full h-auto object-cover"
                />
              </div>
            ))
          ) : (
            <p>No partners available.</p>
          )}
        </div>
      </div>

      {/* Render Gallery */}
      <div className="mt-6 p-4 bg-white shadow-md rounded-lg w-[450px] border-2">
        <h3 className="text-xl font-semibold mb-4">Gallery</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {galleryData.map((item) => (
            <img
              key={item.id}
              src={item.img_url}
              alt="Gallery"
              className="w-full h-auto rounded-lg"
            />
          ))}
        </div>
      </div>

       {/* Render Facilities */}
       <div className="mt-6 p-4 bg-white shadow-md rounded-lg w-[450px] border-2">
        <h3 className="text-xl font-semibold mb-4">Fasilitas</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {fasilitasData.map((item) => (
            <div key={item.id}>
              <img
                src={item.img_url}
                alt="Facility"
                className="w-full h-auto rounded-lg"
              />
              {item.desc && <p className="mt-2">{item.desc}</p>}
            </div>
          ))}
        </div>
      </div>
    </LayoutPpdb>
  );
};

export default DashboardPpdb;
