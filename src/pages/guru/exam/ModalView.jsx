import React, { useState } from "react";
import {
  ModalContent,
  ModalActions,
  Button,
  Icon,
  Modal,
  ModalHeader,
  ModalDescription,
  Header,
  Divider,
} from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import htmr from "htmr";

import { useCreatePenilaian } from "../../../api/guru/ujian";
import { EditButton } from "../../../components";

function ModalView({ open, setOpen, preview }) {
  let soal = JSON.parse(preview.soal);

  const navigate = useNavigate();

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      size="small"
    >
      <ModalHeader>Preview Soal </ModalHeader>

      <ModalContent>
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

          {preview.tipe === "PG" && (
            <>
              {" "}
              <section className="border rounded-lg p-5 mt-5">
                <Header size="medium">Pilihan A</Header>
                <Divider horizontal>=</Divider>
                <div>{htmr(`<div>${soal.a}</div>`)}</div>
              </section>
              <section className="border rounded-lg p-5 mt-5">
                <Header size="medium">Pilihan B</Header>
                <Divider horizontal>=</Divider>
                <div>{htmr(`<div>${soal.b}</div>`)}</div>
              </section>
              <section className="border rounded-lg p-5 mt-5">
                <Header size="medium">Pilihan C</Header>
                <Divider horizontal>=</Divider>
                <div>{htmr(`<div>${soal.c}</div>`)}</div>
              </section>
              <section className="border rounded-lg p-5 mt-5">
                <Header size="medium">Pilihan D</Header>
                <Divider horizontal>=</Divider>
                <div>{htmr(`<div>${soal.d}</div>`)}</div>
              </section>
              <section className="border rounded-lg p-5 mt-5">
                <Header size="medium">Pilihan E</Header>
                <Divider horizontal>=</Divider>
                <div>{htmr(`<div>${soal.e}</div>`)}</div>
              </section>
            </>
          )}
        </ModalDescription>
      </ModalContent>

      <ModalActions>
        <Button color="red" inverted onClick={() => setOpen(false)}>
          <Icon name="remove" /> Batal
        </Button>
      </ModalActions>
    </Modal>
  );
}

export default ModalView;
