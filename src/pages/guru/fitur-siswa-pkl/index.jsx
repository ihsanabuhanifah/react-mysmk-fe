import React from 'react'
import LayoutPage from '../../../module/layoutPage';
import { DeleteButton, EditButton, ModalAlert, PaginationTable, TableLoading, ViewButton } from '../../../components';
import useDelete from '../../../hook/useDelete';
import { useQuery, useQueryClient } from 'react-query';
import { Formik } from 'formik';
import * as Yup from "yup";
import useDebounce from '../../../hook/useDebounce';
import { Table, Button, Form, Select, Icon } from "semantic-ui-react";
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import usePage from "../../../hook/usePage";
import { deleteSiswaPkl, listSiswaPkl } from '../../../api/guru/fitur-pkl';

// let fiturPklSchema = Yup.object().shape({
//     student_id: Yup.string().required("wajib diisi"),
//     nama_siswa: Yup.string().required("wajib diisi"),
//     alamat: Yup.string().required("wajib diisi"),
//     provinsi: Yup.string().required("wajib diisi"),
//     kota: Yup.string().required("wajib diisi"),
//     kecamatan: Yup.string().required("wajib diisi"),
//     desa: Yup.string().required("wajib diisi"),
//     rt: Yup.string().required("wajib diisi"),
//     rw: Yup.string().required("wajib diisi"),
//     kodepos: Yup.number().required("wajib diisi"),
//     // nama_perusahaan: Yup.string().required("wajib diisi"),
//     // daerah_perusahaan: Yup.string().required("wajib diisi"),
//     no_hp: Yup.number().required("wajib diisi"),
// });

// let fiturPklArraySchema = Yup.object().shape({
//     fiturPkl: Yup.array().of(fiturPklSchema),
// });

export default function FiturPkl() {

    const navigate = useNavigate();
    // let [page, setPage] = React.useState(1);
    // let [pageSize, setPageSize] = React.useState(10);
    let { page, pageSize, setPage, setPageSize } = usePage();
    let [nama, setNama] = React.useState("");
    let debouncedName = useDebounce(nama, 600);
    let queryClient = useQueryClient();
    let [mode, setMode] = React.useState("add");
    let [isOpen, setIsOpen] = React.useState(false);
   

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

    let params = {
        page,
        pageSize,

        // is_all: 1,
    };
    let { data, isLoading } = useQuery(
        //query key
        ["/tempat-pkl/list", params],
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
                                <Table.HeaderCell>Nama Siswa</Table.HeaderCell>
                                {/* <Table.HeaderCell>Alamat</Table.HeaderCell>
                                <Table.HeaderCell>Provinsi</Table.HeaderCell>
                                <Table.HeaderCell>Kota</Table.HeaderCell>
                                <Table.HeaderCell>Kecamatan</Table.HeaderCell>
                                <Table.HeaderCell>Desa</Table.HeaderCell>
                                <Table.HeaderCell>Rt</Table.HeaderCell>
                                <Table.HeaderCell>Rw</Table.HeaderCell>
                                <Table.HeaderCell>Kodepos</Table.HeaderCell>
                                <Table.HeaderCell>Nomer Telepon</Table.HeaderCell>
                                <Table.HeaderCell>Penangung Jawab Perusahaan</Table.HeaderCell>
                                <Table.HeaderCell>Penangung Jawab Sekolah</Table.HeaderCell> */}
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

                    

                                        <Table.Cell>{value?.nama_perusahaan}</Table.Cell>
                                        <Table.Cell>{value?.siswa?.nama_siswa}</Table.Cell>
                                        {/* <Table.Cell>{value?.alamat}</Table.Cell>
                                        <Table.Cell>{value?.provinsi}</Table.Cell>
                                        <Table.Cell>{value?.kota}</Table.Cell>
                                        <Table.Cell>{value?.kecamatan}</Table.Cell>
                                        <Table.Cell>{value?.desa}</Table.Cell>
                                        <Table.Cell>{value?.rt}</Table.Cell>
                                        <Table.Cell>{value?.rw}</Table.Cell>
                                        <Table.Cell>{value?.kode_pos}</Table.Cell>
                                        <Table.Cell>{value?.no_hp}</Table.Cell>
                                        <Table.Cell>{value?.teacher?.nama_guru}</Table.Cell>
                                        <Table.Cell>{value?.penanggung_jawab_perusahaan}</Table.Cell> */}
                                        
                                        {/* <Table.Cell>
                                            {dayjs(value.waktu_mulai).format("DD-MM-YY HH:mm:ss")}
                                        </Table.Cell>
                                        <Table.Cell>
                                            {dayjs(value.waktu_selesai).format("DD-MM-YY HH:mm:ss")}
                                        </Table.Cell> */}

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
