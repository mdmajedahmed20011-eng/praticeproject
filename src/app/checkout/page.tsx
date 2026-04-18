'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import styles from './page.module.css';

export default function CheckoutPage() {
  const { items, cartTotal } = useCart();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [paymentMethod, setPaymentMethod] = useState<string>('cod');

  const shippingCost = cartTotal > 5000 ? 0 : 100;
  const grandTotal = cartTotal + shippingCost;

  if (items.length === 0) {
    return (
      <div className={styles.checkoutPage} style={{ display: 'block', textAlign: 'center', paddingTop: '100px' }}>
        <h2>Your cart is currently empty.</h2>
        <p style={{ marginTop: '15px', marginBottom: '30px' }}>Start shopping to see items here.</p>
        <Link href="/collections" style={{ background: '#111', color: '#fff', padding: '15px 30px', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.85rem' }}>
          Browse Collections
        </Link>
      </div>
    );
  }

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentStep(prev => prev + 1);
  };

  return (
    <div className={styles.checkoutPage}>
      
      {/* LEFT: Checkout Form */}
      <div className={styles.checkoutForm}>
        
        {/* Step 1: Contact */}
        <div className={styles.step}>
          <div className={styles.stepHeader} onClick={() => setCurrentStep(1)}>
            <h2 className={styles.stepTitle}>
              <span className={styles.stepNumber}>{currentStep > 1 ? <Check size={14} /> : '1'}</span>
              Contact Information
            </h2>
          </div>
          <AnimatePresence>
            {currentStep === 1 && (
              <motion.div 
                className={styles.stepContent}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
              >
                <div className={styles.inputGroup}>
                  <input type="email" id="email" placeholder=" " required />
                  <label htmlFor="email">Email Address</label>
                </div>
                <div className={styles.inputGroup}>
                  <input type="tel" id="phone" placeholder=" " required />
                  <label htmlFor="phone">Phone Number</label>
                </div>
                <button className={styles.nextBtn} onClick={handleNext}>Continue to Shipping</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Step 2: Shipping */}
        <div className={styles.step}>
          <div className={styles.stepHeader} onClick={() => currentStep > 1 && setCurrentStep(2)}>
            <h2 className={styles.stepTitle} style={{ opacity: currentStep < 2 ? 0.5 : 1 }}>
              <span className={styles.stepNumber}>{currentStep > 2 ? <Check size={14} /> : '2'}</span>
              Shipping Address
            </h2>
          </div>
          <AnimatePresence>
            {currentStep === 2 && (
              <motion.div 
                className={styles.stepContent}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
              >
                <div className={styles.inputRow}>
                  <div className={styles.inputGroup}>
                    <input type="text" id="fn" placeholder=" " required />
                    <label htmlFor="fn">First Name</label>
                  </div>
                  <div className={styles.inputGroup}>
                    <input type="text" id="ln" placeholder=" " required />
                    <label htmlFor="ln">Last Name</label>
                  </div>
                </div>
                <div className={styles.inputGroup}>
                  <input type="text" id="address" placeholder=" " required />
                  <label htmlFor="address">Street Address</label>
                </div>
                <div className={styles.inputRow}>
                  <div className={styles.inputGroup}>
                    <input type="text" id="city" placeholder=" " required />
                    <label htmlFor="city">City / District</label>
                  </div>
                  <div className={styles.inputGroup}>
                    <input type="text" id="zip" placeholder=" " required />
                    <label htmlFor="zip">Postal Code</label>
                  </div>
                </div>
                <button className={styles.nextBtn} onClick={handleNext}>Continue to Payment</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Step 3: Payment */}
        <div className={styles.step} style={{ borderBottom: 'none' }}>
          <div className={styles.stepHeader} onClick={() => currentStep > 2 && setCurrentStep(3)}>
            <h2 className={styles.stepTitle} style={{ opacity: currentStep < 3 ? 0.5 : 1 }}>
              <span className={styles.stepNumber}>3</span>
              Payment Method
            </h2>
          </div>
          <AnimatePresence>
            {currentStep === 3 && (
              <motion.div 
                className={styles.stepContent}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
              >
                <div className={styles.paymentMethods}>
                  <div 
                    className={`${styles.paymentOption} ${paymentMethod === 'cod' ? styles.selected : ''}`}
                    onClick={() => setPaymentMethod('cod')}
                  >
                    <input type="radio" checked={paymentMethod === 'cod'} readOnly />
                    <span>Cash on Delivery (COD)</span>
                  </div>
                  <div 
                    className={`${styles.paymentOption} ${paymentMethod === 'bkash' ? styles.selected : ''}`}
                    onClick={() => setPaymentMethod('bkash')}
                  >
                    <input type="radio" checked={paymentMethod === 'bkash'} readOnly />
                    <span>bKash Secure Payment</span>
                  </div>
                  <div 
                    className={`${styles.paymentOption} ${paymentMethod === 'card' ? styles.selected : ''}`}
                    onClick={() => setPaymentMethod('card')}
                  >
                    <input type="radio" checked={paymentMethod === 'card'} readOnly />
                    <span>Credit / Debit Card</span>
                  </div>
                </div>
                <button className={styles.submitBtn} style={{ marginTop: '20px' }}>
                  Pay Now
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* RIGHT: Premium Order Summary */}
      <div className={styles.orderSummary}>
        <h2>Order Summary</h2>
        
        <div className={styles.cartItems}>
          {items.map((item) => (
            <div key={item.id} className={styles.cartItem}>
              <div className={styles.imageWrapper}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.image} alt={item.title} className={styles.itemImage} />
                <span className={styles.itemBadge}>{item.quantity}</span>
              </div>
              <div className={styles.itemDetails}>
                <h3 className={styles.itemTitle}>{item.title}</h3>
                <p className={styles.itemMeta}>{item.size} {item.color && `/ ${item.color}`}</p>
              </div>
              <p className={styles.itemPrice}>Tk {(item.price * item.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
            </div>
          ))}
        </div>

        <div className={styles.totals}>
          <div className={styles.totalRow}>
            <span>Subtotal</span>
            <span>Tk {cartTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className={styles.totalRow}>
            <span>Shipping</span>
            <span>{shippingCost === 0 ? 'FREE' : `Tk ${shippingCost.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}</span>
          </div>
          <div className={`${styles.totalRow} ${styles.grandTotal}`}>
            <span>Total</span>
            <span>Tk {grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>
      </div>

    </div>
  );
}
