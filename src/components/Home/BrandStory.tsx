'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import styles from './BrandStory.module.css';

const stats = [
  { label: 'Happy Customers', target: 25000, suffix: '+' },
  { label: 'Products Crafted', target: 1200, suffix: '+' },
  { label: 'Artisan Partners', target: 150, suffix: '+' },
  { label: 'Years of Excellence', target: 12, suffix: '' },
];

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 2000;
          const startTime = performance.now();

          const animate = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  );
}

export default function BrandStory() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <motion.div
          className={styles.imageCol}
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ position: 'relative' }}
        >
          <Image
            src="https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&q=80&w=800"
            alt="LuxeAura Brand Story"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className={styles.image}
            style={{ objectFit: 'cover' }}
          />
          <div className={styles.imageAccent}></div>
        </motion.div>

        <motion.div
          className={styles.textCol}
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className={styles.label}>OUR STORY</span>
          <h2 className={styles.title}>Crafting Elegance Since 2014</h2>
          <p className={styles.description}>
            LuxeAura was born from a passion for preserving the art of traditional craftsmanship
            while embracing modern luxury. Every piece in our collection tells a story — woven by
            skilled artisans, designed for the discerning individual who values authenticity and
            timeless style.
          </p>
          <p className={styles.description}>
            From hand-embroidered sarees to contemporary home décor, we bridge heritage and
            innovation, delivering an unparalleled shopping experience to thousands of customers
            worldwide.
          </p>

          <div className={styles.statsGrid}>
            {stats.map((stat) => (
              <div key={stat.label} className={styles.stat}>
                <span className={styles.statNumber}>
                  <AnimatedCounter target={stat.target} suffix={stat.suffix} />
                </span>
                <span className={styles.statLabel}>{stat.label}</span>
              </div>
            ))}
          </div>

          <a href="/about" className={styles.ctaButton}>
            Discover Our Journey
          </a>
        </motion.div>
      </div>
    </section>
  );
}
