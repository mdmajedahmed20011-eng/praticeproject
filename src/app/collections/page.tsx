'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SlidersHorizontal, X } from 'lucide-react';
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
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  // All colors present in mock data
  const availableColors = ['#ffffff', '#000000', '#4ade80', '#67e8f9', '#f87171', '#d1d5db', '#ea580c', '#9ca3af', '#4b5563', '#6b7280'];

  const filterData = (data: any[]) => {
    if (!activeFilter) return data;
    return data.filter(item => item.colors && item.colors.includes(activeFilter));
  };

  const filteredEthnic = filterData(ethnicData);
  const filteredCasual = filterData(casualData);
  const filteredExecutive = filterData(executiveData);

  return (
    <div className={styles.collectionPage}>
      
      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <Link href="/">Home</Link> / <Link href="/men">Men</Link> / <span>Shirts</span>
      </div>

      <div className={styles.filterBar}>
        <button className={`${styles.filterBtn} ${activeFilter ? styles.active : ''}`} onClick={() => setActiveFilter(null)}>
          <SlidersHorizontal size={14} /> {activeFilter ? 'Clear Filter' : 'All Colors'}
        </button>
      </div>

      {/* Active Color Swatches Banner */}
      <div style={{ display: 'flex', gap: '10px', padding: '10px 20px', overflowX: 'auto', marginBottom: '20px' }}>
        {availableColors.map(color => (
          <button 
            key={color} 
            className={activeFilter === color ? styles.activeSwatch : styles.swatchBtn}
            style={{ 
              backgroundColor: color, 
              width: 30, height: 30, borderRadius: '50%', 
              border: activeFilter === color ? '2px solid #111' : '1px solid #ddd',
              cursor: 'pointer'
            }}
            onClick={() => setActiveFilter(color === activeFilter ? null : color)}
            title="Filter by color"
          />
        ))}
      </div>

      {/* ETHNIC Section */}
      <section>
        <div className={styles.sectionHeader}>
          <h2>ETHNIC</h2>
          <Link href="#" className={styles.viewAll}>View All</Link>
        </div>
        <div className={styles.productGrid}>
          {filteredEthnic.length > 0 ? filteredEthnic.map((item) => (
            <ProductCard key={item.id} product={item} />
          )) : <p style={{ gridColumn: '1 / -1', padding: '20px', color: '#666' }}>No products match this color.</p>}
        </div>
      </section>

      {/* CASUAL Section */}
      <section>
        <div className={styles.sectionHeader}>
          <h2>CASUAL</h2>
          <Link href="#" className={styles.viewAll}>View All</Link>
        </div>
        <div className={styles.productGrid}>
          {filteredCasual.length > 0 ? filteredCasual.map((item) => (
            <ProductCard key={item.id} product={item} />
          )) : <p style={{ gridColumn: '1 / -1', padding: '20px', color: '#666' }}>No products match this color.</p>}
        </div>
      </section>

      {/* EXECUTIVE Section */}
      <section>
        <div className={styles.sectionHeader}>
          <h2>EXECUTIVE</h2>
          <Link href="#" className={styles.viewAll}>View All</Link>
        </div>
        <div className={styles.productGrid}>
          {filteredExecutive.length > 0 ? filteredExecutive.map((item) => (
            <ProductCard key={item.id} product={item} />
          )) : <p style={{ gridColumn: '1 / -1', padding: '20px', color: '#666' }}>No products match this color.</p>}
        </div>
      </section>

    </div>
  );
}
