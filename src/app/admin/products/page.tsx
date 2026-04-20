'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Plus, Search, Edit, Trash2, Filter, ChevronDown, CheckSquare, Square } from 'lucide-react';
import styles from './page.module.css';

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
}

interface Collection {
  id: string;
  name: string;
}

function AdminProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filtering states
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [collectionFilter, setCollectionFilter] = useState(searchParams.get('collectionId') || 'all');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all');
  const [stockFilter, setStockFilter] = useState(searchParams.get('stock') || 'all');

  // Multi-select
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('q', search);
      if (collectionFilter !== 'all') params.set('collectionId', collectionFilter);
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (stockFilter !== 'all') params.set('stock', stockFilter);

      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  }, [search, collectionFilter, statusFilter, stockFilter]);

  const fetchCollections = async () => {
    try {
      const res = await fetch('/api/collections');
      const data = await res.json();
      setCollections(data);
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 300); // Debounce search
    return () => clearTimeout(timer);
  }, [fetchProducts]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) fetchProducts();
    } catch (e) {
      alert('Error deleting product');
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === products.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(products.map(p => p.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className={styles.productsPage}>
      <div className={styles.header}>
        <div>
          <h1>Products</h1>
          <p>Manage your inventory, prices, and stock levels.</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.exportBtn}>Export CSV</button>
          <button className={styles.addBtn} onClick={() => router.push('/admin/products/new')}>
            <Plus size={18} /> Add Product
          </button>
        </div>
      </div>

      {/* ── Summary Bar ── */}
      <div className={styles.summaryBar}>
        <div className={styles.stat}><strong>{products.length}</strong> Total Products</div>
        <div className={styles.stat}><strong>{products.filter(p => p.isDraft).length}</strong> Drafts</div>
        <div className={styles.stat}><strong>{products.filter(p => p.stock < 5).length}</strong> Low Stock</div>
      </div>

      {/* ── Search & Filter Panel ── */}
      <div className={styles.controls}>
        <div className={styles.searchBox}>
          <Search size={18} color="#64748b" />
          <input 
            type="text" 
            placeholder="Search title, SKU or tags..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <Filter size={14} />
            <select value={collectionFilter} onChange={e => setCollectionFilter(e.target.value)}>
              <option value="all">All Collections</option>
              {collections.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="all">Any Status</option>
            <option value="active">Published</option>
            <option value="draft">Draft</option>
          </select>

          <select value={stockFilter} onChange={e => setStockFilter(e.target.value)}>
            <option value="all">All Inventory</option>
            <option value="in">In Stock</option>
            <option value="low">Low Stock</option>
            <option value="out">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* ── Bulk Actions (Sticky) ── */}
      {selectedIds.length > 0 && (
        <div className={styles.bulkActions}>
           <span>{selectedIds.length} products selected</span>
           <div className={styles.bulkButtons}>
             <button className={styles.bulkBtn}>Publish</button>
             <button className={styles.bulkBtn}>Draft</button>
             <button className={`${styles.bulkBtn} ${styles.danger}`}>Delete</button>
           </div>
        </div>
      )}

      {/* ── Table Container ── */}
      <div className={styles.tableCard}>
        {isLoading ? (
          <div className={styles.loadingState}>
            <div className={styles.spinner} />
            <p>Syncing Inventory...</p>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th style={{ width: '40px', cursor: 'pointer' }} onClick={toggleSelectAll}>
                  {selectedIds.length === products.length && products.length > 0 
                    ? <CheckSquare size={18} color="#0ea5e9" /> 
                    : <Square size={18} color="#cbd5e1" />}
                </th>
                <th>Product</th>
                <th>Collection</th>
                <th>Price</th>
                <th>Inventory</th>
                <th>Status</th>
                <th align="right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id} className={selectedIds.includes(product.id) ? styles.selectedRow : ''}>
                  <td>
                    <div onClick={() => toggleSelect(product.id)} style={{ cursor: 'pointer' }}>
                       {selectedIds.includes(product.id) 
                         ? <CheckSquare size={18} color="#0ea5e9" /> 
                         : <Square size={18} color="#cbd5e1" />}
                    </div>
                  </td>
                  <td className={styles.productCell}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={product.images[0] || "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=100&q=80"} 
                      alt={product.title} 
                      className={styles.pThumb} 
                    />
                    <div className={styles.productInfo}>
                      <span className={styles.pTitle}>{product.title}</span>
                      <span className={styles.pSku}>{product.id.slice(0, 8).toUpperCase()}</span>
                    </div>
                  </td>
                  <td>
                    <span className={styles.collectionBadge}>
                      {product.collection?.name || 'Uncategorized'}
                    </span>
                  </td>
                  <td>
                    <div className={styles.priceInfo}>
                      <span className={styles.currentPrice}>৳{product.price}</span>
                    </div>
                  </td>
                  <td>
                    <div className={styles.inventoryInfo}>
                      <span 
                        className={styles.stockDot} 
                        style={{ backgroundColor: product.stock === 0 ? '#ef4444' : product.stock < 5 ? '#f59e0b' : '#22c55e' }}
                      />
                      <span>{product.stock} in stock</span>
                    </div>
                  </td>
                  <td>
                    <span className={product.isDraft ? styles.badgeDraft : styles.badgeActive}>
                      {product.isDraft ? 'Draft' : 'Live'}
                    </span>
                  </td>
                  <td align="right">
                    <div className={styles.actions}>
                      <button className={styles.iconBtn} onClick={() => router.push(`/admin/products/${product.id}`)}>
                        <Edit size={16} />
                      </button>
                      <button className={`${styles.iconBtn} ${styles.danger}`} onClick={() => handleDelete(product.id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={7} className={styles.emptyState}>
                    <div className={styles.emptyContent}>
                       <Search size={48} />
                       <p>No products found matching your criteria</p>
                       <button onClick={() => { setSearch(''); setCollectionFilter('all'); setStatusFilter('all'); setStockFilter('all'); }}>
                         Clear all filters
                       </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default function AdminProductsPage() {
  return (
    <Suspense fallback={<div>Loading dashboard...</div>}>
      <AdminProductsContent />
    </Suspense>
  );
}

