import React, { useState } from "react";
import LayoutPage from "../../../module/layoutPage";
import {
  DeleteButton,
  EditButton,
  ModalAlert,
  PaginationTable,
  TableLoading,
} from "../../../components";
import useDelete from "../../../hook/useDelete";
import { useQuery, useQueryClient } from "react-query";
import { Button, Icon, Input, Menu, Sidebar, Table } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import usePage from "../../../hook/usePage";
import {
  createSiswaPkl,
  deleteSiswaPkl,
  listSiswaPkl,
  updateSiswaPkl,
  useLaporanPklList,
} from "../../../api/guru/fitur-pkl";
import { toast } from "react-toastify";
import UploadExcel from "../../../components/ModalUploadExel";
import useDebounce from "../../../hook/useDebounce";
import FilterSiswaPkl from "./filter";
import { encodeURlFormat } from "../../../utils";
// import Pagination from '../../../components/pagination';

export default function FiturPkl() {
  const navigate = useNavigate();
  let { page, pageSize, setPage, setPageSize } = usePage();
  let queryClient = useQueryClient();
  let [isOpen, setIsOpen] = useState(false);
  let [keyword, setKeyword] = React.useState("");
  let debouncedKeyword = useDebounce(keyword, 500);
  let [visible, setVisible] = React.useState(false);
  let [filter, setFilter] = React.useState({});

  const params = {
    page,
    pageSize,
    keyword: debouncedKeyword,
    ...filter,
    nama_siswa: encodeURlFormat(filter?.nama_siswa?.label),
    nama_perusahaan: encodeURlFormat(filter?.nama_perusahaan),
    // alamat: encodeURlFormat(filter?.alamat),
    // kota: encodeURlFormat(filter?.kota),
    // kode_pos: encodeURlFormat(filter?.kode_pos),
    // no_hp: encodeURlFormat(filter?.no_hp),
    // penanggung_jawab_perusahaan: encodeURlFormat(filter?.penanggung_jawab_perusahaan),
    // penanggung_jawab_sekolah: encodeURlFormat(filter?.penanggung_jawab_sekolah),
    // nama_guru: encodeURlFormat(filter?.nama_guru),
  };

  const { data, isLoading, isFetching } = useQuery(
    ["/tempat-pkl/list", params],
    () => listSiswaPkl(params),
    {
      refetchOnWindowFocus: false,
      // select: (response) => response.data,
      select: (response) => {
        console.log(response.data);
        return response.data;
      },
    },
  );
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
  //   } = useLaporanPklList();
  //   console.log(data);

  const {
    showAlertDelete,
    setShowAlertDelete,
    deleteLoading,
    confirmDelete,
    onConfirmDelete,
  } = useDelete({
    afterDeleted: () => queryClient.invalidateQueries("/tempat-pkl/list"),
    onDelete: (id) => deleteSiswaPkl(id),
  });

  // const onSubmit = async (values, { resetForm }) => {
  //     try {
  //       let response;
  //       if (mode === "update") {
  //         response = await updateSiswaPkl(values);
  //       } else {
  //         response = await createSiswaPkl(values);
  //       }
  //       console.log(response);
  //       queryClient.invalidateQueries("/tempat-pkl/list");
  //       resetForm();
  //       setIsOpen(false);
  //       return toast.success(response?.data?.msg, {
  //         position: "top-right",
  //         autoClose: 1000,
  //         hideProgressBar: false,
  //         closeOnClick: true,
  //         pauseOnHover: true,
  //         draggable: true,
  //         progress: undefined,
  //         theme: "colored",
  //       });
  //     } catch (err) {
  //       console.log(err);
  //       return toast.error("Ada Kesalahan", {
  //         position: "top-right",
  //         autoClose: 1000,
  //         hideProgressBar: false,
  //         closeOnClick: true,
  //         pauseOnHover: true,
  //         draggable: true,
  //         progress: undefined,
  //         theme: "colored",
  //       });
  //     }
  //   };

  const handleEvent = (event) => {
    console.log("ee", event);
    if (event.key === "x") {
      console.log("ok", event);
    }
  };

  console.log("data", data);
  return (
    <LayoutPage title={"List Tempat PKL"}>
      <ModalAlert
        open={showAlertDelete}
        setOpen={setShowAlertDelete}
        loading={deleteLoading}
        onConfirm={onConfirmDelete}
        title={"Apakah yakin akan menghapus Siswa terpilih?"}
      />
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
        <FilterSiswaPkl
          filter={filter}
          setFilter={setFilter}
          setVisible={setVisible}
        ></FilterSiswaPkl>
      </Sidebar>

      <div className="mt-5 space-y-5 px-4" onKeyPress={handleEvent}>
        <section className="grid grid-cols-6 gap-5">
          {/* <div className="col-span-5   lg:col-span-3 xl:col-span-3">
                        <Input
                            fluid
                            loading={false}
                            icon="search"
                            onChange={(e) => {
                                setKeyword(e.target.value);
                            }}
                            iconPosition="left"
                            placeholder="Search..."
                        />
                    </div> */}
          <div className="col-span-6 lg:col-span-1 xl:col-span-1">
            <Button
              type="button"
              color="teal"
              icon={<Icon name="add" />}
              onClick={() => navigate("tambah", { replace: true })}
              content="Tambah"
              size="medium"
              fluid
            />
          </div>

          {/* <div className="col-span-6 lg:col-span-1 xl:col-span-1 transform transition-all duration-300">
                        <UploadExcel />
                    </div> */}
          {/* <div className="col-span-6 lg:col-span-1 xl:col-span-1">
                        <Button
                            content={"Filter"}
                            type="button"
                            fluid
                            icon={() => <Icon name="filter" />}
                            size="medium"
                            color="blue"
                            onClick={() => {
                                setVisible(!visible);
                            }}
                        />
                    </div> */}
        </section>
        <section>
          <Table celled selectable>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>No</Table.HeaderCell>
                <Table.HeaderCell>Nama Perusahaan</Table.HeaderCell>
                <Table.HeaderCell>Nama Siswa</Table.HeaderCell>
                <Table.HeaderCell>Alamat</Table.HeaderCell>

                <Table.HeaderCell>Nomer Telepon</Table.HeaderCell>
                <Table.HeaderCell>Penangung Jawab Perusahaan</Table.HeaderCell>

                <Table.HeaderCell>Pengampu</Table.HeaderCell>
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
                    <Table.Cell>{value?.nama_perusahaan}</Table.Cell>
                    <Table.Cell>{value?.siswa?.nama_siswa}</Table.Cell>
                    <Table.Cell>{value?.alamat}</Table.Cell>

                    <Table.Cell>{value?.no_hp}</Table.Cell>
                    <Table.Cell>
                      {value?.penanggung_jawab_perusahaan}
                    </Table.Cell>

                    <Table.Cell>{value?.pembimbing?.nama_guru}</Table.Cell>
                    <Table.Cell>
                      <EditButton
                        onClick={() =>
                          navigate(`update/${value?.id}`, { replace: true })
                        }
                      />
                      <DeleteButton onClick={() => confirmDelete(value?.id)} />
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
            totalPages={data?.pagination?.totalItems}
          />
         
        </section>
      </div>
    </LayoutPage>
  );
}
