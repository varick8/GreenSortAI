"use client";

import React, { useState, useEffect } from "react";
import Loading from "@/components/Loading";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);

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
    
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gray-100 bg-cover bg-center" style={{ backgroundImage: "url('/dashboard.svg')" }}>
      <div className="absolute left-[40px] top-[96px] w-full max-w-4xl px-4 flex flex-col items-start">
        <h1 className="text-[96px] font-bold text-[#4CAF50] mb-4">GreenSortAI</h1>
        <h2 className="text-[44px] font-semibold text-[#4CAF50] mb-8">Teknologi AI Untuk Daur Ulang yang Lebih Baik</h2>
        <a href="/scan-sampah" className="text-[64px] px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200">Mulai Sekarang</a>
      </div>
    </div>
  );
}