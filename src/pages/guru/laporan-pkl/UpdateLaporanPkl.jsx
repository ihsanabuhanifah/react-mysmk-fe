import { Form, Header, Input } from "semantic-ui-react";
import LayoutPage from "../../../module/layoutPage";
import { Formik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import usePage from "../../../hook/usePage";
import { useQuery, useQueryClient } from "react-query";
import { detailLaporanPkl, listLaporanPkl } from "../../../api/guru/laporanharianpkl";
import { useEffect, useState } from "react";
import * as Yup from 'yup'
import { FormLabel, ReactSelectAsync } from "../../../components";
import { listSiswaPklOptions } from "../../../api/list";
import { DateRange } from "react-date-range";

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
    let { data, isLoading, isFetching } = useQuery(
        //query key
        ["/laporan-harian-pkl/detail", id],
        //axios function,triggered when page/pageSize change
        () => detailLaporanPkl(id),
        //configuration
        {
            // refetchInterval: 1000 * 60 * 60,
            enabled: id !== undefined,
            select: (response) => {
                console.log(response.data.data)
                return response.data.data;
            },
            onSuccess: (data) => {
                console.log('data', data)
            }
        }
    );
    useEffect(() => {
        if (!!data === true) {
            setInitialState({
                ...data,
                nama_siswa: {
                    value: data.student_id,
                    label: data.siswa.nama_siswa
                }
            });
        }
    }, [data])
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
            <section className="md:mt-5 px-2">
                <Header>{"Form Update LaporanPkl"}</Header>
                <Formik initialValues={initialState} enableReinitialize >
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
                            {JSON.stringify(values)}
                            <div className="grid grid-cols-3 gap-y-2 gap-x-5 shadow-md p-5">
                                <section className="col-span-3 lg:col-span-1">
                                    <FormLabel
                                        error={errors?.student_id && touched?.student_id}
                                        label={"Nama Siswa"}
                                    >
                                        <ReactSelectAsync
                                            debounceTimeout={300}
                                            value={values?.nama_siswa}
                                            loadOptions={listSiswaPklOptions}
                                            onChange={(data) => {
                                                // console.log('data siswa', data);
                                                setFieldValue(`nama_siswa`, data);
                                                setFieldValue(
                                                    `student_id`,
                                                    data.value
                                                );
                                            }}
                                            error={
                                                errors?.student_id !== undefined &&
                                                touched?.student_id
                                            }

                                            placeholder="Nama Siswa"
                                            additional={{
                                                page: 1,
                                            }}
                                        />
                                    </FormLabel>


                                </section>
                                <div className="col-span-3 lg:col-span-1">
                                    <Form.Field
                                        control={Input}
                                        label="Kegiatan Santri"
                                        placeholder="Ketikan Kegiatan Santri"
                                        name={`judul_kegiatan`}
                                        value={values.judul_kegiatan}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        fluid
                                        type="text"

                                    />
                                </div>
                                <div className="col-span-3 lg:col-span-1">
                                    <Form.Field
                                        control={Input}
                                        label="Laporan Santri"
                                        placeholder="Ketikan Laporan Santri"
                                        name={`isi_laporan`}
                                        value={values.isi_laporan}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        fluid
                                        type="text"

                                    />
                                </div>
                                <div className="col-span-3 lg:col-span-1">
                                    <Form.Field
                                        control={Input}
                                        label="Longtitude"
                                        placeholder="Ketikan Longtitude"
                                        name={`longtitude`}
                                        value={values.longtitude}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        fluid
                                        type="text"

                                    />
                                </div>
                                <div className="col-span-3 lg:col-span-1">
                                    <Form.Field
                                        control={Input}
                                        label="Latitude"
                                        placeholder="Ketikan Latitude"
                                        name={`latitude`}
                                        value={values.latitude}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        fluid
                                        type="text"

                                    />


                                </div>
                                <div className="col-span-3 lg:col-span-1">
                                    <Form.Field
                                        control={DateRange}
                                        label="Pilih Tanggal"
                                        placeholder="Ketikan Pilih Tanggal"
                                        name={`tanggal`}
                                        value={values.tanggal}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        fluid
                                        type="text"

                                    />
                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>
            </section>
        </LayoutPage>
    )
}