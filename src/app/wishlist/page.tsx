import { Metadata } from 'next';
import WishlistClient from './WishlistClient';

export const metadata: Metadata = {
  title: 'My Wishlist | LuxeAura Premium Luxury Shopping',
  description: 'View your saved luxury items at LuxeAura. Keep track of the premium fashion, ethical wear, and home decor pieces you love.',
  openGraph: {
    title: 'Your LuxeAura Wishlist',
    description: 'A curated selection of luxury items you have saved for later. Start building your perfect collection.',
    type: 'website',
  },
};

export default function WishlistPage() {
  return <WishlistClient />;
}
