'use client';

import { useState } from 'react';
import { EnvelopeIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubscribed(true);
      setIsLoading(false);
      setEmail('');
    }, 1000);
  };

  return (
    <section className="py-16 bg-gradient-to-br from-blue-600 to-purple-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Stay Updated with Our Latest Deals
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Subscribe to our newsletter and be the first to know about exclusive offers, 
              new arrivals, and special discounts!
            </p>

            {isSubscribed ? (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-auto">
                <CheckCircleIcon className="h-16 w-16 text-green-400 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-white mb-2">
                  Thank You!
                </h3>
                <p className="text-blue-100">
                  You&apos;ve successfully subscribed to our newsletter. 
                  Check your inbox for a welcome email!
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      required
                      className="w-full pl-10 pr-4 py-3 bg-white/90 backdrop-blur-sm rounded-full border-0 focus:ring-2 focus:ring-yellow-400 focus:outline-none text-gray-900"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-yellow-400 text-gray-900 px-8 py-3 rounded-full font-semibold hover:bg-yellow-300 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Subscribing...' : 'Subscribe'}
                  </button>
                </div>
              </form>
            )}

            <div className="mt-8 text-center">
              <p className="text-sm text-blue-100">
                By subscribing, you agree to our{' '}
                <a href="/privacy" className="underline hover:text-white transition-colors">
                  Privacy Policy
                </a>{' '}
                and{' '}
                <a href="/terms" className="underline hover:text-white transition-colors">
                  Terms of Service
                </a>
              </p>
            </div>

            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-white mb-2">10K+</div>
                <div className="text-blue-100">Happy Customers</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-2">5K+</div>
                <div className="text-blue-100">Products</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-2">99%</div>
                <div className="text-blue-100">Satisfaction Rate</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-2">24/7</div>
                <div className="text-blue-100">Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
