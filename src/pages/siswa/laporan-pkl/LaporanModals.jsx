// Modal-modal Laporan PKL santri: detail, buat/edit laporan, laporan diniyyah
import React from "react";
import { Modal, Form, Button, Message, Icon, Checkbox } from "semantic-ui-react";
import { useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import DropzoneFile from "../../../components/Dropzone";
import LaporanPklDetailModal from "../../../components/LaporanPklDetail";
import { ReactSelectAsync } from "../../../components";
import useList from "../../../hook/useList";
import { formatTanggalIndo } from "../../../utils/formatTanggal";
import {
  getLaporanPklDetail,
  createLaporanPkl,
  updateLaporanPkl,
  getLaporanPklDiniyyahDetail,
  createLaporanDiniyyah,
  updateLaporanDiniyyah,
} from "../../../api/siswa/laporan-pkl";

const errMsg = (err, fallback) => err?.response?.data?.msg || fallback;
const KEY_LIST = "/santri/laporan-harian-pkl/list";
const KEY_DETAIL = "/santri/laporan-harian-pkl/detail/";
const KEY_DINIYYAH = "/santri/laporan-diniyyah/detailPkl/";

// Koordinat bawaan (sama dengan form lama; lokasi belum divalidasi di server)
const LOKASI_DEFAULT = { longtitude: 107.018523, latitude: -6.4871606 };

function useDetailLaporan(id) {
  return useQuery([KEY_DETAIL, id], () => getLaporanPklDetail(id), {
    enabled: !!id,
    refetchOnWindowFocus: false,
    select: (r) => r.data.data,
  });
}

/* ---------------- Detail ---------------- */
export function DetailLaporanModal({ id, onClose }) {
  const { data, isLoading, isError } = useDetailLaporan(id);
  return (
    <LaporanPklDetailModal
      open={!!id}
      onClose={onClose}
      data={data}
      isLoading={isLoading}
      isError={isError}
    />
  );
}

/* ---------------- Buat / Edit laporan ---------------- */
// mode: "create" | "edit"; id: id laporan (untuk edit)
export function FormLaporanModal({ mode, id, onClose }) {
  const edit = mode === "edit";
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useDetailLaporan(edit ? id : null);
  const [form, setForm] = React.useState({ status: "hadir", judul_kegiatan: "", isi_laporan: "", foto: "" });
  const [submitted, setSubmitted] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (edit && data) {
      setForm({
        status: data.status || "hadir",
        judul_kegiatan: data.judul_kegiatan || "",
        isi_laporan: data.isi_laporan || "",
        foto: data.foto || "",
      });
    }
  }, [edit, data]);

  const izin = form.status === "izin";
  const label = {
    judul: izin ? "Alasan izin" : "Judul kegiatan",
    isi: izin ? "Keterangan izin" : "Deskripsi kegiatan",
    foto: izin ? "Bukti izin" : "Foto dokumentasi",
  };
  const kosong = (k) => !String(form[k] || "").trim();
  const err = (k, l) => (submitted && kosong(k) ? `${l} wajib diisi` : undefined);
  const ubah = (e, { name, value }) => setForm((f) => ({ ...f, [name]: value }));

  const simpan = async () => {
    setSubmitted(true);
    setError("");
    if (["judul_kegiatan", "isi_laporan", "foto"].some(kosong)) return;
    setLoading(true);
    try {
      const res = edit
        ? await updateLaporanPkl(id, {
            ...form,
            longtitude: data?.longtitude ?? LOKASI_DEFAULT.longtitude,
            latitude: data?.latitude ?? LOKASI_DEFAULT.latitude,
          })
        : await createLaporanPkl({ ...form, ...LOKASI_DEFAULT, is_absen: !izin });
      toast.success(res.data?.msg || "Laporan tersimpan");
      queryClient.invalidateQueries(KEY_LIST);
      queryClient.invalidateQueries(KEY_DETAIL);
      onClose();
    } catch (e) {
      setError(errMsg(e, "Gagal menyimpan laporan"));
    } finally {
      setLoading(false);
    }
  };

  const siap = !edit || !!data;

  return (
    <Modal open onClose={() => !loading && onClose()} size="small" closeIcon>
      <Modal.Header>{edit ? "Edit Laporan PKL" : "Buat Laporan PKL"}</Modal.Header>
      <Modal.Content scrolling>
        {isError ? (
          <Message negative content="Gagal mengambil data laporan" />
        ) : !siap || isLoading ? (
          <div className="py-10 text-center text-gray-500">
            <Icon name="spinner" loading /> Memuat data...
          </div>
        ) : (
          <>
            <div className="mb-4 rounded bg-gray-50 p-3 text-sm">
              Tanggal: <b>{formatTanggalIndo(edit ? data?.tanggal : dayjs().format("YYYY-MM-DD"))}</b>
            </div>
            <Form>
              {!edit && (
                <Form.Field>
                  <label>Kehadiran</label>
                  <Button.Group fluid>
                    <Button
                      type="button"
                      positive={!izin}
                      onClick={() => setForm((f) => ({ ...f, status: "hadir" }))}
                      content="Hadir"
                      icon="calendar check outline"
                    />
                    <Button
                      type="button"
                      negative={izin}
                      onClick={() => setForm((f) => ({ ...f, status: "izin" }))}
                      content="Izin"
                      icon="calendar times outline"
                    />
                  </Button.Group>
                </Form.Field>
              )}
              <Form.Input
                required
                label={label.judul}
                name="judul_kegiatan"
                placeholder={izin ? "Contoh: Sakit" : "Contoh: Instalasi jaringan kantor"}
                value={form.judul_kegiatan}
                onChange={ubah}
                error={err("judul_kegiatan", label.judul)}
              />
              <Form.TextArea
                required
                rows={4}
                label={label.isi}
                name="isi_laporan"
                placeholder={izin ? "Keterangan tambahan" : "Apa yang antum kerjakan hari ini?"}
                value={form.isi_laporan}
                onChange={ubah}
                error={err("isi_laporan", label.isi)}
              />
              <Form.Field required error={!!err("foto", label.foto)}>
                <label>{label.foto}</label>
                {form.foto ? (
                  <div className="flex items-center gap-3 rounded border p-2">
                    <img src={form.foto} alt="Foto laporan" className="h-16 w-16 rounded object-cover" />
                    <a href={form.foto} target="_blank" rel="noreferrer" className="flex-1 truncate text-sm">
                      {form.foto.split("/").pop()}
                    </a>
                    <Button
                      type="button"
                      size="mini"
                      basic
                      color="red"
                      icon="trash"
                      title="Ganti foto"
                      onClick={() => setForm((f) => ({ ...f, foto: "" }))}
                    />
                  </div>
                ) : (
                  <DropzoneFile handleDrop={(url) => setForm((f) => ({ ...f, foto: url }))} />
                )}
                {err("foto", label.foto) && (
                  <div className="ui pointing red basic label">{err("foto", label.foto)}</div>
                )}
              </Form.Field>
            </Form>
            {error && <Message negative content={error} />}
          </>
        )}
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={onClose} disabled={loading} content="Batal" />
        <Button color="green" loading={loading} disabled={loading || !siap} onClick={simpan} content="Simpan" />
      </Modal.Actions>
    </Modal>
  );
}

/* ---------------- Laporan diniyyah ---------------- */
const SHOLAT = [
  ["sholat_shubuh", "Shubuh"],
  ["sholat_dzuhur", "Dzuhur"],
  ["sholat_ashar", "Ashar"],
  ["sholat_magrib", "Maghrib"],
  ["sholat_isya", "Isya"],
];
const SHOLAT_OPTIONS = [
  { key: "berjamaah", value: "berjamaah", text: "Berjamaah" },
  { key: "sendirian", value: "sendirian", text: "Sendirian" },
  { key: "tidak solat", value: "tidak solat", text: "Tidak sholat" },
];
const DINIYYAH_KOSONG = {
  dzikir_pagi: false,
  dzikir_petang: false,
  sholat_shubuh: "",
  sholat_dzuhur: "",
  sholat_ashar: "",
  sholat_magrib: "",
  sholat_isya: "",
  dari_surat: "",
  sampai_surat: "",
  dari_ayat: "",
  sampai_ayat: "",
};

// laporan: { id, tanggal } laporan harian induknya
export function DiniyyahModal({ laporan, onClose }) {
  const queryClient = useQueryClient();
  const { listDataAlquran } = useList();
  const { data, isLoading, isError } = useQuery(
    [KEY_DINIYYAH, laporan.id],
    () => getLaporanPklDiniyyahDetail(laporan.id),
    { refetchOnWindowFocus: false, select: (r) => r.data.data }
  );
  const [form, setForm] = React.useState(DINIYYAH_KOSONG);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (data) {
      const v = { ...DINIYYAH_KOSONG };
      Object.keys(v).forEach((k) => {
        if (data[k] !== null && data[k] !== undefined) v[k] = data[k];
      });
      setForm(v);
    }
  }, [data]);

  const ubah = (e, { name, value }) => setForm((f) => ({ ...f, [name]: value }));

  const simpan = async () => {
    setError("");
    for (const k of ["dari_ayat", "sampai_ayat"]) {
      if (form[k] !== "" && Number(form[k]) < 1) return setError("Nomor ayat minimal 1");
    }
    setLoading(true);
    const payload = {
      ...form,
      dari_ayat: form.dari_ayat === "" ? null : Number(form.dari_ayat),
      sampai_ayat: form.sampai_ayat === "" ? null : Number(form.sampai_ayat),
      laporan_harian_pkl_id: laporan.id,
    };
    try {
      const res = data?.id
        ? await updateLaporanDiniyyah(data.id, payload)
        : await createLaporanDiniyyah(payload);
      toast.success(res.data?.msg || "Laporan diniyyah tersimpan");
      queryClient.invalidateQueries(KEY_DINIYYAH);
      queryClient.invalidateQueries(KEY_DETAIL);
      onClose();
    } catch (e) {
      setError(errMsg(e, "Gagal menyimpan laporan diniyyah"));
    } finally {
      setLoading(false);
    }
  };

  const surat = (name) => (
    <Form.Field>
      <label>{name === "dari_surat" ? "Dari surat" : "Sampai surat"}</label>
      <ReactSelectAsync
        debounceTimeout={300}
        value={form[name] ? { value: form[name], label: form[name] } : null}
        loadOptions={listDataAlquran}
        onChange={(o) => setForm((f) => ({ ...f, [name]: o?.value || "" }))}
        placeholder="Pilih surat"
        additional={{ page: 1 }}
      />
    </Form.Field>
  );

  return (
    <Modal open onClose={() => !loading && onClose()} size="small" closeIcon>
      <Modal.Header>Laporan Diniyyah</Modal.Header>
      <Modal.Content scrolling>
        {isError ? (
          <Message negative content="Gagal mengambil laporan diniyyah" />
        ) : isLoading ? (
          <div className="py-10 text-center text-gray-500">
            <Icon name="spinner" loading /> Memuat data...
          </div>
        ) : (
          <>
            <div className="mb-4 rounded bg-gray-50 p-3 text-sm">
              Tanggal: <b>{formatTanggalIndo(laporan.tanggal)}</b>
              {data?.id && <span className="ml-2 text-gray-500">(sudah pernah diisi, bisa diperbarui)</span>}
            </div>
            <Form>
              <h4 className="ui dividing header">Tilawah Al-Qur'an</h4>
              <Form.Group widths="equal">
                {surat("dari_surat")}
                <Form.Input type="number" min={1} label="Dari ayat" name="dari_ayat" value={form.dari_ayat} onChange={ubah} />
              </Form.Group>
              <Form.Group widths="equal">
                {surat("sampai_surat")}
                <Form.Input type="number" min={1} label="Sampai ayat" name="sampai_ayat" value={form.sampai_ayat} onChange={ubah} />
              </Form.Group>

              <h4 className="ui dividing header">Sholat 5 Waktu</h4>
              <Form.Group widths="equal">
                {SHOLAT.slice(0, 3).map(([k, l]) => (
                  <Form.Select key={k} label={l} name={k} options={SHOLAT_OPTIONS} placeholder="Pilih" value={form[k]} onChange={ubah} />
                ))}
              </Form.Group>
              <Form.Group widths="equal">
                {SHOLAT.slice(3).map(([k, l]) => (
                  <Form.Select key={k} label={l} name={k} options={SHOLAT_OPTIONS} placeholder="Pilih" value={form[k]} onChange={ubah} />
                ))}
              </Form.Group>

              <h4 className="ui dividing header">Dzikir</h4>
              <Form.Group inline>
                <Form.Field>
                  <Checkbox
                    label="Dzikir pagi"
                    checked={!!form.dzikir_pagi}
                    onChange={(e, d) => setForm((f) => ({ ...f, dzikir_pagi: d.checked }))}
                  />
                </Form.Field>
                <Form.Field>
                  <Checkbox
                    label="Dzikir petang"
                    checked={!!form.dzikir_petang}
                    onChange={(e, d) => setForm((f) => ({ ...f, dzikir_petang: d.checked }))}
                  />
                </Form.Field>
              </Form.Group>
            </Form>
            <Message size="tiny" warning content="Isilah laporan dengan sebenar-benarnya." />
            {error && <Message negative content={error} />}
          </>
        )}
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={onClose} disabled={loading} content="Batal" />
        <Button color="green" loading={loading} disabled={loading || isLoading} onClick={simpan} content="Simpan" />
      </Modal.Actions>
    </Modal>
  );
}
