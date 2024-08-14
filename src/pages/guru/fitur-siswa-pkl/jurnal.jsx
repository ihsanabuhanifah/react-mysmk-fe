import React from 'react'
import LayoutPage from '../../../module/layoutPage'
import { DeleteButton, ModalAlert } from '../../../components'
import { useQueryClient } from 'react-query';
import useDelete from '../../../hook/useDelete';
import { deleteSiswaPkl } from '../../../api/guru/fitur-pkl';
import { Button, Checkbox, Form, Header, Icon, Input, PlaceholderParagraph, TextArea } from 'semantic-ui-react';
import { Formik } from 'formik';
import { toast } from 'react-toastify';
import { createSiswaHandle } from '../../../api/guru/siswa';
import { useParams } from 'react-router-dom';

export default function JurnalSantri() {
    let { tanggal } = useParams();
    let [tanggalActive, setTanggalActive] = React.useState(tanggal);
    let queryClient = useQueryClient();
    const [initialState, setInitialState] = React.useState({



        data: [
            {
                kelas_id: "",
                student_id: "",
                student_name: "",
                semester: "",
                ta_id: "",
                status: 1,
            },
        ],
    });

    let {
        showAlertDelete,
        setShowAlertDelete,
        deleteLoading,
        confirmDelete,
        onConfirmDelete,
    } = useDelete({
        afterDeleted: () => queryClient.invalidateQueries("/tempat-pkl/list"),
        onDelete: (id) => {
            return deleteSiswaPkl(id);
        },
    });
    const onSubmit = async (values, { resetForm }) => {
        try {
            const response = await createSiswaHandle(values);
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
            setInitialState({
                data: [
                    {
                        // student_id: "",
                        // nama_siswa: "",
                        // nama_perusahaan: "",
                        // daerah_perusahaan: "",
                        // no_hp: 0,

                        kelas_id: "",
                        student_id: "",
                        student_name: "",
                        semester: "",
                        ta_id: "",
                        status: 1,
                    }
                ]
            });
            queryClient.invalidateQueries("siswa/list");
        }
        catch (err) {
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
                })
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
        <LayoutPage title={'Jurnal Harian Santri'}>
            <div className="mt-5 space-y-5">
                <section className='md:mt-5 px-2'>
                    <Header>Tambah Jurnal Harian</Header>
                    <Formik initialValues={initialState} enableReinitialize onSubmit={onSubmit}>
                        {({
                            values,
                            errors,
                            touched,
                            handleChange,
                            handleBlur,
                            handleSubmit,
                            setFieldValue,
                            isSubmitting,

                        }) => (
                            <Form onSubmit={handleSubmit}>
                                {JSON.stringify(values)}
                                <div className='space-y-5 '>
                                    {values?.data?.map((value, index) => {
                                        return (
                                            <>
                                                <div className="col-span-3 flex justify-end">
                                                    <DeleteButton disabled={values.data.length <= 1} onClick={() => {
                                                        let filtered = values.data.filter(
                                                            (i, itemIndex) => {
                                                                return itemIndex !== index;
                                                            }
                                                        );

                                                        setFieldValue("data", filtered);
                                                    }}
                                                        size="small"></DeleteButton>
                                                </div>
                                                <div className="grid grid-cols-1 gap-y-2 gap-x-5 shadow-md p-5">
                                                    <div className="grid grid-cols-2  gap-x-5 ">
                                                        <section>
                                                            <Form.Field
                                                                control={Input}
                                                                label="Judul Jurnal Harian"
                                                                placeholder="Masukan Judul Jurnal"
                                                                name={`pelanggaran[${index}tipe]`}
                                                                value={value?.tipe}
                                                                fluid
                                                                type="text"
                                                            />
                                                        </section>
                                                        <section>
                                                            <Form.Field
                                                                control={Input}
                                                                label="Tanggal"
                                                                name="email"
                                                                fluid
                                                                onChange={(e) => {
                                                                    setTanggalActive(e.target.value);
                                                                }}
                                                                value={tanggalActive}
                                                                type="date"
                                                            />
                                                        </section>
                                                    </div>
                                                    <section>
                                                        <Form.Field
                                                            control={Input}
                                                            label="Foto Dokumentasi"
                                                            placeholder="Masukan Judul Jurnal"
                                                            name={`pelanggaran[${index}tipe]`}
                                                            value={value?.tipe}
                                                            fluid
                                                            type="text"
                                                        />
                                                    </section>
                                                    <section>
                                                        <Form.TextArea
                                                            control={TextArea}
                                                            label="Deskripsi Jurnal Harian"
                                                            placeholder="Masukan Judul Jurnal"
                                                            name={`pelanggaran[${index}tipe]`}
                                                            value={value?.tipe}
                                                            fluid
                                                            type="text"
                                                        />

                                                    </section>
                                                    <section>
                                                        <Header>Kegiatan Ceklist Hari Ini</Header>
                                                        <PlaceholderParagraph className='font-bold'>Dzikir</PlaceholderParagraph>
                                                    </section>
                                                    <div className="grid grid-cols-2 gap-y-2 gap-x-3 ">
                                                        <section>
                                                            <Form.Checkbox
                                                                control={Checkbox}
                                                                label="Sudah Dzikir Pagi" type='checkbox' />
                                                        </section>
                                                        <section>
                                                            <Form.Checkbox
                                                                control={Checkbox}
                                                                label="Sudah Dzikir  Petang" type='checkbox' />
                                                        </section>
                                                    </div>
                                                    <div className="grid grid-cols-1 gap-y-2">
                                                        <section>

                                                            <PlaceholderParagraph className='font-bold'>Shalat</PlaceholderParagraph>
                                                        </section>
                                                        <Form.Checkbox control={Checkbox} label="Sudah Sholat Shubuh" />
                                                        <Form.Checkbox control={Checkbox} label="Sudah Sholat Dzuhur" />
                                                        <Form.Checkbox control={Checkbox} label="Sudah Sholat Ashar" />
                                                        <Form.Checkbox control={Checkbox} label="Sudah Sholat Magrib" />
                                                        <Form.Checkbox control={Checkbox} label="Sudah Sholat Isya" />
                                                        <section className='grid grid-cols-1 gap-y-2'>

                                                            <PlaceholderParagraph className='font-bold'>Membaca Al Quran</PlaceholderParagraph>
                                                            <Form.Checkbox control={Checkbox} label="Sudah Membaca Al Quran 1 Juz" />

                                                        </section>
                                                    </div>

                                                </div>

                                            </>
                                        )
                                    })}
                                </div>
                                <div className="">
                                    <div className="flex items-center justify-center w-full my-5">
                                        <Button
                                            basic
                                            fluid
                                            type="button"
                                            color="teal"
                                            content="Tambah"
                                            icon="add"
                                            labelPosition="left"
                                            onClick={() => {
                                                setFieldValue("data", [
                                                    ...values?.data,
                                                    {
                                                        halaqoh_id: "",
                                                        student_id: "",

                                                        status: 1,
                                                    },
                                                ]);
                                            }}
                                        >
                                            Tambah
                                        </Button>
                                    </div>
                                    <Button
                                        content={isSubmitting ? "Menyimpan" : "Simpan"}
                                        type="submit"
                                        fluid
                                        icon={() => <Icon name="save" />}
                                        loading={isSubmitting}
                                        size="medium"
                                        color="teal"
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </Form>
                        )}
                    </Formik>
                </section>
            </div>
        </LayoutPage>
    )
}
