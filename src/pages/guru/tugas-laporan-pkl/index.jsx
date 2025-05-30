import { Button, Icon, Menu, Sidebar, Table } from "semantic-ui-react";
import LayoutPage from "../../../module/layoutPage";
import { useNavigate, useParams } from "react-router-dom";
import usePage from "../../../hook/usePage";
import { useQuery, useQueryClient } from "react-query";
import { useEffect, useState } from "react";
import useDebounce from "../../../hook/useDebounce";
import FilterLaporanPkl from "../laporan-pkl/filter";
import { deleteTugasPkl,  listTugasPkl } from "../../../api/guru/tugas-pkl";
import { encodeURlFormat } from "../../../utils";
import { DeleteButton, EditButton, ModalAlert, PaginationTable, TableLoading } from "../../../components";
import useDelete from "../../../hook/useDelete";
import dayjs from "dayjs";
import { CopyButton } from "../../../components/buttonAksi/editButton";

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
    const { data, isLoading } = useQuery(
        ["/tugas-pkl/list", params],
        () => listTugasPkl(params),
        {
            refetchOnWindowFocus: false,
            select: (response) => {
                console.log('response tugas', response.data)
                return response.data
            }
        }
    )
    // const { data:dataJawab, isLoading:loadingJawab } = useQuery(
    //     ["/jawaban-tugas-pkl/detailByTugasId", id],
    //     () => listJawabanTugasPkl(id),
    //     {
    //         refetchOnWindowFocus: false,
    //         select: (response) => {
    //             const { totalSiswa, sudahDikerjakan } = response.data;
    //             return { totalSiswa, sudahDikerjakan };
    //         },
    //     }
    // )
   

    // const DataJawab = 

    const handleCopy = async(text) => {
        // navigator.clipboard.writeText(text)
        try {
            navigator.clipboard.writeText(text);
            // const response = await navigator.clipboard.writeText(text);
            // alert('Teks berhasil disalin ke clipboard!');
            
        } catch (error) {
            // alert('Gagal menyalin teks!');
            
        }
    };
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
        <LayoutPage title={"Tugas Laporan Akhir Pkl"}>
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
            <section className="grid grid-cols-6 gap-5 mt-5 px-4">
                <div className="col-span-6 lg:col-span-1 xl:col-span-1 mb-5">
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
                
            </section>
            <section className="px-4">
                <Table celled selectable >
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>No</Table.HeaderCell>
                            {/* <Table.HeaderCell>Nama Guru</Table.HeaderCell> */}
                            <Table.HeaderCell>Judul</Table.HeaderCell>
                            <Table.HeaderCell>Link Soal</Table.HeaderCell>
                            <Table.HeaderCell>Batas Waktu</Table.HeaderCell>
                            {/* <Table.HeaderCell>Selesai</Table.HeaderCell> */}
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
                                    {/* <Table.Cell>{value?.teacher?.nama_guru}</Table.Cell> */}
                                    <Table.Cell>{value?.tugas}</Table.Cell>
                                    <Table.Cell onClick={() => handleCopy(value?.link_soal)} className="cursor-pointer ">
                                        {value?.link_soal}
                                        <CopyButton >
                                        </CopyButton></Table.Cell>
                                    <Table.Cell>{dayjs(value.batas_waktu).format("DD-MM-YY HH:mm:ss")}</Table.Cell>
                                    {/* <Table.Cell>3/{index + 1 }</Table.Cell> */}
                                    {/* <Table.Cell>3/{index + 1}</Table.Cell> */}
                                    <Table.Cell>
                                        <EditButton
                                            onClick={() => navigate(`update/${value?.id}`, { replace: true })}
                                        />
                                        <DeleteButton
                                            onClick={() => confirmDelete(value?.id)}
                                        />

                                        <Button content={'Nilai'} size="tiny" color="blue" onClick={() => navigate(`nilai/${value?.id}`, { replace: true })}></Button>
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

        </LayoutPage>
    )
}