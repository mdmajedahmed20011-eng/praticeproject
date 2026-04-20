'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, User, ShoppingBag, Menu, X, Heart, ChevronDown } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import styles from './Navbar.module.css';

const navCategories = [
  { 
    label: 'New In', 
    href: '/collections',
    featured: [
      { title: 'Spring Collection', image: 'https://images.unsplash.com/photo-1596755094514-f87e32f6b717?w=400&q=80', href: '/collections' },
      { title: 'Editor\'s Picks', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&q=80', href: '/collections' },
    ],
    links: ['Just Landed', 'Trending Now', 'Back In Stock', 'Exclusive Online']
  },
  { 
    label: 'Women', 
    href: '/collections',
    featured: [
      { title: 'Ethnic Elegance', image: 'https://images.unsplash.com/photo-1583391733958-69213190fc53?w=400&q=80', href: '/collections' },
      { title: 'Western Wear', image: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=400&q=80', href: '/collections' },
    ],
    links: ['Sarees', 'Kurtis', 'Lehengas', 'Dresses', 'Tops & Tunics']
  },
  { 
    label: 'Men', 
    href: '/collections',
    featured: [
      { title: 'Formal Edit', image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400&q=80', href: '/collections' },
      { title: 'Sherwani Collection', image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&q=80', href: '/collections' },
    ],
    links: ['Panjabi', 'Shirts', 'T-shirts', 'Pants', 'Sherwanis']
  },
  { label: 'Kids', href: '/collections' },
  { label: 'Home & Decor', href: '/collections' },
  { label: 'Beauty', href: '/collections' },
  { label: 'Sale', href: '/collections', isSale: true },
];

const announcements = [
  'FREE SHIPPING ON ORDERS OVER ৳5,000',
  'NEW ARRIVALS — SPRING 2026 COLLECTION IS HERE',
  'USE CODE LUXE20 FOR 20% OFF YOUR FIRST ORDER',
];

export default function Navbar() {
  const { cartCount, openCart } = useCart();
  const { wishlistCount } = useWishlist();
  const [scrolled, setScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [announcementIdx, setAnnouncementIdx] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const menuTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Announcement rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setAnnouncementIdx((prev) => (prev + 1) % announcements.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleMenuEnter = (idx: number) => {
    if (menuTimeoutRef.current) clearTimeout(menuTimeoutRef.current);
    setActiveMenu(idx);
  };

  const handleMenuLeave = () => {
    menuTimeoutRef.current = setTimeout(() => setActiveMenu(null), 200);
  };

  return (
    <>
      <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
        {/* Announcement Bar */}
        <div className={styles.announcement}>
          <div className={styles.announcementLeft}>
            <Link href="/contact">Store Locator</Link>
            <Link href="/collections">Track Order</Link>
          </div>
          <div className={styles.announcementCenter}>
            <span key={announcementIdx} className={styles.announcementText}>
              {announcements[announcementIdx]}
            </span>
          </div>
          <div className={styles.announcementRight}>
            <span>BDT (৳)</span>
            <span>ENGLISH</span>
          </div>
        </div>

        {/* Main Navbar */}
        <nav className={styles.navContainer}>
          {/* Mobile Menu Toggle */}
          <button 
            className={styles.mobileMenuBtn} 
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={24} strokeWidth={1.5} />
          </button>

          {/* Logo */}
          <Link href="/" className={styles.logo}>
            LUXE<span>AURA</span>
          </Link>

          {/* Desktop Navigation */}
          <div className={styles.navLinks}>
            {navCategories.map((cat, idx) => (
              <div
                key={cat.label}
                className={styles.navLinkWrapper}
                onMouseEnter={() => cat.featured ? handleMenuEnter(idx) : undefined}
                onMouseLeave={cat.featured ? handleMenuLeave : undefined}
              >
                <Link 
                  href={cat.href} 
                  className={`${styles.navLink} ${cat.isSale ? styles.saleLink : ''}`}
                >
                  {cat.label}
                  {cat.featured && <ChevronDown size={12} className={styles.chevron} />}
                </Link>
              </div>
            ))}
          </div>

          {/* Icons */}
          <div className={styles.navIcons}>
            <button className={styles.iconButton} onClick={() => setSearchOpen(true)} aria-label="Search">
              <Search size={20} strokeWidth={1.5} />
            </button>
            <Link href="/wishlist" className={styles.iconButton} aria-label="Wishlist" style={{ position: 'relative' }}>
              <Heart size={20} strokeWidth={1.5} />
              {wishlistCount > 0 && (
                <span className={styles.badge}>{wishlistCount}</span>
              )}
            </Link>
            <Link href="/login" className={styles.iconButton} aria-label="Account">
              <User size={20} strokeWidth={1.5} />
            </Link>
            <button className={styles.iconButton} onClick={openCart} aria-label="Cart" style={{ position: 'relative' }}>
              <ShoppingBag size={20} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className={styles.badge}>{cartCount}</span>
              )}
            </button>
          </div>
        </nav>

        {/* Mega Menu Dropdown */}
        {activeMenu !== null && navCategories[activeMenu]?.featured && (
          <div 
            className={styles.megaMenu}
            onMouseEnter={() => { if (menuTimeoutRef.current) clearTimeout(menuTimeoutRef.current); }}
            onMouseLeave={handleMenuLeave}
          >
            <div className={styles.megaMenuInner}>
              <div className={styles.megaMenuFeatured}>
                {navCategories[activeMenu].featured!.map((item) => (
                  <Link href={item.href} key={item.title} className={styles.megaFeaturedCard}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.image} alt={item.title} />
                    <span>{item.title}</span>
                  </Link>
                ))}
              </div>
              <div className={styles.megaMenuLinks}>
                <h4>Categories</h4>
                <ul>
                  {navCategories[activeMenu].links!.map((link) => (
                    <li key={link}><Link href="/collections">{link}</Link></li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Search Overlay */}
      {searchOpen && (
        <div className={styles.searchOverlay} onClick={() => setSearchOpen(false)}>
          <div className={styles.searchContainer} onClick={(e) => e.stopPropagation()}>
            <div className={styles.searchHeader}>
              <Search size={24} strokeWidth={1.5} className={styles.searchIcon} />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search for products, collections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    setSearchOpen(false);
                    window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
                  }
                }}
              />
              <button onClick={() => setSearchOpen(false)} className={styles.searchClose}>
                <X size={24} />
              </button>
            </div>
            <div className={styles.searchSuggestions}>
              <p className={styles.searchLabel}>Popular Searches</p>
              <div className={styles.searchTags}>
                {['Saree', 'Kurti', 'Sherwani', 'Home Decor', 'New Arrivals', 'Sale'].map((tag) => (
                  <Link
                    key={tag}
                    href={`/search?q=${encodeURIComponent(tag)}`}
                    className={styles.searchTag}
                    onClick={() => setSearchOpen(false)}
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className={styles.mobileOverlay} onClick={() => setMobileOpen(false)}>
          <div className={styles.mobileDrawer} onClick={(e) => e.stopPropagation()}>
            <div className={styles.mobileDrawerHeader}>
              <span className={styles.mobileDrawerLogo}>LUXE<span>AURA</span></span>
              <button onClick={() => setMobileOpen(false)} aria-label="Close menu">
                <X size={24} />
              </button>
            </div>
            <nav className={styles.mobileNav}>
              {navCategories.map((cat) => (
                <Link
                  key={cat.label}
                  href={cat.href}
                  className={`${styles.mobileNavLink} ${cat.isSale ? styles.saleLink : ''}`}
                  onClick={() => setMobileOpen(false)}
                >
                  {cat.label}
                </Link>
              ))}
            </nav>
            <div className={styles.mobileDrawerFooter}>
              <Link href="/login" onClick={() => setMobileOpen(false)} className={styles.mobileFooterLink}>
                <User size={18} /> My Account
              </Link>
              <Link href="/wishlist" onClick={() => setMobileOpen(false)} className={styles.mobileFooterLink}>
                <Heart size={18} /> Wishlist ({wishlistCount})
              </Link>
              <Link href="/contact" onClick={() => setMobileOpen(false)} className={styles.mobileFooterLink}>
                <Search size={18} /> Store Locator
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
