'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import styles from './Testimonials.module.css';

const testimonials = [
  {
    id: 1,
    name: 'Fatima Rahman',
    role: 'Fashion Enthusiast',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    rating: 5,
    text: 'LuxeAura transformed my wardrobe completely. The quality of their Banarasi sarees is unmatched — every thread speaks of artisan excellence. I\'ve received countless compliments!',
  },
  {
    id: 2,
    name: 'Arif Hassan',
    role: 'Loyal Customer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    rating: 5,
    text: 'The panjabi collection is absolutely stunning. Premium fabric, perfect stitching, and the delivery was incredibly fast. LuxeAura is my go-to for every Eid and occasion.',
  },
  {
    id: 3,
    name: 'Nusrat Jahan',
    role: 'Interior Designer',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150',
    rating: 5,
    text: 'Their home decor collection is a dream. I ordered handcrafted vases and cushion covers for a client project — the quality exceeded all expectations. Truly luxury at its finest.',
  },
  {
    id: 4,
    name: 'Sakib Ahmed',
    role: 'Wedding Planner',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
    rating: 5,
    text: 'I recommend LuxeAura to all my bridal clients. Their lehenga and sherwani collections are breathtaking. The attention to detail in embroidery work is phenomenal.',
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);
  const next = () => setCurrent((c) => (c + 1) % testimonials.length);

  return (
    <section className={styles.section}>
      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <span className={styles.label}>TESTIMONIALS</span>
        <h2 className={styles.sectionTitle}>What Our Customers Say</h2>
      </motion.div>

      <div className={styles.carousel}>
        <button className={styles.navBtn} onClick={prev} aria-label="Previous testimonial">
          <ChevronLeft size={20} />
        </button>

        <div className={styles.cardWrapper}>
          <AnimatePresence mode="wait">
            <motion.div
              key={testimonials[current].id}
              className={styles.card}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.5 }}
            >
              <Quote size={40} className={styles.quoteIcon} />

              <div className={styles.stars}>
                {[...Array(testimonials[current].rating)].map((_, i) => (
                  <Star key={i} size={16} fill="#C9A96E" stroke="#C9A96E" />
                ))}
              </div>

              <p className={styles.text}>{testimonials[current].text}</p>

              <div className={styles.author}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={testimonials[current].avatar}
                  alt={testimonials[current].name}
                  className={styles.avatar}
                />
                <div>
                  <h4 className={styles.authorName}>{testimonials[current].name}</h4>
                  <p className={styles.authorRole}>{testimonials[current].role}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <button className={styles.navBtn} onClick={next} aria-label="Next testimonial">
          <ChevronRight size={20} />
        </button>
      </div>

      <div className={styles.dots}>
        {testimonials.map((_, i) => (
          <button
            key={i}
            className={`${styles.dot} ${i === current ? styles.dotActive : ''}`}
            onClick={() => setCurrent(i)}
            aria-label={`Go to testimonial ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
