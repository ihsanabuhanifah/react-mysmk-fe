import clsx from "clsx";
import htmr from "htmr";

export default function TF({ soals, jawaban, item, nomor }) {
  const jawabanSiswa = handleViewJawaban(jawaban, item.id);
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
              value={item.jawaban === jawabanSiswa?.jawaban ? item.point : 0}
              onChange={(e) => {
              
              }}
            />
          </div>
        </section>

        <div className="rounded-md border p-2 text-justify">
          {htmr(`<div>${soals.soal}</div>`)}
        </div>

        <div className="relative pl-12">
          <button
            className={clsx("absolute left-0 rounded-full border-2 px-2 py-1", {
              "bg-green-500 text-white":
                (jawabanSiswa?.jawaban === "true" &&
                  jawabanSiswa?.jawaban === item.jawaban) ||
                (!!jawabanSiswa?.jawaban === true && item.jawaban === "true"),
              "bg-red-500 text-white":
                jawabanSiswa?.jawaban === "true" &&
                jawabanSiswa?.jawaban !== item.jawaban,
            })}
          >
            B
          </button>
          <div>Benar</div>
        </div>

        <div className="relative pl-12">
          <button
            className={clsx("absolute left-0 rounded-full border-2 px-2 py-1", {
              "bg-green-500 text-white":
                (jawabanSiswa?.jawaban === "false" &&
                  jawabanSiswa?.jawaban === item.jawaban) ||
                (!!jawabanSiswa?.jawaban === true && item.jawaban === "false"),
              "bg-red-500 text-white":
                jawabanSiswa?.jawaban === "false" &&
                jawabanSiswa?.jawaban !== item.jawaban,
            })}
          >
            S
          </button>
          <div>Salah</div>
        </div>
      </div>
    </>
  );
}

const handleViewJawaban = (data, id) => {
  const res = data.filter((item) => item.id === id);

  return res?.[0];
};
