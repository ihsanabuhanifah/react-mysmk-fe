import { useQuery, useQueryClient } from "react-query";
import { detailJawabanSiswaPkl } from "../../../api/guru/fitur-pkl";
import { useNavigate, useParams } from "react-router-dom";
import usePage from "../../../hook/usePage";
import { Button, Icon, Menu, Sidebar, Table } from "semantic-ui-react";
import LayoutPage from "../../../module/layoutPage";

export default function DetailPenilaian() {
    const { data, isLoading , isFetching } = useQuery(
        ["/jawaban-tugas-pkl/detail", id],
        () => detailJawabanSiswaPkl(id),
        {
            refetchOnWindowFocus: false,
            select: (response) => {
                console.log('penilaian', response)
                return response.data;
            }
        }
    )
    const { id } = useParams();
    const navigate = useNavigate();
    let { page, pageSize, setPage, setPageSize } = usePage();
    let queryClient = useQueryClient();

    return (
        <LayoutPage title={"Halaman Detail Nilai Pkl"}>
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
                            <Table.HeaderCell>Batas Waktu</Table.HeaderCell>
                            <Table.HeaderCell>Status</Table.HeaderCell>
                            {/* <Table.HeaderCell>Selesai</Table.HeaderCell> */}
                            <Table.HeaderCell>Penilaian</Table.HeaderCell>
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
                                    <Table.Cell>{dayjs(value.batas_waktu).format("DD-MM-YY HH:mm:ss")}</Table.Cell>


                                    <Table.Cell>
                                        <LabelStatus status={value.status} />
                                    </Table.Cell>
                                    {/* <Table.Cell>3/{index + 1}</Table.Cell> */}

                                    <Table.Cell>
                                        <Button
                                            color="linkedin"
                                            type="button"
                                            size="tiny"
                                            // onClick={() => {
                                            //     setOpen(true);
                                            //     // setNamaSiswa({
                                            //     //     nama_siswa: item.siswa.nama_siswa,
                                            //     //     mapel: mapel,
                                            //     // });

                                            //     // console.log("item", item);
                                            //     // setItem(item);
                                            //     // setJawaban(() => {
                                            //     //     if (!!item.jawaban === false) {
                                            //     //         return [];
                                            //     //     }
                                            //     //     return JSON.parse(item.jawaban);
                                            //     // });
                                            // }}
                                            onClick={() => navigate(`nilai/${value?.id}`, { replace: true })}
                                        >
                                            {" "}
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

        </LayoutPage>
    )
}