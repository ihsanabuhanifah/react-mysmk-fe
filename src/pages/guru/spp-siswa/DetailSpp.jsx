import React, { useEffect, useState } from "react";
import LayoutPage from "../../../module/layoutPage";
import {
  Button,
  Dropdown,
  Icon,
  Menu,
  Sidebar,
  Modal,
  Table,
} from "semantic-ui-react";
import { Form, Formik } from "formik";
import { useParams } from "react-router-dom";
import { PaginationTable, TableLoading } from "../../../components";
import { useQuery, useQueryClient } from "react-query";
import { formatDate, handleViewNull } from "../../../utils";
import { StatusPembayaranOptions } from "../../../utils/options";
import { formatRupiah, statusPembayaran } from "../../../utils/format";
import {
  detailSpp,
  downloadRekapSpp,
  updateStatus,
} from "../../../api/guru/spp";
import { toast } from "react-toastify";
import FilterDetailSPP from "./filter-detail";
import useDownload from "../../../hook/useDownload";

export default function DetailSpp() {
  const { student_id } = useParams();
  let queryClient = useQueryClient();
  let [page, setPage] = React.useState(1);
  let [pageSize, setPageSize] = React.useState(12);
  const [filter, setFilter] = React.useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [approve, setApprove] = useState(false);
  const [updated, setUpdated] = useState(false);
  const [visible, setVisible] = React.useState(false);
  const [tempValues, setTempValues] = useState([]);
  const [pendingStatus, setPendingStatus] = useState({});


  const param = {
    page: page,
    pageSize: pageSize,
    ...filter,
  };

  const { data, isLoading, isError, error } = useQuery(
    ["detailSpp", student_id, param],
    () => detailSpp(student_id, param),
    {
      refetchInterval: 1000 * 60 * 60,
      select: (response) => {
        return response.data;
      },
    }
  );

  let { isLoadingDownload, handleDownload } = useDownload({
    filename: "rekap-spp.pdf",
    onDownload: async () => {
      return downloadRekapSpp(student_id, param);
    },
  });

  useEffect(() => {
    if (data) {
      console.log("Fetching:", data);
    }
  }, [data]);

  const initialValues = data?.data?.rows || [];

  if (isError) {
    return <div>Error fetching data: {error.message}</div>;
  }

  const onSubmit = async (values) => {
    const updatedValues = values.map((item, index) => {
      if (pendingStatus[index]) {
        return {
          ...item,
          status: pendingStatus[index],
          updated: true,
        };
      }
      return item;
    });
  
    try {
      let response = await updateStatus(updatedValues);
      queryClient.invalidateQueries(["detailSpp", student_id, param]);
      setApprove(false);
      setUpdated(false);
      setPendingStatus({}); // Reset pending status
      toast.success(response?.data?.msg, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } catch (err) {
      console.log(err);
      toast.error("Gagal memperbarui status pembayaran.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };
  

  return (
    <LayoutPage title={"Pembayaran Spp"}>
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
        <FilterDetailSPP
          filter={filter}
          setFilter={setFilter}
          setVisible={setVisible}
        />
      </Sidebar>
      <Formik
        initialValues={initialValues}
        enableReinitialize
        onSubmit={onSubmit}
      >
        {({ values, handleSubmit, setValues, isSubmitting, setFieldValue }) => (
          <Form onSubmit={handleSubmit}>
            <section className="mt-5">
              <div className="overflow-auto h-full">
                <div className="grid grid-cols-10 gap-5">
                  <div className="col-span-8 lg:col-span-2">
                    <Button
                      type="button"
                      color="teal"
                      fluid
                      basic
                      icon={() => <Icon name="filter" />}
                      onClick={() => setVisible(!visible)}
                      content="Filter"
                    />
                  </div>
                  <div className="col-span-9 lg:col-span-2">
                    <Button
                      type="button"
                      color="yellow"
                      icon={() => <Icon name="print" />}
                      fluid
                      loading={isLoadingDownload}
                      onClick={() => {
                        handleDownload(student_id, param);
                      }}
                      content="rekap Laporan"
                    />
                  </div>
                  {approve ? (
                    <>
                      <div className="col-span-4 lg:col-span-1">
                        <Button
                          type="button"
                          color="red"
                          basic
                          fluid
                          onClick={() => {
                            setApprove(false);
                            setUpdated(false);
                            return setValues(data?.data?.rows);
                          }}
                          content="Batal"
                        />
                      </div>
                      <div className="col-span-4 lg:col-span-1">
                        <Button
                          content="Simpan"
                          color="teal"
                          basic
                          fluid
                          type="submit"
                          loading={isSubmitting}
                          disabled={isSubmitting || !updated}
                        />
                      </div>
                    </>
                  ) : null}
                </div>

                <Modal open={isOpen} onClose={() => setIsOpen(false)}>
                  <Modal.Header>Bukti Pembayaran SPP</Modal.Header>
                  <Modal.Content>
                    <img
                      src="https://i.ibb.co.com/1vb9fhk/20190515-042338-5cdb370875065776065e29e6.jpg"
                      alt=""
                      className=""
                    />
                  </Modal.Content>
                  <Modal.Actions>
                    <Button onClick={() => setIsOpen(false)} color="green">
                      Oke
                    </Button>
                  </Modal.Actions>
                </Modal>

                <section className="mt-5">
                  <Table celled selectable>
                    <Table.Header>
                      <Table.Row>
                        <Table.HeaderCell>No</Table.HeaderCell>
                        <Table.HeaderCell>Bulan</Table.HeaderCell>
                        <Table.HeaderCell>Tahun Ajaran</Table.HeaderCell>
                        <Table.HeaderCell>Nominal</Table.HeaderCell>
                        <Table.HeaderCell content singleLine={approve}>
                          Status
                        </Table.HeaderCell>
                        <Table.HeaderCell>No Hp</Table.HeaderCell>
                        <Table.HeaderCell>Konfirmasi</Table.HeaderCell>
                        <Table.HeaderCell>Tanggal</Table.HeaderCell>
                        <Table.HeaderCell>Bukti pembayaran</Table.HeaderCell>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      <TableLoading
                        count={10}
                        isLoading={isLoading}
                        data={data?.data?.rows}
                        messageEmpty={"Data Tidak Ditemukan"}
                      >
                        {values.map((item, index) => (
                          <Table.Row key={index}>
                            <Table.Cell>{index + 1}</Table.Cell>
                            <Table.Cell>
                              {handleViewNull(item.bulan)}
                            </Table.Cell>
                            <Table.Cell>
                              {handleViewNull(item.ta.nama_tahun_ajaran)}
                            </Table.Cell>
                            <Table.Cell>
                              {formatRupiah(item.nominal)}
                            </Table.Cell>

                            <Table.Cell>
                              {approve ? (
                                <Dropdown
                                fluid
                                selection
                                onChange={(event, data) => {
                                  setUpdated(true);
                                  setPendingStatus((prev) => ({
                                    ...prev,
                                    [index]: data.value,
                                  }));
                                }}
                                name={`[${index}]status`}
                                value={pendingStatus[index] || item.status} // Gunakan pendingStatus jika ada
                                options={StatusPembayaranOptions}
                                />
                              ) : (
                                <button
                                  onClick={() => setApprove(true)}
                                  type="button"
                                >
                                  {statusPembayaran(item?.status)}
                                </button>
                              )}
                            </Table.Cell>
                            <Table.Cell>
                              {handleViewNull(item?.no_telepon)}
                            </Table.Cell>
                            <Table.Cell>
                              {handleViewNull(item?.guru?.nama_guru)}
                            </Table.Cell>
                            <Table.Cell>
                              {formatDate(item.tanggal_konfirmasi)}
                            </Table.Cell>

                            <Table.Cell>
                              {item.status === "Belum" ? (
                                <button
                                  type="button"
                                  className="bg-gray-300 text-gray-600 px-4 py-2 rounded cursor-not-allowed"
                                  disabled
                                >
                                  -
                                </button>
                              ) : (
                                <button
                                  onClick={() => setIsOpen(true)}
                                  type="button"
                                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                >
                                  Lihat Bukti
                                </button>
                              )}
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
