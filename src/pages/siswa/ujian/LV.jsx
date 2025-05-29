import htmr from "htmr";
import { useEffect, useState } from "react";
import Editor from "../../../components/Editor";
import Dropzone from "react-dropzone";
import { uploadFile, useDeleteFile } from "../../../api/guru/upload";
import DropzoneFile from "../../../components/Dropzone";
import { DeleteButton } from "../../../components";
import LiveCodingPlayground from "./LiveCoding";
export default function LV({ soals, item, setPayload, payload, tipe }) {
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
      <div className="rounded-md border p-2">
        {htmr(`<div>${soals.soal}</div>`)}
      </div>

      <div className="relative">
        <h5>Jawaban :</h5>

        <LiveCodingPlayground  item={item} handleSoal={ handleSoal} setPayload={setPayload} setJawaban={setJawaban} payload={payload} />
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
