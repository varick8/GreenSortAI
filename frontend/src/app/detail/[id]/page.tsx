"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const cardDetails: Record<string, { title: string; description: string; image: string }> = {
  "1": { title: "Mengurangi Food Waste", description: "Detail lengkap untuk informasi 1. Lorem Ipsum Dolor Lorem Ipsu Lorem Ipsum Dolorm Dolor", image: "/perpus1.svg" },
  "2": { title: "Analisis Resiko Lingkungan", description: "Detail lengkap untuk informasi 2. Lorem Ipsum Dolor Lorem Ipsum Dolor Lorem Ipsum Dolor Lorem Ipsum Dolor", image: "/perpus2.svg" },
  "3": { title: "Gerakan Sedekah Sampah", description: "Detail lengkap untuk informasi 3. Lorem Ipsum Dolor Lorem Ipsum Dolor Lorem Ipsum Dolor Lorem Ipsum Dolor", image: "/perpus3.svg" },
  "4": { title: "Judul Informasi 4", description: "Detail lengkap untuk informasi 4. Lorem Ipsum Dolor Lorem Ipsum Dolor Lorem Ipsum Dolor Lorem Ipsum Dolor", image: "/perpus4.svg" },
  "5": { title: "Judul Informasi 5", description: "Detail lengkap untuk informasi 5.Lorem Ipsum Dolor Lorem Ipsum Dolor Lorem Ipsum Dolor Lorem Ipsum Dolor", image: "/perpus5.svg" },
};

export default function DetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) return <div>Loading...</div>;

  const detail = cardDetails[id];
  if (!detail) return <p>Data tidak ditemukan.</p>;

  const relatedArticles = Object.entries(cardDetails)
    .filter(([key]) => key !== id)
    .map(([key, data]) => ({ id: key, ...data }))
    .filter((article) =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Konten utama */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-md p-6">
            <img
              src={detail.image}
              alt={detail.title}
              className="w-full h-[400px] object-cover rounded-md mb-6"
            />
            <h1 className="text-4xl font-bold text-gray-800 mb-2">{detail.title}</h1>
            <p className="text-gray-500 text-sm mb-6">27-02-2025 20:18</p>
            <div className="text-gray-700 space-y-4">
              <p>{detail.description}</p>
              {/* Tambahkan paragraf dummy seperti di gambar jika diperlukan */}
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam pharetra sit amet ligula id hendrerit...
              </p>
              <p>
                Nulla facilisi. Sed nec ex quis, euismod condimentum et. Orci varius natoque penatibus...
              </p>
              <p>
                Curabitur eu risus augu fermentum vehicula. Nullam ut diam tortor.
              </p>
              {/* dan seterusnya sesuai kebutuhan */}
            </div>
          </div>
        </div>

        {/* Sidebar artikel terkait */}
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Cari artikel..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <h2 className="text-2xl font-bold">Artikel Terkait</h2>
          <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2">
            {relatedArticles.map((article) => (
              <Link
                key={article.id}
                href={`/detail/${article.id}`}
                className="flex flex-col bg-white rounded-lg shadow-md p-3 hover:shadow-lg transition"
              >
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-40 object-cover rounded-md mb-2"
                />
                <p className="text-sm text-gray-400">Berita</p>
                <h3 className="text-lg font-semibold text-gray-800">{article.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{article.description.substring(0, 60)}...</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
