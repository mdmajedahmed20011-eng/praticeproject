import Hero from '@/components/Home/Hero';
import TrustBadges from '@/components/Home/TrustBadges';
import TrendingNow from '@/components/Home/TrendingNow';
import Categories from '@/components/Home/Categories';
import BrandStory from '@/components/Home/BrandStory';
import PromoBanners from '@/components/Home/PromoBanners';
import NewArrivals from '@/components/Home/NewArrivals';
import Testimonials from '@/components/Home/Testimonials';
import InstagramFeed from '@/components/Home/InstagramFeed';
import Newsletter from '@/components/Home/Newsletter';
import { connection } from 'next/server';
import { prisma } from '@/lib/prisma';

export default async function Home() {
  await connection();
  const fallbackSettings = {
    heroHeadline: "Elevate Your Style",
    heroSubheadline: "Discover the 2026 Premium Collection",
    heroImage: "https://images.unsplash.com/photo-1596755094514-f87e32f6b717?w=1200",
    heroButtonText: "Shop Now",
    heroButtonLink: "/collections",
    showFlashSale: true,
    showBestSellers: true,
    maintenanceMode: false
  };
  let settings = fallbackSettings;
  let trendingProducts: any[] = [];
  let newArrivals: any[] = [];

  try {
    const dbSettings = await prisma.siteSetting.findUnique({ where: { id: "global" } });
    if (dbSettings) settings = dbSettings;

    // Fetch Real Products
    const [trendingDb, arrivalsDb] = await Promise.all([
      prisma.product.findMany({
        where: { isFeatured: true, isDraft: false },
        take: 8,
        orderBy: { updatedAt: 'desc' }
      }),
      prisma.product.findMany({
        where: { isDraft: false },
        take: 4,
        orderBy: { createdAt: 'desc' }
      })
    ]);

    const parseJsonSafely = (str: string | null, fallback: any = []) => {
      if (!str) return fallback;
      try {
        const parsed = JSON.parse(str);
        return Array.isArray(parsed) ? parsed : [parsed];
      } catch (e) {
        return fallback;
      }
    };

    trendingProducts = trendingDb.map(p => ({
      ...p,
      image: parseJsonSafely(p.images, ["https://images.unsplash.com/photo-1596755094514-f87e32f6b717?w=800"])[0],
      colors: parseJsonSafely(p.colors),
      sizes: parseJsonSafely(p.sizes)
    }));

    newArrivals = arrivalsDb.map(p => ({
      ...p,
      image: parseJsonSafely(p.images, ["https://images.unsplash.com/photo-1596755094514-f87e32f6b717?w=800"])[0],
      colors: parseJsonSafely(p.colors),
      sizes: parseJsonSafely(p.sizes)
    }));

  } catch (error) {
    console.error('[HOME_DATA_FETCH_FAILED]', error);
  }

  if (settings.maintenanceMode) {
    return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <h1>We are currently down for maintenance. Check back shortly.</h1>
    </div>;
  }

  return (
    <main>
      <Hero settings={settings} />
      <TrustBadges />
      <TrendingNow products={trendingProducts} />
      <Categories />
      <BrandStory />
      {settings.showFlashSale && <PromoBanners />}
      <NewArrivals products={newArrivals} />
      <Testimonials />
      <InstagramFeed />
      <Newsletter />
    </main>
  );
}
