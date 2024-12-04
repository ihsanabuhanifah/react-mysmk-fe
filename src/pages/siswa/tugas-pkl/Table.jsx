import React, { useState, useEffect } from "react";
import { Table, Segment, Button, Modal, Form, Icon } from "semantic-ui-react";
import {
  useJawabanPklDetail,
  useUpdateJawabanTugasPkl,
} from "../../../api/siswa/laporan-pkl";
import { Formik, Form as FormikForm, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { format, parseISO } from "date-fns";
import { formatTanggalIndo } from "../../../utils/formatTanggal";

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

  return `${hari} ${bulan[bulanIndex]} ${tahun} ${jam}:${menit}`;
}

const TugasPklTable = ({ data, submitFunction, isLoading }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [tugasPklId, setTugasPklId] = useState(null); // Tambahkan state untuk tugasPklId
  const [isTenggatLewat, setIsTenggatLewat] = useState({});
  const [dataJawaban, setDataJawaban] = useState(null);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const [indicatorVisible, setIndicatorVisible] = useState(false);
  const [modalBellOpen, setModalBellOpen] = useState(false);

  const handleOpen = (id) => {
    setTugasPklId(id); // Set tugasPklId saat modal dibuka
    setModalOpen(true);
  };
  const handleClose = () => setModalOpen(false);

  const { data: jawabanDetail, isFetching } = useJawabanPklDetail(tugasPklId, {
    enabled: modalOpen || modalBellOpen,
  });
  console.log(jawabanDetail, "ini");

  const { mutate, isLoading: updateLoading } = useUpdateJawabanTugasPkl(
    jawabanDetail && jawabanDetail.id
  );
  useEffect(() => {
    // Mengecek setiap item dalam data apakah tenggat waktu sudah terlewati
    const tenggatMap = {};
    data.forEach((item) => {
      const now = new Date();
      const batasWaktu = parseISO(item.batas_waktu);
      tenggatMap[item.id] = now > batasWaktu;
    });
    setIsTenggatLewat(tenggatMap);
  }, [data]);

  useEffect(() => {
    if (jawabanDetail) setDataJawaban(jawabanDetail);
  }, [jawabanDetail]);
  const handleNotificationClick = (id) => {
    setTugasPklId(id);
    setIndicatorVisible(false);
    localStorage.setItem(`messageRead_${tugasPklId}`, "true");
    setModalBellOpen(true); // Open modal when bell is clicked
  };

  const handleSubmit = (values) => {
    if (jawabanDetail) {
      mutate(values);
    } else {
      submitFunction(values);
    }
  };

  const handleBellModalClose = () => {
    setModalBellOpen(false);
  };

  return (
    <Segment
      raised
      compact="very"
      className="no-gap-table"
      style={{ borderSpacing: 0 }}
    >
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
                link_jawaban: jawabanDetail?.link_jawaban || "",
                tugas_pkl_id: tugasPklId || "",
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
              {({ isSubmitting, values }) => (
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
          {jawabanDetail &&
          (jawabanDetail.status !== null || jawabanDetail.pesan !== null) ? (
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
                <strong>Pesan: </strong>{" "}
                {jawabanDetail.pesan || "Tidak ada pesan"}
              </p>
            </>
          ) : (
            // Tampilkan ini jika jawabanDetail masih null atau datanya kosong
            <p>Tidak ada data untuk ditampilkan</p>
          )}
        </Modal.Content>
      </Modal>

      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Nama Guru</Table.HeaderCell>
            <Table.HeaderCell>Dibuat Pada</Table.HeaderCell>
            <Table.HeaderCell>Judul</Table.HeaderCell>
            <Table.HeaderCell>Deskripsi</Table.HeaderCell>
            <Table.HeaderCell>Tenggat Waktu</Table.HeaderCell>
            {/* <Table.HeaderCell>Status Jawaban</Table.HeaderCell> */}
            <Table.HeaderCell>Aksi</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data.map((item, index) => {
            // const jawabanStatus = jawabanDetail?.find(
            //   (jawaban) => jawaban.tugas_pkl_id === item.id
            // )?.status;

            return (
              <Table.Row key={index}>
                <Table.Cell>{item.teacher.nama_guru || "-"}</Table.Cell>
                <Table.Cell>
                  {formatTanggalIndo(item.tanggal) || "-"}
                </Table.Cell>
                <Table.Cell>{item.tugas || "-"}</Table.Cell>
                <Table.Cell>{item.deskripsi_tugas || "-"}</Table.Cell>
                <Table.Cell>
                  <span className="text-red-600 font-semibold">
                    {formatTanggalIndoJam(item.batas_waktu) || "-"}
                  </span>
                </Table.Cell>
                {/* <Table.Cell>
                  <span
                    style={{
                      color:
                        jawabanStatus === "gagal"
                          ? "red"
                          : jawabanStatus === "selesai"
                          ? "green"
                          : jawabanStatus === "revisi"
                          ? "orange"
                          : "black",
                    }}
                  >
                    {jawabanStatus || "Belum ada jawaban"}
                  </span>
                </Table.Cell> */}
                <Table.Cell>
                  <div className="flex items-center space-x-3">
                    <Button
                      icon
                      basic
                      color="blue"
                      onClick={() => handleNotificationClick(item.id)}
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
                    <Button
                      size="tiny"
                      color="blue"
                      onClick={() => handleOpen(item.id)} // Panggil handleOpen dengan item.id
                      disabled={isTenggatLewat[item.id]}
                    >
                      Kirim Tugas
                    </Button>
                  </div>
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </Segment>
  );
};

export default TugasPklTable;
