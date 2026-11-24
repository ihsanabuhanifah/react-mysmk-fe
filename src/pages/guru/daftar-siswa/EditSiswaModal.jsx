import React from "react";
import { Modal, Form, Button, Message, Icon } from "semantic-ui-react";
import { useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { getSiswaById, updateSiswaKelasHandle } from "../../../api/guru/siswa";

const errMsg = (err, fallback) => err?.response?.data?.msg || fallback;

// Field wajib: selain ini boleh dikosongkan (NIK & NIS banyak yang belum ada datanya)
const WAJIB = ["nama_siswa", "email", "nisn", "tempat_lahir", "tanggal_lahir"];

const JENIS_KELAMIN = [
  { key: "l", value: "laki-laki", text: "Laki-laki" },
  { key: "p", value: "perempuan", text: "Perempuan" },
];

const tahunAjaranOptions = () => {
  const now = new Date().getFullYear();
  return Array.from({ length: now - 2021 + 2 }, (_, i) => {
    const t = `${2021 + i}/${2022 + i}`;
    return { key: t, value: t, text: t };
  });
};

// Kolom DATETIME -> "YYYY-MM-DD" untuk <input type="date"> (pakai tanggal lokal, bukan UTC)
const toDateInput = (v) => {
  if (!v) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v;
  const d = new Date(v);
  if (isNaN(d)) return "";
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
};

const kosong = (v) => v === null || v === undefined || String(v).trim() === "";

/**
 * Modal edit data siswa (Daftar Siswa).
 * siswa: { id, nama } | null — null berarti modal tertutup.
 */
export default function EditSiswaModal({ siswa, onClose }) {
  const queryClient = useQueryClient();
  const [form, setForm] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);

  const { isLoading, isError } = useQuery(
    ["/guru/siswa/detail", siswa?.id],
    () => getSiswaById(siswa.id),
    {
      enabled: !!siswa?.id,
      refetchOnWindowFocus: false,
      cacheTime: 0,
      onSuccess: (res) => {
        const s = res.data?.siswa || {};
        setForm({
          user_id: s.user_id,
          nama_siswa: s.nama_siswa || "",
          email: s.user?.email || "",
          nik: s.nik || "",
          nis: s.nis || "",
          nisn: s.nisn || "",
          tempat_lahir: s.tempat_lahir || "",
          tanggal_lahir: toDateInput(s.tanggal_lahir),
          jenis_kelamin: s.jenis_kelamin || "",
          anak_ke: s.anak_ke ?? "",
          alamat: s.alamat || "",
          sekolah_asal: s.sekolah_asal || "",
          tanggal_diterima: toDateInput(s.tanggal_diterima),
          angkatan: s.angkatan || "",
          tahun_ajaran: s.tahun_ajaran || "",
        });
      },
    },
  );

  React.useEffect(() => {
    setForm(null);
    setError("");
    setSubmitted(false);
  }, [siswa?.id]);

  if (!siswa) return null;

  const ubah = (e, { name, value }) => setForm((f) => ({ ...f, [name]: value }));

  const wajibKosong = form ? WAJIB.filter((k) => kosong(form[k])) : [];
  const jumlahKosong = form
    ? Object.keys(form).filter((k) => k !== "user_id" && kosong(form[k])).length
    : 0;

  // props bersama: field wajib ditandai *, field kosong diberi warna kuning,
  // field wajib yang kosong setelah klik Simpan diberi warna merah
  const f = (name, label, extra = {}) => {
    const wajib = WAJIB.includes(name);
    const isKosong = form && kosong(form[name]);
    return {
      name,
      label,
      required: wajib,
      value: form?.[name] ?? "",
      onChange: ubah,
      className: isKosong ? "field-kosong" : "",
      error: submitted && wajib && isKosong ? `${label} wajib diisi` : undefined,
      ...extra,
    };
  };

  const simpan = async () => {
    setSubmitted(true);
    setError("");
    if (wajibKosong.length) return;
    setLoading(true);
    try {
      const res = await updateSiswaKelasHandle(siswa.id, form);
      toast.success(res.data?.msg || "Data siswa tersimpan");
      queryClient.invalidateQueries("siswa/list");
      queryClient.invalidateQueries(`/guru/siswa/detail/${siswa.id}`);
      onClose();
    } catch (err) {
      setError(errMsg(err, "Gagal menyimpan data siswa"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open onClose={() => !loading && onClose()} size="small" closeIcon>
      <style>{`
        .field-kosong input, .field-kosong .ui.dropdown, .field-kosong textarea {
          background: #fffbeb !important; border-color: #fbbf24 !important;
        }
      `}</style>
      <Modal.Header>Edit Data Siswa</Modal.Header>
      <Modal.Content scrolling>
        {isLoading || !form ? (
          isError ? (
            <Message negative content="Gagal mengambil data siswa" />
          ) : (
            <div className="py-10 text-center text-gray-500">
              <Icon name="spinner" loading /> Memuat data...
            </div>
          )
        ) : (
          <>
            <div className="mb-4 rounded bg-gray-50 p-3 text-sm">
              <b>{siswa.nama}</b>
              {jumlahKosong > 0 ? (
                <div className="mt-1 text-amber-700">
                  <Icon name="info circle" />
                  {jumlahKosong} data masih kosong (ditandai kuning). Field bertanda{" "}
                  <span className="text-red-600">*</span> wajib diisi.
                </div>
              ) : (
                <div className="mt-1 text-green-700">
                  <Icon name="check circle" /> Semua data sudah lengkap.
                </div>
              )}
            </div>

            <Form>
              <h4 className="ui dividing header">Data Pribadi</h4>
              <Form.Input {...f("nama_siswa", "Nama siswa")} />
              <Form.Group widths="equal">
                <Form.Input {...f("email", "Email (untuk login)", { type: "email" })} />
                <Form.Input {...f("nisn", "NISN")} />
              </Form.Group>
              <Form.Group widths="equal">
                <Form.Input {...f("nis", "NIS")} />
                <Form.Input {...f("nik", "NIK")} />
              </Form.Group>
              <Form.Group widths="equal">
                <Form.Input {...f("tempat_lahir", "Tempat lahir")} />
                <Form.Input {...f("tanggal_lahir", "Tanggal lahir", { type: "date" })} />
              </Form.Group>
              <Form.Group widths="equal">
                <Form.Select
                  {...f("jenis_kelamin", "Jenis kelamin", {
                    options: JENIS_KELAMIN,
                    placeholder: "Pilih",
                  })}
                />
                <Form.Input
                  {...f("anak_ke", "Anak ke-", { type: "number", min: 1 })}
                />
              </Form.Group>
              <Form.TextArea {...f("alamat", "Alamat", { rows: 2 })} />

              <h4 className="ui dividing header">Data Sekolah</h4>
              <Form.Input {...f("sekolah_asal", "Sekolah asal")} />
              <Form.Group widths="equal">
                <Form.Input {...f("tanggal_diterima", "Tanggal diterima", { type: "date" })} />
                <Form.Input {...f("angkatan", "Angkatan ke-")} />
              </Form.Group>
              <Form.Select
                {...f("tahun_ajaran", "Tahun ajaran masuk", {
                  options: tahunAjaranOptions(),
                  placeholder: "Pilih",
                  clearable: true,
                })}
              />
            </Form>

            {submitted && wajibKosong.length > 0 && (
              <Message negative size="small" content="Lengkapi field wajib yang ditandai merah." />
            )}
            {error && <Message negative content={error} />}
          </>
        )}
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={onClose} disabled={loading} content="Batal" />
        <Button
          color="green"
          loading={loading}
          disabled={loading || !form}
          onClick={simpan}
          content="Simpan"
        />
      </Modal.Actions>
    </Modal>
  );
}
