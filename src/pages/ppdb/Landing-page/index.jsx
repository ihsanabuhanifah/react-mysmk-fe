// import "./App.css";
// import "../../ppdb/App.css";
import "../Landing-page/app.css"
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
import MIKRO from "../../../image/ppdb/academy/Group 110.png";
import REDHAT from "../../../image/ppdb/academy/Group 111.png";
import ITC from "../../../image/ppdb/academy/Group 112.png";
import PENS from "../../../image/ppdb/academy/Group 113.png";
import ANABUKI from "../../../image/ppdb/academy/Group 114.png";
import ProgramUnggulan from "../../../image/ppdb/Program.png";
import Nav from "../../../components/Nav";
import NavPpdb from "../../../components/NavPpdb";
import { useState } from "react";
import { FaCircleArrowLeft, FaCircleArrowRight } from "react-icons/fa6";

const images = [CISCO, LSP, MIKRO, REDHAT, ITC, PENS, ANABUKI];
const testi = [TESTI, TESTI, TESTI, TESTI, TESTI, TESTI, TESTI];

// Slider settings

const sliderSettingsauto = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  autoplay: true, // Auto-slide
  autoplaySpeed: 2000, // Interval for auto-slide in milliseconds (2 seconds)
};

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

  const settingsrifat = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplaySpeed: 3000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <>
      <NavPpdb />
      <main>
        <div className="p-4 bg-backgroundBaru bg-cover bg-center h-screen w-screen flex items-center justify-center px-8">
          <div className="flex flex-col items-center justify-center mr-8">
            <p className="text-white font-bold text-5xl text-center leading-tight mb-6">
              Penerimaan Santri Baru
              <br />
              SMK Madinatul Quran
              <br />
              <span className="text-white text-3xl font-extralight text-center leading-tight mb-6">
                Tahun Ajaran 2025-2026
              </span>
            </p>
            <div className="flex gap-6 justify-center">
              <Link to="register">
                <button className="w-auto h-auto bg-green-600 rounded-2xl px-8 py-2">
                  <p className="text-white font-semibold text-lg">Daftar</p>
                </button>
              </Link>
              <Link to="login">
                <button className="w-auto h-auto bg-white rounded-2xl px-8 py-2">
                  <p className="text-customGreen font-semibold text-lg">
                    Login
                  </p>
                </button>
              </Link>
            </div>
          </div>
        </div>

        <div className="">
          <Slider {...sliderSettingsauto}>
            <div className="relative">
              <img
                src={KELAS1}
                alt="Class Room"
                className="w-full h-auto mx-auto"
              />
              <div className="absolute bottom-4 left-4">
                <div className="bg-white bg-opacity-90 w-[153px] items-center justify-center h-[40px] px-4 py-2 rounded-lg shadow-md">
                  <p className="text-green-800 font-bold text-xl text-center">
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
                <div className="bg-white bg-opacity-90 w-[153px] items-center justify-center h-[40px] px-4 py-2 rounded-lg shadow-md">
                  <p className="text-green-800 font-bold text-xl text-center">
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
                <div className="bg-white bg-opacity-90 w-[153px] items-center justify-center h-[40px] px-4 py-2 rounded-lg shadow-md">
                  <p className="text-green-800 font-bold text-xl text-center">
                    Masjid
                  </p>
                </div>
              </div>
            </div>
          </Slider>
        </div>

        {/* About Section */}
        <div className="flex my-10 mx-8 items-center w-full justify-center gap-60">
          <div className="flex flex-col gap-8 mb-10">
            <h3 className="text-customGreen text-[48px]">
              SMK MADINATULQURAN <br /> Boarding School
            </h3>
            <p className="text-[24px]">
              Sekolah Menengah Kejuruan MADINATULQURAN atau SMK MQ adalah <br />{" "}
              salah satu sekolah di Kecamatan Jonggol Kabupaten Bogor, Jawa{" "}
              <br /> Barat yang beroperasi mulai tahun 2015 dan sudah
              terakreditasi <br /> dari BANS/M Kemendikbud.
            </p>
          </div>
          <div className="ml-8">
            <img src={Gambarsatu} alt="Gambar" className="object-contain" />
          </div>
        </div>

        {/* Academy Partner */}
        <div className="my-10 py-10 bg-gray-100">
          <p className="text-center font-bold text-[48px]">Academy Partner</p>
          <div className="App px-96">
            <Slider {...settings}>
              {images.map((img, idx) => (
                <div
                  className={idx === imageIndex ? "slide activeSlide" : "slide"}
                >
                  <img src={img} alt={img} />
                </div>
              ))}
            </Slider>
          </div>
        </div>

        {/* Mengapa harus Sekolah di SMK Mainatul Quran? */}
        <div className="my-10 py-10">
          <div className="text-center text-[48px] font-bold">
            <p>
              Mengapa harus Sekolah di <br /> SMK Mainatul Quran?
            </p>
          </div>
          <div className="flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-20 my-10 py-10 px-24">
              <div
                className="bg-white rounded-lg shadow-lg flex items-center justify-center p-5 border-2 border-transparent hover:border-blue-500 transition duration-300"
                style={{ width: "600px", height: "280px" }}
              >
                <div className="flex-shrink-0 mr-10">
                  <img src={Gedung} alt="Sekolah IT Terbaik" />
                </div>
                <div className="ml-4">
                  <h3 className="text-2xl font-bold text-blue-900">
                    Sekolah IT Terbaik
                  </h3>
                  <p className="text-gray-600 text-base mt-2">
                    Lorem ipsum dolor sit amet, consectetur <br /> adipiscing
                    elit. Ut eget nunc faucibus,
                    <br /> rutrum lectus id, laoreet nunc. Nulla
                    <br />
                    commodo dignissim risus.
                  </p>
                </div>
              </div>

              <div
                className="bg-white rounded-lg shadow-lg flex items-center justify-center p-5 border-2 border-transparent hover:border-blue-500 transition duration-300"
                style={{ width: "600px", height: "280px" }}
              >
                <div className="flex-shrink-0 mr-10">
                  <img src={Dompet} alt="Full Praktek" />
                </div>
                <div className="ml-4">
                  <h3 className="text-2xl font-bold text-blue-900">
                    Full Praktek
                  </h3>
                  <p className="text-gray-600 text-base mt-2">
                    Lorem ipsum dolor sit amet, consectetur <br /> adipiscing
                    elit. Ut eget nunc faucibus,
                    <br /> rutrum lectus id, laoreet nunc. Nulla
                    <br />
                    commodo dignissim risus.
                  </p>
                </div>
              </div>

              <div
                className="bg-white rounded-lg shadow-lg flex items-center justify-center p-5 border-2 border-transparent hover:border-blue-500 transition duration-300"
                style={{ width: "600px", height: "280px" }}
              >
                <div className="flex-shrink-0 mr-10">
                  <img src={Piala} alt="Program Unggulan" />
                </div>
                <div className="ml-4">
                  <h3 className="text-2xl font-bold text-blue-900">
                    Program Unggulan
                  </h3>
                  <p className="text-gray-600 text-base mt-2">
                    Lorem ipsum dolor sit amet, consectetur <br /> adipiscing
                    elit. Ut eget nunc faucibus,
                    <br /> rutrum lectus id, laoreet nunc. Nulla
                    <br />
                    commodo dignissim risus.
                  </p>
                </div>
              </div>

              <div
                className="bg-white rounded-lg shadow-lg flex items-center justify-center p-5 border-2 border-transparent hover:border-blue-500 transition duration-300"
                style={{ width: "600px", height: "280px" }}
              >
                <div className="flex-shrink-0 mr-10">
                  <img src={Islam} alt="Pesantren Berbasis IT" />
                </div>
                <div className="ml-4">
                  <h3 className="text-2xl font-bold text-blue-900">
                    Pesantren Berbasis IT
                  </h3>
                  <p className="text-gray-600 text-base mt-2">
                    Lorem ipsum dolor sit amet, consectetur <br /> adipiscing
                    elit. Ut eget nunc faucibus,
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
        <div className="my-8 py-8 bg-gray-100">
          <div className="text-center text-[32px] font-bold mb-6">
            <p>
              Prestasi Murid & Alumni <br /> SMK Madinatul Quran
            </p>
          </div>
          <Slider {...settingsrifat} className="py-40 px-40">
            <div className="flex flex-row gap-3 justify-center items-center px-2">
              <div className="rounded-lg flex flex-col items-center justify-center bg-white pb-4">
                <div className="w-full mb-3">
                  <img
                    src={RIFAT}
                    alt="Sekolah IT Terbaik"
                    className="object-contain w-full"
                  />
                </div>
                <div className="flex flex-row px-3 mt-2 justify-between items-start w-full">
                  <div className="flex-grow">
                    <h3 className="text-2xl font-bold">
                      Juara Olimpiade desain <br /> grafis nusantara
                    </h3>
                  </div>
                  <div className="ml-2">
                    <button className="bg-green-500 text-xl text-white w-[160px] h-[60px] rounded-xl px-3 py-1">
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-row gap-3 justify-center items-center px-2">
              <div className="rounded-lg flex flex-col items-center justify-center bg-white pb-4">
                <div className="w-full mb-3">
                  <img
                    src={RIFAT}
                    alt="Sekolah IT Terbaik"
                    className="object-contain w-full"
                  />
                </div>
                <div className="flex flex-row px-3 mt-2 justify-between items-start w-full">
                  <div className="flex-grow">
                    <h3 className="text-2xl font-bold">
                      Juara Olimpiade desain <br /> grafis nusantara
                    </h3>
                  </div>
                  <div className="ml-2">
                    <button className="bg-green-500 text-xl text-white w-[160px] h-[60px] rounded-xl px-3 py-1">
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Slider>
        </div>

        {/* Testimoni Alumini SMK Madinatul Quran */}
        <div className="my-10">
          <div className="text-center text-[48px] font-bold">
            <p>
              Testimoni Alumini <br /> SMK Madinatul Quran
            </p>
          </div>
          {/* Slider */}

          <div className="App px-96">
            <Slider {...settings}>
              {testi.map((img, idx) => (
                <div
                  className={idx === imageIndex ? "slide activeSlide" : "slide"}
                >
                  <img src={img} alt={img} />
                </div>
              ))}
            </Slider>
          </div>
        </div>

        {/* Gallery SMK Madinatul Quran */}
        <div className="py-16">
          <div className="text-center bg-green-700 text-white text-[48px] font-bold">
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
        <div className="my-10 py-10 flex flex-col px-16 justify-center items-center bg-gray-600/10">
          <div className="text-start text-[48px] font-bold text-center mb-10">
            <p>Berita Terkini</p>
          </div>
          {/* kiri */}
          <div className="flex flex-row gap-10">
            <div className="flex flex-col bg-white gap-7">
              <div className="flex flex-col">
                <img src={KELAS} alt="Pesantren Berbasis IT" />
              </div>
              <div className="flex items-center justify-center">
                <p className="text-gray-600 text-center text-base mt-2">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
                  eget nunc <br /> faucibus, rutrum lectus id, laoreet nunc.
                  Nulla commodo dignissim <br /> risus. rutrum lectus id,
                  laoreet nunc. Nulla commodo dignissim risus.
                </p>
              </div>
            </div>
            {/* Berita kanan */}
            <div className="flex flex-col gap-8">
              <div className="flex flex-row">
                <div className="flex flex-col mr-10">
                  <img src={MAKAN} alt="Pesantren Berbasis IT" />
                </div>
                <div className="ml-4">
                  <h3 className="text-4xl font-bold">Berita Terkini</h3>
                  <p className="text-gray-600 text-base mt-14">
                    Lorem ipsum dolor sit amet,
                    <br /> consectetur adipiscing elit. Ut
                    <br />
                    eget nunc faucibus, rutrum
                    <br /> lectus id, laoreet nunc. Nulla
                    <br />
                    commodo dignissim risus.
                    <br /> rutrum lectus id, laoreet nunc.
                    <br />
                    Nulla commodo dignissim
                    <br /> risus.
                  </p>
                  <p className="text-green-600 text-base mt-7">Read more</p>
                </div>
              </div>
              <div className="flex flex-row">
                <div className="flex flex-col mr-10">
                  <img src={MAKAN} alt="Pesantren Berbasis IT" />
                </div>
                <div className="ml-4">
                  <h3 className="text-4xl font-bold">Berita Terkini</h3>
                  <p className="text-gray-600 text-base mt-14">
                    Lorem ipsum dolor sit amet,
                    <br /> consectetur adipiscing elit. Ut
                    <br />
                    eget nunc faucibus, rutrum
                    <br /> lectus id, laoreet nunc. Nulla
                    <br />
                    commodo dignissim risus.
                    <br /> rutrum lectus id, laoreet nunc.
                    <br />
                    Nulla commodo dignissim
                    <br /> risus.
                  </p>
                  <p className="text-green-600 text-base mt-7">Read more</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* daftar segera */}
        <div className="min-h-[50vh] flex justify-center items-center bg-backgroundbawah bg-fixed bg-no-repeat bg-cover bg-center">
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
              <Link to="register">
                <button className="w-auto h-auto bg-white rounded-lg px-8 py-2">
                  <p className="text-customGreen font-semibold text-lg">
                    Daftar sekarang
                  </p>
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
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

export default LandingPageRpl;