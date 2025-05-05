'use client';

import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Loading from './Loading';
import { useRouter } from "next/navigation";

interface Slide {
  id: string;
  image: string;
  category: string;
  title: string;
  content: string;
  date: string;
}

export default function Perpustakaan() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/library');
        if (!res.ok) {
          throw new Error('Failed to fetch');
        }
        const data = await res.json();
        const sorted = data.library_records
          .sort((a: Slide, b: Slide) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 5);
        setSlides(sorted);
      } catch (error) {
        console.error('Failed to fetch:', error);
        setSlides([]); // Tetap kosong jika gagal
      } finally {
        setLoading(false);
      }
    };

    fetchSlides();
  }, []);

  const getVisibleSlides = () => {
    const visibleSlides = [];
    for (let i = -2; i <= 2; i++) {
      const slideIndex = (activeIndex + i + slides.length) % slides.length;
      visibleSlides.push({
        ...slides[slideIndex],
        position: i,
        actualIndex: slideIndex
      });
    }
    return visibleSlides;
  };

  const centerActiveCard = () => {
    const container = sliderRef.current;
    if (!container) return;
    const containerWidth = container.offsetWidth;
    container.scrollLeft = (container.scrollWidth - containerWidth) / 2;
  };

  const scroll = (direction: 'left' | 'right') => {
    const newIndex =
      direction === 'left'
        ? (activeIndex - 1 + slides.length) % slides.length
        : (activeIndex + 1) % slides.length;
    setActiveIndex(newIndex);
  };

  const goToSlide = (index: number) => {
    setActiveIndex(index);
  };

  useEffect(() => {
    centerActiveCard();
  }, [activeIndex]);

  useEffect(() => {
    centerActiveCard();
    const handleResize = () => centerActiveCard();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (loading) return <Loading />;
  if (slides.length === 0) return <div className="text-center py-10">No data available</div>;

  const visibleSlides = getVisibleSlides();

  return (
    <div className="w-full max-w-7xl mx-auto py-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-black mb-3">Perluas Wawasanmu dengan Membaca!</h1>
      </div>

      <div className="relative">
        <div className="overflow-hidden">
          <div
            ref={sliderRef}
            className="flex items-center justify-center gap-4 py-6"
            style={{ scrollBehavior: 'smooth' }}
          >
            {visibleSlides.map((slide) => {
              const isActive = slide.position === 0;

              return (
                <div
                  key={`${slide.id}-${slide.position}`}
                  className="slide-card flex-shrink-0 w-64 transition-all duration-300"
                  style={{
                    transform: isActive ? 'scale(1.1)' : 'scale(0.9)',
                    opacity: isActive ? 1 : 0.7,
                    zIndex: isActive ? 10 : 1
                  }}
                  onClick={() => goToSlide(slide.actualIndex)}
                >
                  {isActive && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          scroll('left');
                        }}
                        className="absolute left-[-2rem] top-1/2 -translate-y-1/2 z-20 bg-black bg-opacity-30 hover:bg-opacity-50 p-2 rounded-md text-white"
                      >
                        <ChevronLeft />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          scroll('right');
                        }}
                        className="absolute right-[-2rem] top-1/2 -translate-y-1/2 z-20 bg-black bg-opacity-30 hover:bg-opacity-50 p-2 rounded-md text-white"
                      >
                        <ChevronRight />
                      </button>
                    </>
                  )}

                  <div className="bg-white shadow-lg rounded-lg overflow-hidden h-full flex flex-col">
                    <div className="relative h-28">
                      <img
                        src={`http://localhost:8080/api/library/image/${slide.image}`}
                        alt={slide.title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2 left-2 text-xs bg-green-600 text-white px-2 py-1 rounded">
                        {slide.category}
                      </span>
                    </div>
                    <div className="p-4 flex flex-col flex-grow">
                      <p className="text-xs text-gray-500">
                        {new Date(slide.date).toLocaleDateString('en-GB').split('/').join('-')}
                      </p>
                      <h3 className="font-semibold text-lg mb-1 text-black truncate">{slide.title}</h3>
                      <p className="text-gray-600 text-sm flex-grow line-clamp-3">{slide.content}</p>
                      <button
                        onClick={() => router.push(`/perpustakaan/${slide.id}`)}
                        className="text-blue-500 text-sm mt-2 self-start">
                        Selengkapnya
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-center mt-4 space-x-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className={`w-3 h-3 rounded-full ${i === activeIndex ? 'bg-green-600' : 'bg-gray-300'}`}
            />
          ))}
        </div>
      </div>

      <div className="text-center mt-6">
        <Link href="/perpustakaan">
          <button
          onClick={() => router.push('/perpustakaan')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md">
            Lihat Semua
          </button>
        </Link>
      </div>
    </div>
  );
}