/* eslint-disable no-unused-vars */
import React from 'react';
import LayoutPage from "../../../module/layoutPage";
import { Tab } from 'semantic-ui-react';
import FormikComponent from './pembayaran/bayar';
import { useParams } from 'react-router-dom';


export default function EditPembayaran() {
  const {id} = useParams();
  console.log("ID yang diterima dari URL:", id); // Tambahkan log di sini

  const [visible, setVisible] = React.useState(false);
  const panes = [
    {
      menuItem: 'Pembayaran',
      render: () => (
        <Tab.Pane style={{ border: 'none', boxShadow: 'none' }}>
          <FormikComponent id={id} onSuccess={() => console.log("Success mengirimkan") } onError={(err) => console.error(err)} />
        </Tab.Pane>
      ),
    },
  ];

  return (
    <LayoutPage
      title={"Edit Pembayaran"}
      visible={visible}
      setVisible={setVisible}
    >
      <section className="grid gap-5">
        <div className="col-span-6 lg:col-span-1 xl:col-span-1">
          <Tab menu={{ secondary: true, pointing: true }} panes={panes} />
        </div>
      </section>
    </LayoutPage>
  );
}
