import { useNavigate } from "react-router-dom";
import usePage from "../../../hook/usePage";
import { useQuery, useQueryClient } from "react-query";
import React, { useState } from "react";
import { listLaporanPkl } from "../../../api/guru/laporanharianpkl";
import LayoutPage from "../../../module/layoutPage";
import useDebounce from "../../../hook/useDebounce";
import useDelete from "../../../hook/useDelete";
import ActivityCard from "../../../components/ActivityCardPkl";
import { Button, Header, Icon, Label } from "semantic-ui-react";
import { DeleteButton, EditButton, TableLoading } from "../../../components";
import Card from "../../../components/CardLaporan";


export default function LaporanPkl() {
    const navigate = useNavigate();
    let { page, pageSize, setPage, setPageSize } = usePage();
    let queryClient = useQueryClient();
    let [isOpen, setIsOpen] = useState(false);
    let [keyword, setKeyword] = useState("");
    let debouncedKeyword = useDebounce(keyword, 500);
    let [visible, setVisible] = useState(false);
    let [filter, setFilter] = useState({});

    const statusColors = {
        'hadir': 'green',
        'izin': 'orange',
        'sakit': 'red',
        // Add more status-color mappings as needed
    };

    const params = {
        page, pageSize
    };
    const { data, isLoading ,isFetching} = useQuery(
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

            <div className="flex flex-col gap-6 items-center w-full px-5 py-4 ">

                {data?.data?.map((value, index) => (
                    
                    <React.Fragment key={index }>
                      <Card
                        isFetching={isFetching}
                        isLoading={isLoading}
                        item={value}
                      />
                    </React.Fragment>
                    
                ))}



            </div>




        </LayoutPage>
    )
}