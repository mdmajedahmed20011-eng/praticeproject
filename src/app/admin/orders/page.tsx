import { Search, Edit, Trash2, Eye } from 'lucide-react';
import styles from './page.module.css';

export default function AdminOrdersPage() {
  return (
    <div className={styles.ordersPage}>
      <div className={styles.header}>
        <div>
          <h1>Orders</h1>
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
            <option>Pending</option>
            <option>Shipped</option>
            <option>Delivered</option>
            <option>Cancelled</option>
          </select>
          <select>
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>This Year</option>
          </select>
        </div>
      </div>

      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Total</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><span className={styles.orderId}>#ORD-8942</span></td>
              <td>
                <div className={styles.customerInfo}>
                  <p className={styles.customerName}>Majed Ahmed</p>
                  <p className={styles.customerEmail}>majed@example.com</p>
                </div>
              </td>
              <td>Oct 24, 2026</td>
              <td style={{ fontWeight: 600 }}>Tk 2,450</td>
              <td><span className={styles.statusBadge} data-status="pending">Pending</span></td>
              <td><span className={styles.paymentBadge}>COD</span></td>
              <td>
                <div className={styles.actions}>
                  <button className={styles.iconBtn} title="View Details"><Eye size={16} /></button>
                  <button className={styles.iconBtn} title="Edit Status"><Edit size={16} /></button>
                </div>
              </td>
            </tr>
            {/* Additional mock rows... */}
            <tr>
              <td><span className={styles.orderId}>#ORD-8941</span></td>
              <td>
                <div className={styles.customerInfo}>
                  <p className={styles.customerName}>Rifat Rahman</p>
                  <p className={styles.customerEmail}>rifat@example.com</p>
                </div>
              </td>
              <td>Oct 23, 2026</td>
              <td style={{ fontWeight: 600 }}>Tk 4,100</td>
              <td><span className={styles.statusBadge} data-status="shipped">Shipped</span></td>
              <td><span className={styles.paymentBadge}>COD</span></td>
              <td>
                <div className={styles.actions}>
                  <button className={styles.iconBtn} title="View Details"><Eye size={16} /></button>
                  <button className={styles.iconBtn} title="Edit Status"><Edit size={16} /></button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
