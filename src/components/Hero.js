'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      title: "Welcome to YourDollarsOnline",
      subtitle: "Premium Quality, Unbeatable Prices",
      description: "Discover thousands of products at amazing prices with fast, free shipping",
      image: "/hero-1.jpg",
      cta: "Shop Now",
      link: "/products"
    },
    {
      id: 2,
      title: "Electronics Sale",
      subtitle: "Up to 70% Off",
      description: "Latest gadgets and electronics at incredible discounts",
      image: "/hero-2.jpg",
      cta: "Shop Electronics",
      link: "/category/electronics"
    },
    {
      id: 3,
      title: "Fashion Forward",
      subtitle: "New Collection",
      description: "Trendy clothing and accessories for every style",
      image: "/hero-3.jpg",
      cta: "Shop Fashion",
      link: "/category/clothing"
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
    <div className="relative h-96 md:h-[600px] bg-gradient-to-r from-blue-600 to-purple-700 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-black bg-opacity-20">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/80 to-purple-700/80"></div>
      </div>

      {/* Slide Content */}
      <div className="relative h-full flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in">
              {slides[currentSlide].title}
            </h1>
            <p className="text-xl md:text-2xl mb-2 text-yellow-300 font-semibold">
              {slides[currentSlide].subtitle}
            </p>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-gray-100">
              {slides[currentSlide].description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={slides[currentSlide].link}
                className="inline-flex items-center justify-center px-8 py-3 bg-yellow-400 text-gray-900 font-semibold rounded-full hover:bg-yellow-300 transform hover:scale-105 transition-all duration-300 shadow-lg"
              >
                {slides[currentSlide].cta}
              </Link>
              <Link
                href="/deals"
                className="inline-flex items-center justify-center px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-gray-900 transition-all duration-300"
              >
                View Deals
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all duration-300"
      >
        <ChevronLeftIcon className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all duration-300"
      >
        <ChevronRightIcon className="h-6 w-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-yellow-400/20 rounded-full animate-bounce"></div>
      <div className="absolute bottom-20 right-10 w-16 h-16 bg-pink-400/20 rounded-full animate-pulse"></div>
      <div className="absolute top-1/2 right-20 w-12 h-12 bg-green-400/20 rounded-full animate-ping"></div>
    </div>
  );
}
