import React from "react";
import { Icon, Label, Modal, Button, Message, Placeholder } from "semantic-ui-react";
import { formatTanggalIndo } from "../utils/formatTanggal";

const isi = (v) => (v === null || v === undefined || v === "" ? "-" : v);

/**
 * Modal detail laporan harian PKL (dipakai santri & guru).
 * open, onClose, data (detail laporan), isLoading, isError
 */
export default function LaporanPklDetailModal({ open, onClose, data, isLoading, isError }) {
  const [imgLoaded, setImgLoaded] = React.useState(false);
  React.useEffect(() => setImgLoaded(false), [data?.id]);

  const izin = data?.status === "izin";
  const din = data?.laporan_diniyyah_harian?.[0];

  return (
    <Modal open={open} onClose={onClose} size="small" closeIcon>
      <Modal.Header>Detail Laporan PKL</Modal.Header>
      <Modal.Content scrolling>
        {isError ? (
          <Message negative content="Gagal mengambil detail laporan" />
        ) : isLoading || !data ? (
          <Placeholder fluid>
            <Placeholder.Image rectangular />
            <Placeholder.Paragraph>
              <Placeholder.Line />
              <Placeholder.Line />
            </Placeholder.Paragraph>
          </Placeholder>
        ) : (
          <>
            <div className="mb-4 rounded bg-gray-50 p-3 text-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <b>{data?.siswa?.nama_siswa}</b>
                <Label size="small" color={izin ? "red" : "green"}>
                  <Icon name={izin ? "calendar times outline" : "calendar check outline"} />
                  {izin ? "Izin" : "Hadir"}
                </Label>
              </div>
              <div className="mt-1 text-gray-500">{formatTanggalIndo(data?.tanggal)}</div>
            </div>

            {data?.foto && (
              <div className="mb-4 flex justify-center">
                {!imgLoaded && (
                  <Placeholder style={{ width: "100%", height: 240 }}>
                    <Placeholder.Image rectangular />
                  </Placeholder>
                )}
                <a href={data.foto} target="_blank" rel="noreferrer">
                  <img
                    src={data.foto}
                    alt={`Foto laporan ${data?.siswa?.nama_siswa} tanggal ${data?.tanggal}`}
                    onLoad={() => setImgLoaded(true)}
                    className="max-h-72 w-full rounded-lg object-contain"
                    style={{ display: imgLoaded ? "block" : "none" }}
                  />
                </a>
              </div>
            )}

            <h4 className="ui dividing header">{izin ? "Alasan Izin" : "Kegiatan"}</h4>
            <p className="mb-1 font-semibold">{data?.judul_kegiatan || "Belum ada judul"}</p>
            <p className="whitespace-pre-line text-gray-700">{data?.isi_laporan || "Belum ada isi laporan"}</p>

            <h4 className="ui dividing header">Laporan Diniyyah</h4>
            {din ? (
              <table className="ui very basic compact unstackable table">
                <tbody>
                  <Baris label="Tilawah">
                    {isi(din.dari_surat)} ayat {isi(din.dari_ayat)} s.d. {isi(din.sampai_surat)} ayat{" "}
                    {isi(din.sampai_ayat)}
                  </Baris>
                  <Baris label="Dzikir pagi">{din.dzikir_pagi ? "Sudah" : "Belum"}</Baris>
                  <Baris label="Dzikir petang">{din.dzikir_petang ? "Sudah" : "Belum"}</Baris>
                  <Baris label="Shubuh">{isi(din.sholat_shubuh)}</Baris>
                  <Baris label="Dzuhur">{isi(din.sholat_dzuhur)}</Baris>
                  <Baris label="Ashar">{isi(din.sholat_ashar)}</Baris>
                  <Baris label="Maghrib">{isi(din.sholat_magrib)}</Baris>
                  <Baris label="Isya">{isi(din.sholat_isya)}</Baris>
                </tbody>
              </table>
            ) : (
              <Message size="small" warning content="Laporan diniyyah belum diisi." />
            )}
          </>
        )}
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={onClose} content="Tutup" />
      </Modal.Actions>
    </Modal>
  );
}

function Baris({ label, children }) {
  return (
    <tr>
      <td className="w-36 text-gray-500">{label}</td>
      <td className="capitalize">{children}</td>
    </tr>
  );
}
