import * as XLSX from "xlsx";

/**
 * Definisi template import. Urutan kolom HARUS sama dengan yang dibaca backend
 * (controllers/ExportImport/importController.js & importUserController.js),
 * karena backend membaca berdasarkan posisi kolom (row[0], row[1], ...),
 * bukan nama header. Backend selalu membaca SHEET PERTAMA dan melewati baris 1.
 *
 * refs: sheet referensi yang ikut dibuat dari data DB (GET /import/referensi)
 */
export const IMPORT_TYPES = [
  {
    key: "ta",
    title: "Tahun Ajaran",
    endpoint: "/import/ta",
    step: 1,
    desc: "Daftar tahun ajaran, mis. 2026/2027.",
    columns: [
      { header: "ID", note: "Wajib. ID baru yang belum dipakai (lihat sheet Referensi). Baris tanpa ID dilewati.", example: "5" },
      { header: "Nama Tahun Ajaran", note: "Format YYYY/YYYY", example: "2026/2027" },
    ],
    refs: ["ta"],
  },
  {
    key: "kelas",
    title: "Kelas",
    endpoint: "/import/kelas",
    step: 2,
    desc: "Daftar kelas / rombongan belajar.",
    columns: [
      { header: "ID", note: "Wajib. ID baru yang belum dipakai (lihat sheet Referensi). Baris tanpa ID dilewati.", example: "8" },
      { header: "Nama Kelas", note: "Nama lengkap kelas", example: "X Rekayasa Perangkat Lunak" },
      { header: "Tahun Ajaran", note: "Ikuti isian kelas yang sudah ada (lihat sheet Referensi)", example: "1" },
    ],
    refs: ["kelas", "ta"],
  },
  {
    key: "mapel",
    title: "Mata Pelajaran",
    endpoint: "/import/mapel",
    step: 3,
    desc: "Daftar mata pelajaran beserta kategorinya.",
    columns: [
      { header: "No", note: "Nomor urut (tidak disimpan)", example: "1" },
      { header: "Nama Mapel", note: "Nama mata pelajaran", example: "Pemrograman Web" },
      { header: "Kategori", note: "Angka kategori, ikuti mapel yang sudah ada (lihat sheet Referensi)", example: "1" },
    ],
    refs: ["mapel"],
  },
  {
    key: "guru",
    title: "Guru & Staf",
    endpoint: "/import/guru",
    step: 4,
    desc: "Membuat akun login guru/staf sekaligus data guru. Email yang sudah terdaftar akan dilewati.",
    columns: [
      { header: "No", note: "Nomor urut (tidak disimpan)", example: "1" },
      { header: "Nama", note: "Nama lengkap", example: "Ahmad Fauzi, S.Kom" },
      { header: "Email", note: "Email login, harus unik", example: "ahmad.fauzi@smkmadinatulquran.sch.id" },
      { header: "Password", note: "Password awal (min. 8 karakter disarankan)", example: "12345678" },
      { header: "Status", note: "active / inactive", example: "active" },
      { header: "Roles", note: "ID role dipisah titik, mis. 4.5 = Guru + Musyrif (lihat sheet Referensi)", example: "4.5" },
      { header: "Role", note: "Isi: guru (otomatis dibuatkan data guru)", example: "guru" },
    ],
    refs: ["roles"],
  },
  {
    key: "siswa",
    title: "Siswa / Santri",
    endpoint: "/import/siswa",
    step: 5,
    desc: "Membuat akun login siswa sekaligus biodata siswa. Email yang sudah terdaftar akan dilewati.",
    columns: [
      { header: "No", note: "Nomor urut (tidak disimpan)", example: "1" },
      { header: "Nama", note: "Nama lengkap siswa", example: "Muhammad Rizki" },
      { header: "Email", note: "Email login, harus unik", example: "rizki@gmail.com" },
      { header: "Password", note: "Password awal", example: "12345678" },
      { header: "Status", note: "active / inactive", example: "active" },
      { header: "Roles", note: "ID role, siswa = 9 (Santri)", example: "9" },
      { header: "Role", note: "Isi: siswa (otomatis dibuatkan data siswa)", example: "siswa" },
      { header: "NIS", note: "Nomor Induk Siswa", example: "2526001" },
      { header: "NISN", note: "NISN (dipakai untuk menghubungkan wali)", example: "0101234567" },
      { header: "NIK", note: "Saat ini belum disimpan oleh sistem, boleh dikosongkan", example: "" },
      { header: "Tempat Lahir", note: "", example: "Bogor" },
      { header: "Tanggal Lahir", note: "Format YYYY-MM-DD", example: "2010-01-01" },
      { header: "Alamat", note: "", example: "Jl. Raya No. 1" },
      { header: "Sekolah Asal", note: "", example: "SMP IT Al-Hikmah" },
      { header: "Jenis Kelamin", note: "laki-laki / perempuan", example: "laki-laki" },
      { header: "Anak Ke", note: "Angka", example: "1" },
      { header: "Tanggal Diterima", note: "Format YYYY-MM-DD", example: "2026-07-01" },
      { header: "Angkatan", note: "Nomor angkatan", example: "12" },
      { header: "Tahun Ajaran", note: "Teks tahun ajaran masuk", example: "2026/2027" },
    ],
    refs: ["roles"],
  },
  {
    key: "wali",
    title: "Wali Santri",
    endpoint: "/import/wali",
    step: 6,
    desc: "Membuat akun wali dan menghubungkannya ke siswa lewat NISN. Siswa harus sudah diimport lebih dulu; baris dengan NISN tidak ditemukan akan dilewati.",
    columns: [
      { header: "No", note: "Nomor urut (tidak disimpan)", example: "1" },
      { header: "Nama", note: "Nama wali", example: "Abdullah" },
      { header: "Email", note: "Email login, harus unik", example: "abdullah@gmail.com" },
      { header: "Password", note: "Password awal", example: "12345678" },
      { header: "Status", note: "Diabaikan (otomatis active), boleh dikosongkan", example: "" },
      { header: "Roles", note: "ID role, wali = 8 (Wali Siswa)", example: "8" },
      { header: "Role", note: "Isi: Wali Siswa", example: "Wali Siswa" },
      { header: "NISN Siswa", note: "NISN anak (harus sudah ada di data siswa)", example: "0101234567" },
      { header: "Hubungan", note: "ayah / ibu / wali", example: "ayah" },
    ],
    refs: ["roles", "siswa"],
  },
  {
    key: "rombel",
    title: "Rombel (Siswa per Kelas)",
    endpoint: "/import/rombel",
    step: 7,
    desc: "Memasukkan siswa ke kelas untuk semester & tahun ajaran tertentu.",
    columns: [
      { header: "No", note: "Nomor urut (tidak disimpan)", example: "1" },
      { header: "ID Kelas", note: "Lihat sheet Referensi - Kelas", example: "6" },
      { header: "ID Siswa", note: "Lihat sheet Referensi - Siswa (kolom ID, bukan NIS)", example: "120" },
      { header: "Semester", note: "Angka semester, mis. 1", example: "1" },
      { header: "ID Tahun Ajaran", note: "Lihat sheet Referensi - Tahun Ajaran", example: "4" },
      { header: "Status", note: "1 = aktif, 0 = tidak aktif", example: "1" },
    ],
    refs: ["kelas", "siswa", "ta"],
  },
  {
    key: "jadwal",
    title: "Jadwal Pelajaran",
    endpoint: "/import/jadwal",
    step: 8,
    desc: "Jadwal mengajar per kelas. Pastikan kelas, guru, mapel, dan tahun ajaran sudah ada.",
    columns: [
      { header: "No", note: "Nomor urut (tidak disimpan)", example: "1" },
      { header: "Hari", note: "huruf kecil: senin / selasa / rabu / kamis / jumat / sabtu / ahad", example: "senin" },
      { header: "ID Kelas", note: "Lihat sheet Referensi - Kelas", example: "6" },
      { header: "ID Guru", note: "Lihat sheet Referensi - Guru", example: "5" },
      { header: "ID Mapel", note: "Lihat sheet Referensi - Mapel", example: "12" },
      { header: "Jam Ke", note: "Angka jam pelajaran mulai", example: "1" },
      { header: "Semester", note: "Angka semester", example: "1" },
      { header: "ID Tahun Ajaran", note: "Lihat sheet Referensi - Tahun Ajaran", example: "4" },
      { header: "Status", note: "1 = aktif, 0 = tidak aktif", example: "1" },
      { header: "Jumlah Jam", note: "Lama pelajaran (jam)", example: "2" },
    ],
    refs: ["kelas", "guru", "mapel", "ta"],
  },
  {
    key: "roles",
    title: "Role",
    endpoint: "/import/roles",
    step: 9,
    advanced: true,
    desc: "Menambah jenis role baru. Jarang diperlukan; role standar sudah tersedia.",
    columns: [
      { header: "ID", note: "Wajib. ID baru yang belum dipakai (lihat sheet Referensi)", example: "13" },
      { header: "Nama Role", note: "", example: "Bendahara" },
      { header: "Keterangan", note: "", example: "Pengelola keuangan" },
    ],
    refs: ["roles"],
  },
  {
    key: "alquran",
    title: "Surat Al-Qur'an",
    endpoint: "/import/alquran",
    step: 10,
    advanced: true,
    desc: "Data master surat Al-Qur'an. Biasanya sudah lengkap (114 surat), tidak perlu diimport ulang.",
    columns: [
      { header: "ID", note: "Nomor surat (ID baru yang belum dipakai)", example: "1" },
      { header: "Nama Surat", note: "", example: "Al-Fatihah" },
      { header: "Nama Surat Arab", note: "", example: "الفاتحة" },
      { header: "Jumlah Ayat", note: "", example: "7" },
    ],
    refs: [],
  },
];

const REF_SHEETS = {
  roles: (d) => ({
    name: "Ref - Role",
    rows: [["ID", "Nama Role"], ...(d.roles || []).map((r) => [r.id, r.role_name])],
  }),
  ta: (d) => ({
    name: "Ref - Tahun Ajaran",
    rows: [["ID", "Tahun Ajaran"], ...(d.ta || []).map((r) => [r.id, r.nama_tahun_ajaran])],
  }),
  kelas: (d) => ({
    name: "Ref - Kelas",
    rows: [
      ["ID", "Nama Kelas", "Tahun Ajaran"],
      ...(d.kelas || []).map((r) => [r.id, r.nama_kelas, r.tahun_ajaran]),
    ],
  }),
  mapel: (d) => ({
    name: "Ref - Mapel",
    rows: [
      ["ID", "Nama Mapel", "Kategori"],
      ...(d.mapel || []).map((r) => [r.id, r.nama_mapel, r.kategori]),
    ],
  }),
  guru: (d) => ({
    name: "Ref - Guru",
    rows: [["ID Guru", "Nama Guru"], ...(d.guru || []).map((r) => [r.id, r.nama_guru])],
  }),
  siswa: (d) => ({
    name: "Ref - Siswa",
    rows: [
      ["ID Siswa", "Nama Siswa", "NIS", "NISN", "Angkatan"],
      ...(d.siswa || []).map((r) => [r.id, r.nama_siswa, r.nis, r.nisn, r.angkatan]),
    ],
  }),
};

function autoWidth(rows) {
  const widths = [];
  rows.forEach((row) =>
    row.forEach((cell, i) => {
      const len = String(cell ?? "").length;
      widths[i] = Math.min(Math.max(widths[i] || 8, len + 2), 60);
    })
  );
  return widths.map((wch) => ({ wch }));
}

function addSheet(wb, name, rows) {
  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws["!cols"] = autoWidth(rows);
  XLSX.utils.book_append_sheet(wb, ws, name.slice(0, 31));
}

/**
 * Buat & unduh file template .xlsx
 * @param {object} type item dari IMPORT_TYPES
 * @param {object|null} referensi data dari GET /import/referensi (boleh null)
 */
export function downloadTemplate(type, referensi) {
  const wb = XLSX.utils.book_new();

  // Sheet 1: Data (yang dibaca backend) - hanya header
  const header = type.columns.map((c) => c.header);
  const dataSheet = XLSX.utils.aoa_to_sheet([header]);
  dataSheet["!cols"] = type.columns.map((c) => ({
    wch: Math.max(c.header.length, String(c.example).length, 10) + 2,
  }));
  XLSX.utils.book_append_sheet(wb, dataSheet, "Data");

  // Sheet 2: Petunjuk
  const petunjuk = [
    [`PETUNJUK IMPORT ${type.title.toUpperCase()}`],
    [],
    ["1. Isi data mulai baris ke-2 pada sheet \"Data\". Baris pertama (header) jangan dihapus."],
    ["2. Jangan menambah, menghapus, atau mengubah urutan kolom. Sistem membaca berdasarkan posisi kolom."],
    ["3. Sheet \"Data\" harus tetap menjadi sheet PERTAMA."],
    ["4. Kolom NIS / NISN / NIK: ubah format sel menjadi Text sebelum diisi agar angka 0 di depan tidak hilang."],
    ["5. Simpan sebagai .xlsx lalu upload di menu Import Data."],
    [],
    ["Kolom", "Keterangan", "Contoh"],
    ...type.columns.map((c) => [c.header, c.note, c.example]),
  ];
  addSheet(wb, "Petunjuk", petunjuk);

  // Sheet referensi dari database
  if (referensi) {
    type.refs.forEach((refKey) => {
      const sheet = REF_SHEETS[refKey]?.(referensi);
      if (sheet) addSheet(wb, sheet.name, sheet.rows);
    });
  }

  XLSX.writeFile(wb, `template-import-${type.key}.xlsx`);
}
