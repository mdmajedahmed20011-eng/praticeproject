'use client';

import { useState, useEffect } from 'react';
import { Search, Edit, Eye, X } from 'lucide-react';
import styles from './page.module.css';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  
  const [status, setStatus] = useState('');
  const [trackingId, setTrackingId] = useState('');
  const [adminNotes, setAdminNotes] = useState('');

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const openModal = (order: any) => {
    setSelectedOrder(order);
    setStatus(order.status);
    setTrackingId(order.trackingId || '');
    setAdminNotes(order.adminNotes || '');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/orders/${selectedOrder.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, trackingId, adminNotes })
      });
      if (!res.ok) throw new Error('Failed to update');
      closeModal();
      fetchOrders();
    } catch (error) {
      console.error(error);
      alert('Error updating order');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'pending';
      case 'PROCESSING': return 'processing';
      case 'SHIPPED': return 'shipped';
      case 'DELIVERED': return 'delivered';
      case 'CANCELLED': return 'cancelled';
      default: return 'pending';
    }
  };

  return (
    <div className={styles.ordersPage}>
      <div className={styles.header}>
        <div>
          <h1>Orders CRM</h1>
          <p>Manage customer orders, track shipments, and update statuses.</p>
        </div>
      </div>

      <div className={styles.controls}>
        <div className={styles.searchBox}>
          <Search size={18} color="#64748b" />
          <input type="text" placeholder="Search orders by ID or customer..." />
        </div>
        <div className={styles.filters}>
          <select>
            <option>All Statuses</option>
            <option>PENDING</option>
            <option>PROCESSING</option>
            <option>SHIPPED</option>
            <option>DELIVERED</option>
            <option>CANCELLED</option>
          </select>
        </div>
      </div>

      <div className={styles.tableCard}>
        {isLoading ? (
          <p style={{ padding: '2rem', textAlign: 'center' }}>Loading orders...</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td><span className={styles.orderId}>#{order.id.split('-')[0].toUpperCase()}</span></td>
                  <td>
                    <div className={styles.customerInfo}>
                      <p className={styles.customerName}>{order.guestName}</p>
                      <p className={styles.customerEmail}>{order.guestPhone || order.guestEmail}</p>
                    </div>
                  </td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>{order.items?.length || 0} items</td>
                  <td style={{ fontWeight: 600 }}>Tk {order.totalAmount}</td>
                  <td>
                    <span className={styles.statusBadge} data-status={getStatusColor(order.status)}>
                      {order.status}
                    </span>
                  </td>
                  <td><span className={styles.paymentBadge}>{order.paymentMethod}</span></td>
                  <td>
                    <div className={styles.actions}>
                      <button className={styles.iconBtn} title="View / Edit Details" onClick={() => openModal(order)}>
                        <Eye size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '2rem' }}>No orders found</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && selectedOrder && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>Order Details - #{selectedOrder.id.split('-')[0].toUpperCase()}</h2>
              <button className={styles.closeBtn} onClick={closeModal}><X size={24} /></button>
            </div>
            
            <div className={styles.orderDetailsGrid}>
              <div className={styles.customerSection}>
                <h3>Customer Information</h3>
                <p><strong>Name:</strong> {selectedOrder.guestName}</p>
                <p><strong>Email:</strong> {selectedOrder.guestEmail}</p>
                <p><strong>Phone:</strong> {selectedOrder.guestPhone || 'N/A'}</p>
                <p><strong>Address:</strong> {selectedOrder.shippingAddress}</p>
              </div>
              
              <div className={styles.itemsSection}>
                <h3>Order Items</h3>
                <ul className={styles.itemsList}>
                  {selectedOrder.items?.map((item: any) => (
                    <li key={item.id}>
                      Product ID: {item.productId.split('-')[0]} - Qty: {item.quantity} - Tk {item.price}
                      {(item.size || item.color) && <span> ({item.size} / {item.color})</span>}
                    </li>
                  ))}
                </ul>
                <p><strong>Subtotal:</strong> Tk {selectedOrder.subtotal}</p>
                <p><strong>Total:</strong> Tk {selectedOrder.totalAmount}</p>
              </div>
            </div>

            <form onSubmit={handleUpdate} className={styles.updateForm}>
              <h3>Update Status</h3>
              
              <div className={styles.formGroup}>
                <label>Order Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="PENDING">Pending</option>
                  <option value="PROCESSING">Processing</option>
                  <option value="SHIPPED">Shipped</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Tracking ID (if Shipped)</label>
                <input type="text" value={trackingId} onChange={(e) => setTrackingId(e.target.value)} placeholder="e.g. REDX-12345" />
              </div>

              <div className={styles.formGroup}>
                <label>Admin Notes</label>
                <textarea 
                  value={adminNotes} 
                  onChange={(e) => setAdminNotes(e.target.value)} 
                  placeholder="Notes for internal use..."
                  rows={3}
                />
              </div>

              <button type="submit" className={styles.submitBtn}>
                Update Order
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
