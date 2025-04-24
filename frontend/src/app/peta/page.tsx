"use client";
import Loading from "@/components/Loading";
import { useState, useEffect } from "react";

const categories = ["TPA", "TPS3R", "Bank Sampah", "Komposting", "Produk Kreatif", "Sumber Energi"];

export default function Peta() {
    const [selectedCategory, setSelectedCategory] = useState<string>("TPA");
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        // Set loading to false after the component mounts
        setLoading(false);
    }, []);
    
    if (loading) {
        return <Loading />;
    }

    return (
        <div className="w-screen flex flex-col items-center">
            {/* Filter Peta */}
            <div className="w-[1924px] h-[136px] bg-gray-300/75 flex items-center justify-center gap-4 rounded-lg shadow-md">
                {categories.map((category) => (
                    <button
                        key={category}
                        className={`px-6 py-2 rounded-md text-lg font-semibold transition-all duration-200 
              ${selectedCategory === category ? "bg-green-600 text-white" : "bg-white text-gray-700 hover:bg-gray-200"}`}
                        onClick={() => setSelectedCategory(category)}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* Peta */}
            <div className="w-[1920px] h-[640px] aspect-[192/83] bg-blue-200 mt-4 rounded-lg shadow-lg flex items-center justify-center">
                <h1 className="text-3xl font-bold text-gray-800">Menampilkan: {selectedCategory}</h1>
            </div>
        </div>
    );
}