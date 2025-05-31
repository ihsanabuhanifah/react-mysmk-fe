import React, { useState, useRef, useEffect } from "react";
import { imageParse } from "../../../api/guru/ujian";
import { Icon, Progress } from "semantic-ui-react";
import { FiXCircle } from "react-icons/fi";

const ImageUploader = ({ setFieldValue, index, values }) => {
  const [preview, setPreview] = useState(null);
  const [status, setStatus] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const dropRef = useRef(null);

  const uploadImage = async (file) => {
    setStatus("Memproses gambar...");
    setUploadProgress(30);

    try {
      const res = await imageParse(file);
      const soal = res.data.text;

      console.log("res", res.data)

      // Update all fields at once
      setFieldValue(`payload[${index}]`, {
        ...values.payload[index],
        point: 10,
        tipe: "PG",
        jawaban: soal?.jawaban,
        soal: {
          ...values.payload[index].soal,
          tipe: "PG",
          soal: `<div>${soal?.pertanyaan?.replace(/\n/g, '<br>')}</div>`,
          a: soal?.pilihan?.A || "-",
          b: soal?.pilihan?.B || "-",
          c: soal?.pilihan?.C || "-",
          d: soal?.pilihan?.D || "-",
          e: soal?.pilihan?.E || "-",
        },
       
      });

      setUploadProgress(100);
      setStatus("Soal berhasil dibuat dari gambar!");
    } catch (error) {
      console.error(error);
      setStatus("Gagal memproses gambar. Coba lagi.");
      setUploadProgress(0);
    }
  };

  const handleFiles = (file) => {
    if (file && file.type.startsWith("image/")) {
      setPreview(URL.createObjectURL(file));
      uploadImage(file);
    } else {
      setStatus("Hanya file gambar yang diperbolehkan (JPEG/PNG)");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFiles(file);
  };

  const handlePaste = (e) => {
    const items = e.clipboardData.items;
    for (const item of items) {
      if (item.type.indexOf("image") !== -1) {
        const file = item.getAsFile();
        handleFiles(file);
      }
    }
  };

  useEffect(() => {
    const dropArea = dropRef.current;
    dropArea.addEventListener("paste", handlePaste);
    return () => dropArea.removeEventListener("paste", handlePaste);
  }, []);

  return (
    <div
      ref={dropRef}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="cursor-pointer w-full relative rounded-xl border-2 border-dashed border-blue-200 bg-blue-50 p-6 text-center transition-all hover:border-blue-300 hover:bg-blue-100"
      style={{ minHeight: "200px" }}
    >
      <div className="mb-4 flex justify-center">
        <Icon 
          name="image outline" 
          size="big" 
          color="blue" 
          className="!block"
        />
      </div>

      <div className="absolute right-1 top-3 ">
       <button onClick={()=> {
        setPreview("")
        setStatus("")
        setUploadProgress(0)

       }} className="flex items-center justify-between" > <FiXCircle/> </button>
      </div>
      
      <h4 className="text-lg font-medium text-gray-700">
        Buat Soal dari Gambar
      </h4>
      
      <p className="mt-2 text-gray-500">
        Seret & lepas gambar soal ke sini, atau <br />
        <span className="font-semibold text-blue-500">tempel (Ctrl+V)</span> gambar yang sudah disalin
      </p>

      {uploadProgress > 0 && uploadProgress < 100 && (
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
        <div className="mt-4 rounded-lg border border-gray-200 p-2">
          <img
            src={preview}
            alt="Pratinjau Soal"
            className="mx-auto max-h-40 max-w-full rounded"
          />
        </div>
      )}

      {status && (
        <p className={`mt-3 text-sm ${
          status.includes("Gagal") 
            ? "text-red-500" 
            : "text-green-500"
        }`}>
          <Icon 
            name={status.includes("Gagal") ? "warning circle" : "check circle"} 
          />
          {status}
        </p>
      )}

      <div className="mt-4 text-xs text-gray-400">
        Format yang didukung: JPG, PNG (Maks. 5MB)
      </div>
    </div>
  );
};

export default React.memo(ImageUploader);