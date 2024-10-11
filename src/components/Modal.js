import React from "react";
import { Button, Header, Image, Modal } from "semantic-ui-react";

function ModalFilter({ open, setOpen, header, children }) {
  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Button>Filter</Button>}
    >
      <Modal.Header>{header}</Modal.Header>
      <Modal.Content image>{children}</Modal.Content>
      <Modal.Actions>
        <Button color="black" onClick={() => setOpen(false)}>
          Batal
        </Button>
        <Button content="filter" onClick={() => setOpen(false)} positive />
      </Modal.Actions>
    </Modal>
  );
}

export default ModalFilter;
