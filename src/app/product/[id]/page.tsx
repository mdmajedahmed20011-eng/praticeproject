'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Heart, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import styles from './page.module.css';

// Mock DB 
const mockProducts: Record<string, any> = {
  e1: {
    id: 'e1',
    title: 'White/Green Printed Cotton Shirt',
    price: 854.55,
    images: [
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&q=80',
      'https://images.unsplash.com/photo-1596755094514-f87e32f6b717?w=800&q=80'
    ],
    colors: ['#4ade80', '#ffffff'],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'A premium printed cotton shirt perfect for ethnic or casual wear. Crafted carefully with breathable fabric to ensure comfort in all weather.'
  }
};

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = mockProducts[params.id] || mockProducts['e1'];
  
  const { addToCart } = useCart();
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes[1]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [openAccordion, setOpenAccordion] = useState<string | null>('details');

  const handleAddToCart = () => {
    addToCart({
      id: `${product.id}-${selectedSize}-${selectedColor}`,
      productId: product.id,
      title: product.title,
      price: product.price,
      image: product.images[0],
      size: selectedSize,
      color: selectedColor,
      quantity: 1
    });
  };

  return (
    <div className={styles.productPage}>
      
      {/* LEFT: Image Gallery */}
      <div className={styles.imageGallery}>
        <div className={styles.thumbnails}>
          {product.images.map((img: string, idx: number) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img 
              key={idx}
              src={img} 
              alt="Thumbnail" 
              className={`${styles.thumbnail} ${activeImage === idx ? styles.active : ''}`}
              onClick={() => setActiveImage(idx)}
            />
          ))}
        </div>
        <div className={styles.mainImageContainer}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={product.images[activeImage]} alt={product.title} className={styles.mainImage} />
        </div>
      </div>

      {/* RIGHT: Details & Buy */}
      <div className={styles.productDetails}>
        
        <div className={styles.breadcrumb}>
          <Link href="/">Home</Link> / <Link href="/collections">Men</Link> / <span>Shirts</span>
        </div>

        <h1 className={styles.title}>{product.title}</h1>
        <p className={styles.price}>Tk {product.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>

        {/* Color Selection */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            <span>Colour: <span style={{ fontWeight: 400, textTransform: 'none' }}>Selected</span></span>
          </div>
          <div className={styles.colors}>
            {product.colors.map((color: string) => (
              <button
                key={color}
                className={`${styles.colorBtn} ${selectedColor === color ? styles.active : ''}`}
                style={{ backgroundColor: color }}
                onClick={() => setSelectedColor(color)}
                aria-label={`Select color ${color}`}
              />
            ))}
          </div>
        </div>

        {/* Size Selection */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            <span>Size: <span style={{ fontWeight: 400, textTransform: 'none' }}>{selectedSize}</span></span>
            <Link href="#" style={{ textDecoration: 'underline', color: '#666', fontWeight: 400, textTransform: 'none'}}>Size Guide</Link>
          </div>
          <div className={styles.sizes}>
            {product.sizes.map((size: string) => (
              <button
                key={size}
                className={`${styles.sizeBtn} ${selectedSize === size ? styles.active : ''}`}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Add to Cart CTA */}
        <div className={styles.actionRow}>
          <button className={styles.addToCart} onClick={handleAddToCart}>
            Add to Cart
          </button>
          <button className={styles.wishlistBtn} aria-label="Add to Wishlist">
            <Heart size={24} strokeWidth={1} />
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', marginBottom: '30px', fontSize: '0.85rem', fontWeight: 500 }}>
          <ShieldCheck size={18} />
          Secure Checkout Guarantee
        </div>

        {/* Details Accordion */}
        <div className={styles.accordion}>
          <div className={styles.accordionItem}>
            <button 
              className={styles.accordionHeader}
              onClick={() => setOpenAccordion(openAccordion === 'details' ? null : 'details')}
            >
              Product Details
              {openAccordion === 'details' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            <div className={`${styles.accordionContent} ${openAccordion === 'details' ? styles.open : ''}`}>
              {product.description}
            </div>
          </div>
          <div className={styles.accordionItem}>
            <button 
              className={styles.accordionHeader}
              onClick={() => setOpenAccordion(openAccordion === 'delivery' ? null : 'delivery')}
            >
              Delivery & Returns
              {openAccordion === 'delivery' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            <div className={`${styles.accordionContent} ${openAccordion === 'delivery' ? styles.open : ''}`}>
              Delivery within 3-5 business days. Returns accepted within 14 days of purchase.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
