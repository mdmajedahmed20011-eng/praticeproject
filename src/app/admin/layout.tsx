'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Package, ShoppingBag, ShoppingCart, 
  Settings, LogOut, Menu, X, Tag, Users, Activity
} from 'lucide-react';
import styles from './layout.module.css';

const navItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/products', icon: Package, label: 'Products' },
  { href: '/admin/collections', icon: ShoppingBag, label: 'Collections' },
  { href: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
  { href: '/admin/customers', icon: Users, label: 'Customers' },
  { href: '/admin/discounts', icon: Tag, label: 'Discounts' },
  { href: '/admin/settings?tab=audit', icon: Activity, label: 'Activity Log' },
  { href: '/admin/settings', icon: Settings, label: 'Settings' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  return (
    <div className={styles.adminContainer}>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className={styles.overlay} 
          onClick={() => setSidebarOpen(false)} 
        />
      )}

      {/* Mobile Header Bar */}
      <header className={styles.mobileHeader}>
        <button 
          className={styles.hamburger} 
          onClick={() => setSidebarOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
        <span className={styles.mobileTitle}>
          LuxeAura <span>Admin</span>
        </span>
        <div style={{ width: 40 }} />
      </header>

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.brand}>
          <h2>LuxeAura <span>Admin</span></h2>
          <button 
            className={styles.closeSidebar} 
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>
        
        <nav className={styles.nav}>
          {navItems.map((item) => (
            <Link 
              key={item.href}
              href={item.href} 
              className={`${styles.navLink} ${isActive(item.href) ? styles.navLinkActive : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon size={20} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className={styles.bottomNav}>
          <Link href="/" className={styles.viewStoreBtn}>
            View Store →
          </Link>
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
