"use client";
import { useState, useEffect } from 'react';
import { Save, Globe, Layout, Bell } from 'lucide-react';
import styles from './page.module.css';

export default function SettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        setSettings(data);
        setLoading(false);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setSettings((prev: any) => ({ ...prev, [name]: val }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      });
      alert('Settings saved successfully!');
    } catch (error) {
      alert('Error saving settings.');
    }
    setSaving(false);
  };

  if (loading) return <div>Loading settings...</div>;

  return (
    <div className={styles.settingsPage}>
      <div className={styles.header}>
        <div>
          <h1>Store Settings & CMS</h1>
          <p>Control your homepage layout and business configurations.</p>
        </div>
        <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
          <Save size={18} />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className={styles.grid}>
        {/* General Store Details */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <Globe className={styles.cardIcon} />
            <h2>General Details</h2>
          </div>
          <div className={styles.formGroup}>
            <label>Store Name</label>
            <input name="storeName" value={settings.storeName || ''} onChange={handleChange} />
          </div>
          <div className={styles.formGroup}>
            <label>Contact Email</label>
            <input name="contactEmail" value={settings.contactEmail || ''} onChange={handleChange} />
          </div>
          <div className={styles.formGroup}>
            <label>Currency Symbol</label>
            <input name="currencySymbol" value={settings.currencySymbol || ''} onChange={handleChange} />
          </div>
        </div>

        {/* Homepage CMS */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <Layout className={styles.cardIcon} />
            <h2>Homepage Banner Design</h2>
          </div>
          <div className={styles.formGroup}>
            <label>Hero Headline</label>
            <input name="heroHeadline" value={settings.heroHeadline || ''} onChange={handleChange} />
          </div>
          <div className={styles.formGroup}>
            <label>Hero Subheadline</label>
            <textarea name="heroSubheadline" value={settings.heroSubheadline || ''} onChange={handleChange} rows={2} />
          </div>
          <div className={styles.formGroup}>
            <label>Hero Background Image URL</label>
            <input name="heroImage" value={settings.heroImage || ''} onChange={handleChange} />
          </div>
          <div className={styles.formGroup}>
            <label>Button Text</label>
            <input name="heroButtonText" value={settings.heroButtonText || ''} onChange={handleChange} />
          </div>
        </div>

        {/* Visibility Toggles */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <Bell className={styles.cardIcon} />
            <h2>Section Features</h2>
          </div>
          <div className={styles.toggleGroup}>
            <label className={styles.toggleLabel}>
              <input type="checkbox" name="showFlashSale" checked={!!settings.showFlashSale} onChange={handleChange} />
              Show Flash Sale Section
            </label>
          </div>
          <div className={styles.toggleGroup}>
            <label className={styles.toggleLabel}>
              <input type="checkbox" name="showBestSellers" checked={!!settings.showBestSellers} onChange={handleChange} />
              Show Best Sellers Section
            </label>
          </div>
          <div className={styles.toggleGroup}>
            <label className={styles.toggleLabel}>
              <input type="checkbox" name="maintenanceMode" checked={!!settings.maintenanceMode} onChange={handleChange} />
              Enable Maintenance Mode (Site Offline)
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
