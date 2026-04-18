'use client';

import { motion } from 'framer-motion';
import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section className={styles.hero}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img 
        src="/images/hero.png" 
        alt="Premium Category" 
        className={styles.heroImage}
      />
      <div className={styles.heroOverlay}></div>
      <div className={styles.heroContent}>
        <motion.h1 
          className={styles.heroTitle}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          Elegance Redefined
        </motion.h1>
        <motion.button 
          className={styles.shopButton}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          Shop Collection
        </motion.button>
      </div>
    </section>
  );
}
