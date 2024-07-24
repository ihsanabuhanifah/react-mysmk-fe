import React, { useState } from "react";
import {
  ModalContent,
  ModalActions,
  Button,
  Header,
  Icon,
  Modal,
  Form,
  Select,
  Input,
  TextArea,
} from "semantic-ui-react";
import { useSubmitIzin } from "../../../api/guru/absensi";

function ModalIzin({ open, setOpen, tanggalActive }) {
  const [payload, setPayload] = useState({
    status: "",
    keterangan: "",
  });

  const mutate = useSubmitIzin({ ...payload, tanggal: tanggalActive });

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      size="small"
    >
      <ModalContent>
        {JSON.stringify(payload)}
        <Form>
          <Form.Field
            control={Select}
            label="Alasan Ketidakhadiran"
            options={[
              {
                value: "sakit",
                label: "Sakit",
              },
              {
                value: "izin",
                label: "Izin",
              },
              {
                value: "tugas",
                label: "Tugas Sekolah",
              },
            ]}
            onChange={(event, data) => {
              console.log("data", data);
              setPayload((s) => {
                return {
                  ...s,
                  status: data.value,
                };
              });
            }}
            value={payload.status}
            placeholder="Pilih"
            search
          />
          <Form.Field
            label="Keterangan"
            control={TextArea}
            onChange={(e) => {
              setPayload((s) => {
                return {
                  ...s,
                  keterangan: e.target.value,
                };
              });
            }}
            value={payload.keterangan}
            placeholder="Pilih"
            search
          />
        </Form>
      </ModalContent>
      <ModalActions>
        <Button color="red" inverted onClick={() => setOpen(false)}>
          <Icon name="remove" /> Batal
        </Button>
        <Button
          loading={mutate.isLoading}
          disabled={mutate.isLoading || !!payload.status === false || !!payload.keterangan ===false}
          color="green"
          inverted
          onClick={() => {
            mutate.mutate({
              onSuccess: () => {
                setOpen(false);
                setPayload({
                  status: "",
                  keterangan: "",
                });
              },
            });
          }}
        >
          <Icon name="checkmark" /> Simpan
        </Button>
      </ModalActions>
    </Modal>
  );
}

export default ModalIzin;
