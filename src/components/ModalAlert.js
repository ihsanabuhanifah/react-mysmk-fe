import React from "react";
import { Button, Header, Icon, Modal } from "semantic-ui-react";

function ModalAlert({ open, setOpen, loading, onConfirm , title }) {
  return (
    <Modal
      basic
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      size="small"
      //   trigger={<Button>Basic Modal</Button>}
    >
      <Header icon>
        <Icon color="red" name="trash" />
        <p className="text-center mt-4">
         {title}
        </p>
      </Header>
      
      <Modal.Content className="text-center" content >
        <Button basic color="red" inverted onClick={() => setOpen(false)}>
          <Icon name="remove" /> No
        </Button>
        <Button
        tabIndex={1}
          color="red"
          loading={loading}
          inverted
          onClick={onConfirm}
        >
          <Icon name="checkmark" /> Yes
        </Button>
      </Modal.Content>
    </Modal>
  );
}

export default ModalAlert;
