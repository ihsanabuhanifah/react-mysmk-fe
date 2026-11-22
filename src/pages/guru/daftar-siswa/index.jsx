/* eslint-disable no-unused-vars */
import React from "react";
import {
  Table,
  Button,
  Input,
  Sidebar,
  Menu,
  Icon,
  Checkbox,
  Modal,
} from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";

import { EditButton, TableLoading, AksiButton } from "../../../components";
import LayoutPage from "../../../module/layoutPage";
import { formatDate } from "../../../utils";
import PaginationTable from "../../../components/PaginationTable";
import FilterSiswa from "./filter";
import { encodeURlFormat, checkRole } from "../../../utils";
import usePage from "../../../hook/usePage";
import { downloadRekapAbsensi } from "../../../api/guru/absensi";
import useDownload from "../../../hook/useDownload";
import {
  listSiswa,
  nonaktifkanSiswaKelasHandle,
  getRingkasanKelas,
  listSiswaTanpaKelas,
} from "../../../api/guru/siswa";
import useDebounce from "../../../hook/useDebounce";
import useList from "../../../hook/useList";
import RiwayatKelasModal from "./RiwayatKelasModal";

export default function DaftarSiswa() {
  const [riwayatId, setRiwayatId] = React.useState(null);
  let [visible, setVisible] = React.useState(false);
  let navigate = useNavigate();
  const { roles } = useList();
  const isAdmin =
    checkRole(roles, "Admin") || checkRole(roles, "Super Administrator");
  let [keyword, setKeyword] = React.useState("");
  let debouncedKeyword = useDebounce(keyword, 500);
  const queryClient = useQueryClient();
  let { page, pageSize, setPage, setPageSize } = usePage();
  const [filter, setFilter] = React.useState({});
  const [kelasId, setKelasId] = React.useState(null);

  const { data: ringkasanKelas = [] } = useQuery(
    ["siswa/kelas/ringkasan"],
    getRingkasanKelas,
    {
      refetchOnWindowFocus: false,
      select: (r) => (r.data?.data || []).filter((k) => k.jumlah_siswa > 0),
    },
  );
  const totalAktif = ringkasanKelas.reduce((a, k) => a + Number(k.jumlah_siswa), 0);

  const { data: jumlahSiswaBaru = 0 } = useQuery(
    ["siswa/tanpa-kelas"],
    listSiswaTanpaKelas,
    {
      refetchOnWindowFocus: false,
      enabled: isAdmin,
      select: (r) => (r.data?.data || []).length,
    },
  );

  // id baris rombel (kelas_students) yang dicentang
  const [selected, setSelected] = React.useState([]);
  // daftar baris yang akan dinonaktifkan (untuk konfirmasi)
  const [toDeactivate, setToDeactivate] = React.useState([]);
  const [deactivating, setDeactivating] = React.useState(false);

  const params = {
    page,
    pageSize,
    keyword: debouncedKeyword,
    status: 1,
    kelas_id: kelasId || undefined,
    ...filter,
    nama_siswa: encodeURlFormat(filter?.nama_siswa?.label),
    nama_kelas: encodeURlFormat(filter?.nama_kelas),
    nama_guru: encodeURlFormat(filter?.nama_guru),
    nama_mapel: encodeURlFormat(filter?.nama_mapel),
    tahun_ajaran: encodeURlFormat(filter?.tahun_ajaran),
    status_kehadiran: encodeURlFormat(filter?.status_kehadiran),
  };
  let { data, isLoading } = useQuery(
    //query key
    ["siswa/list", params],
    //axios function,triggered when page/pageSize change
    () => listSiswa(params),
    //configuration
    {
      refetchOnWindowFocus: false,
      select: (response) => {
        return response.data;
      },
    },
  );

  const rows = data?.data?.rows || [];

  // Reset pilihan saat halaman / filter / pencarian berubah
  React.useEffect(() => {
    setSelected([]);
  }, [page, pageSize, debouncedKeyword, filter, kelasId]);

  // Kembali ke halaman 1 saat filter kelas / pencarian berubah
  React.useEffect(() => {
    setPage(1);
  }, [kelasId, debouncedKeyword, setPage]);

  const allSelected = rows.length > 0 && rows.every((r) => selected.includes(r.id));
  const someSelected = selected.length > 0 && !allSelected;
  const toggleAll = () =>
    setSelected(allSelected ? [] : rows.map((r) => r.id));
  const toggleOne = (id) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const confirmDeactivate = (ids) =>
    setToDeactivate(rows.filter((r) => ids.includes(r.id)));

  const onConfirmDeactivate = async () => {
    setDeactivating(true);
    try {
      const res = await nonaktifkanSiswaKelasHandle(toDeactivate.map((r) => r.id));
      toast.success(res.data?.msg || "Berhasil dinonaktifkan");
      setSelected([]);
      setToDeactivate([]);
      queryClient.invalidateQueries("siswa/list");
      queryClient.invalidateQueries("siswa/riwayat-kelas");
      queryClient.invalidateQueries("siswa/kelas/ringkasan");
    } catch (err) {
      toast.error(err?.response?.data?.msg || "Gagal menonaktifkan siswa");
    } finally {
      setDeactivating(false);
    }
  };

  let { isLoadingDownload, handleDownload } = useDownload({
    filename: "rekap-absensi.xlsx",
    onDownload: () => {
      return downloadRekapAbsensi(params);
    },
  });

  return (
    <LayoutPage
      title={"Daftar Siswa"}
      visible={visible}
      setVisible={setVisible}
    >
      <RiwayatKelasModal studentId={riwayatId} onClose={() => setRiwayatId(null)} />

      <Modal
        size="tiny"
        open={toDeactivate.length > 0}
        onClose={() => !deactivating && setToDeactivate([])}
      >
        <Modal.Header>Nonaktifkan dari Kelas</Modal.Header>
        <Modal.Content scrolling>
          <p>
            Nonaktifkan <b>{toDeactivate.length} siswa</b> berikut dari kelasnya?
          </p>
          <ul className="mt-2 list-disc pl-5">
            {toDeactivate.map((r) => (
              <li key={r.id}>
                {r.siswa?.nama_siswa}{" "}
                <span className="text-gray-500">({r.kelas?.nama_kelas})</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm text-gray-500">
            Data tidak dihapus. Kelas ini akan tersimpan sebagai riwayat, dan siswa
            tidak lagi muncul di absensi maupun ujian kelas tersebut.
          </p>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => setToDeactivate([])} disabled={deactivating}>
            Batal
          </Button>
          <Button color="orange" loading={deactivating} onClick={onConfirmDeactivate}>
            Ya, Nonaktifkan
          </Button>
        </Modal.Actions>
      </Modal>

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
        <FilterSiswa
          filter={filter}
          setFilter={setFilter}
          setVisible={setVisible}
        />
      </Sidebar>
      <section className="pb-10">
        {/* Filter kelas (seperti filter tahun lulus di Daftar Alumni) */}
        <div className="mb-4 flex flex-wrap gap-2">
          <FilterChip
            active={!kelasId}
            label="Semua Kelas"
            jumlah={totalAktif}
            onClick={() => setKelasId(null)}
          />
          {ringkasanKelas.map((k) => (
            <FilterChip
              key={k.id}
              active={Number(kelasId) === Number(k.id)}
              label={k.nama_kelas}
              jumlah={k.jumlah_siswa}
              onClick={() => setKelasId(k.id)}
            />
          ))}
        </div>

        <section className="grid grid-cols-6 gap-5">
          <div className="col-span-6 lg:col-span-2 xl:col-span-2">
            <Input
              fluid
              loading={false}
              icon="search"
              onChange={(e) => {
                setKeyword(e.target.value);
              }}
              iconPosition="left"
              placeholder="Cari nama siswa..."
            />
          </div>
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
          <div className="col-span-6 lg:col-span-1 xl:col-span-1">
            <Button
              content={"Download"}
              type="button"
              fluid
              icon={() => <Icon name="download" />}
              loading={isLoadingDownload}
              size="medium"
              color="linkedin"
              onClick={() => {
                handleDownload(params);
              }}
            />
          </div>
          <div className="col-span-6 lg:col-span-1 xl:col-span-1">
            {isAdmin && (
              <Button
                content={`Siswa Baru${jumlahSiswaBaru ? ` (${jumlahSiswaBaru})` : ""}`}
                type="button"
                fluid
                icon={() => <Icon name="user plus" />}
                size="medium"
                color="orange"
                title="Masukkan siswa yang belum punya kelas"
                onClick={() => navigate("pindah-kelas?asal=baru")}
              />
            )}
          </div>
          <div className="col-span-6 lg:col-span-1 xl:col-span-1">
            {isAdmin && (
              <Button
                content={"Pindah Kelas"}
                type="button"
                fluid
                icon={() => <Icon name="exchange" />}
                size="medium"
                color="green"
                onClick={() => navigate("pindah-kelas")}
              />
            )}
          </div>
        </section>

        {isAdmin && selected.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-orange-200 bg-orange-50 px-4 py-3">
            <span className="text-sm text-gray-700">
              <b>{selected.length}</b> siswa dipilih
            </span>
            <div className="flex gap-2">
              <Button size="small" basic onClick={() => setSelected([])}>
                Batal Pilih
              </Button>
              <Button
                size="small"
                color="orange"
                icon="user cancel"
                content={`Nonaktifkan (${selected.length})`}
                onClick={() => confirmDeactivate(selected)}
              />
            </div>
          </div>
        )}

        <Table celled selectable unstackable>
          <Table.Header>
            <Table.Row>
              {isAdmin && (
                <Table.HeaderCell collapsing>
                  <Checkbox
                    checked={allSelected}
                    indeterminate={someSelected}
                    onChange={toggleAll}
                    disabled={rows.length === 0}
                  />
                </Table.HeaderCell>
              )}
              <Table.HeaderCell collapsing>No</Table.HeaderCell>
              <Table.HeaderCell>Nama</Table.HeaderCell>
              <Table.HeaderCell>NIS</Table.HeaderCell>
              <Table.HeaderCell>NISN</Table.HeaderCell>
              <Table.HeaderCell>Angkatan</Table.HeaderCell>
              <Table.HeaderCell>Kelas</Table.HeaderCell>
              <Table.HeaderCell>Tahun Ajaran</Table.HeaderCell>
              <Table.HeaderCell collapsing>Aksi</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <TableLoading
              count={isAdmin ? 9 : 8}
              isLoading={isLoading}
              data={rows}
              messageEmpty="Tidak ada siswa pada filter ini"
            >
              {rows.map((value, index) => (
                <Table.Row key={value?.id} active={selected.includes(value?.id)}>
                  {isAdmin && (
                    <Table.Cell>
                      <Checkbox
                        checked={selected.includes(value?.id)}
                        onChange={() => toggleOne(value?.id)}
                      />
                    </Table.Cell>
                  )}
                  <Table.Cell>{(page - 1) * pageSize + index + 1}</Table.Cell>
                  <Table.Cell>
                    <div className="font-medium">{value?.siswa?.nama_siswa}</div>
                    <div className="text-xs text-gray-500">
                      {value?.siswa?.user?.email || "-"}
                    </div>
                  </Table.Cell>
                  <Table.Cell>{value?.siswa?.nis || "-"}</Table.Cell>
                  <Table.Cell>{value?.siswa?.nisn || "-"}</Table.Cell>
                  <Table.Cell>{value?.siswa?.angkatan || "-"}</Table.Cell>
                  <Table.Cell className="whitespace-nowrap">
                    {value?.kelas?.nama_kelas}
                  </Table.Cell>
                  <Table.Cell className="whitespace-nowrap">
                    {value?.tahun_ajaran?.nama_tahun_ajaran}
                    <span className="text-gray-400"> · smt {value?.semester}</span>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex items-center gap-1 whitespace-nowrap">
                      <EditButton
                        onClick={() =>
                          window.open(
                            `daftar-siswa/update-siswa/${value?.siswa?.id}`,
                          )
                        }
                      />
                      <AksiButton
                        color="grey"
                        icon="history"
                        title="Riwayat Kelas"
                        onClick={() => setRiwayatId(value?.siswa?.id)}
                      />
                      {isAdmin && (
                        <AksiButton
                          color="orange"
                          icon="user cancel"
                          title="Nonaktifkan dari kelas"
                          onClick={() => confirmDeactivate([value?.id])}
                        />
                      )}
                    </div>
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
      </section>
    </LayoutPage>
  );
}

function FilterChip({ active, label, jumlah, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm transition ${
        active
          ? "border-[#00BFBF] bg-[#00BFBF] text-white"
          : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
      }`}
    >
      {label}
      <span
        className={`rounded-full px-2 text-xs font-semibold ${
          active ? "bg-white text-[#00A0A0]" : "bg-gray-100 text-gray-600"
        }`}
      >
        {jumlah}
      </span>
    </button>
  );
}
