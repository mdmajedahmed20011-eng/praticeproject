import { Metadata } from 'next';
import AboutClient from './AboutClient';

export const metadata: Metadata = {
  title: 'Our Story | LuxeAura Luxury Fashion',
  description: 'Learn about the LuxeAura journey. Founded in 2014, we are committed to preserving traditional craftsmanship while delivering a modern, premium luxury experience.',
  openGraph: {
    title: 'Defining Luxury - The LuxeAura Story',
    description: 'Explore our mission to craft elegance and define luxury through artisan partnerships and uncompromising quality.',
    type: 'website',
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
