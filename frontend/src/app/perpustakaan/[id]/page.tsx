"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Loading from "@/components/Loading";


// Define interfaces locally
interface LibraryArticle {
  id: string;
  title: string;
  content: string;
  date: string;
  image: string;
  category: string;
  focus: string;
  source: string[];
}


export default function DetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [articleData, setArticleData] = useState<LibraryArticle | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<LibraryArticle[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLibraryData = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/library/${id}`);
        if (!res.ok) throw new Error("Gagal mengambil data artikel.");
        const detail = await res.json();
        const record = detail.data[0];
  
        // Format tanggal untuk artikel utama
        let formattedDate = record.date;
        try {
          const dateObj = new Date(record.date);
          const day = String(dateObj.getDate()).padStart(2, "0");
          const month = String(dateObj.getMonth() + 1).padStart(2, "0");
          const year = dateObj.getFullYear();
          formattedDate = `${day}-${month}-${year}`;
        } catch (e) {
          console.error("Error formatting date:", e);
        }
  
        const articleWithFormattedDate = { ...record, date: formattedDate };
        setArticleData(articleWithFormattedDate);
  
        // Fetch all articles to find related
        const allRes = await fetch(`http://localhost:8080/api/library`);
        if (!allRes.ok) throw new Error("Gagal mengambil artikel terkait.");
        const allData = await allRes.json();
        const allArticles: LibraryArticle[] = allData.library_records;
  
        // Filter artikel yang memiliki fokus yang sama dan bukan dirinya sendiri
        const related = allArticles
          .filter((item) => item.focus === record.focus && item.id !== record.id)
          .map((item) => {
            // Format date
            const dateObj = new Date(item.date);
            const day = String(dateObj.getDate()).padStart(2, "0");
            const month = String(dateObj.getMonth() + 1).padStart(2, "0");
            const year = dateObj.getFullYear();
            const formatted = `${day}-${month}-${year}`;
            return { ...item, date: formatted };
          });
  
        setRelatedArticles(related);
      } catch (err) {
        console.error(err);
        setError("Gagal memuat data. Silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    };
  
    if (id) {
      fetchLibraryData();
    } else {
      setLoading(false);
      setError("ID artikel tidak ditemukan.");
    }
  }, [id]);  

  
  if (loading) return <Loading />;
  if (!articleData) return <Loading />;

  const filteredRelatedArticles = relatedArticles.filter(
    article =>
      article &&
      typeof article.title === "string" &&
      article.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {error && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
          <p>{error}</p>
        </div>
      )}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md p-6">
              <img
                src={`http://localhost:8080/api/library/image/${articleData.image}`}
                alt={articleData.title}
                className="w-full h-[300px] object-cover rounded-md mb-6"
              />
              <h1 className="lg:text-3xl md:text-2xl text-xl font-bold text-gray-800 mb-2 sm:text-xl">{articleData.title}</h1>
              <p className="text-gray-500 text-sm mb-6">{articleData.date}</p>
              <div className="text-gray-700 space-y-4">
              {articleData.content?.split("\\n").filter(p => p.trim() !== "").map((paragraph, index) => (
                    <p key={index} className="text-justify indent-8 mb-4">
                      {paragraph}
                    </p>
                  ))}
               {articleData.source && articleData.source.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">Referensi</h3>
                    <ul className="text-blue-600 space-y-1">
                      {articleData.source.map((url, index) => (
                        <li
                          key={index}
                          className="list-none relative pl-5 before:content-['•'] before:absolute before:left-0 before:top-0"
                        >
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline break-words whitespace-normal"
                          >
                            {url}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="mt-6">
                  <div className="text-sm text-gray-700 space-y-1">
                    <p><strong>Judul Informasi</strong> : {articleData.title}</p>
                    <p><strong>Kategori</strong> : {articleData.category}</p>
                    <p><strong>Fokus Isu</strong> : {articleData.focus}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar artikel terkait */}
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Cari artikel..."
              className="w-full px-4 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <h2 className="text-2xl font-bold text-black">Artikel Terkait</h2>
            <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2">
              {filteredRelatedArticles.length > 0 ? (
                filteredRelatedArticles.map((article) => (
                  <Link
                    key={article.id}
                    href={`/perpustakaan/${article.id}`}
                    className="flex flex-col bg-white rounded-lg shadow-md p-3 hover:shadow-lg transition"
                  >
                    <img
                      src={`http://localhost:8080/api/library/image/${article.image}`}
                      alt={article.title}
                      className="w-full h-40 object-cover rounded-md mb-2"
                    />
                    <div className="flex items-center justify-between">
                      <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">
                        {article.category}
                      </span>
                      <span className="text-gray-500 text-xs">
                        {article.date}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 truncate">{article.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {article.content.substring(0, 60)}...
                    </p>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-center text-gray-500">Tidak Ada Artikel Terkait</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}