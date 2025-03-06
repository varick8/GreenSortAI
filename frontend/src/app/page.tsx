import React from 'react';
import './Dashboard.css';

export default function Dashboard() {
  return (
    <div className="dashboard">
      <h1>GreenSortAI</h1>
      <h2>Teknologi AI Untuk Daur Ulang yang Lebih Baik</h2>
      <a href="/scan-sampah" className="start-button">Mulai Sekarang</a>
    </div>
  );
}