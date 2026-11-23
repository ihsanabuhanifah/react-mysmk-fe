// Daftar Wali Santri (khusus admin)
// Alur:
//  A. Wali daftar sendiri (/register/wali) -> tab "Menunggu" -> admin klik "Hubungkan" -> wali bisa login
//  B. Admin "Tambah Wali" (opsional langsung pilih santri) -> password awal tampil sekali -> berikan ke wali
import React from "react";
import { Table, Input, Button, Modal, Message, Label, Form, Dropdown, Menu, Icon } from "semantic-ui-react";
import { useQuery, useQueryClient } from "react-query";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import LayoutPage from "../../../module/layoutPage";
import { TableLoading } from "../../../components";
import PaginationTable from "../../../components/PaginationTable";
import usePage from "../../../hook/usePage";
import useDebounce from "../../../hook/useDebounce";
import useList from "../../../hook/useList";
import { checkRole } from "../../../utils";
import {
  listWali,
  cariSantri,
  tambahWali,
  hubungkanWali,
  putuskanWali,
  resetPasswordWali,
  ubahWali,
} from "../../../api/guru/adminWali";
import ImportWaliModal from "./ImportWaliModal";

const HUBUNGAN = [
  { key: "ayah", value: "ayah", text: "Ayah" },
  { key: "ibu", value: "ibu", text: "Ibu" },
  { key: "wali", value: "wali", text: "Wali" },
];
const errMsg = (err, fallback) => err?.response?.data?.msg || fallback;

export default function DaftarWali() {
  const { roles } = useList();
  const isAdmin = checkRole(roles, "Admin") || checkRole(roles, "Super Administrator");
  if (!isAdmin) {
    return (
      <LayoutPage title="Daftar Wali Santri">
        <Message warning>Fitur ini hanya dapat diakses oleh Admin.</Message>
      </LayoutPage>
    );
  }
  return <DaftarWaliTable />;
}

function DaftarWaliTable() {
  const qc = useQueryClient();
  const { page, pageSize, setPage, setPageSize } = usePage();
  const [status, setStatus] = React.useState("");
  const [keyword, setKeyword] = React.useState("");
  const q = useDebounce(keyword, 500);

  // modal yang sedang terbuka
  const [tambah, setTambah] = React.useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [impor, setImpor] = React.useState(searchParams.get("impor") === "1");
  const tutupImpor = () => {
    setImpor(false);
    if (searchParams.has("impor")) setSearchParams({}, { replace: true });
  };
  const [hubung, setHubung] = React.useState(null); // row
  const [ubah, setUbah] = React.useState(null); // row
  const [konfirmasi, setKonfirmasi] = React.useState(null); // { jenis: "putuskan"|"reset", row }
  const [kredensial, setKredensial] = React.useState(null); // { nama, email, password }

  React.useEffect(() => setPage(1), [status, q, setPage]);

  const params = { status: status || undefined, keyword: q || undefined, page, pageSize };
  const { data, isLoading } = useQuery(["admin-wali", params], () => listWali(params), {
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    select: (r) => r.data,
  });
  const rows = data?.data?.rows || [];
  const jumlahMenunggu = data?.jumlahMenunggu || 0;
  const refresh = () => qc.invalidateQueries("admin-wali");

  return (
    <LayoutPage title="Daftar Wali Santri">
      <AlurInfo />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Menu compact size="small">
          <Menu.Item active={status === ""} onClick={() => setStatus("")}>
            Semua
          </Menu.Item>
          <Menu.Item active={status === "menunggu"} onClick={() => setStatus("menunggu")}>
            Menunggu dihubungkan
            {jumlahMenunggu > 0 && (
              <Label color="orange" size="mini">
                {jumlahMenunggu}
              </Label>
            )}
          </Menu.Item>
          <Menu.Item active={status === "terhubung"} onClick={() => setStatus("terhubung")}>
            Terhubung
          </Menu.Item>
        </Menu>
        <div className="min-w-[240px] flex-1">
          <Input
            fluid
            icon="search"
            iconPosition="left"
            placeholder="Cari nama wali, email, nama santri, atau NISN..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
        <Button basic color="green" icon="file excel" content="Impor Excel" onClick={() => setImpor(true)} />
        <Button color="green" icon="add user" content="Tambah Wali" onClick={() => setTambah(true)} />
      </div>

      <div className="overflow-x-auto">
        <Table celled unstackable compact>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell collapsing>No</Table.HeaderCell>
              <Table.HeaderCell>Wali</Table.HeaderCell>
              <Table.HeaderCell>Hubungan</Table.HeaderCell>
              <Table.HeaderCell>Santri</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell collapsing>Aksi</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <TableLoading count={6} isLoading={isLoading} data={rows} messageEmpty="Belum ada wali pada filter ini">
              {rows.map((r, i) => (
                <Table.Row key={r.id} warning={!r.siswa}>
                  <Table.Cell>{(page - 1) * pageSize + i + 1}</Table.Cell>
                  <Table.Cell>
                    <div className="font-semibold">{r.nama_wali || "-"}</div>
                    <div className="text-xs text-gray-500">{r.email}</div>
                    {r.no_hp && <div className="text-xs text-gray-500">{r.no_hp}</div>}
                  </Table.Cell>
                  <Table.Cell className="capitalize">{r.hubungan || "-"}</Table.Cell>
                  <Table.Cell>
                    {r.siswa ? (
                      <>
                        <div className="font-semibold">{r.siswa.nama_siswa}</div>
                        <div className="text-xs text-gray-500">
                          NISN {r.siswa.nisn || "-"} · {r.siswa.kelas || "tidak ada kelas aktif"}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-gray-400">Belum terhubung</div>
                        {(r.klaim_nama_siswa || r.klaim_nisn) && (
                          <div className="text-xs text-gray-500">
                            Diisi wali: {r.klaim_nama_siswa || "-"} (NISN {r.klaim_nisn || "-"})
                          </div>
                        )}
                      </>
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    {r.siswa ? (
                      <Label size="tiny" color="green">
                        Terhubung
                      </Label>
                    ) : (
                      <Label size="tiny" color="orange">
                        Menunggu
                      </Label>
                    )}
                    {["pindah", "diblokir"].includes(r.status_akun) && (
                      <Label size="tiny" color="red">
                        Akun {r.status_akun}
                      </Label>
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex items-center gap-1">
                      <Button
                        size="mini"
                        color={r.siswa ? undefined : "orange"}
                        basic={Boolean(r.siswa)}
                        content={r.siswa ? "Ganti santri" : "Hubungkan"}
                        onClick={() => setHubung(r)}
                      />
                      <Dropdown icon="ellipsis vertical" button basic className="mini icon" direction="left">
                        <Dropdown.Menu>
                          <Dropdown.Item icon="edit" text="Ubah data wali" onClick={() => setUbah(r)} />
                          <Dropdown.Item icon="key" text="Reset password" onClick={() => setKonfirmasi({ jenis: "reset", row: r })} />
                          {r.siswa && (
                            <Dropdown.Item
                              icon="unlinkify"
                              text="Putuskan dari santri"
                              onClick={() => setKonfirmasi({ jenis: "putuskan", row: r })}
                            />
                          )}
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
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

      <TambahWaliModal
        open={tambah}
        onClose={() => setTambah(false)}
        onDone={(hasil) => {
          setTambah(false);
          refresh();
          setKredensial(hasil);
        }}
      />
      <HubungkanModal
        row={hubung}
        onClose={() => setHubung(null)}
        onDone={() => {
          setHubung(null);
          refresh();
        }}
      />
      <UbahWaliModal
        row={ubah}
        onClose={() => setUbah(null)}
        onDone={() => {
          setUbah(null);
          refresh();
        }}
      />
      <KonfirmasiModal
        data={konfirmasi}
        onClose={() => setKonfirmasi(null)}
        onReset={(hasil) => {
          setKonfirmasi(null);
          setKredensial(hasil);
        }}
        onPutus={() => {
          setKonfirmasi(null);
          refresh();
        }}
      />
      <KredensialModal data={kredensial} onClose={() => setKredensial(null)} />
      <ImportWaliModal open={impor} onClose={tutupImpor} onDone={refresh} />
    </LayoutPage>
  );
}

function AlurInfo() {
  const [buka, setBuka] = React.useState(false);
  return (
    <Message info size="small" className="!mb-4">
      <div className="flex items-center justify-between gap-2">
        <span>
          Wali hanya bisa login setelah <b>terhubung ke santri</b>.
        </span>
        <Button size="mini" basic content={buka ? "Tutup" : "Lihat alur"} onClick={() => setBuka(!buka)} />
      </div>
      {buka && (
        <ol className="mb-0 mt-2 pl-5 text-sm">
          <li>
            <b>Wali daftar sendiri</b> di halaman <code>/register/wali</code> (mengisi NISN & nama anak) → muncul di tab{" "}
            <b>Menunggu dihubungkan</b>.
          </li>
          <li>
            Admin klik <b>Hubungkan</b>, cocokkan dengan NISN/nama yang diisi wali, pilih santri yang benar.
          </li>
          <li>
            <b>Atau admin menambahkan langsung</b> lewat <b>Tambah Wali</b> (satu per satu) atau <b>Impor Excel</b> (banyak sekaligus).
            Santri boleh dipilih nanti. Password awal tampil sekali / bisa diunduh, kirimkan ke wali.
          </li>
          <li>
            Wali login di halaman login dengan memilih <b>Wali Santri</b>. Satu santri boleh punya beberapa wali (ayah & ibu), satu
            akun wali terhubung ke satu santri.
          </li>
        </ol>
      )}
    </Message>
  );
}

/** Pencarian santri (nama / NISN / NIS) untuk dipilih. */
function PilihSantri({ value, onChange, awal = "" }) {
  const [keyword, setKeyword] = React.useState(awal);
  const q = useDebounce(keyword.trim(), 400);
  const { data = [], isFetching } = useQuery(["cari-santri", q], () => cariSantri(q), {
    enabled: q.length >= 2,
    select: (r) => r.data?.data || [],
    keepPreviousData: true,
  });

  return (
    <div>
      <Input
        fluid
        icon="search"
        iconPosition="left"
        loading={isFetching}
        placeholder="Ketik nama, NISN, atau NIS santri (min. 2 huruf)"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      <div className="mt-2 max-h-72 overflow-auto rounded border">
        {q.length < 2 ? (
          <p className="m-0 p-3 text-sm text-gray-400">Mulai ketik untuk mencari santri.</p>
        ) : data.length === 0 && !isFetching ? (
          <p className="m-0 p-3 text-sm text-gray-400">Santri tidak ditemukan.</p>
        ) : (
          data.map((s) => {
            const dipilih = value?.id === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => onChange(s)}
                className={`flex w-full items-start justify-between gap-3 border-b px-3 py-2 text-left last:border-0 hover:bg-gray-50 ${
                  dipilih ? "bg-green-50" : ""
                }`}
              >
                <div>
                  <div className="font-semibold">{s.nama_siswa}</div>
                  <div className="text-xs text-gray-500">
                    NISN {s.nisn || "-"} · NIS {s.nis || "-"} · {s.kelas || "tidak ada kelas aktif"}
                  </div>
                  {s.wali.length > 0 && (
                    <div className="text-xs text-blue-600">
                      Sudah ada wali: {s.wali.map((w) => `${w.nama_wali} (${w.hubungan || "-"})`).join(", ")}
                    </div>
                  )}
                </div>
                {dipilih && <Icon name="check circle" color="green" />}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

function TambahWaliModal({ open, onClose, onDone }) {
  const kosong = { nama_wali: "", email: "", no_hp: "", hubungan: "" };
  const [form, setForm] = React.useState(kosong);
  const [santri, setSantri] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    if (open) {
      setForm(kosong);
      setSantri(null);
      setError(null);
    }
  }, [open]);

  const ubah = (e, { name, value }) => setForm((f) => ({ ...f, [name]: value }));

  const simpan = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await tambahWali({ ...form, student_id: santri?.id });
      toast.success(res.data?.msg || "Wali ditambahkan");
      onDone({ nama: form.nama_wali, email: form.email.trim().toLowerCase(), password: res.data?.password, santri: santri?.nama_siswa });
    } catch (err) {
      setError(errMsg(err, "Gagal menambahkan wali"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} size="small" closeIcon>
      <Modal.Header>Tambah Wali Santri</Modal.Header>
      <Modal.Content scrolling>
        <Form>
          <Form.Group widths="equal">
            <Form.Input required label="Nama wali" name="nama_wali" value={form.nama_wali} onChange={ubah} />
            <Form.Select required label="Hubungan" name="hubungan" options={HUBUNGAN} value={form.hubungan} onChange={ubah} />
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Input required type="email" label="Email (untuk login)" name="email" value={form.email} onChange={ubah} />
            <Form.Input label="No. HP / WhatsApp" name="no_hp" value={form.no_hp} onChange={ubah} />
          </Form.Group>
          <div className="field">
            <label>Santri (boleh dikosongkan, bisa dihubungkan nanti)</label>
            {santri && (
              <Label className="!mb-2" color="green">
                {santri.nama_siswa}
                <Icon name="delete" onClick={() => setSantri(null)} />
              </Label>
            )}
            <PilihSantri value={santri} onChange={setSantri} />
          </div>
        </Form>
        {error && <Message negative content={error} />}
        <Message size="tiny" content="Password awal dibuat otomatis dan hanya ditampilkan sekali setelah disimpan." />
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={onClose} content="Batal" />
        <Button
          color="green"
          loading={loading}
          disabled={loading || !form.nama_wali || !form.email || !form.hubungan}
          onClick={simpan}
          content="Simpan"
        />
      </Modal.Actions>
    </Modal>
  );
}

function HubungkanModal({ row, onClose, onDone }) {
  const [santri, setSantri] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => setSantri(null), [row]);
  if (!row) return null;

  const simpan = async () => {
    setLoading(true);
    try {
      const res = await hubungkanWali(row.id, santri.id);
      toast.success(res.data?.msg || "Berhasil dihubungkan");
      onDone();
    } catch (err) {
      toast.error(errMsg(err, "Gagal menghubungkan"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open onClose={onClose} size="small" closeIcon>
      <Modal.Header>{row.siswa ? "Ganti santri" : "Hubungkan ke santri"}</Modal.Header>
      <Modal.Content scrolling>
        <div className="mb-3 rounded bg-gray-50 p-3 text-sm">
          <div>
            <b>{row.nama_wali}</b> ({row.hubungan || "-"}) · {row.email}
          </div>
          {row.siswa ? (
            <div className="mt-1">
              Saat ini terhubung ke <b>{row.siswa.nama_siswa}</b>. Mengganti santri akan mengeluarkan wali dari semua perangkat.
            </div>
          ) : (
            (row.klaim_nama_siswa || row.klaim_nisn) && (
              <div className="mt-1">
                Data yang diisi wali saat daftar: <b>{row.klaim_nama_siswa || "-"}</b>, NISN <b>{row.klaim_nisn || "-"}</b>
              </div>
            )
          )}
        </div>
        <PilihSantri value={santri} onChange={setSantri} awal={row.siswa ? "" : row.klaim_nisn || row.klaim_nama_siswa || ""} />
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={onClose} content="Batal" />
        <Button
          color="green"
          loading={loading}
          disabled={!santri || loading || santri.id === row.siswa?.id}
          onClick={simpan}
          content={santri ? `Hubungkan ke ${santri.nama_siswa}` : "Pilih santri dulu"}
        />
      </Modal.Actions>
    </Modal>
  );
}

function UbahWaliModal({ row, onClose, onDone }) {
  const [form, setForm] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  React.useEffect(() => {
    if (row) setForm({ nama_wali: row.nama_wali || "", no_hp: row.no_hp || "", hubungan: row.hubungan || "" });
  }, [row]);
  if (!row) return null;

  const ubah = (e, { name, value }) => setForm((f) => ({ ...f, [name]: value }));
  const simpan = async () => {
    setLoading(true);
    try {
      const res = await ubahWali(row.id, form);
      toast.success(res.data?.msg || "Tersimpan");
      onDone();
    } catch (err) {
      toast.error(errMsg(err, "Gagal menyimpan"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open onClose={onClose} size="tiny" closeIcon>
      <Modal.Header>Ubah data wali</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Input label="Nama wali" name="nama_wali" value={form.nama_wali || ""} onChange={ubah} />
          <Form.Select label="Hubungan" name="hubungan" options={HUBUNGAN} value={form.hubungan || ""} onChange={ubah} />
          <Form.Input label="No. HP / WhatsApp" name="no_hp" value={form.no_hp || ""} onChange={ubah} />
          <Form.Input label="Email (login)" value={row.email} readOnly disabled />
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={onClose} content="Batal" />
        <Button color="green" loading={loading} disabled={loading || !form.nama_wali} onClick={simpan} content="Simpan" />
      </Modal.Actions>
    </Modal>
  );
}

function KonfirmasiModal({ data, onClose, onReset, onPutus }) {
  const [loading, setLoading] = React.useState(false);
  if (!data) return null;
  const { jenis, row } = data;

  const jalankan = async () => {
    setLoading(true);
    try {
      if (jenis === "reset") {
        const res = await resetPasswordWali(row.id);
        toast.success("Password direset");
        onReset({ nama: row.nama_wali, email: res.data?.email || row.email, password: res.data?.password, santri: row.siswa?.nama_siswa });
      } else {
        const res = await putuskanWali(row.id);
        toast.success(res.data?.msg || "Hubungan diputuskan");
        onPutus();
      }
    } catch (err) {
      toast.error(errMsg(err, "Gagal"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open onClose={onClose} size="tiny">
      <Modal.Header>{jenis === "reset" ? "Reset password wali?" : "Putuskan dari santri?"}</Modal.Header>
      <Modal.Content>
        {jenis === "reset" ? (
          <p>
            Password <b>{row.nama_wali}</b> ({row.email}) akan diganti dengan password baru. Wali akan keluar dari semua perangkat.
          </p>
        ) : (
          <p>
            <b>{row.nama_wali}</b> tidak akan bisa login dan melihat data <b>{row.siswa?.nama_siswa}</b> sampai dihubungkan lagi.
          </p>
        )}
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={onClose} content="Batal" />
        <Button
          color={jenis === "reset" ? "blue" : "red"}
          loading={loading}
          disabled={loading}
          onClick={jalankan}
          content={jenis === "reset" ? "Reset password" : "Putuskan"}
        />
      </Modal.Actions>
    </Modal>
  );
}

/** Tampilkan email + password awal SEKALI, dengan teks siap kirim ke wali. */
function KredensialModal({ data, onClose }) {
  if (!data) return null;
  const urlLogin = `${window.location.origin}/login`;
  const pesan = `Assalamu'alaikum ${data.nama || "Bapak/Ibu"},

Berikut akun MySMK untuk memantau ${data.santri ? `ananda ${data.santri}` : "ananda"}:
Alamat : ${urlLogin}
Masuk sebagai : Wali Santri
Email : ${data.email}
Password : ${data.password}

Mohon segera ganti password setelah login. Jazakumullahu khairan.`;

  const salin = async (teks, label) => {
    try {
      await navigator.clipboard.writeText(teks);
      toast.success(`${label} disalin`);
    } catch (e) {
      toast.error("Gagal menyalin, salin manual");
    }
  };

  return (
    <Modal open onClose={onClose} size="small" closeOnDimmerClick={false}>
      <Modal.Header>Akun wali siap digunakan</Modal.Header>
      <Modal.Content>
        <Message warning size="small" content="Password ini hanya ditampilkan sekali. Salin dan kirimkan ke wali sekarang." />
        <div className="mb-3 grid grid-cols-3 gap-2 text-sm">
          <span className="text-gray-500">Email</span>
          <span className="col-span-2 font-mono">{data.email}</span>
          <span className="text-gray-500">Password</span>
          <span className="col-span-2 font-mono text-lg font-bold">{data.password}</span>
        </div>
        <Form>
          <Form.TextArea label="Pesan untuk wali (WhatsApp)" value={pesan} rows={9} readOnly />
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button icon="copy" content="Salin password" onClick={() => salin(data.password, "Password")} />
        <Button color="green" icon="whatsapp" content="Salin pesan" onClick={() => salin(pesan, "Pesan")} />
        <Button onClick={onClose} content="Selesai" />
      </Modal.Actions>
    </Modal>
  );
}
