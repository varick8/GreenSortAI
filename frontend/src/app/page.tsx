"use client";

import React, { useState, useEffect, useRef } from "react";
import Loading from "@/components/Loading";
import Link from "next/link";
import Slider from "react-slick";
import "leaflet/dist/leaflet.css";
import "react-leaflet-markercluster/styles";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Dashboard() {
    const [loading, setLoading] = useState(true);

    // Gunakan useRef dan state centerIndex seperti pada halaman Perpustakaan
    const sliderRef = useRef<Slider | null>(null);
    const [centerIndex, setCenterIndex] = useState(0);

    // State untuk section Peta (mirror halaman Peta)
    const categories = [
        "TPA",
        "TPS3R",
        "Bank Sampah",
        "Komposting",
        "Produk Kreatif",
        "Sumber Energi",
    ];
    const [selectedCategory, setSelectedCategory] = useState<string>("TPA");

    useEffect(() => {
        // Simulasikan loading selama 1 detik
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }, []);

    // Data kartu harus konsisten saat loading true
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
        dotsClass:
            "slick-dots !absolute left-1/2 -translate-x-1/2 bottom-[-80px] flex justify-center gap-3",
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

    // Komponen tombol panah
    const ArrowButton = ({
        direction,
    }: {
        direction: "left" | "right";
    }) => {
        if (cards.length === 0) return null;
        return (
            <button
                onClick={() =>
                    direction === "left"
                        ? sliderRef.current?.slickPrev()
                        : sliderRef.current?.slickNext()
                }
                className={`absolute top-1/2 z-30 -translate-y-1/2 bg-gray-500 shadow-xl rounded-full p-2 text-white hover:bg-gray-700 ${direction === "left" ? "left-0 -translate-x-full" : "right-0 translate-x-full"
                    }`}
            >
                {direction === "left" ? "<" : ">"}
            </button>
        );
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <>
            {/* Dashboard Hero */}
            <div
                className="relative flex flex-col items-center justify-center min-h-screen bg-gray-100 bg-cover bg-center"
                style={{ backgroundImage: "url('/dashboard.svg')" }}
            >
                <div className="absolute left-[40px] top-[96px] w-full max-w-4xl px-4 flex flex-col items-start">
                    <h1 className="text-[96px] font-bold text-[#4CAF50] mb-4">
                        GreenSortAI
                    </h1>
                    <h2 className="text-[44px] font-semibold text-[#4CAF50] mb-8">
                        Teknologi AI Untuk Daur Ulang yang Lebih Baik
                    </h2>
                    <Link
                        href="/scan-sampah"
                        className="text-[64px] px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                    >
                        Mulai Sekarang
                    </Link>
                </div>
            </div>

            {/* Section Perpustakaan (sama persis dengan halaman Perpustakaan) */}
            <section id="perpustakaan" className="py-12 bg-gray-100">
                <div className="container mx-auto px-4">
                    <h2 className="text-5xl font-bold mb-6 text-center">
                        Perluas Wawasanmu dengan Membaca!
                    </h2>
                    <div className="relative">
                        <Slider ref={sliderRef} {...settings}>
                            {cards.map((card, index) => {
                                const isActive = index === centerIndex;
                                return (
                                    <div key={card.id} className="px-2">
                                        <div
                                            className={`
                        relative rounded-xl transition-all duration-500 
                        ${isActive
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
                                                <h2 className="text-xl font-bold mb-2">
                                                    {card.title}
                                                </h2>
                                                <p className="text-gray-700 mb-4">
                                                    {card.description}
                                                </p>
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
                        <style jsx global>{`
              .slick-dots li.slick-active div {
                background-color: #22c55e;
                transform: scale(1.25);
              }
            `}</style>
                    </div>
                </div>
            </section>

            {/* Section Peta (sama persis dengan halaman Peta) */}
            <section id="peta" className="py-12 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-5xl font-bold mb-6 text-center">Peta</h2>
                    <p className="mb-4">
                        Temukan lokasi bank sampah dan fasilitas daur ulang di sekitar Anda.
                    </p>
                    {/* Filter Peta */}
                    <div className="w-full overflow-x-auto">
                        <div className="w-full max-w-[1920px] h-[136px] bg-gray-300/75 flex items-center justify-center gap-4 rounded-lg shadow-md mx-auto">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-6 py-2 rounded-md text-lg font-semibold transition-all duration-200 ${selectedCategory === category
                                            ? "bg-green-600 text-white"
                                            : "bg-white text-gray-700 hover:bg-gray-200"
                                        }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>
                    {/* Tampilan Peta (contoh tampilan mirror dari halaman Peta) */}
                    <div className="w-full max-w-[1920px] h-[640px] aspect-[192/83] bg-blue-200 mt-4 rounded-lg shadow-lg flex items-center justify-center mx-auto">
                        <h1 className="text-3xl font-bold text-gray-800">
                            Menampilkan: {selectedCategory}
                        </h1>
                    </div>
                    <div className="mt-4">
                        <Link
                            href="/peta"
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-200"
                        >
                            Lihat Selengkapnya
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}