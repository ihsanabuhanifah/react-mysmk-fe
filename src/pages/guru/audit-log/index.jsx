import React from "react";
import { Table, Input, Label, Button, Modal, Message, Dropdown } from "semantic-ui-react";
import { useQuery } from "react-query";
import dayjs from "dayjs";
import LayoutPage from "../../../module/layoutPage";
import { TableLoading } from "../../../components";
import PaginationTable from "../../../components/PaginationTable";
import usePage from "../../../hook/usePage";
import useDebounce from "../../../hook/useDebounce";
import useList from "../../../hook/useList";
import { checkRole } from "../../../utils";
import { listAuditLog } from "../../../api/guru/auditLog";

const AKSI = {
  CREATE: { label: "Tambah", color: "green" },
  UPDATE: { label: "Ubah", color: "blue" },
  DELETE: { label: "Hapus", color: "red" },
  LOGIN: { label: "Login", color: "teal" },
  LOGIN_GAGAL: { label: "Login Gagal", color: "orange" },
  LOGOUT: { label: "Logout", color: "grey" },
};

const aksiOptions = [
  { key: "all", value: "", text: "Semua aksi" },
  ...Object.entries(AKSI).map(([value, a]) => ({ key: value, value, text: a.label })),
];

const statusColor = (code) => {
  if (!code) return undefined;
  if (code >= 500) return "red";
  if (code >= 400) return "orange";
  return "green";
};

// data disimpan sebagai string JSON (bisa terpotong) -> tampilkan rapi bila bisa di-parse
const formatData = (data) => {
  if (!data) return "-";
  try {
    return JSON.stringify(JSON.parse(data), null, 2);
  } catch (e) {
    return data;
  }
};

export default function AuditLog() {
  const { roles } = useList();
  const isAdmin = checkRole(roles, "Admin") || checkRole(roles, "Super Administrator");

  if (!isAdmin) {
    return (
      <LayoutPage title="Audit Log">
        <Message warning>Fitur ini hanya dapat diakses oleh Admin.</Message>
      </LayoutPage>
    );
  }
  return <AuditLogTable />;
}

function AuditLogTable() {
  const { page, pageSize, setPage, setPageSize } = usePage();
  const [keyword, setKeyword] = React.useState("");
  const debouncedKeyword = useDebounce(keyword, 500);
  const [action, setAction] = React.useState("");
  const [dari, setDari] = React.useState("");
  const [sampai, setSampai] = React.useState("");
  const [detail, setDetail] = React.useState(null); // row

  React.useEffect(() => {
    setPage(1);
  }, [debouncedKeyword, action, dari, sampai, setPage]);

  const params = {
    page,
    pageSize,
    keyword: debouncedKeyword || undefined,
    action: action || undefined,
    dari: dari || undefined,
    sampai: sampai || undefined,
  };

  const { data, isLoading } = useQuery(
    ["audit-log", params],
    () => listAuditLog(params),
    { refetchOnWindowFocus: false, keepPreviousData: true, select: (r) => r.data }
  );

  const rows = data?.data?.rows || [];
  const adaFilter = keyword || action || dari || sampai;
  const resetFilter = () => {
    setKeyword("");
    setAction("");
    setDari("");
    setSampai("");
  };

  return (
    <LayoutPage title="Audit Log">
      <DetailModal row={detail} onClose={() => setDetail(null)} />

      <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
        <div className="xl:col-span-2">
          <Input
            fluid
            icon="search"
            iconPosition="left"
            placeholder="Cari nama atau email user..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
        <Dropdown
          selection
          fluid
          options={aksiOptions}
          value={action}
          onChange={(e, { value }) => setAction(value)}
          placeholder="Aksi"
        />
        <Input
          fluid
          type="date"
          label="Dari"
          value={dari}
          max={sampai || undefined}
          onChange={(e) => setDari(e.target.value)}
        />
        <Input
          fluid
          type="date"
          label="Sampai"
          value={sampai}
          min={dari || undefined}
          onChange={(e) => setSampai(e.target.value)}
        />
      </div>
      {adaFilter && (
        <div className="mb-3">
          <Button size="mini" basic icon="close" content="Reset filter" onClick={resetFilter} />
        </div>
      )}

      <div className="overflow-x-auto">
        <Table celled selectable unstackable compact>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell collapsing>No</Table.HeaderCell>
              <Table.HeaderCell>Waktu</Table.HeaderCell>
              <Table.HeaderCell>User</Table.HeaderCell>
              <Table.HeaderCell>Role</Table.HeaderCell>
              <Table.HeaderCell>Aksi</Table.HeaderCell>
              <Table.HeaderCell>Path</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell>IP</Table.HeaderCell>
              <Table.HeaderCell collapsing>Data</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <TableLoading
              count={9}
              isLoading={isLoading}
              data={rows}
              messageEmpty="Belum ada aktivitas pada filter ini"
            >
              {rows.map((r, i) => {
                const aksi = AKSI[r.action] || { label: r.action };
                return (
                  <Table.Row key={r.id}>
                    <Table.Cell>{(page - 1) * pageSize + i + 1}</Table.Cell>
                    <Table.Cell className="whitespace-nowrap">
                      {dayjs(r.createdAt || r.created_at).format("DD/MM/YYYY HH:mm:ss")}
                    </Table.Cell>
                    <Table.Cell>
                      <div className="font-medium">{r.user_name || "-"}</div>
                      <div className="text-xs text-gray-500">{r.user_email || "-"}</div>
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap">{r.role || "-"}</Table.Cell>
                    <Table.Cell>
                      <Label size="tiny" color={aksi.color}>
                        {aksi.label}
                      </Label>
                    </Table.Cell>
                    <Table.Cell>
                      <div className="break-all font-mono text-xs">
                        <span className="mr-1 font-semibold text-gray-500">{r.method}</span>
                        {r.path || "-"}
                      </div>
                      {r.target_id && (
                        <div className="text-xs text-gray-500">ID: {r.target_id}</div>
                      )}
                    </Table.Cell>
                    <Table.Cell>
                      {r.status_code ? (
                        <Label size="tiny" basic color={statusColor(r.status_code)}>
                          {r.status_code}
                        </Label>
                      ) : (
                        "-"
                      )}
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap font-mono text-xs">
                      {r.ip || "-"}
                    </Table.Cell>
                    <Table.Cell>
                      <Button
                        size="mini"
                        basic
                        icon="eye"
                        title="Lihat detail"
                        onClick={() => setDetail(r)}
                      />
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </TableLoading>
          </Table.Body>
        </Table>
      </div>

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

/* ---------------- Modal detail ---------------- */
function DetailModal({ row, onClose }) {
  if (!row) return null;
  const info = [
    ["Waktu", dayjs(row.createdAt || row.created_at).format("DD/MM/YYYY HH:mm:ss")],
    ["User", `${row.user_name || "-"} (${row.user_email || "-"})`],
    ["Role", row.role || "-"],
    ["Aksi", AKSI[row.action]?.label || row.action],
    ["Endpoint", `${row.method || ""} ${row.path || "-"}`],
    ["Target ID", row.target_id || "-"],
    ["Status", row.status_code || "-"],
    ["IP", row.ip || "-"],
    ["User Agent", row.user_agent || "-"],
  ];
  return (
    <Modal open onClose={onClose} size="small" closeIcon>
      <Modal.Header>Detail Aktivitas</Modal.Header>
      <Modal.Content scrolling>
        <table className="mb-4 w-full text-sm">
          <tbody>
            {info.map(([k, v]) => (
              <tr key={k} className="border-b border-gray-100">
                <td className="w-28 py-1 pr-3 align-top text-gray-500">{k}</td>
                <td className="break-all py-1">{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-400">
          Data
        </div>
        <pre className="max-h-96 overflow-auto whitespace-pre-wrap break-all rounded bg-gray-50 p-3 text-xs">
          {formatData(row.data)}
        </pre>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={onClose}>Tutup</Button>
      </Modal.Actions>
    </Modal>
  );
}
