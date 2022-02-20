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
  
    return hari
}