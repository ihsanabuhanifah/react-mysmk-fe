import clsx from "clsx";
import htmr from "htmr";

export default function Pg({ soals, jawaban, item, nomor }) {
 

  const jawabanSiswa = handleViewJawaban(jawaban, item.id);

  
  return (
    <>
      <div className="space-y-5">
        <section className="flex items-center justify-between">
          <div className="font-bold ">Soal Nomor {nomor} </div>
          <div className="relative ">
            <p className="text-gray-500 absolute top-2 right-5">
              / {item.point}
            </p>
            <input
              className="border p-2 rounded-md w-max-[100px]"
              placeholder="0"
              style={{
                width: "90px",
              }}
              disabled
              value={item.jawaban === jawabanSiswa?.jawaban ? item.point : 0}
              onChange={(e) => {
                console.log("jalaj");
              }}
            />
          </div>
        </section>

        <div className=" p-2 rounded-md">
          {htmr(`<div>${soals.soal}</div>`)}
        </div>

        <div className="relative pl-12">
          <button
            className={clsx(
              "absolute  left-0  px-2 py-1   border-2 rounded-full ",
              {
                "bg-green-500 text-white":
                  (jawabanSiswa?.jawaban === "A" &&
                    jawabanSiswa?.jawaban === item.jawaban) ||
                  (!!jawabanSiswa?.jawaban === true && item.jawaban === "A"),
                "bg-red-500 text-white":
                  jawabanSiswa?.jawaban === "A" &&
                  jawabanSiswa?.jawaban !== item.jawaban,
              }
            )}
          >
            A
          </button>
          <div>{htmr(`<div>${soals.a}</div>`)}</div>
        </div>

        <div className="relative pl-12">
          <button
            className={clsx(
              "absolute  left-0  px-2 py-1   border-2 rounded-full ",
              {
                "bg-green-500 text-white":
                  (jawabanSiswa?.jawaban === "B" &&
                    jawabanSiswa?.jawaban === item.jawaban) ||
                  (!!jawabanSiswa?.jawaban === true && item.jawaban === "B"),
                "bg-red-500 text-white":
                  jawabanSiswa?.jawaban === "B" &&
                  jawabanSiswa?.jawaban !== item.jawaban,
              }
            )}
          >
            B
          </button>
          <div>{htmr(`<div>${soals.b}</div>`)}</div>
        </div>

        <div className="relative pl-12">
          <button
            className={clsx(
              "absolute  left-0  px-2 py-1   border-2 rounded-full ",
              {
                "bg-green-500 text-white":
                  (jawabanSiswa?.jawaban === "C" &&
                    jawabanSiswa?.jawaban === item.jawaban) ||
                  (!!jawabanSiswa?.jawaban === true && item.jawaban === "C"),
                "bg-red-500 text-white":
                  jawabanSiswa?.jawaban === "C" &&
                  jawabanSiswa?.jawaban !== item.jawaban,
              }
            )}
          >
            C
          </button>
          <div>{htmr(`<div>${soals.c}</div>`)}</div>
        </div>

        <div className="relative pl-12">
          <button
            className={clsx(
              "absolute  left-0  px-2 py-1   border-2 rounded-full ",
              {
                "bg-green-500 text-white":
                  (jawabanSiswa?.jawaban === "D" &&
                    jawabanSiswa?.jawaban === item.jawaban) ||
                  (!!jawabanSiswa?.jawaban === true && item.jawaban === "D"),
                "bg-red-500 text-white":
                  jawabanSiswa?.jawaban === "D" &&
                  jawabanSiswa?.jawaban !== item.jawaban,
              }
            )}
          >
            D
          </button>
          <div>{htmr(`<div>${soals.d}</div>`)}</div>
        </div>

        <div className="relative pl-12">
          <button
            className={clsx(
              "absolute  left-0  px-2 py-1   border-2 rounded-full ",
              {
                "bg-green-500 text-white":
                  (jawabanSiswa?.jawaban === "E" &&
                    jawabanSiswa?.jawaban === item.jawaban) ||
                  (!!jawabanSiswa?.jawaban === true && item.jawaban === "E"),
                "bg-red-500 text-white":
                  jawabanSiswa?.jawaban === "E" &&
                  jawabanSiswa?.jawaban !== item.jawaban,
              }
            )}
          >
            E
          </button>
          <div>{htmr(`<div>${soals.e}</div>`)}</div>
        </div>
      </div>
    </>
  );
}

const handleViewJawaban = (data, id) => {
  const res = data.filter((item) => item.id === id);

  return res?.[0];
};
