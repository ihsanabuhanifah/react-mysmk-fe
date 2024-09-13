// import "./App.css";
// import "../../ppdb/App.css";
import "../Landing-page/app.css";
import React, { useEffect } from "react";
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
import { ListTestimoni } from "../../../api/ppdb/testimoni";
import { ListMitraSekolah } from "../../../api/ppdb/mitraSekolah";

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
  // const [testi, setTesti] = useState([]);
  const [testimoniData, setTestimoniData] = useState([]);
  const [mitraSekolahData, setMitraSekolah] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    // Panggil API ListTestimoni
    ListTestimoni()
      .then((response) => {
        console.log("respon Testi", response.data.data);
        setTestimoniData(response.data.data);
      })
      .catch((err) => {
        console.error("Error fetching testimoni data:", err);
      });

    // Panggil API ListMitraSekolah
    ListMitraSekolah()
      .then((respone) => {
        console.log("respon mitra", respone.data.data);
        setMitraSekolah(respone.data.data);
      })
      .catch((err) => {
        console.log("Error fetching Data Mitra Sekolah:", err);
      });
  }, []);

  // function NextArrowtesti(props) {
  //   const { className, style, onClick } = props;
  //   return (
  //     <div
  //       className={className}
  //       style={{ ...style, display: "block", background: "black" }} // Sesuaikan styling
  //       onClick={onClick}
  //     />
  //   );
  // }

  // function PrevArrowTesti(props) {
  //   const { className, style, onClick } = props;
  //   return (
  //     <div
  //       className={className}
  //       style={{ ...style, display: "block", background: "black" }} // Sesuaikan styling
  //       onClick={onClick}
  //     />
  //   );
  // }

  // const goToPrevious = () => {
  //   setCurrentIndex((prevIndex) =>
  //     prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
  //   );
  // };

  // const goToNext = () => {
  //   setCurrentIndex((prevIndex) =>
  //     prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
  //   );
  // };

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

  const settingsAcademy = {
    dots: true,
    infinite: true,
    lazyLoad: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: true,
    // centerPadding: "150px",
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    beforeChange: (current, next) => setImageIndex(next),
  };

  const settings = {
    infinite: true,
    lazyLoad: true,
    speed: 300,
    slidesToShow: Math.min(testimoniData.length),
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: "150px",
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    beforeChange: (current, next) => setImageIndex(next),
  };

  // const settings = {
  //   infinite: false,
  //   lazyLoad: true,
  //   speed: 300,
  //   slidesToShow: Math.min(testimoniData.length, 5),
  //   slidesToScroll: 1,
  //   centerMode: true,
  //   centerPadding: 0,
  //   nextArrow: (
  //     <NextArrow
  //       currentSlide={imageIndex}
  //       slideCount={testimoniData.length}
  //     />
  //   ),
  //   prevArrow: <PrevArrow />,
  //   beforeChange: (current, next) => setImageIndex(next),
  // };

  const settingsrifat = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 2,
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
              <div className="absolute md:bottom-4 md:left-4 bottom-1 left-1">
                <div className="bg-white bg-opacity-90 md:w-[153px] w-[130px] items-center justify-center h-[35px] md:px-4 md:py-2 py-2 rounded-lg shadow-md">
                  <p className="text-green-800 font-bold md:text-xl text-base text-center">
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
              <div className="absolute md:bottom-4 md:left-4 bottom-1 left-1">
                <div className="bg-white bg-opacity-90 md:w-[153px] w-[130px] items-center justify-center h-[35px] md:px-4 md:py-2 py-2 rounded-lg shadow-md">
                  <p className="text-green-800 font-bold md:text-xl text-base text-center">
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
              <div className="absolute md:bottom-4 md:left-4 bottom-1 left-1">
                <div className="bg-white bg-opacity-90 md:w-[153px] w-[130px] items-center justify-center h-[35px] md:px-4 md:py-2 py-2 rounded-lg shadow-md">
                  <p className="text-green-800 font-bold md:text-xl text-base text-center">
                    Masjid
                  </p>
                </div>
              </div>
            </div>
          </Slider>
        </div>

        {/* About Section */}
        <div className="flex flex-col md:flex-row my-10 mx-8 items-center w-full justify-center gap-10 md:gap-96">
          <div className="order-2 md:order-1 flex flex-col gap-8 mb-10 text-center md:text-left max-w-2xl leading-relaxed">
            <h3 className="text-customGreen text-[32px] md:text-[48px] pr-10">
              SMK MADINATULQURAN <br /> Boarding School
            </h3>
            <p className="text-[18px] md:text-[24px] pr-10">
              Sekolah Menengah Kejuruan MADINATULQURAN atau SMK MQ adalah salah
              satu sekolah di Kecamatan Jonggol Kabupaten Bogor, Jawa Barat yang
              beroperasi mulai tahun 2015 dan sudah terakreditasi dari BANS/M
              Kemendikbud.
            </p>
          </div>
          <div className="order-1 md:order-2 ml-0 md:ml-8 mb-8 md:mb-0">
            <img
              src={Gambarsatu}
              alt="Gambar"
              className="object-contain h-[392px]"
            />
          </div>
        </div>

        {/* Academy Partner */}
        <div className="my-10 py-10 bg-gray-100">
          <p className="text-center font-bold text-[28px] md:text-[48px]">
            Academy Partner
          </p>
          <div className="App px-6 md:px-24 lg:px-48 xl:px-96">
            <Slider {...settingsAcademy}>
              {images.map((img, idx) => (
                <div
                  key={idx} // key is important for React components
                  className={idx === imageIndex ? "slide activeSlide" : "slide"}
                >
                  <img
                    src={img}
                    alt={`academy-partner-${idx}`}
                    className="mx-auto"
                  />
                </div>
              ))}
            </Slider>
          </div>
        </div>

        {/* Mengapa harus Sekolah di SMK Mainatul Quran? */}
        <div className="my-10 py-10">
          <div className="text-center text-[28px] md:text-[48px] font-bold">
            <p>Mengapa harus Sekolah di SMK Mainatul Quran?</p>
          </div>
          <div className="flex justify-center">
            <div className="grid grid-cols-1 gap-10 md:gap-20 my-10 py-10 px-6 md:px-24 md:grid-cols-2">
              <div className="bg-white rounded-lg shadow-lg flex flex-col md:flex-row items-center p-5 border-2 border-transparent hover:border-blue-500 transition duration-300 w-full md:w-[600px] h-auto md:h-[280px]">
                <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-10">
                  <img
                    src={Gedung}
                    alt="Sekolah IT Terbaik"
                    className="w-[120px] h-[120px]"
                  />
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-2xl font-bold text-blue-900">
                    Sekolah IT Terbaik
                  </h3>
                  <p className="text-gray-600 text-base mt-2">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
                    eget nunc faucibus, rutrum lectus id, laoreet nunc. Nulla
                    commodo dignissim risus.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg flex flex-col md:flex-row items-center p-5 border-2 border-transparent hover:border-blue-500 transition duration-300 w-full md:w-[600px] h-auto md:h-[280px]">
                <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-10">
                  <img
                    src={Dompet}
                    alt="Full Praktek"
                    className="w-[120px] h-[120px]"
                  />
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-2xl font-bold text-blue-900">
                    Full Praktek
                  </h3>
                  <p className="text-gray-600 text-base mt-2">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
                    eget nunc faucibus, rutrum lectus id, laoreet nunc. Nulla
                    commodo dignissim risus.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg flex flex-col md:flex-row items-center p-5 border-2 border-transparent hover:border-blue-500 transition duration-300 w-full md:w-[600px] h-auto md:h-[280px]">
                <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-10">
                  <img
                    src={Piala}
                    alt="Program Unggulan"
                    className="w-[120px] h-[120px]"
                  />
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-2xl font-bold text-blue-900">
                    Program Unggulan
                  </h3>
                  <p className="text-gray-600 text-base mt-2">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
                    eget nunc faucibus, rutrum lectus id, laoreet nunc. Nulla
                    commodo dignissim risus.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg flex flex-col md:flex-row items-center p-5 border-2 border-transparent hover:border-blue-500 transition duration-300 w-full md:w-[600px] h-auto md:h-[280px]">
                <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-10">
                  <img
                    src={Islam}
                    alt="Pesantren Berbasis IT"
                    className="w-[120px] h-[120px]"
                  />
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-2xl font-bold text-blue-900">
                    Pesantren Berbasis IT
                  </h3>
                  <p className="text-gray-600 text-base mt-2">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
                    eget nunc faucibus, rutrum lectus id, laoreet nunc. Nulla
                    commodo dignissim risus.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Prestasi Murid & Alumni SMK Madinatul Quran */}
        <div className="my-8 py-8 bg-gray-100">
          <div className="text-center text-[24px] md:text-[32px] font-bold mb-6">
            <p>Prestasi Murid & Alumni SMK Madinatul Quran</p>
          </div>
          <Slider
            {...settingsrifat}
            className="py-20 md:py-40 px-6 md:px-20 lg:px-40"
          >
            {mitraSekolahData.length > 0 ? (
              mitraSekolahData.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col md:flex-row gap-3 justify-center items-center px-2"
                >
                  <div className="rounded-2xl flex flex-col items-center justify-center bg-white pb-10">
                    <div className="w-full mb-3">
                      <img
                        src={item.img_url} // Ganti dengan properti gambar dari API
                        alt={item.img_url} // Ganti dengan properti judul atau deskripsi dari API
                        className="object-contain w-full"
                      />
                    </div>
                    <div className="flex flex-col md:flex-row px-3 mt-2 justify-center items-center w-full">
                      <div className="flex-grow">
                        <h3 className="text-xl md:text-2xl font-bold text-center md:text-center">
                          Juara Olimpiade desain<br></br> grafis nusantara
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col md:flex-row gap-3 justify-center items-center px-2">
                <div className="rounded-2xl flex flex-col items-center justify-center bg-white pb-10">
                  <div className="w-full mb-3">
                    <img
                      src={RIFAT}
                      alt="Sekolah IT Terbaik"
                      className="object-contain w-full"
                    />
                  </div>
                  <div className="flex flex-col md:flex-row px-3 mt-2 justify-center items-center w-full">
                    <div className="flex-grow">
                      <h3 className="text-xl md:text-2xl font-bold text-center md:text-center">
                        Juara Olimpiade desain<br></br> grafis nusantara
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Slider>
        </div>

        {/* Testimoni Alumini SMK Madinatul Quran */}
        <div className="my-10 px-10">
          <div className="text-center md:text-[48px] text-[28px] font-bold mb-8">
            <p>
              Testimoni Alumini <br /> SMK Madinatul Quran
            </p>
          </div>
          <div className="App">
            <Slider {...settings}>
              {testimoniData.map((item, idx) => (
                <div
                  key={item.id}
                  className={`slide ${idx === imageIndex ? "activeSlide" : ""}`}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "20px",
                  }}
                >
                  <div
                    className="testimonial-content"
                    style={{
                      backgroundColor: "#f9f9f9",
                      padding: "20px",
                      borderRadius: "10px",
                      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "start",
                      textAlign: "start",
                      width: "100%",
                      maxWidth: "300px",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "1.25rem",
                        marginTop: "15px",
                        marginBottom: "15px",
                      }}
                    >
                      {item.testi || "No testimonial provided"}
                    </p>
                    <p
                      style={{
                        fontSize: "1rem",
                        fontWeight: "bold",
                      }}
                    >
                      {item.nama}
                    </p>
                    <p style={{ fontSize: "1rem", marginBottom: "5px" }}>
                      {item.pekerjaan_sekarang}
                    </p>
                    <p style={{ fontSize: "0.9rem", color: "#777" }}>
                      {item.jurusan}
                    </p>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>

        {/* Gallery SMK Madinatul Quran */}
        <div className="py-16">
          <div className="text-center bg-green-700 text-white md:text-[48px] text-[28px] font-bold">
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
        <div className="my-10 py-10 flex flex-col px-6 md:px-16 justify-center items-center bg-gray-600/10">
          <div className="text-center text-[32px] md:text-[48px] font-bold mb-10">
            <p>Berita Terkini</p>
          </div>
          {/* Container berita */}
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Berita kiri */}
            <div className="flex flex-col gap-7 bg-white my-4">
              <div className="flex flex-col">
                <img
                  src={KELAS}
                  alt="Pesantren Berbasis IT"
                  className="object-cover w-full h-auto"
                />
              </div>
              <div className="flex flex-col items-start justify-start p-4">
                <h3 className="text-2xl md:text-4xl font-bold">
                  Berita Terkini
                </h3>
                <p className="text-gray-600 text-start text-sm md:text-base mt-2">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
                  eget nunc faucibus, rutrum lectus id, laoreet nunc. Nulla
                  commodo dignissim risus. Rutrum lectus id, laoreet nunc. Nulla
                  commodo dignissim risus.
                </p>
              </div>
            </div>

            {/* Berita kanan */}
            <div className="flex flex-col  gap-8 my-4 px-4 md:px-8">
              <div className="flex flex-col gap-4 bg-white">
                <div className="flex-shrink-0">
                  <img
                    src={MAKAN}
                    alt="Pesantren Berbasis IT"
                    className="object-cover w-full"
                  />
                </div>
                <div className="px-4">
                  <h3 className="text-2xl md:text-4xl font-bold">
                    Berita Terkini
                  </h3>
                  <p className="text-gray-600 text-sm md:text-base mt-4 md:mt-14">
                    Lorem ipsum dolor sit amet, <br /> consectetur adipiscing
                    elit. Ut <br />
                    eget nunc faucibus, rutrum <br /> lectus id, laoreet nunc.
                    Nulla <br />
                    commodo dignissim risus. <br /> rutrum lectus id, laoreet
                    nunc. <br />
                    Nulla commodo dignissim <br /> risus.
                  </p>
                  <p className="text-green-600 text-sm md:text-base mt-4 md:mt-7">
                    Read more
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4 bg-white">
                <div className="flex-shrink-0">
                  <img
                    src={MAKAN}
                    alt="Pesantren Berbasis IT"
                    className="object-cover w-full"
                  />
                </div>
                <div className="px-4">
                  <h3 className="text-2xl md:text-4xl font-bold">
                    Berita Terkini
                  </h3>
                  <p className="text-gray-600 text-sm md:text-base mt-4 md:mt-14">
                    Lorem ipsum dolor sit amet, <br /> consectetur adipiscing
                    elit. Ut <br />
                    eget nunc faucibus, rutrum <br /> lectus id, laoreet nunc.
                    Nulla <br />
                    commodo dignissim risus. <br /> rutrum lectus id, laoreet
                    nunc. <br />
                    Nulla commodo dignissim <br /> risus.
                  </p>
                  <p className="text-green-600 text-sm md:text-base mt-4 md:mt-7">
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
          <div className="mx-auto max-w-screen-xl px-4 py-8 sm:py-10 lg:py-12 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 lg:grid-cols-3 text-white">
              <div>
                <h3 className="text-2xl font-semibold">Kontak :</h3>
                <ul className="mt-4 space-y-2 text-2xl">
                  <li>
                    <a
                      href="https://wa.me/6285888222457"
                      className="flex items-center gap-4 text-white"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="1em"
                        height="1em"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="currentColor"
                          d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2c-5.46 0-9.91 4.45-9.91 9.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91c0-2.65-1.03-5.14-2.9-7.01m-7.01 15.24c-1.48 0-2.93-.4-4.2-1.15l-.3-.18l-3.12.82l.83-3.04l-.2-.31a8.26 8.26 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24c2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c.02 4.54-3.68 8.23-8.22 8.23m4.52-6.16c-.25-.12-1.47-.72-1.69-.81c-.23-.08-.39-.12-.56.12c-.17.25-.64.81-.78.97c-.14.17-.29.19-.54.06c-.25-.12-1.05-.39-1.99-1.23c-.74-.66-1.23-1.47-1.38-1.72c-.14-.25-.02-.38.11-.51c.11-.11.25-.29.37-.43s.17-.25.25-.41c.08-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31c-.22.25-.86.85-.86 2.07s.89 2.4 1.01 2.56c.12.17 1.75 2.67 4.23 3.74c.59.26 1.05.41 1.41.52c.59.19 1.13.16 1.56.1c.48-.07 1.47-.6 1.67-1.18c.21-.58.21-1.07.14-1.18s-.22-.16-.47-.28"
                        />
                      </svg>
                      085 888 222 457 (PSB)
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://wa.me/628126900457"
                      className="flex items-center gap-4 text-white"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="1em"
                        height="1em"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="currentColor"
                          d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24c1.12.37 2.33.57 3.57.57c.55 0 1 .45 1 1V20c0 .55-.45 1-1 1c-9.39 0-17-7.61-17-17c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1c0 1.25.2 2.45.57 3.57c.11.35.03.74-.25 1.02z"
                        />
                      </svg>
                      0812 6900 457 (Hotline)
                    </a>
                  </li>
                  <li>
                    <a
                      href="mailto:info@smkmadinatulquran.sch.id"
                      className="flex items-center gap-4 text-white"
                    >
                      <span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="1em"
                          height="1em"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="currentColor"
                            d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2m0 4l-8 5l-8-5V6l8 5l8-5z"
                          />
                        </svg>
                      </span>{" "}
                      info@smkmadinatulquran.sch.id
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-2xl font-semibold">Media Sosial :</h3>
                <ul className="mt-4 space-y-2 text-2xl">
                  <li className="flex items-center gap-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="1em"
                      height="1em"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95"
                      />
                    </svg>
                    <a
                      href="https://facebook.com"
                      className="hover:underline text-white"
                    >
                      Facebook
                    </a>
                  </li>
                  <li className="flex items-center gap-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="1em"
                      height="1em"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4zm9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3"
                      />
                    </svg>
                    <a
                      href="https://instagram.com"
                      className="hover:underline text-white"
                    >
                      Instagram
                    </a>
                  </li>
                  <li className="flex items-center gap-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="1em"
                      height="1em"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="m10 15l5.19-3L10 9zm11.56-7.83c.13.47.22 1.1.28 1.9c.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83c-.25.9-.83 1.48-1.73 1.73c-.47.13-1.33.22-2.65.28c-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44c-.9-.25-1.48-.83-1.73-1.73c-.13-.47-.22-1.1-.28-1.9c-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83c.25-.9.83-1.48 1.73-1.73c.47-.13 1.33-.22 2.65-.28c1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44c.9.25 1.48.83 1.73 1.73"
                      />
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
                <h3 className="text-2xl font-semibold">Alamat :</h3>
                <div className="mt-4 flex items-start gap-2 text-xl">
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
              <p className="md:text-left md:text-2xl text-lg">
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
