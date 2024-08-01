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

  console.log("item", item);

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      size="large"
    >
      <ModalHeader>Preview Soal </ModalHeader>

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

      {/* <ModalContent>
        <ModalDescription>
          {["PG", "TF"].includes(preview.tipe) && (
            <>
              {" "}
              <section className="border flex items-center justify-between rounded-lg p-5 mb-5">
                <Header size="medium">Jawaban ({preview.jawaban})</Header>
                <div>
                  {" "}
                
                </div>
              </section>
            </>
          )}
          <section className="border rounded-lg p-5">
           <section className="flex items-center justify-between"> <Header size="medium">Uraian Soal</Header>
            <EditButton
                    onClick={() => {
                      navigate(`/guru/bank-soal/update/${preview.id}`, {
                        replace: true,
                      });
                    }}
                  /></section>
            <Divider horizontal>=</Divider>
            <div>{htmr(`<div>${soal.soal}</div>`)}</div>
          </section>

         
        </ModalDescription>
      </ModalContent> */}

      <ModalActions>
        <Button color="red" inverted onClick={() => setOpen(false)}>
          <Icon name="remove" /> Batal
        </Button>
        <Button
          color="green"
          inverted
          loading={mutate.isLoading}
          disabled={mutate.isLoading}
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
