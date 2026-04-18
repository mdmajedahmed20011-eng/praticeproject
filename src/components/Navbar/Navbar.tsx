'use client';

import Link from 'next/link';
import { Search, User, ShoppingBag, Menu } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { cartCount, openCart } = useCart();

  return (
    <header className={styles.header}>
      {/* Announcement Bar */}
      <div className={styles.announcement}>
        <div className={styles.announcementLeft}>
          <Link href="#">Store Locator</Link>
          <Link href="#">Track Order</Link>
        </div>
        <div className={styles.announcementCenter}>
          FREE SHIPPING ON ORDERS OVER ৳5000
        </div>
        <div className={styles.announcementRight}>
          <span>BDT (৳)</span>
          <span>ENGLISH</span>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className={styles.navContainer}>
        {/* Mobile Menu Icon (Placeholder for now) */}
        <button className={`${styles.iconButton} md:hidden`} style={{ display: 'none' }} aria-label="Menu">
          <Menu size={24} strokeWidth={1.5} />
        </button>

        {/* Logo */}
        <Link href="/" className={styles.logo}>
          LUXE<span>AURA</span>
        </Link>

        {/* Navigation Links */}
        <div className={styles.navLinks}>
          <Link href="/collections" className={styles.navLink}>New In</Link>
          <Link href="/collections" className={styles.navLink}>Women</Link>
          <Link href="/collections" className={styles.navLink}>Men</Link>
          <Link href="/collections" className={styles.navLink}>Kids</Link>
          <Link href="/collections" className={styles.navLink}>Home & Decor</Link>
          <Link href="/collections" className={styles.navLink}>Beauty</Link>
          <Link href="/sale" className={styles.navLink} style={{ color: '#d32f2f' }}>Sale</Link>
        </div>

        {/* Icons */}
        <div className={styles.navIcons}>
          <button className={styles.iconButton} aria-label="Search">
            <Search size={22} strokeWidth={1.5} />
          </button>
          <button className={styles.iconButton} aria-label="Account">
            <User size={22} strokeWidth={1.5} />
          </button>
          <button className={styles.iconButton} aria-label="Cart" onClick={openCart} style={{ position: 'relative' }}>
            <ShoppingBag size={22} strokeWidth={1.5} />
            {cartCount > 0 && (
              <span className={styles.cartBadge}>{cartCount}</span>
            )}
          </button>
        </div>
      </nav>
    </header>
  );
}
