/* eslint-disable no-unused-vars */
import React from 'react';
import LayoutPage from '../../../module/layoutPage';
import { Form, Tab } from 'semantic-ui-react';
import { useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { getSiswaById } from '../../../api/guru/siswa';
import FormikComponent from './siswa/profileSiswa';
import { toast } from 'react-toastify';

const NilaiContent = () => <div>Konten Nilai</div>;
const UjianContent = () => <div>Konten Ujian</div>;
const PelanggaranContent = () => <div>Konten Pelanggaran</div>;

export function EditSiswa() {
  const [visible, setVisible] = React.useState(false);
  const navigate = useNavigate();
  const { nama } = useParams();

 

  const panes = [
    {
      menuItem: 'Profile',
      render: () => (
        <Tab.Pane style={{ border: 'none', boxShadow: 'none' }}>
          <FormikComponent/>
        </Tab.Pane>
      ),
    },
    {
      menuItem: 'Nilai',
      render: () => (
        <Tab.Pane style={{ border: 'none', boxShadow: 'none' }}>
          <NilaiContent />
        </Tab.Pane>
      ),
    },
    {
      menuItem: 'Ujian',
      render: () => (
        <Tab.Pane style={{ border: 'none', boxShadow: 'none' }}>
          <UjianContent />
        </Tab.Pane>
      ),
    },
    {
      menuItem: 'Pelanggaran',
      render: () => (
        <Tab.Pane style={{ border: 'none', boxShadow: 'none' }}>
          <PelanggaranContent />
        </Tab.Pane>
      ),
    },
  ];

  return (
    <LayoutPage
      title={'Edit Siswa'}
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
