import React, { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  ModalContent,
  ModalActions,
  Button,
  Icon,
  Modal,
  ModalHeader,
} from "semantic-ui-react";

import Pg from "./PG";
import TF from "./TF";
import ES from "./ES";
import { useUpdateLastExam } from "../../../api/guru/ujian";
import useList from "../../../hook/useList";

function ModalPenilaian({
  open,
  setOpen,
  soal,
  jawaban,
  item,
  setItem,
  values,
  namaSiswa,
}) {
  let [loading, setLoading] = useState(false);
  const [payload, setPayload] = useState(jawaban);
  const mutate = useUpdateLastExam();
  const { roles } = useList();

  const ref = useRef();

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      size="large"
    >
      <ModalHeader>
        <section className="flex items-center justify-end">
          <Button
            loading={loading}
            onClick={async () => {
              setLoading(true);
              handleDownloadPdf(ref, namaSiswa, setLoading);
            }}
          >
            Download Sebagai PDF
          </Button>
        </section>
      </ModalHeader>

      <ModalContent>
        <section ref={ref}>
          <section className="mb-5 flex items-center">
            <p className="opacity-90">
              {namaSiswa.nama_siswa}{" "}
              <p className="opacity-90">{namaSiswa.mapel}</p>
            </p>
          </section>
          {soal &&
            soal?.map((item, index) => {
              return (
                <section key={index} className="space-y-5">
                  {item.tipe === "PG" && (
                    <section className="mb-5 border rounded-lg shadow-md p-5">
                      <Pg
                        nomor={index + 1}
                        soals={JSON.parse(item.soal)}
                        jawaban={payload}
                        item={item}
                      />
                    </section>
                  )}
                  {item.tipe === "TF" && (
                    <section className="mb-5 border rounded-lg shadow-md p-5">
                      <TF
                        nomor={index + 1}
                        soals={JSON.parse(item.soal)}
                        jawaban={payload}
                        item={item}
                      />
                    </section>
                  )}
                  {item.tipe === "ES" && (
                    <section className="mb-5 border rounded-lg shadow-md p-5">
                      <ES
                        nomor={index + 1}
                        soals={JSON.parse(item.soal)}
                        jawaban={payload}
                        item={item}
                        setPayload={setPayload}
                      />
                    </section>
                  )}
                </section>
              );
            })}
        </section>
      </ModalContent>

      <ModalActions>
        <Button color="red" onClick={() => setOpen(false)}>
          <Icon name="remove" /> Batal
        </Button>

        {values?.data?.[0]?.teacher_id === roles?.teacher_id && (
          <Button
            color="teal"
            loading={mutate.isLoading}
            disabled={
              mutate.isLoading || !!jawaban === false || jawaban.length === 0
            }
            onClick={() => {
              mutate.mutate(
                {
                  jawaban: payload,
                  student_id: item.student_id,
                  id: item.id,
                },
                {
                  onSuccess: () => {
                    setOpen(false);
                  },
                }
              );
            }}
          >
            <Icon name="check" /> Perbaharui
          </Button>
        )}
      </ModalActions>
    </Modal>
  );
}

export default ModalPenilaian;

const handleDownloadPdf = async (printRef, profile, setLoading) => {
  const element = printRef.current;
  const canvas = await html2canvas(element, {
    scale: window.devicePixelRatio || 1,
    useCORS: true,
    logging: true,
    width: element.scrollWidth,
    height: element.scrollHeight,
  });
  const data = canvas.toDataURL("image/png");

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: [canvas.width, canvas.height],
  });
  const imgProperties = pdf.getImageProperties(data);
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

  pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight);
  pdf.save(`${profile.nama_siswa} - ${profile.mapel} - ${new Date()}`);
  setLoading(false);
};
