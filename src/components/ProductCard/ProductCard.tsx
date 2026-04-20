'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Heart, Eye } from 'lucide-react';
import Image from 'next/image';
import QuickViewModal from '../QuickViewModal/QuickViewModal';
import { useCart, CartItem } from '@/context/CartContext';
import styles from './ProductCard.module.css';

export interface ProductProps {
  id: string;
  title: string;
  price: number;
  compareAtPrice?: number;
  stockStatus?: 'low' | 'normal';
  image: string;
  colors?: string[];
  sizes?: string[];
}

export default function ProductCard({ product }: { product: ProductProps }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToCart } = useCart();

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsModalOpen(true);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const cartItem: CartItem = {
      id: `${product.id}-${product.sizes?.[0] || 'S'}-${product.colors?.[0] || 'any'}`,
      productId: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      size: product.sizes?.[0] || 'Standard',
      color: product.colors?.[0] || 'Original',
      quantity: 1
    };

    addToCart(cartItem);
  };

  const discountPercentage = product.compareAtPrice 
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100) 
    : 0;

  return (
    <>
      <div className={styles.productCard}>
        <Link href={`/product/${product.id}`} className={styles.imageWrapper} style={{ display: 'block', position: 'relative' }}>
          {/* Sale Badge overlay */}
          {product.compareAtPrice && product.price < product.compareAtPrice && (
            <div className={styles.saleBadge}>Sale</div>
          )}

          <Image 
            src={product.image} 
            alt={product.title} 
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={styles.productImage} 
            style={{ objectFit: 'cover' }}
          />
          
          {/* Wishlist Heart Icon (Top Right) */}
          <button className={styles.heartIcon} aria-label="Add to wishlist" onClick={(e) => e.preventDefault()}>
            <Heart size={20} strokeWidth={1} />
          </button>

          {/* Quick View Floating Button (Bottom Right) */}
          <button className={styles.floatingEyeBtn} onClick={handleQuickView} aria-label="Quick View">
            <Eye size={18} strokeWidth={1.5} />
          </button>
        </Link>

        {/* Minimalist Details Below */}
        <div className={styles.details}>
          <div className={styles.titleRow}>
            <button className={styles.bottomHeartIcon} aria-label="Add to wishlist" onClick={(e) => e.preventDefault()}>
              <Heart size={20} strokeWidth={1.2} />
            </button>
            <h3 className={styles.title}>{product.title}</h3>
            <button className={styles.bottomHeartIcon} style={{ visibility: 'hidden' }}><Heart size={20}/></button> {/* Balance */}
          </div>

          <div className={styles.pricingRow}>
            <span className={styles.price}>Tk {product.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            {product.compareAtPrice && (
              <>
                <span className={styles.comparePrice}>Tk {product.compareAtPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                <span className={styles.discountBadge}>{discountPercentage}% OFF</span>
              </>
            )}
          </div>

          {/* Quick Add Action */}
          <button className={styles.quickAddButton} onClick={handleQuickAdd}>
            Quick Add
          </button>

          {/* Scarcity Bar */}
          {product.stockStatus === 'low' && (
            <div className={styles.scarcityContainer}>
              <div className={styles.scarcityLabel}>Only Few Left</div>
              <div className={styles.scarcityBarWrapper}>
                <div className={styles.scarcityBarFill}></div>
              </div>
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
