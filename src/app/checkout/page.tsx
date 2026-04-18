'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import styles from './page.module.css';

export default function CheckoutPage() {
  const { items, cartTotal } = useCart();

  const shippingCost = cartTotal > 5000 ? 0 : 100;
  const grandTotal = cartTotal + shippingCost;

  if (items.length === 0) {
    return (
      <div className={styles.emptyCart}>
        <h2>Your cart is currently empty.</h2>
        <p style={{ marginTop: '15px', marginBottom: '30px' }}>Start shopping to see items here.</p>
        <Link href="/collections" style={{ background: '#111', color: '#fff', padding: '15px 30px', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.85rem' }}>
          Browse Collections
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.checkoutPage}>
      
      {/* LEFT: Checkout Form */}
      <div className={styles.checkoutForm}>
        <div className={styles.section}>
          <h2>Contact Information</h2>
          <div className={styles.inputGroup}>
            <label>Email Address</label>
            <input type="email" placeholder="example@email.com" />
          </div>
          <div className={styles.inputGroup}>
            <label>Phone Number</label>
            <input type="tel" placeholder="+880 1XXX-XXXXXX" />
          </div>
        </div>

        <div className={styles.section}>
          <h2>Shipping Address</h2>
          <div className={styles.inputRow}>
            <div className={styles.inputGroup}>
              <label>First Name</label>
              <input type="text" placeholder="First Name" />
            </div>
            <div className={styles.inputGroup}>
              <label>Last Name</label>
              <input type="text" placeholder="Last Name" />
            </div>
          </div>
          <div className={styles.inputGroup}>
            <label>Street Address</label>
            <input type="text" placeholder="House No, Road No, Area" />
          </div>
          <div className={styles.inputRow}>
            <div className={styles.inputGroup}>
              <label>City / District</label>
              <select>
                <option>Dhaka</option>
                <option>Chittagong</option>
                <option>Sylhet</option>
                <option>Khulna</option>
              </select>
            </div>
            <div className={styles.inputGroup}>
              <label>Postal Code</label>
              <input type="text" placeholder="e.g. 1212" />
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2>Payment Method</h2>
          <div className={styles.inputGroup}>
            <select>
              <option>Cash on Delivery (COD)</option>
              <option>bKash</option>
              <option>Credit/Debit Card</option>
            </select>
          </div>
        </div>
      </div>

      {/* RIGHT: Order Summary */}
      <div className={styles.orderSummary}>
        <h2>Order Summary</h2>
        
        <div className={styles.cartItems}>
          {items.map((item) => (
            <div key={item.id} className={styles.cartItem}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.image} alt={item.title} className={styles.itemImage} />
              <div className={styles.itemDetails}>
                <div>
                  <h3 className={styles.itemTitle}>{item.title}</h3>
                  <p className={styles.itemMeta}>Size: {item.size} {item.color && `| Color: ${item.color}`}</p>
                  <p className={styles.itemMeta} style={{ textTransform: 'none', color: '#888' }}>Qty: {item.quantity}</p>
                </div>
                <p className={styles.itemPrice}>Tk {item.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
              </div>
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

        <button className={styles.submitBtn}>
          Place Order
        </button>
      </div>

    </div>
  );
}
