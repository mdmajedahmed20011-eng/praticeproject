'use client';

import { useState, useEffect } from 'react';
import { 
  Save, Globe, Layout, Bell, Shield, 
  Users, History, Settings, ExternalLink,
  Smartphone, Mail, Lock, Eye
} from 'lucide-react';
import styles from './SettingsGrid.module.css';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      setSettings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setSettings((prev: any) => ({ ...prev, [name]: val }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        // Log activity could be triggered here or on backend
        alert('Enterprise configurations synchronized.');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '100px', color: '#64748b' }}>Initializing Command Center...</div>;

  return (
    <div className={styles.settingsWrapper}>
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <h1>Control Center</h1>
          <p>Global orchestration of LuxeAura enterprise parameters.</p>
        </div>
        <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
          <Save size={18} /> {saving ? 'Syncing...' : 'Save Configuration'}
        </button>
      </div>

      <div className={styles.fullPageLayout}>
        <aside className={styles.sidebarNav}>
           <button 
             className={`${styles.sideTab} ${activeTab === 'general' ? styles.sideTabActive : ''}`}
             onClick={() => setActiveTab('general')}
           >
             <Globe size={18} /> Store Identity
           </button>
           <button 
             className={`${styles.sideTab} ${activeTab === 'cms' ? styles.sideTabActive : ''}`}
             onClick={() => setActiveTab('cms')}
           >
             <Layout size={18} /> Homepage CMS
           </button>
           <button 
             className={`${styles.sideTab} ${activeTab === 'security' ? styles.sideTabActive : ''}`}
             onClick={() => setActiveTab('security')}
           >
             <Shield size={18} /> Security & Auth
           </button>
           <button 
             className={`${styles.sideTab} ${activeTab === 'audit' ? styles.sideTabActive : ''}`}
             onClick={() => setActiveTab('audit')}
           >
             <History size={18} /> Activity Logs
           </button>
        </aside>

        <main className={styles.contentArea}>
          {activeTab === 'general' && (
            <div className={styles.grid}>
              <div className={styles.card}>
                <div className={styles.cardMeta}>
                  <div className={styles.iconBox}><Globe size={20} /></div>
                  <h2>Business Identity</h2>
                </div>
                <div className={styles.formGroup}>
                  <label>Global Store Name</label>
                  <input className={styles.input} name="storeName" value={settings.storeName} onChange={handleChange} />
                </div>
                <div className={styles.formGroup}>
                  <label>Official Support Email</label>
                  <input className={styles.input} name="contactEmail" value={settings.contactEmail} onChange={handleChange} />
                </div>
                <div className={styles.formGroup}>
                  <label>Currency Reference</label>
                  <input className={styles.input} name="currencySymbol" value={settings.currencySymbol} onChange={handleChange} />
                </div>
              </div>

              <div className={styles.card}>
                <div className={styles.cardMeta}>
                  <div className={styles.iconBox}><Smartphone size={20} /></div>
                  <h2>Contact Parameters</h2>
                </div>
                <div className={styles.formGroup}>
                  <label>Public Phone Line</label>
                  <input className={styles.input} name="storePhone" value={settings.storePhone || ''} onChange={handleChange} placeholder="+880 1XXX-XXXXXX" />
                </div>
                <div className={styles.formGroup}>
                  <label>HQ Physical Address</label>
                  <textarea className={styles.textarea} name="storeAddress" value={settings.storeAddress || ''} onChange={handleChange} rows={3} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'cms' && (
            <div className={styles.grid}>
              <div className={styles.card}>
                <div className={styles.cardMeta}>
                  <div className={styles.iconBox}><Layout size={20} /></div>
                  <h2>Hero Experience</h2>
                </div>
                <div className={styles.formGroup}>
                  <label>Primary Headline</label>
                  <input className={styles.input} name="heroHeadline" value={settings.heroHeadline} onChange={handleChange} />
                </div>
                <div className={styles.formGroup}>
                  <label>Sub-Headline (Narrative)</label>
                  <textarea className={styles.textarea} name="heroSubheadline" value={settings.heroSubheadline} onChange={handleChange} rows={2} />
                </div>
                <div className={styles.formGroup}>
                  <label>Hero Cinematic URL</label>
                  <input className={styles.input} name="heroImage" value={settings.heroImage} onChange={handleChange} />
                </div>
              </div>

              <div className={styles.card}>
                <div className={styles.cardMeta}>
                  <div className={styles.iconBox}><Eye size={20} /></div>
                  <h2>Visibility Matrix</h2>
                </div>
                <div className={styles.toggleWrapper} onClick={() => handleChange({ target: { name: 'showFlashSale', type: 'checkbox', checked: !settings.showFlashSale }})}>
                   <div className={styles.toggleLabel}>
                     <span className={styles.toggleTitle}>Flash Sales</span>
                     <span className={styles.toggleDesc}>Toggle limited-time offers on homepage</span>
                   </div>
                   <label className={styles.switch}>
                     <input type="checkbox" name="showFlashSale" checked={!!settings.showFlashSale} readOnly />
                     <span className={styles.slider}></span>
                   </label>
                </div>
                <div className={styles.toggleWrapper} onClick={() => handleChange({ target: { name: 'showBestSellers', type: 'checkbox', checked: !settings.showBestSellers }})}>
                   <div className={styles.toggleLabel}>
                     <span className={styles.toggleTitle}>Best Sellers</span>
                     <span className={styles.toggleDesc}>Dynamic product ranking section</span>
                   </div>
                   <label className={styles.switch}>
                     <input type="checkbox" name="showBestSellers" checked={!!settings.showBestSellers} readOnly />
                     <span className={styles.slider}></span>
                   </label>
                </div>
                <div className={styles.toggleWrapper} onClick={() => handleChange({ target: { name: 'maintenanceMode', type: 'checkbox', checked: !settings.maintenanceMode }})}>
                   <div className={styles.toggleLabel}>
                     <span className={styles.toggleTitle} style={{ color: '#ef4444' }}>Maintenance Mode</span>
                     <span className={styles.toggleDesc}>Instantly restrict public access for infra updates</span>
                   </div>
                   <label className={styles.switch}>
                     <input type="checkbox" name="maintenanceMode" checked={!!settings.maintenanceMode} readOnly />
                     <span className={styles.slider}></span>
                   </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className={styles.grid}>
              <div className={styles.card}>
                <div className={styles.cardMeta}>
                  <div className={styles.iconBox}><Lock size={20} /></div>
                  <h2>Access Policies</h2>
                </div>
                <div className={styles.formGroup}>
                  <label>Session Expiry (Minutes)</label>
                  <input className={styles.input} type="number" name="sessionExpiry" value={settings.sessionExpiry || 60} onChange={handleChange} />
                </div>
                <div className={styles.toggleWrapper}>
                   <div className={styles.toggleLabel}>
                     <span className={styles.toggleTitle}>Two-Factor Authentication</span>
                     <span className={styles.toggleDesc}>Force 2FA for all administrative accounts</span>
                   </div>
                   <label className={styles.switch}>
                     <input type="checkbox" checked={false} disabled />
                     <span className={styles.slider}></span>
                   </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'audit' && (
            <div className={styles.card}>
              <div className={styles.cardMeta}>
                <div className={styles.iconBox}><History size={20} /></div>
                <h2>System Audit Trail</h2>
              </div>
              <div className={styles.logList}>
                <div className={styles.logItem}>
                  <div className={styles.logIcon}><Settings size={16} /></div>
                  <div className={styles.logContent}>
                     <span className={styles.logTitle}>Admin updated Homepage CMS Hero</span>
                     <div className={styles.logMeta}>
                       <span><Users size={12} /> SuperAdmin</span>
                       <span><Calendar size={12} /> Today, 2:30 PM</span>
                     </div>
                  </div>
                </div>
                <div className={styles.logItem}>
                  <div className={styles.logIcon}><Lock size={16} /></div>
                  <div className={styles.logContent}>
                     <span className={styles.logTitle}>Successful login from IP 192.168.1.1</span>
                     <div className={styles.logMeta}>
                       <span><Users size={12} /> SuperAdmin</span>
                       <span><Calendar size={12} /> Yesterday, 9:00 PM</span>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function Calendar({ size }: { size: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
  )
}
