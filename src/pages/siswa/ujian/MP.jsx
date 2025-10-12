import clsx from "clsx";
import htmr from "htmr";
import { useEffect, useState } from "react";

export default function MultipleChoice({ soals, item, setPayload, payload }) {
  // Untuk MP, kita simpan jawaban sebagai array of strings
  const [jawaban, setJawaban] = useState([]);

  useEffect(() => {
    const detail = handleSoal(payload, item);
    setPayload((s) => {
      s.data[detail.index] = {
        ...detail.soal[0],
      };
      // Inisialisasi jawaban dari payload yang sudah ada
      if (detail.soal[0]?.jawaban) {
        setJawaban(
          Array.isArray(detail.soal[0].jawaban) ? detail.soal[0].jawaban : [],
        );
      }
      return {
        ...s,
        data: s.data,
      };
    });
  }, []);

  // Fungsi untuk menambah/menghapus jawaban dari array
  const toggleJawaban = (pilihan) => {
    setJawaban((prev) => {
      let newJawaban;
      if (prev.includes(pilihan)) {
        // Hapus jika sudah ada
        newJawaban = prev.filter((j) => j !== pilihan);
      } else {
        // Tambah jika belum ada
        newJawaban = [...prev, pilihan];
      }

      // Update payload
      const detail = handleSoal(payload, item);
      setPayload((s) => {
        s.data[detail.index] = {
          ...detail.soal[0],
          jawaban: newJawaban,
        };
        return {
          ...s,
          data: s.data,
        };
      });

      return newJawaban;
    });
  };

  return (
    <div className="space-y-4 text-xl">
      <div className="rounded-lg border  p-4">
        {htmr(
          `<div>${soals.soal?.replace(
            "https://storage.devopsgeming.online",
            "https://bemysmk.smkmadinatulquran.sch.id",
          )}</div>`,
        )}

        <div className="mt-2 text-sm font-semibold italic">
          Pilih semua jawaban yang benar (Bisa lebih dari satu):
        </div>
      </div>

      {/* Pilihan A */}
      {soals.a && (
        <div
          className="flex cursor-pointer items-start space-x-3 rounded-lg border p-4 transition-all hover:bg-gray-50"
          onClick={() => toggleJawaban("a")}
        >
          <div className="flex h-6 items-center">
            <input
              type="checkbox"
              checked={jawaban.includes("a")}
              onChange={() => toggleJawaban("a")}
              className="h-5 w-5 cursor-pointer rounded border-gray-300 bg-gray-100 text-green-600 focus:ring-2 focus:ring-green-500"
              onClick={(e) => e.stopPropagation()} // Mencegah double trigger
            />
          </div>
          <div
            className={clsx("flex-1 transition-all", {
              "font-medium text-green-700": jawaban.includes("a"),
            })}
          >
            {htmr(
              `<div>${soals.a?.replace(
                "https://storage.devopsgeming.online",
                "https://bemysmk.smkmadinatulquran.sch.id",
              )}</div>`,
            )}
          </div>
        </div>
      )}

      {/* Pilihan B */}
      {soals.b && (
        <div
          className="flex cursor-pointer items-start space-x-3 rounded-lg border p-4 transition-all hover:bg-gray-50"
          onClick={() => toggleJawaban("b")}
        >
          <div className="flex h-6 items-center">
            <input
              type="checkbox"
              checked={jawaban.includes("b")}
              onChange={() => toggleJawaban("b")}
              className="h-5 w-5 cursor-pointer rounded border-gray-300 bg-gray-100 text-green-600 focus:ring-2 focus:ring-green-500"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div
            className={clsx("flex-1 transition-all", {
              "font-medium text-green-700": jawaban.includes("b"),
            })}
          >
            {htmr(
              `<div>${soals.b?.replace(
                "https://storage.devopsgeming.online",
                "https://bemysmk.smkmadinatulquran.sch.id",
              )}</div>`,
            )}
          </div>
        </div>
      )}

      {/* Pilihan C */}
      {soals.c && (
        <div
          className="flex cursor-pointer items-start space-x-3 rounded-lg border p-4 transition-all hover:bg-gray-50"
          onClick={() => toggleJawaban("c")}
        >
          <div className="flex h-6 items-center">
            <input
              type="checkbox"
              checked={jawaban.includes("c")}
              onChange={() => toggleJawaban("c")}
              className="h-5 w-5 cursor-pointer rounded border-gray-300 bg-gray-100 text-green-600 focus:ring-2 focus:ring-green-500"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div
            className={clsx("flex-1 transition-all", {
              "font-medium text-green-700": jawaban.includes("c"),
            })}
          >
            {htmr(
              `<div>${soals.c?.replace(
                "https://storage.devopsgeming.online",
                "https://bemysmk.smkmadinatulquran.sch.id",
              )}</div>`,
            )}
          </div>
        </div>
      )}

      {/* Pilihan D */}
      {soals.d && (
        <div
          className="flex cursor-pointer items-start space-x-3 rounded-lg border p-4 transition-all hover:bg-gray-50"
          onClick={() => toggleJawaban("d")}
        >
          <div className="flex h-6 items-center">
            <input
              type="checkbox"
              checked={jawaban.includes("d")}
              onChange={() => toggleJawaban("d")}
              className="h-5 w-5 cursor-pointer rounded border-gray-300 bg-gray-100 text-green-600 focus:ring-2 focus:ring-green-500"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div
            className={clsx("flex-1 transition-all", {
              "font-medium text-green-700": jawaban.includes("d"),
            })}
          >
            {htmr(
              `<div>${soals.d?.replace(
                "https://storage.devopsgeming.online",
                "https://bemysmk.smkmadinatulquran.sch.id",
              )}</div>`,
            )}
          </div>
        </div>
      )}

      {/* Pilihan E */}
      {soals.e && (
        <div
          className="flex cursor-pointer items-start space-x-3 rounded-lg border p-4 transition-all hover:bg-gray-50"
          onClick={() => toggleJawaban("e")}
        >
          <div className="flex h-6 items-center">
            <input
              type="checkbox"
              checked={jawaban.includes("e")}
              onChange={() => toggleJawaban("e")}
              className="h-5 w-5 cursor-pointer rounded border-gray-300 bg-gray-100 text-green-600 focus:ring-2 focus:ring-green-500"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div
            className={clsx("flex-1 transition-all", {
              "font-medium text-green-700": jawaban.includes("e"),
            })}
          >
            {htmr(
              `<div>${soals.e?.replace(
                "https://storage.devopsgeming.online",
                "https://bemysmk.smkmadinatulquran.sch.id",
              )}</div>`,
            )}
          </div>
        </div>
      )}

      {/* Pilihan F */}
      {/* {soals.f && (
        <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-all cursor-pointer"
          onClick={() => toggleJawaban("F")}
        >
          <div className="flex items-center h-6">
            <input
              type="checkbox"
              checked={jawaban.includes("F")}
              onChange={() => toggleJawaban("F")}
              className="w-5 h-5 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2 cursor-pointer"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className={clsx("flex-1 transition-all", {
            "text-green-700 font-medium": jawaban.includes("F"),
          })}>
            <div className="font-semibold text-lg mb-1">F.</div>
            {htmr(`<div>${soals.f?.replace(
              "https://storage.devopsgeming.online",
              "https://bemysmk.smkmadinatulquran.sch.id",
            )}</div>`)}
          </div>
        </div>
      )} */}

      {/* Info jawaban yang dipilih */}
    </div>
  );
}

const handleSoal = (payload, item) => {
  const soal = payload.data.filter((x) => x.id === item.id);
  const index = payload.data.findIndex((x) => x.id === item.id);

  return {
    soal,
    index,
  };
};
