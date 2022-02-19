import React from "react";
import { useNavigate } from "react-router-dom";
import { listJadwal } from "../../api/guru/absensi";
import { useQuery } from "react-query";
export default function Jadwal() {
  let navigate = useNavigate();
  const [hari, setHari] = React.useState("senin");
  let { data, isLoading, isFetching } = useQuery(
    //query key
    ["jadwal", { hari }],
    //axios function,triggered when page/pageSize change
    () => listJadwal(),
    //configuration
    {
      select: (response) => {
        console.log(response);
        return response.data;
      },
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
        <tbody>
          {data?.data?.rows?.map((value, index) => (
            <tr>
              <td>{index + 1}</td>
              <td>{value?.hari}</td>
              <td>{value?.kelas?.nama_kelas}</td>
              <td>{value?.mapel?.nama_mapel}</td>
              <td>{value?.jam_ke}</td>
              <td>{value?.semester}</td>
              <td>{value?.tahun_ajaran?.nama_tahun_ajaran}</td>
              <td>
                <button
                  onClick={() => {
                    return navigate(`/guru/jadwal/absensi/${value?.kelas?.id}/${value?.mapel?.id}`);
                  }}
                >
                  Absensi
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </React.Fragment>
  );
}
