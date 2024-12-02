

import { useNavigate, useParams } from "react-router-dom";
import usePage from "../../../hook/usePage";
import LayoutPage from "../../../module/layoutPage";
import { Button, Form, Header, Icon, Input, Select } from "semantic-ui-react";
import { useQuery, useQueryClient } from "react-query";
import { detailTugasPkl, updateTugasPkl } from "../../../api/guru/tugas-pkl";
import { useEffect, useState } from "react";
import { Formik } from "formik";
import { toast } from "react-toastify";
import * as Yup from 'yup'
import BatasWaktuPicker from "../../../components/BatasWaktu";

let tugasPklSchema = Yup.object().shape({
    tugas: Yup.string().required("wajib diisi"),
    link_soal: Yup.string().required("wajib diisi"),
    batas_waktu: Yup.string().nullable().required("wajib diisi"),
    deskripsi_tugas: Yup.string().required("wajib diisi"),
})

export default function UpdateTugasPkl() {
    const navigate = useNavigate();
    const { id } = useParams();
    const queryClient = useQueryClient()
    let { page, pageSize, setPage, setPageSize } = usePage();

    let params = {
        page,
        pageSize,

        // is_all: 1,
    };
    let { data, isLoading, isFetching } = useQuery(
        ["/tugas-pkl/update", id],
        () => detailTugasPkl(id),
        {
            enabled: id !== undefined,
            select: (response) => {
                console.log(response.data.data)
                return response.data.data
            },
            onSuccess: (response) => {
                console.log(response)
                setInitialState({
                    id: data?.id,
                    tugas: data?.tugas,
                    link_soal: data?.link_soal,
                    batas_waktu: addSevenHours(data?.batas_waktu),

                    deskripsi_tugas: data?.deskripsi_tugas,
                })
            },
        }
    )


    // const [initialState, setInitialState] = useState({
    //     id: data?.id,
    //     tugas: data?.tugas,
    //     link_soal: data?.link_soal,
    //     batas_waktu: data?.batas_waktu,

    //     deskripsi_tugas: data?.deskripsi_tugas,
    // })
    useEffect(() => {
        if (data) {
            setInitialState({
                id: data.id,
                tugas: data.tugas,
                link_soal: data.link_soal,
                batas_waktu: addSevenHours(data.batas_waktu),
                deskripsi_tugas: data.deskripsi_tugas,
            });
        }
    }, [data]);

    const [initialState, setInitialState] = useState({
        id: "",
        tugas: "",
        link_soal: "",
        batas_waktu: null,
        deskripsi_tugas: "",
    });

    const onSubmit = async (values) => {
        console.log('values', values);

        try {
            const response = await updateTugasPkl(id,values );

            toast.success(response?.data?.msg, {
                position: "top-right",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
            // Invalidate cache untuk data lama
            queryClient.invalidateQueries(["/tugas-pkl/update", id]);
            // Navigate ke halaman detail setelah update
            navigate(`/guru/tugas-laporan-pkl`);
        } catch (err) {
            if (err?.response?.status === 422) {
                return toast.warn(err?.response?.data?.msg, {
                    position: "top-right",
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });
            }
            return toast.error("Ada Kesalahan", {
                position: "top-right",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
        }
    };

    return (
        <LayoutPage title={"Update Tugas Pkl "} isLoading={isFetching}>
            <section className="md:mt-5 px-2">
                <Header>{"Form Update Tugas Pkl"}</Header>
                <div className="flex flex-row justify-start items-center" onClick={() => navigate('/guru/tugas-laporan-pkl')}>
                    <Icon
                        name="arrow left"
                        size="large"

                        className="cursor-pointer"
                    />
                    <p className="text-xl  font-semibold text-black cursor-pointer">Kembali</p>
                </div>
                <Formik initialValues={initialState} enableReinitialize onSubmit={onSubmit} validationSchema={tugasPklSchema}>
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
                        <Form onSubmit={handleSubmit}>

                            {JSON.stringify(values)}
                            {console.log(values)
                            }
                            <div className="grid grid-cols-3 gap-y-3 gap-x-5 shadow-md p-5">
                                <section className="col-span-3 lg:col-span-1">

                                    <Form.Field
                                        control={Input}
                                        label="Tugas Pkl"
                                        placeholder="Ketikan Tugas Pkl"
                                        name={`tugas`}
                                        value={values.tugas}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        fluid
                                        type="text"
                                        error={
                                            errors?.tugas !== undefined &&
                                            touched?.tugas
                                        }
                                    />
                                    {touched.tugas && errors.tugas && (
                                        <div className="ui pointing red basic label ">
                                            {errors.tugas}
                                        </div>
                                    )}
                                </section>
                                <section className="col-span-3 lg:col-span-1">

                                    <Form.Field
                                        control={Input}
                                        label="Link Soal"
                                        placeholder="https://example.com/soal-pkl"
                                        name={`link_soal`}
                                        value={values.link_soal}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        fluid
                                        type="text"
                                        error={
                                            errors?.link_soal !== undefined &&
                                            touched?.link_soal
                                        }
                                    />
                                    {touched.link_soal && errors.link_soal && (
                                        <div className="ui pointing red basic label ">
                                            {errors.link_soal}
                                        </div>
                                    )}
                                </section>


                                <section className="col-span-3 lg:col-span-1">

                                    <Form.Field
                                        control={Input}
                                        label="Deskripsi Tugas "
                                        placeholder="Ketikan Deskripsi Tugas  "
                                        name={`deskripsi_tugas`}
                                        value={values.deskripsi_tugas}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        fluid
                                        type="text"
                                        error={
                                            errors?.deskripsi_tugas !== undefined &&
                                            touched?.deskripsi_tugas
                                        }
                                    />
                                    {touched.deskripsi_tugas && errors.deskripsi_tugas && (
                                        <div className="ui pointing red basic label ">
                                            {errors.deskripsi_tugas}
                                        </div>
                                    )}

                                </section>
                                <section className="col-span-3 lg:col-span-1">


                                    <Form.Field
                                        control={Input}
                                        label={{
                                            children: "Batas Waktu ",
                                            htmlFor: `batas_waktu`,
                                            name: `batas_waktu`,
                                        }}
                                        placeholder="Jenis Ujian"
                                        // options={jenisOptions}
                                        id={`batas_waktu`}
                                        name={`batas_waktu`}
                                        onChange={(e) => {
                                            setFieldValue(
                                                `batas_waktu`,
                                                e.target.value
                                            );
                                        }}

                                        type="datetime-local"
                                        value={values.batas_waktu}
                                    />
                                    {touched.batas_waktu && errors.batas_waktu && (
                                        <div className="ui pointing red basic label">{errors.batas_waktu}</div>
                                    )}
                                </section>
                            </div>
                            <div>
                                <Button content={isSubmitting ? "Menyimpan" : "Simpan"} type="submit" fluid icon={() => <Icon name="save" />} loading={isSubmitting} size="medium" color="teal" disabled={isSubmitting}>

                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </section>


        </LayoutPage>
    )
}


const addSevenHours = (isoString) => {
    if (!isoString) return "";  // Periksa apakah isoString ada

    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "";  // Periksa apakah date valid

    date.setHours(date.getHours() + 7);

    // Format the date to 'YYYY-MM-DDTHH:MM' untuk input datetime-local
    const formattedDate = date.toISOString().slice(0, 16);
    return formattedDate;
};