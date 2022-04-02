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
  return `${hari} , ${dayjs(timeStamps).format("DD-MM-YYYY")}`;
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
