"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";

export interface InformationCard {
  id: string;
  image: string;
  title: string;
  content: string;
  category: string;
  focus: string;
  date: string;
}

export default function Perpustakaan() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filterTitle, setFilterTitle] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterFocus, setFilterFocus] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cardData, setCardData] = useState<InformationCard[]>([]);
  const router = useRouter();

  useEffect(() => {
    setHydrated(true);
    
    const fetchLibraryData = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/library');
        if (!res.ok) {
          throw new Error('Failed to fetch');
        }
        const data = await res.json();
        
        // Format the date and map the response to match our InformationCard interface
        const formattedData = (data.library_records as InformationCard[]).map((record: InformationCard) => {
          // Convert date format (assuming the API returns date in ISO format)
          let formattedDate = record.date;
          try {
            const dateObj = new Date(record.date);
            const day = String(dateObj.getDate()).padStart(2, '0');
            const month = String(dateObj.getMonth() + 1).padStart(2, '0');
            const year = dateObj.getFullYear();
            formattedDate = `${day}-${month}-${year}`;
          } catch (e) {
            console.error('Error formatting date:', e);
          }
          
          return {
            ...record,
            date: formattedDate
          };
        });
        
        setCardData(formattedData);
      } catch (error) {
        console.error('Failed to fetch library data:', error);
        // Fallback to empty array or sample data if needed
        setCardData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLibraryData();
  }, []);

  const handleResetFilters = () => {
    setFilterTitle("");
    setFilterCategory("");
    setFilterFocus("");
  };

  const uniqueCategories = Array.from(
    new Set(cardData.map((item) => item.category))
  );
  
  const uniqueFocuses = Array.from(
    new Set(cardData.map((item) => item.focus))
  );

  const filteredData = cardData.filter(
    (item) =>
      (filterTitle === "" ||
        item.title.toLowerCase().includes(filterTitle.toLowerCase())) &&
      (filterCategory === "" || item.category.includes(filterCategory)) &&
      (filterFocus === "" || item.focus.includes(filterFocus))
  );

  const recordsPerPage = 5;
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredData.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );
  const totalPages = Math.ceil(filteredData.length / recordsPerPage);

  if (loading) return <Loading />;

  // Avoid SSR mismatch by waiting until hydration
  if (!hydrated) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex flex-col space-y-4 lg:flex-row md:flex-col items-start justify-start lg:space-x-4 md:space-x-0 lg:space-y-0 md:space-y-4">
          <input
            type="text"
            value={filterTitle}
            onChange={(e) => setFilterTitle(e.target.value)}
            className="border-gray-300 p-2 rounded text-black w-full lg:w-fit md:w-full"
            placeholder="Cari judul informasi..."
          />

         <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="border-gray-300 p-2 rounded text-black w-full lg:w-fit md:w-full"
          >
            <option value="" disabled hidden>Kategori Informasi</option>
            {uniqueCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <select
            value={filterFocus}
            onChange={(e) => setFilterFocus(e.target.value)}
            className="border-gray-300 p-2 rounded text-black w-full lg:w-fit md:w-full"
          >
            <option value="" disabled hidden>Fokus Isu</option>
            {uniqueFocuses.map((focus) => (
              <option key={focus} value={focus}>
                {focus}
              </option>
            ))}
          </select>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 bg-green-600 text-white text-md rounded whitespace-nowrap"
          >
            Reset Filter
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {currentRecords.map((card) => (
            <div
              key={card.id}
              className="bg-white rounded-lg shadow flex flex-col h-full"
            >
              <div className="w-full bg-gray-50 aspect-video relative">
                <img
                  src={`http://localhost:8080/api/library/image/${card.image}`}
                  alt={card.title}
                  className="w-full h-full object-cover absolute inset-0"
                />
              </div>
              <div className="p-4 flex flex-col space-y-2 h-full">
                <div className="flex items-center justify-between">
                  <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">
                    {card.category}
                  </span>
                  <span className="text-gray-500 text-xs">
                    {card.date}
                  </span>
                </div>
                <h2 className="font-bold text-black text-lg truncate">{card.title}</h2>
                <p className="text-gray-700 text-sm mb-auto line-clamp-3">
                  {card.content}
                </p>
                <button
                  onClick={() => router.push(`/perpustakaan/${card.id}`)}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded text-center"
                >
                  Selengkapnya
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredData.length > 0 ? (
          <div className="mt-8 flex justify-center items-center space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="px-3 py-1 text-black bg-gray-300 rounded disabled:opacity-50"
              disabled={currentPage === 1}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === i + 1
                    ? "bg-black text-white"
                    : "bg-gray-300 text-black"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              className="px-3 py-1 text-black bg-gray-300 rounded disabled:opacity-50"
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        ) : (
          <div className="mt-8 text-center text-gray-500">
            Tidak ada data yang sesuai dengan filter yang dipilih.
          </div>
        )}
      </main>
    </div>
  );
}