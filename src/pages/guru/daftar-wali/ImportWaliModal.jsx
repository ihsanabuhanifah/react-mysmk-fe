// Impor wali santri dari Excel: unggah -> pratinjau & validasi -> impor -> unduh daftar akun.
// NISN opsional: cocok = langsung terhubung, kosong/tidak cocok = status "Menunggu" (hubungkan lewat UI).
import React from "react";
import * as XLSX from "xlsx";
import { Modal, Button, Message, Table, Label, Icon } from "semantic-ui-react";
import { toast } from "react-toastify";
import { importWali } from "../../../api/guru/adminWali";

const KOLOM = [
  { key: "nama_wali", header: "Nama Wali", contoh: "Ahmad Fauzi", alias: ["namawali", "nama", "namaorangtua"] },
  { key: "email", header: "Email", contoh: "ahmad.fauzi@gmail.com", alias: ["email", "emaillogin"] },
  { key: "no_hp", header: "No HP", contoh: "081234567890", alias: ["nohp", "nohpwhatsapp", "nowa", "hp", "telepon"] },
  { key: "hubungan", header: "Hubungan", contoh: "ayah", alias: ["hubungan"] },
  { key: "nisn", header: "NISN Santri", contoh: "0065554315", alias: ["nisnsantri", "nisn", "nisnanak"] },
];
const norm = (s) => String(s || "").toLowerCase().replace(/[^a-z]/g, "");

function unduhTemplate() {
  const data = [KOLOM.map((k) => k.header), KOLOM.map((k) => k.contoh)];
  const ws = XLSX.utils.aoa_to_sheet(data);
  ws["!cols"] = [{ wch: 28 }, { wch: 30 }, { wch: 16 }, { wch: 12 }, { wch: 16 }];
  // kolom No HP & NISN sebagai teks agar angka 0 di depan tidak hilang
  ["C2", "E2"].forEach((c) => {
    if (ws[c]) ws[c] = { t: "s", v: String(ws[c].v), z: "@" };
  });
  const petunjuk = XLSX.utils.aoa_to_sheet([
    ["Kolom", "Keterangan"],
    ["Nama Wali", "Wajib."],
    ["Email", "Wajib, unik. Dipakai wali untuk login."],
    ["No HP", "Opsional. Ketik sebagai teks agar angka 0 di depan tidak hilang."],
    ["Hubungan", "Wajib: ayah / ibu / wali."],
    ["NISN Santri", "Opsional. Bila cocok, wali langsung terhubung ke santri. Bila kosong/tidak cocok, akun dibuat berstatus Menunggu dan dihubungkan lewat halaman Daftar Wali."],
    ["Password", "Tidak perlu diisi. Dibuat otomatis dan dapat diunduh setelah impor."],
  ]);
  petunjuk["!cols"] = [{ wch: 14 }, { wch: 110 }];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Wali");
  XLSX.utils.book_append_sheet(wb, petunjuk, "Petunjuk");
  XLSX.writeFile(wb, "template-import-wali.xlsx");
}

/** Baca sheet pertama; kolom dicocokkan dari nama header (urutan bebas). */
async function bacaFile(file) {
  const wb = XLSX.read(await file.arrayBuffer(), { type: "array" });
  const ws = wb.Sheets[wb.SheetNames[0]];
  const aoa = XLSX.utils.sheet_to_json(ws, { header: 1, raw: false, defval: "" });
  if (aoa.length < 2) throw new Error("File kosong atau hanya berisi header");

  const header = aoa[0].map(norm);
  const posisi = {};
  KOLOM.forEach((k, i) => {
    const idx = header.findIndex((h) => k.alias.includes(h));
    posisi[k.key] = idx >= 0 ? idx : i; // fallback: urutan template
  });
  return aoa
    .slice(1)
    .map((row, i) => ({
      baris: i + 2,
      ...Object.fromEntries(KOLOM.map((k) => [k.key, String(row[posisi[k.key]] ?? "").trim()])),
    }))
    .filter((r) => KOLOM.some((k) => r[k.key])); // lewati baris kosong
}

function unduhAkun(data) {
  const rows = data
    .filter((r) => r.dibuat)
    .map((r) => ({
      "Nama Wali": r.nama_wali,
      Email: r.email,
      Password: r.password,
      Hubungan: r.hubungan,
      Santri: r.siswa?.nama_siswa || "",
      Status: r.siswa ? "Terhubung" : "Menunggu dihubungkan",
      "Alamat Login": `${window.location.origin}/login (pilih: Wali Santri)`,
    }));
  const ws = XLSX.utils.json_to_sheet(rows);
  ws["!cols"] = [{ wch: 26 }, { wch: 30 }, { wch: 14 }, { wch: 10 }, { wch: 28 }, { wch: 22 }, { wch: 45 }];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Akun Wali");
  XLSX.writeFile(wb, `akun-wali-${new Date().toISOString().slice(0, 10)}.xlsx`);
}

function StatusBaris({ r }) {
  if (r.dibuat) return <Label size="tiny" color={r.siswa ? "green" : "orange"}>{r.siswa ? "Dibuat · terhubung" : "Dibuat · menunggu"}</Label>;
  if (!r.valid) return <Label size="tiny" color="red">Gagal</Label>;
  return <Label size="tiny" color={r.siswa ? "green" : "orange"} basic>{r.siswa ? "Siap · terhubung" : "Siap · menunggu"}</Label>;
}

export default function ImportWaliModal({ open, onClose, onDone }) {
  const [langkah, setLangkah] = React.useState("unggah"); // unggah | pratinjau | hasil
  const [namaFile, setNamaFile] = React.useState("");
  const [rows, setRows] = React.useState([]);
  const [hasil, setHasil] = React.useState(null); // { ringkasan, data }
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [sudahUnduh, setSudahUnduh] = React.useState(false);
  const inputRef = React.useRef(null);

  React.useEffect(() => {
    if (open) {
      setLangkah("unggah");
      setRows([]);
      setHasil(null);
      setError(null);
      setNamaFile("");
      setSudahUnduh(false);
    }
  }, [open]);

  const pilihFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setError(null);
    setLoading(true);
    try {
      const data = await bacaFile(file);
      if (data.length === 0) throw new Error("Tidak ada baris data di file");
      const res = await importWali(data, false);
      setNamaFile(file.name);
      setRows(data);
      setHasil(res.data);
      setLangkah("pratinjau");
    } catch (err) {
      setError(err?.response?.data?.msg || err.message || "File tidak dapat dibaca");
    } finally {
      setLoading(false);
    }
  };

  const simpan = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await importWali(rows, true);
      setHasil(res.data);
      setLangkah("hasil");
      toast.success(res.data?.msg || "Impor selesai");
      onDone?.();
    } catch (err) {
      setError(err?.response?.data?.msg || "Impor gagal");
    } finally {
      setLoading(false);
    }
  };

  const tutup = () => {
    if (langkah === "hasil" && hasil?.ringkasan?.dibuat > 0 && !sudahUnduh) {
      // eslint-disable-next-line no-alert
      if (!window.confirm("Daftar password belum diunduh dan tidak bisa dilihat lagi. Tutup tanpa mengunduh?")) return;
    }
    onClose();
  };

  const r = hasil?.ringkasan || {};
  const data = hasil?.data || [];

  return (
    <Modal open={open} onClose={tutup} size="large" closeOnDimmerClick={false} closeIcon>
      <Modal.Header>Impor Wali Santri dari Excel</Modal.Header>
      <Modal.Content scrolling>
        {langkah === "unggah" && (
          <>
            <ol className="mb-4 mt-0 pl-5 text-sm leading-7">
              <li>
                Unduh template, isi satu wali per baris. <b>NISN boleh dikosongkan</b>. Wali tanpa NISN (atau NISN tidak cocok)
                dibuat dengan status <b>Menunggu</b> dan dihubungkan nanti lewat tombol <b>Hubungkan</b>.
              </li>
              <li>Unggah file. Sistem menampilkan pratinjau, belum ada yang disimpan.</li>
              <li>Setelah impor, unduh daftar akun berisi password awal untuk dibagikan ke wali.</li>
            </ol>
            <div className="flex flex-wrap gap-2">
              <Button icon="download" content="Unduh template" onClick={unduhTemplate} />
              <Button
                color="green"
                icon="upload"
                content="Pilih file Excel"
                loading={loading}
                disabled={loading}
                onClick={() => inputRef.current?.click()}
              />
              <input ref={inputRef} type="file" accept=".xlsx,.xls,.csv" hidden onChange={pilihFile} />
            </div>
          </>
        )}

        {langkah !== "unggah" && (
          <>
            {langkah === "pratinjau" ? (
              <Message size="small" info>
                <b>{namaFile}</b>: {r.total} baris · <b>{r.terhubung}</b> siap & langsung terhubung · <b>{r.menunggu}</b> siap,
                menunggu dihubungkan · <b>{r.gagal}</b> gagal (tidak akan diimpor).
              </Message>
            ) : (
              <Message size="small" positive>
                <b>{r.dibuat}</b> akun dibuat ({r.terhubung} terhubung, {r.menunggu} menunggu dihubungkan)
                {r.gagal ? `, ${r.gagal} baris dilewati` : ""}.
                {r.dibuat > 0 && (
                  <div className="mt-1 font-semibold">Unduh daftar akun sekarang. Password tidak dapat dilihat lagi setelah ditutup.</div>
                )}
              </Message>
            )}

            <div className="overflow-x-auto">
              <Table compact celled unstackable size="small">
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell collapsing>Baris</Table.HeaderCell>
                    <Table.HeaderCell>Wali</Table.HeaderCell>
                    <Table.HeaderCell>Hubungan</Table.HeaderCell>
                    <Table.HeaderCell>Santri</Table.HeaderCell>
                    <Table.HeaderCell>Status</Table.HeaderCell>
                    {langkah === "hasil" && <Table.HeaderCell>Password</Table.HeaderCell>}
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {data.map((d) => (
                    <Table.Row key={d.baris} negative={!d.valid && !d.dibuat}>
                      <Table.Cell>{d.baris}</Table.Cell>
                      <Table.Cell>
                        <div className="font-semibold">{d.nama_wali || "-"}</div>
                        <div className="text-xs text-gray-500">{d.email || "-"}</div>
                      </Table.Cell>
                      <Table.Cell className="capitalize">{d.hubungan || "-"}</Table.Cell>
                      <Table.Cell>
                        {d.siswa ? (
                          <>
                            <div>{d.siswa.nama_siswa}</div>
                            <div className="text-xs text-gray-500">
                              NISN {d.siswa.nisn} · {d.siswa.kelas || "tanpa kelas aktif"}
                            </div>
                          </>
                        ) : (
                          <span className="text-gray-400">{d.nisn ? `NISN ${d.nisn}` : "—"}</span>
                        )}
                      </Table.Cell>
                      <Table.Cell>
                        <StatusBaris r={d} />
                        {d.error?.map((e) => (
                          <div key={e} className="text-xs text-red-600">
                            <Icon name="times circle" />
                            {e}
                          </div>
                        ))}
                        {d.valid &&
                          d.peringatan?.map((w) => (
                            <div key={w} className="text-xs text-yellow-700">
                              <Icon name="exclamation triangle" />
                              {w}
                            </div>
                          ))}
                      </Table.Cell>
                      {langkah === "hasil" && <Table.Cell className="font-mono">{d.password || "-"}</Table.Cell>}
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </div>
          </>
        )}

        {error && <Message negative content={error} />}
      </Modal.Content>
      <Modal.Actions>
        {langkah === "pratinjau" && (
          <>
            <Button content="Ganti file" onClick={() => setLangkah("unggah")} disabled={loading} />
            <Button
              color="green"
              loading={loading}
              disabled={loading || !r.valid}
              onClick={simpan}
              content={r.valid ? `Impor ${r.valid} wali` : "Tidak ada baris valid"}
            />
          </>
        )}
        {langkah === "hasil" && (
          <>
            {r.dibuat > 0 && (
              <Button
                color="green"
                icon="download"
                content="Unduh daftar akun (Excel)"
                onClick={() => {
                  unduhAkun(data);
                  setSudahUnduh(true);
                }}
              />
            )}
            <Button content="Selesai" onClick={tutup} />
          </>
        )}
        {langkah === "unggah" && <Button content="Batal" onClick={onClose} />}
      </Modal.Actions>
    </Modal>
  );
}
