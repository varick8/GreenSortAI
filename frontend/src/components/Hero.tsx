"use client";

import { useState, useEffect } from 'react';
import { parse } from 'cookie';
import Loading from './Loading';
import LoginModal from './auth/LoginModal';

export default function Hero() {
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(true); // Use the User type
    const [isLoginOpen, setIsLoginOpen] = useState(false);

    const toggleLogin = () => setIsLoginOpen(!isLoginOpen);
    const closeLogin = () => setIsLoginOpen(false);

    // Initialize user state from cookies
    useEffect(() => {
          const initializeUser = async () => {
              try {
                  const cookies = document.cookie;
                  const parsedCookies = parse(cookies);
                  const token = parsedCookies.auth_token;
  
                  if (token) {
                     setUser(true);
                  } else {
                      setUser(false);
                  }
              } catch (error) {
                  console.error("Error initializing user:", error);
              } finally {
                  setIsLoading(false);
              }
          };
  
          initializeUser();
      }, []);
  
  if (isLoading) return <Loading />; // Show loading state while checking cookies

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
        <button
          onClick={() => {
            if (user) {
              window.location.href = '/scan-sampah';
            } else {
              toggleLogin();
            }
          }}
          className="bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-8 rounded-md transition-colors duration-300 text-lg md:text-xl border-2 border-green-500 hover:border-green-600"
        >
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
      <LoginModal isOpen={isLoginOpen} closeModal={closeLogin} />
    </div>
  );
}