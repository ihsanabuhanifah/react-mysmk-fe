import React from "react";
import LayoutSiswa from "../../../module/layoutSiswa";
import { Button, Icon, Placeholder, Segment } from "semantic-ui-react";
import { useLaporanPklList } from "../../../api/siswa/laporan-pkl";
import Card from "./Card";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import Pagination from "../../../components/Pagination";

const LaporanPkl = () => {
  
  const {
    data,
    isFetching,
    isLoading,
    setParams,
    handleFilter,
    handleClear,
    handlePageSize,
    handlePage,
    filterParams,
    params
  } = useLaporanPklList();
  console.log(data && data)
  console.log(data?.data?.length)
  let navigate = useNavigate();
  const today = dayjs().format("YYYY-MM-DD");
  const hasSubmittedToday = data?.data.some((item) => item.tanggal === today);

  return (
    <LayoutSiswa title="Laporan Pkl">
      <div className="flex flex-col gap-y-4 overflow-y-auto pb-10 w-full h-full pl-2 pr-5">
        <div className="w-full flex justify-between">
          <Button
            color="green"
            size="medium"
            disabled={hasSubmittedToday}
            onClick={() => navigate("/siswa/laporan-pkl/create")}
          >
            Buat Laporan
          </Button>
          <Button color="red" size="medium">
            <Icon name="filter" />
            Filter
          </Button>
        </div>
        <div className="md:mt-8 mt-6">
          {isFetching ? (
            <>
              {/* Placeholder shimmer untuk loading state */}
              {[...Array(5)].map((_, index) => (
                <Segment key={index} className="mb-4">
                  <Placeholder>
                    <Placeholder.Header>
                      <Placeholder.Line />
                      <Placeholder.Line />
                    </Placeholder.Header>
                    <Placeholder.Paragraph>
                      <Placeholder.Line length="medium" />
                      <Placeholder.Line length="short" />
                    </Placeholder.Paragraph>
                  </Placeholder>
                </Segment>
              ))}
            </>
          ) : (
            data &&
            data.data.map((item, index) =>
              data.data.length !== 0 ? (
                <React.Fragment key={index}>
                  <Card
                    isFetching={isFetching}
                    isLoading={isLoading}
                    item={item}
                  />
                </React.Fragment>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <h2 className="text-4xl font-semibold">
                    Anda Belum Memiliki Laporan
                  </h2>
                </div>
              )
            )
          )}
        </div>
        <div className="w-full justify-center my-4">
         <Pagination handlePage={handlePage} handlePageSize={handlePageSize} page={params.page} pageSize={params.pageSize} pagination={data?.pagination}/>
        </div>
      </div>
    </LayoutSiswa>
  );
};

export default LaporanPkl;
