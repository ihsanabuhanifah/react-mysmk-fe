import React from "react";
import { WaliPage } from "../../layout/wali";
import { useProfileWali, getWaliToken, useGantiPassword } from "../../api/wali";
import { logout } from "../../api/tokenManager";
import { Card, DataState, tanggalIndo } from "./shared";
import { APP_VERSION, BUILD_LABEL } from "../../utils/appVersion";

const Baris = ({ label, value }) => (
  <div className="grid grid-cols-5 gap-2 border-b py-2.5 text-sm last:border-0">
    <dt className="col-span-2 text-gray-500">{label}</dt>
    <dd className="col-span-3 m-0 font-medium">{value || "-"}</dd>
  </div>
);

export default function ProfilWali() {
  const token = getWaliToken();
  const { data, isLoading, isError } = useProfileWali();
  const s = data?.siswa;

  return (
    <WaliPage title="Profil" subtitle="Data santri dan akun wali">
      <div className="grid gap-4 lg:grid-cols-3">
        <Card title="Data santri" className="lg:col-span-2">
          <DataState isLoading={isLoading} isError={isError} data={s || data?.nama_siswa} empty="Data santri belum tersedia">
            <dl className="m-0">
              <Baris label="Nama lengkap" value={s?.nama_siswa || data?.nama_siswa} />
              <Baris label="Kelas" value={data?.kelas} />
              <Baris label="NIS" value={s?.nis} />
              <Baris label="NISN" value={s?.nisn} />
              <Baris
                label="Tempat, tanggal lahir"
                value={[s?.tempat_lahir, s?.tanggal_lahir && tanggalIndo(s.tanggal_lahir)].filter(Boolean).join(", ")}
              />
              <Baris label="Jenis kelamin" value={s?.jenis_kelamin} />
              <Baris label="Angkatan" value={s?.angkatan} />
              <Baris label="Alamat" value={s?.alamat} />
            </dl>
          </DataState>
        </Card>

        <Card title="Akun wali">
          <dl className="m-0">
            <Baris label="Nama" value={token?.name} />
            <Baris label="Email" value={token?.email} />
            <Baris label="Hubungan" value={data?.parent?.hubungan} />
          </dl>
          <p className="m-0 mt-3 text-xs text-gray-500">
            Jika ada data yang tidak sesuai, silakan hubungi bagian tata usaha sekolah.
          </p>
        </Card>

        <GantiPassword />

        <Card title="Tentang aplikasi">
          <dl className="m-0">
            <Baris label="Aplikasi" value="MySMK" />
            <Baris label="Versi" value={APP_VERSION} />
            <Baris label="Build" value={BUILD_LABEL} />
          </dl>
        </Card>
      </div>
    </WaliPage>
  );
}

const inputCls =
  "w-full rounded-lg border border-gray-300 px-3 py-2 text-base md:text-sm focus:border-[#18a558] focus:outline-none";

function GantiPassword() {
  const ganti = useGantiPassword();
  const kosong = { oldPassword: "", newPassword: "", ulangi: "" };
  const [form, setForm] = React.useState(kosong);
  const [lihat, setLihat] = React.useState(false);
  const [pesan, setPesan] = React.useState(null);

  const ubah = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const kirim = async (e) => {
    e.preventDefault();
    setPesan(null);
    if (form.newPassword.length < 8) return setPesan({ ok: false, teks: "Password baru minimal 8 karakter." });
    if (form.newPassword !== form.ulangi) return setPesan({ ok: false, teks: "Ulangi password baru tidak sama." });
    try {
      await ganti.mutateAsync({ oldPassword: form.oldPassword, newPassword: form.newPassword });
      setForm(kosong);
      setPesan({ ok: true, teks: "Password berhasil diganti. Silakan masuk lagi dengan password baru…" });
      // server sudah mencabut semua sesi -> keluar & masuk ulang
      setTimeout(() => logout(), 2000);
    } catch (err) {
      setPesan({ ok: false, teks: err?.response?.data?.msg || "Gagal mengganti password. Coba lagi." });
    }
  };

  const tipe = lihat ? "text" : "password";
  return (
    <Card title="Ganti password" className="lg:col-span-2">
      <form onSubmit={kirim} className="grid gap-3 md:grid-cols-3" autoComplete="off">
        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-gray-600">Password lama</span>
          <input type={tipe} name="oldPassword" required autoComplete="current-password" value={form.oldPassword} onChange={ubah} className={inputCls} />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-gray-600">Password baru (min. 8 karakter)</span>
          <input type={tipe} name="newPassword" required minLength={8} autoComplete="new-password" value={form.newPassword} onChange={ubah} className={inputCls} />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-gray-600">Ulangi password baru</span>
          <input type={tipe} name="ulangi" required minLength={8} autoComplete="new-password" value={form.ulangi} onChange={ubah} className={inputCls} />
        </label>
        <div className="flex flex-wrap items-center gap-3 md:col-span-3">
          <button
            type="submit"
            disabled={ganti.isLoading}
            className="min-h-[44px] rounded-lg bg-[#18a558] px-4 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
          >
            {ganti.isLoading ? "Menyimpan…" : "Simpan password baru"}
          </button>
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input type="checkbox" checked={lihat} onChange={(e) => setLihat(e.target.checked)} />
            Tampilkan password
          </label>
        </div>
        {pesan && (
          <p className={`m-0 rounded-lg px-3 py-2 text-sm md:col-span-3 ${pesan.ok ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
            {pesan.teks}
          </p>
        )}
        <p className="m-0 text-xs text-gray-500 md:col-span-3">
          Setelah password diganti, Anda akan keluar dari semua perangkat dan perlu masuk lagi.
        </p>
      </form>
    </Card>
  );
}
