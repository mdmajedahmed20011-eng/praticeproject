import Hero from '@/components/Home/Hero';
import Categories from '@/components/Home/Categories';
import PromoBanners from '@/components/Home/PromoBanners';
import NewArrivals from '@/components/Home/NewArrivals';
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

  try {
    const dbSettings = await prisma.siteSetting.findUnique({ where: { id: "global" } });
    if (dbSettings) settings = dbSettings;
  } catch (error) {
    console.error('[HOME_SETTINGS_READ]', error);
  }

  if (settings.maintenanceMode) {
    return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <h1>We are currently down for maintenance. Check back shortly.</h1>
    </div>;
  }

  return (
    <main>
      <Hero settings={settings} />
      <Categories />
      {settings.showFlashSale && <PromoBanners />}
      {settings.showBestSellers && <NewArrivals />}
      <Newsletter />
    </main>
  );
}
