import { Input, Form, Button, Icon, Select } from "semantic-ui-react";
import { Formik } from "formik";
import { getOptionsText } from "../../../utils/format";
import useList from "../../../hook/useList";
import { toast } from "react-toastify";
import { sendwhatsAPP } from "../../../api/guru/spp";

export default function NotifikasiSpp({ filter, setFilter, setVisible }) {
  const { dataTa } = useList();

  const handleSendWhatsApp = async (values) => {
    try {
      const taId = dataTa?.data.find(
        (item) => item.nama_tahun_ajaran === values.tahun_ajaran
      )?.id;

      if (!taId) {
        throw new Error("Tahun ajaran tidak valid.");
      }

      const payload = {
        bulan_pilihan: values.bulan_pilihan,
        ta_id: taId,
      };
      const response = await sendwhatsAPP(payload);
      if (response.data.status === "Success") {
        toast.success("Pesan WhatsApp berhasil dikirim!");
        setVisible(false);
      } else {
        toast.error("Gagal mengirim pesan WhatsApp.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Terjadi kesalahan saat mengirim pesan WhatsApp.");
    }
  };

  const onSubmit = (values, { resetForm }) => {
    setFilter(values);
    setVisible(false);
    resetForm();
  };

  return (
    <Formik initialValues={filter} enableReinitialize onSubmit={onSubmit}>
      {({ values, setValues, resetForm, handleSubmit, setFieldValue }) => (
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
                  resetForm();
                  setValues({
                    bulan_pilihan: "",
                    tahun_ajaran: "",
                  });
                }}
                className="text-lg"
              >
                Reset
              </button>
            </div>

            <div className="text-left">
              <Form.Field
                control={Input}
                label={{ children: "Bulan", size: "medium" }}
                onChange={(e) => setFieldValue("bulan_pilihan", e.target.value)}
                value={values?.bulan_pilihan}
                placeholder="Masukkan Bulan"
              />
            </div>

            <div className="text-left">
              <Form.Field
                control={Select}
                options={getOptionsText(dataTa?.data, "nama_tahun_ajaran")}
                label={{ children: "Tahun Pelajaran" }}
                onChange={(event, data) =>
                  setFieldValue("tahun_ajaran", data.value)
                }
                placeholder="Pilih Tahun Pelajaran"
                search
                value={values?.tahun_ajaran}
                clearable
              />
            </div>

            <div className="absolute bottom-2 xl:bottom-12 right-2 left-2">
              <Button
                icon={() => <Icon name="whatsapp" />}
                type="button"
                onClick={() => handleSendWhatsApp(values)}
                content="Kirim Pesan"
                fluid
                color="green"
              />
            </div>
          </section>
        </Form>
      )}
    </Formik>
  );
}
