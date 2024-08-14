import React from 'react';
import LayoutPage from '../../../module/layoutPage';
import { DeleteButton, EditButton, ModalAlert, PaginationTable, TableLoading } from '../../../components';
import useDelete from '../../../hook/useDelete';
import { useQuery, useQueryClient } from 'react-query';
import { Button, Icon, Table } from "semantic-ui-react";
import { useNavigate } from 'react-router-dom';
import usePage from "../../../hook/usePage";
import { createSiswaPkl, deleteSiswaPkl, listSiswaPkl, updateSiswaPkl } from '../../../api/guru/fitur-pkl';
import { toast } from 'react-toastify';

export default function FiturPkl() {

    const navigate = useNavigate();
    let { page, pageSize, setPage, setPageSize } = usePage();
    let queryClient = useQueryClient();
    let [isOpen, setIsOpen] = React.useState(false);

    const params = {
        page,
        pageSize,
    };

    const { data, isLoading } = useQuery(
        ["/tempat-pkl/list", params],
        () => listSiswaPkl(params),    
        {
            // select: (response) => response.data,
            select: (response) => {
                console.log(response.data)
                return response.data;
            },
        }
    );

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

    // const onSubmit = async (values, { resetForm }) => {
    //     try {
    //       let response;
    //       if (mode === "update") {
    //         response = await updateSiswaPkl(values);
    //       } else {
    //         response = await createSiswaPkl(values);
    //       }
    //       console.log(response);
    //       queryClient.invalidateQueries("/tempat-pkl/list");
    //       resetForm();
    //       setIsOpen(false);
    //       return toast.success(response?.data?.msg, {
    //         position: "top-right",
    //         autoClose: 1000,
    //         hideProgressBar: false,
    //         closeOnClick: true,
    //         pauseOnHover: true,
    //         draggable: true,
    //         progress: undefined,
    //         theme: "colored",
    //       });
    //     } catch (err) {
    //       console.log(err);
    //       return toast.error("Ada Kesalahan", {
    //         position: "top-right",
    //         autoClose: 1000,
    //         hideProgressBar: false,
    //         closeOnClick: true,
    //         pauseOnHover: true,
    //         draggable: true,
    //         progress: undefined,
    //         theme: "colored",
    //       });
    //     }
    //   };

    return (
        <LayoutPage title={'Fitur Pkl'}>
            <ModalAlert
                open={showAlertDelete}
                setOpen={setShowAlertDelete}
                loading={deleteLoading}
                onConfirm={onConfirmDelete}
                title={"Apakah yakin akan menghapus pelanggaran terpilih?"}
            />
            <div className="mt-5 space-y-5">
                <section className="grid grid-cols-5 gap-5">
                    <div className="col-span-4 lg:col-span-1">
                        <Button
                            type="button"
                            color="teal"
                            icon={<Icon name="add" />}
                            onClick={() => navigate("tambah", { replace: true })}
                            content="Tambah"
                        />
                    </div>
                </section>
                <section>
                    <Table celled selectable >
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
                                <Table.HeaderCell>Aksi</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            <TableLoading
                                count={8}
                                isLoading={isLoading}
                                data={data?.data}
                                messageEmpty={"Data Tidak Ditemukan"}
                            >
                                {data?.data?.map((value, index) => (
                                    <Table.Row key={index}>
                                        <Table.Cell>{index + 1}</Table.Cell>
                                        <Table.Cell>{value?.nama_perusahaan}</Table.Cell>
                                        <Table.Cell>{value?.siswa?.nama_siswa}</Table.Cell>
                                        <Table.Cell>{value?.alamat}</Table.Cell>
                                        <Table.Cell>{value?.provinsi}</Table.Cell>
                                        <Table.Cell>{value?.kota}</Table.Cell>
                                        <Table.Cell>{value?.kecamatan}</Table.Cell>
                                        <Table.Cell>{value?.desa}</Table.Cell>
                                        <Table.Cell>{value?.rt}</Table.Cell>
                                        <Table.Cell>{value?.rw}</Table.Cell>
                                        <Table.Cell>{value?.kode_pos}</Table.Cell>
                                        <Table.Cell>{value?.no_hp}</Table.Cell>
                                        <Table.Cell>{value?.penanggung_jawab_perusahaan}</Table.Cell>
                                        <Table.Cell>{value?.teacher?.nama_guru}</Table.Cell>
                                        <Table.Cell>{value?.pembimbing?.nama_guru}</Table.Cell>
                                        <Table.Cell>
                                            <EditButton
                                                onClick={() => navigate(`update/${value.id}`, { replace: true })}
                                            />
                                            <DeleteButton
                                                onClick={() => confirmDelete(value?.id)}
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
                        totalPages={data?.pagination?.totalPages}
                    />
                </section>
            </div>
        </LayoutPage>
    );
}
