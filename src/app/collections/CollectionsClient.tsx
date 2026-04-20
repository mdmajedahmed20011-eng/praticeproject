'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { SlidersHorizontal } from 'lucide-react';
import ProductCard from '../../components/ProductCard/ProductCard';
import styles from './page.module.css';

interface Product {
  id: string;
  title: string;
  price: number;
  compareAtPrice?: number | null;
  stock: number;
  images: string[];
  colors: string[];
  collectionId: string;
  isDraft: boolean;
}

interface Collection {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
}

export default function CollectionsClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [prodRes, colRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/collections')
        ]);
        const prodData = await prodRes.json();
        const colData = await colRes.json();
        setProducts(prodData.filter((p: any) => !p.isDraft));
        setCollections(colData.filter((c: any) => c.isActive));
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const uniqueColors = Array.from(new Set(products.flatMap(p => p.colors || []))).filter(Boolean);

  const filterProducts = (collectionId: string) => {
    let filtered = products.filter(p => p.collectionId === collectionId);
    if (activeFilter) {
      filtered = filtered.filter(p => p.colors && p.colors.includes(activeFilter));
    }
    return filtered;
  };

  return (
    <div className={styles.collectionPage}>
      <div className={styles.breadcrumb}>
        <Link href="/">Home</Link> / <span>Collections</span>
      </div>

      <div className={styles.filterBar}>
        <button className={`${styles.filterBtn} ${activeFilter ? styles.active : ''}`} onClick={() => setActiveFilter(null)}>
          <SlidersHorizontal size={14} /> {activeFilter ? 'Clear Filter' : 'Filter by Color'}
        </button>
      </div>

      {uniqueColors.length > 0 && (
        <div style={{ display: 'flex', gap: '10px', padding: '10px 20px', overflowX: 'auto', marginBottom: '20px' }}>
          {uniqueColors.map((color: string) => {
            const isHex = color.startsWith('#');
            return (
              <button 
                key={color} 
                className={activeFilter === color ? styles.activeSwatch : styles.swatchBtn}
                style={{ 
                  backgroundColor: isHex ? color : color.toLowerCase(),
                  width: 30, height: 30, borderRadius: '50%', 
                  border: activeFilter === color ? '2px solid #111' : '1px solid #ddd',
                  cursor: 'pointer'
                }}
                onClick={() => setActiveFilter(color === activeFilter ? null : color)}
                title={`Filter by ${color}`}
              />
            );
          })}
        </div>
      )}

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}>Loading collections...</div>
      ) : collections.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}>No collections available.</div>
      ) : (
        collections.map(collection => {
          const colProducts = filterProducts(collection.id);
          
          return (
            <section key={collection.id}>
              <div className={styles.sectionHeader}>
                <h2>{collection.name.toUpperCase()}</h2>
                <Link href={`/collections/${collection.slug}`} className={styles.viewAll}>View All</Link>
              </div>
              <div className={styles.productGrid}>
                {colProducts.length > 0 ? colProducts.map((item) => (
                  <ProductCard 
                    key={item.id} 
                    product={{
                      id: item.id,
                      title: item.title,
                      price: item.price,
                      compareAtPrice: item.compareAtPrice || undefined,
                      stockStatus: item.stock < 5 ? 'low' : 'normal',
                      image: item.images[0] || '',
                      colors: item.colors
                    }} 
                  />
                )) : <p style={{ gridColumn: '1 / -1', padding: '20px', color: '#666' }}>No products available in this collection.</p>}
              </div>
            </section>
          );
        })
      )}
    </div>
  );
}
