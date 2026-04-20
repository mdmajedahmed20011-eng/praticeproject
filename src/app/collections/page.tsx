import { Metadata } from 'next';
import CollectionsClient from './CollectionsClient';

export const metadata: Metadata = {
  title: 'Our Collections | LuxeAura Premium Luxury',
  description: 'Explore the curated luxury collections at LuxeAura. From traditional ethnic wear to modern premium fashion and high-end home decor.',
  openGraph: {
    title: 'LuxeAura Luxury Collections',
    description: 'Discover craftsmanship and elegance in every piece. Shop our exclusive seasonal collections.',
    type: 'website',
  },
};

export default function CollectionsPage() {
  return <CollectionsClient />;
}
