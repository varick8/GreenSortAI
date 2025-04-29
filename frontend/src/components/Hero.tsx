import { useState } from 'react';

export default function Hero() {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-7xl mx-auto px-8 py-8 md:py-8 gap-6">
      {/* Left side - Text content */}
      <div className="flex flex-col space-y-4 md:space-y-6 md:w-1/2">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-green-600">
          GreenSortAI
        </h1>
        <p className="text-xl md:text-2xl text-green-500 font-light">
          Teknologi AI untuk Daur Ulang yang Lebih Baik
        </p>
        <div className="pt-4">
          <button className="bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-8 rounded-md transition-colors duration-300 text-lg md:text-xl border-2 border-green-500 hover:border-green-600">
            Mulai Sekarang!
          </button>
        </div>
      </div>
      
      {/* Right side - Illustration */}
      <div className="hidden sm:flex w-full md:w-1/2 justify-center">
        <div className="relative w-full max-w-md px-6">
          <div className="bg-blue-100 rounded-full w-full aspect-square flex items-center justify-center p-6">
            {/* PNG image positioned to extend slightly beyond the circle */}
            <img 
              src="/trash.png" 
              alt="Recycling illustration with bins" 
              className="w-full h-full object-contain absolute transform scale-125"
            />
          </div>
        </div>
      </div>
    </div>
  );
}