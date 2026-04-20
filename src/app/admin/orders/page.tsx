'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ShoppingBag, Clock, CheckCircle, Search, 
  Filter, Eye, MoreVertical, DollarSign, Package
} from 'lucide-react';
import styles from './Orders.module.css';

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/orders?status=${statusFilter}&q=${search}`);
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    revenue: orders.reduce((acc, curr) => acc + curr.totalAmount, 0),
    total: orders.length,
    pending: orders.filter(o => o.status === 'PENDING').length,
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING': return styles.pending;
      case 'PROCESSING': return styles.processing;
      case 'SHIPPED': return styles.shipped;
      case 'DELIVERED': return styles.delivered;
      case 'CANCELLED': return styles.cancelled;
      default: return '';
    }
  };

  return (
    <div className={styles.ordersWrapper}>
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <h1>Orders CRM</h1>
          <p>Track, manage, and fulfill your customer requests.</p>
        </div>
      </div>

      {/* ── KPI Metrics ── */}
      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span className={styles.metricLabel}>Total Revenue</span>
            <div className={`${styles.iconBox} ${styles.revenueIcon}`}><DollarSign size={18} /></div>
          </div>
          <span className={styles.metricValue}>৳{stats.revenue.toLocaleString()}</span>
        </div>
        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span className={styles.metricLabel}>Total Orders</span>
            <div className={`${styles.iconBox} ${styles.ordersIcon}`}><ShoppingBag size={18} /></div>
          </div>
          <span className={styles.metricValue}>{stats.total}</span>
        </div>
        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span className={styles.metricLabel}>Pending Fulfillment</span>
            <div className={`${styles.iconBox} ${styles.pendingIcon}`}><Clock size={18} /></div>
          </div>
          <span className={styles.metricValue}>{stats.pending}</span>
        </div>
      </div>

      {/* ── Order Table ── */}
      <div className={styles.tableCard}>
        <div className={styles.filterBar}>
          <div className={styles.searchContainer}>
            <Search className={styles.searchIcon} size={18} />
            <input 
              type="text" 
              placeholder="Search by ID or customer name..." 
              className={styles.searchInput}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchOrders()}
            />
          </div>
          <div className={styles.filterGroup}>
             <select 
               className={styles.filterSelect}
               value={statusFilter}
               onChange={(e) => setStatusFilter(e.target.value)}
             >
               <option value="all">All Status</option>
               <option value="PENDING">Pending</option>
               <option value="PROCESSING">Processing</option>
               <option value="SHIPPED">Shipped</option>
               <option value="DELIVERED">Delivered</option>
               <option value="CANCELLED">Cancelled</option>
             </select>
          </div>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Payment</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: '40px' }}>Syncing with CRM...</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: '40px' }}>No orders found.</td></tr>
              ) : orders.map((order) => (
                <tr key={order.id}>
                  <td className={styles.orderId}>#{order.id.slice(-6).toUpperCase()}</td>
                  <td>
                    <div className={styles.customerInfo}>
                      <span>{order.customer?.name || order.guestName || 'Guest'}</span>
                      <span className={styles.customerEmail}>{order.customer?.email || order.guestEmail}</span>
                    </div>
                  </td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>{order.paymentMethod}</td>
                  <td style={{ fontWeight: 700 }}>৳{order.totalAmount.toLocaleString()}</td>
                  <td>
                    <span className={`${styles.statusBadge} ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <button className={styles.viewBtn} onClick={() => router.push(`/admin/orders/${order.id}`)}>
                      <Eye size={14} style={{ marginRight: '6px' }} /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
