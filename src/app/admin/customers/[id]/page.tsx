'use client';

import { useState, useEffect } from 'react';
import { 
  ArrowLeft, Mail, Phone, MapPin, 
  Calendar, ShoppingBag, CreditCard,
  User, ExternalLink, MessageSquare
} from 'lucide-react';
import Link from 'next/link';
import styles from '../Customers.module.css';

interface CustomerDetail {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  totalSpent: number;
  orders: any[];
  createdAt: string;
}

export default function CustomerDetailPage({ params }: { params: { id: string } }) {
  const [customer, setCustomer] = useState<CustomerDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomer();
  }, []);

  const fetchCustomer = async () => {
    try {
      const res = await fetch(`/api/customers/${params.id}`);
      const data = await res.json();
      setCustomer(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: '100px', textAlign: 'center', color: '#64748b' }}>Retrieving Profile...</div>;
  if (!customer) return <div style={{ padding: '100px', textAlign: 'center' }}>Customer profile not found.</div>;

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <div className={styles.customersWrapper}>
      <div style={{ marginBottom: '16px' }}>
        <Link href="/admin/customers" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>
          <ArrowLeft size={16} /> Back to Relations
        </Link>
      </div>

      <div className={styles.profileHeader}>
        <div className={styles.largeAvatar}>{getInitials(customer.name)}</div>
        <div className={styles.profileInfo}>
          <h1>{customer.name}</h1>
          <div style={{ display: 'flex', gap: '20px', marginTop: '12px', color: '#64748b', fontSize: '0.95rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Mail size={16} /> {customer.email}</span>
            {customer.phone && <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Phone size={16} /> {customer.phone}</span>}
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={16} /> Joined {new Date(customer.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '12px' }}>
          <button className={styles.iconBtn} style={{ padding: '12px 24px', borderRadius: '12px', fontWeight: 700, background: '#f8fafc' }}>
            <MessageSquare size={18} /> Notes
          </button>
          <button className={styles.iconBtn} style={{ padding: '12px 24px', borderRadius: '12px', fontWeight: 700, background: '#0ea5e9', color: 'white', border: 'none' }}>
            Edit Profile
          </button>
        </div>
      </div>

      <div className={styles.profileGrid}>
        <div className={styles.sideCard}>
           <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Lifetime Value (LTV)</span>
              <span className={styles.infoValue} style={{ fontSize: '1.5rem', color: '#0ea5e9' }}>৳{customer.totalSpent.toLocaleString()}</span>
           </div>
           <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Order Conversion</span>
              <span className={styles.infoValue}>{customer.orders.length} Purchases</span>
           </div>
           <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: '4px 0' }} />
           <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Default Shipping</span>
              <span className={styles.infoValue} style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.5 }}>
                {customer.address || 'No address on file'}
              </span>
           </div>
           <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Primary Method</span>
              <span className={styles.infoValue} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CreditCard size={14} /> Cash on Delivery
              </span>
           </div>
        </div>

        <div className={styles.tableCard}>
          <div style={{ padding: '24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontWeight: 800 }}>Purchase History</h3>
            <ShoppingBag size={20} style={{ color: '#94a3b8' }} />
          </div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Items</th>
                <th>Amount</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {customer.orders.map((order) => (
                <tr key={order.id}>
                  <td style={{ fontWeight: 700 }}>#{order.id.substring(0, 8)}</td>
                  <td style={{ fontSize: '0.85rem' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td style={{ fontSize: '0.85rem' }}>
                    {order.items.length} Product(s)
                  </td>
                  <td><span className={styles.spendBadge}>৳{order.totalAmount.toLocaleString()}</span></td>
                  <td>
                    <span style={{ 
                      padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800,
                      background: order.status === 'DELIVERED' ? '#f0fdf4' : '#fff7ed',
                      color: order.status === 'DELIVERED' ? '#16a34a' : '#d97706'
                    }}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <Link href={`/admin/orders/${order.id}`} className={styles.iconBtn}>
                      <ExternalLink size={14} />
                    </Link>
                  </td>
                </tr>
              ))}
              {customer.orders.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>No transactions recorded yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
