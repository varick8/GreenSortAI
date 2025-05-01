"use client";

import { useState } from "react";
import Link from "next/link";

export interface InformationCard {
  id: string;
  image: string;
  title: string;
  description: string;
  date: string;
  time: string;
}

export const cardData: InformationCard[] = [
  {
    id: "1",
    image: "/perpus1.svg",
    title: "Mengurangi Food Waste",
    description:
      "Detail lengkap untuk informasi 1. Lorem Ipsum Dolor Lorem Ipsum Dolor Lorem Ipsum Dolor Lorem Ipsum Dolor.",
    date: "27-02-2025",
    time: "20:18",
  },
  {
    id: "2",
    image: "/perpus2.svg",
    title: "Analisis Resiko Lingkungan",
    description:
      "Detail lengkap untuk informasi 2. Lorem Ipsum Dolor Lorem Ipsum Dolor Lorem Ipsum Dolor Lorem Ipsum Dolor.",
    date: "27-02-2025",
    time: "20:18",
  },
  {
    id: "3",
    image: "/perpus3.svg",
    title: "Gerakan Sedekah Sampah: blabla",
    description:
      "Detail lengkap untuk informasi 3. Lorem Ipsum Dolor Lorem Ipsum Dolor Lorem Ipsum Dolor Lorem Ipsum Dolor.",
    date: "27-02-2025",
    time: "20:18",
  },
  {
    id: "4",
    image: "/perpus4.svg",
    title: "Judul Lorem Ipsum dolor sit amet",
    description:
      "Detail lengkap untuk informasi 4. 0rem Ipsum Dolor Lorem Ipsum Dolor Lorem Ipsum Dolor Lorem Ipsum Dolor.",
    date: "27-02-2025",
    time: "20:18",
  },
  {
    id: "5",
    image: "/perpus5.svg",
    title: "Title",
    description:
      "Detail lengkap untuk informasi 5. Lorem Ipsum Dolor Lorem Ipsum Dolor Lorem Ipsum Dolor Lorem Ipsum Dolor.",
    date: "27-02-2025",
    time: "20:18",
  },
];

export default function Perpustakaan() {
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;
  const [filterTitle, setFilterTitle] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterFocus, setFilterFocus] = useState("");

  const handleResetFilters = () => {
    setFilterTitle("");
    setFilterCategory("");
    setFilterFocus("");
  };

  const filteredData = cardData.filter((item) =>
    (filterTitle === "" ||
      item.title.toLowerCase().includes(filterTitle.toLowerCase())) &&
    (filterCategory === "" || item.title.includes(filterCategory)) &&
    (filterFocus === "" || item.description.includes(filterFocus))
  );

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredData.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredData.length / recordsPerPage);

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto px-4 py-8">
        {/* Filter Controls */}
        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-start md:space-x-4 space-y-4 md:space-y-0">
          <input
            type="text"
            value={filterTitle}
            onChange={(e) => setFilterTitle(e.target.value)}
            className="border-gray-300 p-2 rounded"
            placeholder="Cari judul informasi..."
          />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="border-gray-300 p-2 rounded"
          >
            <option value="">Kategori Informasi</option>
            <option value="Lingkungan">Lingkungan</option>
            <option value="Ekonomi">Ekonomi</option>
          </select>
          <select
            value={filterFocus}
            onChange={(e) => setFilterFocus(e.target.value)}
            className="border-gray-300 p-2 rounded"
          >
            <option value="">Fokus Isu</option>
            <option value="Daur Ulang">Daur Ulang</option>
            <option value="Pengelolaan Sampah">Pengelolaan Sampah</option>
          </select>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Reset Filter
          </button>
        </div>

        {/* Daftar Kartu */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {currentRecords.map((card) => (
            <div
              key={card.id}
              className="bg-white rounded-lg shadow overflow-hidden flex flex-col"
            >
              <img
                src={card.image}
                alt={card.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 flex flex-col space-y-2">
                <div className="flex items-center justify-between">
                  <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">
                    Berita
                  </span>
                  <span className="text-gray-500 text-xs">
                    {card.date} {card.time}
                  </span>
                </div>
                <h2 className="font-bold text-lg truncate">
                  {card.title}
                </h2>
                <p className="text-gray-700 text-sm whitespace-pre-line">
                  {card.description.split("\n").slice(0, 5).join("\n")}
                </p>
                <Link href={`/detail/${card.id}`}>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded">
                    Selengkapnya
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-8 flex justify-center items-center space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1 ? "bg-black text-white" : "bg-gray-300"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </main>
    </div>
  );
}
