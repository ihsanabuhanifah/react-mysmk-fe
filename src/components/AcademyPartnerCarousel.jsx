import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa"; // For custom arrows

// Import your logos here
import CISCO from "../../image/ppdb/academy/Group 108.png";
import LSP from "../../image/ppdb/academy/Group 109.png";
// Add more logos as necessary

const AcademyPartnerCarousel = () => {
  const logos = [CISCO, LSP /* add more logos here */];

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: "0px",
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <div className="App">
      <h2 className="text-center font-bold text-3xl mb-8">Academy Partner</h2>
      <Slider {...settings}>
        {logos.map((logo, index) => (
          <div key={index} className="slide">
            <img src={logo} alt={`Partner logo ${index}`} className="m-auto" />
          </div>
        ))}
      </Slider>
    </div>
  );
};

// Custom Next Arrow
const NextArrow = (props) => {
  const { onClick } = props;
  return (
    <div className="arrow next" onClick={onClick}>
      <FaArrowRight />
    </div>
  );
};

// Custom Previous Arrow
const PrevArrow = (props) => {
  const { onClick } = props;
  return (
    <div className="arrow prev" onClick={onClick}>
      <FaArrowLeft />
    </div>
  );
};

export default AcademyPartnerCarousel;
