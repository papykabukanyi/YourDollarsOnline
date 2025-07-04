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
        <Header />
        <main>
          <Hero />
          <Categories />
          <FeaturedProducts />
          <Newsletter />
        </main>
        <Footer />
      </div>
    </Providers>
  );
}
