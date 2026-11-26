import clsx from "clsx";

export const TIPE_SOAL = [
  { value: "PG", nama: "Pilihan Ganda", ket: "1 jawaban benar (A–E)", ikon: "◉" },
  { value: "MP", nama: "Multi Pilihan", ket: "Lebih dari 1 jawaban benar", ikon: "☑" },
  { value: "TF", nama: "True / False", ket: "Satu pernyataan Benar/Salah", ikon: "⇄" },
  { value: "MTF", nama: "Multi True False", ket: "Beberapa pernyataan B/S", ikon: "☰" },
  { value: "ES", nama: "Essay / Project", ket: "Dinilai manual oleh guru", ikon: "✎" },
  { value: "LV", nama: "Live Coding", ket: "Dinilai manual oleh guru", ikon: "</>" },
];

export const namaTipe = (v) => TIPE_SOAL.find((t) => t.value === v)?.nama || v;

export default function TipeSoalPicker({ value, onChange, disabled, error }) {
  return (
    <div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        {TIPE_SOAL.map((t) => {
          const aktif = value === t.value;
          return (
            <button
              key={t.value}
              type="button"
              disabled={disabled}
              aria-pressed={aktif}
              onClick={() => !aktif && onChange(t.value)}
              className={clsx(
                "flex flex-col items-start rounded-lg border-2 p-3 text-left transition-all",
                aktif
                  ? "border-green-500 bg-green-50 shadow-sm"
                  : "border-gray-200 bg-white hover:border-green-300 hover:bg-gray-50",
                { "cursor-not-allowed opacity-60": disabled },
              )}
            >
              <span
                className={clsx(
                  "mb-1 flex h-8 w-8 items-center justify-center rounded-md text-sm font-bold",
                  aktif ? "bg-green-500 text-white" : "bg-gray-100 text-gray-600",
                )}
              >
                {t.ikon}
              </span>
              <span
                className={clsx(
                  "text-sm font-semibold",
                  aktif ? "text-green-800" : "text-gray-800",
                )}
              >
                {t.nama}
              </span>
              <span className="text-xs text-gray-500">{t.ket}</span>
            </button>
          );
        })}
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
