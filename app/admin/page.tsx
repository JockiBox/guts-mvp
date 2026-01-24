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

interface Stats {
  totalUsers: number;
  totalTokensInCirculation: number;
  totalTokensPurchased: number;
  totalGamesPlayed: number;
  totalRevenue: number;
  totalPurchases: number;
  vipUsers: number;
}

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [activeTab, setActiveTab] = useState<'stats' | 'users' | 'purchases'>('stats');
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [tokenAmount, setTokenAmount] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchData = useCallback(async (action: string) => {
    try {
      const res = await fetch(`/api/admin?action=${action}`, {
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

  useEffect(() => {
    if (isAuthenticated) {
      loadStats();
      loadUsers();
      loadPurchases();
    }
  }, [isAuthenticated, loadStats, loadUsers, loadPurchases]);

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

  // Check for existing session
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
        setSelectedUser(null);
        setTokenAmount('');
      }
    } catch (err) {
      console.error('Action error:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
    localStorage.removeItem('admin_session');
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

      {/* Stats Cards */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', maxWidth: '1400px', margin: '0 auto 24px' }}>
          <StatCard label="Total Users" value={stats.totalUsers} icon="👥" color="#3b82f6" />
          <StatCard label="Revenue" value={`$${stats.totalRevenue.toFixed(2)}`} icon="💰" color="#22c55e" />
          <StatCard label="Purchases" value={stats.totalPurchases} icon="🛒" color="#f59e0b" />
          <StatCard label="Tokens in Circulation" value={stats.totalTokensInCirculation.toLocaleString()} icon="🪙" color="#fbbf24" />
          <StatCard label="Games Played" value={stats.totalGamesPlayed.toLocaleString()} icon="🎮" color="#a855f7" />
          <StatCard label="VIP Users" value={stats.vipUsers} icon="👑" color="#ec4899" />
        </div>
      )}

      {/* Tabs */}
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          {(['stats', 'users', 'purchases'] as const).map((tab) => (
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
              {tab}
            </button>
          ))}
        </div>

        {/* Users Table */}
        {activeTab === 'users' && (
          <div style={{ background: '#1e293b', borderRadius: '12px', border: '1px solid #334155', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#0f172a' }}>
                    <th style={thStyle}>User</th>
                    <th style={thStyle}>Email</th>
                    <th style={thStyle}>Tokens</th>
                    <th style={thStyle}>VIP</th>
                    <th style={thStyle}>Games</th>
                    <th style={thStyle}>Win Rate</th>
                    <th style={thStyle}>Streak</th>
                    <th style={thStyle}>Joined</th>
                    <th style={thStyle}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} style={{ borderBottom: '1px solid #334155' }}>
                      <td style={tdStyle}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '20px', background: user.avatar_color, borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {user.avatar_emoji}
                          </span>
                          <span style={{ color: '#cbd5e1', fontWeight: '600' }}>{user.username}</span>
                        </div>
                      </td>
                      <td style={tdStyle}><span style={{ color: '#94a3b8', fontSize: '13px' }}>{user.email}</span></td>
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
                      <td style={tdStyle}><span style={{ color: '#f472b6' }}>🔥 {user.daily_streak}</span></td>
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
        )}

        {/* Purchases Table */}
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

        {/* Stats Detail */}
        {activeTab === 'stats' && stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
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
                  <span style={{ color: '#94a3b8' }}>Avg. Purchase Value</span>
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
                  <span style={{ color: '#94a3b8' }}>Tokens in Circulation</span>
                  <span style={{ color: '#fbbf24', fontWeight: '600' }}>{stats.totalTokensInCirculation.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8' }}>Tokens Purchased</span>
                  <span style={{ color: '#22c55e', fontWeight: '600' }}>{stats.totalTokensPurchased.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8' }}>Avg. Tokens/User</span>
                  <span style={{ color: '#a855f7', fontWeight: '600' }}>
                    {stats.totalUsers > 0 ? Math.round(stats.totalTokensInCirculation / stats.totalUsers).toLocaleString() : 0}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ background: '#1e293b', borderRadius: '12px', border: '1px solid #334155', padding: '20px' }}>
              <h3 style={{ color: '#14b8a6', margin: '0 0 16px', fontSize: '18px' }}>👥 User Engagement</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8' }}>Total Users</span>
                  <span style={{ color: '#3b82f6', fontWeight: '600' }}>{stats.totalUsers}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8' }}>Games Played</span>
                  <span style={{ color: '#a855f7', fontWeight: '600' }}>{stats.totalGamesPlayed.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8' }}>VIP Users</span>
                  <span style={{ color: '#ec4899', fontWeight: '600' }}>{stats.vipUsers} ({stats.totalUsers > 0 ? ((stats.vipUsers / stats.totalUsers) * 100).toFixed(1) : 0}%)</span>
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
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <span style={{ fontSize: '32px', background: selectedUser.avatar_color, borderRadius: '50%', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {selectedUser.avatar_emoji}
              </span>
              <div>
                <h3 style={{ color: '#14b8a6', margin: 0, fontSize: '20px' }}>{selectedUser.username}</h3>
                <p style={{ color: '#64748b', margin: 0, fontSize: '13px' }}>{selectedUser.email}</p>
              </div>
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
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid #334155',
                    background: '#0f172a',
                    color: 'white',
                    fontSize: '14px',
                  }}
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

            {/* Quick Actions */}
            <div style={{ display: 'flex', gap: '8px' }}>
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
                  if (confirm('Delete this user permanently?')) {
                    adminAction('deleteUser', { userId: selectedUser.id });
                  }
                }}
                disabled={actionLoading}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  background: 'rgba(239, 68, 68, 0.1)',
                  color: '#f87171',
                  fontWeight: '600',
                  cursor: actionLoading ? 'not-allowed' : 'pointer',
                }}
              >
                Delete User
              </button>
            </div>

            <button
              onClick={() => setSelectedUser(null)}
              style={{
                width: '100%',
                padding: '12px',
                marginTop: '16px',
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
    </div>
  );
}

function StatCard({ label, value, icon, color }: { label: string; value: string | number; icon: string; color: string }) {
  return (
    <div
      style={{
        background: '#1e293b',
        borderRadius: '12px',
        padding: '20px',
        border: '1px solid #334155',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
      }}
    >
      <div
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          background: `${color}20`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
        }}
      >
        {icon}
      </div>
      <div>
        <div style={{ color: '#64748b', fontSize: '12px', marginBottom: '4px' }}>{label}</div>
        <div style={{ color, fontSize: '24px', fontWeight: '700' }}>{value}</div>
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
