import React from "react";

/**
 * Tab berbentuk tombol segmen.
 * tabs: [{ key, label, count? }] — count > 0 tampil sebagai badge merah.
 */
export default function TabSwitch({ tabs, active, onChange }) {
  return (
    <div className="inline-flex w-full flex-wrap gap-1 rounded-xl border border-[#80DFDF] bg-[#E6F9F9] p-1 md:w-auto">
      {tabs.map((t) => {
        const isActive = t.key === active;
        return (
          <button
            key={t.key}
            type="button"
            onClick={() => onChange(t.key)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-base font-semibold transition md:flex-none ${
              isActive
                ? "bg-[#00BFBF] text-white shadow-md"
                : "text-[#008080] hover:bg-[#CCF2F2]"
            }`}
          >
            {t.label}
            {t.count > 0 && (
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                  isActive ? "bg-white text-red-600" : "bg-red-500 text-white"
                }`}
              >
                {t.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
