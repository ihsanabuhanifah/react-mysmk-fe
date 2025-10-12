import { useEffect, useState } from "react";
import { Form, Button } from "semantic-ui-react";
import { DeleteButton, FormLabel } from "../../../components";
import Editor from "../../../components/Editor";

// Komponen untuk pilihan dinamis Multi True False
const MultiTrueFalseOptions = ({ value, index, setFieldValue, errors }) => {
  const [options, setOptions] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Inisialisasi options dari value yang ada (hanya sekali)
  useEffect(() => {
    if (!isInitialized && value) {
      const initialOptions = [];
      const fields = ['a', 'b', 'c', 'd', 'e'];
      
      // Cek dari soal.a, b, c, d, e yang ada value-nya
      fields.forEach(field => {
        if (value?.soal?.[field] && value.soal[field] !== null && value.soal[field] !== "") {
          // Cari jawaban yang sesuai dari array jawaban
          const jawabanIndex = initialOptions.length;
          let jawabanValue = false;
          
          if (value?.jawaban) {
            // Jika jawaban adalah string (format backend), split dulu
            if (typeof value.jawaban === 'string') {
              const jawabanArray = value.jawaban.split(',');
              jawabanValue = jawabanArray[jawabanIndex] === "true";
            } 
            // Jika jawaban adalah array (format frontend)
            else if (Array.isArray(value.jawaban)) {
              jawabanValue = value.jawaban[jawabanIndex] === "true";
            }
          }
          
          initialOptions.push({
            pernyataan: value.soal[field],
            jawaban: jawabanValue
          });
        }
      });

      // Jika tidak ada data dari value, gunakan default
      if (initialOptions.length > 0) {
        setOptions(initialOptions);
      } else {
        setOptions([{ pernyataan: "", jawaban: false }]);
      }
      
      setIsInitialized(true);
    }
  }, [value, isInitialized]);

  // Update soal.a, b, c, d, e dan jawaban ketika options berubah
  useEffect(() => {
    if (!isInitialized) return;

    // Update soal fields
    const fields = ['a', 'b', 'c', 'd', 'e'];
    fields.forEach((field, i) => {
      if (options[i] && options[i].pernyataan.trim() !== "") {
        setFieldValue(`payload[${index}].soal.${field}`, options[i].pernyataan);
      } else {
        setFieldValue(`payload[${index}].soal.${field}`, null);
      }
    });

    // Update jawaban - KONVERSI KE STRING untuk backend
    const jawabanArray = options.map(option => 
      option.jawaban === true ? "true" : "false"
    );
    
    // Konversi array menjadi string untuk dikirim ke backend
    const jawabanString = jawabanArray.join(",");
    setFieldValue(`payload[${index}].jawaban`, jawabanString);

  }, [options, index, setFieldValue, isInitialized]);

  const addOption = () => {
    if (options.length < 5) { // Maksimal sampai e (5 options)
      setOptions([...options, { pernyataan: "", jawaban: false }]);
    }
  };

  const removeOption = (optionIndex) => {
    if (options.length > 1) {
      const newOptions = options.filter((_, idx) => idx !== optionIndex);
      setOptions(newOptions);
    }
  };

  const updateOption = (optionIndex, field, newValue) => {
    const newOptions = options.map((option, idx) => 
      idx === optionIndex ? { ...option, [field]: newValue } : option
    );
    setOptions(newOptions);
  };

  const updateJawaban = (optionIndex, newValue) => {
    // Validasi: pastikan jawaban tidak kosong
    if (options[optionIndex]?.pernyataan?.trim() === "") {
      alert("Pernyataan harus diisi terlebih dahulu sebelum memilih jawaban");
      return;
    }

    const newOptions = options.map((option, idx) => 
      idx === optionIndex ? { ...option, jawaban: newValue } : option
    );
    setOptions(newOptions);
  };

  // Fungsi untuk mendapatkan preview jawaban dalam format string
  const getJawabanPreview = () => {
    const jawabanArray = options.map(option => 
      option.jawaban === true ? "true" : "false"
    );
    return jawabanArray.join(",");
  };

  // Debug info untuk melihat data yang diterima
  console.log("Received value:", value);
  console.log("Current options:", options);
  console.log("Is initialized:", isInitialized);

  return (
    <div className="space-y-4">
    

      {options.map((option, optionIndex) => (
        <div key={optionIndex} className="rounded-lg border p-4">
          <div className="mb-3 flex items-start justify-between">
            <FormLabel>Pernyataan {optionIndex+1}</FormLabel>
            <DeleteButton
              size="small"
              disabled={options.length <= 1}
              onClick={() => removeOption(optionIndex)}
            />
          </div>

          <div className="mb-3 grid grid-cols-12 gap-5">
            <textarea
              className="col-span-8"
              placeholder={`Masukkan pernyataan ${String.fromCharCode(65 + optionIndex)}`}
              value={option.pernyataan}
              onChange={(e) => {
                updateOption(optionIndex, "pernyataan", e.target.value);
              }}
              rows={3}
            />
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
                  updateJawaban(optionIndex, data.value);
                }}
                error={errors?.jawaban?.[optionIndex] ? {
                  content: 'Jawaban harus dipilih',
                  pointing: 'above'
                } : null}
              />
            </div>
          </div>

          {/* Tampilkan status validasi */}
          {option.pernyataan.trim() === "" && (
            <div className="mt-2 text-red-500 text-sm">
              * Pernyataan harus diisi sebelum memilih jawaban
            </div>
          )}
        </div>
      ))}

      {/* Info jumlah options */}
      <div className="text-sm text-gray-600">
        {options.length} dari 5 pernyataan digunakan
        {options.length >= 5 && " (Maksimal 5 pernyataan)"}
      </div>

      {/* Preview data yang akan dikirim */}
      <div className="mt-4 p-3 bg-gray-100 rounded-lg">
        <div className="text-sm font-semibold mb-2">Preview Data:</div>
        <div className="text-xs">
          <div><strong>Jawaban (Format Backend):</strong> "{getJawabanPreview()}"</div>
          <div><strong>Pernyataan terisi:</strong> {options.filter(opt => opt.pernyataan.trim() !== "").length}</div>
        </div>
      </div>

      <div className="w-full flex items-center justify-center">
        <Button
          type="button"
          size="small"
          color="blue"
          onClick={addOption}
          icon="add"
          content="Tambah Pernyataan"
          disabled={options.length >= 5} // Maksimal 5 options (a-e)
        />
      </div>
    </div>
  );
};

export default MultiTrueFalseOptions;