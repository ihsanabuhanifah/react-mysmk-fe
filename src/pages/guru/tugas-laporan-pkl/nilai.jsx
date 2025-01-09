import { Button, Dropdown, Form, Icon, Menu, Modal, Sidebar, Table, TextArea } from "semantic-ui-react";
import LayoutPage from "../../../module/layoutPage";
import { useNavigate, useParams } from "react-router-dom";
import usePage from "../../../hook/usePage";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useEffect, useState } from "react";
import useDebounce from "../../../hook/useDebounce";
import FilterLaporanPkl from "../laporan-pkl/filter";
import { deleteTugasPkl, detailTugasPkl, listJawabanTugasPkl, listTugasPkl, updateJawabanPkl, updateTugasPkl } from "../../../api/guru/tugas-pkl";
import { encodeURlFormat } from "../../../utils";
import { DeleteButton, EditButton, ModalAlert, PaginationTable, TableLoading } from "../../../components";
import useDelete from "../../../hook/useDelete";
import { ErrorMessage, Field, Formik, replace } from "formik";
import { stringify } from "qs";
import { detailJawabanSiswaPkl, listSiswaPkl } from "../../../api/guru/fitur-pkl";
import { LabelStatus } from "../../../components/Label";
import dayjs from "dayjs";
import *  as Yup from 'yup'
import { toast } from "react-toastify";

let pesanSchema = Yup.object().shape({
    status: Yup.string().required("wajib pilih"),
    pesan: Yup.string().required("wajib diisi"),
});

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
    let { data, isLoading, isFetching } = useQuery(
        ["/jawaban-tugas-pkl/detailByTugasId", id],
        () => listJawabanTugasPkl(id),
        {
            enabled: id !== undefined,
            refetchOnWindowFocus: false,
            select: (response) => {
                console.log(response.data.data);
                return response.data;
            },
            onSuccess: (data) => {
                console.log("data suksus", data);


            },
        }
    );

    let { data: dataPesan, isLoading: isLoadingPesan, isFetching: isFecthingPesan } = useQuery(
        ["/jawaban-tugas-pkl/update", id],
        () => updateJawabanPkl(id),
        {
            select: (response) => {
                return response.data.data
            },
            onSuccess: (response) => {
                console.log(response)

            },
        }
    )


    // const mutation = useMutation(updateTugasPkl, {
    //     onSuccess: () => {
    //         queryClient.invalidateQueries([`/jawaban-tugas-pkl/detailByTugasId`,id]);
    //         alert("Status dan pesan berhasil diperbarui!");
    //         setIsOpenPesan(false); // Tutup modal setelah berhasil update
    //     },
    //     onError: (error) => {
    //         alert("Gagal memperbarui status dan pesan: " + error.message);
    //     },
    // });
    useEffect(() => {
        if (data) {
            setInitialState({
                id: data.id,
                status: data.status,
                pesan: data.pesan,
            });
        }
    }, [data]);

    const [initialState, setInitialState] = useState({
        id: data?.id,
        status: data?.status,
        pesan: data?.pesan
    });
    // const [initialState, setInitialState] = useState({
    //     id: "",
    //     tugas: "",
    //     link_soal: "",
    //     batas_waktu: null,
    //     deskripsi_tugas: "",
    // });

    // const handleUpdate = () => {
    //     console.log('value jawaban:', jawaban);
    //     const { id } = jawaban;

    //     if (!status || !pesan) {
    //         alert("Status dan pesan harus diisi!");
    //         return;
    //     }
    //     mutation.mutate({
    //         // id: selectedJawaban?.jawaban?.jawaban_id,
    //         // id: selectedJawaban?.id,
    //         // id,
    //         status,
    //         pesan,
    //     });
    // };

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

    //asli
    // const onSubmit = async (values) => {
    //     try {
    //         const response = await updateJawabanPkl(id, {
    //             id: selectedJawaban?.id,
    //             status: values.status,
    //             pesan: values.pesan,
    //         });
    //         // toast.success(response?.data?.msg, "Pesan berhasil diperbarui!");
    //         toast.success(response?.data?.msg, {
    //             position: "top-right",
    //             autoClose: 1000,
    //             hideProgressBar: false,
    //             closeOnClick: true,
    //             pauseOnHover: true,
    //             draggable: true,
    //             progress: undefined,
    //             theme: "colored",
    //         });


    //         queryClient.invalidateQueries("tugas-laporan-pkl/nilai/:id");
    //     } catch (error) {
    //         console.error(error);
    //         toast.error("Gagal memperbarui pesan!");
    //     }
    // };

    const onSubmit = async (values, { setSubmitting }) => {
        try {
            const response = await updateJawabanPkl(selectedJawaban?.id, values);
            toast.success("Status dan pesan berhasil diperbarui!", {
                position: "top-right",
                autoClose: 1000,
                theme: "colored",
            });
            queryClient.invalidateQueries(["/jawaban-tugas-pkl/detailByTugasId", id]);
            handleCloseModalPesan();
        } catch (error) {
            console.error("Error saat mengupdate:", error);
            toast.error("Gagal memperbarui status dan pesan.", { theme: "colored" });
        } finally {
            setSubmitting(false);
        }
    };

    //     const onSubmit = async (values) => {
    //     try {
    //       const response = await updateJawabanPkl(id, values);
    //       toast.success(response?.data?.msg, { theme: "colored" });
    //     } catch (err) {
    //       toast.error("Ada kesalahan", { theme: "colored" });
    //     }
    //   };

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
                    {/* {JSON.stringify(selectedJawaban)} */}


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

            <Modal
                open={isOpenPesan}
                onClose={handleCloseModalPesan}
                size="small"
            >
                <Modal.Header>Update Status dan Pesan</Modal.Header>
                <Modal.Content>
                    <Formik
                        initialValues={{
                            status: selectedJawaban?.status || "",
                            pesan: selectedJawaban?.pesan || "",
                        }}
                        validationSchema={pesanSchema}
                        onSubmit={onSubmit}
                    >
                        {({ handleSubmit, values, handleChange, isSubmitting }) => (
                            <Form onSubmit={handleSubmit}>
                                <Form.Field>
                                    <label>Status</label>
                                    <Dropdown
                                        placeholder="Pilih Status"
                                        fluid
                                        selection
                                        options={statusOptions}
                                        name="status"
                                        value={values.status}
                                        onChange={(e, { value }) => handleChange({ target: { name: "status", value } })}
                                    />
                                    <ErrorMessage name="status" component="div" className="ui pointing red basic label" />
                                </Form.Field>
                                <Form.Field>
                                    <label>Pesan</label>
                                    <TextArea
                                        placeholder="Masukkan pesan"
                                        name="pesan"
                                        value={values.pesan}
                                        onChange={handleChange}
                                    />
                                    <ErrorMessage name="pesan" component="div" className="ui pointing red basic label" />
                                </Form.Field>
                                <div className="ui two buttons">
                                    <Button type="submit" color="green" loading={isSubmitting} disabled={isSubmitting}>
                                        Simpan
                                    </Button>
                                    <Button type="button" onClick={handleCloseModalPesan}>
                                        Batal
                                    </Button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </Modal.Content>
            </Modal>

        </LayoutPage>
    )
}
