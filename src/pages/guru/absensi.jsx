import React from "react";
import { useNavigate } from "react-router-dom";
import { listAbsensi } from "../../api/guru/absensi";
import { useQuery } from "react-query";
export default function Absensi() {
  let [page, setPage] = React.useState(1);
  let [pageSize, setPageSize] = React.useState(10);
  let [dariTanggal, setDariTanggal] = React.useState('2022-02-17')
  let [sampaiTanggal, setSampaiTanggal] = React.useState('2022-02-17')
  let navigate = useNavigate();

  let parameter = {
    page,
    pageSize,
    dariTanggal,
    sampaiTanggal,
  };
  let { isLoading, isError, data, isFetching } = useQuery(
    //query key
    ["absensi", parameter],
    //axios function,triggered when page/pageSize change
    () => listAbsensi(parameter),
    //configuration
    {
      keepPreviousData: true,
      select: (response) => response.data,
    }
  );
  console.log(data);
  return (
    <React.Fragment>
      <table>
        <thead>
          <tr>
            <th>No</th>
            <th>Hari</th>
            <th>Kelas</th>
            <th>Mata Pelajaran</th>
            <th>Jam_ke</th>
            <th>Semester</th>
            <th>Tahun Ajaran</th>
            <th>Aksi</th>
          </tr>
        </thead>
        {/* <tbody>
          {data?.data?.rows?.map((value, index) => (
            <tr>
              <td>{index+1}</td>
              <td>{value?.hari}</td>
              <td>{value?.kelas?.nama_kelas}</td>
              <td>{value?.mapel?.nama_mapel}</td>
              <td>{value?.jam_ke}</td>
              <td>{value?.semester}</td>
              <td>{value?.tahun_ajaran?.nama_tahun_ajaran}</td>
              <td>
                <button>Absensi</button>
              </td>
            </tr>
          
          ))}
        </tbody> */}
      </table>
    </React.Fragment>
  );
}
