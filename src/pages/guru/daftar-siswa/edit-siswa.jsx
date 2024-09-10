  /* eslint-disable no-unused-vars */
  import React from 'react';
  import LayoutPage from '../../../module/layoutPage';
  import { Form, Tab } from 'semantic-ui-react';
  import { useQuery } from 'react-query';
  import { useNavigate, useParams } from 'react-router-dom';
  import { getSiswaById } from '../../../api/guru/siswa';
  import ProfileComponent from './siswa/profileSiswa';
  import NilaiComponent from './siswa/nilaiSiswa/nilai';
  import { toast } from 'react-toastify'; 
  import PelanggaranComponent from './siswa/pelanggaran/pelanggaran';

  // const NilaiContent = () => <div>Konten Nilai</div>;
  // const UjianContent = () => <div>Konten Ujian</div>;
  // const PelanggaranContent = () => <div>Konten Pelanggaran</div>;

  export function EditSiswa({dataTa}) {
    const [visible, setVisible] = React.useState(false);
    const navigate = useNavigate();
    const { nama } = useParams();

  

    const panes = [
      {
        menuItem: 'Profile',
        render: () => (
          <Tab.Pane style={{ border: 'none', boxShadow: 'none' }}>
            <ProfileComponent/>
          </Tab.Pane>
        ),
      },
      {
        menuItem: 'Nilai',
        render: () => (
          <Tab.Pane style={{ border: 'none', boxShadow: 'none' }}>
            <NilaiComponent dataTa={dataTa}/>
          </Tab.Pane>
        ),
      },
      {
        menuItem: 'Pelanggaran',
        render: () => (
          <Tab.Pane style={{ border: 'none', boxShadow: 'none' }}>
            {/* <PelanggaranContent /> */}
            <PelanggaranComponent/>
          </Tab.Pane>
        ),
      },
      // {
      //   menuItem: 'Prestasi',
      //   render: () => (
      //     <Tab.Pane style={{ border: 'none', boxShadow: 'none' }}>
      //       {/* <PelanggaranContent /> */}
      //       <PelanggaranComponent/>
      //     </Tab.Pane>
      //   ),
      // },
    ];

    return (
      <LayoutPage
        title={'Profile Siswa'}
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
