'use client';

import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import styles from './page.module.css';

export default function WishlistClient() {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart, openCart } = useCart();

  const moveToCart = (item: typeof items[0]) => {
    addToCart({
      id: item.id,
      productId: item.id,
      title: item.title,
      price: item.price,
      image: item.image,
      quantity: 1,
    });
    removeFromWishlist(item.id);
    openCart();
  };

  return (
    <div className={styles.page}>
      <section className={styles.header}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className={styles.label}>MY WISHLIST</span>
          <h1 className={styles.title}>Saved Items</h1>
          <p className={styles.subtitle}>{items.length} {items.length === 1 ? 'item' : 'items'} saved</p>
        </motion.div>
      </section>

      <div className={styles.container}>
        {items.length === 0 ? (
          <div className={styles.emptyState}>
            <Heart size={64} strokeWidth={1} className={styles.emptyIcon} />
            <h2>Your wishlist is empty</h2>
            <p>Start adding items you love and they&apos;ll appear here.</p>
            <Link href="/collections" className={styles.shopBtn}>Start Shopping</Link>
          </div>
        ) : (
          <div className={styles.grid}>
            {items.map((item, idx) => (
              <motion.div
                key={item.id}
                className={styles.card}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
              >
                <div className={styles.imageWrapper}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image} alt={item.title} className={styles.image} />
                  <button
                    className={styles.removeBtn}
                    onClick={() => removeFromWishlist(item.id)}
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className={styles.info}>
                  <h3>{item.title}</h3>
                  <p className={styles.price}>৳ {item.price.toLocaleString()}</p>
                  <button className={styles.moveToCartBtn} onClick={() => moveToCart(item)}>
                    <ShoppingBag size={14} /> Move to Cart
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
