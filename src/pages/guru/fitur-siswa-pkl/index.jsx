import React from 'react'
import LayoutPage from '../../../module/layoutPage';
import { DeleteButton, EditButton, ModalAlert, PaginationTable, TableLoading, ViewButton } from '../../../components';
import useDelete from '../../../hook/useDelete';
import { useQuery, useQueryClient } from 'react-query';
import { Formik } from 'formik';
import * as Yup from "yup";
import { createSholat, deleteAbsensiSholat, listSholat, updateAbensiSholat } from '../../../api/guru/shiolat';
import useDebounce from '../../../hook/useDebounce';
import { Table, Button, Form, Select, Icon } from "semantic-ui-react";
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import usePage from "../../../hook/usePage";
import { deleteSiswaPkl, listSiswaPkl } from '../../../api/guru/fitur-pkl';

let fiturPklSchema = Yup.object().shape({
    student_id: Yup.string().required("wajib diisi"),
    nama_siswa: Yup.string().required("wajib diisi"),
    alamat: Yup.string().required("wajib diisi"),
    provinsi: Yup.string().required("wajib diisi"),
    kota: Yup.string().required("wajib diisi"),
    kecamatan: Yup.string().required("wajib diisi"),
    desa: Yup.string().required("wajib diisi"),
    rt: Yup.string().required("wajib diisi"),
    rw: Yup.string().required("wajib diisi"),
    kodepos: Yup.number().required("wajib diisi"),
    // nama_perusahaan: Yup.string().required("wajib diisi"),
    // daerah_perusahaan: Yup.string().required("wajib diisi"),
    no_hp: Yup.number().required("wajib diisi"),
});

let fiturPklArraySchema = Yup.object().shape({
    fiturPkl: Yup.array().of(fiturPklSchema),
});

export default function FiturPkl() {

    const navigate = useNavigate();
    // let [page, setPage] = React.useState(1);
    // let [pageSize, setPageSize] = React.useState(10);
    let { page, pageSize, setPage, setPageSize } = usePage();
    let [nama, setNama] = React.useState("");
    let debouncedName = useDebounce(nama, 600);
    // let queryClient = useQueryClient();
    let [mode, setMode] = React.useState("add");
    let [isOpen, setIsOpen] = React.useState(false);
    // let {
    //     showAlertDelete,
    //     setShowAlertDelete,
    //     deleteLoading,
    //     confirmDelete,
    //     onConfirmDelete,
    // } = useDelete({
    //     afterDeleted: () => queryClient.invalidateQueries("list-siswa-pkl"),
    //     onDelete: (id) => {
    //         return deleteAbsensiSholat(id);
    //     },
    // });

    const initialValue = {
        createpkl: [
            {
                student_id: "",
                nama_siswa: "",
                perusahaan_name: "",
                daerah_perusahaan_name: "",
                nomertelepon: "",
            },
        ],
    };

    // let parameter = {
    //     page: page,
    //     pageSize: pageSize,
    //     nama_siswa: debouncedName,
    // };

    // let { data, isLoading, isFetching } = useQuery(
    //     //query key
    //     ["list-siswa-pkl", parameter],
    //     //axios function,triggered when page/pageSize change
    //     () => listSholat(parameter),
    //     //configuration
    //     {
    //         refetchInterval: 1000 * 60 * 60,
    //         select: (response) => {
    //             return response.data;
    //         },
    //     }
    // );
    let params = {
        page,
        pageSize,
    
        is_all: 1,
      };
      let { data, isLoading } = useQuery(
        //query key
        ["/ujian/list", params],
        //axios function,triggered when page/pageSize change
        () => listSiswaPkl(params),
        //configuration
        {
          // refetchInterval: 1000 * 60 * 60,
          select: (response) => {
            return response.data;
          },
        }
      );
      let queryClient = useQueryClient();
      let {
        showAlertDelete,
        setShowAlertDelete,
        deleteLoading,
        confirmDelete,
        onConfirmDelete,
      } = useDelete({
        afterDeleted: () => queryClient.invalidateQueries("/ujian/list"),
        onDelete: (id) => {
          return deleteSiswaPkl(id);
        },
      });

    const onSubmit = async (values, { resetForm }) => {
        try {
            let response;
            if (mode === "update") {
                response = await updateAbensiSholat(values);
            } else {
                response = await createSholat(values);
            }
            console.log(response);
            queryClient.invalidateQueries("list-siswa-pkl");
            resetForm();
            setIsOpen(false);
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
            console.log(err.response.status);

            if (err.response.status === 422) {
                return toast.warning(err.response.data.msg, {
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
        <LayoutPage title={'Fitur Pkl'}>
            <ModalAlert
                open={showAlertDelete}
                setOpen={setShowAlertDelete}
                loading={deleteLoading}
                onConfirm={onConfirmDelete}
                title={"Apakah yakin akan menghapus pelanggaran terpilih ?"}
            />
            <div className="mt-5 space-y-5">
                <section className="grid grid-cols-5 gap-5">
                    <div className="col-span-4 lg:col-span-1">
                        <Button
                            type="button"
                            color="teal"
                            icon={() => <Icon name="add" />}
                            onClick={() => {
                                navigate("tambah", {
                                    replace: true,
                                });
                            }}
                            content="Tambah "
                        />
                    </div>
                </section>
                <section>
                    <Table celled selectable>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>No</Table.HeaderCell>

                                <Table.HeaderCell>Nama Perusahaan</Table.HeaderCell>
                                <Table.HeaderCell>Daerah perusahaan</Table.HeaderCell>
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
                                <Table.HeaderCell>Aksi</Table.HeaderCell>

                                {/* <Table.HeaderCell>Nama Guru</Table.HeaderCell>
                                <Table.HeaderCell>Mata Pelajaran</Table.HeaderCell>
                                <Table.HeaderCell>Kelas</Table.HeaderCell>
                                <Table.HeaderCell>Jenis Ujian</Table.HeaderCell>
                                <Table.HeaderCell>Status</Table.HeaderCell>
                                <Table.HeaderCell>Waktu Mulai</Table.HeaderCell>
                                <Table.HeaderCell>Waktu Selesai</Table.HeaderCell>
                                <Table.HeaderCell>Aksi</Table.HeaderCell> */}

                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            <TableLoading
                                count={8}
                                isLoading={isLoading}
                                data={data?.data}
                                messageEmpty={"Data Tidak Ditemukan"}
                            >
                                {data?.data?.rows?.map((value, index) => (
                                    <Table.Row key={index}>
                                        <Table.Cell>{index + 1}</Table.Cell>

                                        {/* <Table.Cell>{value?.student?.nama_siswa}</Table.Cell>
                                        <Table.Cell>{value?.nama_mapel}</Table.Cell>
                                        <Table.Cell>{value?.nama_kelas}</Table.Cell>
                                        <Table.Cell>{value?.no_hp}</Table.Cell> */}

                                        <Table.Cell>{value?.teacher?.nama_guru}</Table.Cell>
                                        <Table.Cell>{value?.mapel?.nama_mapel}</Table.Cell>
                                        <Table.Cell>{value?.kelas?.nama_kelas}</Table.Cell>
                                        <Table.Cell>{value?.jenis_ujian}</Table.Cell>
                                        <Table.Cell>{value?.status}</Table.Cell>
                                        <Table.Cell>
                                            {dayjs(value.waktu_mulai).format("DD-MM-YY HH:mm:ss")}
                                        </Table.Cell>
                                        <Table.Cell>
                                            {dayjs(value.waktu_selesai).format("DD-MM-YY HH:mm:ss")}
                                        </Table.Cell>

                                        <Table.Cell>

                                            <EditButton
                                                onClick={() => {
                                                    navigate(`update/${value.id}`, {
                                                        replace: true,
                                                    });
                                                }}
                                            />
                                            <DeleteButton
                                                onClick={() => {
                                                    confirmDelete(value?.id);
                                                }}
                                            />
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </TableLoading>
                        </Table.Body>
                    </Table>
                    <PaginationTable
                        page={page}
                        pageSize={pageSize}
                        setPageSize={setPageSize}
                        setPage={setPage}
                        totalPages={data?.data?.count}
                    />
                </section>
            </div>
        </LayoutPage>
    );
}
