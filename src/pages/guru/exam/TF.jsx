import clsx from "clsx";
import htmr from "htmr";

// Samakan dengan backend (utils/penilaianUjian.js): trim + lowercase
const norm = (v) =>
  v === null || v === undefined ? "" : String(v).trim().toLowerCase();

const label = (v) => (v === "true" ? "Benar" : v === "false" ? "Salah" : "-");

export default function TF({ soals, jawaban, item, nomor }) {
  const jawabanSiswa = norm(handleViewJawaban(jawaban, item.id)?.jawaban);
  const kunci = norm(item.jawaban);
  const dijawab = jawabanSiswa !== "";
  const benar = dijawab && jawabanSiswa === kunci;

  const opsi = [
    { value: "true", huruf: "B", teks: "Benar" },
    { value: "false", huruf: "S", teks: "Salah" },
  ];

  return (
    <>
      <div className="space-y-5">
        <section className="flex items-center justify-between">
          <div className="font-bold">Soal Nomor {nomor} </div>
          <div className="relative">
            <p className="absolute right-5 top-2 text-gray-500">
              / {item.point}
            </p>
            <input
              className="w-max-[100px] rounded-md border p-2"
              placeholder="0"
              style={{
                width: "90px",
              }}
              disabled
              value={benar ? item.point : 0}
              readOnly
            />
          </div>
        </section>

        <div className="rounded-md border p-2 text-justify">
          {htmr(`<div>${soals.soal?.replace(
            "https://storage.devopsgeming.online",
            "https://bemysmk.smkmadinatulquran.sch.id",
          )}</div>`)}
        </div>

        {opsi.map((o) => {
          const dipilihSiswa = jawabanSiswa === o.value;
          const isKunci = kunci === o.value;
          return (
            <div key={o.value} className="relative flex items-center pl-12">
              <button
                type="button"
                className={clsx(
                  "absolute left-0 rounded-full border-2 px-2 py-1",
                  {
                    "border-green-500 bg-green-500 text-white":
                      dipilihSiswa && isKunci,
                    "border-red-500 bg-red-500 text-white":
                      dipilihSiswa && !isKunci,
                    "border-green-500 text-green-600": !dipilihSiswa && isKunci,
                  },
                )}
              >
                {o.huruf}
              </button>
              <div>{o.teks}</div>
              <div className="ml-3 flex gap-2 text-xs">
                {dipilihSiswa && (
                  <span
                    className={clsx("rounded px-2 py-0.5 text-white", {
                      "bg-green-500": isKunci,
                      "bg-red-500": !isKunci,
                    })}
                  >
                    Jawaban Siswa {isKunci ? "✓" : "✗"}
                  </span>
                )}
                {isKunci && (
                  <span className="rounded border border-green-500 px-2 py-0.5 text-green-700">
                    Kunci Jawaban
                  </span>
                )}
              </div>
            </div>
          );
        })}

        <div
          className={clsx("rounded-md border p-3 text-sm", {
            "border-green-300 bg-green-50": benar,
            "border-red-300 bg-red-50": dijawab && !benar,
            "border-gray-300 bg-gray-50": !dijawab,
          })}
        >
          <div>
            Jawaban Siswa:{" "}
            <b>{dijawab ? label(jawabanSiswa) : "Tidak dijawab"}</b>
          </div>
          <div>
            Kunci Jawaban: <b>{label(kunci)}</b>
          </div>
        </div>
      </div>
    </>
  );
}

const handleViewJawaban = (data, id) => {
  const res = (data || []).filter((item) => item.id === id);

  return res?.[0];
};
