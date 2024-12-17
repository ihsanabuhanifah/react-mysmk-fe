import { Label } from "semantic-ui-react";

export const LabelStatus = ({ status }) => {
  if (status === "open") {
    return (

      <Label size="tiny" content="Terbuka" color="purple" as={"a"} />
     
    );
  }
  if (status === "progress") {
    return (
      <Label size="tiny" content="Pengerjaan" color="blue" as={"a"} />
      
    );
  }
  if (status === "finish") {
    return (
      <Label size="tiny" content="Selesai" color="green" as={"a"} />
    );
  }
  if (status === "harian") {
    return (
      <Label size="tiny" content="Harian" color="yellow" as={"a"} />
       
    );
  }


  if (status === "sudah") {
    return (

      <Label size="tiny" content="Sudah Di bayar" color="green" as={"a"} />
     
    );
  }

  if (status === "belum") {
    return (

      <Label size="tiny" content="Belum di bayar" color="red" as={"a"} />
     
    );
  }



  if (status === "hadir") {
    return (

      <Label size="tiny" content="Hadir" color="green" as={"a"} />
     
    );
  }
  if (status === "sakit") {
    return (
      <Label size="tiny" content="Sakit" color="blue" as={"a"} />
      
    );
  }
  if (status === "izin") {
    return (
      <Label size="tiny" content="Izin" color="olive" as={"a"} />
    );
  }
  if (status === "libur") {
    return (
      <Label size="tiny" content="Libur" color="yellow" as={"a"} />
       
    );
  }
  if (status === "tugas") {
    return (
      <Label size="tiny" content="Tugas Sekolah" color="yellow" as={"a"} />
       
    );
  }

  if (status === "PTS") {
    return (
      <Label size="tiny" content="PTS" color="olive" as={"a"} />
       
    );
  }
  if (status === "PAS") {
    return (
      <Label size="tiny" content="PAS" color="green" as={"a"} />
       
    );
  }
  if (status === "US") {
    return (
      <Label size="tiny" content="US" color="teal" as={"a"} />
       
    );


    
  }


  //tipe soal

  if (status === "PG") {
    return (
      <Label size="tiny" content="Pilihan Ganda" color="blue" as={"a"} />
       
    );
  }
  if (status === "TF") {
    return (
      <Label size="tiny" content="True False" color="green" as={"a"} />
       
    );
  }
  if (status === "ES") {
    return (
      <Label size="tiny" content="Uraian" color="teal" as={"a"} />
       
    );
  }
  
  return  <Label size="tiny" content="-"  as={"a"} />
       
};

export const LabelTipeUjian = ({ status }) => {
  if (status === "open") {
    return (
      <Label size="tiny" content="Open" color="purple" as={"a"} />
       
    );
  }
  if (status === "closed") {
    return (
      <Label  size="tiny"  content="Closed" color="green" as={"a"} />
    );
  }

  if (status === "draft") {
    return (
      <Label size="tiny" content="Draft" color="brown" as={"a"} />
       
    );
  }

  return  <Label size="tiny" content="-"  as={"a"} />

  
};
