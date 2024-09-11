import clsx from "clsx";
import htmr from "htmr";

export default function TF({ soals, jawaban, item, nomor }) {
  console.log("item", item);

  //   console.log('soal', soals)
  //   console.log("jawaban", jawaban);

  const jawabanSiswa = handleViewJawaban(jawaban, item.id);

  console.log("jawa", jawabanSiswa);
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
                  width : '90px'
                }}
                disabled
                value={
                    item.jawaban === jawabanSiswa?.jawaban ? item.point : 0
                }
                onChange={(e) => {
                  console.log("jalaj");
                 
                }}
              />
            </div>
        </section>

        <div className=" p-2 rounded-md border text-justify">
          {htmr(`<div>${soals.soal}</div>`)}
        </div>

        <div className="relative pl-12">
          <button
            className={clsx(
              "absolute  left-0  px-2 py-1   border-2 rounded-full ",
              {
                "bg-green-500 text-white":
                  (jawabanSiswa?.jawaban === "true" &&
                    jawabanSiswa?.jawaban === item.jawaban) ||
                  (!!jawabanSiswa?.jawaban === true && item.jawaban === "true"),
                "bg-red-500 text-white":
                  jawabanSiswa?.jawaban === "true" &&
                  jawabanSiswa?.jawaban !== item.jawaban,
              }
            )}
          >
            B
          </button>
          <div>Benar</div>
        </div>

        <div className="relative pl-12">
          <button
            className={clsx(
              "absolute  left-0  px-2 py-1   border-2 rounded-full ",
              {
                "bg-green-500 text-white":
                  (jawabanSiswa?.jawaban === "false" &&
                    jawabanSiswa?.jawaban === item.jawaban) ||
                    (!!jawabanSiswa?.jawaban === true && item.jawaban === "false"),
                "bg-red-500 text-white":
                  jawabanSiswa?.jawaban === "false" &&
                  jawabanSiswa?.jawaban !== item.jawaban,
              }
            )}
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
