// Halaman perizinan wali: dipakai untuk izin kunjungan & izin pulang.
import React from "react";
import { WaliPage } from "../../layout/wali";
import { useIzinList, useSimpanIzin } from "../../api/wali";
import { Card, Badge, DataState, tanggalIndo } from "./shared";

const CONFIG = {
  kunjungan: {
    title: "Izin Kunjungan",
    subtitle: "Ajukan jadwal menjenguk ananda di asrama",
    kosong: { tanggal: "", kepentingan: "" },
    approver: (r) => r.kunjungan_approv_by?.nama_guru,
    ringkas: (r) => tanggalIndo(r.tanggal, { hari: true }),
  },
  pulang: {
    title: "Izin Pulang",
    subtitle: "Ajukan izin membawa ananda pulang",
    kosong: { izin_dari: "", izin_sampai: "", kepentingan: "" },
    approver: (r) => r.pulang_approv_by?.nama_guru,
    ringkas: (r) => `${tanggalIndo(r.izin_dari)} – ${tanggalIndo(r.izin_sampai)}`,
  },
};

const inputCls =
  "w-full rounded-lg border border-gray-300 px-3 py-2 text-base md:text-sm focus:border-[#18a558] focus:outline-none";
const hariIni = () => new Date().toLocaleDateString("en-CA");
const tgl = (v) => (v ? String(v).slice(0, 10) : "");

export default function IzinWali({ jenis }) {
  const cfg = CONFIG[jenis];
  const { data = [], isLoading, isError } = useIzinList(jenis);
  const simpan = useSimpanIzin(jenis);
  const [form, setForm] = React.useState(cfg.kosong);
  const [editId, setEditId] = React.useState(null);
  const [pesan, setPesan] = React.useState(null);

  React.useEffect(() => {
    setForm(CONFIG[jenis].kosong);
    setEditId(null);
    setPesan(null);
  }, [jenis]);

  const ubah = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const mulaiEdit = (r) => {
    setEditId(r.id);
    setPesan(null);
    setForm(
      jenis === "kunjungan"
        ? { tanggal: tgl(r.tanggal), kepentingan: r.kepentingan || "" }
        : { izin_dari: tgl(r.izin_dari), izin_sampai: tgl(r.izin_sampai), kepentingan: r.kepentingan || "" }
    );
    window.scrollTo?.({ top: 0, behavior: "smooth" });
  };

  const batal = () => {
    setEditId(null);
    setForm(cfg.kosong);
  };

  const kirim = async (e) => {
    e.preventDefault();
    setPesan(null);
    if (jenis === "pulang" && form.izin_sampai < form.izin_dari) {
      return setPesan({ ok: false, teks: "Tanggal antar tidak boleh sebelum tanggal jemput." });
    }
    try {
      await simpan.mutateAsync({ id: editId, ...form });
      setPesan({ ok: true, teks: editId ? "Pengajuan berhasil diperbarui." : "Pengajuan terkirim. Mohon tunggu konfirmasi dari sekolah." });
      batal();
    } catch (err) {
      const msg = err?.response?.data?.msg || "Pengajuan gagal dikirim. Coba lagi.";
      setPesan({ ok: false, teks: msg });
    }
  };

  return (
    <WaliPage title={cfg.title} subtitle={cfg.subtitle}>
      <div className="grid gap-4 lg:grid-cols-5">
        <Card title={editId ? "Ubah pengajuan" : "Pengajuan baru"} className="lg:col-span-2">
          <form onSubmit={kirim} className="space-y-3">
            {jenis === "kunjungan" ? (
              <Field label="Tanggal kunjungan">
                <input type="date" name="tanggal" required min={editId ? undefined : hariIni()} value={form.tanggal} onChange={ubah} className={inputCls} />
              </Field>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Field label="Tanggal jemput">
                  <input type="date" name="izin_dari" required min={editId ? undefined : hariIni()} value={form.izin_dari} onChange={ubah} className={inputCls} />
                </Field>
                <Field label="Tanggal antar kembali">
                  <input type="date" name="izin_sampai" required min={form.izin_dari || hariIni()} value={form.izin_sampai} onChange={ubah} className={inputCls} />
                </Field>
              </div>
            )}
            <Field label="Keperluan">
              <textarea
                name="kepentingan"
                required
                maxLength={255}
                rows={3}
                value={form.kepentingan}
                onChange={ubah}
                placeholder={jenis === "kunjungan" ? "Contoh: menjenguk dan mengantar perlengkapan" : "Contoh: acara keluarga"}
                className={inputCls}
              />
            </Field>

            {pesan && (
              <p className={`m-0 rounded-lg px-3 py-2 text-sm ${pesan.ok ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                {pesan.teks}
              </p>
            )}

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={simpan.isLoading}
                className="rounded-lg bg-[#18a558] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
              >
                {simpan.isLoading ? "Mengirim…" : editId ? "Simpan perubahan" : "Kirim pengajuan"}
              </button>
              {editId && (
                <button type="button" onClick={batal} className="rounded-lg border px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50">
                  Batal
                </button>
              )}
            </div>
          </form>
        </Card>

        <Card title="Riwayat pengajuan" className="lg:col-span-3">
          <DataState isLoading={isLoading} isError={isError} data={data} empty="Belum ada pengajuan">
            <ul className="m-0 list-none divide-y p-0">
              {data.map((r) => (
                <li key={r.id} className="py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="m-0 font-semibold">{cfg.ringkas(r)}</p>
                      <p className="m-0 mt-0.5 text-sm text-gray-600">{r.kepentingan}</p>
                    </div>
                    <Badge>{r.status_approval}</Badge>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 text-xs text-gray-500">
                    <span>Diajukan {tanggalIndo(r.createdAt)}</span>
                    {cfg.approver(r) && <span>Diproses oleh {cfg.approver(r)}</span>}
                    {jenis === "pulang" && r.status_kepulangan && <span>Kembali: {r.status_kepulangan}</span>}
                    {r.status_approval === "menunggu" && (
                      <button type="button" onClick={() => mulaiEdit(r)} className="font-semibold text-[#18a558] hover:underline">
                        Ubah
                      </button>
                    )}
                  </div>
                  {r.status_approval === "ditolak" && r.alasan_ditolak && (
                    <p className="m-0 mt-1 rounded bg-red-50 px-2 py-1 text-xs text-red-700">Alasan ditolak: {r.alasan_ditolak}</p>
                  )}
                </li>
              ))}
            </ul>
          </DataState>
        </Card>
      </div>
    </WaliPage>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-gray-600">{label}</span>
      {children}
    </label>
  );
}
