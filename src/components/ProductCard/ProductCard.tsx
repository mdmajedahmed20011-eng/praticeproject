'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Heart, Eye } from 'lucide-react';
import QuickViewModal from '../QuickViewModal/QuickViewModal';
import styles from './ProductCard.module.css';

export interface ProductProps {
  id: string;
  title: string;
  price: number;
  image: string;
  colors?: string[];
}

export default function ProductCard({ product }: { product: ProductProps }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsModalOpen(true);
  };

  return (
    <>
      <div className={styles.productCard}>
        <Link href={`/product/${product.id}`} className={styles.imageWrapper} style={{ display: 'block' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={product.image} 
            alt={product.title} 
            className={styles.productImage} 
          />
          
          {/* Wishlist Heart Icon */}
          <button className={styles.heartIcon} aria-label="Add to wishlist" onClick={(e) => e.preventDefault()}>
            <Heart size={20} strokeWidth={1.5} />
          </button>

          {/* Quick View Button */}
          <button className={styles.quickViewBtn} onClick={handleQuickView}>
            <Eye size={16} strokeWidth={1.5} />
            QUICK VIEW
          </button>
        </Link>

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

      <QuickViewModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={product}
      />
    </>
  );
}
