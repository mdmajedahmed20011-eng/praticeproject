import { Metadata } from 'next';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
  title: 'Contact Us | LuxeAura Premium Luxury Support',
  description: 'Reach out to the LuxeAura team. We are here to help with your orders, inquiries, or any luxury styling advice. Available Monday to Saturday.',
  openGraph: {
    title: 'Get in Touch with LuxeAura',
    description: 'Find our showroom location, contact details, and working hours. Send us a message and we will respond within 24 hours.',
    type: 'website',
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
