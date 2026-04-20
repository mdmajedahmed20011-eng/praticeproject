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

  const usagePercentage = (d: Discount) => {
    if (!d.maxUses) return 0;
    return Math.min(100, (d.usedCount / d.maxUses) * 100);
  };

  const isExpired = (date: string | null) => {
    if (!date) return false;
    return new Date(date) < new Date();
  };

  return (
    <div className={styles.discountsWrapper}>
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <h1>Promotions</h1>
          <p>Drive sales with bespoke discount codes and automated campaigns.</p>
        </div>
        <button className={styles.createBtn} onClick={() => openModal()}>
          <Plus size={20} /> Create Discount
        </button>
      </div>

      {/* ── KPI Cards ── */}
      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Active Coupons</span>
          <span className={styles.metricValue}>{discounts.filter(d => d.isActive && !isExpired(d.expiresAt)).length}</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Total Redemptions</span>
          <span className={styles.metricValue}>{discounts.reduce((acc, d) => acc + d.usedCount, 0)}</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Scheduled/Expired</span>
          <span className={styles.metricValue}>{discounts.filter(d => isExpired(d.expiresAt)).length}</span>
        </div>
      </div>

      <div className={styles.tableCard}>
        <div className={styles.tableWrapper}>
          {isLoading ? (
            <div style={{ padding: '80px', textAlign: 'center', color: '#64748b' }}>Syncing Promotions...</div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Campaign Code</th>
                  <th>Benefit</th>
                  <th>Restrictions</th>
                  <th>Usage Tracking</th>
                  <th>Expiration</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {discounts.map(d => (
                  <tr key={d.id}>
                    <td><span className={styles.codeBadge}>{d.code}</span></td>
                    <td style={{ fontWeight: 700 }}>
                      {d.type === 'PERCENTAGE' ? `${d.value}% OFF` : `৳${d.value} OFF`}
                    </td>
                    <td style={{ fontSize: '0.85rem', color: '#64748b' }}>
                      {d.minOrderVal ? `Min Order ৳${d.minOrderVal}` : 'No Minimum'}
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                         <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{d.usedCount} / {d.maxUses || '∞'}</span>
                         {d.maxUses && (
                           <div className={styles.usageBarContainer}>
                              <div className={styles.usageBar} style={{ width: `${usagePercentage(d)}%`, background: usagePercentage(d) > 90 ? '#ef4444' : '#0ea5e9' }} />
                           </div>
                         )}
                      </div>
                    </td>
                    <td>
                      {d.expiresAt ? new Date(d.expiresAt).toLocaleDateString() : 'Never'}
                    </td>
                    <td>
                      <span className={`${styles.statusBadge} ${isExpired(d.expiresAt) ? styles.expired : d.isActive ? styles.active : styles.inactive}`}>
                        {isExpired(d.expiresAt) ? 'Expired' : d.isActive ? 'Active' : 'Draft'}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <button className={styles.iconBtn} onClick={() => openModal(d)}>
                          <Edit size={16} />
                        </button>
                        <button className={`${styles.iconBtn} ${styles.dangerBtn}`} onClick={() => handleDelete(d.id)}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {discounts.length === 0 && (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>No active campaigns. Create one to boost store momentum.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader} style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between' }}>
              <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>{editingDiscount ? 'Campaign Settings' : 'New Campaign'}</h2>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem', color: '#64748b' }}>&times;</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label>Discount Code</label>
                <input 
                  type="text" 
                  className={styles.input}
                  value={code} 
                  onChange={e => setCode(e.target.value)} 
                  placeholder="e.g. LUXE20" 
                  required 
                  style={{ textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className={styles.formGroup}>
                  <label>Type</label>
                  <select className={styles.input} value={type} onChange={e => setType(e.target.value)}>
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FLAT">Flat Amount (৳)</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label>Value</label>
                  <input 
                    type="number" 
                    className={styles.input}
                    value={value} 
                    onChange={e => setValue(Number(e.target.value))} 
                    required 
                    min="1"
                    max={type === 'PERCENTAGE' ? 100 : undefined}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className={styles.formGroup}>
                  <label>Min Requirement (৳)</label>
                  <input 
                    type="number" 
                    className={styles.input}
                    value={minOrderVal} 
                    onChange={e => setMinOrderVal(e.target.value ? Number(e.target.value) : '')} 
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Max Uses</label>
                  <input 
                    type="number" 
                    className={styles.input}
                    value={maxUses} 
                    onChange={e => setMaxUses(e.target.value ? Number(e.target.value) : '')} 
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Expires On</label>
                <input 
                  type="date" 
                  className={styles.input}
                  value={expiresAt} 
                  onChange={e => setExpiresAt(e.target.value)} 
                />
              </div>

              <div className={styles.checkboxGroup} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '12px' }}>
                <input 
                  type="checkbox" 
                  id="isActive"
                  checked={isActive} 
                  onChange={e => setIsActive(e.target.checked)} 
                  style={{ width: '18px', height: '18px' }}
                />
                <label htmlFor="isActive" style={{ fontSize: '0.9rem', fontWeight: 600 }}>Enable Campaign</label>
              </div>

              <button type="submit" className={styles.submitBtn}>
                {editingDiscount ? 'Update Campaign' : 'Initialize Campaign'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
