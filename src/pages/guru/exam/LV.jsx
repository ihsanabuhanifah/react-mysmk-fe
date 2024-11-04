import clsx from "clsx";
import htmr from "htmr";
import { TextArea } from "semantic-ui-react";
import Editor from "../../../components/Editor";
import LiveCodingPlayground from "./LiveCoding";

export default function LV({ soals, jawaban, item, nomor, setPayload }) {
  console.log("jawa", jawaban);

  //   console.log('soal', soals)
  //   console.log("jawaban", jawaban);

  const jawabanSiswa = handleViewJawaban(jawaban, item.id);

  console.log("jawaban siswa", jawabanSiswa);
  return (
    <>
      <div className="space-y-5">
        <section className="flex items-center justify-between">
          <div className="font-bold">Soal Nomor {nomor} </div>
          <div>
            <div className="relative">
              <p className="absolute right-5 top-2 text-gray-500">
                / {item.point}
              </p>
              <input
                disabled={!!jawabanSiswa === false}
                className="w-max-[100px] rounded-md border p-2"
                placeholder="0"
                style={{
                  width: "90px",
                }}
                value={
                  jawaban.filter((x) => x?.id === jawabanSiswa?.id)?.[0]?.point
                }
                onChange={(e) => {
                  console.log("jalaj");
                  setPayload((state) => {
                    const filter = state.filter(
                      (x) => x.id !== jawabanSiswa.id,
                    );

                    return [
                      ...filter,
                      {
                        ...jawabanSiswa,
                        point: e.target.value,
                      },
                    ];
                  });
                }}
              />
            </div>
          </div>
        </section>

        <div className="rounded-md border p-2 text-justify">
          {htmr(`<div>${soals.soal}</div>`)}
        </div>

        <div className="rounded-md border p-2">
          <h5>Jawaban :</h5>
          {!!jawabanSiswa?.file === true ? (
            <a target="_blank" rel="noreferrer" href={jawabanSiswa?.file}>
              {jawabanSiswa?.file?.split("/")[3]}
            </a>
          ) : (
            ""
          )}
          <div className="mt-5">
            <LiveCodingPlayground
              jawaban={
                !!jawabanSiswa?.jawaban === false
                  ? ""
                  : JSON.parse(jawabanSiswa.jawaban)
              }
            />
          </div>
        </div>

        <div className="rounded-md border p-2">
          <h5>Catatan Penilaian</h5>
          <Editor
            value={jawabanSiswa?.catatan}
            handleChange={(content) => {
              setPayload((state) => {
                const filter = state.filter((x) => x.id !== jawabanSiswa.id);

                return [
                  ...filter,
                  {
                    ...jawabanSiswa,
                    catatan: content,
                  },
                ];
              });
            }}
          />
        </div>
      </div>
    </>
  );
}

const handleViewJawaban = (data, id) => {
  const res = data?.filter((item) => item?.id === id);

  return res?.[0];
};
