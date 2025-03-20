"use client";

import Link from "next/link";

export default function DetailPage({ params }: { params: { id: string } }) {
  // Static detail data; in a real app, fetch data based on params.id
  const cardDetails = {
    "1": {
      title: "Judul Informasi 1",
      description: "Detail lengkap untuk informasi 1.",
      image: "/perpus1.svg"
    },
    "2": {
      title: "Judul Informasi 2",
      description: "Detail lengkap untuk informasi 2.",
      image: "/perpus2.svg"
    },
    "3": {
      title: "Judul Informasi 3",
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

  if (!detail) {
    return <p>Data tidak ditemukan.</p>;
  }

  // Prepare related articles by filtering out the currentId
  const relatedArticles = Object.entries(cardDetails)
    .filter(([id]) => id !== currentId)
    .map(([id, data]) => ({
      id,
      ...data
    }));

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
              className="w-full h-64 object-cover rounded-lg mb-4" 
            />
            <h1 className="text-3xl font-bold mb-2">{detail.title}</h1>
            <p className="text-gray-700 mb-4">{detail.description}</p>
          </div>
        </div>
        {/* Related articles section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold mb-4">Artikel Terkait</h2>
          {relatedArticles.map((article) => (
            <Link 
              key={article.id} 
              href={`/detail/${article.id}`} 
              className="block bg-white rounded-lg shadow p-4 hover:shadow-xl transition-shadow duration-200"
            >
              <div className="flex flex-col">
                <img 
                  src={article.image} 
                  alt={article.title} 
                  className="w-full h-40 object-cover rounded-md mb-2" 
                />
                <h3 className="text-xl font-semibold">{article.title}</h3>
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