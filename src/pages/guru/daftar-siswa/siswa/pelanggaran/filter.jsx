import React, { useState, useEffect } from "react";
import { Select, Button, Icon, Form } from "semantic-ui-react";
import { Formik } from "formik";
import { getOptionsText } from "../../../../../utils/format";

export default function Filter({
  payload,
  onClick,
  setVisible,
  params,
  setParams,
  dataTa,
  dataPg, 
}) {
  const [th, setTh] = useState(params.ta || "");
  const [pg, setPg] = useState(params.pelanggaran || "");
  const [kt, setKt] = useState(params.kat_pelanggaran || "");

  // Menyinkronkan perubahan params dengan state lokal ketika komponen pertama kali di-load
  useEffect(() => {
    setTh(params.ta || "");
    setPg(params.pelanggaran || "");
    setKt(params.kat_pelanggaran || "");
  }, [params]);

  const terapkan = (values, { resetForm }) => {
    setParams((prev) => {
      return {
        ...prev,
        ta: th,
        pelanggaran: pg,
        kat_pelanggaran: kt,
      };
    });
    setVisible(false);
    resetForm();
  };

  return (
    <Formik
      onSubmit={terapkan}
      enableReinitialize
      initialValues={{ ta: th, pelanggaran: pg, kat_pelanggaran: kt }}
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
                    pelanggaran: null,
                    kat_pelanggaran: null,
                  });
                  setTh("");
                  setPg("");
                  setKt("");
                  setVisible(false);
                }}
                className="text-lg"
              >
                Reset
              </button>
            </div>

            {/* Pilihan Tahun Ajaran */}
            <div className="text-left">
              <Form.Field
                control={Select}
                options={getOptionsText(dataTa, "nama_tahun_ajaran")}
                label="Tahun Ajaran"
                onChange={(event, data) => setTh(data.value)}
                value={th}
                placeholder="Pilih Tahun Ajaran"
                search
                clearable
              />
            </div>

            {/* Pilihan Jenis Pelanggaran */}
            <div className="text-left">
              <Form.Field
                control={Select}
                value={pg}
                options={getOptionsText(dataPg, "nama_pelanggaran")}
                label="Pelanggaran"
                onChange={(event, data) => setPg(data.value)}
                placeholder="Pilih Jenis Pelanggaran"
                search
                clearable
              />
            </div>

            {/* Pilihan Kategori Pelanggaran */}
            <div className="text-left">
              <Form.Field
                control={Select}
                value={kt}
                // options={[
                //   ...new Set(
                //     getOptionsText(dataPg, "kategori").map((option) => ({
                //       value: option.value,
                //       text: option.text
                //     }))
                //   )
                // ]}
                // options={getOptionsText(dataPg, "kategori").filter(
                //   (option) => option.text === "Sedang" || option.text === "Berat"
                // )}
                options={getKategoriOptions()} // Panggil fungsi untuk mengambil opsi kategori pelanggaran

                // options={getOptionsText(dataPg, "kategori")}
                // options={[
                //   { value: 1, label: "sedang" },
                //   { value: 2, label: "berat" },
                // ]}
                label="Kategori Pelanggaran"
                onChange={(event, data) => setKt(data.value)}
                placeholder="Pilih Kategori Pelanggaran"
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

const getKategoriOptions = () => {
  return [
    { value: 'sedang', text: 'Sedang' },
    { value: 'berat', text: 'Berat' },
  ];
};