'use client';

import { motion } from 'framer-motion';
import styles from './Hero.module.css';

export default function Hero({ settings }: { settings?: any }) {
  const headline = settings?.heroHeadline || "Elegance Redefined";
  const subheadline = settings?.heroSubheadline || "";
  const bgImage = settings?.heroImage || "/images/hero.png";
  const btnText = settings?.heroButtonText || "Shop Collection";

  return (
    <section className={styles.hero}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img 
        src={bgImage} 
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
          {headline}
        </motion.h1>
        {subheadline && (
          <motion.p
            className={styles.heroSub}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '20px' }}
          >
            {subheadline}
          </motion.p>
        )}
        <motion.button 
          className={styles.shopButton}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          {btnText}
        </motion.button>
      </div>
    </section>
  );
}
