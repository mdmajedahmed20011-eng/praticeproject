import { prisma } from '@/lib/prisma';
import { connection } from 'next/server';
import styles from './page.module.css';
import { 
  DollarSign, ShoppingBag, Package, AlertCircle, 
  TrendingUp, TrendingDown, Users, CreditCard,
  ArrowUpRight, Clock, Box, CheckCircle2
} from 'lucide-react';
import DashboardCharts from './DashboardCharts';

// Native date formatter helper
const formatDate = (date: Date, options: Intl.DateTimeFormatOptions) => {
  return new Intl.DateTimeFormat('en-US', options).format(date);
};

export default async function AdminDashboard() {
  await connection();
  
  // -- Data Fetching --
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  const [
    totalOrders, 
    totalProducts, 
    lowStockProducts, 
    recentOrders,
    totalCustomers,
    revenueByStatus,
    topItems,
    currentMonthOrders,
    lastMonthOrders
  ] = await Promise.all([
    prisma.order.count(),
    prisma.product.count(),
    prisma.product.count({ where: { stock: { lt: 5 } } }),
    prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { customer: true }
    }),
    prisma.customer.count(),
    prisma.order.groupBy({
      by: ['status'],
      _count: { _all: true },
      _sum: { totalAmount: true }
    }),
    prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5
    }),
    prisma.order.findMany({
      where: { createdAt: { gte: startOfMonth } },
      select: { totalAmount: true }
    }),
    prisma.order.findMany({
      where: { createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } },
      select: { totalAmount: true }
    })
  ]);

  // -- Calculations --
  const totalRevenue = (await prisma.order.aggregate({ _sum: { totalAmount: true } }))._sum.totalAmount || 0;
  const aov = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  
  const currentMonthRevenue = currentMonthOrders.reduce((acc, o) => acc + o.totalAmount, 0);
  const lastMonthRevenue = lastMonthOrders.reduce((acc, o) => acc + o.totalAmount, 0);
  const revenueGrowth = lastMonthRevenue > 0 
    ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
    : 0;

  // Enhance Top Products with titles
  const topProductDetails = await Promise.all(
    topItems.map(async (item) => {
      const p = await prisma.product.findUnique({ 
        where: { id: item.productId },
        select: { title: true, images: true, price: true }
      });
      return { ...item, ...p };
    })
  );

  // Status breakdown for Donut chart
  const statusData = revenueByStatus.map(s => ({
    name: s.status,
    value: s._count._all,
    color: s.status === 'DELIVERED' ? '#22c55e' : 
           s.status === 'PENDING' ? '#f59e0b' : 
           s.status === 'CANCELLED' ? '#ef4444' : '#3b82f6'
  }));

  // Mock revenue timeseries data (weekly for last 7 days)
  const revenueData = [
    { name: 'Mon', revenue: 4000 },
    { name: 'Tue', revenue: 3000 },
    { name: 'Wed', revenue: 2000 },
    { name: 'Thu', revenue: 2780 },
    { name: 'Fri', revenue: 1890 },
    { name: 'Sat', revenue: 2390 },
    { name: 'Sun', revenue: currentMonthRevenue > 0 ? currentMonthRevenue : 3490 },
  ];

  return (
    <div className={styles.container}>
      {/* ── Welcome Header ── */}
      <div className={styles.welcomeHeader}>
        <div>
          <span className={styles.dateLabel}>{formatDate(now, { weekday: 'long', month: 'long', day: 'numeric' })}</span>
          <h1>Good Morning, Admin 👋</h1>
          <p>Here&apos;s what&apos;s happening with your store today.</p>
        </div>
        <div className={styles.quickActions}>
          <button className={styles.actionBtn}>
            <Clock size={16} /> Activity Log
          </button>
          <button className={styles.actionBtnPrimary}>
            <Package size={16} /> Add Product
          </button>
        </div>
      </div>

      {/* ── KPI Stats Grid ── */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statTop}>
            <div className={styles.statIconWrapper} style={{ background: '#eff6ff', color: '#2563eb' }}>
              <DollarSign size={20} />
            </div>
            <div className={`${styles.trend} ${revenueGrowth >= 0 ? styles.positive : styles.negative}`}>
              {revenueGrowth >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {Math.abs(revenueGrowth).toFixed(1)}%
            </div>
          </div>
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>Total Revenue</p>
            <h3>৳{totalRevenue.toLocaleString()}</h3>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statTop}>
            <div className={styles.statIconWrapper} style={{ background: '#f0fdf4', color: '#16a34a' }}>
              <ShoppingBag size={20} />
            </div>
            <div className={styles.trend}>+12 this week</div>
          </div>
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>Total Orders</p>
            <h3>{totalOrders}</h3>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statTop}>
            <div className={styles.statIconWrapper} style={{ background: '#fef2f2', color: '#dc2626' }}>
              <CreditCard size={20} />
            </div>
          </div>
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>Avg. Order Value</p>
            <h3>৳{aov.toFixed(0)}</h3>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statTop}>
            <div className={styles.statIconWrapper} style={{ background: '#fdf4ff', color: '#c026d3' }}>
              <Users size={20} />
            </div>
          </div>
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>Total Customers</p>
            <h3>{totalCustomers}</h3>
          </div>
        </div>
      </div>

      {/* ── Charts & Main Insights ── */}
      <div className={styles.gridRow}>
        <div className={styles.mainChartCard}>
          <div className={styles.cardHeader}>
            <div>
              <h3>Revenue Performance</h3>
              <p>Weekly revenue breakdown</p>
            </div>
            <select className={styles.chartSelect}>
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <DashboardCharts type="area" data={revenueData} />
        </div>

        <div className={styles.sideCard}>
          <div className={styles.cardHeader}>
            <h3>Order Status</h3>
          </div>
          <div className={styles.donutContainer}>
             <DashboardCharts type="pie" data={statusData} />
             <div className={styles.statusLegend}>
               {statusData.map(s => (
                 <div key={s.name} className={styles.legendItem}>
                   <span className={styles.dot} style={{ background: s.color }} />
                   <span className={styles.name}>{s.name}</span>
                   <span className={styles.val}>{s.value}</span>
                 </div>
               ))}
             </div>
          </div>
        </div>
      </div>

      {/* ── Sub Row ── */}
      <div className={styles.gridRowThree}>
        {/* Top Products */}
        <div className={styles.subCard}>
          <div className={styles.cardHeader}>
            <h3>Top Selling Products</h3>
            <button className={styles.viewLink}>View All</button>
          </div>
          <div className={styles.topProductsList}>
            {topProductDetails.map((p: any, i) => (
              <div key={p.productId} className={styles.productRow}>
                <div className={styles.rank}>#{i+1}</div>
                <div className={styles.productInfoMini}>
                  <p className={styles.pTitle}>{p.title}</p>
                  <span className={styles.pSells}>{p._sum.quantity} sales</span>
                </div>
                <div className={styles.pPrice}>৳{p.price}</div>
              </div>
            ))}
            {topProductDetails.length === 0 && <p className={styles.empty}>No sales data yet.</p>}
          </div>
        </div>

        {/* Recent Activity */}
        <div className={styles.subCard}>
          <div className={styles.cardHeader}>
            <h3>Recent Activity</h3>
          </div>
          <div className={styles.activityFeed}>
            {recentOrders.map((order) => (
              <div key={order.id} className={styles.activityItem}>
                <div className={styles.activityIcon} style={{ background: '#eff6ff' }}>
                  <ShoppingCart size={14} color="#3b82f6" />
                </div>
                <div className={styles.activityContent}>
                  <p>New Order <strong>#{order.id.slice(0, 6)}</strong> placed</p>
                  <span>{formatDate(new Date(order.createdAt), { hour: 'numeric', minute: 'numeric', hour12: true })}</span>
                </div>
                <ArrowUpRight size={14} className={styles.activityArrow} />
              </div>
            ))}
            <div className={styles.activityItem}>
              <div className={styles.activityIcon} style={{ background: '#fef2f2' }}>
                <AlertCircle size={14} color="#ef4444" />
              </div>
              <div className={styles.activityContent}>
                <p>Low Stock Alert: <strong>Premium Silk Tie</strong></p>
                <span>10:24 AM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className={styles.subCard}>
          <div className={styles.cardHeader}>
            <h3>Inventory Alerts</h3>
            <span className={styles.alertCount}>{lowStockProducts} alerts</span>
          </div>
          <div className={styles.alertList}>
            {lowStockProducts === 0 ? (
              <div className={styles.allClear}>
                <CheckCircle2 size={32} />
                <p>All stock levels are clear.</p>
              </div>
            ) : (
              <div className={styles.hasAlerts}>
                <AlertCircle size={24} className={styles.pulseIcon} />
                <p>There are <strong>{lowStockProducts}</strong> products with less than 5 units remaining.</p>
                <button className={styles.restockBtn}>Manage Stock</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Re-using same Lucide-React icons if needed
const ShoppingCart = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.size}
    height={props.size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={props.color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className}
  >
    <circle cx="8" cy="21" r="1" />
    <circle cx="19" cy="21" r="1" />
    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.1-5.38a1 1 0 0 0-1-1.21H5.73" />
  </svg>
);

