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
import { useSubmitPulang } from "../../../api/guru/absensi";

function ModalKepulangan({ open, setOpen, tanggalActive }) {
  const pulang = useSubmitPulang({ tanggal: tanggalActive });

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      size="small"
    >
      <ModalHeader>Konfirmasi Kepulangan</ModalHeader>

      <ModalContent>
        <ModalDescription>
          Apa yakin absensi pulang pada jam ini?
        </ModalDescription>
      </ModalContent>

      <ModalActions>
        <Button color="red" inverted onClick={() => setOpen(false)}>
          <Icon name="remove" /> Batal
        </Button>
        <Button
          // loading={pulang.loading}
          loading={pulang.isLoading}
          disabled={pulang.isLoading}
          color="green"
         
          onClick={() => {
            pulang.mutate({
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

export default ModalKepulangan;
