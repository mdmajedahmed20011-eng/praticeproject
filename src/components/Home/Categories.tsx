'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './Categories.module.css';

const categories = [
  { id: 1, title: 'Women', image: '/images/women.png' },
  { id: 2, title: 'Men', image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&q=80&w=800' },
  { id: 3, title: 'Girls', image: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&q=80&w=800' },
  { id: 4, title: 'Boys', image: 'https://images.unsplash.com/photo-1596404987019-354da2dc7b06?auto=format&fit=crop&q=80&w=800' },
  { id: 5, title: 'Home & Decor', image: '/images/decor.png' },
  { id: 6, title: 'Beauty', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=800' },
  { id: 7, title: 'Accessories', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800' },
  { id: 8, title: 'Footwear', image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=800' },
];

export default function Categories() {
  return (
    <section className={styles.categoriesSection}>
      <motion.div 
        className={styles.grid}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
      >
        {categories.map((cat) => (
          <Link href="/collections" key={cat.id} style={{textDecoration: 'none'}}>
            <motion.div 
              className={styles.categoryCard}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
              }}
            >
              <div className={styles.imageWrapper}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={cat.image} alt={cat.title} className={styles.categoryImage} />
              </div>
              <h3 className={styles.categoryTitle}>{cat.title}</h3>
            </motion.div>
          </Link>
        ))}
      </motion.div>
    </section>
  );
}
