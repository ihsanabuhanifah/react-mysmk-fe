import { Header, Input } from "semantic-ui-react";
import LayoutPage from "../../../module/layoutPage";
import { Form, Formik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import usePage from "../../../hook/usePage";
import { useQuery, useQueryClient } from "react-query";
import { listLaporanPkl } from "../../../api/guru/laporanharianpkl";
import { useEffect, useState } from "react";
import * as Yup from "yup";

let laporanPkl = Yup.object().shape({
  student_id: Yup.string().required("wajib pilih"),
  judul_kegiatan: Yup.string().required("wajib diisi"),
  // pembimbing_id: Yup.string().required("wajib diisi"),
  isi_laporan: Yup.string().required("wajib diisi"),
  tanggal: Yup.string().required("wajib diisi"),
  longtitude: Yup.string().required("wajib diisi"),
  latitude: Yup.string().required("wajib diisi"),
  penanggung_jawab_perusahaan: Yup.string().required("wajib diisi"),
});

export default function UpdateLaporanPkl() {
  const navigate = useNavigate();
  const { id } = useParams();
  let { page, pageSize, setPage, setPageSize } = usePage();

  let params = {
    page,
    pageSize,

    // is_all: 1,
  };
  let { data, isLoading } = useQuery(
    //query key
    ["/laporan-harian-pkl/list", params],
    //axios function,triggered when page/pageSize change
    () => listLaporanPkl(params),
    //configuration
    {
      // refetchInterval: 1000 * 60 * 60,
      select: (response) => {
        return response.data;
      },
    },
  );
  // useEffect(() => {
  //     if(!!data === true){
  //       setInitialState({
  //         ...data,
  //         nama_siswa : {
  //           value : data.student_id,
  //           label : data.siswa.nama_siswa
  //         }
  //       });
  //     }
  //   }, [data])
  let queryClient = useQueryClient();
  const [initialState, setInitialState] = useState({
    id: data?.id,
    student_id: data?.siswa?.id,
    nama_siswa: {
      value: data?.siswa?.id,
      label: data?.siswa?.nama_siswa,
    },
    judul_kegiatan: data?.judul_kegiatan,
    isi_laporan: data?.isi_laporan,
    tanggal: data?.tanggal,

    penanggung_jawab_perusahaan: data?.penanggung_jawab_perusahaan,
    longtitude: data?.longtitude,
    latitude: data?.latitude,
  });
  return (
    <LayoutPage title={"Update Laporan Santri"}>
      <section className="px-2 md:mt-5">
        <Header>{"Form Update LaporanPkl"}</Header>
        {/* <Formik  >
                    {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        isSubmitting,
                        setFieldTouched,
                        setFieldValue,
                        resetForm
                    }) => (
                        <Form>
                            <div className="grid grid-cols-3 gap-y-2 gap-x-5 shadow-md p-5">
                                <section className="col-span-3 lg:col-span-1">

                                    <Form.Field
                                        control={Input}
                                        label="Perusahaan PKL Santri"
                                        placeholder="Ketikan Perusahaan PKL Santri"
                                        name={`judul_kegiatan`}
                                        value={values?.judul_kegiatan}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        fluid
                                        type="text"
                                        error={
                                            errors?.judul_kegiatan !== undefined &&
                                            touched?.judul_kegiatan
                                        }
                                    />
                                    {touched.judul_kegiatan && errors.judul_kegiatan && (
                                        <div className="ui pointing red basic label ">
                                            {errors.judul_kegiatan}
                                        </div>
                                    )}
                                </section>
                            </div>
                        </Form>
                    )}
                </Formik> */}
      </section>
    </LayoutPage>
  );
}
