'use client';

import { useState, useEffect, useCallback } from 'react';

interface User {
  id: string;
  email: string;
  username: string;
  avatar_emoji: string;
  avatar_color: string;
  tokens: number;
  vip_level: number;
  daily_streak: number;
  total_tokens_purchased: number;
  total_wins: number;
  total_games: number;
  created_at: string;
  last_login: string;
  is_blocked?: boolean;
  block_reason?: string;
  referral_code?: string;
}

interface Purchase {
  id: string;
  user_id: string;
  stripe_session_id: string;
  amount_cents: number;
  tokens_added: number;
  package_id: string;
  created_at: string;
  profiles?: { username: string; email: string };
}

interface Announcement {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'promo' | 'update';
  is_active: boolean;
  expires_at: string | null;
  created_at: string;
}

interface Activity {
  id: string;
  user_id: string;
  action: string;
  details: Record<string, unknown>;
  created_at: string;
}

interface Stats {
  totalUsers: number;
  activeUsers: number;
  blockedUsers: number;
  totalTokensInCirculation: number;
  totalTokensPurchased: number;
  totalGamesPlayed: number;
  totalRevenue: number;
  totalPurchases: number;
  vipUsers: number;
  todayUsers: number;
  todayRevenue: number;
  todayPurchases: number;
  weekUsers: number;
  weekRevenue: number;
}

type TabType = 'stats' | 'users' | 'purchases' | 'announcements' | 'activity';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [activeTab, setActiveTab] = useState<TabType>('stats');
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [tokenAmount, setTokenAmount] = useState('');
  const [blockReason, setBlockReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showBlockedOnly, setShowBlockedOnly] = useState(false);

  // Announcement form
  const [announcementForm, setAnnouncementForm] = useState({
    title: '',
    message: '',
    type: 'info' as 'info' | 'warning' | 'promo' | 'update',
  });

  // Notification form
  const [notificationForm, setNotificationForm] = useState({
    title: '',
    message: '',
    isBroadcast: false,
  });
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  const fetchData = useCallback(async (action: string, params?: Record<string, string>) => {
    try {
      const searchParams = new URLSearchParams({ action, ...params });
      const res = await fetch(`/api/admin?${searchParams}`, {
        headers: { Authorization: `Bearer ${password}` },
      });
      if (!res.ok) throw new Error('Failed to fetch');
      return await res.json();
    } catch (err) {
      console.error('Fetch error:', err);
      return null;
    }
  }, [password]);

  const loadStats = useCallback(async () => {
    const data = await fetchData('stats');
    if (data?.stats) setStats(data.stats);
  }, [fetchData]);

  const loadUsers = useCallback(async () => {
    const data = await fetchData('users');
    if (data?.users) setUsers(data.users);
  }, [fetchData]);

  const loadPurchases = useCallback(async () => {
    const data = await fetchData('purchases');
    if (data?.purchases) setPurchases(data.purchases);
  }, [fetchData]);

  const loadAnnouncements = useCallback(async () => {
    const data = await fetchData('announcements');
    if (data?.announcements) setAnnouncements(data.announcements);
  }, [fetchData]);

  const loadActivities = useCallback(async () => {
    const data = await fetchData('activityLog');
    if (data?.activities) setActivities(data.activities);
  }, [fetchData]);

  useEffect(() => {
    if (isAuthenticated) {
      loadStats();
      loadUsers();
      loadPurchases();
      loadAnnouncements();
      loadActivities();
    }
  }, [isAuthenticated, loadStats, loadUsers, loadPurchases, loadAnnouncements, loadActivities]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin?action=stats', {
        headers: { Authorization: `Bearer ${password}` },
      });

      if (res.ok) {
        setIsAuthenticated(true);
        localStorage.setItem('admin_session', password);
      } else {
        setError('Invalid password');
      }
    } catch {
      setError('Connection error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem('admin_session');
    if (saved) {
      setPassword(saved);
      fetch('/api/admin?action=stats', {
        headers: { Authorization: `Bearer ${saved}` },
      }).then(res => {
        if (res.ok) setIsAuthenticated(true);
      });
    }
  }, []);

  const adminAction = async (action: string, data: Record<string, unknown>) => {
    setActionLoading(true);
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${password}`,
        },
        body: JSON.stringify({ action, ...data }),
      });

      if (res.ok) {
        loadUsers();
        loadStats();
        loadAnnouncements();
        loadActivities();
        setSelectedUser(null);
        setTokenAmount('');
        setBlockReason('');
        return true;
      }
      return false;
    } catch (err) {
      console.error('Action error:', err);
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
    localStorage.removeItem('admin_session');
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = !searchQuery ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBlocked = !showBlockedOnly || user.is_blocked;
    return matchesSearch && matchesBlocked;
  });

  const handleCreateAnnouncement = async () => {
    if (!announcementForm.title || !announcementForm.message) return;
    const success = await adminAction('createAnnouncement', announcementForm);
    if (success) {
      setAnnouncementForm({ title: '', message: '', type: 'info' });
    }
  };

  const handleSendNotification = async () => {
    if (!notificationForm.title || !notificationForm.message) return;

    if (notificationForm.isBroadcast) {
      await adminAction('broadcastNotification', {
        title: notificationForm.title,
        message: notificationForm.message,
      });
    } else if (selectedUser) {
      await adminAction('sendNotification', {
        userId: selectedUser.id,
        title: notificationForm.title,
        message: notificationForm.message,
      });
    }

    setNotificationForm({ title: '', message: '', isBroadcast: false });
    setShowNotificationModal(false);
  };

  const exportData = async (type: 'users' | 'purchases') => {
    const data = await fetchData('export', { type });
    if (data?.data) {
      const blob = new Blob([JSON.stringify(data.data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}-export-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
    }
  };

  if (!isAuthenticated) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0f172a, #1e293b)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
        }}
      >
        <form
          onSubmit={handleLogin}
          style={{
            background: '#1e293b',
            borderRadius: '16px',
            padding: '40px',
            border: '1px solid #334155',
            maxWidth: '400px',
            width: '100%',
          }}
        >
          <h1 style={{ color: '#14b8a6', fontSize: '28px', fontWeight: '700', marginBottom: '8px', textAlign: 'center' }}>
            🔐 Admin Access
          </h1>
          <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px', textAlign: 'center' }}>
            Enter admin password to continue
          </p>

          {error && (
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', padding: '10px', marginBottom: '16px', color: '#f87171', fontSize: '13px', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '10px',
              border: '1px solid #334155',
              background: '#0f172a',
              color: 'white',
              fontSize: '16px',
              marginBottom: '16px',
              boxSizing: 'border-box',
            }}
          />

          <button
            type="submit"
            disabled={loading || !password}
            style={{
              width: '100%',
              padding: '14px',
              fontSize: '16px',
              fontWeight: '700',
              color: 'white',
              background: loading ? '#475569' : 'linear-gradient(135deg, #14b8a6, #0f766e)',
              border: 'none',
              borderRadius: '10px',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Verifying...' : 'Access Dashboard'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a, #1e293b)', padding: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', maxWidth: '1400px', margin: '0 auto 24px' }}>
        <div>
          <h1 style={{ color: '#14b8a6', fontSize: '28px', fontWeight: '700', margin: 0 }}>
            🎮 GUTS Admin Dashboard
          </h1>
          <p style={{ color: '#64748b', fontSize: '14px', margin: '4px 0 0' }}>
            Manage users, tokens, and analytics
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setShowNotificationModal(true)}
            style={{
              padding: '10px 20px',
              background: 'rgba(59, 130, 246, 0.2)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '8px',
              color: '#60a5fa',
              cursor: 'pointer',
              fontWeight: '600',
            }}
          >
            📢 Broadcast
          </button>
          <button
            onClick={handleLogout}
            style={{
              padding: '10px 20px',
              background: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              color: '#f87171',
              cursor: 'pointer',
              fontWeight: '600',
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Quick Stats Row */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', maxWidth: '1400px', margin: '0 auto 24px' }}>
          <StatCard label="Total Users" value={stats.totalUsers} icon="👥" color="#3b82f6" />
          <StatCard label="Active" value={stats.activeUsers} icon="✅" color="#22c55e" />
          <StatCard label="Blocked" value={stats.blockedUsers} icon="🚫" color="#ef4444" />
          <StatCard label="Revenue" value={`$${stats.totalRevenue.toFixed(2)}`} icon="💰" color="#22c55e" />
          <StatCard label="Tokens" value={stats.totalTokensInCirculation.toLocaleString()} icon="🪙" color="#fbbf24" />
          <StatCard label="Games" value={stats.totalGamesPlayed.toLocaleString()} icon="🎮" color="#a855f7" />
          <StatCard label="VIP Users" value={stats.vipUsers} icon="👑" color="#ec4899" />
          <StatCard label="Today $" value={`$${stats.todayRevenue.toFixed(2)}`} icon="📈" color="#14b8a6" />
        </div>
      )}

      {/* Tabs */}
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
          {(['stats', 'users', 'purchases', 'announcements', 'activity'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === tab ? '#14b8a6' : 'rgba(30, 41, 59, 0.9)',
                color: activeTab === tab ? '#0f172a' : '#94a3b8',
                fontWeight: '600',
                cursor: 'pointer',
                textTransform: 'capitalize',
              }}
            >
              {tab === 'stats' && '📊 '}
              {tab === 'users' && '👥 '}
              {tab === 'purchases' && '💳 '}
              {tab === 'announcements' && '📢 '}
              {tab === 'activity' && '📋 '}
              {tab}
            </button>
          ))}
          <div style={{ flex: 1 }} />
          <button
            onClick={() => exportData('users')}
            style={{
              padding: '10px 16px',
              borderRadius: '8px',
              border: '1px solid #334155',
              background: 'transparent',
              color: '#94a3b8',
              cursor: 'pointer',
              fontSize: '13px',
            }}
          >
            📥 Export Users
          </button>
          <button
            onClick={() => exportData('purchases')}
            style={{
              padding: '10px 16px',
              borderRadius: '8px',
              border: '1px solid #334155',
              background: 'transparent',
              color: '#94a3b8',
              cursor: 'pointer',
              fontSize: '13px',
            }}
          >
            📥 Export Purchases
          </button>
        </div>

        {/* Users Tab */}
        {activeTab === 'users' && (
          <>
            {/* Search & Filter */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
              <input
                type="text"
                placeholder="Search by username or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  flex: 1,
                  minWidth: '200px',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid #334155',
                  background: '#0f172a',
                  color: 'white',
                  fontSize: '14px',
                }}
              />
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={showBlockedOnly}
                  onChange={(e) => setShowBlockedOnly(e.target.checked)}
                  style={{ accentColor: '#14b8a6' }}
                />
                Show blocked only
              </label>
            </div>

            <div style={{ background: '#1e293b', borderRadius: '12px', border: '1px solid #334155', overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#0f172a' }}>
                      <th style={thStyle}>User</th>
                      <th style={thStyle}>Email</th>
                      <th style={thStyle}>Status</th>
                      <th style={thStyle}>Tokens</th>
                      <th style={thStyle}>VIP</th>
                      <th style={thStyle}>Games</th>
                      <th style={thStyle}>Win Rate</th>
                      <th style={thStyle}>Joined</th>
                      <th style={thStyle}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} style={{ borderBottom: '1px solid #334155', background: user.is_blocked ? 'rgba(239, 68, 68, 0.05)' : 'transparent' }}>
                        <td style={tdStyle}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '20px', background: user.avatar_color, borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              {user.avatar_emoji}
                            </span>
                            <span style={{ color: user.is_blocked ? '#94a3b8' : '#cbd5e1', fontWeight: '600' }}>{user.username}</span>
                          </div>
                        </td>
                        <td style={tdStyle}><span style={{ color: '#94a3b8', fontSize: '13px' }}>{user.email}</span></td>
                        <td style={tdStyle}>
                          {user.is_blocked ? (
                            <span style={{ color: '#f87171', fontSize: '12px', background: 'rgba(239, 68, 68, 0.2)', padding: '2px 8px', borderRadius: '4px' }}>🚫 Blocked</span>
                          ) : (
                            <span style={{ color: '#4ade80', fontSize: '12px', background: 'rgba(74, 222, 128, 0.2)', padding: '2px 8px', borderRadius: '4px' }}>✅ Active</span>
                          )}
                        </td>
                        <td style={tdStyle}><span style={{ color: '#fbbf24', fontWeight: '600' }}>🪙 {user.tokens.toLocaleString()}</span></td>
                        <td style={tdStyle}>
                          {user.vip_level > 0 ? (
                            <span style={{ color: '#fbbf24' }}>
                              {user.vip_level === 1 ? '🥉' : user.vip_level === 2 ? '🥈' : '🥇'} VIP {user.vip_level}
                            </span>
                          ) : (
                            <span style={{ color: '#64748b' }}>-</span>
                          )}
                        </td>
                        <td style={tdStyle}><span style={{ color: '#a855f7' }}>{user.total_games}</span></td>
                        <td style={tdStyle}>
                          <span style={{ color: user.total_games > 0 ? '#4ade80' : '#64748b' }}>
                            {user.total_games > 0 ? `${Math.round((user.total_wins / user.total_games) * 100)}%` : '-'}
                          </span>
                        </td>
                        <td style={tdStyle}><span style={{ color: '#64748b', fontSize: '12px' }}>{new Date(user.created_at).toLocaleDateString()}</span></td>
                        <td style={tdStyle}>
                          <button
                            onClick={() => setSelectedUser(user)}
                            style={{
                              padding: '6px 12px',
                              borderRadius: '6px',
                              border: 'none',
                              background: '#14b8a6',
                              color: '#0f172a',
                              fontWeight: '600',
                              fontSize: '12px',
                              cursor: 'pointer',
                            }}
                          >
                            Manage
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Purchases Tab */}
        {activeTab === 'purchases' && (
          <div style={{ background: '#1e293b', borderRadius: '12px', border: '1px solid #334155', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#0f172a' }}>
                    <th style={thStyle}>Date</th>
                    <th style={thStyle}>User</th>
                    <th style={thStyle}>Package</th>
                    <th style={thStyle}>Tokens</th>
                    <th style={thStyle}>Amount</th>
                    <th style={thStyle}>Session ID</th>
                  </tr>
                </thead>
                <tbody>
                  {purchases.map((purchase) => (
                    <tr key={purchase.id} style={{ borderBottom: '1px solid #334155' }}>
                      <td style={tdStyle}><span style={{ color: '#94a3b8', fontSize: '13px' }}>{new Date(purchase.created_at).toLocaleString()}</span></td>
                      <td style={tdStyle}><span style={{ color: '#cbd5e1' }}>{purchase.profiles?.username || purchase.user_id.slice(0, 8)}</span></td>
                      <td style={tdStyle}><span style={{ color: '#a855f7', textTransform: 'capitalize' }}>{purchase.package_id || '-'}</span></td>
                      <td style={tdStyle}><span style={{ color: '#fbbf24', fontWeight: '600' }}>🪙 {purchase.tokens_added.toLocaleString()}</span></td>
                      <td style={tdStyle}><span style={{ color: '#22c55e', fontWeight: '600' }}>${(purchase.amount_cents / 100).toFixed(2)}</span></td>
                      <td style={tdStyle}><span style={{ color: '#64748b', fontSize: '11px', fontFamily: 'monospace' }}>{purchase.stripe_session_id.slice(0, 20)}...</span></td>
                    </tr>
                  ))}
                  {purchases.length === 0 && (
                    <tr>
                      <td colSpan={6} style={{ ...tdStyle, textAlign: 'center', color: '#64748b' }}>
                        No purchases yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Announcements Tab */}
        {activeTab === 'announcements' && (
          <div style={{ display: 'grid', gap: '16px' }}>
            {/* Create Announcement Form */}
            <div style={{ background: '#1e293b', borderRadius: '12px', border: '1px solid #334155', padding: '20px' }}>
              <h3 style={{ color: '#14b8a6', margin: '0 0 16px', fontSize: '18px' }}>📢 Create Announcement</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input
                  type="text"
                  placeholder="Title"
                  value={announcementForm.title}
                  onChange={(e) => setAnnouncementForm(prev => ({ ...prev, title: e.target.value }))}
                  style={inputStyle}
                />
                <textarea
                  placeholder="Message"
                  value={announcementForm.message}
                  onChange={(e) => setAnnouncementForm(prev => ({ ...prev, message: e.target.value }))}
                  style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                />
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {(['info', 'warning', 'promo', 'update'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setAnnouncementForm(prev => ({ ...prev, type }))}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '6px',
                        border: announcementForm.type === type ? '2px solid #14b8a6' : '1px solid #334155',
                        background: announcementForm.type === type ? 'rgba(20, 184, 166, 0.2)' : '#0f172a',
                        color: announcementForm.type === type ? '#14b8a6' : '#94a3b8',
                        cursor: 'pointer',
                        textTransform: 'capitalize',
                      }}
                    >
                      {type === 'info' && 'ℹ️ '}
                      {type === 'warning' && '⚠️ '}
                      {type === 'promo' && '🎉 '}
                      {type === 'update' && '🆕 '}
                      {type}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleCreateAnnouncement}
                  disabled={!announcementForm.title || !announcementForm.message}
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    border: 'none',
                    background: announcementForm.title && announcementForm.message ? '#14b8a6' : '#475569',
                    color: 'white',
                    fontWeight: '600',
                    cursor: announcementForm.title && announcementForm.message ? 'pointer' : 'not-allowed',
                  }}
                >
                  Create Announcement
                </button>
              </div>
            </div>

            {/* Existing Announcements */}
            <div style={{ background: '#1e293b', borderRadius: '12px', border: '1px solid #334155', padding: '20px' }}>
              <h3 style={{ color: '#14b8a6', margin: '0 0 16px', fontSize: '18px' }}>📋 Active Announcements</h3>
              {announcements.length === 0 ? (
                <p style={{ color: '#64748b', textAlign: 'center', padding: '20px' }}>No announcements yet</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {announcements.map((ann) => (
                    <div key={ann.id} style={{ background: '#0f172a', borderRadius: '8px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <span style={{
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            background: ann.type === 'warning' ? 'rgba(245, 158, 11, 0.2)' : ann.type === 'promo' ? 'rgba(236, 72, 153, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                            color: ann.type === 'warning' ? '#f59e0b' : ann.type === 'promo' ? '#ec4899' : '#60a5fa',
                          }}>
                            {ann.type.toUpperCase()}
                          </span>
                          <span style={{ color: '#cbd5e1', fontWeight: '600' }}>{ann.title}</span>
                        </div>
                        <p style={{ color: '#94a3b8', margin: '4px 0', fontSize: '14px' }}>{ann.message}</p>
                        <span style={{ color: '#64748b', fontSize: '11px' }}>{new Date(ann.created_at).toLocaleString()}</span>
                      </div>
                      <button
                        onClick={() => adminAction('deleteAnnouncement', { announcementId: ann.id })}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '6px',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          background: 'rgba(239, 68, 68, 0.1)',
                          color: '#f87171',
                          cursor: 'pointer',
                          fontSize: '12px',
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Activity Tab */}
        {activeTab === 'activity' && (
          <div style={{ background: '#1e293b', borderRadius: '12px', border: '1px solid #334155', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#0f172a' }}>
                    <th style={thStyle}>Time</th>
                    <th style={thStyle}>User ID</th>
                    <th style={thStyle}>Action</th>
                    <th style={thStyle}>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {activities.map((activity) => (
                    <tr key={activity.id} style={{ borderBottom: '1px solid #334155' }}>
                      <td style={tdStyle}><span style={{ color: '#94a3b8', fontSize: '12px' }}>{new Date(activity.created_at).toLocaleString()}</span></td>
                      <td style={tdStyle}><span style={{ color: '#64748b', fontSize: '11px', fontFamily: 'monospace' }}>{activity.user_id?.slice(0, 8) || 'System'}</span></td>
                      <td style={tdStyle}>
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          background: activity.action.includes('block') ? 'rgba(239, 68, 68, 0.2)' : activity.action.includes('grant') ? 'rgba(34, 197, 94, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                          color: activity.action.includes('block') ? '#f87171' : activity.action.includes('grant') ? '#4ade80' : '#60a5fa',
                        }}>
                          {activity.action.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td style={tdStyle}><span style={{ color: '#94a3b8', fontSize: '12px' }}>{JSON.stringify(activity.details)}</span></td>
                    </tr>
                  ))}
                  {activities.length === 0 && (
                    <tr>
                      <td colSpan={4} style={{ ...tdStyle, textAlign: 'center', color: '#64748b' }}>
                        No activity logged yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Stats Detail */}
        {activeTab === 'stats' && stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            <div style={{ background: '#1e293b', borderRadius: '12px', border: '1px solid #334155', padding: '20px' }}>
              <h3 style={{ color: '#14b8a6', margin: '0 0 16px', fontSize: '18px' }}>📈 Today&apos;s Performance</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8' }}>New Users</span>
                  <span style={{ color: '#3b82f6', fontWeight: '600' }}>{stats.todayUsers}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8' }}>Revenue</span>
                  <span style={{ color: '#22c55e', fontWeight: '700', fontSize: '18px' }}>${stats.todayRevenue.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8' }}>Purchases</span>
                  <span style={{ color: '#fbbf24', fontWeight: '600' }}>{stats.todayPurchases}</span>
                </div>
              </div>
            </div>

            <div style={{ background: '#1e293b', borderRadius: '12px', border: '1px solid #334155', padding: '20px' }}>
              <h3 style={{ color: '#14b8a6', margin: '0 0 16px', fontSize: '18px' }}>📊 This Week</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8' }}>New Users</span>
                  <span style={{ color: '#3b82f6', fontWeight: '600' }}>{stats.weekUsers}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8' }}>Revenue</span>
                  <span style={{ color: '#22c55e', fontWeight: '700', fontSize: '18px' }}>${stats.weekRevenue.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8' }}>Avg Daily Revenue</span>
                  <span style={{ color: '#a855f7', fontWeight: '600' }}>${(stats.weekRevenue / 7).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div style={{ background: '#1e293b', borderRadius: '12px', border: '1px solid #334155', padding: '20px' }}>
              <h3 style={{ color: '#14b8a6', margin: '0 0 16px', fontSize: '18px' }}>💰 Revenue Overview</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8' }}>Total Revenue</span>
                  <span style={{ color: '#22c55e', fontWeight: '700', fontSize: '20px' }}>${stats.totalRevenue.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8' }}>Total Purchases</span>
                  <span style={{ color: '#fbbf24', fontWeight: '600' }}>{stats.totalPurchases}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8' }}>Avg. Purchase</span>
                  <span style={{ color: '#a855f7', fontWeight: '600' }}>
                    ${stats.totalPurchases > 0 ? (stats.totalRevenue / stats.totalPurchases).toFixed(2) : '0.00'}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ background: '#1e293b', borderRadius: '12px', border: '1px solid #334155', padding: '20px' }}>
              <h3 style={{ color: '#14b8a6', margin: '0 0 16px', fontSize: '18px' }}>🪙 Token Economy</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8' }}>In Circulation</span>
                  <span style={{ color: '#fbbf24', fontWeight: '600' }}>{stats.totalTokensInCirculation.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8' }}>Purchased</span>
                  <span style={{ color: '#22c55e', fontWeight: '600' }}>{stats.totalTokensPurchased.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8' }}>Avg/User</span>
                  <span style={{ color: '#a855f7', fontWeight: '600' }}>
                    {stats.totalUsers > 0 ? Math.round(stats.totalTokensInCirculation / stats.totalUsers).toLocaleString() : 0}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ background: '#1e293b', borderRadius: '12px', border: '1px solid #334155', padding: '20px' }}>
              <h3 style={{ color: '#14b8a6', margin: '0 0 16px', fontSize: '18px' }}>👥 User Stats</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8' }}>Total Users</span>
                  <span style={{ color: '#3b82f6', fontWeight: '600' }}>{stats.totalUsers}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8' }}>Active / Blocked</span>
                  <span style={{ color: '#64748b' }}>
                    <span style={{ color: '#4ade80' }}>{stats.activeUsers}</span> / <span style={{ color: '#f87171' }}>{stats.blockedUsers}</span>
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8' }}>VIP Users</span>
                  <span style={{ color: '#ec4899', fontWeight: '600' }}>{stats.vipUsers} ({((stats.vipUsers / stats.totalUsers) * 100).toFixed(1)}%)</span>
                </div>
              </div>
            </div>

            <div style={{ background: '#1e293b', borderRadius: '12px', border: '1px solid #334155', padding: '20px' }}>
              <h3 style={{ color: '#14b8a6', margin: '0 0 16px', fontSize: '18px' }}>🎮 Game Stats</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8' }}>Total Games</span>
                  <span style={{ color: '#a855f7', fontWeight: '600' }}>{stats.totalGamesPlayed.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8' }}>Avg Games/User</span>
                  <span style={{ color: '#60a5fa', fontWeight: '600' }}>
                    {stats.totalUsers > 0 ? (stats.totalGamesPlayed / stats.totalUsers).toFixed(1) : 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* User Management Modal */}
      {selectedUser && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
          onClick={() => setSelectedUser(null)}
        >
          <div
            style={{
              background: '#1e293b',
              borderRadius: '16px',
              padding: '24px',
              maxWidth: '500px',
              width: '100%',
              border: '1px solid #334155',
              maxHeight: '90vh',
              overflow: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <span style={{ fontSize: '32px', background: selectedUser.avatar_color, borderRadius: '50%', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {selectedUser.avatar_emoji}
              </span>
              <div style={{ flex: 1 }}>
                <h3 style={{ color: '#14b8a6', margin: 0, fontSize: '20px' }}>{selectedUser.username}</h3>
                <p style={{ color: '#64748b', margin: 0, fontSize: '13px' }}>{selectedUser.email}</p>
              </div>
              {selectedUser.is_blocked && (
                <span style={{ padding: '4px 10px', borderRadius: '6px', background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', fontSize: '12px', fontWeight: '600' }}>
                  BLOCKED
                </span>
              )}
            </div>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              <div style={{ flex: 1, background: '#0f172a', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
                <div style={{ color: '#fbbf24', fontSize: '20px', fontWeight: '700' }}>🪙 {selectedUser.tokens.toLocaleString()}</div>
                <div style={{ color: '#64748b', fontSize: '11px' }}>Tokens</div>
              </div>
              <div style={{ flex: 1, background: '#0f172a', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
                <div style={{ color: '#a855f7', fontSize: '20px', fontWeight: '700' }}>{selectedUser.total_games}</div>
                <div style={{ color: '#64748b', fontSize: '11px' }}>Games</div>
              </div>
              <div style={{ flex: 1, background: '#0f172a', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
                <div style={{ color: '#fbbf24', fontSize: '20px', fontWeight: '700' }}>VIP {selectedUser.vip_level}</div>
                <div style={{ color: '#64748b', fontSize: '11px' }}>Level</div>
              </div>
            </div>

            {/* Grant Tokens */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: '12px', marginBottom: '6px' }}>Grant/Remove Tokens</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="number"
                  value={tokenAmount}
                  onChange={(e) => setTokenAmount(e.target.value)}
                  placeholder="Amount (negative to remove)"
                  style={inputStyle}
                />
                <button
                  onClick={() => adminAction('grantTokens', { userId: selectedUser.id, amount: parseInt(tokenAmount) })}
                  disabled={actionLoading || !tokenAmount}
                  style={{
                    padding: '10px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#22c55e',
                    color: 'white',
                    fontWeight: '600',
                    cursor: actionLoading || !tokenAmount ? 'not-allowed' : 'pointer',
                  }}
                >
                  Apply
                </button>
              </div>
            </div>

            {/* VIP Level */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: '12px', marginBottom: '6px' }}>Set VIP Level</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[0, 1, 2, 3].map((level) => (
                  <button
                    key={level}
                    onClick={() => adminAction('setVIP', { userId: selectedUser.id, level })}
                    disabled={actionLoading}
                    style={{
                      flex: 1,
                      padding: '10px',
                      borderRadius: '8px',
                      border: selectedUser.vip_level === level ? '2px solid #fbbf24' : '1px solid #334155',
                      background: selectedUser.vip_level === level ? 'rgba(251, 191, 36, 0.2)' : '#0f172a',
                      color: '#fbbf24',
                      fontWeight: '600',
                      cursor: actionLoading ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {level === 0 ? 'None' : level === 1 ? '🥉' : level === 2 ? '🥈' : '🥇'}
                  </button>
                ))}
              </div>
            </div>

            {/* Block/Unblock */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: '12px', marginBottom: '6px' }}>
                {selectedUser.is_blocked ? 'Unblock User' : 'Block User'}
              </label>
              {!selectedUser.is_blocked && (
                <input
                  type="text"
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  placeholder="Block reason (optional)"
                  style={{ ...inputStyle, marginBottom: '8px' }}
                />
              )}
              <button
                onClick={() => adminAction('blockUser', {
                  userId: selectedUser.id,
                  blocked: !selectedUser.is_blocked,
                  reason: blockReason,
                })}
                disabled={actionLoading}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: selectedUser.is_blocked ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
                  background: selectedUser.is_blocked ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  color: selectedUser.is_blocked ? '#4ade80' : '#f87171',
                  fontWeight: '600',
                  cursor: actionLoading ? 'not-allowed' : 'pointer',
                }}
              >
                {selectedUser.is_blocked ? '✅ Unblock User' : '🚫 Block User'}
              </button>
              {selectedUser.block_reason && (
                <p style={{ color: '#f87171', fontSize: '12px', margin: '8px 0 0', background: 'rgba(239, 68, 68, 0.1)', padding: '8px', borderRadius: '6px' }}>
                  Reason: {selectedUser.block_reason}
                </p>
              )}
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <button
                onClick={() => adminAction('resetTokens', { userId: selectedUser.id, amount: 100 })}
                disabled={actionLoading}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid #334155',
                  background: '#0f172a',
                  color: '#94a3b8',
                  fontWeight: '600',
                  cursor: actionLoading ? 'not-allowed' : 'pointer',
                }}
              >
                Reset to 100
              </button>
              <button
                onClick={() => {
                  setNotificationForm({ title: '', message: '', isBroadcast: false });
                  setShowNotificationModal(true);
                }}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  background: 'rgba(59, 130, 246, 0.1)',
                  color: '#60a5fa',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                Send Message
              </button>
            </div>

            <button
              onClick={() => {
                if (confirm('Delete this user permanently?')) {
                  adminAction('deleteUser', { userId: selectedUser.id });
                }
              }}
              disabled={actionLoading}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                background: 'rgba(239, 68, 68, 0.1)',
                color: '#f87171',
                fontWeight: '600',
                cursor: actionLoading ? 'not-allowed' : 'pointer',
                marginBottom: '8px',
              }}
            >
              🗑️ Delete User Permanently
            </button>

            <button
              onClick={() => setSelectedUser(null)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: 'none',
                background: '#334155',
                color: '#cbd5e1',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Notification Modal */}
      {showNotificationModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1001,
            padding: '20px',
          }}
          onClick={() => setShowNotificationModal(false)}
        >
          <div
            style={{
              background: '#1e293b',
              borderRadius: '16px',
              padding: '24px',
              maxWidth: '450px',
              width: '100%',
              border: '1px solid #334155',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ color: '#14b8a6', margin: '0 0 20px', fontSize: '20px' }}>
              {selectedUser && !notificationForm.isBroadcast ? `📨 Send to ${selectedUser.username}` : '📢 Broadcast to All'}
            </h3>

            {!selectedUser && (
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: '#94a3b8', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={notificationForm.isBroadcast}
                  onChange={(e) => setNotificationForm(prev => ({ ...prev, isBroadcast: e.target.checked }))}
                  style={{ accentColor: '#14b8a6' }}
                />
                Send to all active users
              </label>
            )}

            <input
              type="text"
              placeholder="Title"
              value={notificationForm.title}
              onChange={(e) => setNotificationForm(prev => ({ ...prev, title: e.target.value }))}
              style={{ ...inputStyle, marginBottom: '12px' }}
            />
            <textarea
              placeholder="Message"
              value={notificationForm.message}
              onChange={(e) => setNotificationForm(prev => ({ ...prev, message: e.target.value }))}
              style={{ ...inputStyle, minHeight: '100px', resize: 'vertical', marginBottom: '16px' }}
            />

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setShowNotificationModal(false)}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #334155',
                  background: 'transparent',
                  color: '#94a3b8',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSendNotification}
                disabled={!notificationForm.title || !notificationForm.message}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '8px',
                  border: 'none',
                  background: notificationForm.title && notificationForm.message ? '#14b8a6' : '#475569',
                  color: 'white',
                  fontWeight: '600',
                  cursor: notificationForm.title && notificationForm.message ? 'pointer' : 'not-allowed',
                }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, icon, color }: { label: string; value: string | number; icon: string; color: string }) {
  return (
    <div
      style={{
        background: '#1e293b',
        borderRadius: '12px',
        padding: '16px',
        border: '1px solid #334155',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}
    >
      <div
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '10px',
          background: `${color}20`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
        }}
      >
        {icon}
      </div>
      <div>
        <div style={{ color: '#64748b', fontSize: '11px', marginBottom: '2px' }}>{label}</div>
        <div style={{ color, fontSize: '18px', fontWeight: '700' }}>{value}</div>
      </div>
    </div>
  );
}

const thStyle: React.CSSProperties = {
  padding: '12px 16px',
  textAlign: 'left',
  color: '#94a3b8',
  fontSize: '12px',
  fontWeight: '600',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
};

const tdStyle: React.CSSProperties = {
  padding: '12px 16px',
};

const inputStyle: React.CSSProperties = {
  flex: 1,
  padding: '10px',
  borderRadius: '8px',
  border: '1px solid #334155',
  background: '#0f172a',
  color: 'white',
  fontSize: '14px',
  width: '100%',
  boxSizing: 'border-box',
};
