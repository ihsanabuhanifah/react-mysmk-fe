import clsx from "clsx";
import htmr from "htmr";

export default function ES({ soals, jawaban, item, nomor, setPayload }) {
  console.log("jawa", jawaban);

  //   console.log('soal', soals)
  //   console.log("jawaban", jawaban);

  const jawabanSiswa = handleViewJawaban(jawaban, item.id);

  console.log("jawaban siswa", jawabanSiswa);
  return (
    <>
      <div className="space-y-5">
        <section className="flex items-center justify-between">
          <div className="font-bold ">Soal Nomor {nomor} </div>
          <div>
            <div className="relative ">
              <p className="text-gray-500 absolute top-2 right-5">
                / {item.point}
              </p>
              <input
                disabled={!!jawabanSiswa === false}
                className="border p-2 rounded-md w-max-[100px]"
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
                      (x) => x.id !== jawabanSiswa.id
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

        <div className=" p-2 rounded-md border text-justify">{htmr(`<div>${soals.soal}</div>`)}</div>

        <div>
          <h5>Jawaban :</h5>
          {!!jawabanSiswa?.file === true ? (
            <a target="_blank" rel="noreferrer" href={jawabanSiswa?.file}>
              {jawabanSiswa?.file?.split("/")[3]}
            </a>
          ) : (
            ""
          )}
          <div className="mt-5">
            {htmr(`<div>${jawabanSiswa?.jawaban || "-"}</div>`)}
          </div>
        </div>
      </div>
    </>
  );
}

const handleViewJawaban = (data, id) => {
  const res = data?.filter((item) => item?.id === id);

  return res?.[0];
};
