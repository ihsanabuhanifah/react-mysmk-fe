import React from "react";
import { Button, Header, Icon, Modal } from "semantic-ui-react";

function ModalKonfrimasi({ open, setOpen, loading, onConfirm, title }) {
  return (
    <Modal
      basic
       className="z-[9999999999] "
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      size="small"
      //   trigger={<Button>Basic Modal</Button>}
    >
      <Header icon>
        <Icon color="yellow" name="warning" />
        <p className="text-center mt-4 text-yellow-400">{title}</p>
      </Header>

      <Modal.Content className="text-center" content>
        <Button basic color="red" inverted onClick={() => setOpen(false)}>
          <Icon name="cancel" /> No
        </Button>
        <Button
          tabIndex={1}
          color="yellow"
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

export default ModalKonfrimasi;
