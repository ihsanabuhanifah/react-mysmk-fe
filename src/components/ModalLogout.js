import React from "react";
import { Button, Header, Icon, Modal } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
function ModalLogout({ open, setOpen }) {
  const navigate = useNavigate();

  return (
    <Modal
      basic
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      size="small"
    
    >
      <Header icon>
        <Icon name="sign-out" />
      Apalah Anda Yakin Akan Logout?
      </Header>
    
      <Modal.Content className="text-center" content >
        <Button basic color="red" inverted onClick={() => setOpen(false)}>
          <Icon name="remove" /> Tidak
        </Button>
        <Button
          color="green"
          inverted
          onClick={() => {
            Cookies.remove("mysmk_token", { path: "" });
            return navigate("/login");
            return setOpen(false);
          }}
        >
          <Icon name="checkmark" /> Yakin
        </Button>
      </Modal.Content>
    </Modal>
  );
}

export default ModalLogout;
