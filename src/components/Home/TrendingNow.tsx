'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Heart, Star, Flame } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart, CartItem } from '@/context/CartContext';
import styles from './TrendingNow.module.css';

export default function TrendingNow({ products }: { products: any[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCart();

  const handleQuickAdd = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation();
    
    const cartItem: CartItem = {
      id: `${product.id}-${product.sizes?.[0]}-${product.colors?.[0]}`,
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

  if (!products || products.length === 0) return null;

  return (
    <section className={styles.section}>
      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <span className={styles.label}>
          <Flame size={14} /> TRENDING NOW
        </span>
        <h2 className={styles.sectionTitle}>Most Loved This Week</h2>
      </motion.div>

      <div className={styles.scrollContainer} ref={scrollRef}>
        <div className={styles.scrollTrack}>
          {products.map((product, idx) => (
            <motion.div
              key={product.id}
              className={styles.card}
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08, duration: 0.5 }}
            >
              <Link href={`/product/${product.id}`} className={styles.productLink}>
                <div className={styles.imageWrapper} style={{ position: 'relative' }}>
                  <Image 
                    src={product.image} 
                    alt={product.title} 
                    fill 
                    sizes="(max-width: 768px) 100vw, 300px" 
                    className={styles.productImage} 
                    style={{ objectFit: 'cover' }}
                  />
                  {product.compareAtPrice && product.price < product.compareAtPrice && (
                    <span className={`${styles.productBadge} ${styles.saleBadge}`}>SALE</span>
                  )}
                  <button className={styles.wishlistBtn} aria-label="Add to wishlist" onClick={(e) => e.preventDefault()}>
                    <Heart size={18} strokeWidth={1.5} />
                  </button>
                  <div className={styles.quickAddOverlay}>
                    <button 
                      className={styles.quickAddBtn}
                      onClick={(e) => handleQuickAdd(e, product)}
                    >
                      Quick Add
                    </button>
                  </div>
                </div>
                <div className={styles.productInfo}>
                  <div className={styles.ratingRow}>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        fill={i < 4 ? '#C9A96E' : 'none'}
                        stroke={i < 4 ? '#C9A96E' : '#ccc'}
                      />
                    ))}
                    <span className={styles.ratingText}>4.8</span>
                  </div>
                  <h3 className={styles.productName}>{product.title}</h3>
                  <div className={styles.priceRow}>
                    <span className={styles.price}>৳ {product.price.toLocaleString()}</span>
                    {product.compareAtPrice && (
                      <span className={styles.comparePrice}>৳ {product.compareAtPrice.toLocaleString()}</span>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
