/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { Link } from "react-router-dom";
import LogoPpdb from "../../image/ppdb/ppdb.png";
import Banner from "../../image/ppdb/banner.png";
import Gambarsatu from "../../image/ppdb/s1.png";
import GambarTiga from "../../image/ppdb/s3.png";
import Diniyyah from "../../image/ppdb/diniyyah.png";
import TKJ from "../../image/ppdb/TKJ.png";
import RPL from "../../image/ppdb/RPL.png";
import ProgramUnggulan from "../../image/ppdb/Program.png";
import Nav from "../../components/Nav";

const LandingPage = () => {
  return (
    <>
      <Nav />
      {/* Navbar */}
      {/* <header className="relative flex flex-wrap sm:justify-start sm:flex-nowrap w-full bg-white text-sm py-3 dark:bg-neutral-800">
        <nav className="max-w-[85rem] w-full mx-auto px-4 sm:flex sm:items-center sm:justify-between">
          <div className="flex items-center justify-between">
            <a
              className="flex-none text-xl font-semibold dark:text-white focus:outline-none focus:opacity-80"
              href="#"
              aria-label="Brand"
            >
              <span className="inline-flex items-center gap-x-2 text-xl font-semibold dark:text-white">
                <svg
                  className="w-10 h-auto"
                  width="100"
                  height="100"
                  viewBox="0 0 100 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="100" height="100" rx="10" fill="black" />
                  <path
                    d="M37.656 68V31.6364H51.5764C54.2043 31.6364 56.3882 32.0507 58.1283 32.8793C59.8802 33.696 61.1882 34.8146 62.0523 36.2351C62.9282 37.6555 63.3662 39.2654 63.3662 41.0646C63.3662 42.5443 63.0821 43.8108 62.5139 44.8643C61.9458 45.906 61.1823 46.7524 60.2235 47.4034C59.2646 48.0544 58.1934 48.522 57.0097 48.8061V49.1612C58.2999 49.2322 59.5369 49.6288 60.7206 50.3509C61.9162 51.0611 62.8927 52.0672 63.6503 53.3693C64.4079 54.6714 64.7867 56.2457 64.7867 58.0923C64.7867 59.9744 64.3309 61.6671 63.4195 63.1705C62.508 64.6619 61.1349 65.8397 59.3002 66.7038C57.4654 67.5679 55.1572 68 52.3754 68H37.656ZM44.2433 62.4957H51.3279C53.719 62.4957 55.4413 62.04 56.4948 61.1286C57.5601 60.2053 58.0928 59.0215 58.0928 57.5774C58.0928 56.5002 57.8264 55.5296 57.2938 54.6655C56.7611 53.7895 56.0035 53.103 55.021 52.6058C54.0386 52.0968 52.8667 51.8423 51.5054 51.8423H44.2433V62.4957ZM44.2433 47.1016H50.7597C51.896 47.1016 52.92 46.8944 53.8314 46.4801C54.7429 46.054 55.459 45.4562 55.9798 44.6868C56.5125 43.9055 56.7789 42.9822 56.7789 41.9169C56.7789 40.5083 56.2817 39.3482 55.2874 38.4368C54.3049 37.5253 52.843 37.0696 50.9017 37.0696H44.2433V47.1016Z"
                    fill="white"
                  />
                </svg>
                Brand
              </span>
            </a>
            <div className="sm:hidden">
              <button
                type="button"
                className="hs-collapse-toggle relative size-7 flex justify-center items-center gap-x-2 rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-transparent dark:border-neutral-700 dark:text-white dark:hover:bg-white/10 dark:focus:bg-white/10"
                id="hs-navbar-example-collapse"
                aria-expanded="false"
                aria-controls="hs-navbar-example"
                aria-label="Toggle navigation"
                data-hs-collapse="#hs-navbar-example"
              >
                <svg
                  className="hs-collapse-open:hidden shrink-0 size-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <line x1="3" x2="21" y1="6" y2="6" />
                  <line x1="3" x2="21" y1="12" y2="12" />
                  <line x1="3" x2="21" y1="18" y2="18" />
                </svg>
                <svg
                  className="hs-collapse-open:block hidden shrink-0 size-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
                <span className="sr-only">Toggle navigation</span>
              </button>
            </div>
          </div>
          <div
            id="hs-navbar-example"
            className="hidden hs-collapse overflow-hidden transition-all duration-300 basis-full grow sm:block"
            aria-labelledby="hs-navbar-example-collapse"
          >
            <div className="flex flex-col gap-5 mt-5 sm:flex-row sm:items-center sm:justify-end sm:mt-0 sm:ps-5">
              <a
                className="font-medium text-blue-500 focus:outline-none"
                href="#"
                aria-current="page"
              >
                Landing
              </a>
              <a
                className="font-medium text-gray-600 hover:text-gray-400 focus:outline-none focus:text-gray-400 dark:text-neutral-400 dark:hover:text-neutral-500 dark:focus:text-neutral-500"
                href="#"
              >
                Account
              </a>
              <a
                className="font-medium text-gray-600 hover:text-gray-400 focus:outline-none focus:text-gray-400 dark:text-neutral-400 dark:hover:text-neutral-500 dark:focus:text-neutral-500"
                href="#"
              >
                Work
              </a>
              <a
                className="font-medium text-gray-600 hover:text-gray-400 focus:outline-none focus:text-gray-400 dark:text-neutral-400 dark:hover:text-neutral-500 dark:focus:text-neutral-500"
                href="#"
              >
                Blog
              </a>
            </div>
          </div>
        </nav>
      </header> */}

      {/* Akhir Navbar */}
      <main className="">
        {/* Bagian Banner */}
        <div className="p-4 bg-imageBackground bg-cover bg-center h-screen w-full flex items-center justify-between px-8">
          <div className="flex flex-col justify-start mr-8">
            <p className="text-white text-5xl text-start leading-tight mb-6">
              Penerimaan Santri
              <br />
              Baru Tahun Ajaran
              <br />
              2025-2026
            </p>
            <div className="flex gap-6 justify-start">
              <Link to="register">
                <button className="w-auto h-auto bg-white rounded-md px-8 py-2">
                  <p className="text-customGreen font-semibold text-lg">
                    Daftar
                  </p>
                </button>
              </Link>
              <Link to="login">
                <button className="w-auto h-auto bg-white rounded-md px-8 py-2">
                  <p className="text-customGreen font-semibold text-lg">
                    Login
                  </p>
                </button>
              </Link>
            </div>
          </div>
          <div>
            <img
              src={Banner}
              alt="Banner"
              style={{ minHeight: "60%", minWidth: "60%" }}
            />
          </div>
        </div>
        {/* Akhir Banner */}

        {/* I */}
        <div className="flex my-10 mx-8 items-center space-x-8">
          <div className="flex flex-col gap-8 mb-10">
            <h3 className="text-customGreen text-4xl">
              SMK MADINATULQURAN <br /> Boarding School
            </h3>

            <p>
              Sekolah Menengah Kejuruan MADINATULQURAN atau SMK MQ adalah salah
              satu sekolah di Kecamatan Jonggol Kabupaten Bogor, Jawa Barat yang
              beroperasi mulai tahun 2015 dan sudah terakreditasi dari BANS/M
              Kemendikbud.
            </p>
          </div>
          <img
            src={Gambarsatu}
            alt="Gambar"
            className="object-contain"
            style={{ maxHeight: "15%", maxWidth: "15%" }}
          />
        </div>
        {/* Akhir I */}

        {/* 2 */}
        <div className="mx-8 my-10">
          <div className="h-3/5 w-auto px-8 py-4 bg-green-600 rounded-md mb-20">
            <div className="text-center text-white text-xl">
              <p>Program</p>
              <p>SMK MADINATULQURAN</p>
            </div>
          </div>
          <div className="w-full md:w-[1021px] h-auto md:h-[380px] px-4 py-4 md:px-8 md:py-4 bg-white drop-shadow-md rounded-xl my-12 md:my-16 md:ml-32 z-10">
            <div className="flex flex-col md:flex-row gap-6 md:gap-12">
              <div className="pr-0 md:pr-6">
                <p className="text-customGreen text-xl md:text-2xl font-semibold">
                  Diniyyah & Umum
                </p>
                <p>
                  Sebagai acuan dasar dalam penyelenggaraan Lembaga Pendidikan
                  Sekolah, para santri juga dibekali pelajaran:
                </p>
                <ul className="list-disc ml-4">
                  <li>Tahfidz Quran (Target Hafalan 3 juz)</li>
                  <li>Aqidah</li>
                  <li>Adab</li>
                  <li>Sirah Nabi</li>
                  <li>Hadist</li>
                  <li>Fiqih Islam</li>
                  <li>Kurikulum Diknas</li>
                </ul>
              </div>
              <img
                src={Diniyyah}
                alt="Diniyyah"
                className="object-contain max-w-full h-auto md:max-h-[40%] md:max-w-[40%]"
              />
            </div>
          </div>

          <div className="w-full md:w-[1021px] h-auto md:h-[380px] px-4 py-4 md:px-8 md:py-4 bg-white drop-shadow-md rounded-xl my-12 md:my-16 md:ml-96 z-10">
            <div className="flex flex-col md:flex-row gap-6 md:gap-12">
              <div className="pr-0 md:pr-6">
                <p className="text-customGreen text-xl md:text-2xl font-semibold">
                  Network Engineer (TKJ)
                </p>
                <p>
                  Santri yang masuk dalam jurusan TKJ (Teknik Komputer dan
                  Jaringan) akan berfokus mempelajari infastruktur Jaringan
                  Komputer dan Server. Materi yang akan dipelajari:
                </p>
                <ul className="list-disc ml-4">
                  <li>Network Engineer (Cisco dan Mikrotik)</li>
                  <li className="text-start">
                    System Engineer (Linux System Administration, Docker
                    Container, Ansible, CI/CD Jenkins, Monitoring)
                  </li>
                </ul>
              </div>
              <img
                src={TKJ}
                alt="TKJ"
                className="object-contain max-w-full h-auto md:max-h-[40%] md:max-w-[40%]"
              />
            </div>
          </div>

          <div className="w-full md:w-[1021px] h-auto md:h-[380px] px-4 py-4 md:px-8 md:py-4 bg-white drop-shadow-md rounded-xl my-12 md:my-16 md:ml-32 z-10">
            <div className="flex flex-col md:flex-row gap-6 md:gap-12">
              <div className="pr-0 md:pr-6">
                <p className="text-customGreen text-xl md:text-2xl font-semibold">
                  Software Engineer (RPL)
                </p>
                <p>
                  Santri RPL (Rekayasa Perangkat Lunak) berfokus mempelajari
                  bagaimana mengembangkan software yang berbasis Web dan Mobile.
                  Materi yang akan dipelajari:
                </p>
                <ul className="list-disc ml-4">
                  <li>UI/UX Design (Figma)</li>
                  <li>Front End Development (ReactJS, NextJS, Tailwindcss)</li>
                  <li>Back End Development (ExpressJS, NestJS)</li>
                  <li>Mobile Development (Flutter)</li>
                </ul>
              </div>
              <img
                src={RPL}
                alt="RPL"
                className="object-contain max-w-full h-auto md:max-h-[40%] md:max-w-[40%]"
              />
            </div>
          </div>

          <div className="w-full md:w-[1021px] h-auto md:h-[380px] px-4 py-4 md:px-8 md:py-4 bg-white drop-shadow-md rounded-xl my-12 md:my-16 md:ml-96 z-10">
            <div className="flex flex-col md:flex-row gap-6 md:gap-12">
              <div className="pr-0 md:pr-6">
                <p className="text-customGreen text-xl md:text-2xl font-semibold">
                  Program Unggulan
                </p>
                <p>
                  Selain belajar tentang IT, santri akan mengikuti program
                  unggulan pada 3 bulan pertama sebagai bekal penunjang sebelum
                  memulai kegiatan belajar mengajar.
                </p>
                <ul className="list-disc ml-4">
                  <li>Tahfidz Camp</li>
                  <li>English Camp</li>
                  <li>English Discovery</li>
                </ul>
              </div>
              <img
                src={ProgramUnggulan}
                alt="ProgramUnggulan"
                className="object-contain max-w-full h-auto md:max-h-[40%] md:max-w-[40%]"
              />
            </div>
          </div>
        </div>
        {/* Akhir 2 */}

        {/* 3 */}
        <div className="p-4 h-screen w-full flex items-center justify-center gap-28 bg-backgroundFooter">
          <img
            src={GambarTiga}
            alt="Gambar Tiga"
            className="max-h-[30%] max-w-[30%] object-contain"
          />
          <div className="flex flex-col space-y-5 text-xl text-white">
            <p className="text-lg">Apa yang harus dipersiapkan?</p>

            <div className="text-start">
              <p className="text-3xl font-semibold">Persyaratan Administrasi</p>
              <div>
                <ul className="list-disc ml-8 my-2">
                  <li>Pas photo 80% wajah, background biru</li>
                  <li>Akte Kelahiran</li>
                  <li>KTP Orang Tua</li>
                  <li>Kartu Keluarga</li>
                  <li>Surat pernyataan orang tua (format disediakan)</li>
                  <li>Surat pernyataan santri (format disediakan)</li>
                  <li>Sertifikat prestasi (jika ada)</li>
                </ul>
              </div>
              <p>Semua berkas di atas disediakan dalam bentuk Soft Copy/Scan</p>
            </div>
          </div>
        </div>

        {/* Akhir 3 */}

        {/* 4 */}
        <div className="my-8">
          <div className="text-center mb-8">
            <p className="text-xl font-medium">Berapa Biayanya?</p>
            <p className="text-green-700 font-semibold text-3xl">
              Biaya Pendidikan
            </p>
            <p className="text-xl mx-4">
              Berikut detail biaya pendidikan tahun ajaran 2025-2026
            </p>
          </div>

          <div className="bg-imageAbstrak w-[600px] h-[150px]  rounded-xl shadow-xl flex justify-center items-center my-4 md:mx-auto mx-2">
            <div className="text-center">
              <p className="text-3xl text-green-600 font-semibold">
                Pendaftaran
              </p>
              <p className="text-xl font-semibold">Rp 450.000</p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-12">
            <div className="bg-imageAbstrak w-[350px] h-[150px] rounded-xl shadow-xl flex justify-center items-center my-4">
              <div className="text-center">
                <p className="text-3xl text-green-600 font-semibold">
                  Uang Masuk
                </p>
                <p className="text-xl font-semibold">Rp 18.500.000</p>
              </div>
            </div>

            <div className="bg-imageAbstrak w-[350px] h-[150px] rounded-xl shadow-xl flex justify-center items-center my-4">
              <div className="text-center">
                <p className="text-3xl text-green-600 font-semibold">
                  Daftar Ulang
                </p>
                <p className="text-xl font-semibold">Rp 3.500.000</p>
              </div>
            </div>

            <div className="bg-imageAbstrak w-[350px] h-[150px] rounded-xl shadow-xl flex justify-center items-center my-4">
              <div className="text-center">
                <p className="text-3xl text-green-600 font-semibold">
                  SPP Bulanan
                </p>
                <p className="text-xl font-semibold">Rp 2.500.000</p>
              </div>
            </div>

            <div className="w-full flex justify-center my-4">
              <ul className="text-red-500">
                <li>* Diskon 50% khusus untuk alumni SMP Madinatul Qur'an</li>
                <li>
                  * Apabila mengundurkan diri, uang tidak dapat dikembalikan
                </li>
              </ul>
            </div>
          </div>
        </div>
        {/* Akhir 4 */}

        {/*  5 */}

        <div className="bg-backgroundFooter max-w-screen-lg w-full h-auto rounded-2xl mx-auto my-10 px-4 sm:px-6 md:px-8 lg:px-12 py-6 sm:py-8 lg:py-10 text-white">
          <div className="text-left mb-6 sm:mb-8">
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold mb-4">
              Keterangan:
            </p>
            <ul className="list-inside list-decimal text-sm sm:text-base md:text-lg lg:text-xl font-semibold">
              <li className="mb-4">
                <strong className="text-white">Uang Pendaftaran:</strong>{" "}
                digunakan untuk tes potensi (minat dan bakat) siswa, serta
                potensi akademis dan non-akademis.
              </li>
              <li className="pb-4">
                <strong className="text-white">
                  Uang Masuk = Rp. 18.500.000,- (Tidak Termasuk SPP Bulan Juli):
                </strong>
                <ul className="list-inside list-disc ml-4 sm:ml-6 md:ml-8 lg:ml-10 text-sm sm:text-base md:text-lg lg:text-base font-medium">
                  <li>
                    Perlengkapan Tidur, Ranjang, Kasur, Sprei, Bantal dan Tempat
                    Baju
                  </li>
                  <li>Seragam Olahraga dan Baju Praktek</li>
                  <li>E-modul Pelajaran</li>
                  <li>
                    Uang Masuk Tahap 1 = Rp. 10.000.000,- (Dibayar Ketika Santri
                    Dinyatakan Lulus Test)
                  </li>
                  <li>
                    Uang Masuk Tahap 2 = Rp. 8.500.000,- (Dibayar Sebulan
                    Sebelum Santri Masuk Pondok)
                  </li>
                </ul>
              </li>
              <li className="mb-4">
                <strong className="text-white">
                  SPP Bulanan = Rp. 2.500.000,-:
                </strong>
                <ul className="list-inside list-disc ml-4 sm:ml-6 md:ml-8 lg:ml-10 text-sm sm:text-base md:text-lg lg:text-base font-medium">
                  <li>Makan</li>
                  <li>Laundry</li>
                  <li>Biaya Pendidikan</li>
                </ul>
              </li>
              <li>
                <strong className="text-white">
                  Daftar Ulang = Rp. 3.500.000,- (Dibayar Ketika Santri Naik ke
                  Kelas XI dan XII):
                </strong>
                <ul className="list-inside list-disc ml-4 sm:ml-6 md:ml-8 lg:ml-10 text-sm sm:text-base md:text-lg lg:text-base font-medium">
                  <li>Pemeliharaan dan Perbaikan Sarpras</li>
                </ul>
              </li>
            </ul>
          </div>
        </div>

        {/*  Akhir 5 */}

        <div className="min-h-[50vh] flex justify-center items-center bg-parallax bg-fixed bg-no-repeat bg-cover bg-center">
          <div className="text-center">
            <h3 className="text-white font-medium text-4xl">
              Segera daftarkan putra anda sekarang
            </h3>
            <div className="text-white text-xl font-normal text-center max-w-lg mx-auto">
              <p>
                InsyaAllah kami adalah jawaban ayah bunda yang ingin putranya
                belajar IT, tetapi tetap menomor satukan belajar diniyah sebagai
                bekal hidupnya.
              </p>
            </div>
            <div className="pt-4">
              <Link to="login">
                <button className="w-auto h-auto bg-white rounded-lg px-8 py-2">
                  <p className="text-customGreen font-semibold text-lg">
                    Daftar sekarang
                  </p>
                </button>
              </Link>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-8">
          <Link to="login" className="text-blue-500 hover:text-green-400 ">
            Login
          </Link>
          <Link to="register" className="text-blue-500 hover:text-green-400 ">
            Register
          </Link>
          <Link to="dashboard" className="text-blue-500 hover:text-green-400 ">
            Dashboard
          </Link>
        </div>

        <footer className="bg-backgroundFooter">
          <div className="mx-auto max-w-screen-xl px-4 py-8 sm:py-12 lg:py-16 sm:px-6 lg:px-8">
            <div className="mt-8 sm:mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <div className="text-center sm:text-left">
                <p className="text-2xl font-semibold text-white">Kontak</p>
                <ul className="mt-4 sm:mt-8 space-y-2 sm:space-y-4 text-lg">
                  <li>
                    <a
                      className="text-white transition hover:text-gray-700/75"
                      href="tel:085888222457"
                    >
                      085 888 222 457 (PSB)
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-white transition hover:text-gray-700/75"
                      href="tel:08126900457"
                    >
                      0812 6900 457 (Hotline)
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-white transition hover:text-gray-700/75"
                      href="mailto:info@smkmadinatulquran.sch.id"
                    >
                      info@smkmadinatulquran.sch.id
                    </a>
                  </li>
                </ul>
              </div>

              <div className="text-center sm:text-left sm:pl-10 lg:pl-20">
                <p className="text-2xl font-semibold text-white">
                  Media Sosial
                </p>
                <ul className="mt-4 sm:mt-8 space-y-2 sm:space-y-4 text-lg">
                  <li className="flex justify-center sm:justify-start items-center gap-4">
                    <a
                      href="https://facebook.com"
                      rel="noreferrer"
                      target="_blank"
                      className="text-white transition hover:text-teal-700/75 flex items-center"
                    >
                      <svg
                        className="h-6 w-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="sr-only">Facebook</span>
                    </a>
                    <a
                      href="https://facebook.com"
                      className="text-white transition hover:text-gray-700/75"
                    >
                      Facebook
                    </a>
                  </li>
                  <li className="flex justify-center sm:justify-start items-center gap-4">
                    <a
                      href="https://instagram.com"
                      rel="noreferrer"
                      target="_blank"
                      className="text-white transition hover:text-teal-700/75 flex items-center"
                    >
                      <svg
                        className="h-6 w-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.027.047-1.382.059-4.12.059s-2.994-.012-4.123-.059c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.027-.059-1.382-.059-4.043v-.08c0-2.642.012-2.987.059-4.123.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772 4.902 4.902 0 011.772-1.153c.636-.247 1.363-.416 2.427-.465 1.057-.048 1.372-.06 3.809-.06zm0-2C9.922 0 9.558.012 8.596.06 7.641.108 6.756.292 5.974.537a6.897 6.897 0 00-2.564 1.686 6.897 6.897 0 00-1.686 2.564C1.045 5.756.261 6.641.213 7.596.165 8.558.153 9.922.153 12c0 2.078.012 3.442.06 4.404.048 1.056.215 1.943.537 2.719a6.897 6.897 0 001.686 2.564 6.897 6.897 0 002.564 1.686c.776.322 1.663.489 2.719.537 1.072.048 2.326.06 4.404.06 2.078 0 3.431-.012 4.404-.06 1.056-.048 1.943-.215 2.719-.537a6.897 6.897 0 002.564-1.686 6.897 6.897 0 001.686-2.564c.322-.776.489-1.663.537-2.719.048-1.072.06-2.326.06-4.404 0-2.078-.012-3.431-.06-4.404-.048-1.056-.215-1.943-.537-2.719a6.897 6.897 0 00-1.686-2.564 6.897 6.897 0 00-2.564-1.686c-.776-.322-1.663-.489-2.719-.537C15.746.012 14.392 0 12.315 0zM12 6.262a5.738 5.738 0 100 11.476A5.738 5.738 0 0012 6.262zm0 9.75a4.012 4.012 0 110-8.023 4.012 4.012 0 010 8.023zm4.572-8.375a1.079 1.079 0 100 2.158 1.079 1.079 0 000-2.158z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="sr-only">Instagram</span>
                    </a>
                    <a
                      href="https://instagram.com"
                      className="text-white transition hover:text-gray-700/75"
                    >
                      Instagram
                    </a>
                  </li>
                </ul>
              </div>
              <div className="text-center sm:text-left">
                <p className="text-2xl font-semibold text-white">Alamat</p>
                <ul className="mt-4 sm:mt-8 space-y-2 sm:space-y-4 text-lg">
                  <li className="flex items-start gap-2">
                    <svg
                      className="h-8 w-8 text-white flex-shrink-0 mt-1"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 2a6 6 0 00-6 6c0 4.418 6 12 6 12s6-7.582 6-12a6 6 0 00-6-6zm0 9a3 3 0 110-6 3 3 0 010 6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="text-white">
                      Kp.Kebon Kelapa, RT.02/RW.011, Singasari, Kec. Jonggol,
                      Bogor, Jawa Barat 16830 NPSN : 69944176
                    </p>
                  </li>
                </ul>
              </div>

              {/* <div className="text-center sm:text-left">
                <p className="text-2xl font-semibold text-white">Kerjasama</p>
                <ul className="mt-4 sm:mt-8 space-y-2 sm:space-y-4 text-lg">
                  <li>
                    <a
                      className="text-white transition hover:text-gray-700/75"
                      href="mailto:partnership@smkmadinatulquran.sch.id"
                    >
                      partnership@smkmadinatulquran.sch.id
                    </a>
                  </li>
                </ul>
              </div> */}
            </div>

            <div className="mt-8 border-t border-white pt-4 text-center text-sm text-white sm:flex sm:justify-between">
              <p className="sm:order-first">
                &copy; 2024 SMK Madinatulquran. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
};

export default LandingPage;
