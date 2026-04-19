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
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Collections</h1>
        <button className={styles.createBtn} onClick={() => openModal()}>
          <Plus size={20} />
          Create Collection
        </button>
      </div>

      {isLoading ? (
        <p>Loading collections...</p>
      ) : collections.length === 0 ? (
        <p>No collections found.</p>
      ) : (
        <div className={styles.grid}>
          {collections.map((collection) => (
            <div key={collection.id} className={styles.card}>
              {collection.coverImage && (
                <div style={{ height: '150px', overflow: 'hidden', borderTopLeftRadius: '12px', borderTopRightRadius: '12px', margin: '-1.5rem -1.5rem 1rem -1.5rem' }}>
                  <img src={collection.coverImage} alt={collection.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
              <div className={styles.cardHeader}>
                <h3>{collection.name}</h3>
                <span className={`${styles.badge} ${!collection.isActive ? styles.inactive : ''}`}>
                  {collection.isActive ? 'Active' : 'Draft'}
                </span>
              </div>
              <p className={styles.description}>{collection.description || 'No description provided.'}</p>
              
              <div className={styles.stats}>
                <div className={styles.stat}>
                  <Package size={16} />
                  <span>{collection._count?.products || 0} Products</span>
                </div>
              </div>

              <div className={styles.actions}>
                <button className={styles.editBtn} onClick={() => openModal(collection)}>
                  <Edit size={16} /> Edit
                </button>
                <button className={styles.deleteBtn} onClick={() => handleDelete(collection.id)}>
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>{editingCollection ? 'Edit Collection' : 'Create Collection'}</h2>
              <button className={styles.closeBtn} onClick={closeModal}>&times;</button>
            </div>

            {error && <div style={{ color: 'red', marginBottom: '1rem', padding: '0.5rem', background: '#ffe4e6', borderRadius: '4px' }}>{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label>Collection Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={handleNameChange} 
                  required 
                  placeholder="e.g. Summer Elements"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Slug</label>
                <input 
                  type="text" 
                  value={slug} 
                  onChange={(e) => setSlug(e.target.value)} 
                  required 
                  placeholder="e.g. summer-elements"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Description</label>
                <textarea 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  rows={3}
                  placeholder="Brief description of the collection..."
                />
              </div>

              <div className={styles.formGroup}>
                <label>Cover Image URL</label>
                <input 
                  type="text" 
                  value={coverImage} 
                  onChange={(e) => setCoverImage(e.target.value)} 
                  placeholder="https://..."
                />
              </div>

              <div className={styles.formGroup}>
                <div className={styles.checkboxGroup}>
                  <input 
                    type="checkbox" 
                    id="isActive"
                    checked={isActive} 
                    onChange={(e) => setIsActive(e.target.checked)} 
                  />
                  <label htmlFor="isActive">Make Collection Active</label>
                </div>
              </div>

              <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Collection'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
