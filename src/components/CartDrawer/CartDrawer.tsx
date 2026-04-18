'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import styles from './CartDrawer.module.css';

export default function CartDrawer() {
  const { isCartOpen, closeCart, items, updateQuantity, removeFromCart, cartTotal } = useCart();

  // Prevent background scrolling when drawer is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCartOpen]);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop Blur */}
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />

          {/* Drawer Panel */}
          <motion.div
            className={styles.drawer}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <div className={styles.header}>
              <h2>Your Cart</h2>
              <button onClick={closeCart} className={styles.closeBtn} aria-label="Close Cart">
                <X size={24} strokeWidth={1.5} />
              </button>
            </div>

            <div className={styles.scrollArea}>
              {items.length === 0 ? (
                <div className={styles.emptyState}>
                  <ShoppingBag size={48} strokeWidth={1} />
                  <p>Your shopping bag is empty.</p>
                  <button className={styles.continueBtn} onClick={closeCart}>
                    Continue Shopping
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className={styles.cartItem}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.image} alt={item.title} className={styles.itemImage} />
                    
                    <div className={styles.itemDetails}>
                      <div className={styles.itemHeader}>
                        <h3 className={styles.itemTitle}>{item.title}</h3>
                        <button 
                          className={styles.removeBtn} 
                          onClick={() => removeFromCart(item.id)}
                          aria-label="Remove item"
                        >
                          <X size={16} strokeWidth={2} />
                        </button>
                      </div>
                      
                      <p className={styles.itemMeta}>
                        {item.size && `Size: ${item.size}`} {item.color && `| Color: ${item.color}`}
                      </p>
                      
                      <div className={styles.itemBottom}>
                        <div className={styles.quantityControls}>
                          <button 
                            className={styles.qtyBtn} 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus size={14} />
                          </button>
                          <span className={styles.qtyValue}>{item.quantity}</span>
                          <button 
                            className={styles.qtyBtn} 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <span className={styles.itemPrice}>
                          Tk {(item.price * item.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className={styles.footer}>
                <div className={styles.subtotalRow}>
                  <span>Subtotal</span>
                  <span className={styles.subtotalPrice}>
                    Tk {cartTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <p className={styles.shippingText}>
                  Shipping and taxes calculated at checkout.
                </p>
                <Link href="/checkout" className={styles.checkoutBtn} onClick={closeCart}>
                  Proceed to Checkout
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
