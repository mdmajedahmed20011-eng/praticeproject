'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import styles from './CartDrawer.module.css';

const FREE_SHIPPING_THRESHOLD = 5000;

export default function CartDrawer() {
  const { items, isCartOpen, closeCart, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();
  const shippingProgress = Math.min((cartTotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const remainingForFreeShipping = FREE_SHIPPING_THRESHOLD - cartTotal;

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className={styles.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.div
            className={styles.drawer}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            {/* Header */}
            <div className={styles.header}>
              <div className={styles.headerTitle}>
                <ShoppingBag size={20} />
                <h2>Your Cart ({cartCount})</h2>
              </div>
              <button onClick={closeCart} className={styles.closeBtn} aria-label="Close cart">
                <X size={20} />
              </button>
            </div>

            {/* Free Shipping Progress */}
            {cartCount > 0 && (
              <div className={styles.shippingBar}>
                {remainingForFreeShipping > 0 ? (
                  <p>Add <strong>৳{remainingForFreeShipping.toLocaleString()}</strong> more for <strong>FREE SHIPPING</strong></p>
                ) : (
                  <p className={styles.freeShippingUnlocked}>🎉 You&apos;ve unlocked <strong>FREE SHIPPING!</strong></p>
                )}
                <div className={styles.progressTrack}>
                  <div className={styles.progressFill} style={{ width: `${shippingProgress}%` }} />
                </div>
              </div>
            )}

            {/* Items */}
            <div className={styles.itemsContainer}>
              {items.length === 0 ? (
                <div className={styles.emptyState}>
                  <ShoppingBag size={48} strokeWidth={1} className={styles.emptyIcon} />
                  <h3>Your cart is empty</h3>
                  <p>Discover our premium collections</p>
                  <Link href="/collections" onClick={closeCart} className={styles.shopNowBtn}>
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className={styles.itemsList}>
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      className={styles.cartItem}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <div className={styles.itemImage}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.image} alt={item.title} />
                      </div>
                      <div className={styles.itemDetails}>
                        <h4 className={styles.itemTitle}>{item.title}</h4>
                        {(item.size || item.color) && (
                          <p className={styles.itemVariant}>
                            {item.size && <span>Size: {item.size}</span>}
                            {item.color && <span>Color: {item.color}</span>}
                          </p>
                        )}
                        <p className={styles.itemPrice}>৳ {item.price.toLocaleString()}</p>
                        <div className={styles.quantityRow}>
                          <div className={styles.quantityStepper}>
                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} aria-label="Decrease quantity">
                              <Minus size={14} />
                            </button>
                            <span>{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} aria-label="Increase quantity">
                              <Plus size={14} />
                            </button>
                          </div>
                          <button className={styles.removeBtn} onClick={() => removeFromCart(item.id)} aria-label="Remove item">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className={styles.footer}>
                <div className={styles.subtotalRow}>
                  <span>Subtotal</span>
                  <span className={styles.subtotalPrice}>৳ {cartTotal.toLocaleString()}</span>
                </div>
                <p className={styles.taxNote}>Shipping & taxes calculated at checkout</p>
                <Link
                  href="/checkout"
                  className={styles.checkoutBtn}
                  onClick={closeCart}
                >
                  Proceed to Checkout <ArrowRight size={16} />
                </Link>
                <button onClick={closeCart} className={styles.continueBtn}>
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
