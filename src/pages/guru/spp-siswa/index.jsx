import React, { useEffect, useState } from "react";
import LayoutPage from "../../../module/layoutPage";
import {
  Button,
  Icon,
  Input,
  Menu,
  Modal,
  Select,
  Sidebar,
  Table,
} from "semantic-ui-react";
import { Form, Formik } from "formik";
import { useNavigate } from "react-router-dom";
import { PaginationTable, TableLoading } from "../../../components";
import { useQuery } from "react-query";
import { handleViewNull } from "../../../utils";
import useCheckbox from "../../../hook/useCheckbox";
import Checkbox from "../../../components/Checkbox";
import { getOptions } from "../../../utils/format";
import useList from "../../../hook/useList";
import { createSpp, listSPP } from "../../../api/guru/spp";
import { toast } from "react-toastify";
import NotifikasiSpp from "./notifikasi-spp";
import FilterSPP from "./filter-spp";
import useDebounce from "../../../hook/useDebounce";
import usePage from "../../../hook/usePage";

export default function SppSiswa() {
  let [nama, setNama] = React.useState("");
  let debouncedName = useDebounce(nama, 600);
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = React.useState({});
  const [selectedIds, setSelectedIds] = useState([]);
  const [nominal, setNominal] = useState(2500000);
  let { page, pageSize, setPage, setPageSize } = usePage();
  const [tahunAjaran, setTahunAjaran] = useState("");
  const [visibleNotif, setVisibleNotif] = React.useState(false);
  const [visibleFilter, setVisibleFilter] = React.useState(false);
  const { handleCheck, isChecked, payload, handleCheckAll } = useCheckbox();
  const navigate = useNavigate();
  const { dataTa } = useList();
  const param = {
    page: page,
    pageSize: pageSize,
    nama_siswa: debouncedName,
    ...filter,
  };
  const { data, isLoading } = useQuery(
    ["listSPP", param],
    () => listSPP(param),
    {
      refetchInterval: 1000 * 60 * 60,
      select: (response) => {
        return response.data;
      },
    }
  );

  const initialValues = data?.data?.rows || [];
  const handleTambah = () => {
    console.log("Opening modal");
    setSelectedIds(payload);
    setIsOpen(true);
  };
  const handleSubmitTambah = async () => {
    if (!tahunAjaran) {
      toast.error("Mohon lengkapi semua field.");
      return;
    }
    try {
      const payload = selectedIds.map((id) => ({
        student_id: id,
        ta_id: tahunAjaran,
        nominal: nominal,
      }));
      const response = await createSpp({ payload });

      if (response.data.status === "Success" && response.data.berhasil > 0) {
        setIsOpen(false);
        setNominal("");
        setTahunAjaran("");
        setSelectedIds([]);
        toast.success("Data SPP berhasil ditambahkan.");
      } else {
        toast.error(`Tahun Ajaran pembayaran sudah terdaftar`);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Terjadi kesalahan: " + error.message);
    }
  };

  useEffect(() => {
    if (data) {
      console.log("Fetched:", data);
    }
    console.log("Current filter:", filter);
  }, [data, filter]);

  return (
    <LayoutPage title={"Spp"}>
      <Sidebar
        as={Menu}
        animation="overlay"
        icon="labeled"
        inverted
        direction="right"
        onHide={() => setVisibleFilter(false)}
        vertical
        visible={visibleFilter}
        width="wide"
      >
        <FilterSPP
          filter={filter}
          setFilter={setFilter}
          setVisible={setVisibleFilter}
        />
      </Sidebar>
      <Formik
        initialValues={initialValues}
        enableReinitialize
        onSubmit={() => {}}
      >
        {({ values, handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <section className="mt-5">
              <div className="overflow-auto h-full">
                <div className="grid grid-cols-10 gap-5">
                  <div className="col-span-8 lg:col-span-4">
                    <Input
                      onChange={(e) => {
                        setNama(e.target.value);
                      }}
                      fluid
                      value={nama}
                      icon="search"
                      placeholder="Nama Siswa..."
                    />
                  </div>
                  <div className="col-span-9 lg:col-span-2">
                    <Button
                      type="button"
                      color="blue"
                      icon={() => <Icon name="add" />}
                      fluid
                      disabled={payload.length === 0}
                      onClick={handleTambah}
                      content="Tambah"
                    />
                  </div>

                  <Sidebar
                    as={Menu}
                    animation="overlay"
                    icon="labeled"
                    inverted
                    direction="right"
                    onHide={() => setVisibleNotif(false)}
                    vertical
                    visible={visibleNotif}
                    width="wide"
                  >
                    <NotifikasiSpp
                      filter={filter}
                      setFilter={setFilter}
                      setVisible={setVisibleNotif}
                    />
                  </Sidebar>

                  <div className="col-span-8 lg:col-span-2">
                    <Button
                      type="button"
                      color="pink"
                      fluid
                      onClick={() => setVisibleFilter(!visibleFilter)}
                      content="Filter"
                    />
                  </div>
                  <div className="col-span-8 lg:col-span-2">
                    <Button
                      type="button"
                      icon={() => <Icon name="whatsapp" />}
                      onClick={() => setVisibleNotif(!visibleNotif)}
                      size="green"
                      color="grey"
                    />
                  </div>
                </div>

                <Modal open={isOpen} onClose={() => setIsOpen(false)}>
                  <Modal.Header>Tambah SPP</Modal.Header>
                  <Modal.Content>
                    <div className="grid grid-cols-1 gap-4">
                      <label htmlFor="nominal">Nominal</label>
                      <Input
                        placeholder="Masukkan Nominal"
                        value={nominal}
                        onChange={(e) => setNominal(e.target.value)}
                        fluid
                      />
                      <label htmlFor="nominal">Tahun Ajaran</label>
                      <Select
                        options={getOptions(dataTa?.data, "nama_tahun_ajaran")}
                        label={{ children: "Tahun Ajaran" }}
                        onChange={(e, { value }) => setTahunAjaran(value)}
                        value={tahunAjaran}
                        placeholder="Pilih Tahun Ajaran"
                        search
                        searchInput={{ id: "ta_id", name: "ta_id" }}
                        fluid
                      />
                    </div>
                  </Modal.Content>
                  <Modal.Actions>
                    <Button onClick={() => setIsOpen(false)} color="red">
                      Batal
                    </Button>
                    <Button onClick={handleSubmitTambah} color="green">
                      Simpan
                    </Button>
                  </Modal.Actions>
                </Modal>

                <section className="mt-5" style={{ zoom: "80%" }}>
                  <Table celled selectable>
                    <Table.Header>
                      <Table.Row>
                        <Table.HeaderCell>
                          <Checkbox
                            checked={payload.length === values.length}
                            onChange={() => handleCheckAll(values)}
                          />
                        </Table.HeaderCell>
                        <Table.HeaderCell>No</Table.HeaderCell>
                        <Table.HeaderCell>Nama Santri</Table.HeaderCell>
                        <Table.HeaderCell>Angkatan</Table.HeaderCell>
                        <Table.HeaderCell>Detail</Table.HeaderCell>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      <TableLoading
                        count={9}
                        isLoading={isLoading}
                        data={data?.data?.rows}
                        messageEmpty={"Data Tidak Ditemukan"}
                      >
                        {values.map((item, index) => (
                          <Table.Row key={index}>
                            <Table.Cell>
                              <Checkbox
                                checked={
                                  isChecked(item.id) && item.status !== "alumni"
                                }
                                disabled={item.status === "alumni"}
                                onChange={(e) => handleCheck(e, item.id)}
                              />
                            </Table.Cell>
                            <Table.Cell>{index + 1}</Table.Cell>
                            <Table.Cell>
                              {handleViewNull(item.nama_siswa)}
                            </Table.Cell>

                            <Table.Cell textAlign="center">
                              {handleViewNull(item.angkatan)}
                            </Table.Cell>

                            <Table.Cell>
                              <Button
                                onClick={() => {
                                  navigate(`DetailSpp/${item.id}`);
                                }}
                                color="grey"
                                type="button"
                                content="Lihat detail"
                                fluid
                              />
                            </Table.Cell>
                          </Table.Row>
                        ))}
                      </TableLoading>
                    </Table.Body>
                  </Table>
                </section>
              </div>
            </section>
          </Form>
        )}
      </Formik>
      <PaginationTable
        page={page}
        pageSize={pageSize}
        setPageSize={setPageSize}
        setPage={setPage}
        totalPages={data?.data?.count}
      />
    </LayoutPage>
  );
}
