import { useNavigate } from "react-router-dom";
import usePage from "../../../hook/usePage";
import { useQuery, useQueryClient } from "react-query";
import React, { useState } from "react";
import { listLaporanPkl } from "../../../api/guru/laporanharianpkl";
import LayoutPage from "../../../module/layoutPage";
import useDebounce from "../../../hook/useDebounce";
import useDelete from "../../../hook/useDelete";
import ActivityCard from "../../../components/ActivityCardPkl";
import { Button, Header, Icon, Label, Menu, Sidebar } from "semantic-ui-react";
import { DeleteButton, EditButton, TableLoading } from "../../../components";
import Card from "../../../components/CardLaporan";
import FilterLaporanPkl from "./filter";
import { encodeURlFormat } from "../../../utils";


export default function LaporanPkl() {
    const navigate = useNavigate();
    let { page, pageSize, setPage, setPageSize } = usePage();
    let queryClient = useQueryClient();
    let [isOpen, setIsOpen] = useState(false);
    let [keyword, setKeyword] = useState("");
    let debouncedKeyword = useDebounce(keyword, 500);
    let [visible, setVisible] = useState(false);
    const [filter, setFilter] = useState({});

    const statusColors = {
        'hadir': 'green',
        'izin': 'orange',
        'sakit': 'red',
        // Add more status-color mappings as needed
    };

    const params = {
        page, pageSize,
        status: 1,
        ...filter,
        nama_siswa: encodeURlFormat(filter?.nama_siswa?.label),

    };
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
        onDelete: (id) => deleteSiswaPkl(id),
    });

    return (
        <LayoutPage title={"Laporan Pkl"} >
            {/* <Header>
                {"List Tempat PKL santri"}
            </Header> */}
            {/* <div className="grid grid-cols-6 gap-5 px-5 py-4 ">
                <div className="col-span-6 lg:col-span-1 xl:col-span-1 ">
                    <Button type="button" color="teal" icon={<Icon name="add" />} onClick={() => navigate("tambah", { replace: true })} content="Tambah" size="medium" fluid />
                </div>
            </div> */}
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
            <section className="grid grid-cols-6 gap-5 px-5 ">
                <div className="col-span-6 lg:col-span-1 xl:col-span-1">
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

            <div className="flex flex-col gap-6 items-center w-full px-5 py-4 ">

                <TableLoading data={data?.data?.row} messageEmpty={'Data Tidak Ditemukan'}>
                    {data?.data?.map((value, index) => (

                        <React.Fragment key={index}>

                            <Card
                                isFetching={isFetching}
                                isLoading={isLoading}
                                item={value}
                            />

                        </React.Fragment>

                    ))}

                </TableLoading>


            </div>




        </LayoutPage>
    )
}