'use client';

import { motion } from 'framer-motion';
import { Heart, Star, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart, CartItem } from '@/context/CartContext';
import styles from './NewArrivals.module.css';

export default function NewArrivals({ products }: { products: any[] }) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
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
        <span className={styles.label}>FRESH DROPS</span>
        <h2 className={styles.sectionTitle}>New Arrivals</h2>
      </motion.div>

      <motion.div
        className={styles.productGrid}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
      >
        {products.map((product) => (
          <motion.div
            key={product.id}
            className={styles.productCard}
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
            }}
          >
            <Link href={`/product/${product.id}`} className={styles.linkContainer}>
              <div className={styles.imageContainer} style={{ position: 'relative' }}>
                <Image 
                  src={product.image} 
                  alt={product.title} 
                  fill 
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className={styles.productImage} 
                  style={{ objectFit: 'cover' }}
                />

                {product.compareAtPrice && product.price < product.compareAtPrice && (
                  <span className={`${styles.badge} ${styles.badgeSale}`}>SALE</span>
                )}

                <button className={styles.wishlistBtn} aria-label="Add to wishlist" onClick={(e) => e.preventDefault()}>
                  <Heart size={18} strokeWidth={1.5} />
                </button>

                <div className={styles.addToCartOverlay}>
                  <button 
                    className={styles.addToCartBtn}
                    onClick={(e) => handleAddToCart(e, product)}
                  >
                    <ShoppingBag size={16} /> Add to Cart
                  </button>
                </div>
              </div>

              <div className={styles.productInfo}>
                <div className={styles.ratingRow}>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={11}
                      fill={i < 4 ? '#C9A96E' : 'none'}
                      stroke={i < 4 ? '#C9A96E' : '#ddd'}
                    />
                  ))}
                  <span className={styles.ratingText}>(4.8)</span>
                </div>

                <h3 className={styles.productName}>{product.title}</h3>

                {product.colors && product.colors.length > 0 && (
                  <div className={styles.colorSwatches}>
                    {product.colors.map((color: string, i: number) => (
                      <span key={i} className={styles.swatch} style={{ background: color }} />
                    ))}
                  </div>
                )}

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
      </motion.div>

      <motion.div
        className={styles.viewAllWrapper}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <Link href="/collections" className={styles.viewAllButton}>
          View All Products
        </Link>
      </motion.div>
    </section>
  );
}
