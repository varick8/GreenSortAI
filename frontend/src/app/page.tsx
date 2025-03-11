"use client";

import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import Loading from "@/components/Loading";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading when the page refreshes
    setTimeout(() => {
      setLoading(false);
    }, 3000); // Show the loading screen for 1.5 seconds
  }, []);

  useEffect(() => {
    // Set loading to false after the component mounts
    setLoading(false);
  }, []);

  if (loading) {
    return <Loading />; // Show loading screen while loading is true
  }

  return ( 
    <div className="dashboard">
      <h1>GreenSortAI</h1>
      <h2>Teknologi AI Untuk Daur Ulang yang Lebih Baik</h2>
      <a href="/scan-sampah" className="start-button">Mulai Sekarang</a>
    </div>
  );
}