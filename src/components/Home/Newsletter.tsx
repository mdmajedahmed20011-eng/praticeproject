'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Gift, CheckCircle } from 'lucide-react';
import styles from './Newsletter.module.css';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 4000);
      setEmail('');
    }
  };

  return (
    <section className={styles.section}>
      <div className={styles.bgImage}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&q=80&w=1400"
          alt=""
          className={styles.bgImg}
        />
      </div>
      <div className={styles.overlay}></div>
      
      <motion.div
        className={styles.content}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className={styles.giftIcon}>
          <Gift size={32} strokeWidth={1.5} />
        </div>
        <span className={styles.label}>EXCLUSIVE OFFER</span>
        <h2 className={styles.title}>Get 10% Off Your First Order</h2>
        <p className={styles.description}>
          Subscribe to our newsletter and stay updated on new arrivals, special offers, and early access to our luxury collections.
        </p>

        {submitted ? (
          <motion.div
            className={styles.successMsg}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <CheckCircle size={24} />
            <span>Welcome to the LuxeAura family! Check your inbox.</span>
          </motion.div>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputWrapper}>
              <input
                type="email"
                placeholder="Enter your email address"
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className={styles.button}>
                Subscribe
              </button>
            </div>
          </form>
        )}

        <p className={styles.disclaimer}>
          By subscribing, you agree to our Privacy Policy. Unsubscribe anytime.
        </p>
      </motion.div>
    </section>
  );
}
