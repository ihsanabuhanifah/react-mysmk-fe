import React from "react";
import { Table, Input } from "semantic-ui-react";
import { useQuery } from "react-query";
import LayoutPage from "../../../module/layoutPage";
import { TableLoading, AksiButton } from "../../../components";
import PaginationTable from "../../../components/PaginationTable";
import usePage from "../../../hook/usePage";
import useDebounce from "../../../hook/useDebounce";
import { listAlumni } from "../../../api/guru/siswa";
import RiwayatKelasModal from "../daftar-siswa/RiwayatKelasModal";

export default function DaftarAlumni() {
  const { page, pageSize, setPage, setPageSize } = usePage();
  const [keyword, setKeyword] = React.useState("");
  const debouncedKeyword = useDebounce(keyword, 500);
  const [taId, setTaId] = React.useState(null);
  const [riwayatId, setRiwayatId] = React.useState(null);

  React.useEffect(() => {
    setPage(1);
  }, [debouncedKeyword, taId, setPage]);

  const params = {
    page,
    pageSize,
    keyword: debouncedKeyword || undefined,
    ta_id: taId || undefined,
  };

  const { data, isLoading } = useQuery(
    ["siswa/alumni", params],
    () => listAlumni(params),
    { refetchOnWindowFocus: false, keepPreviousData: true, select: (r) => r.data }
  );

  const rows = data?.data?.rows || [];
  const ringkasan = data?.ringkasan || [];
  const totalSemua = ringkasan.reduce((a, r) => a + Number(r.jumlah), 0);

  return (
    <LayoutPage title="Daftar Alumni">
      <RiwayatKelasModal studentId={riwayatId} onClose={() => setRiwayatId(null)} />

      {/* Filter tahun lulus */}
      <div className="mb-4 flex flex-wrap gap-2">
        <TahunChip
          active={!taId}
          label="Semua"
          jumlah={totalSemua}
          onClick={() => setTaId(null)}
        />
        {ringkasan.map((r) => (
          <TahunChip
            key={r.ta_id}
            active={Number(taId) === Number(r.ta_id)}
            label={`Lulus ${r.nama_tahun_ajaran || "-"}`}
            jumlah={r.jumlah}
            onClick={() => setTaId(r.ta_id)}
          />
        ))}
      </div>

      <div className="max-w-md">
        <Input
          fluid
          icon="search"
          iconPosition="left"
          placeholder="Cari nama, NIS, atau NISN..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </div>

      <Table celled selectable unstackable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell collapsing>No</Table.HeaderCell>
            <Table.HeaderCell>Nama</Table.HeaderCell>
            <Table.HeaderCell>NIS</Table.HeaderCell>
            <Table.HeaderCell>NISN</Table.HeaderCell>
            <Table.HeaderCell>Angkatan</Table.HeaderCell>
            <Table.HeaderCell>Tahun Lulus</Table.HeaderCell>
            <Table.HeaderCell>Email</Table.HeaderCell>
            <Table.HeaderCell collapsing>Aksi</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <TableLoading
            count={8}
            isLoading={isLoading}
            data={rows}
            messageEmpty="Tidak ada alumni pada filter ini"
          >
            {rows.map((r, i) => (
              <Table.Row key={r.id}>
                <Table.Cell>{(page - 1) * pageSize + i + 1}</Table.Cell>
                <Table.Cell className="font-medium">{r.siswa?.nama_siswa}</Table.Cell>
                <Table.Cell>{r.siswa?.nis || "-"}</Table.Cell>
                <Table.Cell>{r.siswa?.nisn || "-"}</Table.Cell>
                <Table.Cell>{r.siswa?.angkatan || "-"}</Table.Cell>
                <Table.Cell>{r.tahun_ajaran?.nama_tahun_ajaran || "-"}</Table.Cell>
                <Table.Cell>{r.siswa?.user?.email || "-"}</Table.Cell>
                <Table.Cell>
                  <AksiButton
                    color="grey"
                    icon="history"
                    title="Riwayat Kelas"
                    onClick={() => setRiwayatId(r.siswa?.id)}
                  />
                </Table.Cell>
              </Table.Row>
            ))}
          </TableLoading>
        </Table.Body>
      </Table>

      <PaginationTable
        page={page}
        pageSize={pageSize}
        setPage={setPage}
        setPageSize={setPageSize}
        totalPages={data?.data?.count}
      />
    </LayoutPage>
  );
}

function TahunChip({ active, label, jumlah, onClick }) {
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
