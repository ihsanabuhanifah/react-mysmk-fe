import React, { useState, useEffect } from "react";
import {
  ItemGroup,
  Segment,
  Header,
  Button,
  Modal,
  Form,
} from "semantic-ui-react";
import { Formik, Form as FormikForm, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  useJawabanPklDetail,
  useUpdateJawabanTugasPkl,
} from "../../../api/siswa/laporan-pkl";

const TugasPklCard = ({
  judul,
  nama_guru,
  created_at,
  tenggat_waktu,
  deskripsi,
  link,
  submitFunction,
  isLoading,
  tugasPklId,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [isTenggatLewat, setIsTenggatLewat] = useState(false);
  const [dataJawaban, setDataJawaban] = useState(null);

  const openLinkInNewTab = () => {
    window.open(link, "_blank");
  };

  const handleOpen = () => {
    setModalOpen(true); // Membuka modal
  };

  const handleClose = () => {
    setModalOpen(false); // Menutup modal
  };

  // Fetch detail jawaban saat modal dibuka
  const { data: jawabanDetail, isFetching } = useJawabanPklDetail(tugasPklId, {
    enabled: modalOpen, // Hanya fetch ketika modal dibuka
  });
  const { mutate, isLoading: updateLoading } = useUpdateJawabanTugasPkl(
    jawabanDetail && jawabanDetail.id
  );

  useEffect(() => {
    if (jawabanDetail) {
      setDataJawaban(jawabanDetail);
      console.log("Jawaban Detail:", jawabanDetail);
    }
  }, [jawabanDetail]);

  useEffect(() => {
    const sekarang = new Date();
    const tenggat = new Date(tenggat_waktu);
    if (sekarang > tenggat) {
      setIsTenggatLewat(true);
    }
  }, [tenggat_waktu]);

  const handleSubmit = (values) => {
    console.log("values", values);
    console.log("ini", jawabanDetail && jawabanDetail);
    if (jawabanDetail && jawabanDetail != null) {
      mutate(values);
    } else {
      submitFunction(values);
    }
  };

  const initialValues = {
    link_jawaban: (jawabanDetail && jawabanDetail.link_jawaban) || "",
    tugas_pkl_id: tugasPklId,
  };

  const validationSchema = Yup.object().shape({
    link_jawaban: Yup.string()
      .url("Link tidak valid")
      .required("Link wajib diisi"),
    tugas_pkl_id: Yup.number().required("ID tugas wajib diisi"),
  });

  return (
    <ItemGroup divided>
      <Segment raised className="p-3 w-full h-auto">
        <div className="flex items-center justify-between mb-1">
          <div className="flex flex-col">
            <p className="text-sm font-semibold">{nama_guru || "-"}</p>
            <p className="text-xs text-gray-500">{created_at || "-"}</p>
          </div>
          <Button
            size="tiny"
            color="blue"
            onClick={handleOpen}
            disabled={isTenggatLewat}
          >
            Kirim Tugas
          </Button>
        </div>
        <div className="flex justify-between items-start">
          <div className="w-3/4">
            <Header as="h3" className="text-lg font-semibold mt-6 pt-2">
              {judul || "-"}
            </Header>
            <p className="text-gray-600 mt-2 text-sm">{deskripsi || "-"}</p>
            {link !== null ? (
              <>
                {" "}
                <a
                  onClick={openLinkInNewTab}
                  className="text-blue-500 underline mt-2 cursor-pointer"
                >
                  Detail Tugas
                </a>
              </>
            ) : (
              <p>-</p>
            )}
          </div>
          <div className="w-1/4 text-right">
            <p className="text-gray-500 text-xs">Tenggat Pengumpulan:</p>
            <p className="text-red-600 font-semibold text-sm">
              {tenggat_waktu || "-"}
            </p>
          </div>
        </div>
      </Segment>

      {/* Modal */}
      <Modal open={modalOpen} onClose={handleClose} size="small">
        <Modal.Header>
          Masukkan Link Jawaban
          <Button
            icon="close"
            floated="right"
            onClick={handleClose}
            color="red"
          />
        </Modal.Header>
        <Modal.Content>
          {isFetching ? (
            <p>Loading...</p>
          ) : (
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({ isSubmitting }) => (
                <FormikForm className="flex flex-col gap-2">
                  <Form.Field className="flex flex-col gap-2">
                    <label>Link Jawaban</label>
                    <Field name="link_jawaban">
                      {({ field }) => (
                        <input
                          {...field}
                          placeholder="Masukkan link di sini..."
                          className="border rounded px-3 py-2 w-full focus:ring focus:ring-blue-200"
                        />
                      )}
                    </Field>
                    <ErrorMessage
                      name="link_jawaban"
                      component="div"
                      style={{ color: "red", fontSize: "12px" }}
                    />
                  </Form.Field>
                  <Button
                    type="submit"
                    loading={isSubmitting}
                    color="blue"
                    className="mt-2"
                  >
                    Kirim
                  </Button>
                </FormikForm>
              )}
            </Formik>
          )}
        </Modal.Content>
      </Modal>
    </ItemGroup>
  );
};

export default TugasPklCard;
