import htmr from "htmr";
import { useEffect, useState } from "react";
import Editor from "../../../components/Editor";
import Dropzone from "react-dropzone";
import { uploadFile, useDeleteFile } from "../../../api/guru/upload";
import DropzoneFile from "../../../components/Dropzone";
import { DeleteButton } from "../../../components";
export default function ES({ soals, item, setPayload, payload, tipe }) {
  let [jawaban, setJawaban] = useState("");
  let [file, setFile] = useState("");
  const mutate = useDeleteFile();
  useEffect(() => {
    const detail = handleSoal(payload, item);
    setPayload((s) => {
      s.data[detail.index] = {
        ...detail.soal[0],
      };

      setJawaban(detail.soal[0].jawaban);
      setFile(detail.soal[0].file);
      return {
        ...s,
        data: s.data,
      };
    });
  }, []);

  return (
    <div className="space-y-5">
      <div className="border p-2 rounded-md">
        {htmr(`<div>${soals.soal}</div>`)}
      </div>

      <div className="relative">
        <h5>Jawaban :</h5>

        {tipe === "open" && (
          <section className="mb-5">
            {!!file === false ? (
              <DropzoneFile
                handleDrop={(content) => {
                  const detail = handleSoal(payload, item);
                  setFile(content);
                  setPayload((s) => {
                    s.data[detail.index] = {
                      ...detail.soal[0],
                      file: content,
                    };

                    return {
                      ...s,
                      data: s.data,
                    };
                  });
                }}
              />
            ) : (
              <section className="flex items-center space-x-2">
                <DeleteButton
                  onClick={() => {
                    mutate.mutate(
                      { path: file.split("/")[3] },
                      {
                        onSuccess: () => {
                          setFile("");
                        },
                      }
                    );
                  }}
                  size="large"
                />
                <a target="_blank" rel="noreferrer" href={file}>
                  {file.split("/")[3]}
                </a>
              </section>
            )}
          </section>
        )}

        <Editor
          value={jawaban}
          handleChange={(content) => {
            const detail = handleSoal(payload, item);
            setPayload((s) => {
              s.data[detail.index] = {
                ...detail.soal[0],
                jawaban: content,
              };
              setJawaban(content);
              return {
                ...s,
                data: s.data,
              };
            });
          }}
        />
      </div>
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
