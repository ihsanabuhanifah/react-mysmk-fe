import React, { useState, useRef, useEffect } from "react";
import clsx from "clsx";
import { Icon, Progress } from "semantic-ui-react";
import { FiXCircle } from "react-icons/fi";
import { parseSoal, ocrGambar } from "../../../utils/parseSoal";
import { namaTipe } from "./TipeSoalPicker";

// Contoh format teks di gambar agar terbaca otomatis, per tipe soal
const CONTOH_FORMAT = {
  PG: `Perangkat yang berfungsi sebagai otak komputer adalah...
A. Monitor
B. Keyboard
C. CPU
D. Printer
E. Speaker
Jawaban: C`,
  MP: `Manakah yang termasuk perangkat input?
A. Keyboard
B. Monitor
C. Mouse
D. Printer
E. Scanner
Jawaban: A, C, E`,
  TF: `Monitor termasuk perangkat output.
Jawaban: Benar`,
  MTF: `Tentukan benar atau salah pernyataan berikut!
A. CPU adalah otak komputer
B. Monitor adalah perangkat input
C. RAM bersifat volatile
Jawaban: B, S, B`,
  ES: `Jelaskan perbedaan RAM dan ROM!
(seluruh teks masuk ke uraian soal)`,
  LV: `Buatlah program untuk menampilkan bilangan genap 1-100!
(seluruh teks masuk ke uraian soal)`,
};

const escapeHtml = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
const keHtml = (s) => `<div>${escapeHtml(s).replace(/\n/g, "<br>")}</div>`;

const ImageUploader = ({
  setFieldValue,
  index,
  values,
  setMemorize,
  onFilled,
}) => {
  const [preview, setPreview] = useState(null);
  const [status, setStatus] = useState("");
  const [gagal, setGagal] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [proses, setProses] = useState(false);
  const dropRef = useRef(null);
  const fileRef = useRef(null);

  const tipeAktif = values?.payload?.[index]?.tipe || "";

  // Listener paste dipasang sekali; pakai ref agar selalu membaca tipe/values terbaru
  const latest = useRef({ values, index, proses });
  latest.current = { values, index, proses };

  const setPesan = (pesan, isGagal = false) => {
    setStatus(pesan);
    setGagal(isGagal);
  };

  const uploadImage = async (file) => {
    const { values, index } = latest.current;
    const tipe = values?.payload?.[index]?.tipe;
    if (!tipe) return;

    setProses(true);
    setPesan("Membaca teks dari gambar...");
    setUploadProgress(5);
    setMemorize(true);

    try {
      const text = await ocrGambar(file, (m) => {
        if (m.status === "recognizing text") {
          setUploadProgress(Math.max(5, Math.round(m.progress * 95)));
        } else if (m.status) {
          setPesan(
            m.status.includes("load")
              ? "Menyiapkan OCR (pertama kali agak lama)..."
              : "Membaca teks dari gambar...",
          );
        }
      });
      const soal = parseSoal(text, tipe);
      const soalLama = values.payload[index].soal || {};
      const opsi = {};
      ["a", "b", "c", "d", "e"].forEach((f, i) => {
        const p = soal.pilihan[i];
        opsi[f] = p ? keHtml(p.teks) : tipe === "PG" ? "-" : null;
      });

      await setFieldValue(`payload[${index}].soal`, {
        ...soalLama,
        soal: keHtml(soal.pertanyaan),
        tipe,
        ...(["PG", "MP", "MTF"].includes(tipe)
          ? opsi
          : { a: null, b: null, c: null, d: null, e: null }),
      });
      await setFieldValue(`payload[${index}].jawaban`, soal.jawaban);
      if (onFilled) onFilled(index);

      setUploadProgress(100);
      const tanpaKunci =
        !["ES", "LV"].includes(tipe) &&
        (soal.jawaban === "" ||
          (Array.isArray(soal.jawaban) && soal.jawaban.length === 0));
      setPesan(
        `Soal ${namaTipe(tipe)} berhasil diisi dari gambar. Periksa lagi sebelum menyimpan.` +
          (tanpaKunci ? " Kunci jawaban tidak terbaca, silakan isi manual." : ""),
      );
    } catch (error) {
      console.error(error);
      setPesan("Gagal memproses gambar. Coba lagi.", true);
      setUploadProgress(0);
    } finally {
      setMemorize(false);
      setProses(false);
    }
  };

  const handleFiles = (file) => {
    if (!latest.current.values?.payload?.[latest.current.index]?.tipe) {
      setPesan("Pilih tipe soal terlebih dahulu.", true);
      return;
    }
    if (latest.current.proses) return;
    if (file && file.type.startsWith("image/")) {
      setPreview(URL.createObjectURL(file));
      uploadImage(file);
    } else {
      setPesan("Hanya file gambar yang diperbolehkan (JPG/PNG)", true);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files[0]);
  };

  useEffect(() => {
    const dropArea = dropRef.current;
    const handlePaste = (e) => {
      for (const item of e.clipboardData.items) {
        if (item.type.indexOf("image") !== -1) {
          e.preventDefault();
          handleFiles(item.getAsFile());
          return;
        }
      }
    };
    dropArea.addEventListener("paste", handlePaste);
    return () => dropArea.removeEventListener("paste", handlePaste);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reset = (e) => {
    e.stopPropagation();
    setPreview(null);
    setPesan("");
    setUploadProgress(0);
  };

  const terkunci = !tipeAktif;

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
      <div
        ref={dropRef}
        tabIndex={0}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => dropRef.current?.focus()}
        className={clsx(
          "relative rounded-xl border-2 border-dashed p-5 text-center outline-none transition-all lg:col-span-3",
          terkunci
            ? "cursor-not-allowed border-gray-200 bg-gray-50"
            : "cursor-pointer border-blue-200 bg-blue-50 hover:border-blue-300 hover:bg-blue-100 focus:border-blue-400 focus:ring-2 focus:ring-blue-200",
        )}
        style={{ minHeight: "180px" }}
      >
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            handleFiles(e.target.files[0]);
            e.target.value = "";
          }}
        />

        {(preview || status) && !proses && (
          <button
            type="button"
            title="Bersihkan"
            onClick={reset}
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
          >
            <FiXCircle size={18} />
          </button>
        )}

        {terkunci ? (
          <div className="flex h-full flex-col items-center justify-center py-6 text-gray-500">
            <Icon name="lock" size="large" />
            <p className="mt-2 font-medium">Pilih tipe soal dulu di langkah 1</p>
            <p className="text-sm">
              Setelah itu gambar soal bisa ditempel di sini
            </p>
          </div>
        ) : (
          <>
            <Icon name="image outline" size="big" color="blue" />
            <h4 className="mt-2 text-base font-semibold text-gray-700">
              Tempel gambar soal {namaTipe(tipeAktif)}
            </h4>
            <p className="mt-1 text-sm text-gray-500">
              Klik area ini lalu tekan{" "}
              <kbd className="rounded border bg-white px-1.5 py-0.5 text-xs font-semibold">
                Ctrl
              </kbd>{" "}
              +{" "}
              <kbd className="rounded border bg-white px-1.5 py-0.5 text-xs font-semibold">
                V
              </kbd>
              , atau seret gambar ke sini
            </p>
            <button
              type="button"
              disabled={proses}
              onClick={(e) => {
                e.stopPropagation();
                fileRef.current?.click();
              }}
              className="mt-3 rounded-md border border-blue-300 bg-white px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-50 disabled:opacity-50"
            >
              <Icon name="upload" /> Pilih file gambar
            </button>
          </>
        )}

        {proses && (
          <div className="mt-4">
            <Progress
              percent={uploadProgress}
              indicating
              size="small"
              color="blue"
            />
          </div>
        )}

        {preview && (
          <div className="mt-3 rounded-lg border border-gray-200 bg-white p-2">
            <img
              src={preview}
              alt="Pratinjau Soal"
              className="mx-auto max-h-36 max-w-full rounded"
            />
          </div>
        )}

        {status && (
          <p
            className={clsx(
              "mt-3 text-sm",
              gagal ? "text-red-600" : proses ? "text-blue-600" : "text-green-600",
            )}
          >
            <Icon
              name={
                gagal ? "warning circle" : proses ? "spinner" : "check circle"
              }
              loading={proses && !gagal}
            />
            {status}
          </p>
        )}
      </div>

      {/* Contoh format sesuai tipe */}
      <div className="rounded-xl border bg-white p-4 lg:col-span-2">
        <p className="mb-2 text-sm font-semibold text-gray-700">
          {tipeAktif
            ? `Contoh format gambar – ${namaTipe(tipeAktif)}`
            : "Contoh format gambar"}
        </p>
        {tipeAktif ? (
          <pre className="whitespace-pre-wrap rounded-md bg-gray-50 p-3 font-mono text-xs leading-5 text-gray-700">
            {CONTOH_FORMAT[tipeAktif]}
          </pre>
        ) : (
          <p className="text-sm text-gray-500">
            Contoh akan muncul setelah tipe soal dipilih.
          </p>
        )}
        <p className="mt-2 text-xs text-gray-400">
          Tips: gunakan screenshot yang jelas (teks hitam, latar putih).
          Hasil tetap bisa diedit sebelum disimpan.
        </p>
      </div>
    </div>
  );
};

export default React.memo(ImageUploader);
