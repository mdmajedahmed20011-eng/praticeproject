'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import styles from './page.module.css';

export default function CheckoutPage() {
  const { items, cartTotal, clearCart } = useCart();
  const router = useRouter();
  
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [paymentMethod, setPaymentMethod] = useState<string>('cod');

  // Address & Contact State
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');

  // Discount State
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<any>(null);
  const [discountError, setDiscountError] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const shippingCost = cartTotal > 5000 ? 0 : 100;
  
  // Calculate discount amount
  let discountAmount = 0;
  if (appliedDiscount) {
    if (appliedDiscount.type === 'PERCENTAGE') {
      discountAmount = (cartTotal * appliedDiscount.value) / 100;
    } else if (appliedDiscount.type === 'FLAT') {
      discountAmount = appliedDiscount.value;
    }
  }

  const grandTotal = cartTotal + shippingCost - discountAmount;

  if (items.length === 0 && !isSubmitting) {
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

  const applyDiscount = async (e: React.FormEvent) => {
    e.preventDefault();
    setDiscountError('');
    if (!discountCode.trim()) return;

    try {
      const res = await fetch('/api/discounts');
      const discounts = await res.json();
      
      const found = discounts.find((d: any) => d.code === discountCode.toUpperCase() && d.isActive);
      
      if (!found) {
        setDiscountError('Invalid or expired discount code');
        return;
      }

      if (found.minOrderVal && cartTotal < found.minOrderVal) {
        setDiscountError(`Minimum order value Tk ${found.minOrderVal} required`);
        return;
      }

      if (found.maxUses && found.usedCount >= found.maxUses) {
        setDiscountError('Discount code usage limit reached');
        return;
      }

      setAppliedDiscount(found);
    } catch (err) {
      console.error(err);
      setDiscountError('Error applying discount');
    }
  };

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    try {
      const orderPayload = {
        customerName: `${firstName} ${lastName}`.trim(),
        customerEmail: email,
        customerPhone: phone,
        shippingAddress: `${address}, ${city}, ${zip}`,
        totalAmount: grandTotal,
        paymentMethod: paymentMethod === 'cod' ? 'COD' : 'ONLINE',
        items: items.map(i => ({
          id: i.id,
          quantity: i.quantity,
          price: i.price,
          selectedSize: i.size,
          selectedColor: i.color
        })),
        discountCode: appliedDiscount?.code,
        discountAmount: discountAmount
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      if (!res.ok) throw new Error('Failed to place order');

      clearCart();
      alert('Order placed successfully! Redirecting...');
      router.push('/');
    } catch (error) {
      console.error(error);
      alert('There was an error placing your order. Please try again.');
      setIsSubmitting(false);
    }
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
                  <input type="email" id="email" placeholder=" " value={email} onChange={e => setEmail(e.target.value)} required />
                  <label htmlFor="email">Email Address</label>
                </div>
                <div className={styles.inputGroup}>
                  <input type="tel" id="phone" placeholder=" " value={phone} onChange={e => setPhone(e.target.value)} required />
                  <label htmlFor="phone">Phone Number</label>
                </div>
                <button 
                  className={styles.nextBtn} 
                  onClick={handleNext} 
                  disabled={!email || !phone}
                >
                  Continue to Shipping
                </button>
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
                    <input type="text" id="fn" placeholder=" " value={firstName} onChange={e => setFirstName(e.target.value)} required />
                    <label htmlFor="fn">First Name</label>
                  </div>
                  <div className={styles.inputGroup}>
                    <input type="text" id="ln" placeholder=" " value={lastName} onChange={e => setLastName(e.target.value)} required />
                    <label htmlFor="ln">Last Name</label>
                  </div>
                </div>
                <div className={styles.inputGroup}>
                  <input type="text" id="address" placeholder=" " value={address} onChange={e => setAddress(e.target.value)} required />
                  <label htmlFor="address">Street Address</label>
                </div>
                <div className={styles.inputRow}>
                  <div className={styles.inputGroup}>
                    <input type="text" id="city" placeholder=" " value={city} onChange={e => setCity(e.target.value)} required />
                    <label htmlFor="city">City / District</label>
                  </div>
                  <div className={styles.inputGroup}>
                    <input type="text" id="zip" placeholder=" " value={zip} onChange={e => setZip(e.target.value)} required />
                    <label htmlFor="zip">Postal Code</label>
                  </div>
                </div>
                <button 
                  className={styles.nextBtn} 
                  onClick={handleNext}
                  disabled={!firstName || !lastName || !address || !city}
                >
                  Continue to Payment
                </button>
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
                <button 
                  className={styles.submitBtn} 
                  style={{ marginTop: '20px' }} 
                  onClick={handlePlaceOrder}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Processing...' : 'Place Order Now'}
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

        {/* Discount Code Input */}
        <form onSubmit={applyDiscount} className={styles.discountForm} style={{ display: 'flex', gap: '10px', marginTop: '20px', paddingBottom: '20px', borderBottom: '1px solid #e5e5e5' }}>
          <input 
            type="text" 
            placeholder="Discount code" 
            value={discountCode}
            onChange={e => setDiscountCode(e.target.value)}
            style={{ flex: 1, padding: '12px', border: '1px solid #ddd', borderRadius: '4px', textTransform: 'uppercase' }}
          />
          <button type="submit" style={{ padding: '0 20px', background: discountCode ? '#111' : '#ccc', color: '#fff', border: 'none', borderRadius: '4px', cursor: discountCode ? 'pointer' : 'default' }}>
            Apply
          </button>
        </form>
        {discountError && <p style={{ color: '#e11d48', fontSize: '0.85rem', marginTop: '5px' }}>{discountError}</p>}
        {appliedDiscount && <p style={{ color: '#10b981', fontSize: '0.85rem', marginTop: '5px' }}>Code applied: {appliedDiscount.code}</p>}

        <div className={styles.totals} style={{ marginTop: '20px' }}>
          <div className={styles.totalRow}>
            <span>Subtotal</span>
            <span>Tk {cartTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          </div>
          {appliedDiscount && (
            <div className={styles.totalRow} style={{ color: '#10b981' }}>
              <span>Discount ({appliedDiscount.code})</span>
              <span>- Tk {discountAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
          )}
          <div className={styles.totalRow}>
            <span>Shipping</span>
            <span>{shippingCost === 0 ? 'FREE' : `Tk ${shippingCost.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}</span>
          </div>
          <div className={`${styles.totalRow} ${styles.grandTotal}`}>
            <span>Total</span>
            <span>Tk {Math.max(0, grandTotal).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>
      </div>

    </div>
  );
}
