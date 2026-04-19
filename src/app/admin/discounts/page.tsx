'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Tag } from 'lucide-react';
import styles from './page.module.css';

interface Discount {
  id: string;
  code: string;
  type: string;
  value: number;
  minOrderVal: number | null;
  maxUses: number | null;
  usedCount: number;
  expiresAt: string | null;
  isActive: boolean;
}

export default function AdminDiscountsPage() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);

  // Form State
  const [code, setCode] = useState('');
  const [type, setType] = useState('PERCENTAGE'); // PERCENTAGE or FLAT
  const [value, setValue] = useState<number | ''>('');
  const [minOrderVal, setMinOrderVal] = useState<number | ''>('');
  const [maxUses, setMaxUses] = useState<number | ''>('');
  const [expiresAt, setExpiresAt] = useState('');
  const [isActive, setIsActive] = useState(true);

  const fetchDiscounts = async () => {
    try {
      const res = await fetch('/api/discounts');
      const data = await res.json();
      setDiscounts(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const openModal = (discount?: Discount) => {
    if (discount) {
      setEditingDiscount(discount);
      setCode(discount.code);
      setType(discount.type);
      setValue(discount.value);
      setMinOrderVal(discount.minOrderVal || '');
      setMaxUses(discount.maxUses || '');
      setExpiresAt(discount.expiresAt ? new Date(discount.expiresAt).toISOString().split('T')[0] : '');
      setIsActive(discount.isActive);
    } else {
      setEditingDiscount(null);
      setCode('');
      setType('PERCENTAGE');
      setValue('');
      setMinOrderVal('');
      setMaxUses('');
      setExpiresAt('');
      setIsActive(true);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingDiscount ? `/api/discounts/${editingDiscount.id}` : '/api/discounts';
      const method = editingDiscount ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          type,
          value,
          minOrderVal,
          maxUses,
          expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
          isActive
        })
      });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'Failed to save');
      }

      closeModal();
      fetchDiscounts();
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this discount code?')) return;
    try {
      await fetch(`/api/discounts/${id}`, { method: 'DELETE' });
      fetchDiscounts();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Discounts</h1>
          <p>Create and manage discount codes for your customers.</p>
        </div>
        <button className={styles.createBtn} onClick={() => openModal()}>
          <Plus size={20} /> Create Discount
        </button>
      </div>

      <div className={styles.tableContainer}>
        {isLoading ? (
          <p style={{ padding: '2rem', textAlign: 'center' }}>Loading discounts...</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Code</th>
                <th>Discount</th>
                <th>Condition</th>
                <th>Usage</th>
                <th>Expires</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {discounts.map(d => (
                <tr key={d.id}>
                  <td><span className={styles.codeBadge}>{d.code}</span></td>
                  <td style={{ fontWeight: 600 }}>
                    {d.type === 'PERCENTAGE' ? `${d.value}% OFF` : `Tk ${d.value} OFF`}
                  </td>
                  <td>
                    {d.minOrderVal ? `Min Tk ${d.minOrderVal}` : 'None'}
                  </td>
                  <td>
                    {d.usedCount} {d.maxUses ? `/ ${d.maxUses}` : 'uses'}
                  </td>
                  <td>
                    {d.expiresAt ? new Date(d.expiresAt).toLocaleDateString() : 'Never'}
                  </td>
                  <td>
                    <span className={styles.statusBadge} data-active={d.isActive}>
                      {d.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button className={styles.iconBtn} onClick={() => openModal(d)}>
                        <Edit size={16} />
                      </button>
                      <button className={`${styles.iconBtn} ${styles.danger}`} onClick={() => handleDelete(d.id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {discounts.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}>No discounts found.</td>
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
              <h2>{editingDiscount ? 'Edit Discount' : 'Create Discount'}</h2>
              <button className={styles.closeBtn} onClick={closeModal}><X size={24} /></button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label>Discount Code</label>
                <input 
                  type="text" 
                  value={code} 
                  onChange={e => setCode(e.target.value)} 
                  placeholder="e.g. SUMMER20" 
                  required 
                  style={{ textTransform: 'uppercase' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className={styles.formGroup}>
                  <label>Type</label>
                  <select value={type} onChange={e => setType(e.target.value)}>
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FLAT">Flat Amount (Tk)</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label>Value</label>
                  <input 
                    type="number" 
                    value={value} 
                    onChange={e => setValue(Number(e.target.value))} 
                    required 
                    min="1"
                    max={type === 'PERCENTAGE' ? 100 : undefined}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className={styles.formGroup}>
                  <label>Minimum Order Value (Optional)</label>
                  <input 
                    type="number" 
                    value={minOrderVal} 
                    onChange={e => setMinOrderVal(e.target.value ? Number(e.target.value) : '')} 
                    min="0"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Max Uses (Optional)</label>
                  <input 
                    type="number" 
                    value={maxUses} 
                    onChange={e => setMaxUses(e.target.value ? Number(e.target.value) : '')} 
                    min="1"
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Expiration Date (Optional)</label>
                <input 
                  type="date" 
                  value={expiresAt} 
                  onChange={e => setExpiresAt(e.target.value)} 
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.checkboxLabel}>
                  <input 
                    type="checkbox" 
                    checked={isActive} 
                    onChange={e => setIsActive(e.target.checked)} 
                  />
                  Active
                </label>
              </div>

              <button type="submit" className={styles.submitBtn}>
                Save Discount
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
