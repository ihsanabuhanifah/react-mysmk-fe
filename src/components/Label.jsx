import { Label } from "semantic-ui-react";
import { durasiOptions } from "../utils/options";

export const LabelStatus = ({ status }) => {
  // hall tugas pkl ///
  if (status === "selesai") {
    return (
      <Label size="tiny" content="Selesai Dikerjakan" color="green" as={"a"} />
    );
  }
  if (status === "revisi") {
    return (
      <Label size="tiny" content="Revisi" color="yellow" as={"a"} />
    );
  }
  if (status === "gagal") {
    return (
      <Label size="tiny" content="Gagal" color="red" as={"a"} />
    );
  }

  // -------------------//
  if (status === "sudah dikerjakan") {
    return (
      <Label size="tiny" content="sudah Dikerjakan" color="green" as={"a"} />
    );
  }
  if (status === "sedang dikerjakan") {
    return (
      <Label size="tiny" content="Sedang Dikerjakan" color="yellow" as={"a"} />
    );
  }
  if (status === "belum dikerjakan") {
    return (
      <Label size="tiny" content="Belum Dikerjakan" color="red" as={"a"} />
    );
  }
  if (status === null) {
    return (
      <Label size="tiny" content="null" color="gray" as={"a"} />
    );
  }
  if (status === "harian") {
    return <Label size="tiny" content="Harian" color="yellow" as={"a"} />;
  }

  if (status === "tugas") {
    return <Label size="tiny" content="Tugas" color="pink" as={"a"} />;
  }
  
  if (status === "projek") {
    return <Label size="tiny" content="Proyek" color="black" as={"a"} />;
  }
  
  if (status === "projek") {
    return <Label size="tiny" content="Projek" color="facebook" as={"a"} />;
  }
  
  // ---------laporan----------//
  if (status === "hadir") {
    return <Label size="tiny" content="Hadir" color="green" as={"a"} />;
  }
  if (status === "izin") {
    return <Label size="tiny" content="Izin" color="red" as={"a"} />;
  }
  // if (status === "izin") {
  //   return <Label size="tiny" content="Izin" color="olive" as={"a"} />;
  // }
  if (status === "sakit") {
    return <Label size="tiny" content="Sakit" color="blue" as={"a"} />;
  }
  if (status === "libur") {
    return <Label size="tiny" content="Libur" color="yellow" as={"a"} />;
  }
  if (status === "tugas") {
    return (
      <Label size="tiny" content="Tugas Sekolah" color="yellow" as={"a"} />
    );
  }

  if (status?.toUpperCase() === "PTS") {
    return <Label size="tiny" content="PTS" color="olive" as={"a"} />;
  }
  if (status === "PAS") {
    return <Label size="tiny" content="PAS" color="green" as={"a"} />;
  }
  if (status === "US") {
    return <Label size="tiny" content="US" color="teal" as={"a"} />;
  }

  //tipe soal

  if (status === "PG") {
    return <Label size="tiny" content="Pilihan Ganda" color="blue" as={"a"} />;
  }
  if (status === "TF") {
    return <Label size="tiny" content="True False" color="green" as={"a"} />;
  }
  if (status === "ES") {
    return <Label size="tiny" content="Uraian" color="teal" as={"a"} />;
  }

  return <Label size="tiny" content="-" as={"a"} />;
};

export const LabelTipeUjian = ({ status }) => {
  if (status === "open") {
    return <Label size="tiny" content="Open Book" color="green" as={"a"} />;
  }
  if (status === "closed") {
    return <Label size="tiny" content="Closed Book" color="red" as={"a"} />;
  }

  if (status === "draft") {
    return <Label size="tiny" content="Draft" color="brown" as={"a"} />;
  }

  return <Label size="tiny" content="-" as={"a"} />;
};

export const LabelDurasi = ({ status }) => {
  const result = durasiOptions.filter((item) => {
    return item.value === Number(status);
  });

  console.log("re", result, status);

  return (
    <Label
      size="tiny"
      content={result?.[0]?.text || "-"}
      color="brown"
      as={"a"}
    />
  );
};

export const LabelKeterangan = ({ status }) => {
  if (status === "-") {
    return <Label size="tiny" content={"-"} as={"a"} />;
  }
  if (status === 1) {
    return <Label size="green" content={"LULUS"} as={"a"} />;
  }
  if (status === 'Ya') {
    return <Label size="green" content={"Ya"} as={"a"} />;
  }

  return <Label size="tiny" content={status} color="red" as={"a"} />;
};


export const LabelTingkat = ({ status }) => {
  
  if (status > 0) {
    return <Label size="green" content={`Ya (${status})`} as={"a"} />;
  }
  
  if (status === "open") {
    return <Label size="tiny" content="Open" color="green" as={"a"} />;
  }
  
  if (status === "draft") {
    return <Label size="tiny" content="Draft" color="brown" as={"a"} />;
  }

  return <Label size="tiny" content={status} color="red" as={"a"} />;
};