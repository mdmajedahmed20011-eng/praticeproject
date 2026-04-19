import Link from 'next/link';
import { Package, ShoppingCart, LayoutDashboard, Settings, LogOut } from 'lucide-react';
import styles from './layout.module.css';

export const metadata = {
  title: 'LuxeAura Admin Panel',
  description: 'Manage products and orders',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.adminContainer}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <h2>LuxeAura <span>Admin</span></h2>
        </div>
        
        <nav className={styles.nav}>
          <Link href="/admin" className={styles.navLink}>
            <LayoutDashboard size={20} />
            Dashboard
          </Link>
          <Link href="/admin/products" className={styles.navLink}>
            <Package size={20} />
            Products
          </Link>
          <Link href="/admin/orders" className={styles.navLink}>
            <ShoppingCart size={20} />
            Orders
          </Link>
          <Link href="/admin/settings" className={styles.navLink}>
            <Settings size={20} />
            Settings
          </Link>
        </nav>

        <div className={styles.bottomNav}>
          <button className={styles.logoutBtn}>
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}
