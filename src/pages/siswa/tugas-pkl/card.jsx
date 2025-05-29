import React, { useState, useEffect } from "react";
import {
  ItemGroup,
  Segment,
  Header,
  Button,
  Modal,
  Form,
  Icon,
} from "semantic-ui-react";
import {
  useJawabanPklDetail,
  useUpdateJawabanTugasPkl,
} from "../../../api/siswa/laporan-pkl";
import { Formik, Form as FormikForm, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

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
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const [indicatorVisible, setIndicatorVisible] = useState(false);
  const [modalBellOpen, setModalBellOpen] = useState(false); // State for Bell modal

  const openLinkInNewTab = () => {
    window.open(link, "_blank");
  };

  const handleOpen = () => {
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
  };

  // Fetch detail jawaban saat modal dibuka
  const { data: jawabanDetail, isFetching } = useJawabanPklDetail(tugasPklId, {
    enabled: modalOpen || modalBellOpen, // Fetch saat modal manapun terbuka
  });

  const { mutate, isLoading: updateLoading } = useUpdateJawabanTugasPkl(
    jawabanDetail && jawabanDetail.id
  );

  useEffect(() => {
    if (jawabanDetail) {
      setDataJawaban(jawabanDetail);
    }
  }, [jawabanDetail]);

  useEffect(() => {
    const sekarang = new Date();
    const tenggat = new Date(tenggat_waktu);
    if (sekarang > tenggat) {
      setIsTenggatLewat(true);
    }
  }, [tenggat_waktu]);

  // Check if there are any messages or statuses
  useEffect(() => {
    const isMessageRead = localStorage.getItem(`messageRead_${tugasPklId}`);

    if (jawabanDetail && (jawabanDetail.pesan || jawabanDetail.status)) {
      setIndicatorVisible(!isMessageRead);
      setHasUnreadMessages(true);
    } else {
      setHasUnreadMessages(false);
    }
  }, [jawabanDetail]);

  // Handle marking the message as read
  const handleNotificationClick = () => {
    setIndicatorVisible(false);
    localStorage.setItem(`messageRead_${tugasPklId}`, "true");
    setModalBellOpen(true); // Open modal when bell is clicked
  };

  const handleBellModalClose = () => {
    setModalBellOpen(false);
  };

  const handleSubmit = (values) => {
    if (jawabanDetail && jawabanDetail != null) {
      mutate(values);
    } else {
      submitFunction(values);
    }
  };

  return (
    <ItemGroup divided>
      <Segment raised className="p-3 w-full h-auto">
        <div className="flex items-center justify-between mb-1">
          <div className="flex flex-col">
            <p className="text-sm font-semibold">{nama_guru || "-"}</p>
            <p className="text-xs text-gray-500">{created_at || "-"}</p>
          </div>

          <div className="flex items-center space-x-3"> {/* Adjust space */} 
  {/* Notification Button */}
  <Button
    icon
    basic
    color="blue"
    onClick={handleNotificationClick}
    style={{ position: "relative" }} // Add relative position to the Button
  >
    <Icon name="bell" />
    {indicatorVisible && (
      <div
        style={{
          width: "12px", // Adjust size for better visibility
          height: "12px",
          backgroundColor: "red",
          borderRadius: "50%",
          position: "absolute",
          top: "0px", // Adjust position
          right: "0px", // Adjust position
          border: "2px solid white", // Add border to make it more visible
        }}
      />
    )}
  </Button>

  {/* Submit Button */}
  <Button
    size="tiny"
    color="blue"
    onClick={handleOpen}
    disabled={isTenggatLewat}
  >
    Kirim Tugas
  </Button>
</div>
        </div>

        <div className="flex justify-between items-start">
          <div className="w-3/4">
            <Header as="h3" className="text-lg font-semibold mt-6 pt-2">
              {judul || "-"}
            </Header>
            <p className="text-gray-600 mt-2 text-sm">{deskripsi || "-"}</p>
            {link !== null ? (
              <a
                onClick={openLinkInNewTab}
                className="text-blue-500 underline mt-2 cursor-pointer"
              >
                Detail Tugas
              </a>
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

      {/* Modal for Sending Assignment */}
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
              initialValues={{
                link_jawaban:
                  (jawabanDetail && jawabanDetail.link_jawaban) || "",
                tugas_pkl_id: tugasPklId,
              }}
              validationSchema={Yup.object().shape({
                link_jawaban: Yup.string()
                  .url("Link tidak valid")
                  .required("Link wajib diisi"),
                tugas_pkl_id: Yup.number().required("ID tugas wajib diisi"),
              })}
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

      {/* Modal for Bell Notifications */}
      <Modal open={modalBellOpen} onClose={handleBellModalClose} size="small">
  <Modal.Header>
    Detail Pesan
    <Button
      icon="close"
      floated="right"
      onClick={handleBellModalClose}
      color="red"
    />
  </Modal.Header>
  <Modal.Content>
    {/* Cek apakah jawabanDetail ada dan bukan null */}
    {jawabanDetail && (jawabanDetail.status !== null || jawabanDetail.pesan !== null) ? (
      <>
        <p>
          <strong>Status: </strong>
          <span
            className="pl-1 text-lg font-semibold"
            style={{
              color:
                jawabanDetail.status === "gagal"
                  ? "red"
                  : jawabanDetail.status === "selesai"
                  ? "green"
                  : jawabanDetail.status === "revisi"
                  ? "orange"
                  : "black", // Default color for other statuses
            }}
          >
            {jawabanDetail.status || "Tidak ada status"}
          </span>
        </p>
        <p>
          <strong>Pesan: </strong> {jawabanDetail.pesan || "Tidak ada pesan"}
        </p>
      </>
    ) : (
      // Tampilkan ini jika jawabanDetail masih null atau datanya kosong
      <p>Tidak ada data untuk ditampilkan</p>
    )}
  </Modal.Content>
</Modal>

    </ItemGroup>
  );
};

export default TugasPklCard;
