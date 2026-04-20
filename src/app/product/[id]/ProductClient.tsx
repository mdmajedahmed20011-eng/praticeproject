'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';
import RecentlyViewed from '@/components/RecentlyViewed/RecentlyViewed';
import Image from 'next/image';
import styles from './page.module.css';

interface ProductClientProps {
  product: any;
}

export default function ProductClient({ product }: ProductClientProps) {
  const { addToCart } = useCart();
  const { addViewedItem } = useRecentlyViewed();
  const router = useRouter();
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes[1]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [openAccordion, setOpenAccordion] = useState<string | null>('details');

  useEffect(() => {
    addViewedItem({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.images[0]
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id]);

  const getCartItem = () => ({
    id: `${product.id}-${selectedSize}-${selectedColor}`,
    productId: product.id,
    title: product.title,
    price: product.price,
    image: product.images[0],
    size: selectedSize,
    color: selectedColor,
    quantity: 1
  });

  const handleAddToCart = () => {
    addToCart(getCartItem());
  };

  const handleBuyNow = () => {
    addToCart(getCartItem());
    router.push('/checkout');
  };

  return (
    <>
    <div className={styles.productPage}>
      
      {/* LEFT: Image Gallery */}
      <div className={styles.imageGallery}>
        <div className={styles.thumbnails}>
          {product.images.map((img: string, idx: number) => (
            <div 
              key={idx}
              className={`${styles.thumbnailWrapper} ${activeImage === idx ? styles.active : ''}`}
              style={{ position: 'relative', width: '80px', height: '100px', cursor: 'pointer', flexShrink: 0 }}
              onClick={() => setActiveImage(idx)}
            >
              <Image 
                src={img} 
                alt="Thumbnail" 
                fill
                sizes="80px"
                className={styles.thumbnail}
                style={{ objectFit: 'cover' }}
              />
            </div>
          ))}
        </div>
        <div className={styles.mainImageContainer} style={{ position: 'relative', flex: 1, minHeight: '600px' }}>
          <Image 
            src={product.images[activeImage]} 
            alt={product.title} 
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className={styles.mainImage} 
            style={{ objectFit: 'cover' }}
          />
        </div>
      </div>

      {/* RIGHT: Details & Buy */}
      <div className={styles.productDetails}>
        
        <div className={styles.breadcrumb}>
          <Link href="/">Home</Link> / <Link href="/collections">Men</Link> / <span>Shirts</span>
        </div>

        <h1 className={styles.title}>{product.title}</h1>
        <p className={styles.price}>৳{product.price.toLocaleString()}</p>

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

        {/* Add to Cart / Buy Now CTA */}
        <div className={styles.actionRow}>
          <button className={styles.addToCart} onClick={handleAddToCart}>
            Add to Bag
          </button>
          <button className={styles.buyNow} onClick={handleBuyNow}>
            Buy Now
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
    
    <RecentlyViewed />
    </>
  );
}
