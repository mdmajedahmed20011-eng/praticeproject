'use client';

import { motion } from 'framer-motion';
import styles from './NewArrivals.module.css';

const products = [
  { id: 1, name: 'Silk Embroidered Saree', price: '৳ 25,000', image: 'https://images.unsplash.com/photo-1583391733958-69213190fc53?auto=format&fit=crop&q=80&w=600' },
  { id: 2, name: 'Luxury Velvet Sherwani', price: '৳ 45,000', image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=600' },
  { id: 3, name: 'Handcrafted Kurti Set', price: '৳ 12,500', image: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&q=80&w=600' },
  { id: 4, name: 'Classic Leather Loafers', price: '৳ 8,000', image: 'https://images.unsplash.com/photo-1616406432452-07bc5938759d?auto=format&fit=crop&q=80&w=600' },
];

export default function NewArrivals() {
  return (
    <section className={styles.newArrivals}>
      <motion.h2 
        className={styles.title}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        New Arrivals
      </motion.h2>

      <motion.div 
        className={styles.productGrid}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={{
          visible: { transition: { staggerChildren: 0.1 } }
        }}
      >
        {products.map((product) => (
          <motion.div 
            key={product.id} 
            className={styles.productCard}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
            }}
          >
            <div className={styles.imageContainer}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={product.image} alt={product.name} className={styles.productImage} />
              <div className={styles.quickAdd}>Quick Add</div>
            </div>
            <div className={styles.productInfo}>
              <h3>{product.name}</h3>
              <p className={styles.productPrice}>{product.price}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.button 
        className={styles.viewAllButton}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        View All Products
      </motion.button>
    </section>
  );
}
