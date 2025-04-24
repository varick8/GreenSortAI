"use client";

import Link from "next/link";
import { useState } from "react";

export default function DetailPage({ params }: { params: { id: string } }) {
  // Static detail data; in a real app, fetch data based on params.id
  const cardDetails = {
    "1": {
      title: "Mengurangi Food Waste",
      description: "Detail lengkap untuk informasi 1.",
      image: "/perpus1.svg"
    },
    "2": {
      title: "Analisis Resiko Lingkungan",
      description: "Detail lengkap untuk informasi 2.",
      image: "/perpus2.svg"
    },
    "3": {
      title: "Gerakan Sedekah Sampah",
      description: "Detail lengkap untuk informasi 3.",
      image: "/perpus3.svg"
    },
    "4": {
      title: "Judul Informasi 4",
      description: "Detail lengkap untuk informasi 4.",
      image: "/perpus4.svg"
    },
    "5": {
      title: "Judul Informasi 5",
      description: "Detail lengkap untuk informasi 5.",
      image: "/perpus5.svg"
    }
  };

  const currentId = params.id;
  const detail = cardDetails[currentId];

  const [searchTerm, setSearchTerm] = useState("");

  if (!detail) {
    return <p>Data tidak ditemukan.</p>;
  }

  // Prepare related articles by filtering out the currentId
  const relatedArticles = Object.entries(cardDetails)
    .filter(([id]) => id !== currentId)
    .map(([id, data]) => ({
      id,
      ...data
    }))
    .filter((article)=>
      article.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      <Link 
        href="/perpustakaan" 
        className="text-blue-600 underline mb-4 inline-block"
      >
        Kembali
      </Link>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main detail section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <img 
              src={detail.image} 
              alt={detail.title} 
              className="w-full h-96 object-cover rounded-lg mb-4" 
            />
            <h1 className="text-3xl font-bold mb-2">{detail.title}</h1>
            <p className="text-sm text-gray-500 mb-4">27-02-2025 20:18</p>
            <p className="text-gray-700 mb-4">{detail.description}</p>
          </div>
        </div>
        {/* Related articles section */}
        <div className="space-y-4 max-h-[80vh] overflow-y-auto">
          <input
            type="text" 
            placeholder="Cari artikel..." 
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400" 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <h2 className="text-2xl font-bold mb-4">Artikel Terkait</h2>
          {relatedArticles.map((article) => (
            <Link 
              key={article.id} 
              href={`/detail/${article.id}`} 
              className="flex bg-white rounded-lg shadow p-2 hover:shadow-xl transition-shadow duration-200"
            >
              <div className="flex flex-col">
                <img 
                  src={article.image} 
                  alt={article.title} 
                  className="w-40 h-40 object-cover rounded-md mr-3" 
                />
                <div className="flex flex-col justify-between">
                  <p className="text-sm text-gray-400">Berita</p>
                  <h3 className="text-xl font-semibold">{article.title}</h3>
                </div>
                <p className="text-gray-600 text-sm mt-1">
                  {article.description.substring(0, 60)}...
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}