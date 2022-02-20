import React from "react";
import { useNavigate } from "react-router-dom";
import { listJadwal } from "../../api/guru/absensi";
import { useQuery } from "react-query";
import dayjs from "dayjs";
import { formatHari, formatTahun } from "../../utils";
export default function Jadwal() {
  const navigate = useNavigate();
  let date = new Date();
  let [hari, setHari] = React.useState(formatHari(new Date()));
  const parameter = {
    hari,
  };
  let { data, isLoading, isFetching } = useQuery(
    //query key
    ["jadwal", parameter],
    //axios function,triggered when page/pageSize change
    () => listJadwal(parameter),
    //configuration
    {
      select: (response) => {
        console.log(response);
        return response.data;
      },
    }
  );

  return (
    <React.Fragment>
      <div>
        <select
          value={hari}
          name="hari"
          id="hari"
          onChange={(e) => {
            console.log("jalan" , e.target.value);
            setHari(e.target.value);
          }}
        >
          <option value="senin">Senin</option>
          <option value="selasa">Selasa</option>
          <option value="rabu">Rabu</option>
          <option value="kamis">Kamis</option>
          <option value="jumat">Jumat</option>
          <option value="sabtu">Sabtu</option>
          <option value="ahad">Ahad</option>
        </select>
      </div>
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
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{value?.hari}</td>
              <td>{value?.kelas?.nama_kelas}</td>
              <td>{value?.mapel?.nama_mapel}</td>
              <td>{value?.jam_ke}</td>
              <td>{value?.semester}</td>
              <td>{value?.tahun_ajaran?.nama_tahun_ajaran}</td>
              <td>
                <button
                  className="text-white bg-blue-300 hover:bg-blue-500 px-2 py-1 rounded-md"
                  onClick={() => {
                    return navigate(
                      `/guru/jadwal/absensi/${value?.kelas?.id}/${
                        value?.mapel?.id
                      }/${formatTahun(date)}`
                    );
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
