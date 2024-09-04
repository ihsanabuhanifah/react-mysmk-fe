import React, { useState } from "react";
import LayoutSiswa from "../../../module/layoutSiswa";
import {
  Button,
  Icon,
  Placeholder,
  Segment,
  Sidebar,
  Menu,
  Form,
  Input,
  Select,
} from "semantic-ui-react";
import {
  useDownloadPdf,
  useLaporanPklList,
} from "../../../api/siswa/laporan-pkl";
import Card from "./Card";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import Pagination from "../../../components/Pagination";

const Statusoptions = [
  { key: "hadir", value: "hadir", text: "Hadir" },
  { key: "izin", value: "izin", text: "Izin" },
];

const LaporanPkl = () => {
  const [visible, setVisible] = useState(false);
  const { mutate, isLoading: downloadPdfIsLoading } = useDownloadPdf();
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
    params,
  } = useLaporanPklList();
  console.log(data);
  let navigate = useNavigate();
  const today = dayjs().format("YYYY-MM-DD");
  const hasSubmittedToday = data?.data.some((item) => item.tanggal === today);
  console.log(params.dariTanggal, "sssampaui tanggal");
  console.log(params.sampaiTanggal, "dari tanggal");
  console.log(params?.sampaiTanggal?.value, "dari tanggalss");
  console.log(params);
  const handleSidebar = () => {
    setVisible(!visible);
  };
  const handleDateChange = (e, value) => {
    console.log(value, "dddddddddddddddddd");
    if (value.name === "sampaiTanggal") {
      if (value >= params.dariTanggal) {
        setParams((params) => ({
          ...params,
          [value.name]: value.value,
        }));
      } else {
        alert(
          `to year harus lebih besar dari dariTanggal ( ${params.dariTanggal} )`
        );
      }
    }
    if (value.name === "dariTanggal") {
      if (value > params.sampaiTanggal) {
        setParams((prevParams) => {
          return {
            ...prevParams,
            sampaiTanggal: "",
          };
        });
      }
    }
    setParams((params) => ({
      ...params,
      [value.name]: value.value,
    }));
  };

  return (
    <LayoutSiswa title="Jurnal Pkl">
        <Sidebar
          as={Menu}
          animation="overlay"
          icon="labeled"
          inverted
          onHide={() => setVisible(false)}
          vertical
          visible={visible}
          width="wide"
          direction="right"
          style={{ backgroundColor: "white", width: "300px" }}
        >
          <Menu.Item header>
            <Icon name="filter" />
            Filter Options
          </Menu.Item>
          <Form className="mx-2">
            <Form.Field>
              <label>Dari Tanggal</label>
              <Input
                type="date"
                name="dariTanggal"
                value={params?.dariTanggal?.value}
                onChange={handleDateChange}
              />
            </Form.Field>
            <Form.Field>
              <label>Sampai Tanggal</label>
              <Input
                disabled={params.dariTanggal === null}
                type="date"
                name="sampaiTanggal"
                value={params?.sampaiTanggal?.value}
                onChange={handleDateChange}
              />
            </Form.Field>
            <Form.Field>
              <label>Status kehadiran</label>
              <Select
                options={Statusoptions}
                placeholder="pilih status"
                value={params?.status_kehadiran?.value}
                onChange={(e, data) => {
                  setParams((params) => ({
                    ...params,
                    status_kehadiran: data.value,
                  }));
                }}
              />
            </Form.Field>
            <Form.Field>
              <Button className="w-full" primary onClick={() => handleFilter}>
                Apply Filters
              </Button>
            </Form.Field>
            <Form.Field>
              <Button className="w-full" color="green" onClick={handleClear}>
                Clear Filters
              </Button>
            </Form.Field>
          </Form>
        </Sidebar>

        <div >
          <div className="flex flex-col gap-y-4 pb-10 w-full h-full pl-2 pr-5">
            <div className="w-full flex justify-between bg-transparent">
              <Button
                color="green"
                size="medium"
                disabled={hasSubmittedToday}
                onClick={() => navigate("/siswa/laporan-pkl/create")}
              >
                Buat Laporan
              </Button>
              <Button size="medium" color="red" onClick={handleSidebar}>
                <Icon name="filter" />
                Filter
              </Button>
              <Button size="medium" color="red" loading={downloadPdfIsLoading} onClick={() => mutate()}>
                donwload tes pdf
              </Button>
            </div>
            <div
              className="mt-6 overflow-y-auto"
              style={{ maxHeight: "calc(100vh - 200px)" }}
            >
              {isFetching ? (
                <>
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
            <div className="w-full justify-center mt-4">
              <Pagination
                handlePage={handlePage}
                handlePageSize={handlePageSize}
                page={params.page}
                pageSize={params.pageSize}
                pagination={data?.pagination}
              />
            </div>
          </div>
        </div>
    </LayoutSiswa>
  );
};

export default LaporanPkl;
