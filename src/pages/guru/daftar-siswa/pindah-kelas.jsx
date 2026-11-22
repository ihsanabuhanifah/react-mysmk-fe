import React from "react";
import {
  Button,
  Checkbox,
  Dropdown,
  Form,
  Input,
  Message,
  Modal,
  Table,
} from "semantic-ui-react";
import {
  MdCheckCircle,
  MdChevronRight,
  MdClass,
  MdExitToApp,
  MdPersonAddAlt1,
} from "react-icons/md";
import { useQuery, useQueryClient } from "react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import LayoutPage from "../../../module/layoutPage";
import { AksiButton } from "../../../components";
import { listTahunAjaran } from "../../../api/list";
import {
  getRingkasanKelas,
  listAnggotaKelas,
  listSiswaTanpaKelas,
  pindahKelasHandle,
} from "../../../api/guru/siswa";
import { checkRole } from "../../../utils";
import useList from "../../../hook/useList";
import RiwayatKelasModal from "./RiwayatKelasModal";

const STEPS = ["Kelas Asal", "Pilih Siswa", "Kelas Tujuan", "Konfirmasi"];

const isAlumniKelas = (k) => !k?.pindahSekolah && /alumni/i.test(k?.nama_kelas || "");

// Tujuan khusus: keluar karena pindah sekolah (bukan kelas)
const TUJUAN_PINDAH_SEKOLAH = { id: "pindah-sekolah", nama_kelas: "Pindah Sekolah", pindahSekolah: true };

// Asal khusus: siswa baru yang belum pernah punya kelas
const ASAL_SISWA_BARU = { id: "siswa-baru", nama_kelas: "Siswa Baru", siswaBaru: true };

// Saran semester awal dari tingkat kelas (pola data: X=1, XI=3, XII=5)
const saranSemester = (namaKelas = "") => {
  if (/^XII\b/i.test(namaKelas)) return "5";
  if (/^XI\b/i.test(namaKelas)) return "3";
  if (/^X\b/i.test(namaKelas)) return "1";
  return "";
};

export default function PindahKelas() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { roles } = useList();
  const isAdmin = checkRole(roles, "Admin") || checkRole(roles, "Super Administrator");

  const [step, setStep] = React.useState(0);
  const [asal, setAsal] = React.useState(null); // objek kelas dari ringkasan
  const [selected, setSelected] = React.useState([]); // student_id
  const [tujuan, setTujuan] = React.useState(null); // objek kelas dari ringkasan
  const [semesterBaru, setSemesterBaru] = React.useState(null); // true | false | null
  const [taId, setTaId] = React.useState(null);
  const [semester, setSemester] = React.useState("");
  const [keterangan, setKeterangan] = React.useState("");
  const [sekolahTujuan, setSekolahTujuan] = React.useState("");
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [result, setResult] = React.useState(null);
  const [riwayatId, setRiwayatId] = React.useState(null);

  const { data: kelasList = [], isLoading: loadingKelas } = useQuery(
    ["siswa/kelas/ringkasan"],
    getRingkasanKelas,
    { refetchOnWindowFocus: false, select: (r) => r.data?.data || [] }
  );
  // Diurutkan berdasarkan nama (id TA tidak selalu kronologis), terlama -> terbaru
  const { data: taList = [] } = useQuery(["list/tahun-ajaran"], listTahunAjaran, {
    refetchOnWindowFocus: false,
    select: (r) =>
      [...(r.data?.data || [])].sort((a, b) =>
        String(a.nama_tahun_ajaran).localeCompare(String(b.nama_tahun_ajaran))
      ),
  });
  const { data: siswaBaru = [], isFetching: loadingSiswaBaru } = useQuery(
    ["siswa/tanpa-kelas"],
    listSiswaTanpaKelas,
    { refetchOnWindowFocus: false, select: (r) => r.data?.data || [] }
  );
  const { data: anggotaKelas = [], isFetching: loadingAnggotaKelas } = useQuery(
    ["siswa/kelas/anggota", asal?.id],
    () => listAnggotaKelas(asal.id),
    {
      enabled: !!asal?.id && !asal?.siswaBaru,
      refetchOnWindowFocus: false,
      select: (r) => r.data?.data || [],
    }
  );
  const isAsalBaru = !!asal?.siswaBaru;
  const loadingAnggota = isAsalBaru ? loadingSiswaBaru : loadingAnggotaKelas;

  // Siswa tanpa kelas bisa berisi data lama; filter per angkatan (default angkatan terbaru)
  const angkatanList = React.useMemo(() => {
    const set = new Set(siswaBaru.map((r) => String(r.siswa?.angkatan || "-")));
    return [...set].sort((a, b) => (Number(b) || -1) - (Number(a) || -1));
  }, [siswaBaru]);
  const [angkatanBaru, setAngkatanBaru] = React.useState(null);
  React.useEffect(() => {
    if (isAsalBaru && angkatanBaru === null && angkatanList.length) {
      setAngkatanBaru(angkatanList[0]);
    }
  }, [isAsalBaru, angkatanBaru, angkatanList]);
  const anggota = isAsalBaru
    ? siswaBaru.filter(
        (r) => !angkatanBaru || String(r.siswa?.angkatan || "-") === angkatanBaru
      )
    : anggotaKelas;

  // Dari tombol "Siswa Baru" di Daftar Kelas: ?asal=baru -> langsung ke daftar siswa baru
  const [searchParams] = useSearchParams();
  const autoAsal = React.useRef(false);
  React.useEffect(() => {
    if (!autoAsal.current && searchParams.get("asal") === "baru") {
      autoAsal.current = true;
      setAsal(ASAL_SISWA_BARU);
      setStep(1);
    }
  }, [searchParams]);

  const taOptions = taList.map((t) => ({ key: t.id, value: t.id, text: t.nama_tahun_ajaran }));
  const namaTa = (id) => taList.find((t) => Number(t.id) === Number(id))?.nama_tahun_ajaran || "-";

  // ---- navigasi langkah ----
  const pilihAsal = (k) => {
    setAsal(k);
    setAngkatanBaru(null);
    setSelected([]);
    setTujuan(null);
    setSemesterBaru(null);
    setResult(null);
    setStep(1);
  };

  const pilihTujuan = (k) => {
    setTujuan(k);
    setSemesterBaru(null);
    setSekolahTujuan("");
    if (k.pindahSekolah) {
      setTaId(null);
      setSemester("");
    } else if (isAlumniKelas(k)) {
      // Kelulusan: default tahun ajaran lulus = tahun ajaran kelas asal saat ini
      setTaId(asal?.ta_id ?? null);
      setSemester("");
    } else {
      // Saran TA & semester: ikuti siswa yang sudah aktif di kelas tujuan,
      // jika kelas tujuan kosong: TA terbaru & semester sesuai tingkat kelas
      const taTerbaru = taList.length ? taList[taList.length - 1].id : null;
      setTaId(k.ta_id ?? taTerbaru);
      setSemester(
        k.semester !== null && k.semester !== undefined
          ? String(k.semester)
          : saranSemester(k.nama_kelas)
      );
      // Siswa baru belum punya kelas -> selalu dianggap awal semester / tahun ajaran baru
      if (asal?.siswaBaru) setSemesterBaru(true);
    }
    setStep(3);
  };

  const isAlumni = isAlumniKelas(tujuan);
  const isPindahSekolah = !!tujuan?.pindahSekolah;

  const resetSemua = () => {
    setStep(0);
    setAsal(null);
    setSelected([]);
    setTujuan(null);
    setSemesterBaru(null);
    setTaId(null);
    setSemester("");
    setKeterangan("");
    setSekolahTujuan("");
  };

  const allSelected = anggota.length > 0 && selected.length === anggota.length;
  const toggleAll = () => setSelected(allSelected ? [] : anggota.map((r) => r.student_id));
  const toggleOne = (id) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const siapSubmit =
    selected.length > 0 &&
    tujuan &&
    (isPindahSekolah
      ? sekolahTujuan.trim() !== ""
      : isAlumni
      ? !!taId
      : semesterBaru !== null && (!semesterBaru || (taId && semester !== "")));

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const payload = isPindahSekolah
        ? {
            student_ids: selected,
            pindah_sekolah: true,
            sekolah_tujuan: sekolahTujuan.trim(),
            keterangan: keterangan || undefined,
          }
        : isAlumni
        ? {
            student_ids: selected,
            kelas_id: tujuan.id,
            ta_id: taId,
            keterangan: keterangan || undefined,
          }
        : {
            student_ids: selected,
            kelas_id: tujuan.id,
            semester_baru: semesterBaru,
            ...(semesterBaru && { ta_id: taId, semester: Number(semester) }),
            keterangan: keterangan || undefined,
          };
      const res = await pindahKelasHandle(payload);
      setResult({ error: false, ...res.data });
      toast.success(res.data?.msg || "Berhasil");
      queryClient.invalidateQueries("siswa/kelas/ringkasan");
      queryClient.invalidateQueries("siswa/kelas/anggota");
      queryClient.invalidateQueries("siswa/tanpa-kelas");
      queryClient.invalidateQueries("siswa/list");
      queryClient.invalidateQueries("siswa/riwayat-kelas");
      resetSemua();
    } catch (err) {
      setResult({ error: true, msg: err?.response?.data?.msg || "Gagal memindahkan siswa" });
    } finally {
      setSubmitting(false);
      setConfirmOpen(false);
    }
  };

  if (!isAdmin) {
    return (
      <LayoutPage title="Pindah Kelas">
        <Message warning>Fitur ini hanya dapat diakses oleh Admin.</Message>
      </LayoutPage>
    );
  }

  return (
    <LayoutPage title="Pindah Kelas">
      <RiwayatKelasModal studentId={riwayatId} onClose={() => setRiwayatId(null)} />

      {/* Indikator langkah */}
      <div className="mb-5 flex flex-wrap items-center gap-2 text-sm">
        {STEPS.map((s, i) => (
          <React.Fragment key={s}>
            <button
              type="button"
              disabled={i > step}
              onClick={() => i < step && setStep(i)}
              className={`flex items-center gap-2 rounded-full px-3 py-1 ${
                i === step
                  ? "bg-[#00BFBF] text-white"
                  : i < step
                  ? "bg-teal-50 text-[#00A0A0] hover:bg-teal-100"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              <span className="font-bold">{i + 1}</span> {s}
            </button>
            {i < STEPS.length - 1 && <MdChevronRight className="text-gray-300" />}
          </React.Fragment>
        ))}
      </div>

      {result && (
        <Message negative={result.error} positive={!result.error} onDismiss={() => setResult(null)}>
          <p>{result.msg}</p>
          {result.dilewati?.length > 0 && (
            <>
              <p className="mt-2 font-semibold">Dilewati:</p>
              <ul className="list-disc pl-5">
                {result.dilewati.map((d) => (
                  <li key={d.student_id}>
                    {d.nama_siswa || `ID ${d.student_id}`}: {d.alasan}
                  </li>
                ))}
              </ul>
            </>
          )}
        </Message>
      )}

      {/* LANGKAH 1: kelas asal */}
      {step === 0 && (
        <section>
          <h3 className="mb-3 font-semibold text-gray-700">Pilih kelas asal</h3>
          {loadingKelas && <p>Memuat...</p>}

          <button
            type="button"
            disabled={siswaBaru.length === 0}
            onClick={() => pilihAsal(ASAL_SISWA_BARU)}
            className={`mb-4 flex w-full items-start gap-3 rounded-lg border-2 border-dashed p-4 text-left transition sm:w-auto sm:min-w-[22rem] ${
              siswaBaru.length === 0
                ? "cursor-not-allowed border-gray-200 bg-gray-50 text-gray-400"
                : "border-amber-300 bg-amber-50 hover:border-amber-400 hover:shadow-md"
            }`}
          >
            <MdPersonAddAlt1
              className={`mt-0.5 h-6 w-6 flex-shrink-0 ${
                siswaBaru.length === 0 ? "" : "text-amber-600"
              }`}
            />
            <div>
              <div className="font-semibold">Siswa Baru (belum punya kelas)</div>
              <div className="mt-1 text-sm text-gray-500">
                {loadingSiswaBaru
                  ? "Memuat..."
                  : `${siswaBaru.length} siswa · mis. hasil import siswa baru`}
              </div>
            </div>
          </button>

          <KelasGrid
            items={kelasList}
            onPick={pilihAsal}
            disabledIf={(k) => k.jumlah_siswa === 0}
          />
        </section>
      )}

      {/* LANGKAH 2: pilih siswa */}
      {step === 1 && asal && (
        <section className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-semibold text-gray-700">
              Pilih siswa dari <span className="text-[#00A0A0]">{asal.nama_kelas}</span>
            </h3>
            <span className="text-sm text-gray-600">
              {selected.length} dari {anggota.length} siswa dipilih
            </span>
          </div>
          {isAsalBaru && angkatanList.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-1 text-xs font-semibold uppercase tracking-wider text-gray-400">
                Angkatan
              </span>
              {angkatanList.map((a) => {
                const n = siswaBaru.filter(
                  (r) => String(r.siswa?.angkatan || "-") === a
                ).length;
                const active = angkatanBaru === a;
                return (
                  <button
                    key={a}
                    type="button"
                    onClick={() => {
                      setAngkatanBaru(a);
                      setSelected([]);
                    }}
                    className={`flex items-center gap-2 rounded-full border px-3 py-1 text-xs transition ${
                      active
                        ? "border-[#00BFBF] bg-[#00BFBF] text-white"
                        : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {a === "-" ? "Tanpa angkatan" : `Angkatan ${a}`}
                    <span
                      className={`rounded-full px-2 font-semibold ${
                        active ? "bg-white text-[#00A0A0]" : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {n}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
          <Table celled compact selectable unstackable>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell collapsing>
                  <Checkbox
                    checked={allSelected}
                    indeterminate={selected.length > 0 && !allSelected}
                    onChange={toggleAll}
                    disabled={anggota.length === 0}
                  />
                </Table.HeaderCell>
                <Table.HeaderCell>Nama Siswa</Table.HeaderCell>
                <Table.HeaderCell>NIS</Table.HeaderCell>
                <Table.HeaderCell>
                  {isAsalBaru ? "Angkatan / Tahun Masuk" : "Tahun Ajaran / Smt"}
                </Table.HeaderCell>
                <Table.HeaderCell collapsing>Riwayat</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {loadingAnggota && (
                <Table.Row>
                  <Table.Cell colSpan={5}>Memuat...</Table.Cell>
                </Table.Row>
              )}
              {!loadingAnggota && anggota.length === 0 && (
                <Table.Row>
                  <Table.Cell colSpan={5}>
                    {isAsalBaru
                      ? "Semua siswa sudah memiliki kelas."
                      : "Tidak ada siswa aktif di kelas ini."}
                  </Table.Cell>
                </Table.Row>
              )}
              {!loadingAnggota &&
                anggota.map((r) => (
                  <Table.Row
                    key={r.id}
                    active={selected.includes(r.student_id)}
                    onClick={() => toggleOne(r.student_id)}
                    style={{ cursor: "pointer" }}
                  >
                    <Table.Cell>
                      <Checkbox checked={selected.includes(r.student_id)} />
                    </Table.Cell>
                    <Table.Cell>{r.siswa?.nama_siswa}</Table.Cell>
                    <Table.Cell>{r.siswa?.nis || "-"}</Table.Cell>
                    <Table.Cell>
                      {isAsalBaru
                        ? `${r.siswa?.angkatan || "-"} / ${r.siswa?.tahun_ajaran_masuk || "-"}`
                        : `${r.tahun_ajaran?.nama_tahun_ajaran} / ${r.semester}`}
                    </Table.Cell>
                    <Table.Cell>
                      <AksiButton
                        color="grey"
                        icon="history"
                        title="Riwayat Kelas"
                        onClick={(e) => {
                          e.stopPropagation();
                          setRiwayatId(r.student_id);
                        }}
                      />
                    </Table.Cell>
                  </Table.Row>
                ))}
            </Table.Body>
          </Table>
          <div className="flex gap-3">
            <Button type="button" onClick={() => setStep(0)}>
              Kembali
            </Button>
            <Button
              type="button"
              color="teal"
              disabled={selected.length === 0}
              onClick={() => setStep(2)}
            >
              Lanjut: Pilih Kelas Tujuan ({selected.length})
            </Button>
          </div>
        </section>
      )}

      {/* LANGKAH 3: kelas tujuan */}
      {step === 2 && (
        <section>
          <h3 className="mb-3 font-semibold text-gray-700">
            {isAsalBaru ? "Masukkan" : "Pindahkan"} {selected.length} siswa dari{" "}
            <span className="text-[#00A0A0]">{asal?.nama_kelas}</span> ke kelas:
          </h3>
          <KelasGrid
            items={kelasList.filter(
              (k) => k.id !== asal?.id && !(isAsalBaru && isAlumniKelas(k))
            )}
            onPick={pilihTujuan}
          />
          {!isAsalBaru && (
          <>
          <p className="mb-2 mt-5 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Keluar dari sekolah
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <button
              type="button"
              onClick={() => pilihTujuan(TUJUAN_PINDAH_SEKOLAH)}
              className="flex items-start gap-3 rounded-lg border border-red-200 bg-white p-4 text-left transition hover:border-red-400 hover:shadow-md"
            >
              <MdExitToApp className="mt-0.5 h-6 w-6 flex-shrink-0 text-red-500" />
              <div>
                <div className="font-semibold text-gray-800">Pindah Sekolah</div>
                <div className="mt-1 text-sm text-gray-500">
                  Siswa keluar karena pindah ke sekolah lain
                </div>
              </div>
            </button>
          </div>
          </>
          )}
          <div className="mt-4">
            <Button type="button" onClick={() => setStep(1)}>
              Kembali
            </Button>
          </div>
        </section>
      )}

      {/* LANGKAH 4: semester baru? + konfirmasi */}
      {step === 3 && tujuan && (
        <section className="max-w-2xl space-y-5">
          <div className="rounded-lg border bg-gray-50 p-4">
            <p className="text-gray-700">
              <b>{selected.length} siswa</b>: <b>{asal?.nama_kelas}</b> →{" "}
              <b className="text-[#00A0A0]">{tujuan.nama_kelas}</b>
            </p>
          </div>

          {isPindahSekolah && (
            <div className="space-y-4">
              <Message negative>
                <Message.Header>{selected.length} siswa pindah sekolah?</Message.Header>
                <p>
                  Siswa dikeluarkan dari kelas <b>{asal?.nama_kelas}</b> dan tidak lagi
                  muncul di absensi, ujian, dan daftar kelas. <b>Akun login siswa
                  otomatis dinonaktifkan</b> (tidak bisa login). Data siswa tidak
                  dihapus dan perpindahan tercatat di riwayat.
                </p>
              </Message>
              <Form>
                <Form.Field required>
                  <label>Sekolah Tujuan</label>
                  <Input
                    placeholder="mis. SMK Negeri 1 Bogor"
                    value={sekolahTujuan}
                    onChange={(e) => setSekolahTujuan(e.target.value)}
                  />
                </Form.Field>
                <Form.Field>
                  <label>Keterangan (opsional)</label>
                  <Input
                    placeholder="mis. Ikut orang tua pindah domisili"
                    value={keterangan}
                    onChange={(e) => setKeterangan(e.target.value)}
                  />
                </Form.Field>
              </Form>
            </div>
          )}

          {isAlumni && (
            <div className="space-y-4">
              <Message warning>
                <Message.Header>Luluskan {selected.length} siswa?</Message.Header>
                <p>
                  Siswa akan dipindahkan ke <b>Alumni</b> dan tidak lagi aktif di kelas
                  manapun (tidak muncul di absensi, ujian, dan daftar kelas). Kelas
                  terakhir tetap tersimpan di riwayat.
                </p>
              </Message>
              <Form>
                <Form.Field required>
                  <label>Tahun Ajaran Kelulusan</label>
                  <Dropdown
                    placeholder="Pilih tahun ajaran lulus"
                    fluid
                    selection
                    options={taOptions}
                    value={taId}
                    onChange={(_, d) => setTaId(d.value)}
                  />
                  {asal?.nama_tahun_ajaran && (
                    <small className="text-gray-500">
                      Diisi otomatis dari tahun ajaran kelas asal ({asal.nama_tahun_ajaran}).
                    </small>
                  )}
                </Form.Field>
                <Form.Field>
                  <label>Keterangan (opsional)</label>
                  <Input
                    placeholder="mis. Lulus angkatan 2026"
                    value={keterangan}
                    onChange={(e) => setKeterangan(e.target.value)}
                  />
                </Form.Field>
              </Form>
            </div>
          )}

          {!isAlumni && !isPindahSekolah && isAsalBaru && (
            <Message info size="small">
              Siswa baru akan dimasukkan ke <b>{tujuan.nama_kelas}</b> sebagai kelas
              aktif. Tentukan tahun ajaran &amp; semester awalnya.
            </Message>
          )}

          {!isAlumni && !isPindahSekolah && (
          <>
          {!isAsalBaru && (
          <div>
            <h3 className="mb-3 font-semibold text-gray-700">
              Apakah pindah karena semester / tahun ajaran baru?
            </h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <ChoiceCard
                active={semesterBaru === true}
                title="Ya, semester baru"
                desc="Naik kelas atau awal semester. Kelas lama disimpan sebagai riwayat periode sebelumnya."
                onClick={() => setSemesterBaru(true)}
              />
              <ChoiceCard
                active={semesterBaru === false}
                title="Tidak, pindah biasa"
                desc="Pindah kelas di tengah semester. Tahun ajaran & semester tetap seperti sekarang."
                onClick={() => setSemesterBaru(false)}
              />
            </div>
          </div>
          )}

          <Form>
            {semesterBaru === true && (
              <Form.Group widths="equal">
                <Form.Field required>
                  <label>Tahun Ajaran</label>
                  <Dropdown
                    placeholder="Pilih tahun ajaran"
                    fluid
                    selection
                    options={taOptions}
                    value={taId}
                    onChange={(_, d) => setTaId(d.value)}
                  />
                </Form.Field>
                <Form.Field required>
                  <label>Semester</label>
                  <Input
                    type="number"
                    min={0}
                    placeholder="mis. 3"
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                  />
                </Form.Field>
              </Form.Group>
            )}
            {semesterBaru === true && !tujuan.ta_id && saranSemester(tujuan.nama_kelas) && (
              <p className="-mt-2 mb-3 text-xs text-gray-500">
                {tujuan.nama_kelas} belum punya siswa aktif. Diisi otomatis: tahun ajaran
                terbaru &amp; semester sesuai tingkat kelas. Periksa kembali.
              </p>
            )}
            {semesterBaru === true && tujuan.ta_id && (
              <p className="-mt-2 mb-3 text-xs text-gray-500">
                Diisi otomatis mengikuti siswa yang sudah aktif di {tujuan.nama_kelas} (
                {tujuan.nama_tahun_ajaran}, semester {tujuan.semester}).
              </p>
            )}
            {semesterBaru !== null && (
              <Form.Field>
                <label>Keterangan (opsional)</label>
                <Input
                  placeholder="mis. Kenaikan kelas 2026/2027"
                  value={keterangan}
                  onChange={(e) => setKeterangan(e.target.value)}
                />
              </Form.Field>
            )}
          </Form>
          </>
          )}

          <div className="flex gap-3">
            <Button type="button" onClick={() => setStep(2)}>
              Kembali
            </Button>
            <Button
              type="button"
              color={isPindahSekolah ? "red" : isAlumni ? "orange" : "green"}
              disabled={!siapSubmit}
              onClick={() => setConfirmOpen(true)}
            >
              {isPindahSekolah
                ? `Proses ${selected.length} Siswa Pindah Sekolah`
                : `${isAlumni ? "Luluskan" : "Pindahkan"} ${selected.length} Siswa`}
            </Button>
          </div>
        </section>
      )}

      <Modal size="tiny" open={confirmOpen} onClose={() => !submitting && setConfirmOpen(false)}>
        <Modal.Header>
          {isPindahSekolah
            ? "Konfirmasi Pindah Sekolah"
            : isAlumni
            ? "Konfirmasi Kelulusan"
            : "Konfirmasi Pindah Kelas"}
        </Modal.Header>
        <Modal.Content>
          {isPindahSekolah ? (
            <p>
              <b>{selected.length} siswa</b> dari <b>{asal?.nama_kelas}</b> pindah ke{" "}
              <b>{sekolahTujuan}</b>?
            </p>
          ) : (
            <p>
              {isAlumni ? "Luluskan" : "Pindahkan"} <b>{selected.length} siswa</b> dari{" "}
              <b>{asal?.nama_kelas}</b> ke <b>{tujuan?.nama_kelas}</b>?
            </p>
          )}
          <p className="mt-2">
            {isPindahSekolah ? (
              <>
                Siswa akan keluar dari kelas, tercatat pindah sekolah, dan{" "}
                <b>akunnya dinonaktifkan</b>.
              </>
            ) : isAlumni ? (
              <>
                Tahun ajaran kelulusan: <b>{namaTa(taId)}</b>.
              </>
            ) : semesterBaru ? (
              <>
                Semester baru: <b>{namaTa(taId)}</b>, semester <b>{semester}</b>.
              </>
            ) : (
              <>Pindah biasa: tahun ajaran &amp; semester tetap.</>
            )}
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Perpindahan dicatat di riwayat kelas siswa. Siswa tidak lagi muncul di
            absensi dan ujian kelas lama.
          </p>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => setConfirmOpen(false)} disabled={submitting}>
            Batal
          </Button>
          <Button
            color={isPindahSekolah ? "red" : isAlumni ? "orange" : "green"}
            loading={submitting}
            onClick={handleSubmit}
          >
            {isPindahSekolah ? "Ya, Proses" : isAlumni ? "Ya, Luluskan" : "Ya, Pindahkan"}
          </Button>
        </Modal.Actions>
      </Modal>

      <div className="mt-8">
        <Button basic type="button" onClick={() => navigate("/guru/daftar-siswa")}>
          ← Kembali ke Daftar Kelas
        </Button>
      </div>
    </LayoutPage>
  );
}

function KelasGrid({ items, onPick, disabledIf }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((k) => {
        const disabled = disabledIf?.(k);
        return (
          <button
            key={k.id}
            type="button"
            disabled={disabled}
            onClick={() => onPick(k)}
            className={`flex items-start gap-3 rounded-lg border p-4 text-left transition ${
              disabled
                ? "cursor-not-allowed border-gray-100 bg-gray-50 text-gray-400"
                : "border-gray-200 bg-white hover:border-[#00BFBF] hover:shadow-md"
            }`}
          >
            <MdClass className={`mt-0.5 h-6 w-6 flex-shrink-0 ${disabled ? "" : "text-[#00BFBF]"}`} />
            <div>
              <div className="font-semibold">{k.nama_kelas}</div>
              <div className="mt-1 text-sm text-gray-500">
                {k.jumlah_siswa} siswa aktif
                {k.nama_tahun_ajaran && (
                  <>
                    {" "}
                    · {k.nama_tahun_ajaran} · smt {k.semester}
                  </>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function ChoiceCard({ active, title, desc, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-start gap-3 rounded-lg border-2 p-4 text-left transition ${
        active ? "border-[#00BFBF] bg-teal-50" : "border-gray-200 bg-white hover:border-gray-300"
      }`}
    >
      <MdCheckCircle
        className={`mt-0.5 h-5 w-5 flex-shrink-0 ${active ? "text-[#00BFBF]" : "text-gray-300"}`}
      />
      <div>
        <div className="font-semibold text-gray-800">{title}</div>
        <div className="mt-1 text-sm text-gray-500">{desc}</div>
      </div>
    </button>
  );
}
