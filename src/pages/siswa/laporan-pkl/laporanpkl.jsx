import React from "react";
import LayoutSiswa from "../../../module/layoutSiswa";
import {
  Button,
  Dimmer,
  Icon,
  Image,
  Loader,
  Placeholder,
  PlaceholderLine,
  Segment,
} from "semantic-ui-react";
import { useLaporanPklList } from "../../../api/siswa/laporan-pkl";
import Card from "./Card";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import usePage from "../../../hook/usePage";
import { PaginationTable } from "../../../components";
const LaporanPkl = () => {
  const { data, isFetching, isLoading, page, pageSize, setPage, setPageSize } =
    useLaporanPklList();
  console.log(data, "dataaaaaa");
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
            {" "}
            <Icon name="filter" />
            Filter
          </Button>
        </div>
        <div className="md:mt-8 mt-6">
          {isFetching ? (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,

                zIndex: 50,
              }}
              className="fixed flex items-center justify-center "
            >
              <div>
                <Dimmer
                  style={{
                    backgroundColor: "rgba(255, 255,255, 0.5)", // semi-transparent white
                    backdropFilter: "blur(0.5px)", // applies blur effect
                  }}
                  active
                  inverted
                >
                  <Loader size="large">Loading data ... </Loader>
                </Dimmer>
              </div>
            </div>
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
          <PaginationTable
            page={page}
            pageSize={pageSize}
            setPage={setPage}
            setPageSize={setPageSize}
            totalPages={data && data.data.length}
          />
        </div>
      </div>
    </LayoutSiswa>
  );
};

export default LaporanPkl;
