'use client';

import Link from 'next/link';
import { MapPin, Phone, Mail, ArrowUp, Camera, Globe, Share2, Music } from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className={styles.footer}>
      {/* Main Footer Grid */}
      <div className={styles.grid}>
        <div className={styles.brandInfo}>
          <Link href="/" className={styles.logo}>
            LUXE<span>AURA</span>
          </Link>
          <p className={styles.brandDescription}>
            Redefining luxury fashion and lifestyle since 2014. Explore our curated collections of premium ethnic wear, contemporary fashion, and exquisite home décor.
          </p>
          <div className={styles.socialLinks}>
            <a href="#" className={styles.socialIcon} aria-label="Instagram"><Camera size={18} /></a>
            <a href="#" className={styles.socialIcon} aria-label="Facebook"><Globe size={18} /></a>
            <a href="#" className={styles.socialIcon} aria-label="Twitter"><Share2 size={18} /></a>
            <a href="#" className={styles.socialIcon} aria-label="YouTube"><Music size={18} /></a>
          </div>
        </div>

        <div className={styles.column}>
          <h4>Shop</h4>
          <ul className={styles.linkList}>
            <li><Link href="/collections">New Arrivals</Link></li>
            <li><Link href="/collections">Women&apos;s Collection</Link></li>
            <li><Link href="/collections">Men&apos;s Collection</Link></li>
            <li><Link href="/collections">Home Decor</Link></li>
            <li><Link href="/collections">Festive Wear</Link></li>
            <li><Link href="/collections">Sale</Link></li>
          </ul>
        </div>

        <div className={styles.column}>
          <h4>Customer Care</h4>
          <ul className={styles.linkList}>
            <li><Link href="/contact">Contact Us</Link></li>
            <li><Link href="/about">About Us</Link></li>
            <li><Link href="#">Shipping & Returns</Link></li>
            <li><Link href="#">Track Order</Link></li>
            <li><Link href="#">Size Guide</Link></li>
            <li><Link href="#">FAQs</Link></li>
          </ul>
        </div>

        <div className={styles.column}>
          <h4>Get In Touch</h4>
          <div className={styles.contactList}>
            <div className={styles.contactItem}>
              <MapPin size={16} />
              <span>Gulshan 2, Dhaka 1212, Bangladesh</span>
            </div>
            <div className={styles.contactItem}>
              <Phone size={16} />
              <span>+880 1700-000000</span>
            </div>
            <div className={styles.contactItem}>
              <Mail size={16} />
              <span>support@luxeaura.com</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className={styles.paymentSection}>
        <span className={styles.paymentLabel}>We Accept</span>
        <div className={styles.paymentIcons}>
          <span className={styles.paymentBadge}>VISA</span>
          <span className={styles.paymentBadge}>MASTERCARD</span>
          <span className={styles.paymentBadge}>bKash</span>
          <span className={styles.paymentBadge}>Nagad</span>
          <span className={styles.paymentBadge}>COD</span>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={styles.bottom}>
        <p>© {new Date().getFullYear()} LuxeAura. All rights reserved. Crafted with ♥ in Bangladesh.</p>
        <div className={styles.bottomLinks}>
          <Link href="#">Privacy Policy</Link>
          <Link href="#">Terms & Conditions</Link>
          <Link href="#">Cookie Policy</Link>
        </div>
        <button className={styles.backToTop} onClick={scrollToTop} aria-label="Back to top">
          <ArrowUp size={16} />
        </button>
      </div>
    </footer>
  );
}
