"use client";
import { useState, useEffect } from "react";
import Loading from "@/components/Loading";

export default function Riwayat() {
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
    <h1>Riwayat</h1>
  );
}