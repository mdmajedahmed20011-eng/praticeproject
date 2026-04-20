'use client';

import { useState, useEffect } from 'react';
import styles from './collections.module.css';
import { Plus, Package, Edit, Trash2 } from 'lucide-react';

interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  coverImage: string | null;
  isActive: boolean;
  _count?: {
    products: number;
  };
}

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchCollections = async () => {
    try {
      const res = await fetch('/api/collections');
      const data = await res.json();
      setCollections(data);
    } catch (err) {
      console.error('Failed to fetch collections', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (!editingCollection) {
      setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
    }
  };

  const openModal = (collection?: Collection) => {
    if (collection) {
      setEditingCollection(collection);
      setName(collection.name);
      setSlug(collection.slug);
      setDescription(collection.description || '');
      setCoverImage(collection.coverImage || '');
      setIsActive(collection.isActive);
    } else {
      setEditingCollection(null);
      setName('');
      setSlug('');
      setDescription('');
      setCoverImage('');
      setIsActive(true);
    }
    setError('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCollection(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const url = editingCollection 
        ? `/api/collections/${editingCollection.id}` 
        : '/api/collections';
        
      const method = editingCollection ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          slug,
          description,
          coverImage,
          isActive,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Something went wrong');
      }

      await fetchCollections();
      closeModal();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this collection?')) return;
    
    try {
      const res = await fetch(`/api/collections/${id}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) throw new Error('Failed to delete');
      
      setCollections(collections.filter(c => c.id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete collection');
    }
  };

  return (
    <div className={styles.collectionsWrapper}>
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <h1>Collections</h1>
          <p>Organize your products into curated, high-impact categories.</p>
        </div>
        <button className={styles.createBtn} onClick={() => openModal()}>
          <Plus size={20} /> Create Collection
        </button>
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '100px', color: '#64748b' }}>Orchestrating Collections...</div>
      ) : collections.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '100px', background: '#f8fafc', borderRadius: '24px', border: '2px dashed #e2e8f0' }}>
           <p style={{ margin: 0, fontWeight: 600, color: '#64748b' }}>No collections found yet. Start curating your store.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {collections.map((collection) => (
            <div key={collection.id} className={styles.card}>
              <div className={styles.imageOverlay}>
                <img 
                  src={collection.coverImage || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1000'} 
                  alt={collection.name} 
                  className={styles.coverImage} 
                />
                <span className={`${styles.statusRibbon} ${collection.isActive ? styles.activeRibbon : styles.draftRibbon}`}>
                  {collection.isActive ? 'Active' : 'Draft'}
                </span>
              </div>
              
              <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>{collection.name}</h3>
                <p className={styles.description}>{collection.description || 'No description provided.'}</p>
                
                <div className={styles.cardFooter}>
                  <div className={styles.productCount}>
                    <Package size={16} />
                    <span>{collection._count?.products || 0} Products</span>
                  </div>
                  <div className={styles.actions}>
                    <button className={styles.iconBtn} onClick={() => openModal(collection)}>
                      <Edit size={16} />
                    </button>
                    <button className={`${styles.iconBtn} ${styles.dangerBtn}`} onClick={() => handleDelete(collection.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>{editingCollection ? 'Refine Collection' : 'New Collection'}</h2>
              <button className={styles.closeBtn} onClick={closeModal} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#64748b' }}>&times;</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className={styles.modalBody}>
                <div className={styles.formGroup}>
                  <label>Title</label>
                  <input 
                    type="text" 
                    className={styles.input}
                    value={name} 
                    onChange={handleNameChange} 
                    required 
                    placeholder="e.g. Luxury Timepieces"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Handle (Slug)</label>
                  <input 
                    type="text" 
                    className={styles.input}
                    value={slug} 
                    onChange={(e) => setSlug(e.target.value)} 
                    required 
                    placeholder="luxury-timepieces"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Description (Aspirational)</label>
                  <textarea 
                    className={styles.textarea}
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    rows={3}
                    placeholder="Explain the essence of this collection..."
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Cover Media URL</label>
                  <input 
                    type="text" 
                    className={styles.input}
                    value={coverImage} 
                    onChange={(e) => setCoverImage(e.target.value)} 
                    placeholder="https://..."
                  />
                </div>

                <div className={styles.checkboxGroup} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input 
                    type="checkbox" 
                    id="isActive"
                    checked={isActive} 
                    onChange={(e) => setIsActive(e.target.checked)} 
                    style={{ width: '18px', height: '18px' }}
                  />
                  <label htmlFor="isActive" style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1e293b' }}>Published & Visible</label>
                </div>

                <button type="submit" className={styles.createBtn} disabled={isSubmitting} style={{ width: '100%', justifyContent: 'center', marginTop: '12px' }}>
                  {isSubmitting ? 'Syncing...' : 'Save Collection'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
