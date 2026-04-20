'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, UserPlus, Mail, Phone, ChevronRight, Filter } from 'lucide-react';
import styles from './Customers.module.css';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  totalSpent: number;
  _count?: { orders: number };
  createdAt: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, [search]);

  const fetchCustomers = async () => {
    try {
      const res = await fetch(`/api/customers?search=${search}`);
      const data = await res.json();
      setCustomers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <div className={styles.customersWrapper}>
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <h1>Customer Relations</h1>
          <p>Analyze shopper behavior and manage enterprise profiles.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ position: 'relative' }}>
            <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} size={18} />
            <input 
              type="text" 
              placeholder="Search customers..." 
              style={{ padding: '12px 12px 12px 40px', borderRadius: '12px', border: '1px solid #e2e8f0', width: '300px' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className={styles.iconBtn} style={{ background: '#0ea5e9', color: 'white', border: 'none', padding: '0 20px', borderRadius: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UserPlus size={18} /> Add Customer
          </button>
        </div>
      </div>

      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Total Shoppers</span>
          <span className={styles.metricValue}>{customers.length}</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Avg. Lifetime Value</span>
          <span className={styles.metricValue}>
            ৳{(customers.reduce((acc, c) => acc + c.totalSpent, 0) / (customers.length || 1)).toFixed(0)}
          </span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>New This Month</span>
          <span className={styles.metricValue}>
            {customers.filter(c => new Date(c.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length}
          </span>
        </div>
      </div>

      <div className={styles.tableCard}>
        <div className={styles.tableWrapper}>
          {loading ? (
             <div style={{ padding: '80px', textAlign: 'center', color: '#64748b' }}>Syncing Customer Database...</div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Lifetime Value</th>
                  <th>Order Frequency</th>
                  <th>Last Purchase</th>
                  <th>Contact</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <div className={styles.customerInfo}>
                        <div className={styles.avatar}>{getInitials(c.name)}</div>
                        <div>
                          <span className={styles.name}>{c.name}</span>
                          <span className={styles.email}>{c.email}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                       <span className={styles.spendBadge}>৳{c.totalSpent.toLocaleString()}</span>
                    </td>
                    <td>
                       <span className={styles.orderBadge}>{c._count?.orders || 0} Orders</span>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: '#64748b' }}>
                      {new Date(c.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {c.phone && <div title={c.phone} className={styles.iconBtn}><Phone size={14} /></div>}
                        <div className={styles.iconBtn}><Mail size={14} /></div>
                      </div>
                    </td>
                    <td>
                      <Link href={`/admin/customers/${c.id}`} className={styles.iconBtn}>
                        <ChevronRight size={18} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
