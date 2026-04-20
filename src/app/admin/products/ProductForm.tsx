'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Save, Trash2, Globe, Box, Layers, Tag, Eye, Image as ImageIcon } from 'lucide-react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import styles from './ProductForm.module.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface Variant {
  id?: string;
  size: string;
  color: string;
  sku: string;
  price: number | null;
  stock: number;
}

interface ProductFormProps {
  initialData?: any;
  isEditing?: boolean;
}

export default function ProductForm({ initialData, isEditing = false }: ProductFormProps) {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);
  const [collections, setCollections] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Form State
  const [title, setTitle] = useState(initialData?.title || '');
  const [sku, setSku] = useState(initialData?.sku || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [price, setPrice] = useState(initialData?.price || 0);
  const [compareAtPrice, setCompareAtPrice] = useState(initialData?.compareAtPrice || '');
  const [stock, setStock] = useState(initialData?.stock || 0);
  const [collectionId, setCollectionId] = useState(initialData?.collectionId || '');
  const [isDraft, setIsDraft] = useState(initialData?.isDraft || false);
  const [isFeatured, setIsFeatured] = useState(initialData?.isFeatured || false);
  
  // Media
  const [images, setImages] = useState<string[]>(initialData?.images || []);
  const [currentImageUrl, setCurrentImageUrl] = useState('');

  // Variants
  const [sizes, setSizes] = useState<string[]>(initialData?.sizes || []);
  const [colors, setColors] = useState<string[]>(initialData?.colors || []);
  const [variants, setVariants] = useState<Variant[]>(initialData?.variants || []);

  // SEO
  const [metaTitle, setMetaTitle] = useState(initialData?.metaTitle || '');
  const [metaDescription, setMetaDescription] = useState(initialData?.metaDescription || '');
  const [tags, setTags] = useState(initialData?.tags || '');

  // Physical
  const [weight, setWeight] = useState(initialData?.weight || '');
  const [dimensions, setDimensions] = useState(initialData?.dimensions || '');

  useEffect(() => {
    fetch('/api/collections').then(res => res.json()).then(setCollections);
  }, []);

  // Generate variants matrix
  const generateVariants = () => {
    if (sizes.length === 0 || colors.length === 0) return;
    
    const newVariants: Variant[] = [];
    sizes.forEach(size => {
      colors.forEach(color => {
        // Find existing variant to preserve data if possible
        const existing = variants.find(v => v.size === size && v.color === color);
        newVariants.push(existing || {
          size,
          color,
          sku: `${sku}-${size}-${color.replace('#', '')}`.toUpperCase(),
          price: null,
          stock: 0
        });
      });
    });
    setVariants(newVariants);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = {
        title, sku, description, price: Number(price), compareAtPrice: compareAtPrice ? Number(compareAtPrice) : null,
        stock: Number(stock), images, colors, sizes, collectionId: collectionId || null,
        isDraft, isFeatured, metaTitle, metaDescription, tags,
        weight: weight ? Number(weight) : null,
        dimensions, variants,
        items: initialData?.items?.map((i: any) => ({
          id: i.productId,
          quantity: i.quantity,
          price: i.price,
          selectedSize: i.size,
          selectedColor: i.color
        }))
      };

      const url = isEditing ? `/api/products/${initialData.id}` : '/api/products';
      const res = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Failed to save product');
      
      router.push('/admin/products');
      router.refresh();
    } catch (error) {
      alert('Error saving product: ' + (error as any).message);
    } finally {
      setIsSaving(false);
    }
  };

  const addImage = () => {
    if (currentImageUrl && !images.includes(currentImageUrl)) {
      setImages([...images, currentImageUrl]);
      setCurrentImageUrl('');
    }
  };

  return (
    <div className={styles.formWrapper}>
      {/* ── Sticky Header ── */}
      <div className={styles.stickyHeader}>
        <div className={styles.headerLeft}>
          <button className={styles.backBtn} onClick={() => router.back()}>
            <ChevronLeft />
          </button>
          <div className={styles.titleGroup}>
            <h1>{isEditing ? `Edit: ${title}` : 'Create New Product'}</h1>
            <span className={`${styles.statusBadge} ${isDraft ? styles.draft : styles.published}`}>
              {isDraft ? 'Draft' : 'Active'}
            </span>
          </div>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.saveBtn} onClick={handleSave} disabled={isSaving}>
            <Save size={18} /> {isSaving ? 'Syncing...' : 'Save Product'}
          </button>
        </div>
      </div>

      <div className={styles.mainLayout}>
        <div className={styles.contentArea}>
          
          {/* ── Navigation Tabs ── */}
          <div className={styles.tabs}>
            <button className={`${styles.tabBtn} ${activeTab === 'general' ? styles.activeTab : ''}`} onClick={() => setActiveTab('general')}>General</button>
            <button className={`${styles.tabBtn} ${activeTab === 'media' ? styles.activeTab : ''}`} onClick={() => setActiveTab('media')}>Media</button>
            <button className={`${styles.tabBtn} ${activeTab === 'inventory' ? styles.activeTab : ''}`} onClick={() => setActiveTab('inventory')}>Inventory</button>
            <button className={`${styles.tabBtn} ${activeTab === 'variants' ? styles.activeTab : ''}`} onClick={() => setActiveTab('variants')}>Variants</button>
            <button className={`${styles.tabBtn} ${activeTab === 'seo' ? styles.activeTab : ''}`} onClick={() => setActiveTab('seo')}>SEO & Meta</button>
          </div>

          {activeTab === 'general' && (
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2>Basic Information</h2>
                <p>Add descriptive details specifically for your customers.</p>
              </div>
              <div className={styles.formGrid}>
                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label>Product Title</label>
                  <input type="text" placeholder="e.g. Silk Evening Gown" value={title} onChange={e => setTitle(e.target.value)} />
                </div>
                <div className={styles.formGroup}>
                  <label>SKU (Internal ID)</label>
                  <input type="text" placeholder="LA-GOWN-001" value={sku} onChange={e => setSku(e.target.value)} />
                </div>
                <div className={styles.formGroup}>
                  <label>Collection</label>
                  <select value={collectionId} onChange={e => setCollectionId(e.target.value)}>
                    <option value="">No Collection</option>
                    {collections.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label>Description</label>
                  <div className={styles.quillWrapper}>
                    {mounted ? (
                      <textarea
                        className={styles.textareaEditor}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter detailed product description (HTML supported)..."
                        rows={10}
                        style={{
                          width: '100%',
                          padding: '15px',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontFamily: 'inherit',
                          fontSize: '0.9rem',
                          minHeight: '200px',
                          resize: 'vertical'
                        }}
                      />
                    ) : (
                      <div className={styles.quillPlaceholder}>Loading editor...</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'media' && (
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2>Product Media</h2>
                <p>Upload high-resolution images. First image will be the primary thumbnail.</p>
              </div>
              <div className={styles.formGroup}>
                <div className={styles.imageUploadZone} onClick={() => {}}>
                  <ImageIcon size={48} color="#94a3b8" />
                  <p>Paste image URL here and click Add</p>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                    <input 
                      type="text" 
                      className={styles.imageUrlInput}
                      placeholder="https://images.unsplash.com/..." 
                      value={currentImageUrl}
                      onChange={e => setCurrentImageUrl(e.target.value)}
                      onClick={e => e.stopPropagation()}
                    />
                    <button className={styles.addBtnSmall} onClick={(e) => { e.stopPropagation(); addImage(); }}>Add</button>
                  </div>
                </div>
                <div className={styles.imageGrid}>
                   {images.map((img, idx) => (
                     <div key={idx} className={styles.imageContainer}>
                       {/* eslint-disable-next-line @next/next/no-img-element */}
                       <img src={img} alt="Product" className={styles.imageItem} />
                       <button className={styles.removeImg} onClick={() => setImages(images.filter(i => i !== img))}>
                         <Trash2 size={12} />
                       </button>
                     </div>
                   ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'inventory' && (
             <div className={styles.card}>
               <div className={styles.cardHeader}>
                  <h2>Pricing & Stock</h2>
                  <p>Settings for inventory levels and sales prices.</p>
               </div>
               <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label>Base Price (৳)</label>
                    <input type="number" value={price} onChange={e => setPrice(Number(e.target.value))} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Compare Price (৳)</label>
                    <input type="number" value={compareAtPrice} onChange={e => setCompareAtPrice(e.target.value)} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Total Stock</label>
                    <input type="number" value={stock} onChange={e => setStock(Number(e.target.value))} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Weight (kg)</label>
                    <input type="number" step="0.01" value={weight} onChange={e => setWeight(e.target.value)} />
                  </div>
               </div>
             </div>
          )}

          {activeTab === 'variants' && (
             <div className={styles.card}>
                <div className={styles.cardHeader}>
                   <h2>Variants Matrix</h2>
                   <p>Create combinations for Size and Color. Click generate to rebuild.</p>
                </div>
                <div className={styles.formGrid}>
                   <div className={styles.formGroup}>
                      <label>Available Sizes (Comma separated)</label>
                      <input type="text" value={sizes.join(', ')} onChange={e => setSizes(e.target.value.split(',').map(s => s.trim()).filter(Boolean))} />
                   </div>
                   <div className={styles.formGroup}>
                      <label>Available Colors (Code, Comma separated)</label>
                      <input type="text" value={colors.join(', ')} onChange={e => setColors(e.target.value.split(',').map(s => s.trim()).filter(Boolean))} />
                   </div>
                </div>
                <button className={styles.generateBtn} onClick={generateVariants}>
                  <Layers size={14} /> Refresh Matrix
                </button>

                {variants.length > 0 && (
                   <table className={styles.variantTable}>
                      <thead>
                        <tr>
                          <th>Variant</th>
                          <th>SKU</th>
                          <th>Price Override</th>
                          <th>Stock</th>
                        </tr>
                      </thead>
                      <tbody>
                        {variants.map((v, i) => (
                          <tr key={i}>
                            <td><strong>{v.size} / {v.color}</strong></td>
                            <td><input className={styles.vInput} value={v.sku} onChange={e => {
                              const newV = [...variants];
                              newV[i].sku = e.target.value;
                              setVariants(newV);
                            }} /></td>
                            <td><input className={styles.vInput} type="number" placeholder="Default" value={v.price || ''} onChange={e => {
                              const newV = [...variants];
                              newV[i].price = e.target.value ? Number(e.target.value) : null;
                              setVariants(newV);
                            }} /></td>
                            <td><input className={styles.vInput} type="number" value={v.stock} onChange={e => {
                               const newV = [...variants];
                               newV[i].stock = Number(e.target.value);
                               setVariants(newV);
                            }} /></td>
                          </tr>
                        ))}
                      </tbody>
                   </table>
                )}
             </div>
          )}

          {activeTab === 'seo' && (
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2>Search Engine Optimization</h2>
                <p>Improve your ranking on Google and social sharing previews.</p>
              </div>
              <div className={styles.formGrid}>
                 <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label>Meta Title</label>
                    <input type="text" placeholder="Luxurious Silk Evening Gown - LuxeAura" value={metaTitle} onChange={e => setMetaTitle(e.target.value)} />
                 </div>
                 <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label>Meta Description</label>
                    <textarea rows={3} placeholder="Experience the ultimate luxury with our..." value={metaDescription} onChange={e => setMetaDescription(e.target.value)} />
                 </div>
                 <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label>Tags (Comma separated)</label>
                    <input type="text" placeholder="silk, evening, premium, luxury" value={tags} onChange={e => setTags(e.target.value)} />
                 </div>
              </div>
            </div>
          )}

        </div>

        {/* ── Sidebar ── */}
        <div className={styles.sidebar}>
          <div className={styles.card}>
             <div className={styles.cardHeader}>
                <h2>Product Status</h2>
             </div>
             <div className={styles.formGroup}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input type="checkbox" checked={isDraft} onChange={e => setIsDraft(e.target.checked)} />
                  <span style={{ textTransform: 'none', fontWeight: 500 }}>Save as Draft</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '12px' }}>
                  <input type="checkbox" checked={isFeatured} onChange={e => setIsFeatured(e.target.checked)} />
                  <span style={{ textTransform: 'none', fontWeight: 500 }}>Featured Product</span>
                </label>
             </div>
          </div>

          <div className={styles.card} style={{ marginTop: '24px' }}>
             <div className={styles.cardHeader}>
                <h2>Preview</h2>
             </div>
             <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Check how the product looks on the store.</p>
             <button className={styles.previewBtn} onClick={() => window.open(`/products/${initialData?.slug || ''}`, '_blank')}>
                <Eye size={16} /> View in Store
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
