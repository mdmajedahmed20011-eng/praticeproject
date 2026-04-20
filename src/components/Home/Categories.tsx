'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';
import styles from './Categories.module.css';

const categories = [
  { id: 1, title: 'Women', subtitle: 'Sarees, Kurtis & More', image: 'https://images.unsplash.com/photo-1583391733958-69213190fc53?auto=format&fit=crop&q=80&w=800', size: 'large' },
  { id: 2, title: 'Men', subtitle: 'Panjabis & Sherwanis', image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&q=80&w=800', size: 'normal' },
  { id: 3, title: 'Kids', subtitle: 'Little Fashionistas', image: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&q=80&w=800', size: 'normal' },
  { id: 4, title: 'Home & Decor', subtitle: 'Luxury Living', image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=800', size: 'normal' },
  { id: 5, title: 'Beauty', subtitle: 'Skin & Wellness', image: 'https://images.unsplash.com/photo-1596462502278-27bfbe1220a?auto=format&fit=crop&q=80&w=800', size: 'normal' },
  { id: 6, title: 'Accessories', subtitle: 'Complete Your Look', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800', size: 'large' },
];

export default function Categories() {
  return (
    <section className={styles.section}>
      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <span className={styles.label}>CURATED FOR YOU</span>
        <h2 className={styles.sectionTitle}>Shop by Category</h2>
      </motion.div>

      <motion.div
        className={styles.grid}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={{
          visible: { transition: { staggerChildren: 0.1 } }
        }}
      >
        {categories.map((cat) => (
          <Link href="/collections" key={cat.id} className={`${styles.card} ${cat.size === 'large' ? styles.cardLarge : ''}`}>
            <motion.div
              className={styles.cardInner}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
              }}
            >
              <div className={styles.imageWrapper} style={{ position: 'relative' }}>
                <Image 
                  src={cat.image} 
                  alt={cat.title} 
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className={styles.image} 
                  style={{ objectFit: 'cover' }}
                />
                <div className={styles.overlay}>
                  <div className={styles.overlayContent}>
                    <h3 className={styles.cardTitle}>{cat.title}</h3>
                    <p className={styles.cardSub}>{cat.subtitle}</p>
                    <span className={styles.shopLink}>Shop Now →</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </motion.div>
    </section>
  );
}
