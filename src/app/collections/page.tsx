'use client';

import Link from 'next/link';
import { SlidersHorizontal } from 'lucide-react';
import ProductCard from '../../components/ProductCard/ProductCard';
import styles from './page.module.css';

// Mock data structured similarly to the screenshot
const ethnicData = [
  { id: 'e1', title: 'White/Green Printed Cotton Shirt', price: 854.55, image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=500&q=80', colors: ['#4ade80', '#ffffff'] },
  { id: 'e2', title: 'Light Cyan Printed Cotton Shirt', price: 1109.09, image: 'https://images.unsplash.com/photo-1596755094514-f87e32f6b717?w=500&q=80', colors: ['#67e8f9'] },
  { id: 'e3', title: 'Light Cyan Printed Cotton Shirt', price: 863.64, image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500&q=80', colors: ['#f87171', '#d1d5db', '#000000'] },
  { id: 'e4', title: 'White Printed Cotton Shirt', price: 896.45, image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=500&q=80', colors: [] },
];

const casualData = [
  { id: 'c1', title: 'White/Blue Striped Custom Fitted Shirt', price: 1536.36, image: 'https://images.unsplash.com/photo-1620012253295-c159ce22378cd?w=500&q=80', colors: [] },
  { id: 'c2', title: 'White/Purple Textured Custom Fitted Shirt', price: 1540.91, image: 'https://images.unsplash.com/photo-1598032895397-b9472444bf93?w=500&q=80', colors: [] },
  { id: 'c3', title: 'Khaki Cotton Fitted Shirt', price: 1568.18, image: 'https://images.unsplash.com/photo-1593998066526-65fcab3021a2?w=500&q=80', colors: ['#ea580c', '#9ca3af', '#4b5563'] },
  { id: 'c4', title: 'Multicolour Printed Cotton Fitted Shirt', price: 1004.55, image: 'https://images.unsplash.com/photo-1578932750294-f5075e85f44a?w=500&q=80', colors: [] },
];

const executiveData = [
  { id: 'x1', title: 'Navy Blue/Red Check Executive Shirt', price: 2131.82, image: 'https://images.unsplash.com/photo-1588359348347-9bc6cbbb689e?w=500&q=80', colors: [] },
  { id: 'x2', title: 'Green Check Executive Shirt', price: 2245.45, image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=500&q=80', colors: [] },
  { id: 'x3', title: 'White/Blue Check Executive Shirt', price: 1713.64, image: 'https://images.unsplash.com/photo-1596755094514-f87e32f6b717?w=500&q=80', colors: ['#ea580c', '#6b7280', '#000000'] },
  { id: 'x4', title: 'Blue Check Executive Shirt', price: 2245.45, image: 'https://images.unsplash.com/photo-1620012253295-c159ce22378cd?w=500&q=80', colors: [] },
];

export default function CollectionsPage() {
  return (
    <div className={styles.collectionPage}>
      
      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <Link href="/">Home</Link> / <Link href="/men">Men</Link> / <span>Shirts</span>
      </div>

      {/* Filter Bar */}
      <div className={styles.filterBar}>
        <button className={`${styles.filterBtn} ${styles.active}`}>
          <SlidersHorizontal size={14} /> Filters
        </button>
        <button className={styles.filterBtn}>Categories</button>
        <button className={styles.filterBtn}>Colour</button>
        <button className={styles.filterBtn}>Fabric</button>
        <button className={styles.filterBtn}>Price</button>
        <button className={styles.filterBtn}>Size</button>
        <button className={styles.filterBtn}>Cut / Fit</button>
      </div>

      {/* ETHNIC Section */}
      <section>
        <div className={styles.sectionHeader}>
          <h2>ETHNIC</h2>
          <Link href="#" className={styles.viewAll}>View All</Link>
        </div>
        <div className={styles.productGrid}>
          {ethnicData.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>

      {/* CASUAL Section */}
      <section>
        <div className={styles.sectionHeader}>
          <h2>CASUAL</h2>
          <Link href="#" className={styles.viewAll}>View All</Link>
        </div>
        <div className={styles.productGrid}>
          {casualData.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>

      {/* EXECUTIVE Section */}
      <section>
        <div className={styles.sectionHeader}>
          <h2>EXECUTIVE</h2>
          <Link href="#" className={styles.viewAll}>View All</Link>
        </div>
        <div className={styles.productGrid}>
          {executiveData.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>

    </div>
  );
}
