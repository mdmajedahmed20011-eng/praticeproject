'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './Hero.module.css';

export default function Hero({ settings }: { settings?: any }) {
  console.log('[DEBUG_HERO_SETTINGS]', JSON.stringify(settings));
  const headline = (settings?.heroHeadline as string) || "Elevate Your Style";
  const subheadline = (settings?.heroSubheadline as string) || "Discover the 2026 Premium Collection";
  const bgImage = (settings?.heroImage as string) || "https://images.unsplash.com/photo-1596755094514-f87e32f6b717?w=1400&q=80";
  const btnText = (settings?.heroButtonText as string) || "Shop Collection";
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        if (rect.bottom > 0) {
          setScrollY(window.scrollY);
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const letterVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.3 + i * 0.04,
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    }),
  };

  return (
    <section ref={heroRef} className={styles.hero}>
      {/* Parallax Background */}
      <div
        className={styles.heroImageWrapper}
        style={{ transform: `translateY(${scrollY * 0.3}px)` }}
      >
        <Image
          src={bgImage}
          alt="LuxeAura Premium Collection"
          fill
          priority
          sizes="100vw"
          className={styles.heroImage}
          style={{ objectFit: 'cover' }}
        />
      </div>

      {/* Gradient Overlay */}
      <div className={styles.heroOverlay}></div>

      {/* Floating Particles */}
      <div className={styles.particles}>
        {[...Array(6)].map((_, i) => (
          <div key={i} className={styles.particle} style={{
            left: `${15 + i * 14}%`,
            animationDelay: `${i * 0.8}s`,
            animationDuration: `${4 + i * 0.5}s`,
          }} />
        ))}
      </div>

      {/* Content */}
      <div className={styles.heroContent}>
        <motion.div
          className={styles.labelBadge}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          ★ PREMIUM COLLECTION 2026
        </motion.div>

        <h1 className={styles.heroTitle}>
          {headline.split('').map((char, i) => (
            <motion.span
              key={i}
              custom={i}
              variants={letterVariants}
              initial="hidden"
              animate="visible"
              className={char === ' ' ? styles.space : ''}
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </h1>

        {subheadline && (
          <motion.p
            className={styles.heroSub}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            {subheadline}
          </motion.p>
        )}

        <motion.div
          className={styles.heroCtas}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
        >
          <Link href="/collections" className={styles.primaryBtn}>
            <span>{btnText}</span>
            <div className={styles.btnShimmer}></div>
          </Link>
          <Link href="/about" className={styles.secondaryBtn}>
            Our Story
          </Link>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className={styles.scrollIndicator}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <span>Scroll to explore</span>
        <ChevronDown size={18} className={styles.scrollArrow} />
      </motion.div>
    </section>
  );
}
