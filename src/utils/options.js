const izinOptions = [
  { key: "1", value: 1, text: "Hadir" },
  { key: "2", value: 2, text: "Sakit" },
  { key: "3", value: 3, text: "Izin Pulang" },
  { key: "4", value: 4, text: "Dispensasi" },
  { key: "5", value: 5, text: "Tanpa Keterangan" },
  { key: "7", value: 7, text: "Izin Kegiatan " },
  { key: "6", value: 6, text: "Belum Absensi" },
];
const halaqohOptions = [
  { key: "1", value: 1, text: "Hadir" },
  { key: "2", value: 8, text: "Tidak Setoran" },
  { key: "2", value: 2, text: "Sakit" },
  { key: "3", value: 3, text: "Izin Pulang" },
  { key: "4", value: 4, text: "Dispensasi" },
  { key: "5", value: 5, text: "Tanpa Keterangan" },
  { key: "7", value: 7, text: "Izin Kegiatan " },
  { key: "6", value: 6, text: "Belum Absensi" },
];
const izinGuruOptions = [
  { key: "1", value: "Sakit", text: "Sakit" },
  { key: "2", value: "Izin", text: "Izin" },
  { key: "3", value: "Tugas Keluar", text: "Tugas Keluar" },
  { key: "4", value: "Tanpa Keterangan", text: "Tanpa Keterangan" },
];

const approveOptions = [
  { key: "1", value: "menunggu", text: "Menunggu" },
  { key: "2", value: "ditolak", text: "Ditolak" },
  { key: "3", value: "disetujui", text: "Disetujui" },
];
const semesterOptions = [
  { key: "1", value: 1, text: "Semester 1" },
  { key: "2", value: 2, text: "Semester 2" },
  { key: "3", value: 3, text: "Semester 3" },
  { key: "2", value: 4, text: "Semester 4" },
  { key: "3", value: 5, text: "Semester 5" },
  { key: "3", value: 6, text: "Semester 6" },
];

const kategoriPelanggaranOptions = [
  { key: "1", value: "ringan", text: "Ringan" },
  { key: "2", value: "sedang", text: "Sedang" },
  { key: "3", value: "berat", text: "Berat" },
];

const waktuOptions = [
  { key: "1", value: "", text: "Semua" },
  { key: "2", value: "pagi", text: "Pagi" },
  { key: "3", value: "malam", text: "Malam" },
];

const waktusholatOptions = [
  { key: "1", value: 1, text: "Subuh" },
  { key: "2", value: 2, text: "Dhuhur" },
  { key: "3", value: 3, text: "Ashar" },
  { key: "4", value: 4, text: "Magrib" },
  { key: "5", value: 5, text: "Isya" },
  { key: "6", value: 6, text: "Tahajud" },
  { key: "7", value: 6, text: "Dhuha" },
];
const alasanTidakSholatOptions = [
  { key: "1", value: 1, text: "Tidak Berjamaah" },
  { key: "2", value: 2, text: "Masbuk" },
  // { key: "3", value: 3, text: "Ashar" },
  // { key: "4", value: 4, text: "Magrib" },
  // { key: "5", value: 5, text: "Isya" },
  // { key: "6", value: 6, text: "Tahajud" },
  // { key: "6", value: 6, text: "Dhuha" },
];
const pageSizeOptions = [
  { key: "1", value: 1, text: "1" },
  { key: "5", value: 5, text: "5" },
  { key: "10", value: 10, text: "10" },
  { key: "25", value: 25, text: "25" },
  { key: "50", value: 50, text: "50" },
  { key: "100", value: 100, text: "100" },
];

const kategoriOptions = [
  { key: "1", value: "Sekolah", text: "Sekolah" },
  { key: "2", value: "Nasional", text: "Nasional" },
  { key: "3", value: "Internasional", text: "Internasional" },
];
const tipeHalaqohOptions = [
  { key: "1", value: "Hafalan Baru", text: "Hafalan Baru" },
  { key: "2", value: "Murojaah", text: "Murojaah" },
  { key: "3", value: "Tidak Setor", text: "Tidak Setor" },
];
const pointOptions = [
  { key: "1", value: 1, text: 1 },
  { key: "2", value: 2, text: 2 },
  { key: "3", value: 3, text: 3 },
  { key: "4", value: 4, text: 4 },
  { key: "5", value: 5, text: 5 },
  { key: "6", value: 6, text: 6 },
  { key: "7", value: 7, text: 7 },
  { key: "8", value: 8, text: 8 },
  { key: "9", value: 9, text: 9 },
  { key: "10", value: 10, text: 10 },
];
const tipeSoalOptions = [
  { key: "1", value: "PG", text: "Pilihan Ganda" },
  { key: "2", value: "TF", text: "True False" },
  { key: "3", value: "ES", text: "Essay/Project" },
];
const pgOptions = [
  { key: "1", value: "A", text: "A" },
  { key: "2", value: "B", text: "B" },
  { key: "3", value: "C", text: "C" },
  { key: "4", value: "D", text: "D" },
  { key: "5", value: "E", text: "E" },
];
const tfOptions = [
  { key: "1", value: 1, text: "true" },
  { key: "2", value: 0, text: "false" },
];

const jenisOptions = [
  { key: "1", value: "harian", text: "Ulangan Harian" },
  { key: "2", value: "PTS", text: "Penilaian Tengah Semester" },
  { key: "3", value: "PAS", text: "Penilain Akhir Semester" },
  { key: "4", value: "US", text: "Ujian Sekolah" },
  { key: "5", value: "remidial", text: "Remidial" },
];
const statusUjianOptions = [
  { key: "1", value: "draft", text: "Draft" },
  { key: "2", value: "open", text: "Open" },
  { key: "4", value: "In Progress", text: "In Progress" },
  { key: "4", value: "finish", text: "Finished" },
 
  
];

const tipeUjianOptions = [
  { key: "1", value: "closed", text: "Closed Book" },
  { key: "2", value: "open", text: "Open Book" },

 
  
];

export {
  izinOptions,
  kategoriOptions,
  approveOptions,
  semesterOptions,
  pageSizeOptions,
  kategoriPelanggaranOptions,
  waktusholatOptions,
  alasanTidakSholatOptions,
  izinGuruOptions,
  waktuOptions,
  halaqohOptions,
  tipeHalaqohOptions,
  pointOptions,
  tipeSoalOptions,
  pgOptions,
  tfOptions,
  jenisOptions,
  statusUjianOptions,
  tipeUjianOptions
};
