'use client';

import { motion } from 'framer-motion';
import styles from './PromoBanners.module.css';

export default function PromoBanners() {
  return (
    <section className={styles.promoSection}>
      <motion.div 
        className={styles.promoCard}
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&q=80&w=1200" alt="Festive Deals" className={styles.promoImage} />
        <div className={styles.promoOverlay}>
          <h2 className={styles.promoTitle}>Festive Deals</h2>
          <button className={styles.promoButton}>Shop Women</button>
        </div>
      </motion.div>

      <motion.div 
        className={styles.promoCard}
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=1200" alt="Home Decor" className={styles.promoImage} />
        <div className={styles.promoOverlay}>
          <h2 className={styles.promoTitle}>Home Decor</h2>
          <button className={styles.promoButton}>Shop Now</button>
        </div>
      </motion.div>
    </section>
  );
}
