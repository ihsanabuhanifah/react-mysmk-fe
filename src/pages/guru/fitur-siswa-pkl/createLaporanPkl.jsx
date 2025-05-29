import usePage from '../../../hook/usePage';
import * as Yup from "yup"
import LayoutPage from '../../../module/layoutPage';
import { Header } from 'semantic-ui-react';

let laporanPkl = Yup.object().shape({
    student_id: Yup.string().required("wajib pilih"),
    judul_kegiatan: Yup.string().required("wajib diisi"),
    isi_laporan: Yup.string().required("wajib diisi"),
    longtitude: Yup.string().required("wajib diisi"),
    latitude: Yup.string().required("wajib diisi"),
    tanggal: Yup.string().required("wajib diisi"),
    penanggung_jawab_perusahaan: Yup.string().required("wajib diisi"),
  });

export default function CreateLaporanPkl (){
    return(
        <LayoutPage title={'Create Laporan Pkl'}>
            <section className='md:mt-5 px-2'>
                <Header>
                    {'Form Tambah Laporan PKL santri'}
                </Header>
            </section>
        </LayoutPage>
    )
}