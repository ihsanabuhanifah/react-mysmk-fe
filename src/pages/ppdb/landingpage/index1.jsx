// import "./App.css";
import "../../ppdb/App.css";
import React from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import LogoPpdb from "../../../image/ppdb/ppdb.png";
import Banner from "../../../image/ppdb/banner.png";
import Gambarsatu from "../../../image/ppdb/s1.png";
import GambarTiga from "../../../image/ppdb/s3.png";
import Gedung from "../../../image/ppdb/gedung.png";
import Islam from "../../../image/ppdb/islam.png";
import Dompet from "../../../image/ppdb/dompet.png";
import Piala from "../../../image/ppdb/piala.png";
import Diniyyah from "../../../image/ppdb/diniyyah.png";
import ORANGSAUNG from "../../../image/ppdb/orangsaung.png";
import TKJ from "../../../image/ppdb/TKJ.png";
import TESTI from "../../../image/ppdb/testi.png";
import RPL from "../../../image/ppdb/RPL.png";
import KELAS from "../../../image/ppdb/kelas.png";
import KELAS1 from "../../../image/ppdb/kelas1.png";
import RIFAT from "../../../image/ppdb/rifat.png";
import MAKAN from "../../../image/ppdb/makan.png";
import MASJID from "../../../image/ppdb/masjid.png";
import MAKAN1 from "../../../image/ppdb/makan1.png";
import CISCO from "../../../image/ppdb/academy/Group 108.png";
import LSP from "../../../image/ppdb/academy/Group 109.png";
import LABTOP1 from "../../../image/ppdb/labtop1.png";
import MIKRO from "../../../image/ppdb/academy/Group 110.png";
import REDHAT from "../../../image/ppdb/academy/Group 111.png";
import ITC from "../../../image/ppdb/academy/Group 112.png";
import PENS from "../../../image/ppdb/academy/Group 113.png";
import ANABUKI from "../../../image/ppdb/academy/Group 114.png";
import ProgramUnggulan from "../../../image/ppdb/Program.png";
import Nav from "../../../components/Nav";
import { useState } from "react";
import {
  FaBook,
  FaCircleArrowLeft,
  FaCircleArrowRight,
  FaClipboard,
  FaSnowflake,
  FaWifi,
} from "react-icons/fa6";

const images = [CISCO, LSP, MIKRO, REDHAT, ITC, PENS, ANABUKI];
const slidesData = [
  {
    img: RIFAT,
    title: "Partner 1",
    description: "Deskripsi singkat tentang partner 1",
  },
  {
    img: RIFAT,
    title: "Partner 2",
    description: "Deskripsi singkat tentang partner 2",
  },
  {
    img: RIFAT,
    title: "Partner 3",
    description: "Deskripsi singkat tentang partner 3",
  },
  {
    img: RIFAT,
    title: "Partner 2",
    description: "Deskripsi singkat tentang partner 2",
  },
  {
    img: RIFAT,
    title: "Partner 3",
    description: "Deskripsi singkat tentang partner 3",
  },
  {
    img: RIFAT,
    title: "Partner 2",
    description: "Deskripsi singkat tentang partner 2",
  },
  {
    img: RIFAT,
    title: "Partner 3",
    description: "Deskripsi singkat tentang partner 3",
  },
  // Tambahkan lebih banyak data jika diperlukan
];

const LandingPageRpl = () => {
  const NextArrow = ({ onClick }) => {
    return (
      <div className="arrow next" onClick={onClick}>
        <FaCircleArrowRight />
      </div>
    );
  };

  const PrevArrow = ({ onClick }) => {
    return (
      <div className="arrow prev" onClick={onClick}>
        <FaCircleArrowLeft />
      </div>
    );
  };

  const [imageIndex, setImageIndex] = useState(0);

  const settings = {
    infinite: true,
    lazyLoad: true,
    speed: 300,
    slidesToShow: 5,
    centerMode: true,
    centerPadding: 0,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    beforeChange: (current, next) => setImageIndex(next),
  };

  const settings1 = {
    dots: true,
    infinite: true,
    lazyLoad: true,
    speed: 300,
    slidesToShow: 3,
    centerMode: true,
    centerPadding: 0,
    // nextArrow: <NextArrow />,
    // prevArrow: <PrevArrow />,
    beforeChange: (current, next) => setImageIndex(next),
  };

  return (
    <>
      {/* <Nav /> */}
      <Nav />
      <main>
        <div className="p-4 bg-backgroundRPL bg-cover bg-center h-screen w-screen flex items-center justify-center px-8">
          <div className="flex flex-col items-center justify-center mr-8">
            <p className="text-white justify-between font-bold text-xl lg:text-5xl text-center leading-tight mb-6">
              Jurusan <br /> Rekayasa Perangkat Lunak <br /> (RPL)
            </p>
          </div>
        </div>

        {/* About Section */}
        <div className="justify-center items-center text-center mt-10 lg:mt-20">
          <h3 className="font-medium text-sm lg:text-4xl">Pengenalan</h3>
        </div>
        <div className="flex flex-col lg:flex-row mx-0 lg:mx-4 my-10 lg:my-20 items-center w-full justify-center gap-4 lg:gap-10 px-4 lg:px-80">
          <div className="lg:w-1/2">
            <img src={LABTOP1} alt="Gambar" className="w-full h-auto" />
          </div>
          <div className="flex flex-col gap-4 lg:gap-8 mb-10 lg:w-1/2">
            <p className="text-[10px] sm:text-xs lg:text-xl font-light text-justify mb-4">
              Jurusan Rekayasa Perangkat Lunak adalah pilihan terbaik bagi siswa
              yang ingin memahami dan menguasai dunia teknologi. Dengan
              mengikuti jurusan ini, siswa akan dibekali dengan pengetahuan
              mendalam tentang pengembangan perangkat lunak, pemrograman, dan
              desain aplikasi modern.
            </p>
            <p className="text-[10px] sm:text-xs lg:text-xl font-light text-justify mb-4">
              SMK MADINATULQURAN menawarkan pengalaman pembelajaran yang
              interaktif, belajar dengan praktik, dan akses ke teknologi
              terkini.
            </p>
            <p className="text-[10px] sm:text-xs lg:text-xl font-light text-justify">
              Bergabunglah dengan jurusan Rekayasa Perangkat Lunak, dan
              InsyaAllah siap akan siap untuk berkarir di industri teknologi
              yang terus berkembang, menciptakan solusi inovatif, dan mengubah
              dunia melalui kode-kode canggih yang dibuat. Segera raih impian
              dalam dunia teknologi dengan memilih jurusan Rekayasa Perangkat
              Lunak di SMK MADINATULQURAN!
            </p>
          </div>
        </div>

        {/* Kurikulum RPL */}
        <div className="my-8 py-20 px-5 lg:px-80">
          <div className="text-left text-[32px] lg:text-[64px] font-bold mb-32">
            <p>Kurikulum RPL</p>
          </div>
          <div className="flex flex-col gap-9 items-center">
            <div className="flex space-x-4">
              <div className="relative group bg-bglabtop w-[187px] lg:w-[650px] h-[96px] lg:h-[306px] rounded-lg overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-0 transition duration-300 rounded-lg"></div>
                <div className="relative text-center text-white transition duration-300">
                  <h1 className="text-base lg:text-5xl font-bold group-hover:hidden">
                    Semester 1
                  </h1>
                  <p className="text-xs lg:text-xl font-light hidden group-hover:block">
                    Mempelajari HTML Dasar, CSS Dasar, JS Dasar, dan UI UX
                  </p>
                </div>
              </div>
              <div className="relative group bg-bglabtop w-[187px] lg:w-[650px] h-[96px] lg:h-[306px] rounded-lg overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-0 transition duration-300 rounded-lg"></div>
                <div className="relative text-center text-white transition duration-300">
                  <h1 className="text-base lg:text-5xl font-bold group-hover:hidden">
                    Semester 2
                  </h1>
                  <p className="text-xs lg:text-xl font-light hidden group-hover:block">
                    Mempelajari HTML Dasar, CSS Dasar, JS Dasar, dan UI UX
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-4 mb-5">
              <div className="relative group bg-bglabtop w-[390px] lg:w-[1324px] h-[96px] lg:h-[306px] rounded-lg overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-0 transition duration-300 rounded-lg"></div>
                <div className="relative text-center text-white transition duration-300">
                  <h1 className="text-base lg:text-5xl font-bold group-hover:hidden">
                    Semester 3
                  </h1>
                  <p className="text-xs lg:text-xl font-light hidden group-hover:block">
                    Mempelajari HTML Dasar, CSS Dasar, JS Dasar, dan UI UX
                  </p>
                </div>
              </div>
            </div>
            <div className="flex space-x-4">
              <div className="relative group bg-bglabtop w-[187px] lg:w-[650px] h-[96px] lg:h-[306px] rounded-lg overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-0 transition duration-300 rounded-lg"></div>
                <div className="relative text-center text-white transition duration-300">
                  <h1 className="text-base lg:text-5xl font-bold group-hover:hidden">
                    Semester 4
                  </h1>
                  <p className="text-xs lg:text-xl font-light hidden group-hover:block">
                    Mempelajari HTML Dasar, CSS Dasar, JS Dasar, dan UI UX
                  </p>
                </div>
              </div>
              <div className="relative group bg-bglabtop w-[187px] lg:w-[650px] h-[96px] lg:h-[306px] rounded-lg overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-0 transition duration-300 rounded-lg"></div>
                <div className="relative text-center text-white transition duration-300">
                  <h1 className="text-base lg:text-5xl font-bold group-hover:hidden">
                    Semester 5
                  </h1>
                  <p className="text-xs lg:text-xl font-light hidden group-hover:block">
                    Mempelajari HTML Dasar, CSS Dasar, JS Dasar, dan UI UX
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-4 mb-5">
              <div className="relative group bg-bglabtop w-[390px] lg:w-[1324px] h-[96px] lg:h-[306px] rounded-lg overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-0 transition duration-300 rounded-lg"></div>
                <div className="relative text-center text-white transition duration-300">
                  <h1 className="text-base lg:text-5xl font-bold group-hover:hidden">
                    Semester 6
                  </h1>
                  <p className="text-xs lg:text-xl font-light hidden group-hover:block">
                    Mempelajari HTML Dasar, CSS Dasar, JS Dasar, dan UI UX
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Academy Partner */}
        <div className="my-10 py-1 cardacademy">
          <p className="text-center font-bold text-[24px] lg:text-[64px]">
            Academy Partner
          </p>
          <div className="App px-10 lg:px-96">
            <Slider {...settings}>
              {images.map((img, idx) => (
                <div
                  className={`slide ${idx === imageIndex ? "activeSlide" : ""}`}
                  key={idx}
                >
                  <div className="w-full">
                    <img
                      src={img}
                      alt={`Academy Partner ${idx}`}
                      className="justify-center items-center"
                    />
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>

        {/* fasilitas */}
        <div className="text-left text-xl lg:text-5xl ml-10 lg:ml-80 font-bold mb-32">
          <p>Fasilitas RPL</p>
        </div>

        <div className="flex justify-center items-center min-h-screen flex-col">
          <div className="rounded-3xl w-full max-w-[1586px] h-full flex flex-col gap-20 lg:gap-40">
            {/* Top Row with 3 Columns */}
            <div className="grid grid-cols-3 gap-12 lg:gap-24">
              {/* Ruangan AC */}
              <div className="flex flex-col items-center">
                <FaSnowflake className="text-green-500 text-7xl sm:text-8xl mb-4" />
                <p className="text-lg sm:text-2xl lg:text-3xl font-medium text-gray-600">
                  Ruangan AC
                </p>
              </div>

              {/* Wifi */}
              <div className="flex flex-col items-center">
                <FaWifi className="text-green-500 text-7xl sm:text-8xl mb-4" />
                <p className="text-lg sm:text-2xl lg:text-3xl font-medium text-gray-600">
                  Wifi
                </p>
              </div>

              {/* Modul */}
              <div className="flex flex-col items-center">
                <FaBook className="text-green-500 text-7xl sm:text-8xl mb-4" />
                <p className="text-lg sm:text-2xl lg:text-3xl font-medium text-gray-600">
                  Modul
                </p>
              </div>
            </div>

            {/* Bottom Row with 2 Columns */}
            <div className="grid grid-cols-2 gap-12 lg:gap-24">
              {/* Konsultasi 1 */}
              <div className="flex flex-col items-center">
                <FaClipboard className="text-green-500 text-7xl sm:text-8xl mb-4" />
                <p className="text-lg sm:text-2xl lg:text-3xl font-medium text-gray-600">
                  Konsultasi
                </p>
              </div>

              {/* Konsultasi 2 */}
              <div className="flex flex-col items-center">
                <FaClipboard className="text-green-500 text-7xl sm:text-8xl mb-4" />
                <p className="text-lg sm:text-2xl lg:text-3xl font-medium text-gray-600">
                  Konsultasi
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* tracer study */}
        <p className="text-center font-bold mt-40 text-xl lg:text-5xl">
          tracer study
        </p>
        <div className="py-10 mb-10 justify-center items-center pr-0 lg:pr-10 bg-gray-100 sliderrifat">
          <div className="px-0 lg:px-80 justify-center items-center">
            <Slider {...settings1} className="justify-center items-center">
              {slidesData.map((slide, idx) => (
                <div
                  className={idx === imageIndex ? "slide activeSlide" : "slide"}
                  key={idx}
                >
                  {/* Membungkus gambar dan teks dalam card */}
                  <div className="rounded-2xl bg-white shadow-lg flex flex-col items-center justify-center">
                    <img src={slide.img} alt={slide.title} />
                    {/* Menampilkan teks yang berbeda untuk setiap slide */}
                    <div className="text-center">
                      <h3 className="text-sm lg:text-xl font-bold">
                        {slide.title}
                      </h3>
                      <p className="text-xs lg:text-xl text-gray-500">
                        {slide.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-backgroundFooter">
          <div className="mx-auto max-w-screen-xl px-4 py-8 sm:py-10 lg:py-12 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 lg:grid-cols-3 text-white">
              <div>
                <h3 className="text-base lg:text-2xl font-semibold">
                  Kontak :
                </h3>
                <ul className="mt-4 space-y-2 text-base lg:text-2xl">
                  <li>
                    <a
                      href="https://wa.me/6285888222457"
                      className="flex items-center gap-2 text-white"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M20.52 3.48A12 12 0 10.78 17.39l-1.2 4.4 4.42-1.17a12 12 0 0016.53-10.92 12 12 0 00-3.99-6.22zM12 20.16a8.17 8.17 0 01-4.4-1.28l-.32-.18-2.6.69.7-2.54-.18-.33a8.2 8.2 0 1115.25-4.18 8.19 8.19 0 01-8.45 7.83zm4.09-6.15c-.22-.11-1.3-.64-1.5-.71s-.34-.11-.49.11-.56.71-.68.85-.25.16-.46.05a6.75 6.75 0 01-2-1.25 7.58 7.58 0 01-1.4-1.75c-.15-.26-.02-.4.11-.53l.34-.39c.12-.14.17-.23.25-.38.07-.15.04-.27-.02-.39-.05-.11-.48-1.16-.66-1.6s-.35-.36-.5-.36h-.42a.82.82 0 00-.61.28 2.57 2.57 0 00-.8 1.9c0 1.11.8 2.19.9 2.34s1.56 2.37 3.79 3.33a9.47 9.47 0 003.09.98c.43.07.82.06 1.13.03a2.7 2.7 0 001.76-.82 2.32 2.32 0 001-1.63c.04-.16.08-.3.05-.42-.03-.12-.12-.18-.25-.23z"
                          clipRule="evenodd"
                        />
                      </svg>
                      085 888 222 457 (PSB)
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://wa.me/628126900457"
                      className="flex items-center gap-2 text-white"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M20.52 3.48A12 12 0 10.78 17.39l-1.2 4.4 4.42-1.17a12 12 0 0016.53-10.92 12 12 0 00-3.99-6.22zM12 20.16a8.17 8.17 0 01-4.4-1.28l-.32-.18-2.6.69.7-2.54-.18-.33a8.2 8.2 0 1115.25-4.18 8.19 8.19 0 01-8.45 7.83zm4.09-6.15c-.22-.11-1.3-.64-1.5-.71s-.34-.11-.49.11-.56.71-.68.85-.25.16-.46.05a6.75 6.75 0 01-2-1.25 7.58 7.58 0 01-1.4-1.75c-.15-.26-.02-.4.11-.53l.34-.39c.12-.14.17-.23.25-.38.07-.15.04-.27-.02-.39-.05-.11-.48-1.16-.66-1.6s-.35-.36-.5-.36h-.42a.82.82 0 00-.61.28 2.57 2.57 0 00-.8 1.9c0 1.11.8 2.19.9 2.34s1.56 2.37 3.79 3.33a9.47 9.47 0 003.09.98c.43.07.82.06 1.13.03a2.7 2.7 0 001.76-.82 2.32 2.32 0 001-1.63c.04-.16.08-.3.05-.42-.03-.12-.12-.18-.25-.23z"
                          clipRule="evenodd"
                        />
                      </svg>
                      0812 6900 457 (Hotline)
                    </a>
                  </li>
                  <li>
                    <a
                      href="mailto:info@smkmadinatulquran.sch.id"
                      className="flex items-center gap-2 text-white"
                    >
                      <span>📧</span> info@smkmadinatulquran.sch.id
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-base lg:text-2xl font-semibold">
                  Media Sosial :
                </h3>
                <ul className="mt-4 space-y-2 text-base lg:text-2xl">
                  <li className="flex items-center gap-2">
                    <svg
                      className="h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24h11.495v-9.294H9.69v-3.622h3.13V8.413c0-3.1 1.894-4.788 4.66-4.788 1.325 0 2.463.099 2.794.143v3.24l-1.917.001c-1.504 0-1.796.715-1.796 1.763v2.314h3.586l-.467 3.622h-3.12V24h6.11c.732 0 1.325-.593 1.325-1.324V1.325C24 .593 23.407 0 22.675 0z" />
                    </svg>
                    <a
                      href="https://facebook.com"
                      className="hover:underline text-white"
                    >
                      Facebook
                    </a>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg
                      className="h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M19.615 3.184a3.621 3.621 0 00-2.57-2.57C15.633 0 12 0 12 0s-3.633 0-5.045.614a3.621 3.621 0 00-2.57 2.57C4 4.594 4 8.227 4 8.227s0 3.633.614 5.045a3.621 3.621 0 002.57 2.57C8.227 16 12 16 12 16s3.633 0 5.045-.614a3.621 3.621 0 002.57-2.57c.614-1.412.614-5.045.614-5.045s0-3.633-.614-5.045zm-9.232 7.916V6.728l5.461 2.186-5.461 2.186z" />
                    </svg>
                    <a
                      href="https://instagram.com"
                      className="hover:underline text-white"
                    >
                      Instagram
                    </a>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg
                      className="h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M23.498 6.186a2.972 2.972 0 00-2.092-2.092C19.468 4 12 4 12 4S4.532 4 2.594 4.094A2.972 2.972 0 00.502 6.186C0 8.126 0 12 0 12s0 3.874.502 5.814a2.972 2.972 0 002.092 2.092C4.532 20 12 20 12 20s7.468 0 9.406-.094a2.972 2.972 0 002.092-2.092C24 15.874 24 12 24 12s0-3.874-.502-5.814zM9.545 15.568v-7.137l6.363 3.569-6.363 3.568z" />
                    </svg>
                    <a
                      href="https://youtube.com"
                      className="hover:underline text-white"
                    >
                      YouTube
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-base lg:text-2xl font-semibold">
                  Alamat :
                </h3>
                <div className="mt-4 flex items-start gap-2 text-sm lg:text-xl">
                  <svg
                    className="h-10 w-10"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7zm0 9.5A2.5 2.5 0 1112 6a2.5 2.5 0 010 5.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p>
                    Kp.Kebon Kelapa, RT.02/RW.011, Singasari, Kec. Jonggol,
                    Bogor, Jawa Barat 16830
                    <br />
                    NPSN: 69944176
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-20 border-t border-white pt-4 text-center text-xs text-white">
              <p className="text-left text-base lg:text-2xl">
                &copy; 2023 All Right Reserved. SMK MADINATULQURAN
              </p>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
};

export default LandingPageRpl;
