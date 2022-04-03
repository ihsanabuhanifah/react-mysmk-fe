const izinOptions = [
    { key: "1", value: 1, text: "Hadir" },
    { key: "2", value: 2, text: "Sakit" },
    { key: "3", value: 3, text: "Izin Pulang" },
    { key: "4", value: 4, text: "Dispensasi" },
    { key: "5", value: 5, text: "Tanpa Keterangan" },
    { key: "6", value: 6, text: "Belum Absensi" },
   
  ];


  const approveOptions = [
    { key: "1", value: 'menunggu', text: "Menunggu" },
    { key: "2", value: 'ditolak', text: "Ditolak" },
    { key: "3", value: 'disetujui', text: "Disetujui" },
    
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
    { key: "1", value: 'ringan', text: "Ringan" },
    { key: "2", value: 'sedang', text: "Sedang" },
    { key: "3", value: 'berat', text: "Berat" },
    
  ];

  const pageSizeOptions = [
    { key: "1", value: 1, text: "1" },
    { key: "5", value: 5, text: "5" },
    { key: "10", value: 10, text: "10" },
    { key: "25", value: 25, text: "25" },
    { key: "50", value: 50, text: "50" },
    { key: "100", value: 100, text: "100" },
  ]



  export {izinOptions, approveOptions,semesterOptions, pageSizeOptions, kategoriPelanggaranOptions}
