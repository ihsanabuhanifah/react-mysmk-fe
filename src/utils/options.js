const izinOptions = [
  { key: "1", value: 1, text: "Hadir" },
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

export {
  izinOptions,
  kategoriOptions,
  approveOptions,
  semesterOptions,
  pageSizeOptions,
  kategoriPelanggaranOptions,
  waktusholatOptions,
  alasanTidakSholatOptions,
  izinGuruOptions
};
