"use client";

import { useState, useEffect, useRef } from "react";
import Loading from "@/components/Loading";
import Slider from "react-slick";
import Link from "next/link";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Perpustakaan() {
  const [loading, setLoading] = useState(true);
  const [centerIndex, setCenterIndex] = useState(0); // posisi tengah default
  const sliderRef = useRef<Slider | null>(null);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) return <Loading />;

  const cards = [
    {
      id: "1",
      image: "/perpus1.svg",
      title: "Judul Informasi 1",
      description: "Deskripsi singkat tentang informasi 1.",
    },
    {
      id: "2",
      image: "/perpus2.svg",
      title: "Judul Informasi 2",
      description: "Deskripsi singkat tentang informasi 2.",
    },
    {
      id: "3",
      image: "/perpus3.svg",
      title: "Judul Informasi 3",
      description: "Deskripsi singkat tentang informasi 3.",
    },
    {
      id: "4",
      image: "/perpus4.svg",
      title: "Judul Informasi 4",
      description: "Deskripsi singkat tentang informasi 4.",
    },
    {
      id: "5",
      image: "/perpus5.svg",
      title: "Judul Informasi 5",
      description: "Deskripsi singkat tentang informasi 5.",
    },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: "0px",
    arrows: false,
    beforeChange: (oldIndex: number, newIndex: number) => {
      const centerOffset = Math.floor(5 / 2 - 1);
      const newCenter = (newIndex + centerOffset) % cards.length;
      setCenterIndex(newCenter);
    },
    customPaging: (i: number) => (
      <div className="w-4 h-4 bg-gray-600 rounded-full transition-all duration-300"></div>
    ),
    dotsClass: "slick-dots !absolute left-1/2 -translate-x-1/2 bottom-[-80px] flex justify-center gap-3",
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          centerMode: false,
        },
      },
    ],
  };
  
  const ArrowButton = ({
    direction,
  }: {
    direction: "left" | "right";
  }) => {
    // Sembunyikan panah kalau belum ada slide
    if (cards.length === 0) return null;
  
    return (
      <button
        onClick={() =>
          direction === "left"
            ? sliderRef.current?.slickPrev()
            : sliderRef.current?.slickNext()
        }
        className={`absolute top-1/2 z-30 -translate-y-1/2 bg-gray-500 shadow-xl rounded-full p-2 text-white hover:bg-gray-700 ${
          direction === "left" ? "left-0 -translate-x-full" : "right-0 translate-x-full"
        }`}
      >
        {direction === "left" ? "<" : ">"}
      </button>
    );
  };
  

  return (
    <div className="container mx-auto px-4 py-12 bg-gray-100 relative">
      <h1 className="text-center text-4xl font-bold mb-12">Perluas Wawasanmu dengan Membaca!</h1>

      <div className="relative">
        <Slider ref={sliderRef} {...settings}>
          {cards.map((card, index) => {
            const isActive = index === centerIndex;   
            return (
              <div key={card.id} className="px-2">
                <div
                  className={`
                    relative rounded-xl transition-all duration-500 
                    ${
                      isActive
                        ? "scale-[1.15] bg-white shadow-2xl z-20 overflow-visible" 
                        : "scale-90 bg-gray-200 opacity-80 blur-[0.5px] overflow-hidden"
                    }
                  `}
                >
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h2 className="text-xl font-bold mb-2">{card.title}</h2>
                    <p className="text-gray-700 mb-4">{card.description}</p>
                    <Link
                      href={`/detail/${card.id}`}
                      className="bg-blue-600 text-white px-4 py-2 rounded w-full text-center block"
                    >
                      Selengkapnya
                    </Link>
                  </div>
                  
                  {isActive && (
                    <>
                      <div className="absolute left-0 top-1/2 -translate-y-1/2">
                        <ArrowButton direction="left" />
                      </div>
                      <div className="absolute right-0 top-1/2 -translate-y-1/2">
                        <ArrowButton direction="right" />
                      </div>
                    </>
                  )}

                </div>
              </div>
            );
          })}
        </Slider>
      </div>

      <style jsx global>{`
        .slick-dots li.slick-active div {
          background-color:#22c55e; /* Tailwind green-500 */
          transform: scale(1.25);
        }
      `}</style>
    </div>
  );
}
