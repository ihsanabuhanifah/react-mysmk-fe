import { Button, Icon, Menu, Sidebar, Table } from "semantic-ui-react";
import LayoutPage from "../../../module/layoutPage";
import { useNavigate, useParams } from "react-router-dom";
import usePage from "../../../hook/usePage";
import { useQuery, useQueryClient } from "react-query";
import { useState } from "react";
import useDebounce from "../../../hook/useDebounce";
import FilterLaporanPkl from "../laporan-pkl/filter";
import { deleteTugasPkl, detailTugasPkl, listTugasPkl } from "../../../api/guru/tugas-pkl";
import { encodeURlFormat } from "../../../utils";
import { DeleteButton, EditButton, ModalAlert, TableLoading } from "../../../components";
import useDelete from "../../../hook/useDelete";
import { replace } from "formik";
import { stringify } from "qs";
import { listSiswaPkl } from "../../../api/guru/fitur-pkl";

export default function TugasLaporanPkl() {

    const { id } = useParams();
    const navigate = useNavigate();
    let { page, pageSize, setPage, setPageSize } = usePage();
    let queryClient = useQueryClient();
    let [isOpen, setIsOpen] = useState(false);
    let [keyword, setKeyword] = useState("");
    let debouncedKeyword = useDebounce(keyword, 500);
    let [visible, setVisible] = useState(false);
    const [filter, setFilter] = useState({});

    const params = {
        page,
        pageSize,
        keyword: debouncedKeyword,
        ...filter,
        nama_siswa: encodeURlFormat(filter?.nama_siswa?.label),


    };
    const { data, isLoading, isFetching } = useQuery(
        ["/tempat-pkl/list", params],
        () => listSiswaPkl(params),
        {
            refetchOnWindowFocus: false,
            select: (response) => {
                console.log(response.data)
                return response.data;
            }
        }
    )
    const {
        showAlertDelete,
        setShowAlertDelete,
        deleteLoading,
        confirmDelete,
        onConfirmDelete,
    } = useDelete({
        afterDeleted: () => queryClient.invalidateQueries("/tugas-pkl/list"),
        onDelete: (id) => deleteTugasPkl(id),
    });
    return (
        <LayoutPage title={"Halaman Nilai Pkl"}>
            <ModalAlert
                open={showAlertDelete}
                setOpen={setShowAlertDelete}
                loading={deleteLoading}
                onConfirm={onConfirmDelete}
                title={"Apakah yakin akan menghapus Siswa terpilih?"}
            />
            <Sidebar
                as={Menu}
                animation="overlay"
                icon="labeled"
                inverted
                direction="right"
                onHide={() => setVisible(false)}
                vertical
                visible={visible}
                width="wide"
            >

                <FilterLaporanPkl filter={filter} setFilter={setFilter} setVisible={setVisible} ></FilterLaporanPkl>
            </Sidebar>
            <section className="grid grid-cols-6 gap-5 mt-5 ">
                <div className="col-span-6 lg:col-span-1 xl:col-span-1">
                    <Button
                        type="button"
                        color="teal"
                        icon={<Icon name="add" />}
                        onClick={() => navigate("tambah", { replace: true })}
                        content="Tambah"
                        size='medium'
                        fluid
                    />

                </div>
                <div className="col-span-6 lg:col-span-1 xl:col-span-1 mb-10">
                    <Button
                        content={"Filter"}
                        type="button"
                        fluid
                        icon={() => <Icon name="filter" />}
                        size="medium"
                        color="blue"
                        onClick={() => {
                            setVisible(!visible);
                        }}
                    />
                </div>
            </section>
            <section>
                <Table celled selectable >
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>No</Table.HeaderCell>
                            <Table.HeaderCell>Nama Siswa</Table.HeaderCell>
                            <Table.HeaderCell>Batas Waktu</Table.HeaderCell>
                            <Table.HeaderCell>Selesai</Table.HeaderCell>
                            <Table.HeaderCell>Aksi</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        <TableLoading
                            count={8}
                            isLoading={isLoading || isFetching}
                            data={data?.data}
                            messageEmpty={"Data Tidak Ditemukan"}
                        >
                            {data?.data?.map((value, index) => (
                                <Table.Row key={index}>
                                    <Table.Cell>{index + 1}</Table.Cell>
                                    <Table.Cell>{value?.siswa?.nama_siswa}</Table.Cell>
                                    <Table.Cell>{value.updated_at}</Table.Cell>

                                    {/* <Table.Cell>{value?.batas_waktu}</Table.Cell> */}
                                    <Table.Cell>3/{index + 1 }</Table.Cell>

                                    <Table.Cell>
                                        <EditButton
                                            onClick={() => navigate(`update/${value?.id}`, { replace: true })}
                                        />
                                        <DeleteButton
                                            onClick={() => confirmDelete(value?.id)}
                                        />
                                        <Button content={'Nilai'} color="blue" onClick={() => navigate(`nilai/${value?.id}`, { replace: true })}></Button>
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </TableLoading>
                    </Table.Body>
                </Table>
                {JSON.stringify(data)}
            </section>

        </LayoutPage>
    )
}