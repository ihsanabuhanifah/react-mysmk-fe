import React from "react";
import { Modal, Table, Label, Button, Message } from "semantic-ui-react";
import { useQuery } from "react-query";
import { getRiwayatKelas } from "../../../api/guru/siswa";
import { formatDate } from "../../../utils";

const JENIS = {
  pindah: { text: "Pindah Kelas", color: "blue" },
  semester_baru: { text: "Semester Baru", color: "teal" },
  lulus: { text: "Lulus", color: "purple" },
  pindah_sekolah: { text: "Pindah Sekolah", color: "red" },
  nonaktif: { text: "Dinonaktifkan", color: "orange" },
};

const periode = (ta, smt) =>
  ta?.nama_tahun_ajaran ? `${ta.nama_tahun_ajaran} · smt ${smt ?? "-"}` : "";

export default function RiwayatKelasModal({ studentId, onClose }) {
  const { data, isLoading, isError } = useQuery(
    ["siswa/riwayat-kelas", studentId],
    () => getRiwayatKelas(studentId),
    {
      enabled: !!studentId,
      refetchOnWindowFocus: false,
      select: (res) => res.data,
    }
  );

  const riwayat = data?.riwayat || [];
  const rombel = data?.data || [];

  return (
    <Modal open={!!studentId} onClose={onClose} size="large" closeIcon>
      <Modal.Header>
        Riwayat Kelas
        {data?.siswa && (
          <div className="mt-1 text-sm font-normal text-gray-500">
            {data.siswa.nama_siswa} · NIS {data.siswa.nis || "-"}
          </div>
        )}
      </Modal.Header>
      <Modal.Content scrolling>
        {isLoading && <p>Memuat...</p>}
        {isError && <Message negative>Gagal memuat riwayat kelas</Message>}

        {data && (
          <>
            <h4 className="mb-2 font-semibold text-gray-700">Riwayat Perpindahan</h4>
            {riwayat.length === 0 ? (
              <Message info size="small">
                Belum ada perpindahan tercatat. Riwayat mulai dicatat sejak fitur
                Pindah Kelas / Nonaktifkan digunakan.
              </Message>
            ) : (
              <Table celled compact unstackable>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Tanggal</Table.HeaderCell>
                    <Table.HeaderCell>Jenis</Table.HeaderCell>
                    <Table.HeaderCell>Dari</Table.HeaderCell>
                    <Table.HeaderCell>Ke</Table.HeaderCell>
                    <Table.HeaderCell>Oleh</Table.HeaderCell>
                    <Table.HeaderCell>Keterangan</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {riwayat.map((r) => {
                    const j = JENIS[r.jenis] || { text: r.jenis };
                    return (
                      <Table.Row key={r.id}>
                        <Table.Cell className="whitespace-nowrap">
                          {formatDate(r.createdAt)}
                        </Table.Cell>
                        <Table.Cell>
                          <Label size="tiny" color={j.color}>
                            {j.text}
                          </Label>
                        </Table.Cell>
                        <Table.Cell>
                          <div>{r.dari_kelas?.nama_kelas || "-"}</div>
                          <div className="text-xs text-gray-500">
                            {periode(r.dari_ta, r.dari_semester)}
                          </div>
                        </Table.Cell>
                        <Table.Cell>
                          <div>{r.ke_kelas?.nama_kelas || "-"}</div>
                          <div className="text-xs text-gray-500">
                            {periode(r.ke_ta, r.ke_semester)}
                          </div>
                        </Table.Cell>
                        <Table.Cell>{r.oleh?.name || "-"}</Table.Cell>
                        <Table.Cell>{r.keterangan || "-"}</Table.Cell>
                      </Table.Row>
                    );
                  })}
                </Table.Body>
              </Table>
            )}

            <h4 className="mb-2 mt-5 font-semibold text-gray-700">Kelas per Semester</h4>
            {rombel.length === 0 ? (
              <Message info size="small">Belum ada data kelas untuk siswa ini.</Message>
            ) : (
              <Table celled compact unstackable>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Tahun Ajaran</Table.HeaderCell>
                    <Table.HeaderCell>Semester</Table.HeaderCell>
                    <Table.HeaderCell>Kelas</Table.HeaderCell>
                    <Table.HeaderCell>Status</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {rombel.map((r) => (
                    <Table.Row key={r.id} positive={Number(r.status) === 1}>
                      <Table.Cell>{r.tahun_ajaran?.nama_tahun_ajaran || "-"}</Table.Cell>
                      <Table.Cell>{r.semester}</Table.Cell>
                      <Table.Cell>{r.kelas?.nama_kelas || "-"}</Table.Cell>
                      <Table.Cell>
                        {Number(r.status) === 1 ? (
                          <Label color="green" size="tiny">Aktif</Label>
                        ) : (
                          <Label size="tiny">Tidak aktif</Label>
                        )}
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            )}
          </>
        )}
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={onClose}>Tutup</Button>
      </Modal.Actions>
    </Modal>
  );
}
