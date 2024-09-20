import LayoutPpdb from "../../../module/layoutPpdb";
import Card from "./card";
import { useState } from "react";

const Ujian = () => {
  // Contoh data untuk 3 ujian
  const [dataUjian, setDataUjian] = useState([
    {
      ujian: {
        mapel: { nama_mapel: "Matematika" },
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
    {
      ujian: {
        mapel: { nama_mapel: "Bahasa Inggris" },
        waktu_mulai: new Date(),
        waktu_selesai: new Date(),
        durasi: "60 menit",
        jenis_ujian: "Ujian Akhir Semester",
        tipe_ujian: "Esai",
      },
      teacher: { nama_guru: "Ibu Siti" },
      jam_mulai: new Date(),
      jam_selesai: new Date(),
      status: "progress",
    },
    {
      ujian: {
        mapel: { nama_mapel: "Fisika" },
        waktu_mulai: new Date(),
        waktu_selesai: new Date(),
        durasi: "120 menit",
        jenis_ujian: "Ujian Harian",
        tipe_ujian: "Pilihan Ganda",
      },
      teacher: { nama_guru: "Pak Budi" },
      jam_mulai: new Date(),
      jam_selesai: new Date(),
      status: "finish",
    },
  ]);

  // Fungsi untuk menangani ujian
  const handleExam = () => {
    console.log("Mulai atau lanjutkan ujian");
  };

  return (
    <LayoutPpdb title="Tes Penerimaan Calon Santri">
      <p>Ini adalah halaman tes penerimaan calon santri</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {dataUjian.map((item, index) => (
          <Card key={index} item={item} handleExam={handleExam} />
        ))}
      </div>
    </LayoutPpdb>
  );
};

export default Ujian;
