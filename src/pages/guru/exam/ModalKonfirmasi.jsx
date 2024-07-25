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

import { useCreatePenilaian } from "../../../api/guru/ujian";

function ModalKonfirmasi({ open, setOpen, payload, setPayload }) {
  const mutate = useCreatePenilaian();

  console.log("payload", payload);
  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      size="small"
    >
      <ModalHeader>Konfirmasi Publish Ujian?</ModalHeader>

      <ModalContent>
        <ModalDescription>
          Apa yakin akan mempublish ujian ini?

          
        </ModalDescription>
      </ModalContent>

      <ModalActions>
        <Button color="red" inverted onClick={() => setOpen(false)}>
          <Icon name="remove" /> Batal
        </Button>
        <Button
          loading={mutate.isLoading}
          disabled={mutate.isLoading}
          color="green"
          onClick={() => {
            mutate.mutate( payload, {
              onSuccess: () => {
                setOpen(false);
              },
            });
          }}
        >
          <Icon name="checkmark" /> Konfirmasi
        </Button>
      </ModalActions>
    </Modal>
  );
}

export default ModalKonfirmasi;
