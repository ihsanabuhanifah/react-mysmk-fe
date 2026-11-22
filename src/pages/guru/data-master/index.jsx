import React from "react";
import { Table, Input, Button, Label, Modal, Form, Message, Dropdown } from "semantic-ui-react";
import { useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import {
  MdCalendarMonth,
  MdClass,
  MdMenuBook,
  MdAdminPanelSettings,
  MdLock,
} from "react-icons/md";
import LayoutPage from "../../../module/layoutPage";
import { TableLoading, EditButton, DeleteButton } from "../../../components";
import PaginationTable from "../../../components/PaginationTable";
import usePage from "../../../hook/usePage";
import useDebounce from "../../../hook/useDebounce";
import useList from "../../../hook/useList";
import { checkRole } from "../../../utils";
import { listMaster, createMaster, updateMaster, deleteMaster } from "../../../api/guru/dataMaster";

const SEMESTER_OPTIONS = Array.from({ length: 7 }, (_, i) => ({
  key: i,
  value: String(i),
  text: i === 0 ? "0 · Umum (tanpa semester)" : `Semester ${i}`,
}));

const KELOMPOK_ROLE = [
  { key: "admin", value: "admin", text: "Admin" },
  { key: "guru", value: "guru", text: "Guru" },
  { key: "staf", value: "staf", text: "Staf" },
  { key: "siswa", value: "siswa", text: "Siswa / Wali" },
];

// Konfigurasi per tab
const TABS = [
  {
    key: "ta",
    label: "Tahun Ajaran",
    icon: MdCalendarMonth,
    desc: "Tahun ajaran dipakai di rombel, jadwal, absensi, nilai, dan ujian. Tambahkan tahun ajaran baru setiap awal tahun.",
    namaField: "nama_tahun_ajaran",
    columns: [{ key: "nama_tahun_ajaran", label: "Tahun Ajaran" }],
    empty: { nama_tahun_ajaran: "" },
    fields: [{ name: "nama_tahun_ajaran", label: "Tahun Ajaran", placeholder: "2026/2027", required: true }],
  },
  {
    key: "kelas",
    label: "Kelas",
    icon: MdClass,
    desc: "Daftar kelas / rombongan belajar. Kelas Alumni dipakai untuk siswa yang sudah lulus.",
    namaField: "nama_kelas",
    columns: [{ key: "nama_kelas", label: "Nama Kelas" }],
    empty: { nama_kelas: "" },
    fields: [{ name: "nama_kelas", label: "Nama Kelas", placeholder: "X Rekayasa Perangkat Lunak", required: true }],
  },
  {
    key: "mapel",
    label: "Mata Pelajaran",
    icon: MdMenuBook,
    paginated: true,
    desc: "Mata pelajaran per semester. Semester 0 = mapel umum.",
    namaField: "nama_mapel",
    columns: [
      { key: "nama_mapel", label: "Mata Pelajaran" },
      {
        key: "kategori",
        label: "Semester",
        render: (r) => (Number(r.kategori) === 0 ? "Umum" : `Semester ${r.kategori}`),
      },
    ],
    empty: { nama_mapel: "", kategori: "1" },
    fields: [
      { name: "nama_mapel", label: "Nama Mata Pelajaran", placeholder: "Pemrograman Web 1", required: true },
      { name: "kategori", label: "Semester", type: "select", options: SEMESTER_OPTIONS, required: true },
    ],
  },
  {
    key: "role",
    label: "Role",
    icon: MdAdminPanelSettings,
    desc: "Role bawaan sistem dikunci karena dipakai langsung oleh aplikasi (login & hak akses). Role baru bisa diberikan ke guru lewat Daftar Guru → Atur Role.",
    namaField: "role_name",
    columns: [
      { key: "role_name", label: "Nama Role" },
      {
        key: "remarks",
        label: "Kelompok",
        render: (r) => KELOMPOK_ROLE.find((k) => k.value === r.remarks)?.text || r.remarks || "-",
      },
    ],
    empty: { role_name: "", remarks: "guru" },
    fields: [
      { name: "role_name", label: "Nama Role", placeholder: "Bendahara", required: true },
      { name: "remarks", label: "Kelompok", type: "select", options: KELOMPOK_ROLE, required: true },
    ],
  },
];

const NAMA_TABEL = {
  kelas_students: "rombel siswa",
  jadwals: "jadwal",
  absensi_kelas: "absensi kelas",
  agenda_kelas: "agenda kelas",
  nilais: "nilai",
  ujians: "ujian",
  hasil_belajars: "hasil belajar",
  bank_soals: "bank soal",
  user_roles: "pengguna",
  halaqohs: "halaqoh",
  guru_pikets: "guru piket",
  laporan_guru_pikets: "laporan guru piket",
  pelanggaran_siswas: "pelanggaran",
  prestasis: "prestasi",
  pengampu_halaqohs: "pengampu halaqoh",
  informasi_calon_santris: "data calon santri",
};

export default function DataMaster() {
  const { roles } = useList();
  const isAdmin = checkRole(roles, "Admin") || checkRole(roles, "Super Administrator");
  const [tab, setTab] = React.useState(TABS[0].key);
  const cfg = TABS.find((t) => t.key === tab);

  if (!isAdmin) {
    return (
      <LayoutPage title="Data Master">
        <Message warning>Fitur ini hanya dapat diakses oleh Admin.</Message>
      </LayoutPage>
    );
  }

  return (
    <LayoutPage title="Data Master">
      <div className="mb-5 flex flex-wrap gap-2 border-b border-gray-200">
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = t.key === tab;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`-mb-px flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition ${
                active
                  ? "border-[#00BFBF] text-[#00A0A0]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Icon className="h-5 w-5" /> {t.label}
            </button>
          );
        })}
      </div>
      <MasterPanel key={cfg.key} cfg={cfg} />
    </LayoutPage>
  );
}

function MasterPanel({ cfg }) {
  const queryClient = useQueryClient();
  const { page, pageSize, setPage, setPageSize } = usePage();
  const [keyword, setKeyword] = React.useState("");
  const debounced = useDebounce(keyword, 400);
  const [form, setForm] = React.useState(null); // { row|null }
  const [hapus, setHapus] = React.useState(null); // row

  React.useEffect(() => setPage(1), [debounced, setPage]);

  const params = {
    keyword: debounced || undefined,
    ...(cfg.paginated && { page, pageSize }),
  };
  const { data, isLoading } = useQuery(
    ["master", cfg.key, params],
    () => listMaster(cfg.key, params),
    { refetchOnWindowFocus: false, keepPreviousData: true, select: (r) => r.data?.data }
  );
  const rows = data?.rows || [];
  const refresh = () => {
    queryClient.invalidateQueries(["master", cfg.key]);
    // daftar dropdown lain di aplikasi
    queryClient.invalidateQueries("list/tahun-ajaran");
    queryClient.invalidateQueries("list/kelas");
    queryClient.invalidateQueries("siswa/kelas/ringkasan");
  };

  const kolom = cfg.columns.length + 2;

  return (
    <div>
      <p className="mb-4 max-w-3xl text-sm text-gray-600">{cfg.desc}</p>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="w-full max-w-sm">
          <Input
            fluid
            icon="search"
            iconPosition="left"
            placeholder={`Cari ${cfg.label.toLowerCase()}...`}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
        <Button color="teal" icon="plus" content={`Tambah ${cfg.label}`} onClick={() => setForm({ row: null })} />
      </div>

      <Table celled selectable unstackable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell collapsing>No</Table.HeaderCell>
            {cfg.columns.map((c) => (
              <Table.HeaderCell key={c.key}>{c.label}</Table.HeaderCell>
            ))}
            <Table.HeaderCell collapsing>Aksi</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <TableLoading count={kolom} isLoading={isLoading} data={rows} messageEmpty={`Belum ada ${cfg.label.toLowerCase()}`}>
            {rows.map((r, i) => (
              <Table.Row key={r.id}>
                <Table.Cell>{cfg.paginated ? (page - 1) * pageSize + i + 1 : i + 1}</Table.Cell>
                {cfg.columns.map((c, ci) => (
                  <Table.Cell key={c.key} className={ci === 0 ? "font-medium" : ""}>
                    <span className="inline-flex items-center gap-2">
                      {c.render ? c.render(r) : r[c.key]}
                      {ci === 0 && r.terkunci && (
                        <Label size="mini" basic title="Role bawaan sistem">
                          <MdLock className="inline h-3 w-3" /> Bawaan
                        </Label>
                      )}
                      {ci === 0 && r.alumni && (
                        <Label size="mini" basic color="purple">Alumni</Label>
                      )}
                    </span>
                  </Table.Cell>
                ))}
                <Table.Cell>
                  <div className="flex items-center gap-1 whitespace-nowrap">
                    <EditButton
                      disabled={r.terkunci}
                      title={r.terkunci ? "Role bawaan tidak dapat diubah" : "Edit"}
                      onClick={() => setForm({ row: r })}
                    />
                    <DeleteButton
                      disabled={r.terkunci || r.alumni}
                      title={r.terkunci || r.alumni ? "Data bawaan tidak dapat dihapus" : "Hapus"}
                      onClick={() => setHapus(r)}
                    />
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </TableLoading>
        </Table.Body>
      </Table>

      {cfg.paginated && (
        <PaginationTable
          page={page}
          pageSize={pageSize}
          setPage={setPage}
          setPageSize={setPageSize}
          totalPages={data?.count}
        />
      )}

      <FormModal cfg={cfg} state={form} onClose={() => setForm(null)} onDone={() => { setForm(null); refresh(); }} />
      <HapusModal cfg={cfg} row={hapus} onClose={() => setHapus(null)} onDone={() => { setHapus(null); refresh(); }} />
    </div>
  );
}

function FormModal({ cfg, state, onClose, onDone }) {
  const [values, setValues] = React.useState(cfg.empty);
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const edit = state?.row;

  React.useEffect(() => {
    setError("");
    if (!state) return;
    if (edit) {
      const v = {};
      cfg.fields.forEach((f) => (v[f.name] = edit[f.name] == null ? "" : String(edit[f.name])));
      setValues(v);
    } else {
      setValues(cfg.empty);
    }
  }, [state, edit, cfg]);

  if (!state) return null;

  const submit = async () => {
    setLoading(true);
    setError("");
    try {
      const res = edit
        ? await updateMaster(cfg.key, edit.id, values)
        : await createMaster(cfg.key, values);
      toast.success(res.data?.msg || "Berhasil disimpan");
      onDone();
    } catch (err) {
      setError(err?.response?.data?.msg || "Gagal menyimpan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal size="tiny" open onClose={() => !loading && onClose()}>
      <Modal.Header>{edit ? `Edit ${cfg.label}` : `Tambah ${cfg.label}`}</Modal.Header>
      <Modal.Content>
        <Form error={!!error} onSubmit={submit}>
          {cfg.fields.map((f) =>
            f.type === "select" ? (
              <Form.Field key={f.name} required={f.required}>
                <label>{f.label}</label>
                <Dropdown
                  fluid
                  selection
                  options={f.options}
                  value={values[f.name]}
                  onChange={(_, d) => setValues((v) => ({ ...v, [f.name]: d.value }))}
                />
              </Form.Field>
            ) : (
              <Form.Input
                key={f.name}
                required={f.required}
                label={f.label}
                placeholder={f.placeholder}
                value={values[f.name] || ""}
                onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))}
              />
            )
          )}
          {edit && (
            <Message info size="small">
              Perubahan nama langsung terlihat di semua data yang memakai{" "}
              {cfg.label.toLowerCase()} ini.
            </Message>
          )}
          <Message error content={error} />
          <button type="submit" hidden />
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

// Pemakaian data dicek di server saat hapus; bila sudah dipakai, alasannya ditampilkan di sini
function HapusModal({ cfg, row, onClose, onDone }) {
  const [loading, setLoading] = React.useState(false);
  const [gagal, setGagal] = React.useState(null); // { msg, detail }
  React.useEffect(() => setGagal(null), [row]);
  if (!row) return null;

  const submit = async () => {
    setLoading(true);
    try {
      const res = await deleteMaster(cfg.key, row.id);
      toast.success(res.data?.msg || "Berhasil dihapus");
      onDone();
    } catch (err) {
      setGagal({
        msg: err?.response?.data?.msg || "Gagal menghapus",
        detail: err?.response?.data?.dipakai_detail,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal size="tiny" open onClose={() => !loading && onClose()}>
      <Modal.Header>Hapus {cfg.label}</Modal.Header>
      <Modal.Content>
        {gagal ? (
          <Message negative>
            <Message.Header>{gagal.msg}</Message.Header>
            {gagal.detail && (
              <ul className="mt-2 list-disc pl-5">
                {Object.entries(gagal.detail).map(([t, n]) => (
                  <li key={t}>
                    {NAMA_TABEL[t] || t}: {Number(n).toLocaleString("id-ID")}
                  </li>
                ))}
              </ul>
            )}
          </Message>
        ) : (
          <p>
            Hapus <b>{row[cfg.namaField]}</b>? Data yang sudah dipakai di tempat lain tidak
            dapat dihapus.
          </p>
        )}
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={onClose} disabled={loading}>
          {gagal ? "Tutup" : "Batal"}
        </Button>
        {!gagal && (
          <Button color="red" loading={loading} onClick={submit}>
            Ya, Hapus
          </Button>
        )}
      </Modal.Actions>
    </Modal>
  );
}
