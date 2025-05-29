import { Form, Formik } from "formik";
import useList from "../../../hook/useList";
import { FormLabel, ReactSelectAsync } from "../../../components";
import { Button, Icon, Input } from "semantic-ui-react";
import { listSiswaOptions } from "../../../api/list";

export default function FilterSiswaPkl({ filter, setFilter, setVisible }) {
    const { dataKelas, dataMapel, dataTa } = useList();

    const onSubmit = (values, { resetForm }) => {
        setFilter(values);
        setVisible(false);
        resetForm();
    };
    return (
        <Formik initialValues={filter} enableReinitialize onSubmit={onSubmit} >
            {({ values, setValues, resetForm, handleSubmit, setFieldValue, }) => (
                <Form onSubmit={handleSubmit}>
                    <section className="p-5 bg-gray-50 border shadow-2xl h-screen space-y-5 relative">
                        <div className="grid grid-cols-2">
                            {/* <button
                                type="b"
                                onClick={() => {
                                    setVisible(false);
                                }}
                                className="text-lg"
                            >
                                Tutup
                            </button> */}

                            <Button type="button" primary color="blue" content={'Tutup'} onClick={() => {
                                setVisible(false);
                            }} ></Button>

                            {/* <Button icon={() => <Icon name='trash alternate' onClick={() => {
                                resetForm();
                                setValues({

                                    nama_perusahaan: '',
                                    nama_siswa: '',
                                    // alamat: '',
                                    // kota: '',
                                    // kode_pos: '',
                                    // no_hp: '',
                                    // penanggung_jawab_perusahaan: '',
                                    // penanggung_jawab_sekolah: '',
                                    // nama_guru: '',
                                });
                            }} />} type="reset" content="Reset" fluid color="red" /> */}
                            <button
                                type="submit"
                                onClick={() => {
                                    resetForm();
                                    setValues({
                                        nama_perusahaan: '',
                                        nama_siswa: '',
                                        // alamat: '',
                                        // kota: '',
                                        // kode_pos: '',
                                        // no_hp: '',
                                        // penanggung_jawab_perusahaan: '',
                                        // penanggung_jawab_sekolah: '',
                                        // nama_guru: '',
                                    });
                                }}
                                className="text-lg text-red-500 font-bold  "
                            >
                                Reset
                            </button>


                        </div>







                        <div className="text-left">
                            <FormLabel label={"Nama Siswa"}>
                                <ReactSelectAsync
                                    debounceTimeout={300}
                                    value={values?.nama_siswa}
                                    loadOptions={listSiswaOptions}
                                    isClearable
                                    onChange={(data) => {
                                        setFieldValue(`nama_siswa`, data);
                                    }}
                                    placeholder="Nama Siswa"
                                    additional={{
                                        page: 1,
                                    }}
                                />
                            </FormLabel>
                        </div>



                        <div className="absolute bottom-2 xl:bottom-12 right-2 left-2">
                            <Button icon={() => <Icon name='filter' />} type="submit" content="Terapkan" fluid color="teal" />
                        </div>
                    </section>
                </Form>
            )}

        </Formik>
    )
}