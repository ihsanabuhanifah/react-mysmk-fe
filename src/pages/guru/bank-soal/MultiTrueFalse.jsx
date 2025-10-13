import { useEffect, useState } from "react";
import { Form, Button } from "semantic-ui-react";
import { DeleteButton, FormLabel } from "../../../components";
import Editor from "../../../components/Editor";
import MemoizedEditor from "../../../components/MemorizeEditor";

// Komponen untuk pilihan dinamis Multi True False
const MultiTrueFalseOptions = ({
  value,
  index,
  setFieldValue,
  errors,
  memorize,
}) => {
  const [options, setOptions] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  console.log("v", value);

  // Inisialisasi options dari value yang ada (hanya sekali)
  useEffect(() => {
    if (!isInitialized && value) {
      const initialOptions = [];
      const fields = ["a", "b", "c", "d", "e"];

      // Cek dari soal.a, b, c, d, e yang ada value-nya
      fields.forEach((field) => {
        if (
          value?.soal?.[field] &&
          value.soal[field] !== null &&
          value.soal[field] !== ""
        ) {
          // Cari jawaban yang sesuai dari array jawaban
          const jawabanIndex = initialOptions.length;
          let jawabanValue = false;

          if (value?.jawaban) {
            // Jika jawaban adalah string (format backend), split dulu
            if (typeof value.jawaban === "string") {
              const jawabanArray = value.jawaban.split(",");
              jawabanValue = jawabanArray[jawabanIndex] === "true";
            }
            // Jika jawaban adalah array (format frontend)
            else if (Array.isArray(value.jawaban)) {
              jawabanValue = value.jawaban[jawabanIndex] === "true";
            }
          }

          initialOptions.push({
            id: `${field}-${Date.now()}-${Math.random()}`, // ID unik
            field: field, // Simpan field asli (a, b, c, d, e)
            pernyataan: value.soal[field],
            jawaban: jawabanValue,
          });
        }
      });

      // Jika tidak ada data dari value, buat default dengan ID unik
      if (initialOptions.length > 0) {
        setOptions(initialOptions);
      } else {
        setOptions([
          {
            id: `a-${Date.now()}-${Math.random()}`,
            field: "a",
            pernyataan: "",
            jawaban: false,
          },
        ]);
      }

      setIsInitialized(true);
    }
  }, [value, isInitialized]);

  // Update soal.a, b, c, d, e dan jawaban ketika options berubah
  useEffect(() => {
    if (!isInitialized) return;

    // Reset semua field soal terlebih dahulu
    const fields = ["a", "b", "c", "d", "e"];
   

    // Update jawaban - KONVERSI KE STRING untuk backend
    const jawabanArray = options.map((option) =>
      option.jawaban === true ? "true" : "false",
    );

    // Konversi array menjadi string untuk dikirim ke backend
    const jawabanString = jawabanArray.join(",");
    setFieldValue(`payload[${index}].jawaban`, jawabanString);
  }, [options, index, setFieldValue, isInitialized]);

  const addOption = () => {
    if (options.length < 5) {
      // Tentukan field berikutnya yang tersedia
      const usedFields = options.map((opt) => opt.field);
      const availableFields = ["a", "b", "c", "d", "e"].filter(
        (field) => !usedFields.includes(field),
      );

      if (availableFields.length > 0) {
        const newField = availableFields[0];
        setOptions([
          ...options,
          {
            id: `${newField}-${Date.now()}-${Math.random()}`,
            field: newField,
            pernyataan: "",
            jawaban: false,
          },
        ]);
      }
    }
  };

  const removeOption = (optionId) => {
    if (options.length > 1) {
      const newOptions = options.filter((option) => option.id !== optionId);
      setOptions(newOptions);
    }
  };

  const updateOption = (optionId, field, newValue) => {
    const newOptions = options.map((option) =>
      option.id === optionId ? { ...option, [field]: newValue } : option,
    );
    setOptions(newOptions);
  };

  const updateJawaban = (optionId, newValue) => {
    const optionToUpdate = options.find((opt) => opt.id === optionId);

    // Validasi: pastikan pernyataan tidak kosong
   

    const newOptions = options.map((option) =>
      option.id === optionId ? { ...option, jawaban: newValue } : option,
    );
    setOptions(newOptions);
  };

  // Fungsi untuk mendapatkan preview jawaban dalam format string
  const getJawabanPreview = () => {
    const jawabanArray = options.map((option) =>
      option.jawaban === true ? "true" : "false",
    );
    return jawabanArray.join(",");
  };

  // Fungsi untuk mendapatkan field label
  const getFieldLabel = (field) => {
    return field.toUpperCase();
  };

  console.log("o", options);

  return (
    <div className="space-y-4">
      {options.map((option, optionIndex) => (
        <div key={option.id} className="rounded-lg border p-4">
          <div className="mb-3 flex items-start justify-between">
            <div className="flex items-center space-x-2">
              <FormLabel>Pernyataan {optionIndex + 1}</FormLabel>
            </div>
            <DeleteButton
              size="small"
              disabled={options.length <= 1}
              onClick={() =>{
                  setFieldValue(
                      `payload[${index}].soal.${option.field}`,
                      null,
                    );
                 removeOption(option.id)
              }}
            />
          </div>

          <div className="mb-3 grid grid-cols-12 gap-5">
            <div className="col-span-8">
              {memorize ? (
                <MemoizedEditor
                  value={value.soal[option.field]}
                  handleChange={(content) => {
                    setFieldValue(
                      `payload[${index}].soal.${option.field}`,
                      content,
                    );
                  }}
                  error={
                    errors?.payload?.[index]?.soal?.[option.field] !==
                      undefined &&
                    errors?.payload?.[index]?.soal?.[option.field]
                  }
                />
              ) : (
                <Editor
                  value={value.soal[option.field]}
                  handleChange={(content) => {
                    setFieldValue(
                      `payload[${index}].soal.${option.field}`,
                      content,
                    );
                  }}
                  error={
                    errors?.payload?.[index]?.soal?.[option.field] !==
                      undefined &&
                    errors?.payload?.[index]?.soal?.[option.field]
                  }
                />
              )}
            </div>
            <div className="col-span-4">
              <Form.Dropdown
                selection
                label="Jawaban"
                placeholder="Pilih jawaban"
                options={[
                  { key: "true", value: true, text: "Benar" },
                  { key: "false", value: false, text: "Salah" },
                ]}
                value={option.jawaban}
                onChange={(e, data) => {
                  updateJawaban(option.id, data.value);
                }}
                error={
                  errors?.payload?.[index]?.jawaban !== undefined && {
                    content: errors.payload[index].jawaban,
                    pointing: "above",
                  }
                }
              />
            </div>
          </div>

         
        </div>
      ))}

      {/* Info jumlah options */}
      <div className="text-sm text-gray-600">
        {options.length} dari 5 pernyataan digunakan
        {options.length >= 5 && " (Maksimal 5 pernyataan)"}
      </div>

      {/* Preview data yang akan dikirim */}

      <div className="flex w-full items-center justify-center">
        <Button
          type="button"
          size="small"
          color="blue"
          onClick={addOption}
          icon="add"
          content="Tambah Pernyataan"
          disabled={options.length >= 5}
        />
      </div>
    </div>
  );
};

export default MultiTrueFalseOptions;
