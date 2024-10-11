import React from "react";
import { Button, Modal } from "semantic-ui-react";

function ModalPage({ open, setOpen, header, children }) {
  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      size="fullscreen" // Menambahkan ukuran fullscreen
    >
      <Modal.Header>{header}</Modal.Header>
      <Modal.Content style={{ overflowY: "auto", maxHeight: "calc(100vh - 100px)" }}>
        {children}
      </Modal.Content>
      <Modal.Actions>
        <Button color="black" onClick={() => setOpen(false)}>
          Tutup
        </Button>
      
      </Modal.Actions>
    </Modal>
  );
}

export default ModalPage;
