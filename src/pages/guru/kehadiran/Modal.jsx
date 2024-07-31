import React, { useState } from "react";
import {
  ModalContent,
  ModalActions,
  Button,
  Icon,
  Modal,
  Form,
  Select,
  Input,
  TextArea,
} from "semantic-ui-react";
import { useSubmitByAdmin, useSubmitIzin } from "../../../api/guru/absensi";

function ModalIzin({ open, setOpen, tanggalActive, id, values, setValues }) {
  const [payload, setPayload] = useState({
    status: "",
    keterangan: "",
  });

  const mutate = useSubmitIzin({ ...payload, tanggal: tanggalActive });
  const mutateByAdmin = useSubmitByAdmin({
    ...payload,
    values,
    tanggal: tanggalActive,
  });

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      size="small"
    >
      <ModalContent>
        {JSON.stringify(id)}
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
              {
                value: "libur",
                label: "Libur",
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
          loading={mutate.isLoading || mutateByAdmin.isLoading}
          disabled={
            mutate.isLoading ||
            mutateByAdmin.isLoading ||
            !!payload.status === false ||
            (!!payload.keterangan === false && payload.status !== "libur")
          }
          color="green"
          inverted
          onClick={async () => {
            if (id !== 0) {
              await mutateByAdmin.mutate({},{
                onSuccess: () => {
                  setOpen(false);

                  setValues([]);

                  setPayload({
                    status: "",
                    keterangan: "",
                  });
                },
              });
            } else {
              mutate.mutate({
                onSuccess: () => {
                  setOpen(false);
                  setPayload({
                    status: "",
                    keterangan: "",
                  });
                },
              });
            }
          }}
        >
          <Icon name="checkmark" /> Simpan
        </Button>
      </ModalActions>
    </Modal>
  );
}

export default ModalIzin;
