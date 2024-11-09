import React, { useState } from "react";
import {
  ModalContent,
  ModalActions,
  Button,
  Icon,
  Modal,
  ModalHeader,
  ModalDescription,
} from "semantic-ui-react";

function ModalKonfirmasi({ open, setOpen, onClick }) {
 
  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      size="small"
    >
      <ModalHeader>STOP SCAN</ModalHeader>

      <ModalContent>
        <ModalDescription>
          Apa yakin akan menyudahi proses scan?
        </ModalDescription>
      </ModalContent>

      <ModalActions>
        <Button color="red" inverted onClick={() => setOpen(false)}>
          <Icon name="remove" /> Batal
        </Button>
        <Button
          color="green"
          onClick={onClick}
        >
          <Icon name="checkmark" /> Konfirmasi
        </Button>
      </ModalActions>
    </Modal>
  );
}

export default ModalKonfirmasi;
