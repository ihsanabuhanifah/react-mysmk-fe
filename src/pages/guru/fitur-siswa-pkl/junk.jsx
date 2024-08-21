


import React from 'react';
import LayoutPage from '../../../module/layoutPage';
import { DeleteButton, EditButton, ModalAlert, PaginationTable, TableLoading } from '../../../components';
import useDelete from '../../../hook/useDelete';
import { useQuery, useQueryClient } from 'react-query';
import { Button, Icon, Input, Table } from "semantic-ui-react";
import { useNavigate } from 'react-router-dom';
import usePage from "../../../hook/usePage";
import { createSiswaPkl, deleteSiswaPkl, listSiswaPkl, updateSiswaPkl } from '../../../api/guru/fitur-pkl';
import { toast } from 'react-toastify';
import * as Yup from "yup"
import useDebounce from '../../../hook/useDebounce';
import FormFiturPkl from './FormSiswaPkl';
import { Collapse } from 'react-collapse';
import { handleViewNull } from '../../../utils';
import { Formik } from 'formik';

let siswapklSchema = Yup.object().shape({
    student_id: Yup.string().required("wajib pilih"),
    nama_perusahaan: Yup.string().required("wajib diisi"),
    pembimbing_id: Yup.string().required("wajib diisi"),
   
    alamat: Yup.string().required("wajib diisi"),
    provinsi: Yup.string().required("wajib diisi"),
    kota: Yup.string().required("wajib diisi"),
    kecamatan: Yup.string().required("wajib diisi"),
    desa: Yup.string().required("wajib diisi"),
    rt: Yup.string().required("wajib diisi"),
    rw: Yup.string().required("wajib diisi"),
    kodepos: Yup.string().required("wajib diisi"),
    no_hp: Yup.string().required("wajib diisi"),
    longtitude: Yup.string().required("wajib diisi"),
    latitude: Yup.string().required("wajib diisi"),
});

let siswapklArraySchema = Yup.object().shape({
    data: Yup.array().of(siswapklSchema),
});

export default function FiturPkl() {
    let [nama, setNama] = React.useState("");
    let debouncedName = useDebounce(nama, 600);
    let navigate = useNavigate();
    let { page, pageSize, setPage, setPageSize } = usePage();
    let queryClient = useQueryClient();
    let [mode, setMode] = React.useState("add");
    let [isOpen, setIsOpen] = React.useState(false);

    let params = {
        page,
        pageSize,
        nama_siswa: debouncedName
    };

    let { data, isLoading } = useQuery(
        ["/tempat-pkl/list", params],
        () => listSiswaPkl(params),
        {
            // select: (response) => response.data,
            refetchInterval: 1000 * 60 * 60,
            select: (response) => {
                console.log(response.data)
                return response.data;
            },
        }
    );
    const initialValue = {
        data: [
            {
                student_id: "",
                nama_siswa: null,
                nama_perusahaan: "",
                // guru_id: "",
                // nama_guru: "",

                pembimbing_id: "",
                // nama_pembimbing: "",
                penangung_jawab_perusahaan: "",
                alamat: "",
                provinsi: "",
                kota: "",
                kecamatan: "",
                desa: "",
                rt: "",
                rw: "",
                kodepos: "",
                no_hp: "",
                longtitude: "",
                latitude: "",
            }
        ]
    };
    const {
        showAlertDelete,
        setShowAlertDelete,
        deleteLoading,
        confirmDelete,
        onConfirmDelete,
    } = useDelete({
        afterDeleted: () => queryClient.invalidateQueries("/tempat-pkl/list"),
        onDelete: (id) => deleteSiswaPkl(id),
    });

    const onSubmit = async (values, { resetForm }) => {

       
        try {
          let response;
          if (mode === "update") {
            response = await updateSiswaPkl(values.data[0]);
          } else {
            response = await createSiswaPkl(values.data[0]);
          }
          console.log(response);
          queryClient.invalidateQueries("/tempat-pkl/list");
          resetForm();
          setIsOpen(false);
        //   console.log('data',data)
          return toast.success(response?.data?.msg, {
            
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
        } catch (err) {
          console.log(err);
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
        <LayoutPage title={'Fitur Pkl'}>
            <ModalAlert
                open={showAlertDelete}
                setOpen={setShowAlertDelete}
                loading={deleteLoading}
                onConfirm={onConfirmDelete}
                title={"Apakah yakin akan menghapus FiturPkl terpilih?"}
            />

            

            <Formik
                initialValues={initialValue}
                enableReinitialize
                validationSchema={siswapklArraySchema}
                onSubmit={onSubmit}
            >
                
                {({
                    values,
                    setValues,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    isSubmitting,
                    setFieldTouched,
                    setFieldValue,
                    resetForm,
                }) => (
                    <>
                    {JSON.stringify(values)}
                        <Collapse
                            theme={{ collapse: "foo", content: "bar" }}
                            isOpened={isOpen}
                        >

                            {console.log('err', errors)}
                            <FormFiturPkl
                                data={data?.data}
                                values={values}
                                setValues={setValues}
                                errors={errors}
                                touched={touched}
                                handleChange={handleChange}
                                handleBlur={handleBlur}
                                handleSubmit={handleSubmit}
                                isSubmitting={isSubmitting}
                                setFieldTouched={setFieldTouched}
                                setFieldValue={setFieldValue}
                                resetForm={resetForm}
                                mode={mode}
                                setIsOpen={setIsOpen}
                            />
                        </Collapse>
                        <section className="mt-5">
                            <div className="overflow-auto">
                                <div className="">
                                    <div className="grid grid-cols-1 lg:grid-cols-7 gap-5">
                                        {/* <div className=" grid-cols-1 lg:col-span-3">
                                            <Input
                                                onChange={(e) => {
                                                    setNama(e.target.value);
                                                }}
                                                fluid
                                                value={nama}
                                                icon="search"
                                                placeholder="Nama Siswa..."
                                            />
                                        </div> */}
                                        <div className="col-span-1 lg:col-span-2">
                                            <Button
                                                type="button"
                                                color="teal"
                                                icon={() => <Icon name='add' />}
                                                onClick={() => {
                                                    setIsOpen(true);
                                                    setMode("add");
                                                    return window.scrollTo(0, 0);
                                                }}
                                                content="Buat Pkl Siswa"
                                            />
                                        </div>
                                    </div>
                                    <Table celled selectable>
                                        <Table.Header>
                                            <Table.Row>
                                                <Table.HeaderCell>No</Table.HeaderCell>
                                                <Table.HeaderCell>Nama Perusahaan</Table.HeaderCell>
                                                <Table.HeaderCell>Nama Siswa</Table.HeaderCell>
                                                <Table.HeaderCell>Alamat</Table.HeaderCell>
                                                <Table.HeaderCell>Provinsi</Table.HeaderCell>
                                                <Table.HeaderCell>Kota</Table.HeaderCell>
                                                <Table.HeaderCell>Kecamatan</Table.HeaderCell>
                                                <Table.HeaderCell>Desa</Table.HeaderCell>
                                                <Table.HeaderCell>Rt</Table.HeaderCell>
                                                <Table.HeaderCell>Rw</Table.HeaderCell>
                                                <Table.HeaderCell>Kodepos</Table.HeaderCell>
                                                <Table.HeaderCell>Nomer Telepon</Table.HeaderCell>
                                                <Table.HeaderCell>Penangung Jawab Perusahaan</Table.HeaderCell>
                                                <Table.HeaderCell>Penangung Jawab Sekolah</Table.HeaderCell>
                                                <Table.HeaderCell>Pengampu</Table.HeaderCell>
                                                <Table.HeaderCell singleLine>Aksi</Table.HeaderCell>
                                            </Table.Row>
                                        </Table.Header>
                                        <Table.Body>
                                            <TableLoading
                                                count={13}
                                                isLoading={isLoading}
                                                data={data?.data}
                                                messageEmpty={"Tidak Ada Data Siswa Pkl"}
                                            >
                                                {data?.data?.map((value, index) => (
                                                    <Table.Row key={index}>
                                                        <Table.Cell>{index + 1}</Table.Cell>
                                                        <Table.Cell textAlign="left">
                                                            {handleViewNull(
                                                                value?.nama_perusahaan
                                                            )}
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            <span className="capitalize">
                                                                {handleViewNull(value?.siswa?.nama_siswa)}
                                                            </span>
                                                        </Table.Cell>
                                                        

                                                        <Table.Cell textAlign="left">
                                                            <span className="capitalize">
                                                                
                                                                {handleViewNull(value?.alamat)}
                                                            </span>
                                                        </Table.Cell>
                                                        <Table.Cell textAlign="left">
                                                            <span className="capitalize">
                                                                {/* {" "} */}
                                                                {handleViewNull(value?.provinsi)}
                                                            </span>
                                                        </Table.Cell>
                                                        <Table.Cell textAlign="left">
                                                            {handleViewNull(value?.kota)}
                                                        </Table.Cell>
                                                        <Table.Cell textAlign="left">
                                                            {handleViewNull(value?.kecamatan)}
                                                        </Table.Cell>
                                                        <Table.Cell textAlign="left">
                                                            {handleViewNull(value?.desa)}
                                                        </Table.Cell>
                                                        <Table.Cell textAlign="left">
                                                            {handleViewNull(value?.rt)}
                                                        </Table.Cell>
                                                        
                                                        <Table.Cell textAlign="left">
                                                            {handleViewNull(value?.rw)}
                                                        </Table.Cell>
                                                        <Table.Cell textAlign="left">
                                                            {handleViewNull(value?.kode_pos)}
                                                        </Table.Cell>
                                                        <Table.Cell textAlign="left">
                                                            {handleViewNull(value?.no_hp)}
                                                        </Table.Cell>
                                                        <Table.Cell textAlign="left">
                                                            {handleViewNull(value?.penanggung_jawab_perusahaan)}
                                                        </Table.Cell>
                                                        <Table.Cell textAlign="left">
                                                            <span className="capitalize">
                                                                {" "}
                                                                {handleViewNull(value?.teacher?.nama_guru)}
                                                            </span>
                                                        </Table.Cell>
                                                        <Table.Cell textAlign="left">
                                                            {handleViewNull(
                                                                value?.pembimbing?.nama_guru
                                                            )}
                                                        </Table.Cell>
                                                        <Table.Cell textAlign="left">
                                                            <div className="flex items-center">
                                                                {" "}
                                                                <EditButton
                                                                    onClick={() => {
                                                                        setMode("update");
                                                                        setIsOpen(true);
                                                                        window.scrollTo(0, 0);
                                                                        setValues({
                                                                            data: [
                                                                                {
                                                                                    id: value?.id,
                                                                                    student_id: value?.siswa?.id,
                                                                                    nama_siswa: {
                                                                                        value: value?.siswa?.id,
                                                                                        label: value?.siswa?.nama_siswa,
                                                                                    },
                                                                                    nama_perusahaan: value?.nama_perusahaan,
                                                                                    pembimbing_id: value?.pembimbing?.id,
                                                                                    nama_guru: {
                                                                                        value: value?.teacher?.id,
                                                                                        label: value?.teacher?.nama_guru,
                                                                                    },
                                                                                    penanggung_jawab_perusahaan: value?.penanggung_jawab_perusahaan,
                                                                                    alamat: value?.alamat,
                                                                                    provinsi: value?.provinsi,
                                                                                    kota: value?.kota,
                                                                                    kecamatan: value?.kecamatan,
                                                                                    desa: value?.desa,
                                                                                    rt: value?.rt,
                                                                                    rw: value?.rw,
                                                                                    kodepos: value?.kode_pos,
                                                                                    no_hp: value?.no_hp,
                                                                                    longtitude: value?.longtitude,
                                                                                    latitude: value?.latitude,
                                                                                    
                                                                                },
                                                                            ],
                                                                        });
                                                                    }}
                                                                />
                                                                <DeleteButton
                                                                    onClick={() => confirmDelete(value?.id)}
                                                                />
                                                            </div>
                                                        </Table.Cell>
                                                    </Table.Row>
                                                ))}
                                            </TableLoading>
                                        </Table.Body>

                                    </Table>
                                </div>
                            </div>
                        </section>
                    </>
                )}
            </Formik>
        </LayoutPage>
    );
}
