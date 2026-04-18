import Hero from '@/components/Home/Hero';
import Categories from '@/components/Home/Categories';
import PromoBanners from '@/components/Home/PromoBanners';
import NewArrivals from '@/components/Home/NewArrivals';
import Newsletter from '@/components/Home/Newsletter';

export default function Home() {
  return (
    <main>
      <Hero />
      <Categories />
      <PromoBanners />
      <NewArrivals />
      <Newsletter />
    </main>
  );
}
