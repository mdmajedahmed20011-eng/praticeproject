import { prisma } from '@/lib/prisma';
import { connection } from 'next/server';
import styles from './page.module.css';
import { DollarSign, ShoppingBag, Package, AlertCircle } from 'lucide-react';
import DashboardCharts from './DashboardCharts';

export default async function AdminDashboard() {
  await connection();

  const [totalOrders, totalProducts, lowStockProducts, recentOrders] = await Promise.all([
    prisma.order.count(),
    prisma.product.count(),
    prisma.product.count({ where: { stock: { lt: 5 } } }),
    prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { customer: true }
    })
  ]);

  const allOrders = await prisma.order.findMany({ select: { totalAmount: true }});
  const totalRevenue = allOrders.reduce((acc: number, order: { totalAmount: number }) => acc + order.totalAmount, 0);

  // Mock revenue timeseries data since we don't have historical months created
  const revenueData = [
    { name: 'Jan', revenue: 4000 },
    { name: 'Feb', revenue: 3000 },
    { name: 'Mar', revenue: 2000 },
    { name: 'Apr', revenue: 2780 },
    { name: 'May', revenue: 1890 },
    { name: 'Jun', revenue: 2390 },
    { name: 'Jul', revenue: totalRevenue > 0 ? totalRevenue : 3490 },
  ];

  return (
    <div>
      <div className={styles.header}>
        <h1>Dashboard Overview</h1>
        <p>Monitor your store&apos;s performance and analytics.</p>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIconWrapper} style={{ background: '#eff6ff', color: '#3b82f6' }}>
            <DollarSign size={24} />
          </div>
          <div className={styles.statInfo}>
            <h3>Total Revenue</h3>
            <p>৳{totalRevenue.toLocaleString()}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIconWrapper} style={{ background: '#f0fdf4', color: '#22c55e' }}>
            <ShoppingBag size={24} />
          </div>
          <div className={styles.statInfo}>
            <h3>Total Orders</h3>
            <p>{totalOrders}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIconWrapper} style={{ background: '#fdf4ff', color: '#d946ef' }}>
            <Package size={24} />
          </div>
          <div className={styles.statInfo}>
            <h3>Products</h3>
            <p>{totalProducts}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIconWrapper} style={{ background: '#fef2f2', color: '#ef4444' }}>
            <AlertCircle size={24} />
          </div>
          <div className={styles.statInfo}>
            <h3>Low Stock</h3>
            <p>{lowStockProducts}</p>
          </div>
        </div>
      </div>

      <div className={styles.chartsRow}>
        <div className={styles.chartContainer}>
          <h2>Revenue Analytics</h2>
          <DashboardCharts data={revenueData} />
        </div>
      </div>

      <div className={styles.recentOrders}>
        <h2>Recent Orders</h2>
        <table className={styles.ordersTable}>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Status</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order: any) => (
              <tr key={order.id}>
                <td>#{order.id.slice(0, 8)}</td>
                <td>{order.customer?.name || order.guestName || "Guest"}</td>
                <td>
                  <span className={`${styles.badge} ${styles[order.status.toLowerCase()]}`}>
                    {order.status}
                  </span>
                </td>
                <td>৳{order.totalAmount}</td>
              </tr>
            ))}
            {recentOrders.length === 0 && (
              <tr><td colSpan={4} style={{ textAlign: 'center', padding: '20px' }}>No orders yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
