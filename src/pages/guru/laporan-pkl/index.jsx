import { useNavigate, useParams } from "react-router-dom";
import usePage from "../../../hook/usePage";
import { QueryClient, useQuery, useQueryClient } from "react-query";
import React, { useState } from "react";
import { deleteLaporanPkl, listLaporanPkl, useDownloadPdf, useDownloadPdfBulanan, useLaporanPklList } from "../../../api/guru/laporanharianpkl";
import LayoutPage from "../../../module/layoutPage";
import useDebounce from "../../../hook/useDebounce";
import useDelete from "../../../hook/useDelete";
import { Button, Dropdown, Form, Header, Icon, Label, Loader, Menu, Pagination, Select, Sidebar, Table } from "semantic-ui-react";
import { DeleteButton, EditButton, Input, PaginationTable, ReactSelectAsync, TableLoading } from "../../../components";
import FilterLaporanPkl from "./filter";
import { encodeURlFormat } from "../../../utils";
import dayjs from "dayjs";
import { formatTanggalIndo } from "../../../utils/formatTanggal";
import { LabelStatus } from "../../../components/Label";


const Statusoptions = [
    { key: "hadir", value: "hadir", text: "Hadir" },
    { key: "izin", value: "izin", text: "Izin" },
];



// Pilihan untuk dropdown bulan
const monthOptions = [
    { key: 'jan', value: 1, text: 'Januari' },
    { key: 'feb', value: 2, text: 'Februari' },
    { key: 'mar', value: 3, text: 'Maret' },
    { key: 'apr', value: 4, text: 'April' },
    { key: 'may', value: 5, text: 'Mei' },
    { key: 'jun', value: 6, text: 'Juni' },
    { key: 'jul', value: 7, text: 'Juli' },
    { key: 'aug', value: 8, text: 'Agustus' },
    { key: 'sep', value: 9, text: 'September' },
    { key: 'oct', value: 10, text: 'Oktober' },
    { key: 'nov', value: 11, text: 'November' },
    { key: 'dec', value: 12, text: 'Desember' },
];

// Pilihan untuk dropdown tahun
const yearOptions = [
    { key: '2023', value: 2023, text: '2023' },
    { key: '2024', value: 2024, text: '2024' },
    { key: '2025', value: 2025, text: '2025' },
];

export default function LaporanPkl() {


        const { id } = useParams();

        let { page, pageSize, setPage, setPageSize } = usePage();
        let queryClient = useQueryClient();
        let [isOpen, setIsOpen] = useState(false);
        let [keyword, setKeyword] = useState("");
        let debouncedKeyword = useDebounce(keyword, 500);
        let [visible, setVisible] = useState(false);
        const [filter, setFilter] = useState({});
        let navigate = useNavigate();
      const today = dayjs().format("YYYY-MM-DD");
      
      // const [visible, setVisible] = useState(false);
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
        
        // const { mutate: downloadPdfBulanan, isLoading: downloadPdfBulananLoading } =
        //     useDownloadPdfBulanan();
    // const {
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
        // } = useLaporanPklList();
        // console.log(data);
        // let navigate = useNavigate();
        // const today = dayjs().format("YYYY-MM-DD");
        // const hasSubmittedToday = data?.data.some((item) => item.tanggal === today);
        
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
    
    const hasSubmittedToday = data?.data.some((item) => item.tanggal === today);
    const {
        showAlertDelete,
        setShowAlertDelete,
        deleteLoading,
        confirmDelete,
        onConfirmDelete,
    } = useDelete({
        afterDeleted: () => QueryClient.invalidateQueries("/laporan-harian-pkl/list"),
        onDelete: (id) => deleteLaporanPkl(id),
    });

    const handleSidebar = () => {
        setVisible(!visible);
    };
    // const handleDateChange = (e, value) => {
    //     console.log(value, "dddddddddddddddddd");
    //     if (value.name === "sampaiTanggal") {
    //         if (value >= params.dariTanggal) {
    //             setParams((params) => ({
    //                 ...params,
    //                 [value.name]: value.value,
    //             }));
    //         } else {
    //             alert(
    //                 `to year harus lebih besar dari dariTanggal ( ${params.dariTanggal} )`
    //             );
    //         }
    //     }
    //     if (value.name === "dariTanggal") {
    //         if (value > params.sampaiTanggal) {
    //             setParams((prevParams) => {
    //                 return {
    //                     ...prevParams,
    //                     sampaiTanggal: "",
    //                 };
    //             });
    //         }
    //     }
    //     setParams((params) => ({
    //         ...params,
    //         [value.name]: value.value,
    //     }));
    // };

    // 

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

                <FilterLaporanPkl filter={filter} setFilter={setFilter} setVisible={setVisible} ></FilterLaporanPkl>
            </Sidebar>
            

            <section className="flex  gap-5 px-5 ">
                <div className="col-span-6 lg:col-span-1 xl:col-span-1 py-4">
                    <Button
                        content={"Filter"}
                        type="button"
                        fluid
                        icon={() => <Icon name="filter" />}
                        size="medium"
                        color="teal"
                        onClick={
                            handleSidebar
                        }
                    />
                    {/* <Button
                        size="medium"
                        color="blue"
                        loading={downloadPdfIsLoading || downloadPdfBulananLoading}
                        disabled={downloadPdfParams?.bulan == null}
                        onClick={() => {
                            if (
                                downloadPdfParams &&
                                downloadPdfParams?.bulan === "Semua Bulan"
                            ) {
                                console.log("jalan");
                                downloadPdfBulanan();
                            } else {
                                console.log("jalan2");
                                mutate();
                            }
                        }}
                    >
                        Donwload PDF Bulanan
                    </Button>
                    <Select 
                        options={[
                            { key: "january", value: "1", text: "Januari" },
                            { key: "february", value: "2", text: "Februari" },
                            { key: "march", value: "3", text: "Maret" },
                            { key: "april", value: "4", text: "April" },
                            { key: "mei", value: "5", text: "Mei" },
                            { key: "Juni", value: "6", text: "Juni" },
                            { key: "Juli", value: "7", text: "Juli" },
                            { key: "Agustus", value: "8", text: "Agustus" },
                            { key: "September", value: "9", text: "September" },
                            { key: "Oktober", value: "10", text: "Oktober" },
                            { key: "November", value: "11", text: "November" },
                            { key: "Desember", value: "12", text: "Desember" },
                            {
                                key: "Semua Bulan",
                                value: "Semua Bulan",
                                text: "Semua Bulan",
                            },
                        ]}
                        placeholder="Pilih Bulan Untuk Download PDF"
                        onChange={(e, data) => {
                            setDownloadPdfParams((params) => ({
                                ...params,
                                bulan: data.value,
                            }));
                            handleFilter();
                        }}
                    /> */}
                    

                </div>



            </section>


            {/* <div className="flex flex-col items-center w-full px-5 py-3 space-y-5 "  count={8}>
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
                            <Table.HeaderCell>Nama Santri</Table.HeaderCell>
                            <Table.HeaderCell>Judul Kegiatan</Table.HeaderCell>
                            <Table.HeaderCell>Kehadiran</Table.HeaderCell>
                            <Table.HeaderCell>Tanggal</Table.HeaderCell>
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
                                    <Table.Cell >
                                        {value?.siswa?.nama_siswa}
                                    </Table.Cell>
                                    <Table.Cell>{value?.judul_kegiatan}</Table.Cell>
                                    <Table.Cell>{formatTanggalIndo(value.tanggal)}</Table.Cell>
                                    <Table.Cell><LabelStatus status={value.status} /></Table.Cell>

                                    <Table.Cell>
                                       

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
                {/* <div className="w-full justify-center mt-4">
                    <Pagination
                        handlePage={handlePage}
                        handlePageSize={handlePageSize}
                        page={params.page}
                        pageSize={params.pageSize}
                        pagination={data?.pagination}
                    />
                </div> */}
            </section>


        </LayoutPage>
    )
}