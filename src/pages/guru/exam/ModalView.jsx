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
  HeaderContent,
} from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import htmr from "htmr";

import { useCreatePenilaian } from "../../../api/guru/ujian";
import { EditButton } from "../../../components";
import Pg from "./PG";
import TF from "./TF";
import ES from "./ES";

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
      <ModalContent>
        <ModalDescription>
          <section className="flex items-center justify-end w-full mb-5">
            <EditButton
            size="md"
            
              onClick={() => {

                window.open(`/guru/bank-soal/update/${preview.id}`)
                // navigate(`/guru/bank-soal/update/${preview.id}`, {
                //   replace: true,
                // });
              }}
            />
          </section>

          {console.log('ore', preview)}

          {preview.tipe === "PG" && (
            <>
              <Pg
                nomor={1}
                soals={JSON.parse(preview.soal)}
                jawaban={[
                  {
                    id: preview.id,
                    tipe: preview.tipe,
                    jawaban: preview.jawaban,
                  },
                ]}
                item={preview}
              />{" "}
            </>
          )}
          {preview.tipe === "TF" && (
            <>
              <TF
                nomor={1}
                soals={JSON.parse(preview.soal)}
                jawaban={[
                  {
                    id: preview.id,
                    tipe: preview.tipe,
                    jawaban: preview.jawaban,
                  },
                ]}
                item={preview}
              />{" "}
            </>
          )}
          {preview.tipe === "ES" && (
            <>
              <ES
                nomor={1}
                soals={JSON.parse(preview.soal)}
                jawaban={[
                  {
                    id: preview.id,
                    tipe: preview.tipe,
                    jawaban: preview.jawaban,
                  },
                ]}
                item={preview}
              />{" "}
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
