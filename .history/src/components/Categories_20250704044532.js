import Link from 'next/link';
import Image from 'next/image';

export default function Categories() {
  const categories = [
    {
      id: 'electronics',
      name: 'Electronics',
      description: 'Latest gadgets and tech',
      image: '/category-electronics.jpg',
      href: '/category/electronics',
      bgColor: 'bg-blue-500',
      count: '1,234 items'
    },
    {
      id: 'clothing',
      name: 'Clothing',
      description: 'Fashion for everyone',
      image: '/category-clothing.jpg',
      href: '/category/clothing',
      bgColor: 'bg-pink-500',
      count: '2,567 items'
    },
    {
      id: 'home',
      name: 'Home & Garden',
      description: 'Transform your space',
      image: '/category-home.jpg',
      href: '/category/home-garden',
      bgColor: 'bg-green-500',
      count: '1,890 items'
    },
    {
      id: 'sports',
      name: 'Sports & Outdoors',
      description: 'Active lifestyle gear',
      image: '/category-sports.jpg',
      href: '/category/sports',
      bgColor: 'bg-orange-500',
      count: '987 items'
    },
    {
      id: 'books',
      name: 'Books & Media',
      description: 'Knowledge and entertainment',
      image: '/category-books.jpg',
      href: '/category/books',
      bgColor: 'bg-purple-500',
      count: '3,456 items'
    },
    {
      id: 'beauty',
      name: 'Beauty & Health',
      description: 'Look and feel great',
      image: '/category-beauty.jpg',
      href: '/category/beauty',
      bgColor: 'bg-red-500',
      count: '1,567 items'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Shop by Category
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our wide range of products across different categories
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={category.href}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <div className="aspect-w-16 aspect-h-10 relative">
                <div className={`${category.bgColor} h-48 opacity-80 relative`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/30"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                    <p className="text-sm opacity-90 mb-1">{category.description}</p>
                    <p className="text-xs opacity-75">{category.count}</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
              
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/categories"
            className="inline-flex items-center justify-center px-8 py-3 bg-gray-900 text-white font-semibold rounded-full hover:bg-gray-800 transition-colors duration-300"
          >
            View All Categories
          </Link>
        </div>
      </div>
    </section>
  );
}
