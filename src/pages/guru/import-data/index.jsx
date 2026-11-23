import React from "react";
import { Button, Form, Input, Message, Table, Label } from "semantic-ui-react";
import { MdCloudUpload, MdFileDownload, MdInsertDriveFile } from "react-icons/md";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import LayoutPage from "../../../module/layoutPage";
import useList from "../../../hook/useList";
import { getReferensiImport, postImportData } from "../../../api/guru/importData";
import { IMPORT_TYPES, downloadTemplate } from "./templates";

const ADMIN_ROLES = ["Admin", "Super Administrator"];

export default function ImportData() {
  const { roles } = useList();
  const isAdmin = (roles?.allRole || []).some((r) => ADMIN_ROLES.includes(r));

  const [selectedKey, setSelectedKey] = React.useState(IMPORT_TYPES[0].key);
  const selected = IMPORT_TYPES.find((t) => t.key === selectedKey);

  if (!isAdmin) {
    return (
      <LayoutPage title="Import Data">
        <Message warning>
          Fitur import data hanya dapat diakses oleh Admin.
        </Message>
      </LayoutPage>
    );
  }

  const main = IMPORT_TYPES.filter((t) => !t.advanced);
  const advanced = IMPORT_TYPES.filter((t) => t.advanced);

  return (
    <LayoutPage title="Import Data">
      <Message info size="small">
        <Message.Header>Urutan import yang disarankan</Message.Header>
        <p>
          Tahun Ajaran → Kelas → Mata Pelajaran → Guru → Siswa → Wali → Rombel →
          Jadwal. Data diimport langsung ke database, jadi periksa file sebelum
          diupload.
        </p>
      </Message>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 mt-4">
        {/* Daftar jenis import */}
        <div className="xl:col-span-4 space-y-2">
          {main.map((t) => (
            <TypeButton
              key={t.key}
              type={t}
              active={t.key === selectedKey}
              onClick={() => setSelectedKey(t.key)}
            />
          ))}
          <p className="pt-3 px-1 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Lainnya (jarang dipakai)
          </p>
          {advanced.map((t) => (
            <TypeButton
              key={t.key}
              type={t}
              active={t.key === selectedKey}
              onClick={() => setSelectedKey(t.key)}
            />
          ))}
        </div>

        {/* Detail & form upload */}
        <div className="xl:col-span-8">
          <ImportPanel key={selected.key} type={selected} />
        </div>
      </div>
    </LayoutPage>
  );
}

function TypeButton({ type, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center gap-3 rounded-lg border px-4 py-3 text-left transition-colors ${
        active
          ? "border-[#00BFBF] bg-[#00BFBF] text-white"
          : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
      }`}
    >
      <span
        className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${
          active ? "bg-white text-[#00BFBF]" : "bg-gray-100 text-gray-600"
        }`}
      >
        {type.step}
      </span>
      <span className="font-medium">{type.title}</span>
    </button>
  );
}

function ImportPanel({ type }) {
  if (type.redirect) return <RedirectPanel type={type} />;
  return <ImportForm type={type} />;
}

function RedirectPanel({ type }) {
  const navigate = useNavigate();
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5">
      <h3 className="m-0 text-lg font-bold">{type.title}</h3>
      <p className="mt-2 text-sm text-gray-600">{type.desc}</p>
      <Button color="green" icon="arrow right" labelPosition="right" content="Buka Impor Wali" onClick={() => navigate(type.redirect)} />
    </div>
  );
}

function ImportForm({ type }) {
  const [file, setFile] = React.useState(null);
  const [password, setPassword] = React.useState("");
  const [uploading, setUploading] = React.useState(false);
  const [downloading, setDownloading] = React.useState(false);
  const [result, setResult] = React.useState(null);
  const fileRef = React.useRef(null);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      let referensi = null;
      if (type.refs.length > 0) {
        try {
          const res = await getReferensiImport();
          referensi = res.data?.data;
        } catch (e) {
          toast.warn(
            "Data referensi gagal dimuat, template diunduh tanpa sheet referensi"
          );
        }
      }
      downloadTemplate(type, referensi);
    } finally {
      setDownloading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return setResult({ error: true, msg: "Pilih file Excel terlebih dahulu" });
    if (!password) return setResult({ error: true, msg: "Password import wajib diisi" });

    setUploading(true);
    setResult(null);
    try {
      const res = await postImportData(type.endpoint, file, password);
      setResult({ error: false, ...res.data });
      toast.success(res.data?.msg || "Import berhasil");
      setFile(null);
      if (fileRef.current) fileRef.current.value = "";
    } catch (err) {
      setResult({
        error: true,
        msg: err?.response?.data?.msg || "Import gagal, periksa format file",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-800">
          Import {type.title}
        </h2>
        <p className="mt-1 text-gray-600">{type.desc}</p>
      </div>

      {/* Langkah 1: template */}
      <section>
        <h3 className="mb-2 font-semibold text-gray-700">1. Unduh &amp; isi template</h3>
        <Button
          type="button"
          color="teal"
          onClick={handleDownload}
          loading={downloading}
          disabled={downloading}
        >
          <span className="flex items-center gap-2">
            <MdFileDownload className="h-4 w-4" />
            Download Template
          </span>
        </Button>
        {type.refs.length > 0 && (
          <p className="mt-2 text-sm text-gray-500">
            Template berisi sheet <b>Petunjuk</b> dan sheet <b>Referensi</b> (daftar ID
            terbaru dari database) untuk membantu pengisian.
          </p>
        )}

        <div className="mt-3 overflow-x-auto">
          <Table celled compact size="small" unstackable>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell collapsing>Kolom</Table.HeaderCell>
                <Table.HeaderCell>Nama Kolom</Table.HeaderCell>
                <Table.HeaderCell>Keterangan</Table.HeaderCell>
                <Table.HeaderCell>Contoh</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {type.columns.map((c, i) => (
                <Table.Row key={c.header}>
                  <Table.Cell>
                    <Label size="tiny">{String.fromCharCode(65 + i)}</Label>
                  </Table.Cell>
                  <Table.Cell className="font-medium whitespace-nowrap">{c.header}</Table.Cell>
                  <Table.Cell className="text-gray-600">{c.note || "-"}</Table.Cell>
                  <Table.Cell className="whitespace-nowrap font-mono text-sm">
                    {c.example || "-"}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      </section>

      {/* Langkah 2: upload */}
      <section>
        <h3 className="mb-2 font-semibold text-gray-700">2. Upload file</h3>
        <Form onSubmit={handleUpload}>
          <label
            className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-4 py-6 text-center transition-colors ${
              file ? "border-[#00BFBF] bg-teal-50" : "border-gray-300 hover:bg-gray-50"
            }`}
          >
            {file ? (
              <>
                <MdInsertDriveFile className="h-8 w-8 text-[#00BFBF]" />
                <span className="mt-2 font-medium text-gray-700">{file.name}</span>
                <span className="text-xs text-gray-500">Klik untuk mengganti file</span>
              </>
            ) : (
              <>
                <MdCloudUpload className="h-8 w-8 text-gray-400" />
                <span className="mt-2 text-gray-600">Klik untuk memilih file .xlsx</span>
              </>
            )}
            <input
              ref={fileRef}
              type="file"
              className="hidden"
              accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              onChange={(e) => {
                setResult(null);
                setFile(e.target.files?.[0] || null);
              }}
            />
          </label>

          <Form.Field
            className="mt-4"
            control={Input}
            type="password"
            label="Password Import"
            placeholder="Masukkan password import"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={uploading}
          />

          {result && (
            <Message
              negative={result.error}
              positive={!result.error}
              size="small"
            >
              <p>{result.msg}</p>
              {!result.error && result.successImport !== undefined && (
                <p className="mt-1">
                  Berhasil: <b>{result.successImport}</b> · Dilewati (email sudah
                  terdaftar / data tidak valid): <b>{result.failedImport}</b>
                </p>
              )}
            </Message>
          )}

          <Button
            type="submit"
            color="green"
            loading={uploading}
            disabled={uploading || !file}
            content={`Import ${type.title}`}
          />
        </Form>
      </section>
    </div>
  );
}
