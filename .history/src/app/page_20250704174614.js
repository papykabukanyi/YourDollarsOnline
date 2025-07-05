import Header from '../components/Header';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import FeaturedProducts from '../components/FeaturedProducts';
import Categories from '../components/Categories';
import Newsletter from '../components/Newsletter';
import Providers from '../components/Providers';

export default function Home() {
  return (
    <Providers>
      <div className="min-h-screen bg-gray-50">
        {/* Desktop Header - Hidden on mobile */}
        <div className="hidden lg:block">
          <Header />
        </div>
        
        <main className="pb-16 lg:pb-0">
          <Hero />
          <Categories />
          <FeaturedProducts />
          <Newsletter />
        </main>
        
        {/* Desktop Footer - Hidden on mobile */}
        <div className="hidden lg:block">
          <Footer />
        </div>
        
        {/* Mobile Footer - Simplified */}
        <div className="lg:hidden bg-white border-t border-gray-200 p-4 text-center text-sm text-gray-600 mb-16">
          <p>&copy; 2025 YourDollarsOnline. All rights reserved.</p>
        </div>
      </div>
    </Providers>
  );
}
