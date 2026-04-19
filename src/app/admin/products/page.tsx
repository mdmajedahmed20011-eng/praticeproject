import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import styles from './page.module.css';

export default function AdminProductsPage() {
  return (
    <div className={styles.productsPage}>
      <div className={styles.header}>
        <div>
          <h1>Products</h1>
          <p>Manage your inventory, prices, and stock levels.</p>
        </div>
        <button className={styles.addBtn}>
          <Plus size={18} />
          Add Product
        </button>
      </div>

      <div className={styles.controls}>
        <div className={styles.searchBox}>
          <Search size={18} color="#64748b" />
          <input type="text" placeholder="Search products..." />
        </div>
        <div className={styles.filters}>
          <select>
            <option>All Categories</option>
            <option>Men's Wear</option>
            <option>Women's Wear</option>
          </select>
          <select>
            <option>Latest Added</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={styles.productCell}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=100&q=80" alt="Product" className={styles.thumb} />
                <div className={styles.productInfo}>
                  <p className={styles.productTitle}>White/Green Printed Cotton Shirt</p>
                  <p className={styles.productMeta}>ID: e1</p>
                </div>
              </td>
              <td>Men's Ethnic</td>
              <td style={{ fontWeight: 600 }}>Tk 855</td>
              <td>
                <span className={styles.stockBadge} data-stock="high">45 in stock</span>
              </td>
              <td><span className={styles.activeBadge}>Published</span></td>
              <td>
                <div className={styles.actions}>
                  <button className={styles.iconBtn}><Edit size={16} /></button>
                  <button className={`${styles.iconBtn} ${styles.danger}`}><Trash2 size={16} /></button>
                </div>
              </td>
            </tr>
            <tr>
              <td className={styles.productCell}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://images.unsplash.com/photo-1596755094514-f87e32f6b717?w=100&q=80" alt="Product" className={styles.thumb} />
                <div className={styles.productInfo}>
                  <p className={styles.productTitle}>Light Cyan Cotton Shirt</p>
                  <p className={styles.productMeta}>ID: e2</p>
                </div>
              </td>
              <td>Men's Casual</td>
              <td style={{ fontWeight: 600 }}>Tk 1,109</td>
              <td>
                <span className={styles.stockBadge} data-stock="low">2 in stock</span>
              </td>
              <td><span className={styles.activeBadge}>Published</span></td>
              <td>
                <div className={styles.actions}>
                  <button className={styles.iconBtn}><Edit size={16} /></button>
                  <button className={`${styles.iconBtn} ${styles.danger}`}><Trash2 size={16} /></button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
