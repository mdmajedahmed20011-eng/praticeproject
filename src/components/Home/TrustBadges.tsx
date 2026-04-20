'use client';

import { motion } from 'framer-motion';
import { Truck, Shield, Headphones, RotateCcw } from 'lucide-react';
import styles from './TrustBadges.module.css';

const badges = [
  { icon: Truck, title: 'Free Shipping', description: 'On orders over ৳5,000' },
  { icon: Shield, title: 'Secure Payment', description: '100% protected checkout' },
  { icon: Headphones, title: '24/7 Support', description: 'Dedicated customer care' },
  { icon: RotateCcw, title: 'Easy Returns', description: '30-day return policy' },
];

export default function TrustBadges() {
  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        {badges.map((badge, idx) => (
          <motion.div
            key={badge.title}
            className={styles.badge}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1, duration: 0.5 }}
          >
            <div className={styles.iconWrapper}>
              <badge.icon size={28} strokeWidth={1.5} />
            </div>
            <h3 className={styles.title}>{badge.title}</h3>
            <p className={styles.description}>{badge.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
