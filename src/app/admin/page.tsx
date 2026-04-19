import { TrendingUp, Users, PackageOpen, DollarSign } from 'lucide-react';
import styles from './page.module.css';

export default function AdminDashboard() {
  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1>Overview</h1>
        <p>Welcome back! Here is what's happening with LuxeAura today.</p>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: '#e0f2fe', color: '#0ea5e9' }}>
            <DollarSign size={24} />
          </div>
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>Total Revenue</p>
            <h3 className={styles.statValue}>Tk 45,231</h3>
            <span className={styles.statTrend} style={{ color: '#10b981' }}>+12.5% from last month</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: '#fef3c7', color: '#d97706' }}>
            <PackageOpen size={24} />
          </div>
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>Active Orders</p>
            <h3 className={styles.statValue}>24</h3>
            <span className={styles.statTrend} style={{ color: '#f59e0b' }}>12 pending shipping</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: '#f3e8ff', color: '#9333ea' }}>
            <Users size={24} />
          </div>
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>Total Customers</p>
            <h3 className={styles.statValue}>1,432</h3>
            <span className={styles.statTrend} style={{ color: '#10b981' }}>+43 new this week</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: '#fee2e2', color: '#e11d48' }}>
            <TrendingUp size={24} />
          </div>
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>Low Stock Items</p>
            <h3 className={styles.statValue}>8</h3>
            <span className={styles.statTrend} style={{ color: '#e11d48' }}>Requires immediate restock</span>
          </div>
        </div>
      </div>

      {/* Advanced Chart or Tables section would go here */}
      <div className={styles.recentActivity}>
        <h2>Recent Orders</h2>
        <div className={styles.tableCard}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer Name</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>#ORD-8942</td>
                <td>Majed Ahmed</td>
                <td>Oct 24, 2026</td>
                <td>Tk 2,450</td>
                <td><span className={styles.statusBadge} data-status="pending">Pending</span></td>
              </tr>
              <tr>
                <td>#ORD-8941</td>
                <td>Rifat Rahman</td>
                <td>Oct 23, 2026</td>
                <td>Tk 4,100</td>
                <td><span className={styles.statusBadge} data-status="shipped">Shipped</span></td>
              </tr>
              <tr>
                <td>#ORD-8940</td>
                <td>Tanim Iqbal</td>
                <td>Oct 22, 2026</td>
                <td>Tk 1,200</td>
                <td><span className={styles.statusBadge} data-status="delivered">Delivered</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
