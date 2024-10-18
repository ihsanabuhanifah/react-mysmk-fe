import { useNavigate, useParams } from "react-router-dom";
import usePage from "../../../hook/usePage";
import { useQueryClient } from "react-query";
import LayoutPage from "../../../module/layoutPage";
import { Icon, TextArea } from "semantic-ui-react";
import { Formik } from "formik";
import { Form, Select, Button, Header, Input } from "semantic-ui-react";

import * as Yup from "yup"
import { useState } from "react";
import { toast } from "react-toastify";
import { createTugasPkl } from "../../../api/guru/tugas-pkl";
import { FormLabel, ReactSelectAsync } from "../../../components";
import BatasWaktuPicker from "../../../components/BatasWaktu";
import moment from "moment";
import TextEditorToolbar from "../../../components/ToolBar";
import Editor from "../../../components/Editor";

let tugasPklSchema = Yup.object().shape({
    tugas: Yup.string().required("wajib diisi"),
    link_soal: Yup.string().required("wajib diisi"),
    batas_waktu: Yup.string().required("wajib diisi"),
    deskripsi_tugas: Yup.string().required("wajib diisi"),
})

export default function CreateTugasPkl() {
    const navigate = useNavigate();
    const { id } = useParams();
    let { page, pageSize, setPage, setPageSize } = usePage();
    let queryClient = useQueryClient();

    let params = {
        page,
        pageSize,


    };
    const [initialState, setInitialState] = useState({
        tugas: "",
        link_soal: "",
        batas_waktu: "",
        deskripsi_tugas: "",
    })

    const onSubmit = async (values, { resetForm }) => {
        console.log('values submit create', values);

        try {
            // Jika API membutuhkan format lain, sesuaikan format di sini
            const formattedValues = {
                ...values,
                batas_waktu: moment(values.batas_waktu).format('YYYY-MM-DD'), // Memastikan format batas_waktu sesuai
            };

            const response = await createTugasPkl(formattedValues);

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
            resetForm();

            queryClient.invalidateQueries("tempat-pkl/list");
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
        <LayoutPage title={"Create Tugas Pkl"}>
            <section className="md:mt-5 px-2">
                <Header>{"Form Tambah Tempat pkl"}</Header>
                <div className="flex flex-row justify-start items-center" onClick={() => navigate('/guru/tugas-laporan-pkl')}>
                    <Icon
                        name="arrow left"
                        size="large"

                        className="cursor-pointer"
                    />
                    <p className="text-xl  font-semibold text-black cursor-pointer">Kembali</p>
                </div>
                <Formik initialValues={initialState} enableReinitialize onSubmit={onSubmit} validationSchema={tugasPklSchema} >
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
                            {console.log('er', errors)}
                            {console.log('er toched', touched)}
                            {JSON.stringify(values)}
                            <div className="grid grid-cols-3 gap-y-2 gap-x-5 shadow-md p-5 ">
                                <section className="col-span-3 lg:col-span-1">

                                    <Form.Field
                                        control={Input}
                                        label="Tugas Pkl"
                                        placeholder="Ketikan Tugas Pkl"
                                        name={`tugas`}
                                        value={values?.tugas}
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
                                        value={values?.link_soal}
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

                                    {/* <Form.Field>
                                        <label>Batas Waktu</label>
                                        <BatasWaktu
                                            value={values.batas_waktu}
                                            onChange={(date) => setFieldValue("batas_waktu", date)}
                                        />
                                        {touched.batas_waktu && errors.batas_waktu && (
                                            <div className="ui pointing red basic label ">
                                                {errors.batas_waktu}
                                            </div>
                                        )}
                                    </Form.Field> */}

                                    {/* <Form.Field
                                        control={Input}
                                        label="Batas Waktu "
                                        placeholder="Ketikan Batas Waktu  "
                                        name={`batas_waktu`}
                                        value={values?.batas_waktu}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        fluid
                                        type="text"
                                        error={
                                            errors?.batas_waktu !== undefined &&
                                            touched?.batas_waktu
                                        }
                                    />
                                    {touched.batas_waktu && errors.batas_waktu && (
                                        <div className="ui pointing red basic label ">
                                            {errors.batas_waktu}
                                        </div>
                                    )} */}
                                    <BatasWaktuPicker
                                        value={values.batas_waktu}
                                        onChange={(date) => setFieldValue('batas_waktu', date)}
                                    />
                                    {touched.batas_waktu && errors.batas_waktu && (
                                        <div className="ui pointing red basic label ">
                                            {errors.batas_waktu}
                                        </div>
                                    )}
                                </section>

                                <section className="col-span-3 lg:col-span-1">

                                    <Form.Field
                                        control={TextArea}
                                        label="Deskripsi Tugas "
                                        placeholder="Ketikan Deskripsi Tugas  "
                                        name={`deskripsi_tugas`}
                                        value={values?.deskripsi_tugas}
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
                                    {/* <Editor
                                        value={values?.deskripsi_tugas}
                                        handleChange={(content) => {
                                            const detail = handleSoal(payload, item);
                                            setPayload((s) => {
                                                s.data[detail.index] = {
                                                    ...detail.soal[0],
                                                    deskripsi_tugas: content,
                                                };
                                                setJawaban(content);
                                                return {
                                                    ...s,
                                                    data: s.data,
                                                };
                                            });
                                        }}
                                    /> */}
                                </section>
                            </div>
                            <div>
                                <Button content={isSubmitting ? "Menyimpan" : "Simpan"} type="submit" fluid icon={() => <Icon name="save" />} loading={isSubmitting} size="medium" color="teal" disabled={isSubmitting}>

                                </Button>
                            </div>


                        </Form>
                    )
                    }
                </Formik>
            </section>
        </LayoutPage>
    )

}


// const BatasWaktu = ({ value, onChange }) => {
//     const [year, setYear] = useState('')
//     const [month, setMonth] = useState('')
//     const [day, setDay] = useState('')
//     // const [time, setTime] = useState("23:59:59");

//     const years = [
//         { key: 2024, value: 2024, text: "2024" },
//         { key: 2025, value: 2025, text: "2025" },
//         { key: 2026, value: 2026, text: "2026" },
//         // Tambahkan tahun sesuai kebutuhan
//     ];
//     const months = [
//         { key: 1, value: "01", text: "Januari" },
//         { key: 2, value: "02", text: "Februari" },
//         { key: 3, value: "03", text: "Maret" },
//         { key: 4, value: "04", text: "April" },
//         { key: 5, value: "05", text: "Mei" },
//         { key: 6, value: "06", text: "Juni" },
//         { key: 7, value: "07", text: "Juli" },
//         { key: 8, value: "08", text: "Agustus" },
//         { key: 9, value: "09", text: "September" },
//         { key: 10, value: "10", text: "Oktober" },
//         { key: 11, value: "11", text: "November" },
//         { key: 12, value: "12", text: "Desember" },
//     ];
//     const days = Array.from({ length: 31 }, (_, i) => ({
//         key: i + 1,
//         value: String(i + 1).padStart(2, "0"),
//         text: (i + 1).toString(),
//     }));

//     const handleDateChange = (newYear, newMonth, newDay) => {
//         const date = `${newYear}-${newMonth}-${newDay}`;
//         // const date = `${newYear}-${newMonth}-${newDay}T${time}`;
//         onChange(date); // Memanggil fungsi onChange untuk mengirimkan nilai ke formik
//     };
//     return (
//         <Form.Group widths="equal">
//             <Form.Field
//                 control={Select}
//                 label="Tahun"
//                 options={years}
//                 placeholder="Pilih Tahun"
//                 value={year}
//                 onChange={(_, data) => {
//                     setYear(data.value);
//                     handleDateChange(data.value, month, day);
//                 }}
//             />
//             <Form.Field
//                 control={Select}
//                 label="Bulan"
//                 options={months}
//                 placeholder="Pilih Bulan"
//                 value={month}
//                 onChange={(_, data) => {
//                     setMonth(data.value);
//                     handleDateChange(year, data.value, day);
//                 }}
//             />
//             <Form.Field
//                 control={Select}
//                 label="Tanggal"
//                 options={days}
//                 placeholder="Pilih Tanggal"
//                 value={day}
//                 onChange={(_, data) => {
//                     setDay(data.value);
//                     handleDateChange(year, month, data.value);
//                 }}
//             />
//         </Form.Group>
//     );
// };
