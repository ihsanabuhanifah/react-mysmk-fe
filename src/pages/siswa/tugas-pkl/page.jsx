import React, { useState } from "react";
import LayoutSiswa from "../../../module/layoutSiswa";
import TugasPklCard from "./card";
import {
  useCreateTugasPkl,
  useTugasPklList,
} from "../../../api/siswa/laporan-pkl";
import dayjs from "dayjs";
import { formatTanggalIndo } from "../../../utils/formatTanggal";
import LayoutPage from "../../../module/layoutPage";
import { format, parseISO } from "date-fns";
import Pagination from "../../../components/Pagination";

const bulan = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];
export function formatTanggalIndoJam(tanggalISO) {
  const tanggal = parseISO(tanggalISO);
  const hari = format(tanggal, "d"); 
  const bulanIndex = tanggal.getMonth(); 
  const tahun = format(tanggal, "yyyy"); 
  const jam = format(tanggal, "HH"); 
  const menit = format(tanggal, "mm"); 

  return `${hari} ${bulan[bulanIndex]} ${tahun} ${jam}:${menit}`; // Format: "11 Oktober 2024 14:30"
}
const TugasPklPage = () => {
  const {
    data,
    isFetching,
    isLoading,
    filterParams,
    handleClear,
    handleFilter,
    handlePage,
    handlePageSize,
    params,
    setParams,
  } = useTugasPklList(); // Ambil data tugas
  const { mutate: createTugasMutate, isLoading: createIsLoading } =
    useCreateTugasPkl();
  console.log(data);

  return (
    <LayoutPage title={"Tugas"} isLoading={isLoading}>
      <div className="">
        {isLoading ? (
          <p className="text-center">Loading...</p> // Tampilkan loading
        ) : data.data && data.data.length > 0 ? (
          data.data.map((item, index) => (
            <TugasPklCard
              key={index}
              tugasPklId={item.id}
              created_at={formatTanggalIndo(item.tanggal)}
              deskripsi={item.deskripsi_tugas}
              judul={item.tugas}
              link={item.link_soal}
              nama_guru={item.teacher.nama_guru}
              submitFunction={(values) => createTugasMutate(values)}
              tenggat_waktu={formatTanggalIndoJam(item.batas_waktu)}
              isLoading={createIsLoading}
            />
          ))
        ) : (
          <p className="text-center">Anda belum memiliki tugas.</p> // Tampilkan pesan jika tidak ada tugas
        )}
      </div>
      <div className="w-full justify-center mt-4">
            <Pagination
              handlePage={handlePage}
              handlePageSize={handlePageSize}
              page={params.page}
              pageSize={params.pageSize}
              pagination={data?.pagination}
            />
          </div>
    </LayoutPage>
  );
};

export default TugasPklPage;
