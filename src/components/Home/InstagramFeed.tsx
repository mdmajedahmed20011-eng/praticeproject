'use client';

import { motion } from 'framer-motion';
import { Camera } from 'lucide-react';
import Image from 'next/image';
import styles from './InstagramFeed.module.css';

const images = [
  'https://images.unsplash.com/photo-1583391733958-69213190fc53?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1596755094514-f87e32f6b717?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&q=80&w=400',
];

export default function InstagramFeed() {
  return (
    <section className={styles.section}>
      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <span className={styles.label}>
          <Camera size={14} /> FOLLOW US ON INSTAGRAM
        </span>
        <h2 className={styles.sectionTitle}>@luxeaura</h2>
      </motion.div>

      <div className={styles.grid}>
        {images.map((img, idx) => (
          <motion.a
            key={idx}
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.item}
            style={{ position: 'relative' }}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.08, duration: 0.5 }}
          >
            <Image 
              src={img} 
              alt={`LuxeAura Instagram ${idx + 1}`} 
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
              className={styles.image} 
              style={{ objectFit: 'cover' }}
            />
            <div className={styles.overlay}>
              <Camera size={28} strokeWidth={1.5} />
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
