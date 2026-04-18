'use client';

import Link from 'next/link';
import { Instagram, Facebook, Linkedin, Youtube } from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.grid}>
        <div className={styles.brandInfo}>
          <Link href="/" className={styles.logo}>
            LUXE<span>AURA</span>
          </Link>
          <p className={styles.brandDescription}>
            Redefining luxury fashion and lifestyle. Explore our curated collections of premium ethnic wear and exquisite home decor.
          </p>
          <div className={styles.socialLinks}>
            <a href="#" className={styles.socialIcon}><Instagram size={20} /></a>
            <a href="#" className={styles.socialIcon}><Facebook size={20} /></a>
            <a href="#" className={styles.socialIcon}><Linkedin size={20} /></a>
            <a href="#" className={styles.socialIcon}><Youtube size={20} /></a>
          </div>
        </div>

        <div className={styles.column}>
          <h4>Shop</h4>
          <ul className={styles.linkList}>
            <li><Link href="#">New Arrivals</Link></li>
            <li><Link href="#">Women's Collection</Link></li>
            <li><Link href="#">Men's Collection</Link></li>
            <li><Link href="#">Home Decor</Link></li>
            <li><Link href="#">Festive Wear</Link></li>
          </ul>
        </div>

        <div className={styles.column}>
          <h4>Customer Care</h4>
          <ul className={styles.linkList}>
            <li><Link href="#">Contact Us</Link></li>
            <li><Link href="#">Shipping & Returns</Link></li>
            <li><Link href="#">Track Order</Link></li>
            <li><Link href="#">Size Guide</Link></li>
            <li><Link href="#">FAQs</Link></li>
          </ul>
        </div>

        <div className={styles.column}>
          <h4>About Us</h4>
          <ul className={styles.linkList}>
            <li><Link href="#">Our Story</Link></li>
            <li><Link href="#">Sustainability</Link></li>
            <li><Link href="#">Careers</Link></li>
            <li><Link href="#">Terms & Conditions</Link></li>
            <li><Link href="#">Privacy Policy</Link></li>
          </ul>
        </div>
      </div>
      
      <div className={styles.bottom}>
        © {new Date().getFullYear()} LuxeAura. All rights reserved.
      </div>
    </footer>
  );
}
