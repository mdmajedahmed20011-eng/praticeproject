'use client';

import { motion } from 'framer-motion';
import { Award, Users, Globe, Heart } from 'lucide-react';
import styles from './page.module.css';

const values = [
  { icon: Award, title: 'Uncompromising Quality', description: 'Every product is handpicked and quality-tested to meet our exacting standards.' },
  { icon: Users, title: 'Artisan Partnerships', description: 'We work directly with 150+ skilled artisans, preserving traditional craftsmanship.' },
  { icon: Globe, title: 'Sustainable Practices', description: 'From eco-friendly packaging to fair trade sourcing, sustainability drives every decision.' },
  { icon: Heart, title: 'Customer First', description: '25,000+ happy customers trust LuxeAura for their most important occasions.' },
];

const timeline = [
  { year: '2014', title: 'The Beginning', description: 'Founded in Dhaka with a vision to bring luxury fashion to everyone.' },
  { year: '2016', title: 'First Milestone', description: 'Reached 1,000 customers and expanded our artisan network.' },
  { year: '2019', title: 'Going Digital', description: 'Launched our e-commerce platform, reaching customers nationwide.' },
  { year: '2022', title: 'Premium Expansion', description: 'Introduced home décor and beauty lines. Crossed 15,000 customers.' },
  { year: '2026', title: 'Today', description: 'A trusted name in luxury with 25,000+ customers and 1,200+ products.' },
];

export default function AboutClient() {
  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&q=80&w=1400"
          alt="LuxeAura Story"
          className={styles.heroImg}
        />
        <div className={styles.heroOverlay}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className={styles.label}>OUR STORY</span>
            <h1 className={styles.heroTitle}>Crafting Elegance, Defining Luxury</h1>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className={styles.missionSection}>
        <motion.div
          className={styles.missionContent}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className={styles.sectionTitle}>Our Mission</h2>
          <p className={styles.missionText}>
            At LuxeAura, we believe that luxury should be accessible, authentic, and meaningful.
            Our mission is to preserve the art of traditional craftsmanship while delivering
            a modern, premium shopping experience. Every stitch tells a story, every product
            reflects our commitment to excellence.
          </p>
        </motion.div>
      </section>

      {/* Values */}
      <section className={styles.valuesSection}>
        <h2 className={styles.sectionTitle}>Our Values</h2>
        <div className={styles.valuesGrid}>
          {values.map((v, idx) => (
            <motion.div
              key={v.title}
              className={styles.valueCard}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <div className={styles.valueIcon}><v.icon size={28} /></div>
              <h3>{v.title}</h3>
              <p>{v.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className={styles.timelineSection}>
        <h2 className={styles.sectionTitle}>Our Journey</h2>
        <div className={styles.timeline}>
          {timeline.map((item, idx) => (
            <motion.div
              key={item.year}
              className={styles.timelineItem}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
            >
              <div className={styles.timelineYear}>{item.year}</div>
              <div className={styles.timelineDot}></div>
              <div className={styles.timelineContent}>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
