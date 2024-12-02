import { Button, Dropdown, Icon, Menu, Modal, Sidebar, Table, TextArea } from "semantic-ui-react";
import LayoutPage from "../../../module/layoutPage";
import { useNavigate, useParams } from "react-router-dom";
import usePage from "../../../hook/usePage";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useState } from "react";
import useDebounce from "../../../hook/useDebounce";
import FilterLaporanPkl from "../laporan-pkl/filter";
import { deleteTugasPkl, detailTugasPkl, listJawabanTugasPkl, listTugasPkl, updateTugasPkl } from "../../../api/guru/tugas-pkl";
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
    let [isOpenPesan, setIsOpenPesan] = useState(false);
    let [keyword, setKeyword] = useState("");
    let debouncedKeyword = useDebounce(keyword, 500);
    let [visible, setVisible] = useState(false);
    const [filter, setFilter] = useState({});

    let [namaSiswa, setNamaSiswa] = useState({});
    const [open, setOpen] = useState(false);
    const [jawaban, setJawaban] = useState([]);

    const [value, setValue] = useState({});
    const [selectedJawaban, setSelectedJawaban] = useState(null);

    const [status, setStatus] = useState("");
    const [pesan, setPesan] = useState("");



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
    const mutation = useMutation(updateTugasPkl, {
        onSuccess: () => {
            queryClient.invalidateQueries([`/jawaban-tugas-pkl/detailByTugasId`,id]);
            alert("Status dan pesan berhasil diperbarui!");
            setIsOpenPesan(false); // Tutup modal setelah berhasil update
        },
        onError: (error) => {
            alert("Gagal memperbarui status dan pesan: " + error.message);
        },
    });
    const handleUpdate = () => {
        console.log('value jawaban:', jawaban);
        const { id } = jawaban;

        if (!status || !pesan) {
            alert("Status dan pesan harus diisi!");
            return;
        }
        mutation.mutate({
            // id: selectedJawaban?.jawaban?.jawaban_id,
            // id: selectedJawaban?.id,
            id: selectedJawaban?.tugas_pkl_id,
            // id,
            status,
            pesan,
        });
    };

    const handleOpenModalLihat = (jawaban) => {
        setSelectedJawaban(jawaban);
        setIsOpen(true);
    };
    const handleOpenModalPesan = (jawaban) => {
        setSelectedJawaban(jawaban);
        setStatus(jawaban.status || "");
        setPesan(jawaban.pesan || "");
        setIsOpenPesan(true);
    };

    // Function to close the modal
    const handleCloseModal = () => {
        setIsOpen(false);
        setSelectedJawaban(null);
    };
    const handleCloseModalPesan = () => {
        setIsOpenPesan(false);
        setSelectedJawaban(null);
    };

    const statusOptions = [
        { key: "gagal", value: "gagal", text: "Gagal" },
        { key: "revisi", value: "revisi", text: "Revisi" },
        { key: "selesai", value: "selesai", text: "Selesai" },
    ];
    // const statusOptions = [
    //     { key: "belum", value: "belum dikerjakan", text: "Belum Dikerjakan" },
    //     { key: "sedang", value: "sedang dikerjakan", text: "Sedang Dikerjakan" },
    //     { key: "selesai", value: "selesai", text: "Selesai" },
    // ];

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



            <section className="mt-5 px-4">
                <div className="flex flex-row justify-start items-center mb-5" onClick={() => navigate('/guru/tugas-laporan-pkl/')}>
                    <Icon
                        name="arrow left"
                        size="large"

                        className="cursor-pointer"
                    />
                    <p className="text-xl  font-semibold text-black cursor-pointer">Kembali</p>
                </div>
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
                                            onClick={() => handleOpenModalLihat(value)}
                                        >

                                            <Icon name="eye" /> Lihat
                                        </Button>
                                        <Button
                                            color="green"
                                            size="tiny"
                                            onClick={() => handleOpenModalPesan(value)}
                                            disabled={!value?.jawaban}
                                        // disabled={!value?.jawaban || !value?.id}
                                        >
                                            <Icon name="chat" /> Pesan
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
                    <p><strong>ID:</strong> {selectedJawaban?.id}</p>
                    {JSON.stringify(selectedJawaban)}


                    <p><strong>Nama Siswa:</strong> {selectedJawaban?.nama}</p>
                    <p><strong>Status Siswa:</strong> {selectedJawaban?.status}</p>
                    <p><strong>Pesan:</strong> {selectedJawaban?.pesan ?? "Tidak ada pesan"}</p>
                    <p><strong>Jawaban:</strong> {selectedJawaban?.jawaban?.isi_jawaban ?? "Belum ada jawaban"}</p>
                </Modal.Content>
                <Modal.Actions>
                    <Button color="red" onClick={handleCloseModal}>
                        <Icon name="close" /> Tutup
                    </Button>
                </Modal.Actions>
            </Modal>
            {/* popup Pesan */}
            <Modal open={isOpenPesan} onClose={handleCloseModalPesan}>
                <Modal.Header>Ubah Status dan Pesan</Modal.Header>
                <Modal.Content>
                    <p><strong>Nama Siswa:</strong> {selectedJawaban?.nama}</p>
                    <Dropdown
                        placeholder="Pilih Status"
                        fluid
                        selection
                        options={statusOptions}
                        value={status}
                        onChange={(e, { value }) => setStatus(value)}
                    />
                    <div className="mt-3">
                        <strong>Pesan:</strong>
                        <TextArea
                            rows="4"
                            value={pesan}
                            placeholder="ketikan pesan"
                            onChange={(e) => setPesan(e.target.value || "Tidak ada pesan")}
                            style={{
                                width: "100%",
                                marginTop: "5px",
                                border: "1px solid #ccc", // Garis pada textarea
                                borderRadius: "4px",
                                padding: "10px",
                                fontSize: "14px",
                            }}
                        />
                    </div>
                </Modal.Content>
                <Modal.Actions>
                    {/* <Button color="green" > */}
                    <Button color="green" onClick={handleUpdate} loading={mutation.isLoading}>
                        <Icon name="check" /> Simpan
                    </Button>
                    <Button color="red" onClick={handleCloseModalPesan}>
                        <Icon name="close" /> Batal
                    </Button>
                </Modal.Actions>
            </Modal>
        </LayoutPage>
    )
}
