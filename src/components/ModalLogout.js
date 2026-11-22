import { Button, Header, Icon, Modal } from "semantic-ui-react";
import { logout } from "../api/tokenManager";
import { clearToken } from "../api/axiosClient";
function ModalLogout({ open, setOpen }) {


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
        Apakah Anda Yakin Akan Logout?
      </Header>

      <Modal.Content className="text-center" content>
        <Button basic color="red" inverted onClick={() => setOpen(false)}>
          <Icon name="remove" /> Tidak
        </Button>
        <Button
          color="green"
          inverted
          onClick={() => {
            clearToken();
            // cabut refresh token di server, hapus cookie, kembali ke /login
            logout();
          }}
        >
          <Icon name="checkmark" /> Yakin
        </Button>
      </Modal.Content>
    </Modal>
  );
}

export default ModalLogout;
