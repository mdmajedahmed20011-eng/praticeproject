'use client';

import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';
import ProductCard from '../ProductCard/ProductCard';
import styles from './RecentlyViewed.module.css';

export default function RecentlyViewed() {
  const { viewedItems } = useRecentlyViewed();

  if (viewedItems.length === 0) return null;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Recently Viewed</h2>
      <div className={styles.grid}>
        {viewedItems.map((product) => (
          <ProductCard key={`recent-${product.id}`} product={product} />
        ))}
      </div>
    </div>
  );
}
