import dayjs from "dayjs";
export function formatHari(timeStamps) {
  let hari = dayjs(timeStamps).format("dddd");

  if (hari === "Monday") {
    return (hari = "senin");
  }
  if (hari === "Tuesday") {
    return (hari = "selasa");
  }
  if (hari === "Wednesday") {
    return (hari = "rabu");
  }
  if (hari === "Thursday") {
    return (hari = "kamis");
  }
  if (hari === "Friday") {
    return (hari = "jumat");
  }
  if (hari === "Saturday") {
    return (hari = "sabtu");
  }
  if (hari === "Sunday") {
    return (hari = "ahad");
  }
}

export function formatTahun(timeStamps) {
  let hari = dayjs(timeStamps).format("YYYY-MM-DD");

  return hari;
}

export function formatDay(timeStamps) {
  let hari = dayjs(timeStamps).format("dddd");

  if (timeStamps === null) {
    return "-";
  }
  if (timeStamps === undefined) {
    return "-";
  }
  if (timeStamps === "") {
    return "-";
  }

  if (hari === "Monday") {
    hari = "Senin";
  }
  if (hari === "Tuesday") {
    hari = "Selasa";
  }
  if (hari === "Wednesday") {
    hari = "Rabu";
  }
  if (hari === "Thursday") {
    hari = "Kamis";
  }
  if (hari === "Friday") {
    hari = "Jumat";
  }
  if (hari === "Saturday") {
    hari = "Sabtu";
  }
  if (hari === "Sunday") {
    hari = "Minggu";
  }
  return `${hari} , ${dayjs(timeStamps).format("DD-MM-YYYY")}`;
}

export function formatHariInd(timeStamps) {
  let hari = dayjs(timeStamps).format("dddd");
  let bulan = dayjs(timeStamps).format("MM");
  let tanggal = dayjs(timeStamps).format("DD");
  let tahun = dayjs(timeStamps).format("YYYY");

  if (timeStamps === null) {
    return "-";
  }
  if (timeStamps === undefined) {
    return "-";
  }
  if (timeStamps === "") {
    return "-";
  }
  // if (bulan === "January") {
  //   bulan = "Januari";
  // }
  // if (bulan === "February") {
  //   bulan = "Februari";
  // }
  // if (bulan === "March") {
  //   bulan = "Maret";
  // }
  // if (bulan === "April") {
  //   bulan = "April";
  // }
  // if (bulan === "May") {
  //   bulan = "Mei";
  // }
  // if (bulan === "June") {
  //   bulan = "Juni";
  // }
  // if (bulan === "July") {
  //   bulan = "Juli";
  // }
  // if (bulan === "August") {
  //   bulan = "Agustus";
  // }
  // if (bulan === "September") {
  //   bulan = "September";
  // }
  // if (bulan === "October") {
  //   bulan = "Oktober";
  // }
  // if (bulan === "November") {
  //   bulan = "November";
  // }
  // if (bulan === "December") {
  //   bulan = "Desember";
  // }

  if (bulan === "01") {
    bulan = "Januari";
  }
  if (bulan === "02") {
    bulan = "Februari";
  }
  if (bulan === "03") {
    bulan = "Maret";
  }
  if (bulan === "04") {
    bulan = "April";
  }
  if (bulan === "05") {
    bulan = "Mei";
  }
  if (bulan === "06") {
    bulan = "Juni";
  }
  if (bulan === "07") {
    bulan = "Juli";
  }
  if (bulan === "08") {
    bulan = "Agustus";
  }
  if (bulan === "09") {
    bulan = "September";
  }
  if (bulan === "10") {
    bulan = "Oktober";
  }
  if (bulan === "11") {
    bulan = "November";
  }
  if (bulan === "12") {
    bulan = "Desember";
  }

  if (hari === "Monday") {
    hari = "Senin";
  }
  if (hari === "Tuesday") {
    hari = "Selasa";
  }
  if (hari === "Wednesday") {
    hari = "Rabu";
  }
  if (hari === "Thursday") {
    hari = "Kamis";
  }
  if (hari === "Friday") {
    hari = "Jumat";
  }
  if (hari === "Saturday") {
    hari = "Sabtu";
  }
  if (hari === "Sunday") {
    hari = "Minggu";
  }
  return hari + ", " + tanggal + " " + bulan + " " + tahun;
}

export function handleViewNull(value) {
  if (value === null) return "-";
  if (value === "") return "-";
  if (value === undefined) return "-";
  if (value === "undefined") return "-";

  return value;
}

export function selisihHari(tgl1, tgl2) {
  // varibel miliday sebagai pembagi untuk menghasilkan hari
  let miliday = 24 * 60 * 60 * 1000;
  //buat object Date
  let tanggal1 = new Date(tgl1);
  let tanggal2 = new Date(tgl2);
  // Date.parse akan menghasilkan nilai bernilai integer dalam bentuk milisecond
  let tglPertama = Date.parse(tanggal1);
  let tglKedua = Date.parse(tanggal2);
  let selisih = (tglKedua - tglPertama) / miliday;
  return selisih;
}


export function formatDate(timeStamps) {
  let hari = dayjs(timeStamps).format("dddd");

  if (timeStamps === null) {
    return "-";
  }
  if (timeStamps === undefined) {
    return "-";
  }
  if (timeStamps === "") {
    return "-";
  }

  if (hari === "Monday") {
    hari = "Senin";
  }
  if (hari === "Tuesday") {
    hari = "Selasa";
  }
  if (hari === "Wednesday") {
    hari = "Rabu";
  }
  if (hari === "Thursday") {
    hari = "Kamis";
  }
  if (hari === "Friday") {
    hari = "Jumat";
  }
  if (hari === "Saturday") {
    hari = "Sabtu";
  }
  if (hari === "Sunday") {
    hari = "Minggu";
  }
  return `${dayjs(timeStamps).format("DD-MM-YYYY")}`;
}


export function showFormattedDate (date){
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
   

  }


  if(date === null) {
    return "-"
  }
  return new Date(date).toLocaleDateString("id-ID", options)
}


export function formatWaktu(date){
  if(date === null) {
    return "-"
  }

  return dayjs(date).format("DD-MM-YY HH:mm:ss")
}


