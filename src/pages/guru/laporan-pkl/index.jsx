import { useNavigate, useParams } from "react-router-dom";
import usePage from "../../../hook/usePage";
import { useQuery, useQueryClient } from "react-query";
import React, { useState } from "react";
import { deleteLaporanPkl, listLaporanPkl, useDownloadPdf, useLaporanPklList } from "../../../api/guru/laporanharianpkl";
import LayoutPage from "../../../module/layoutPage";
import useDebounce from "../../../hook/useDebounce";
import useDelete from "../../../hook/useDelete";
import ActivityCard from "../../../components/ActivityCardPkl";
import { Button, Header, Icon, Label, Loader, Menu, Sidebar } from "semantic-ui-react";
import { DeleteButton, EditButton, PaginationTable, TableLoading } from "../../../components";
import Card from "../../../components/CardLaporan";
import FilterLaporanPkl from "./filter";
import { encodeURlFormat } from "../../../utils";
import Pagination from "../../../components/pagination";
import { useRef } from 'react';
import html2pdf from 'html2pdf.js';


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


    // const statusColors = {
    //     'hadir': 'green',
    //     'izin': 'orange',
    //     'sakit': 'red',
    //     // Add more status-color mappings as needed
    // };

    //asli
    const params = {
        page, pageSize,

        // status: 1,
        // nama_siswa: encodeURlFormat(filter?.nama_siswa?.label),
        // studentId: encodeURlFormat(filter?.studentId?.value),
        nama_siswa: encodeURlFormat(filter?.nama_siswa?.label),
        // siswaId: encodeURlFormat(filter?.nama_siswa?.value),
        ...filter,

    };
    console.log('params asli',params);
    
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
        <LayoutPage title={"Laporan Pkl"} >
            
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

            {/* <div className="flex flex-col gap-6 items-center w-full px-5 py-4 " >

                    {data?.data?.map((value, index) => (

                        <React.Fragment key={index}>

                            <Card
                                isFetching={isFetching}
                                isLoading={isLoading}
                                item={value}
                            />

                        </React.Fragment>

                    ))}

                


            </div> */}

            <div className="flex flex-col items-center w-full px-5 py-3 space-y-5 " ref={componentARef} count={8}>
                {/* Display loader while fetching or loading data */}
                {(isLoading || isFetching) && (
                    <Loader active inline="centered" content="Loading..." />
                )}

                {/* Check if there's no data and show a message */}
                {data?.data?.length === 0 && !isLoading && !isFetching && (
                    <div className="w-full bg-yellow-50 text-center p-5 rounded">
                        <img src="image/data_not_found.png" alt="" />
                        <p className="text-brown-700 font-bold">Tidak Ditemukan Rekap pada filter yang dipilih</p>
                    </div>
                )}

                {/* Render cards if data is available */}


                {data?.data?.map((value, index) => (

                    <React.Fragment key={index} >
                        <Card isFetching={isFetching} isLoading={isLoading} item={value} />
                    </React.Fragment>
                ))}


            </div>
            <div className="w-full justify-center mt-4">
                <PaginationTable
                    handlePage={setPage}
                    handlePageSize={setPageSize}
                    page={params.page}
                    pageSize={params.pageSize}
                    pagination={data?.pagination}
                />
            </div>


        </LayoutPage>
    )
}