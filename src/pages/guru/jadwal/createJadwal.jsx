import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Form, Select, Button, Icon, Message } from "semantic-ui-react";
import LayoutPage from "../../../module/layoutPage";
import useList from "../../../hook/useList";
import { DeleteButton } from "../../../components";
import { getOptions } from "../../../utils/format";
import { createJadwalHandle } from "../../../api/guru/absensi";
import { dayOptions } from ".";

const toastOpt = { position: "top-right", autoClose: 2000, theme: "colored" };
const angka = (n) => Array.from({ length: n }, (_, i) => ({ key: i + 1, value: i + 1, text: i + 1 }));
const hariOptions = dayOptions.filter((d) => d.value !== "semua");

const headerKosong = { hari: "", kelas_id: "", semester: "", ta_id: "" };
const barisKosong = (jam_ke = "") => ({ teacher_id: "", mapel_id: "", jam_ke, jumlah_jam: 2 });

// jam berikutnya = jam_ke + jumlah_jam dari baris terakhir
const jamBerikutnya = (rows) => {
  const last = rows[rows.length - 1];
  if (!last?.jam_ke || !last?.jumlah_jam) return "";
  const next = Number(last.jam_ke) + Number(last.jumlah_jam);
  return next <= 12 ? next : "";
};

export function CreateJadwal() {
  const navigate = useNavigate();
  const { dataKelas, dataGuru, dataMapel, dataTa } = useList();
  const [header, setHeader] = React.useState(headerKosong);
  const [rows, setRows] = React.useState([barisKosong(1)]);
  const [konflik, setKonflik] = React.useState([]);
  const [saving, setSaving] = React.useState(false);

  const setH = (key, value) => {
    // mapel tergantung semester → kosongkan mapel kalau semester berubah
    if (key === "semester" && value !== header.semester) {
      setRows((r) => r.map((x) => ({ ...x, mapel_id: "" })));
    }
    setHeader((h) => ({ ...h, [key]: value }));
  };
  const setR = (index, key, value) =>
    setRows((r) => r.map((x, i) => (i === index ? { ...x, [key]: value } : x)));

  const mapelOptions = getOptions(
    dataMapel?.data?.filter((m) => Number(m.kategori) === Number(header.semester)),
    "nama_mapel"
  );
  const guruOptions = getOptions(dataGuru?.data, "nama_guru");
  const headerLengkap = Object.values(header).every(Boolean);
  const konflikBaris = (i) => konflik.filter((k) => k.baris === i + 1);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!headerLengkap) {
      return toast.warn("Lengkapi hari, kelas, semester, dan tahun ajaran", toastOpt);
    }
    setSaving(true);
    setKonflik([]);
    try {
      const data = rows.map((r) => ({ ...header, ...r, student: "", status: 1 }));
      const response = await createJadwalHandle({ data });
      toast.success(response?.data?.msg, toastOpt);
      // header tetap, supaya bisa langsung lanjut kelas/hari berikutnya
      setRows([barisKosong(1)]);
    } catch (err) {
      if (err?.response?.status === 422) {
        setKonflik(err?.response?.data?.konflik || []);
        toast.warn(err?.response?.data?.msg, toastOpt);
      } else {
        toast.error("Ada Kesalahan", toastOpt);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <LayoutPage title={"Tambah Jadwal"}>
      <Form onSubmit={onSubmit}>
        <section className="rounded-lg border border-[#80DFDF] bg-[#E6F9F9] p-5 mb-5">
          <p className="mb-3 font-semibold text-[#008080]">
            Buatlah jadwal per kelas per hari
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-x-5 gap-y-2">
            <Form.Dropdown
              selection
              search
              label="Hari"
              placeholder="Pilih Hari"
              options={hariOptions}
              value={header.hari}
              onChange={(e, d) => setH("hari", d.value)}
            />
            <Form.Field
              control={Select}
              search
              label="Kelas"
              placeholder="Pilih Kelas"
              options={getOptions(dataKelas?.data, "nama_kelas")}
              value={header.kelas_id}
              onChange={(e, d) => setH("kelas_id", d.value)}
            />
            <Form.Dropdown
              selection
              label="Semester"
              placeholder="Pilih"
              options={angka(6)}
              value={header.semester}
              onChange={(e, d) => setH("semester", d.value)}
            />
            <Form.Field
              control={Select}
              search
              label="Tahun Pelajaran"
              placeholder="Pilih Tahun Pelajaran"
              options={getOptions(dataTa?.data, "nama_tahun_ajaran")}
              value={header.ta_id}
              onChange={(e, d) => setH("ta_id", d.value)}
            />
          </div>
        </section>

        {konflik.some((k) => k.baris === 0) && (
          <Message warning content={konflik.find((k) => k.baris === 0)?.pesan} />
        )}

        <section className="space-y-3">
          <div className="hidden md:grid grid-cols-12 gap-3 px-3 text-sm font-semibold text-gray-600">
            <div className="col-span-1">No</div>
            <div className="col-span-4">Guru</div>
            <div className="col-span-3">Mata Pelajaran</div>
            <div className="col-span-2">Jam Ke</div>
            <div className="col-span-1">Jml Jam</div>
          </div>
          {rows.map((row, index) => (
            <div
              key={index}
              className={`rounded-lg border p-3 ${konflikBaris(index).length ? "border-red-300 bg-red-50" : "border-gray-200"}`}
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <div className="col-span-1 font-semibold">{index + 1}</div>
                <div className="md:col-span-4">
                  <Form.Field
                    control={Select}
                    search
                    fluid
                    placeholder="Pilih Guru"
                    options={guruOptions}
                    value={row.teacher_id}
                    onChange={(e, d) => setR(index, "teacher_id", d.value)}
                  />
                </div>
                <div className="md:col-span-3">
                  <Form.Field
                    control={Select}
                    search
                    fluid
                    disabled={!header.semester}
                    placeholder={header.semester ? "Pilih Mapel" : "Pilih semester dulu"}
                    options={mapelOptions}
                    value={row.mapel_id}
                    onChange={(e, d) => setR(index, "mapel_id", d.value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <Form.Dropdown
                    selection
                    fluid
                    placeholder="Jam ke"
                    options={angka(12)}
                    value={row.jam_ke}
                    onChange={(e, d) => setR(index, "jam_ke", d.value)}
                  />
                </div>
                <div className="md:col-span-1">
                  <Form.Dropdown
                    selection
                    fluid
                    placeholder="Jml"
                    options={angka(8)}
                    value={row.jumlah_jam}
                    onChange={(e, d) => setR(index, "jumlah_jam", d.value)}
                  />
                </div>
                <div className="md:col-span-1 flex justify-end">
                  <DeleteButton
                    disabled={rows.length <= 1}
                    size="small"
                    onClick={() => setRows((r) => r.filter((_, i) => i !== index))}
                  />
                </div>
              </div>
              {konflikBaris(index).map((k, i) => (
                <p key={i} className="mt-2 text-sm text-red-600">
                  {k.pesan}
                </p>
              ))}
            </div>
          ))}
        </section>

        <div className="my-5">
          <Button
            basic
            fluid
            type="button"
            color="teal"
            icon="add"
            labelPosition="left"
            content="Tambah Baris"
            onClick={() => setRows((r) => [...r, barisKosong(jamBerikutnya(r))])}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Button type="button" fluid content="Kembali" onClick={() => navigate("/guru/jadwal")} />
          <Button
            type="submit"
            fluid
            color="teal"
            icon={() => <Icon name="save" />}
            content={saving ? "Menyimpan" : `Simpan ${rows.length} Jadwal`}
            loading={saving}
            disabled={saving}
          />
        </div>
      </Form>
    </LayoutPage>
  );
}
