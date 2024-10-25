import "./App.css";
import React from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import LogoPpdb from "../../image/ppdb/ppdb.png";
import Banner from "../../image/ppdb/banner.png";
import Gambarsatu from "../../image/ppdb/s1.png";
import GambarTiga from "../../image/ppdb/s3.png";
import Gedung from "../../image/ppdb/gedung.png";
import Islam from "../../image/ppdb/islam.png";
import Dompet from "../../image/ppdb/dompet.png";
import Piala from "../../image/ppdb/piala.png";
import Diniyyah from "../../image/ppdb/diniyyah.png";
import ORANGSAUNG from "../../image/ppdb/orangsaung.png";
import TKJ from "../../image/ppdb/TKJ.png";
import TESTI from "../../image/ppdb/testi.png";
import RPL from "../../image/ppdb/RPL.png";
import KELAS from "../../image/ppdb/kelas.png";
import KELAS1 from "../../image/ppdb/kelas1.png";
import RIFAT from "../../image/ppdb/rifat.png";
import MAKAN from "../../image/ppdb/makan.png";
import MASJID from "../../image/ppdb/masjid.png";
import MAKAN1 from "../../image/ppdb/makan1.png";
import CISCO from "../../image/ppdb/academy/Group 108.png";
import LSP from "../../image/ppdb/academy/Group 109.png";
import MIKRO from "../../image/ppdb/academy/Group 110.png";
import REDHAT from "../../image/ppdb/academy/Group 111.png";
import ITC from "../../image/ppdb/academy/Group 112.png";
import PENS from "../../image/ppdb/academy/Group 113.png";
import ANABUKI from "../../image/ppdb/academy/Group 114.png";
import ProgramUnggulan from "../../image/ppdb/Program.png";
import Nav from "../../components/Nav";
import { useState } from "react";
import { FaCircleArrowLeft, FaCircleArrowRight } from "react-icons/fa6";

const images = [CISCO, LSP, MIKRO, REDHAT, ITC, PENS, ANABUKI];
const testi = [TESTI, TESTI, TESTI, TESTI];

// Slider settings

const sliderSettingsauto = {
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  autoplay: true, // Auto-slide
  autoplaySpeed: 2000, // Interval for auto-slide in milliseconds (2 seconds)
};

const LandingPage = () => {
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
    className: "center",
    infinite: true,
    lazyLoad: true,
    speed: 300,
    slidesToShow: 5, // Default for large screens
    centerMode: true,
    centerPadding: "0",
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    beforeChange: (current, next) => setImageIndex(next),
  };

  const settings1 = {
    dots: true,
    infinite: true,
    lazyLoad: true,
    speed: 300,
    slidesToShow: 3,  // Default menampilkan 3 gambar
    centerMode: true,
    centerPadding: 0,
    // nextArrow: <NextArrow />,
    // prevArrow: <PrevArrow />,
    beforeChange: (current, next) => setImageIndex(next),
    responsive: [
      {
        breakpoint: 768,  // Layar di bawah 768px (tablet dan smartphone)
        settings: {
          slidesToShow: 1,  // Tampilkan hanya 1 gambar
        },
      },
    ],
  };
  

  const settingsrifat = {
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <>
      <Nav />
      <main>
        <div className="bg-backgroundBaru bg-cover bg-center h-screen w-screen flex items-center justify-center px-1 lg:px-8">
          <div className="flex flex-col items-center justify-center mr-8">
            <p className="text-white font-bold text-2xl lg:text-5xl text-center leading-tight mb-6">
              Penerimaan Santri Baru
              <br />
              SMK Madinatul Quran
              <br />
              <span className="text-white text-2xl lg:text-3xl font-extralight text-center leading-tight mb-6">
                Tahun Ajaran 2025-2026
              </span>
            </p>
            <div className="flex gap-6 justify-center">
              <Link to="register">
                <button className="w-auto h-auto bg-green-600 rounded-2xl px-8 py-2">
                  <p className="text-white font-bold text-sm lg:text-lg">
                    Download Brosur
                  </p>
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="flex flex-col-reverse lg:flex-row my-10 lg:my-40 mx-0 lg:mx-8 items-center w-full justify-center gap-3 lg:gap-60">
          <div className="flex flex-col gap-8 mb-10">
            <h3 className="text-customGreen text-3xl lg:text-5xl">
              SMK MADINATULQURAN <br /> Boarding School
            </h3>
            <p className="text-sm text-left lg:text-3xl">
              Sekolah Menengah Kejuruan MADINATULQURAN atau SMK MQ adalah <br />{" "}
              salah satu sekolah di Kecamatan Jonggol Kabupaten Bogor, Jawa{" "}
              <br /> Barat yang beroperasi mulai tahun 2015 dan sudah
              terakreditasi <br /> dari BANS/M Kemendikbud.
            </p>
          </div>
          <div className="mt-6 lg:mb-0">
            <img
              src={Gambarsatu}
              alt="Gambar"
              className="object-contain max-w-xs lg:max-w-lg"
            />
          </div>
        </div>

        {/* slider image */}

        <div className="">
          <Slider {...sliderSettingsauto}>
            <div className="relative">
              <img
                src={KELAS1}
                alt="Class Room"
                className="w-full h-auto mx-auto"
              />
              <div className="absolute bottom-4 left-4">
                <div className="bg-white bg-opacity-90 w-[100px] lg:w-[153px] items-center justify-center h-[25px] lg:h-[40px] px-4 py-2 rounded-lg shadow-md">
                  <p className="text-green-800 font-bold text-sm lg:text-xl text-center">
                    Class Room
                  </p>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src={MAKAN1}
                alt="Kantin"
                className="w-full h-auto mx-auto"
              />
              <div className="absolute bottom-4 left-4">
                <div className="bg-white bg-opacity-90 w-[80px] lg:w-[153px] items-center justify-center h-[25px] lg:h-[40px] px-4 py-2 rounded-lg shadow-md">
                  <p className="text-green-800 font-bold text-sm lg:text-xl text-center">
                    Kantin
                  </p>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src={MASJID}
                alt="Masjid"
                className="w-full h-auto mx-auto"
              />
              <div className="absolute bottom-4 left-4">
                <div className="bg-white bg-opacity-90 w-[80px] lg:w-[153px] items-center justify-center h-[25px] lg:h-[40px] px-4 py-2 rounded-lg shadow-md">
                  <p className="text-green-800 font-bold text-sm lg:text-xl text-center">
                    Masjid
                  </p>
                </div>
              </div>
            </div>
          </Slider>
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

        {/* Mengapa harus Sekolah di SMK Mainatul Quran? */}
        <div className="my-10 py-10">
          <div className="text-center text-3xl lg:text-5xl font-bold">
            <p>
              Mengapa harus Sekolah di <br /> SMK Madinatul Quran?
            </p>
          </div>
          <div className="flex justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 my-10 py-10 px-4 sm:px-12 lg:px-24">
              {/* Item 1 */}
              <div
                className="bg-white rounded-lg shadow-lg flex items-center justify-center p-5 border-2 border-transparent hover:border-blue-500 transition duration-300"
                style={{ width: "100%", height: "280px" }}
              >
                <div className="flex-shrink-0 mr-6 sm:mr-10">
                  <img
                    src={Gedung}
                    alt="Sekolah IT Terbaik"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="ml-4">
                  <h3 className="text-xl sm:text-2xl font-bold text-blue-900">
                    Sekolah IT Terbaik
                  </h3>
                  <p className="text-base sm:text-lg text-gray-600 mt-2">
                    Lorem ipsum dolor sit amet, consectetur <br />
                    adipiscing elit. Ut eget nunc faucibus,
                    <br /> rutrum lectus id, laoreet nunc. Nulla
                    <br />
                    commodo dignissim risus.
                  </p>
                </div>
              </div>

              {/* Item 2 */}
              <div
                className="bg-white rounded-lg shadow-lg flex items-center justify-center p-5 border-2 border-transparent hover:border-blue-500 transition duration-300"
                style={{ width: "100%", height: "280px" }}
              >
                <div className="flex-shrink-0 mr-6 sm:mr-10">
                  <img
                    src={Dompet}
                    alt="Full Praktek"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="ml-4">
                  <h3 className="text-xl sm:text-2xl font-bold text-blue-900">
                    Full Praktek
                  </h3>
                  <p className="text-base sm:text-lg text-gray-600 mt-2">
                    Lorem ipsum dolor sit amet, consectetur <br />
                    adipiscing elit. Ut eget nunc faucibus,
                    <br /> rutrum lectus id, laoreet nunc. Nulla
                    <br />
                    commodo dignissim risus.
                  </p>
                </div>
              </div>

              {/* Item 3 */}
              <div
                className="bg-white rounded-lg shadow-lg flex items-center justify-center p-5 border-2 border-transparent hover:border-blue-500 transition duration-300"
                style={{ width: "100%", height: "280px" }}
              >
                <div className="flex-shrink-0 mr-6 sm:mr-10">
                  <img
                    src={Piala}
                    alt="Program Unggulan"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="ml-4">
                  <h3 className="text-xl sm:text-2xl font-bold text-blue-900">
                    Program Unggulan
                  </h3>
                  <p className="text-base sm:text-lg text-gray-600 mt-2">
                    Lorem ipsum dolor sit amet, consectetur <br />
                    adipiscing elit. Ut eget nunc faucibus,
                    <br /> rutrum lectus id, laoreet nunc. Nulla
                    <br />
                    commodo dignissim risus.
                  </p>
                </div>
              </div>

              {/* Item 4 */}
              <div
                className="bg-white rounded-lg shadow-lg flex items-center justify-center p-5 border-2 border-transparent hover:border-blue-500 transition duration-300"
                style={{ width: "100%", height: "280px" }}
              >
                <div className="flex-shrink-0 mr-6 sm:mr-10">
                  <img
                    src={Islam}
                    alt="Pesantren Berbasis IT"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="ml-4">
                  <h3 className="text-xl sm:text-2xl font-bold text-blue-900">
                    Pesantren Berbasis IT
                  </h3>
                  <p className="text-base sm:text-lg text-gray-600 mt-2">
                    Lorem ipsum dolor sit amet, consectetur <br />
                    adipiscing elit. Ut eget nunc faucibus,
                    <br /> rutrum lectus id, laoreet nunc. Nulla
                    <br />
                    commodo dignissim risus.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Prestasi Murid & Alumni SMK Madinatul Quran */}
        <div className="my-8 py-8 bg-gray-100 px-0 lg:px-52 ">
          <div className="text-center text-lg lg:text-5xl font-bold">
            <p>
              Prestasi Murid & Alumni <br /> SMK Madinatul Quran
            </p>
          </div>
          <Slider {...settingsrifat} className="py-40 px-10 lg:px-52 sliderripat">
            {/* Menambahkan margin horizontal untuk memperlebar jarak antar item */}
            <div className="flex flex-row gap-14 justify-center items-center px-6">
              <div className="rounded-2xl flex flex-col items-center justify-center bg-white pb-4">
                <div className="w-full mb-3">
                  <img
                    src={RIFAT}
                    alt="Sekolah IT Terbaik"
                    className="object-contain w-full"
                  />
                </div>
                <div className="flex flex-row px-3 my-7 justify-between items-start w-full">
                  <div className="flex-grow">
                    <h3 className="text-sm lg:text-2xl text-center font-bold">
                      Juara Olimpiade desain <br /> grafis nusantara
                    </h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Item kedua juga diberi jarak lebih lebar */}
            <div className="flex flex-row gap-14 justify-center items-center px-6">
              <div className="rounded-2xl flex flex-col items-center justify-center bg-white pb-4">
                <div className="w-full mb-3">
                  <img
                    src={RIFAT}
                    alt="Sekolah IT Terbaik"
                    className="object-contain w-full"
                  />
                </div>
                <div className="flex flex-row px-3 my-7 justify-between items-start w-full">
                  <div className="flex-grow">
                    <h3 className="text-sm lg:text-2xl text-center font-bold">
                      Juara Olimpiade desain <br /> grafis nusantara
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </Slider>
        </div>

        {/* Testimoni Alumini SMK Madinatul Quran */}
        <div className="my-40">
          <div className="text-center text-lg lg:text-5xl font-bold">
            <p>
              Testimoni Alumini <br /> SMK Madinatul Quran
            </p>
          </div>
          {/* Slider */}

          <div className="px-14 cardcoment">
            <Slider {...settings1}>
              {testi.map((img, idx) => (
                <div
                  className={idx === imageIndex ? "slide activeSlide" : "slide"}
                >
                  <img src={img}
                   alt={img}
                   className="justify-center items-center"
                   />
                </div>
              ))}
            </Slider>
          </div>
        </div>

        {/* Gallery SMK Madinatul Quran */}
        <div className="py-16">
          <div className="text-center bg-green-700 text-white text-xl lg:text-5xl font-bold">
            <p>
              Gallery <br /> SMK Madinatul Quran
            </p>
          </div>
          {/* Slider */}
          <div className="">
            <Slider {...sliderSettingsauto}>
              <div className="mr-5">
                <img
                  src={ORANGSAUNG}
                  alt="Class Room"
                  className="w-full h-auto mx-auto"
                />
              </div>
              <div className="mr-5">
                <img
                  src={ORANGSAUNG}
                  alt="Kantin"
                  className="w-full h-auto mx-auto"
                />
              </div>
              <div className="mr-5">
                <img
                  src={ORANGSAUNG}
                  alt="Masjid"
                  className="w-full h-auto mx-auto"
                />
              </div>
              <div className="mr-5">
                <img
                  src={ORANGSAUNG}
                  alt="Class Room"
                  className="w-full h-auto mx-auto"
                />
              </div>
              <div className="mr-5">
                <img
                  src={ORANGSAUNG}
                  alt="Kantin"
                  className="w-full h-auto mx-auto"
                />
              </div>
            </Slider>
          </div>
        </div>

        {/* Berita Terkini */}
        <div className="my-3 lg:my-10 py-10 flex flex-col px-4 lg:px-16 justify-center items-center bg-gray-600/10">
          <div className="text-start text-sm lg:text-5xl font-bold text-center mb-10">
            <p>Berita Terkini</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-10 w-full lg:w-3/4 mx-auto">
            {/* Kolom kiri - Gambar besar */}
            <div className="w-full lg:w-1/2 flex flex-col bg-white gap-7">
              <div className="flex flex-col">
                <img
                  src={KELAS}
                  alt="Pesantren Berbasis IT"
                  className="w-full h-full object-cover" // Gambar besar kiri
                />
              </div>
              <div className="flex items-center justify-center px-4">
                <p className="text-gray-600 text-center text-xs sm:text-sm lg:text-lg mt-2 leading-loose">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
                  eget nunc faucibus, rutrum lectus id, laoreet nunc. Nulla
                  commodo dignissim risus.
                </p>
              </div>
            </div>

            {/* Kolom kanan - Dua gambar lebih kecil */}
            <div className="w-full lg:w-1/2 flex flex-col gap-8">
              <div className="flex flex-row gap-5">
                {/* Gambar pertama */}
                <div className="flex-shrink-0">
                  <img
                    src={MAKAN}
                    alt="Pesantren Berbasis IT"
                    className="w-full h-32 object-cover lg:h-80" // Gambar kecil kanan
                  />
                </div>
                <div className="flex flex-col justify-between w-2/3">
                  <h3 className="text-sm lg:text-2xl font-bold">
                    Berita Terkini
                  </h3>
                  <p className="text-gray-600 text-xs lg:text-lg mt-2 leading-loose">
                    Lorem ipsum dolor sit amet,{" "}
                    <span className="block lg:inline">
                      consectetur adipiscing elit. Ut
                    </span>
                    <span className="block lg:inline">
                      eget nunc faucibus, rutrum
                    </span>{" "}
                    <span className="block lg:inline">
                      lectus id, laoreet nunc. Nulla
                    </span>
                    <span className="block lg:inline">
                      commodo dignissim risus. rutrum
                    </span>{" "}
                    <span className="block lg:inline">
                      lectus id, laoreet nunc.
                    </span>
                    <span className="block lg:inline">
                      Nulla commodo dignissim risus.
                    </span>
                  </p>
                  <p className="text-green-600 text-xs lg:text-lg mt-2">
                    Read more
                  </p>
                </div>
              </div>

              <div className="flex flex-row gap-5">
                {/* Gambar kedua */}
                <div className="flex-shrink-0">
                  <img
                    src={MAKAN}
                    alt="Pesantren Berbasis IT"
                    className="w-full h-32 object-cover lg:h-80" // Gambar kecil kanan
                  />
                </div>
                <div className="flex flex-col justify-between w-2/3">
                  <h3 className="text-sm lg:text-2xl font-bold">
                    Berita Terkini
                  </h3>
                  <p className="text-gray-600 text-xs lg:text-lg mt-2 leading-loose">
                    Lorem ipsum dolor sit amet,{" "}
                    <span className="block lg:inline">
                      consectetur adipiscing elit. Ut
                    </span>
                    <span className="block lg:inline">
                      eget nunc faucibus, rutrum
                    </span>{" "}
                    <span className="block lg:inline">
                      lectus id, laoreet nunc. Nulla
                    </span>
                    <span className="block lg:inline">
                      commodo dignissim risus. rutrum
                    </span>{" "}
                    <span className="block lg:inline">
                      lectus id, laoreet nunc.
                    </span>
                    <span className="block lg:inline">
                      Nulla commodo dignissim risus.
                    </span>
                  </p>
                  <p className="text-green-600 text-xs lg:text-lg mt-2">
                    Read more
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* daftar segera */}
        <div className="min-h-[50vh] flex justify-center items-center bg-backgroundbawah bg-fixed bg-no-repeat bg-cover bg-center">
          <div className="text-center">
            <h3 className="text-white font-medium text-xl lg:text-5xl">
              Segera daftarkan putra anda sekarang
            </h3>
            <div className="text-white text-sm lg:text-xl font-normal text-center max-w-lg mx-auto">
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

        {/* footer */}
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

export default LandingPage;
