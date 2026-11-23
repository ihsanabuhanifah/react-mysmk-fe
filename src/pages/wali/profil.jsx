import React from "react";
import { WaliPage } from "../../layout/wali";
import { useProfileWali, getWaliToken } from "../../api/wali";
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
