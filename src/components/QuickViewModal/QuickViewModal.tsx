'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import styles from './QuickViewModal.module.css';

interface QuickViewProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    title: string;
    price: number;
    image: string;
    colors?: string[];
  };
}

export default function QuickViewModal({ isOpen, onClose, product }: QuickViewProps) {
  const { addToCart } = useCart();
  const sizes = ['S', 'M', 'L', 'XL'];
  const [selectedSize, setSelectedSize] = useState(sizes[1]);
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || '#ffffff');

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleAddToCart = () => {
    addToCart({
      id: `${product.id}-${selectedSize}-${selectedColor}`,
      productId: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      size: selectedSize,
      color: selectedColor,
      quantity: 1
    });
    onClose(); // Close modal after adding
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className={styles.modal}
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()} // Prevent clicking inside modal from closing it
          >
            <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
              <X size={20} strokeWidth={2} />
            </button>

            <div className={styles.imageSection}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={product.image} alt={product.title} className={styles.productImage} />
            </div>

            <div className={styles.detailsSection}>
              <h2 className={styles.title}>{product.title}</h2>
              <p className={styles.price}>Tk {product.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
              <p className={styles.description}>
                Experience premium comfort and minimalist style with our meticulously crafted collection. 
                Perfect for elevating your everyday wardrobe.
              </p>

              {product.colors && product.colors.length > 0 && (
                <div className={styles.section}>
                  <span className={styles.sectionLabel}>Colour</span>
                  <div className={styles.colors}>
                    {product.colors.map((c) => (
                      <button
                        key={c}
                        className={`${styles.colorBtn} ${selectedColor === c ? styles.active : ''}`}
                        style={{ backgroundColor: c }}
                        onClick={() => setSelectedColor(c)}
                        aria-label={`Select color ${c}`}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className={styles.section}>
                <span className={styles.sectionLabel}>Size</span>
                <div className={styles.sizes}>
                  {sizes.map((s) => (
                    <button
                      key={s}
                      className={`${styles.sizeBtn} ${selectedSize === s ? styles.active : ''}`}
                      onClick={() => setSelectedSize(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <button className={styles.addToCartBtn} onClick={handleAddToCart}>
                Add to Cart
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
