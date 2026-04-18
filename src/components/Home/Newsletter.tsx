'use client';

import { motion } from 'framer-motion';
import styles from './Newsletter.module.css';

export default function Newsletter() {
  return (
    <section className={styles.newsletter}>
      <motion.div 
        className={styles.content}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className={styles.title}>Join The Aura</h2>
        <p className={styles.description}>
          Subscribe to receive updates on new arrivals, special offers, and early access to our luxury collections.
        </p>
        <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
          <input 
            type="email" 
            placeholder="Enter your email address" 
            className={styles.input}
            required
          />
          <button type="submit" className={styles.button}>Subscribe</button>
        </form>
      </motion.div>
    </section>
  );
}
