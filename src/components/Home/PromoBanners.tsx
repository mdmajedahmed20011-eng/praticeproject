'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Zap } from 'lucide-react';
import styles from './PromoBanners.module.css';

function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const tick = () => {
      const now = new Date().getTime();
      const diff = targetDate.getTime() - now;
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return timeLeft;
}

export default function PromoBanners() {
  // Set sale end date to 7 days from now
  const [saleEnd] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d;
  });
  const countdown = useCountdown(saleEnd);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* Flash Sale Banner */}
        <motion.div
          className={styles.flashBanner}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className={styles.flashContent}>
            <div className={styles.flashLabel}>
              <Zap size={16} fill="currentColor" /> FLASH SALE
            </div>
            <h2 className={styles.flashTitle}>Up to 50% Off</h2>
            <p className={styles.flashSub}>On premium ethnic wear and accessories</p>

            <div className={styles.countdown}>
              <div className={styles.countdownUnit}>
                <span className={styles.countdownNumber}>{String(countdown.days).padStart(2, '0')}</span>
                <span className={styles.countdownLabel}>Days</span>
              </div>
              <span className={styles.countdownSep}>:</span>
              <div className={styles.countdownUnit}>
                <span className={styles.countdownNumber}>{String(countdown.hours).padStart(2, '0')}</span>
                <span className={styles.countdownLabel}>Hours</span>
              </div>
              <span className={styles.countdownSep}>:</span>
              <div className={styles.countdownUnit}>
                <span className={styles.countdownNumber}>{String(countdown.minutes).padStart(2, '0')}</span>
                <span className={styles.countdownLabel}>Mins</span>
              </div>
              <span className={styles.countdownSep}>:</span>
              <div className={styles.countdownUnit}>
                <span className={styles.countdownNumber}>{String(countdown.seconds).padStart(2, '0')}</span>
                <span className={styles.countdownLabel}>Secs</span>
              </div>
            </div>

            <a href="/collections" className={styles.flashBtn}>Shop The Sale</a>
          </div>

          <div className={styles.flashImage}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&q=80&w=600" alt="Flash Sale" />
          </div>
        </motion.div>

        {/* Two Promo Cards Below */}
        <div className={styles.promoRow}>
          <motion.a
            href="/collections"
            className={styles.promoCard}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://images.unsplash.com/photo-1596755094514-f87e32f6b717?auto=format&fit=crop&q=80&w=800" alt="Festive Deals" className={styles.promoImage} />
            <div className={styles.promoOverlay}>
              <Clock size={20} strokeWidth={1.5} />
              <h3 className={styles.promoTitle}>Festive Collection</h3>
              <span className={styles.promoLink}>Shop Women →</span>
            </div>
          </motion.a>

          <motion.a
            href="/collections"
            className={styles.promoCard}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=800" alt="Home Essentials" className={styles.promoImage} />
            <div className={styles.promoOverlay}>
              <Clock size={20} strokeWidth={1.5} />
              <h3 className={styles.promoTitle}>Home Essentials</h3>
              <span className={styles.promoLink}>Shop Now →</span>
            </div>
          </motion.a>
        </div>
      </div>
    </section>
  );
}
