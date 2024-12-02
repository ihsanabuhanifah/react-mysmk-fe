import { useNavigate, useParams } from "react-router-dom";
import usePage from "../../../hook/usePage";
import { useQuery, useQueryClient } from "react-query";
import React, { useState } from "react";
import { deleteLaporanPkl, listLaporanPkl, useDownloadPdf, useLaporanPklList } from "../../../api/guru/laporanharianpkl";
import LayoutPage from "../../../module/layoutPage";
import useDebounce from "../../../hook/useDebounce";
import useDelete from "../../../hook/useDelete";
import ActivityCard from "../../../components/ActivityCardPkl";
import { Button, Header, Icon, Label, Loader, Menu, Sidebar, Table } from "semantic-ui-react";
import { DeleteButton, EditButton, PaginationTable, TableLoading } from "../../../components";
import Card from "../../../components/CardLaporan";
import FilterLaporanPkl from "./filter";
import { encodeURlFormat } from "../../../utils";
import { useRef } from 'react';
import html2pdf from 'html2pdf.js';
import { CopyButton } from "../../../components/buttonAksi/editButton";
import dayjs from "dayjs";
import { formatTanggalIndo } from "../../../utils/formatTanggal";
import { LabelStatus } from "../../../components/Label";


export default function LaporanPkl() {

    const componentARef = useRef();
    const { id } = useParams();
    const navigate = useNavigate();
    let { page, pageSize, setPage, setPageSize } = usePage();
    let queryClient = useQueryClient();
    let [isOpen, setIsOpen] = useState(false);
    let [keyword, setKeyword] = useState("");
    let debouncedKeyword = useDebounce(keyword, 500);
    let [visible, setVisible] = useState(false);
    const [filter, setFilter] = useState({});
    // const { mutate, isLoading: downloadPdfIsLoading } = useDownloadPdf(id);
    // const {
    //     mutate,
    //     isLoading: downloadPdfIsLoading,
    //     filterParams: downloadPdfFilterParams,
    //     handleClear: clearDownloadPdfFilter,
    //     handleFilter: applyDownloadPdfFilter,
    //     params: downloadPdfParams,
    //     setParams: setDownloadPdfParams,
    // } = useDownloadPdf();
    // console.log(downloadPdfParams);
    // console.log(downloadPdfFilterParams);

    //   const {
    //     data,
    //     isFetching,
    //     isLoading,
    //     setParams,
    //     handleFilter,
    //     handleClear,
    //     handlePageSize,
    //     handlePage,
    //     filterParams,
    //     params,
    //   } = useLaporanPklList();
    //   console.log(data);


    const params = {
        page, pageSize,

        // status: 1,
        // nama_siswa: encodeURlFormat(filter?.nama_siswa?.label),
        // studentId: encodeURlFormat(filter?.studentId?.value),
        nama_siswa: encodeURlFormat(filter?.nama_siswa?.label),
        // siswaId: encodeURlFormat(filter?.nama_siswa?.value),
        ...filter,

    };
    console.log('params asli', params);

    const { data, isLoading, isFetching } = useQuery(
        ["/laporan-harian-pkl", params],
        () => listLaporanPkl(params),
        {
            refetchOnWindowFocus: false,
            select: (response) => {
                console.log(response.data)
                return response.data;
            }
        }
    );

    const {
        showAlertDelete,
        setShowAlertDelete,
        deleteLoading,
        confirmDelete,
        onConfirmDelete,
    } = useDelete({
        afterDeleted: () => queryClient.invalidateQueries("/laporan-harian-pkl/list"),
        onDelete: (id) => deleteLaporanPkl(id),
    });

    return (
        <LayoutPage title={"Jurnal Pkl Santri"} >

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

                <FilterLaporanPkl filter={filter} setFilter={setFilter} setVisible={setVisible} targetRef={componentARef}></FilterLaporanPkl>
            </Sidebar>

            <section className="grid grid-cols-6 gap-5 px-5 ">
                <div className="col-span-6 lg:col-span-1 xl:col-span-1 py-4">
                    <Button
                        content={"Filter"}
                        type="button"
                        fluid
                        icon={() => <Icon name="filter" />}
                        size="medium"
                        color="teal"
                        onClick={() => {
                            setVisible(!visible);
                        }}
                    />
                </div>



            </section>


            {/* <div className="flex flex-col items-center w-full px-5 py-3 space-y-5 " ref={componentARef} count={8}>
                {(isLoading || isFetching) && (
                    <Loader active inline="centered" content="Loading..." />
                )}

                {data?.data?.length === 0 && !isLoading && !isFetching && (
                    <div className="w-full bg-yellow-50 text-center p-5 rounded">
                        <img src="image/data_not_found.png" alt="" />
                        <p className="text-brown-700 font-bold">Tidak Ditemukan Rekap pada filter yang dipilih</p>
                    </div>
                )}


                {data?.data?.map((value, index) => (

                    <React.Fragment key={index} >
                        <Card isFetching={isFetching} isLoading={isLoading} item={value} />
                    </React.Fragment>
                ))}


            </div> */}

            <section className="px-4">
                <Table celled selectable >
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>No</Table.HeaderCell>
                            {/* <Table.HeaderCell>Nama Guru</Table.HeaderCell> */}
                            <Table.HeaderCell>Nama Santri</Table.HeaderCell>
                            <Table.HeaderCell>Judul Kegiatan</Table.HeaderCell>
                            <Table.HeaderCell>Kehadiran</Table.HeaderCell>
                            <Table.HeaderCell>Tanggal</Table.HeaderCell>
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
                                    <Table.Cell >
                                        {value?.siswa?.nama_siswa}
                                    </Table.Cell>
                                    <Table.Cell>{value?.judul_kegiatan}</Table.Cell>
                                    <Table.Cell>{formatTanggalIndo(value.tanggal)}</Table.Cell>
                                    <Table.Cell><LabelStatus status={value.status} /></Table.Cell>
                                   
                                    <Table.Cell>
                                        {/* <EditButton
                                            onClick={() => navigate(`update/${value?.id}`, { replace: true })}
                                        />
                                        <DeleteButton
                                            onClick={() => confirmDelete(value?.id)}
                                        /> */}

                                        <Button content={'Detail'} size="tiny" color="blue" onClick={() => navigate(`/guru/laporan-pkl/detail/${value.id}`, { replace: true })}></Button>
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