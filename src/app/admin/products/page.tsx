'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Plus, Search, Edit, Trash2, X } from 'lucide-react';
import styles from './page.module.css';

// Dynamically import react-quill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { 
  ssr: false,
  loading: () => <p>Loading editor...</p>
});
import 'react-quill/dist/quill.snow.css';

interface Product {
  id: string;
  title: string;
  slug: string;
  price: number;
  stock: number;
  isDraft: boolean;
  images: string[];
  collectionId: string | null;
  collection?: { name: string };
  // Add other fields as needed
}

interface Collection {
  id: string;
  name: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [compareAtPrice, setCompareAtPrice] = useState<number | ''>('');
  const [stock, setStock] = useState<number>(0);
  const [imagesText, setImagesText] = useState('');
  const [colorsText, setColorsText] = useState('');
  const [sizesText, setSizesText] = useState('');
  const [collectionId, setCollectionId] = useState('');
  const [isDraft, setIsDraft] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [prodRes, collRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/collections')
      ]);
      const prodData = await prodRes.json();
      const collData = await collRes.json();
      setProducts(prodData);
      setCollections(collData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openModal = async (product?: Product) => {
    if (product) {
      // Need to fetch full product details to be sure we have everything
      try {
        const res = await fetch(`/api/products/${product.id}`);
        const fullProduct = await res.json();
        
        setEditingProduct(fullProduct);
        setTitle(fullProduct.title);
        setDescription(fullProduct.description);
        setPrice(fullProduct.price);
        setCompareAtPrice(fullProduct.compareAtPrice || '');
        setStock(fullProduct.stock);
        setImagesText(fullProduct.images.join(', '));
        setColorsText(fullProduct.colors ? fullProduct.colors.join(', ') : '');
        setSizesText(fullProduct.sizes ? fullProduct.sizes.join(', ') : '');
        setCollectionId(fullProduct.collectionId || '');
        setIsDraft(fullProduct.isDraft);
        setIsFeatured(fullProduct.isFeatured);
      } catch (e) {
        console.error(e);
      }
    } else {
      setEditingProduct(null);
      setTitle('');
      setDescription('');
      setPrice('');
      setCompareAtPrice('');
      setStock(10);
      setImagesText('');
      setColorsText('');
      setSizesText('');
      setCollectionId('');
      setIsDraft(false);
      setIsFeatured(false);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Parse comma-separated strings to arrays
    const imagesArray = imagesText.split(',').map(s => s.trim()).filter(Boolean);
    const colorsArray = colorsText.split(',').map(s => s.trim()).filter(Boolean);
    const sizesArray = sizesText.split(',').map(s => s.trim()).filter(Boolean);

    const data = {
      title,
      description,
      price: Number(price),
      compareAtPrice: compareAtPrice ? Number(compareAtPrice) : null,
      stock: Number(stock),
      images: imagesArray,
      colors: colorsArray,
      sizes: sizesArray,
      collectionId: collectionId || null,
      isDraft,
      isFeatured
    };

    const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
    const method = editingProduct ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (!res.ok) throw new Error('Failed to save');
      
      closeModal();
      fetchData();
    } catch (error) {
      console.error(error);
      alert('Error saving product');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (e) {
      console.error(e);
      alert('Error deleting product');
    }
  };

  return (
    <div className={styles.productsPage}>
      <div className={styles.header}>
        <div>
          <h1>Products</h1>
          <p>Manage your inventory, prices, and stock levels.</p>
        </div>
        <button className={styles.addBtn} onClick={() => openModal()}>
          <Plus size={18} />
          Add Product
        </button>
      </div>

      <div className={styles.controls}>
        <div className={styles.searchBox}>
          <Search size={18} color="#64748b" />
          <input type="text" placeholder="Search products..." />
        </div>
        <div className={styles.filters}>
          <select>
            <option>All Collections</option>
            {collections.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select>
            <option>Latest Added</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className={styles.tableCard}>
        {isLoading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>Loading products...</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Product</th>
                <th>Collection</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id}>
                  <td className={styles.productCell}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={product.images[0] || "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=100&q=80"} 
                      alt={product.title} 
                      className={styles.thumb} 
                    />
                    <div className={styles.productInfo}>
                      <p className={styles.productTitle}>{product.title}</p>
                    </div>
                  </td>
                  <td>{product.collection?.name || '-'}</td>
                  <td style={{ fontWeight: 600 }}>Tk {product.price}</td>
                  <td>
                    <span className={styles.stockBadge} data-stock={product.stock > 10 ? "high" : "low"}>
                      {product.stock} in stock
                    </span>
                  </td>
                  <td>
                    <span suppressHydrationWarning className={product.isDraft ? styles.draftBadge : styles.activeBadge}>
                      {product.isDraft ? 'Draft' : 'Published'}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button className={styles.iconBtn} onClick={() => openModal(product)}><Edit size={16} /></button>
                      <button className={`${styles.iconBtn} ${styles.danger}`} onClick={() => handleDelete(product.id)}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>No products found</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
              <button className={styles.closeBtn} onClick={closeModal}><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className={styles.formGrid}>
               <div className={styles.formGroup}>
                 <label>Title</label>
                 <input type="text" value={title} onChange={e => setTitle(e.target.value)} required />
               </div>

               <div className={styles.formGroup}>
                 <label>Collection</label>
                 <select value={collectionId} onChange={e => setCollectionId(e.target.value)}>
                   <option value="">No Collection</option>
                   {collections.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                 </select>
               </div>

               <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                 <label>Description</label>
                 <div className={styles.quillContainer}>
                   <ReactQuill theme="snow" value={description} onChange={setDescription} />
                 </div>
               </div>

               <div className={styles.formGroup}>
                 <label>Price</label>
                 <input type="number" value={price} onChange={e => setPrice(Number(e.target.value))} required min="0" />
               </div>

               <div className={styles.formGroup}>
                 <label>Compare at Price (Optional)</label>
                 <input type="number" value={compareAtPrice} onChange={e => setCompareAtPrice(e.target.value ? Number(e.target.value) : '')} min="0" />
               </div>

               <div className={styles.formGroup}>
                 <label>Stock</label>
                 <input type="number" value={stock} onChange={e => setStock(Number(e.target.value))} required min="0" />
               </div>

               <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                 <label>Images (Comma-separated URLs)</label>
                 <input type="text" value={imagesText} onChange={e => setImagesText(e.target.value)} required placeholder="url1.jpg, url2.jpg" />
               </div>

               <div className={styles.formGroup}>
                 <label>Sizes (Comma-separated)</label>
                 <input type="text" value={sizesText} onChange={e => setSizesText(e.target.value)} placeholder="S, M, L, XL" />
               </div>

               <div className={styles.formGroup}>
                 <label>Colors (Comma-separated hex or names)</label>
                 <input type="text" value={colorsText} onChange={e => setColorsText(e.target.value)} placeholder="Black, #FFFFFF, Navy" />
               </div>

               <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                 <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                   <input type="checkbox" checked={isDraft} onChange={e => setIsDraft(e.target.checked)} />
                   Save as Draft
                 </label>
                 <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                   <input type="checkbox" checked={isFeatured} onChange={e => setIsFeatured(e.target.checked)} />
                   Mark as Featured
                 </label>
               </div>

               <div className={styles.formActions} style={{ gridColumn: '1 / -1' }}>
                 <button type="submit" className={styles.submitBtn}>
                   Save Product
                 </button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
