'use client';

import { Heart, Eye } from 'lucide-react';
import styles from './ProductCard.module.css';

export interface ProductProps {
  id: string;
  title: string;
  price: number;
  image: string;
  colors?: string[];
}

export default function ProductCard({ product }: { product: ProductProps }) {
  return (
    <div className={styles.productCard}>
      <div className={styles.imageWrapper}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={product.image} 
          alt={product.title} 
          className={styles.productImage} 
        />
        
        {/* Wishlist Heart Icon */}
        <button className={styles.heartIcon} aria-label="Add to wishlist">
          <Heart size={20} strokeWidth={1.5} />
        </button>

        {/* Quick View Button */}
        <button className={styles.quickViewBtn}>
          <Eye size={16} strokeWidth={1.5} />
          QUICK VIEW
        </button>
      </div>

      <div className={styles.details}>
        <h3 className={styles.title}>{product.title}</h3>
        <p className={styles.price}>Tk {product.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
        
        {/* Color Swatches */}
        {product.colors && product.colors.length > 0 && (
          <div className={styles.swatches}>
            {product.colors.map((color, index) => (
              <div 
                key={index} 
                className={styles.swatch} 
                style={{ backgroundColor: color }} 
                title={color}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
