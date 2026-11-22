import React from "react";
import { Link } from "react-router-dom";
import { FiCheckCircle } from "react-icons/fi";
import LogoMySMK from "../../image/MySMK.png";
import HeroImage from "../../image/login.png";

const ROLES = [
  {
    title: "Guru & Musyrif",
    points: ["Isi absensi dan agenda", "Kelola bank soal & ujian", "Pantau halaqoh santri"],
  },
  {
    title: "Siswa",
    points: ["Ikuti ujian online", "Kirim laporan PKL", "Lihat hasil belajar"],
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-800 font-poppins">
      {/* Navbar */}
      <header className="border-b border-gray-100">
        <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img src={LogoMySMK} alt="MySMK" className="h-9 w-auto" />
          </Link>
          <Link
            to="/login"
            className="px-5 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 hover:text-white"
          >
            Masuk
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-b from-green-50 to-white">
          <div className="max-w-6xl mx-auto px-4 py-16 lg:py-24 grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-3 py-1 mb-5 text-xs font-semibold tracking-wide text-green-700 bg-green-100 rounded-full">
                SMK Madinatul Quran
              </span>
              <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight text-gray-900">
                Sistem informasi <span className="text-green-600">SMK Madinatul Quran</span>
              </h1>
              <p className="mt-5 text-lg text-gray-600 max-w-xl">
                Aplikasi internal sekolah untuk guru, musyrif, dan siswa. Silakan masuk
                menggunakan akun yang diberikan oleh sekolah.
              </p>
              <div className="mt-8">
                <Link
                  to="/login"
                  className="inline-block px-6 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 hover:text-white shadow-sm"
                >
                  Masuk ke MySMK
                </Link>
              </div>
            </div>
            <div className="hidden lg:flex justify-center">
              <div className="relative">
                <div className="absolute -inset-4 bg-green-200 rounded-3xl transform rotate-3" />
                <img
                  src={HeroImage}
                  alt="Santri SMK Madinatul Quran"
                  className="relative w-80 h-[26rem] object-cover rounded-3xl shadow-xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Pengguna */}
        <section className="max-w-4xl mx-auto px-4 pb-20">
          <div className="grid md:grid-cols-2 gap-6">
            {ROLES.map((r) => (
              <div key={r.title} className="p-6 rounded-2xl bg-gray-50 border border-gray-100">
                <h3 className="text-lg font-semibold text-green-700">{r.title}</h3>
                <ul className="mt-4 space-y-3">
                  {r.points.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-sm text-gray-700">
                      <FiCheckCircle className="mt-0.5 text-green-500 flex-shrink-0" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} SMK Madinatul Quran
        </div>
      </footer>
    </div>
  );
}
