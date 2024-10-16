import React, { useState, useEffect } from "react";
import { Select, Button, Icon, Form } from "semantic-ui-react";
import { Formik } from "formik";
import { getOptionsText } from "../../../../../utils/format";
import { useParams } from "react-router-dom";

export default function Filter({
  payload,
  onClick,
  setVisible,
  params,
  setParams,
  dataTa,
  dataMapel,
}) {
  const { id } = useParams();
  const [th, setTh] = useState(params.ta || "");
  const [mpl, setMpl] = useState(params.nama_mapel || "");
  const [jenisUjian, setJenisUjian] = useState(params.jenis_ujian || "");

  // Opsi untuk jenis ujian
  const ujianOptions = [
    { value: "tugas", text: "Tugas" },
    {  value: "pts", text: "PTS" },
  ];

  // Menyinkronkan perubahan params dengan state lokal ketika komponen pertama kali di-load
  useEffect(() => {
    setTh(params.ta || "");
    setMpl(params.nama_mapel || "");
    setJenisUjian(params.jenis_ujian || "");
  }, [params]);

  const terapkan = (values, { resetForm }) => {
    setParams((prev) => {
      return {
        ...prev,
        ta: th,
        nama_mapel: mpl,
        jenis_ujian: jenisUjian,
      };
    });
    setVisible(false);
    resetForm();
  };

  return (
    <Formik
      onSubmit={terapkan}
      enableReinitialize
      initialValues={{ ta: th, nama_mapel: mpl, jenis_ujian: jenisUjian }}
    >
      {({ handleSubmit }) => (
        <Form onSubmit={handleSubmit}>
          <section className="p-5 bg-gray-50 border shadow-2xl h-screen space-y-5 relative">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setVisible(false)}
                className="text-lg"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={() => {
                  setParams({
                    ta: null,
                    nama_mapel: null,
                  });
                  setTh("");
                  setMpl("");
                  setVisible(false);
                }}
                className="text-lg"
              >
                Reset
              </button>
            </div>

            {/* Pilihan Mata Pelajaran */}
            <div className="text-left">
              <Form.Field
                control={Select}
                value={mpl}
                options={getOptionsText(dataMapel, "nama_mapel")}
                label="Mata Pelajaran"
                onChange={(event, data) => {
                  setMpl(data.value);
                }}
                placeholder="Pilih Jenis Mata Pelajaran"
                search
                clearable
              />
            </div>

            {/* Pilihan Jenis Ujian */}
            <div className="text-left">
              <Form.Field
                control={Select}
                value={jenisUjian}
                options={ujianOptions}
                // options={[
                //   { value: 1, label: "tugas" },
                //   { value: 2, label: "pts" },
                // ]}
                label="Jenis Ujian"
                onChange={(event, data) => setJenisUjian(data.value)}
                placeholder="Pilih Jenis Ujian"
                search
                clearable
              />
            </div>

            {/* Pilihan Tahun Ajaran */}
            <div className="text-left">
              <Form.Field
                control={Select}
                options={getOptionsText(dataTa, "nama_tahun_ajaran")}
                label="Tahun Ajaran"
                onChange={(event, data) => {
                  setTh(data.value);
                }}
                value={th}
                placeholder="Pilih Tahun Ajaran"
                search
                clearable
              />
            </div>

            <div className="absolute bottom-2 xl:bottom-12 right-2 space-y-2 left-2">
              <Button
                icon={<Icon name="filter" />}
                type="submit"
                content="Terapkan"
                fluid
                color="teal"
              />
            </div>
          </section>
        </Form>
      )}
    </Formik>
  );
}
