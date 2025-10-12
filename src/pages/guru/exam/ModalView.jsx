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
import MultipleChoiceView from "./MP";
import ModalUpdateSoal from "../bank-soal/ModalUpdate";
import MultiTrueFalseView from "./MTF";

function ModalView({ open, setOpen, preview }) {

  let [openSoal, setOpenSoal] = useState(false)
  let [id,setId]=useState(undefined)
 
  return (
    <>
    <ModalUpdateSoal open={openSoal} setOpen={setOpenSoal} id={id}/>
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
               

                setOpenSoal(true)
                
                setId(preview?.id)

              }}
            />
          </section>


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
 {preview.tipe === "MTF" && (
            <>
              <MultiTrueFalseView
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

           {preview.tipe === "MP" && (
            <>
              <MultipleChoiceView
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
    </Modal></>
  );
}

export default ModalView;
