/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { Link } from "react-router-dom";
import LogoPpdb from "../../image/ppdb/ppdb.png";
import Banner from "../../image/ppdb/banner.png";
import Gambarsatu from "../../image/ppdb/s1.png";
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
              <button className="w-auto h-auto bg-white rounded-md px-8 py-2">
                <p className="text-customGreen font-semibold text-lg">Daftar</p>
              </button>
              <button className="w-auto h-auto bg-white rounded-md px-8 py-2">
                <p className="text-customGreen font-semibold text-lg">Login</p>
              </button>
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
          
          {/* <div className="w-[1021px] h-[380px] px-8 py-4 bg-white drop-shadow-md rounded-xl my-16 ml-96 z-10">
            <div className="flex gap-12">
              <div className="pr-6">
                <p className="text-customGreen text-2xl font-semibold">
                  Network Engineer (TKJ)
                </p>
                <p>
                  Santri yang masuk dalam jurusan TKJ (Teknik Komputer dan
                  Jaringan) akan berfokus mempelajari infastruktur Jaringan
                  Komputer dan Server. Materi yang akan dipelajari:
                </p>
                <li>Network Engineer (Cisco dan Mikrotik)</li>
                <li className="text-start pl-4">
                  System Engineer (Linux System Administration, Docker
                  Container, Ansible, CI/CD Jenkins, Monitoring)
                </li>
              </div>
              <img
                src={TKJ}
                alt="TKJ"
                className="object-contain"
                style={{ maxHeight: "40%", maxWidth: "40%" }}
              />
            </div>
          </div>

          <div className="w-[1021px] h-[380px] px-8 py-4 bg-white drop-shadow-md rounded-xl my-16 ml-32 z-10">
            <div className="flex gap-12">
              <div className="pr-6">
                <p className="text-customGreen text-2xl font-semibold">
                  Software Enginer (RPL)
                </p>
                <p>
                  Santri RPL (Rekayasa Perangkat Lunak) berfokus mempelajari
                  bagaimana mengembangkan software yang berbasis Web dan Mobile.
                  Materi yang akan dipelajari:
                </p>
                <li>UI/UX Design (Figma)</li>
                <li>Front End Development (ReactJS, NextJS, Tailwindcss)</li>
                <li>Back End Development (ExpressJS, NestJS)</li>
                <li>Mobile Development (Flutter)</li>
              </div>
              <img
                src={RPL}
                alt="RPL"
                className="object-contain"
                style={{ maxHeight: "40%", maxWidth: "40%" }}
              />
            </div>
          </div>

          <div className="w-[1021px] h-[380px] px-8 py-4 bg-white drop-shadow-md rounded-xl my-16 ml-96 z-10">
            <div className="flex gap-12">
              <div className="pr-6">
                <p className="text-customGreen text-2xl font-semibold">
                  Program Unggulan
                </p>
                <p>
                  Selain belajar tentang IT, santri akan mengikuti program
                  unggulan pada 3 bulan pertama sebagai bekal penunjang sebelum
                  memulai kegiatan belajar mengajar.
                </p>
                <li>Tahfidz Camp</li>
                <li>English Camp</li>
                <li>English Discovery</li>
              </div>
              <img
                src={ProgramUnggulan}
                alt="ProgramUnggulan"
                className="object-contain"
                style={{ maxHeight: "40%", maxWidth: "40%" }}
              />
            </div>
          </div> */}
        </div>
        {/* Akhir 2 */}
        <Link to="login" className="text-blue-500 text-green-400 ">
          Login
        </Link>
      </main>
    </>
  );
};

export default LandingPage;
