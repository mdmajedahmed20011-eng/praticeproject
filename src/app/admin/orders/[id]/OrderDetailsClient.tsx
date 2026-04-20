'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, Package, Truck, CheckCircle, 
  MapPin, Phone, Mail, User, Calendar
} from 'lucide-react';
import styles from '../Orders.module.css';

interface OrderDetailsProps {
  order: any;
}

export default function OrderDetailsClient({ order }: OrderDetailsProps) {
  const router = useRouter();
  const [currentStatus, setCurrentStatus] = useState(order.status);
  const [isUpdating, setIsUpdating] = useState(false);

  const statuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
  const statusIndex = statuses.indexOf(currentStatus);

  const updateStatus = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/orders/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setCurrentStatus(newStatus);
        router.refresh();
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className={styles.detailWrapper}>
      <button className={styles.backBtn} onClick={() => router.back()} style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', fontWeight: 600 }}>
        <ArrowLeft size={18} /> Back to CRM
      </button>

      <div className={styles.header}>
        <div className={styles.titleArea}>
          <h1>Order #{order.id.slice(-6).toUpperCase()}</h1>
          <p>Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}</p>
        </div>
        <div className={styles.actionGroup}>
           <select 
             className={styles.filterSelect} 
             value={currentStatus} 
             onChange={(e) => updateStatus(e.target.value)}
             disabled={isUpdating}
             style={{ padding: '10px 20px', fontSize: '0.95rem' }}
           >
             {statuses.concat(['CANCELLED']).map(s => (
               <option key={s} value={s}>{s}</option>
             ))}
           </select>
        </div>
      </div>

      {/* ── Visual Timeline ── */}
      <div className={styles.timelineCard}>
        <div className={styles.cardHeader}>
          <h3>Fulfillment Progress</h3>
        </div>
        <div className={styles.timeline}>
          {statuses.map((step, idx) => (
            <div 
              key={step} 
              className={`${styles.timelineStep} ${idx <= statusIndex ? styles.stepActive : ''}`}
            >
              <div className={styles.stepCircle}>
                {idx < statusIndex ? <CheckCircle size={16} /> : idx === statusIndex ? <div style={{ width: 8, height: 8, background: 'white', borderRadius: '50%' }} /> : null}
              </div>
              <span className={styles.stepLabel}>{step}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.mainLayout} style={{ gridTemplateColumns: 'minmax(0, 1fr) 340px', gap: '24px', display: 'grid' }}>
        <div className={styles.contentArea}>
          {/* ── Order Items ── */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3>Line Items</h3>
            </div>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th style={{ textAlign: 'right' }}>Price</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item: any) => (
                  <tr key={item.id}>
                    <td>
                      <div className={styles.customerInfo}>
                        <span style={{ fontWeight: 700 }}>{item.product.title}</span>
                        <span className={styles.customerEmail}>{item.size ? `Size: ${item.size}` : ''} {item.color ? `| Color: ${item.color}` : ''}</span>
                      </div>
                    </td>
                    <td>x{item.quantity}</td>
                    <td style={{ textAlign: 'right', fontWeight: 700 }}>৳{(item.price * item.quantity).toLocaleString()}</td>
                  </tr>
                ))}
                <tr>
                  <td colSpan={2} style={{ textAlign: 'right', padding: '16px 24px', fontWeight: 600 }}>Subtotal</td>
                  <td style={{ textAlign: 'right', padding: '16px 24px', fontWeight: 700 }}>৳{order.subtotal.toLocaleString()}</td>
                </tr>
                {order.discountAmount > 0 && (
                  <tr>
                    <td colSpan={2} style={{ textAlign: 'right', padding: '16px 24px', color: '#ef4444' }}>Discount</td>
                    <td style={{ textAlign: 'right', padding: '16px 24px', color: '#ef4444' }}>-৳{order.discountAmount.toLocaleString()}</td>
                  </tr>
                )}
                <tr>
                  <td colSpan={2} style={{ textAlign: 'right', padding: '16px 24px', fontSize: '1.2rem', fontWeight: 800 }}>Total</td>
                  <td style={{ textAlign: 'right', padding: '16px 24px', fontSize: '1.2rem', fontWeight: 800, color: '#0ea5e9' }}>৳{order.totalAmount.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className={styles.sidebar}>
          {/* ── Customer Card ── */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><User size={18} /> Customer</h3>
            </div>
            <div className={styles.customerProfile}>
              <div className={styles.formGroup} style={{ marginBottom: '16px' }}>
                <label>Name</label>
                <p style={{ margin: 0, fontWeight: 700 }}>{order.customer?.name || order.guestName}</p>
              </div>
              <div className={styles.formGroup} style={{ marginBottom: '16px' }}>
                <label>Contact</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#475569' }}>
                   <Mail size={14} /> {order.customer?.email || order.guestEmail}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#475569', marginTop: '4px' }}>
                   <Phone size={14} /> {order.customer?.phone || order.guestPhone || 'No phone'}
                </div>
              </div>
            </div>
          </div>

          {/* ── Shipping Card ── */}
          <div className={styles.card} style={{ marginTop: '24px' }}>
            <div className={styles.cardHeader}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><MapPin size={18} /> Delivery Address</h3>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>
              {order.shippingAddress}
            </p>
          </div>

          <div className={styles.card} style={{ marginTop: '24px' }}>
            <div className={styles.cardHeader}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Truck size={18} /> Logistics</h3>
            </div>
            <div className={styles.formGroup}>
              <label>Payment Method</label>
              <span className={styles.statusBadge} style={{ background: '#f1f5f9', color: '#475569', display: 'inline-block', marginTop: '4px' }}>{order.paymentMethod}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
