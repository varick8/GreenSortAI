"use client";

import { useState, useEffect } from "react";
import Loading from "@/components/Loading";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Perpustakaan() {
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    // Simulate loading when the page refreshes
    setTimeout(() => {
      setLoading(false);
    }, 3000); // Show the loading screen for 3 seconds
  }, []);

  useEffect(() => {
    // Set loading to false after the component mounts
    setLoading(false);
  }, []);

  if (loading) {
    return <Loading />; // Show loading screen while loading is true
  }  

  const cards = [
    {
      image: "/perpus1.svg",
      title: "Judul Informasi 1",
      description: "Deskripsi singkat tentang informasi 1."
    },
    {
      image: "/perpus2.svg",
      title: "Judul Informasi 2",
      description: "Deskripsi singkat tentang informasi 2."
    },
    {
      image: "/perpus3.svg",
      title: "Judul Informasi 3",
      description: "Deskripsi singkat tentang informasi 3."
    },
    {
      image: "/perpus4.svg",
      title: "Judul Informasi 4",
      description: "Deskripsi singkat tentang informasi 4."
    },
    {
      image: "/perpus5.svg",
      title: "Judul Informasi 5",
      description: "Deskripsi singkat tentang informasi 5."
    }
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: '250px',
    beforeChange: (current, next) => setCurrentSlide(next),
    afterChange: (current) => setCurrentSlide(current),
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };
  

  function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={`${className} bg-blue-600 text-white rounded-full p-3 absolute top-1/2 transform -translate-y-1/2 right-5 z-100 cursor-pointer`}
        style={{ ...style, display: "block" }} 
        onClick={onClick}
      >
        ➡
      </div>
    );
  }
  
  function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={`${className} bg-blue-600 text-white rounded-full p-3 absolute top-1/2 transform -translate-y-1/2 left-5 z-100 cursor-pointer`}
        style={{ ...style, display: "block" }}
        onClick={onClick}
      >
        ⬅
      </div>
    );
  }  
  

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-center text-4xl font-bold my-12">Perluas Wawasanmu dengan Membaca!</h1>
      <Slider {...settings}>
        {cards.map((card, index) => (
          <div key={index} className={`p-4 ${index === currentSlide ? 'transform scale-125 shadow-lg' : 'transform scale-100'} transition-transform duration-300`}>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img src={card.image} alt={card.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h2 className="text-2xl font-bold mb-2">{card.title}</h2>
                <p className="text-gray-700 mb-4">{card.description}</p>
                <a href="#" className="bg-blue-600 text-white px-4 py-2 rounded w-full">Selengkapnya</a>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}