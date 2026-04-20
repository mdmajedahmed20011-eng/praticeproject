'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';
import styles from './page.module.css';

export default function ContactClient() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className={styles.label}>GET IN TOUCH</span>
          <h1 className={styles.title}>Contact Us</h1>
          <p className={styles.subtitle}>We&apos;d love to hear from you. Reach out and we&apos;ll respond within 24 hours.</p>
        </motion.div>
      </section>

      <div className={styles.container}>
        <div className={styles.infoGrid}>
          {[
            { icon: MapPin, title: 'Visit Us', lines: ['Gulshan 2, Road 45', 'Dhaka 1212, Bangladesh'] },
            { icon: Phone, title: 'Call Us', lines: ['+880 1700-000000', 'Mon-Sat, 10AM-8PM'] },
            { icon: Mail, title: 'Email Us', lines: ['support@luxeaura.com', 'orders@luxeaura.com'] },
            { icon: Clock, title: 'Working Hours', lines: ['Mon - Sat: 10AM - 8PM', 'Sunday: Closed'] },
          ].map((item, idx) => (
            <motion.div
              key={item.title}
              className={styles.infoCard}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <div className={styles.infoIcon}><item.icon size={24} /></div>
              <h3>{item.title}</h3>
              {item.lines.map((line, i) => <p key={i}>{line}</p>)}
            </motion.div>
          ))}
        </div>

        <motion.div
          className={styles.formSection}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className={styles.formTitle}>Send Us a Message</h2>

          {submitted ? (
            <div className={styles.successMsg}>
              <CheckCircle size={32} />
              <h3>Thank you for reaching out!</h3>
              <p>We&apos;ll get back to you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Full Name</label>
                  <input type="text" placeholder="Your name" required />
                </div>
                <div className={styles.formGroup}>
                  <label>Email Address</label>
                  <input type="email" placeholder="you@example.com" required />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Subject</label>
                <input type="text" placeholder="How can we help?" required />
              </div>
              <div className={styles.formGroup}>
                <label>Message</label>
                <textarea rows={6} placeholder="Tell us more..." required></textarea>
              </div>
              <button type="submit" className={styles.submitBtn}>
                <Send size={16} /> Send Message
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
