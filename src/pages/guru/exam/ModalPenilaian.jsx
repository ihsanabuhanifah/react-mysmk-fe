import React, { useState } from "react";
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

function ModalPenilaian({ open, setOpen, soal, jawaban, item, setItem }) {
  const [payload, setPayload] = useState(jawaban);
  const mutate = useUpdateLastExam();

  console.log("jawaban", !!jawaban, jawaban);

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      size="large"
    >
      <ModalHeader>Jawaban Siswa </ModalHeader>

      <ModalContent>
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
      </ModalContent>

      <ModalActions>
        <Button color="red" onClick={() => setOpen(false)}>
          <Icon name="remove" /> Batal
        </Button>
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
      </ModalActions>
    </Modal>
  );
}

export default ModalPenilaian;
