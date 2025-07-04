'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { StarIcon, HeartIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';

export default function FeaturedProducts() {
  const [favorites, setFavorites] = useState([]);

  // Mock featured products data
  const featuredProducts = [
    {
      id: 1,
      name: "Wireless Noise-Cancelling Headphones",
      price: 199.99,
      originalPrice: 299.99,
      image: "/product-1.jpg",
      rating: 4.8,
      reviews: 124,
      category: "Electronics",
      badge: "Best Seller",
      slug: "wireless-noise-cancelling-headphones"
    },
    {
      id: 2,
      name: "Premium Cotton T-Shirt",
      price: 29.99,
      originalPrice: 39.99,
      image: "/product-2.jpg",
      rating: 4.6,
      reviews: 89,
      category: "Clothing",
      badge: "New",
      slug: "premium-cotton-t-shirt"
    },
    {
      id: 3,
      name: "Smart Home Security Camera",
      price: 149.99,
      originalPrice: 199.99,
      image: "/product-3.jpg",
      rating: 4.9,
      reviews: 203,
      category: "Electronics",
      badge: "Featured",
      slug: "smart-home-security-camera"
    },
    {
      id: 4,
      name: "Ergonomic Office Chair",
      price: 299.99,
      originalPrice: 399.99,
      image: "/product-4.jpg",
      rating: 4.7,
      reviews: 156,
      category: "Home & Garden",
      badge: "Sale",
      slug: "ergonomic-office-chair"
    },
    {
      id: 5,
      name: "Stainless Steel Water Bottle",
      price: 24.99,
      originalPrice: 34.99,
      image: "/product-5.jpg",
      rating: 4.5,
      reviews: 67,
      category: "Sports",
      badge: "Eco-Friendly",
      slug: "stainless-steel-water-bottle"
    },
    {
      id: 6,
      name: "Bluetooth Speaker",
      price: 79.99,
      originalPrice: 119.99,
      image: "/product-6.jpg",
      rating: 4.8,
      reviews: 198,
      category: "Electronics",
      badge: "Popular",
      slug: "bluetooth-speaker"
    }
  ];

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavorites(savedFavorites);
  }, []);

  const toggleFavorite = (productId) => {
    const updatedFavorites = favorites.includes(productId)
      ? favorites.filter(id => id !== productId)
      : [...favorites, productId];
    
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Trigger cart update event
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const getBadgeColor = (badge) => {
    switch (badge) {
      case 'Best Seller':
        return 'bg-yellow-500';
      case 'New':
        return 'bg-green-500';
      case 'Featured':
        return 'bg-blue-500';
      case 'Sale':
        return 'bg-red-500';
      case 'Eco-Friendly':
        return 'bg-emerald-500';
      case 'Popular':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Featured Products
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our handpicked selection of premium products at amazing prices
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              <div className="relative">
                <div className="aspect-w-16 aspect-h-12 bg-gray-200 relative">
                  <div className="w-full h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <span className="text-gray-500 text-sm">Product Image</span>
                  </div>
                </div>
                
                {/* Badge */}
                <div className={`absolute top-3 left-3 ${getBadgeColor(product.badge)} text-white px-2 py-1 text-xs font-semibold rounded-full`}>
                  {product.badge}
                </div>

                {/* Favorite Button */}
                <button
                  onClick={() => toggleFavorite(product.id)}
                  className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-300"
                >
                  {favorites.includes(product.id) ? (
                    <HeartSolid className="h-5 w-5 text-red-500" />
                  ) : (
                    <HeartIcon className="h-5 w-5 text-gray-600" />
                  )}
                </button>

                {/* Quick Actions */}
                <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={() => addToCart(product)}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center space-x-2"
                  >
                    <ShoppingCartIcon className="h-5 w-5" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-2">
                  <span className="text-sm text-gray-500">{product.category}</span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  <Link href={`/product/${product.slug}`}>
                    {product.name}
                  </Link>
                </h3>

                <div className="flex items-center mb-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 ml-2">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-gray-900">
                      ${product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>
                  
                  {product.originalPrice && (
                    <div className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-semibold">
                      Save ${(product.originalPrice - product.price).toFixed(2)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/products"
            className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors duration-300"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}
