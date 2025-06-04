import { Input, Select, Form, Button, Icon } from "semantic-ui-react";

import { getOptionsText } from "../../../utils/format";
import useList from "../../../hook/useList";
export default function Filter({ value, setValue }) {
  const { dataKelas, dataTa } = useList();
  return (
    <section className="flex items-center space-x-5">
      <div>
        <Form.Field
          control={Select}
          options={getOptionsText(dataKelas?.data, "nama_kelas")}
          label={{
            children: "Kelas",
          }}
          onChange={(event, data) => {
            setValue((v) => {
              return {
                ...v,
                nama_kelas: data?.value,
              };
            });
            // setFieldValue(`nama_kelas`, data?.value);
          }}
          placeholder="Pilih"
          search
          value={value?.nama_kelas}
          clearable
          searchInput={
            {
              //   id: `laporan.guru.absen[${index}]nama_kelas`,
              //   name: `laporan.guru.absen[${index}]nama_kelas`,
            }
          }
        />
      </div>
      <div className="text-left">
        <Form.Field
          control={Select}
          // value={absen?.nama_guru}
          options={getOptionsText(dataTa?.data, "nama_tahun_ajaran")}
          label={{
            children: "Tahun Pelajaran",
            //   htmlFor: `laporan.guru.absen[${index}]nama_guru`,
            //   name: `laporan.guru.absen[${index}]nama_guru`,
          }}
          onChange={(event, data) => {
            setValue((v) => {
              return {
                ...v,
                tahun_ajaran: data?.value,
              };
            });
          }}
          placeholder="Pilih"
          search
          value={value?.tahun_ajaran}
          clearable
          searchInput={
            {
              //   id: `laporan.guru.absen[${index}]nama_guru`,
              //   name: `laporan.guru.absen[${index}]nama_guru`,
            }
          }
        />
      </div>
      <div className="text-left">
        <Form.Field
          control={Select}
          // value={absen?.nama_guru}
          options={[
            { key: "1", value: 1, text: 1 },
            { key: "2", value: 2, text: 2 },
            { key: "3", value: 3, text: 3 },
            { key: "4", value: 4, text: 4 },
            { key: "5", value: 5, text: 5 },
            { key: "6", value: 6, text: 6 },
          ]}
          label={{
            children: "Semester",
            //   htmlFor: `laporan.guru.absen[${index}]nama_guru`,
            //   name: `laporan.guru.absen[${index}]nama_guru`,
          }}
          onChange={(event, data) => {
            setValue((v) => {
              return {
                ...v,
                semester: data?.value,
              };
            });
          }}
          placeholder="Pilih"
          search
          value={value?.semester}
          clearable
          searchInput={
            {
              //   id: `laporan.guru.absen[${index}]nama_guru`,
              //   name: `laporan.guru.absen[${index}]nama_guru`,
            }
          }
        />
      </div>
    </section>
  );
}
