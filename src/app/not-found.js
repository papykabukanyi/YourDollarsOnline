import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-white opacity-20 mb-4">404</h1>
          <h2 className="text-4xl font-bold text-white mb-4">Page Not Found</h2>
          <p className="text-xl text-blue-100 mb-8">
            Sorry, we couldn&apos;t find the page you&apos;re looking for.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center w-full bg-white text-gray-900 py-3 px-6 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-200"
          >
            Go to Homepage
          </Link>
          
          <Link
            href="/products"
            className="inline-flex items-center justify-center w-full bg-transparent border-2 border-white text-white py-3 px-6 rounded-full font-semibold hover:bg-white hover:text-gray-900 transition-colors duration-200"
          >
            Browse Products
          </Link>
        </div>

        <div className="mt-12 text-center">
          <div className="text-2xl font-bold text-white mb-2">
            <span className="text-yellow-300">Your</span>
            <span className="text-white">Dollars</span>
            <span className="text-green-300">Online</span>
          </div>
          <p className="text-blue-100 text-sm">
            Premium E-commerce Store
          </p>
        </div>
      </div>
    </div>
  );
}
