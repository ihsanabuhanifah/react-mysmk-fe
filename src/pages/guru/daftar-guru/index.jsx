import React from "react";
import {
  Table,
  Input,
  Label,
  Button,
  Checkbox,
  Modal,
  Message,
  Form,
} from "semantic-ui-react";
import { useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import LayoutPage from "../../../module/layoutPage";
import { TableLoading, EditButton, AksiButton } from "../../../components";
import PaginationTable from "../../../components/PaginationTable";
import usePage from "../../../hook/usePage";
import useDebounce from "../../../hook/useDebounce";
import useList from "../../../hook/useList";
import { checkRole } from "../../../utils";
import {
  listDaftarGuru,
  ubahStatusGuru,
  aturRoleGuru,
  editProfilGuru,
} from "../../../api/guru/daftarGuru";

const ROLE_COLOR = {
  Admin: "red",
  "Super Administrator": "red",
  "Kepala Sekolah": "purple",
  Guru: "teal",
  Musyrif: "green",
  "Wali Kelas": "blue",
  Kesantrian: "olive",
  Kurikulum: "violet",
  Keuangan: "orange",
};

const errMsg = (err, fallback) => err?.response?.data?.msg || fallback;

export default function DaftarGuru() {
  const queryClient = useQueryClient();
  const { roles } = useList();
  const isAdmin = checkRole(roles, "Admin") || checkRole(roles, "Super Administrator");

  const { page, pageSize, setPage, setPageSize } = usePage();
  const [keyword, setKeyword] = React.useState("");
  const debouncedKeyword = useDebounce(keyword, 500);
  const [roleId, setRoleId] = React.useState(null);
  const [status, setStatus] = React.useState("active");

  const [selected, setSelected] = React.useState([]); // teacher id
  const [statusTarget, setStatusTarget] = React.useState(null); // { rows, status }
  const [roleTarget, setRoleTarget] = React.useState(null); // row
  const [profilTarget, setProfilTarget] = React.useState(null); // row

  React.useEffect(() => {
    setPage(1);
    setSelected([]);
  }, [debouncedKeyword, roleId, status, setPage]);
  React.useEffect(() => setSelected([]), [page, pageSize]);

  const params = {
    page,
    pageSize,
    keyword: debouncedKeyword || undefined,
    role_id: roleId || undefined,
    status: status || undefined,
  };

  const { data, isLoading } = useQuery(
    ["daftar-guru", params],
    () => listDaftarGuru(params),
    { refetchOnWindowFocus: false, keepPreviousData: true, select: (r) => r.data }
  );

  const rows = data?.data?.rows || [];
  const ringkasanRole = data?.ringkasan?.role || [];
  const ringkasanStatus = data?.ringkasan?.status || [];
  const roleStaf = data?.roleStaf || [];
  const jumlahStatus = (s) =>
    Number(ringkasanStatus.find((x) => x.status === s)?.jumlah || 0);
  const totalGuru = ringkasanStatus.reduce((a, x) => a + Number(x.jumlah), 0);

  const refresh = () => queryClient.invalidateQueries("daftar-guru");

  const selectedRows = rows.filter((r) => selected.includes(r.id));
  const allSelected = rows.length > 0 && rows.every((r) => selected.includes(r.id));
  const toggleAll = () => setSelected(allSelected ? [] : rows.map((r) => r.id));
  const toggleOne = (id) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const kolom = isAdmin ? 7 : 5;

  return (
    <LayoutPage title="Daftar Guru">
      <StatusModal
        target={statusTarget}
        onClose={() => setStatusTarget(null)}
        onDone={() => {
          setStatusTarget(null);
          setSelected([]);
          refresh();
        }}
      />
      <RoleModal
        guru={roleTarget}
        roleStaf={roleStaf}
        onClose={() => setRoleTarget(null)}
        onDone={() => {
          setRoleTarget(null);
          refresh();
        }}
      />
      <ProfilModal
        guru={profilTarget}
        onClose={() => setProfilTarget(null)}
        onDone={() => {
          setProfilTarget(null);
          refresh();
        }}
      />

      {/* Status */}
      <div className="mb-3 flex flex-wrap gap-2">
        <Chip active={status === "active"} label="Aktif" jumlah={jumlahStatus("active")} onClick={() => setStatus("active")} />
        <Chip active={status === "nonactive"} label="Tidak Aktif" jumlah={jumlahStatus("nonactive")} onClick={() => setStatus("nonactive")} />
        <Chip active={!status} label="Semua" jumlah={totalGuru} onClick={() => setStatus(null)} />
      </div>

      {/* Role */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="mr-1 text-xs font-semibold uppercase tracking-wider text-gray-400">
          Role
        </span>
        <Chip small active={!roleId} label="Semua" onClick={() => setRoleId(null)} />
        {ringkasanRole.map((r) => (
          <Chip
            small
            key={r.id}
            active={Number(roleId) === Number(r.id)}
            label={r.role_name}
            jumlah={r.jumlah}
            onClick={() => setRoleId(r.id)}
          />
        ))}
      </div>

      <div className="max-w-md">
        <Input
          fluid
          icon="search"
          iconPosition="left"
          placeholder="Cari nama, email, atau no HP..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </div>

      {isAdmin && selected.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-orange-200 bg-orange-50 px-4 py-3">
          <span className="text-sm text-gray-700">
            <b>{selected.length}</b> guru dipilih
          </span>
          <div className="flex flex-wrap gap-2">
            <Button size="small" basic onClick={() => setSelected([])}>
              Batal Pilih
            </Button>
            {selectedRows.some((r) => r.status !== "active") && (
              <Button
                size="small"
                color="green"
                icon="check"
                content={`Aktifkan (${selectedRows.filter((r) => r.status !== "active").length})`}
                onClick={() =>
                  setStatusTarget({
                    status: "active",
                    rows: selectedRows.filter((r) => r.status !== "active"),
                  })
                }
              />
            )}
            {selectedRows.some((r) => r.status === "active") && (
              <Button
                size="small"
                color="orange"
                icon="user cancel"
                content={`Nonaktifkan (${selectedRows.filter((r) => r.status === "active").length})`}
                onClick={() =>
                  setStatusTarget({
                    status: "nonactive",
                    rows: selectedRows.filter((r) => r.status === "active"),
                  })
                }
              />
            )}
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
                  indeterminate={selected.length > 0 && !allSelected}
                  onChange={toggleAll}
                  disabled={rows.length === 0}
                />
              </Table.HeaderCell>
            )}
            <Table.HeaderCell collapsing>No</Table.HeaderCell>
            <Table.HeaderCell>Nama</Table.HeaderCell>
            <Table.HeaderCell>No HP</Table.HeaderCell>
            <Table.HeaderCell>Role</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            {isAdmin && <Table.HeaderCell collapsing>Aksi</Table.HeaderCell>}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <TableLoading
            count={kolom}
            isLoading={isLoading}
            data={rows}
            messageEmpty="Tidak ada guru pada filter ini"
          >
            {rows.map((r, i) => (
              <Table.Row key={r.id} active={selected.includes(r.id)}>
                {isAdmin && (
                  <Table.Cell>
                    <Checkbox checked={selected.includes(r.id)} onChange={() => toggleOne(r.id)} />
                  </Table.Cell>
                )}
                <Table.Cell>{(page - 1) * pageSize + i + 1}</Table.Cell>
                <Table.Cell>
                  <div className="font-medium">{r.nama_guru}</div>
                  <div className="text-xs text-gray-500">{r.email || "-"}</div>
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap">{r.no_hp || "-"}</Table.Cell>
                <Table.Cell>
                  <div className="flex flex-wrap gap-1">
                    {r.roles.length === 0
                      ? "-"
                      : r.roles.map((role) => (
                          <Label key={role} size="tiny" basic color={ROLE_COLOR[role]}>
                            {role}
                          </Label>
                        ))}
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex flex-wrap gap-1">
                    {r.status === "active" ? (
                      <Label size="tiny" color="green">Aktif</Label>
                    ) : (
                      <Label size="tiny">Tidak Aktif</Label>
                    )}
                    {r.status_akun === "diblokir" && (
                      <Label size="tiny" color="red" basic>Login diblokir</Label>
                    )}
                  </div>
                </Table.Cell>
                {isAdmin && (
                  <Table.Cell>
                    <div className="flex items-center gap-1 whitespace-nowrap">
                      <EditButton title="Edit profil" onClick={() => setProfilTarget(r)} />
                      <AksiButton
                        color="blue"
                        icon="key"
                        title="Atur role"
                        onClick={() => setRoleTarget(r)}
                      />
                      {r.status === "active" ? (
                        <AksiButton
                          color="orange"
                          icon="user cancel"
                          title="Nonaktifkan"
                          onClick={() => setStatusTarget({ status: "nonactive", rows: [r] })}
                        />
                      ) : (
                        <AksiButton
                          color="green"
                          icon="check"
                          title="Aktifkan"
                          onClick={() => setStatusTarget({ status: "active", rows: [r] })}
                        />
                      )}
                    </div>
                  </Table.Cell>
                )}
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

/* ---------------- Modal nonaktif / aktifkan ---------------- */
function StatusModal({ target, onClose, onDone }) {
  const [blokir, setBlokir] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  React.useEffect(() => setBlokir(true), [target]);
  if (!target) return null;

  const nonaktif = target.status === "nonactive";
  const punyaJadwal = target.rows.filter((r) => r.jadwal_aktif > 0 || r.halaqoh > 0);

  const submit = async () => {
    setLoading(true);
    try {
      const res = await ubahStatusGuru({
        teacher_ids: target.rows.map((r) => r.id),
        status: target.status,
        blokir_login: nonaktif ? blokir : false,
      });
      toast.success(res.data?.msg || "Berhasil");
      onDone();
    } catch (err) {
      toast.error(errMsg(err, "Gagal mengubah status guru"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal size="tiny" open onClose={() => !loading && onClose()}>
      <Modal.Header>{nonaktif ? "Nonaktifkan Guru" : "Aktifkan Guru"}</Modal.Header>
      <Modal.Content scrolling>
        <p>
          {nonaktif ? "Nonaktifkan" : "Aktifkan kembali"} <b>{target.rows.length} guru</b> berikut?
        </p>
        <ul className="mt-2 list-disc pl-5">
          {target.rows.map((r) => (
            <li key={r.id}>{r.nama_guru}</li>
          ))}
        </ul>

        {nonaktif && (
          <>
            <p className="mt-3 text-sm text-gray-600">
              Guru nonaktif tidak lagi dibuatkan absensi guru harian.
            </p>
            {punyaJadwal.length > 0 && (
              <Message warning size="small">
                <Message.Header>Masih punya jadwal / halaqoh</Message.Header>
                <ul className="mt-1 list-disc pl-5">
                  {punyaJadwal.map((r) => (
                    <li key={r.id}>
                      {r.nama_guru}: {r.jadwal_aktif} jadwal aktif
                      {r.halaqoh > 0 ? `, ${r.halaqoh} halaqoh` : ""}
                    </li>
                  ))}
                </ul>
                <p className="mt-1">
                  Absensi KBM tetap dibuat dari jadwal. Pindahkan jadwalnya ke guru lain.
                </p>
              </Message>
            )}
            <div className="mt-3">
              <Checkbox
                label="Blokir login akun guru (tidak bisa masuk aplikasi)"
                checked={blokir}
                onChange={() => setBlokir(!blokir)}
              />
            </div>
          </>
        )}
        {!nonaktif && (
          <p className="mt-3 text-sm text-gray-600">
            Jika login akun sebelumnya diblokir, blokir akan dibuka.
          </p>
        )}
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={onClose} disabled={loading}>
          Batal
        </Button>
        <Button color={nonaktif ? "orange" : "green"} loading={loading} onClick={submit}>
          {nonaktif ? "Ya, Nonaktifkan" : "Ya, Aktifkan"}
        </Button>
      </Modal.Actions>
    </Modal>
  );
}

/* ---------------- Modal atur role ---------------- */
function RoleModal({ guru, roleStaf, onClose, onDone }) {
  const [pilih, setPilih] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  React.useEffect(() => setPilih(guru?.role_ids || []), [guru]);
  if (!guru) return null;

  const staf = roleStaf.map((r) => r.id);
  const toggle = (id) =>
    setPilih((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  const pilihStaf = pilih.filter((id) => staf.includes(id));

  const submit = async () => {
    setLoading(true);
    try {
      const res = await aturRoleGuru(guru.id, pilihStaf);
      toast.success(res.data?.msg || "Role diperbarui");
      onDone();
    } catch (err) {
      toast.error(errMsg(err, "Gagal memperbarui role"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal size="tiny" open onClose={() => !loading && onClose()}>
      <Modal.Header>
        Atur Role
        <div className="mt-1 text-sm font-normal text-gray-500">{guru.nama_guru}</div>
      </Modal.Header>
      <Modal.Content>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {roleStaf.map((r) => (
            <label
              key={r.id}
              className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 ${
                pilih.includes(r.id) ? "border-[#00BFBF] bg-teal-50" : "border-gray-200"
              }`}
            >
              <Checkbox checked={pilih.includes(r.id)} onChange={() => toggle(r.id)} />
              <span>{r.role_name}</span>
            </label>
          ))}
        </div>
        <p className="mt-3 text-xs text-gray-500">
          Perubahan role berlaku saat guru login ulang.
        </p>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={onClose} disabled={loading}>
          Batal
        </Button>
        <Button color="teal" loading={loading} disabled={pilihStaf.length === 0} onClick={submit}>
          Simpan Role
        </Button>
      </Modal.Actions>
    </Modal>
  );
}

/* ---------------- Modal edit profil ---------------- */
function ProfilModal({ guru, onClose, onDone }) {
  const [form, setForm] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  React.useEffect(() => {
    setError("");
    setForm({
      nama_guru: guru?.nama_guru?.trim() || "",
      email: guru?.email || "",
      no_hp: guru?.no_hp || "",
      keterangan: guru?.keterangan || "",
    });
  }, [guru]);
  if (!guru) return null;

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await editProfilGuru(guru.id, form);
      toast.success(res.data?.msg || "Profil diperbarui");
      onDone();
    } catch (err) {
      setError(errMsg(err, "Gagal memperbarui profil"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal size="tiny" open onClose={() => !loading && onClose()}>
      <Modal.Header>Edit Profil Guru</Modal.Header>
      <Modal.Content>
        <Form error={!!error}>
          <Form.Input required label="Nama" value={form.nama_guru} onChange={set("nama_guru")} />
          <Form.Input required label="Email (untuk login)" value={form.email} onChange={set("email")} />
          <Form.Input label="No HP" placeholder="08xxxxxxxxxx" value={form.no_hp} onChange={set("no_hp")} />
          <Form.TextArea label="Keterangan" rows={2} value={form.keterangan} onChange={set("keterangan")} />
          <Message error content={error} />
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={onClose} disabled={loading}>
          Batal
        </Button>
        <Button color="teal" loading={loading} onClick={submit}>
          Simpan
        </Button>
      </Modal.Actions>
    </Modal>
  );
}

function Chip({ active, label, jumlah, onClick, small }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 rounded-full border transition ${
        small ? "px-3 py-1 text-xs" : "px-4 py-1.5 text-sm"
      } ${
        active
          ? "border-[#00BFBF] bg-[#00BFBF] text-white"
          : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
      }`}
    >
      {label}
      {jumlah !== undefined && (
        <span
          className={`rounded-full px-2 text-xs font-semibold ${
            active ? "bg-white text-[#00A0A0]" : "bg-gray-100 text-gray-600"
          }`}
        >
          {jumlah}
        </span>
      )}
    </button>
  );
}
