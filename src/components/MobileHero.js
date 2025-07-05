'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

export default function MobileHero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      title: "Premium Products",
      subtitle: "Shop with Confidence",
      description: "Discover our curated selection of high-quality products",
      image: "/hero-mobile-1.jpg",
      cta: "Shop Now",
      link: "/products"
    },
    {
      id: 2,
      title: "Fast Delivery",
      subtitle: "Quick & Reliable",
      description: "Get your orders delivered fast and secure",
      image: "/hero-mobile-2.jpg",
      cta: "Learn More",
      link: "/shipping"
    },
    {
      id: 3,
      title: "24/7 Support",
      subtitle: "We're Here to Help",
      description: "Customer service that goes above and beyond",
      image: "/hero-mobile-3.jpg",
      cta: "Contact Us",
      link: "/contact"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative h-screen max-h-[600px] lg:max-h-[500px] overflow-hidden bg-gradient-to-br from-primary-600 to-primary-800">
      {/* Background Image */}
      <div className="absolute inset-0 bg-black bg-opacity-40 z-10"></div>
      
      {/* Slides */}
      <div className="relative h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
              index === currentSlide ? 'translate-x-0' : 
              index < currentSlide ? '-translate-x-full' : 'translate-x-full'
            }`}
          >
            <div
              className="h-full w-full bg-cover bg-center"
              style={{
                backgroundImage: `linear-gradient(135deg, rgba(59, 130, 246, 0.8), rgba(37, 99, 235, 0.8)), url('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop')`
              }}
            >
              <div className="relative z-20 h-full flex items-center justify-center px-4">
                <div className="text-center text-white max-w-md">
                  <h1 className="text-3xl xs:text-4xl sm:text-5xl font-bold mb-2 animate-fade-in">
                    {slide.title}
                  </h1>
                  <p className="text-lg xs:text-xl sm:text-2xl font-medium mb-3 text-primary-100">
                    {slide.subtitle}
                  </p>
                  <p className="text-sm xs:text-base sm:text-lg mb-6 text-gray-200 leading-relaxed">
                    {slide.description}
                  </p>
                  <Link
                    href={slide.link}
                    className="inline-flex items-center px-6 py-3 bg-white text-primary-600 font-semibold rounded-full hover:bg-gray-100 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    {slide.cta}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30 p-2 rounded-full bg-white bg-opacity-20 backdrop-blur-sm hover:bg-opacity-30 transition-all duration-200"
      >
        <ChevronLeftIcon className="h-6 w-6 text-white" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30 p-2 rounded-full bg-white bg-opacity-20 backdrop-blur-sm hover:bg-opacity-30 transition-all duration-200"
      >
        <ChevronRightIcon className="h-6 w-6 text-white" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              index === currentSlide 
                ? 'bg-white scale-110' 
                : 'bg-white bg-opacity-50 hover:bg-opacity-75'
            }`}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 animate-bounce-gentle lg:hidden">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}
