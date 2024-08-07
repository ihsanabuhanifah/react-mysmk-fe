const { format, parseISO } = require('date-fns');

// Array nama bulan dalam bahasa Indonesia
const bulan = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export function formatTanggalIndo(tanggalISO) {
  const tanggal = parseISO(tanggalISO);
  const hari = format(tanggal, 'd');
  const bulanIndex = tanggal.getMonth();
  const tahun = format(tanggal, 'yyyy');
  return `${hari}  ${bulan[bulanIndex]}  ${tahun}`;
}