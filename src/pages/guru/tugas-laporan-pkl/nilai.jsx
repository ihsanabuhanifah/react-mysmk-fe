import { Button, Icon, Menu, Modal, Sidebar, Table } from "semantic-ui-react";
import LayoutPage from "../../../module/layoutPage";
import { useNavigate, useParams } from "react-router-dom";
import usePage from "../../../hook/usePage";
import { useQuery, useQueryClient } from "react-query";
import { useState } from "react";
import useDebounce from "../../../hook/useDebounce";
import FilterLaporanPkl from "../laporan-pkl/filter";
import { deleteTugasPkl, detailTugasPkl, listJawabanTugasPkl, listTugasPkl } from "../../../api/guru/tugas-pkl";
import { encodeURlFormat } from "../../../utils";
import { DeleteButton, EditButton, ModalAlert, PaginationTable, TableLoading } from "../../../components";
import useDelete from "../../../hook/useDelete";
import { replace } from "formik";
import { stringify } from "qs";
import { detailJawabanSiswaPkl, listSiswaPkl } from "../../../api/guru/fitur-pkl";
import { LabelStatus } from "../../../components/Label";
import dayjs from "dayjs";

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

    let [namaSiswa, setNamaSiswa] = useState({});
    const [open, setOpen] = useState(false);
    const [jawaban, setJawaban] = useState([]);
    const [value, setValue] = useState({});
    const [selectedJawaban, setSelectedJawaban] = useState(null);




    const params = {
        page,
        pageSize,
        keyword: debouncedKeyword,
        ...filter,
        nama_siswa: encodeURlFormat(filter?.nama_siswa?.label),


    };
    // const { data, isLoading, isFetching } = useQuery(
    //     ["/jawaban-tugas-pkl/detailByTugasId", id],
    //     () => listJawabanTugasPkl(id),
    //     {
    //         refetchOnWindowFocus: false,
    //         select: (response) => {
    //             console.log(response.data.data.detailJawaban)
    //             return response.data;
    //         }
    //     }
    // )
    const { data, isLoading, isFetching } = useQuery(
        ["/jawaban-tugas-pkl/detailByTugasId", id],
        () => listJawabanTugasPkl(id),
        {
            refetchOnWindowFocus: false,
            select: (response) => {
                console.log(response.data.data);
                return response.data;
            }
        }
    );

    const handleOpenModal = (jawaban) => {
        setSelectedJawaban(jawaban);
        setIsOpen(true);
    };

    // Function to close the modal
    const handleCloseModal = () => {
        setIsOpen(false);
        setSelectedJawaban(null);
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

            <section className="mt-5">
                <Table celled selectable >
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>No</Table.HeaderCell>
                            <Table.HeaderCell>Nama Siswa</Table.HeaderCell>
                            {/* <Table.HeaderCell>Batas Waktu</Table.HeaderCell> */}
                            <Table.HeaderCell>Status</Table.HeaderCell>
                            <Table.HeaderCell>Selesai</Table.HeaderCell>
                            <Table.HeaderCell>Penilaian</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        <TableLoading
                            count={8}
                            isLoading={isLoading}
                            data={data?.data.detailJawaban}
                            messageEmpty={"Data Tidak Ditemukan"}
                        >
                            {data?.data.detailJawaban?.map((value, index) => (
                                <Table.Row key={index}>
                                    <Table.Cell>{index + 1}</Table.Cell>
                                    <Table.Cell>{value?.nama}</Table.Cell>


                                    <Table.Cell>
                                        <LabelStatus status={value.status} />
                                    </Table.Cell>
                                    <Table.Cell >{data?.data.totalSiswa} / {data?.data.sudahDikerjakan}</Table.Cell>

                                    <Table.Cell>

                                        <Button
                                            color="linkedin"
                                            size="tiny"
                                            onClick={() => handleOpenModal(value)}
                                        >
                                            <Icon name="eye" /> Lihat
                                        </Button>
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
            <Modal open={isOpen} onClose={handleCloseModal}>
                <Modal.Header>Detail Jawaban Tugas</Modal.Header>
                <Modal.Content>
                    <p><strong>Nama Siswa:</strong> {selectedJawaban?.nama}</p>
                    <p><strong>Pesan:</strong> {selectedJawaban?.pesan ?? "Tidak ada pesan"}</p>
                    <p><strong>Jawaban:</strong> {selectedJawaban?.jawaban?.isi_jawaban ?? "Belum ada jawaban"}</p>
                </Modal.Content>
                <Modal.Actions>
                    <Button color="red" onClick={handleCloseModal}>
                        <Icon name="close" /> Tutup
                    </Button>
                </Modal.Actions>
            </Modal>
        </LayoutPage>
    )
}
