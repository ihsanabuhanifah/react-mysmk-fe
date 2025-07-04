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
import FormExam from "./FormSoal";
import FormSoal from "./FormSoal";

function ModalUpdateSoal({ open, setOpen, id, copy }) {
  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      size="large"
    >
      <ModalContent>
        <FormSoal id={id} copy={copy} />
      </ModalContent>

      <ModalActions>
        <Button color="red" onClick={() => setOpen(false)}>
          <Icon name="remove" /> Batal
        </Button>
      </ModalActions>
    </Modal>
  );
}

export default ModalUpdateSoal;
