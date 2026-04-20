import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import CartDrawer from '@/components/CartDrawer/CartDrawer';
import ScrollToTop from '@/components/ScrollToTop/ScrollToTop';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'LUXEAURA | Premium Luxury Fashion & Lifestyle',
  description: 'Discover curated collections of premium fashion, ethnic wear, home decor, and luxury lifestyle products. Free shipping on orders over ৳5000.',
  keywords: ['luxury fashion', 'premium clothing', 'ethnic wear', 'home decor', 'LuxeAura'],
  openGraph: {
    title: 'LUXEAURA | Premium Luxury Fashion & Lifestyle',
    description: 'Discover curated collections of premium fashion, ethnic wear, home decor, and luxury lifestyle products.',
    type: 'website',
    siteName: 'LuxeAura',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className={inter.className}>
        <WishlistProvider>
          <CartProvider>
            <Navbar />
            <CartDrawer />
            <main>{children}</main>
            <Footer />
            <ScrollToTop />
          </CartProvider>
        </WishlistProvider>
      </body>
    </html>
  );
}
