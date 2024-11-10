import { useDetailPembayaran } from "../../../api/ppdb/pembayaran";
import { useProfileCalonSantri } from "../../../api/ppdb/profile";
import LayoutPpdb from "../../../module/layoutPpdb";
import Card from "./card";
import { useState } from "react";
import { FaSearch } from "react-icons/fa"; // Importing the search icon

const Ujian = () => {
  const { profileData, isLoading, isError, error } = useProfileCalonSantri();
  const { dataPembayaran } = useDetailPembayaran();

  // Sample data for exams
  const [dataUjian, setDataUjian] = useState([
    {
      ujian: {
        mapel: { nama_mapel: "Test Calon santri" },
        waktu_mulai: new Date(),
        waktu_selesai: new Date(),
        durasi: "90 menit",
        jenis_ujian: "Ujian Tengah Semester",
        tipe_ujian: "Pilihan Ganda",
      },
      teacher: { nama_guru: "Bapak Ahmad" },
      jam_mulai: new Date(),
      jam_selesai: new Date(),
      status: "open",
    },
  ]);

  // State for the filter input
  const [filter, setFilter] = useState("");

  // Filtered data based on the input
  const filteredDataUjian = dataUjian.filter((item) =>
    item.ujian.mapel.nama_mapel.toLowerCase().includes(filter.toLowerCase())
  );

  // Function to handle exam
  const handleExam = () => {
    console.log("Mulai atau lanjutkan ujian");
  };

  // Check if profileData is incomplete
  const isPembayaranIncomplete = dataPembayaran
    ? Object.values(dataPembayaran).some((value) => value === null)
    : true;

  // Check payment status
  const paymentStatus = dataPembayaran?.status;

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>{error.message}</p>;

  return (
    <LayoutPpdb title="Tes Penerimaan Calon Santri">
      {/* Enhanced Filter Input with React Icons */}
      <div className="mb-4 relative">
        <input
          type="text"
          placeholder="Cari Mata Pelajaran..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
        />
        <FaSearch className="absolute left-3 top-3 text-gray-400" />
      </div>

      {isPembayaranIncomplete ? (
        <div className="card bg-red-100 p-4 rounded-md shadow-md">
          <p className="text-red-600 font-semibold">
            Silahkan lakukan Pembayaran terlebih dahulu!
          </p>
        </div>
      ) : paymentStatus === 0 ? (
        <div className="card bg-yellow-100 p-4 rounded-md shadow-md">
          <p className="text-yellow-600 font-semibold">
            Menunggu Verifikasi Admin!
          </p>
        </div>
      ) : paymentStatus === 1 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredDataUjian.map((item, index) => (
            <Card key={index} item={item} handleExam={handleExam} />
          ))}
        </div>
      ) : null}
    </LayoutPpdb>
  );
};

export default Ujian;
