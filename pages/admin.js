import { useState } from 'react';

const ADMINS = {
  Eerie: 'ADMIN_EERIE',
  KKG: 'ADMIN_KKG',
  KA: 'ADMIN_KA',
};

export default function Admin() {
  const [password, setPassword] = useState('');
  const [adminName, setAdminName] = useState('');
  const [authed, setAuthed] = useState(false);
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [stats, setStats] = useState({ total: 0 });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const login = async () => {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    if (data.success) {
      setAdminName(data.name);
      setAuthed(true);
      fetchUsers();
    } else {
      setError('❌ Incorrect password');
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    setUsers(data.users || []);
    setStats({ total: data.users?.length || 0 });
    setLoading(false);
  };

  const unverify = async (discordId) => {
    const res = await fetch('/api/admin/unverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password, discordId }),
    });
    const data = await res.json();
    if (data.success) {
      setMessage('✅ User unverified successfully!');
      fetchUsers();
    } else {
      setMessage('❌ Failed to unverify user');
    }
  };

  const filtered = users.filter(u =>
    u.roblox_username.toLowerCase().includes(search.toLowerCase()) ||
    u.discord_id.includes(search)
  );

  if (!authed) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#1a3320', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ backgroundColor: 'rgba(31,41,55,0.95)', padding: '2rem', borderRadius: '0.75rem', width: '100%', maxWidth: '24rem', textAlign: 'center' }}>
          <img
            src="/primalwebbackground1.png"
            alt="Logo"
            style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '50%', border: '3px solid #15803d', marginBottom: '1rem' }}
          />
          <h1 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>🔒 Admin Panel</h1>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && login()}
            style={{ width: '100%', backgroundColor: '#111827', color: 'white', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem', border: '1px solid #374151', fontSize: '1rem', boxSizing: 'border-box' }}
          />
          {error && <p style={{ color: '#f87171', marginBottom: '1rem' }}>{error}</p>}
          <button
            onClick={login}
            style={{ backgroundColor: '#15803d', color: 'white', fontWeight: 'bold', padding: '0.5rem 1.5rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', width: '100%', fontSize: '1rem' }}
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#111827', padding: '2rem' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ color: 'white', fontSize: '1.875rem', fontWeight: 'bold' }}>🛡️ Admin Dashboard</h1>
            <p style={{ color: '#4ade80', marginTop: '0.25rem' }}>Welcome back, {adminName}! 👋</p>
          </div>
          <button
            onClick={() => { setAuthed(false); setAdminName(''); }}
            style={{ backgroundColor: '#374151', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer' }}
          >
            Logout
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ backgroundColor: 'rgba(31,41,55,0.95)', padding: '1.5rem', borderRadius: '0.75rem', textAlign: 'center' }}>
            <p style={{ color: '#9ca3af', marginBottom: '0.5rem' }}>Total Verified</p>
            <p style={{ color: '#4ade80', fontSize: '2rem', fontWeight: 'bold' }}>{stats.total}</p>
          </div>
          <div style={{ backgroundColor: 'rgba(31,41,55,0.95)', padding: '1.5rem', borderRadius: '0.75rem', textAlign: 'center' }}>
            <p style={{ color: '#9ca3af', marginBottom: '0.5rem' }}>Search Results</p>
            <p style={{ color: '#60a5fa', fontSize: '2rem', fontWeight: 'bold' }}>{filtered.length}</p>
          </div>
          <div style={{ backgroundColor: 'rgba(31,41,55,0.95)', padding: '1.5rem', borderRadius: '0.75rem', textAlign: 'center' }}>
            <p style={{ color: '#9ca3af', marginBottom: '0.5rem' }}>Status</p>
            <p style={{ color: '#4ade80', fontSize: '1.25rem', fontWeight: 'bold' }}>🟢 Online</p>
          </div>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search by Roblox username or Discord ID..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: '100%', backgroundColor: '#1f2937', color: 'white', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem', border: '1px solid #374151', fontSize: '1rem', boxSizing: 'border-box' }}
        />

        {message && <p style={{ color: '#4ade80', marginBottom: '1rem' }}>{message}</p>}

        {/* Users Table */}
        <div style={{ backgroundColor: 'rgba(31,41,55,0.95)', borderRadius: '0.75rem', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#374151' }}>
                <th style={{ color: '#9ca3af', padding: '0.75rem 1rem', textAlign: 'left' }}>Roblox Username</th>
                <th style={{ color: '#9ca3af', padding: '0.75rem 1rem', textAlign: 'left' }}>Roblox ID</th>
                <th style={{ color: '#9ca3af', padding: '0.75rem 1rem', textAlign: 'left' }}>Discord ID</th>
                <th style={{ color: '#9ca3af', padding: '0.75rem 1rem', textAlign: 'left' }}>Verified At</th>
                <th style={{ color: '#9ca3af', padding: '0.75rem 1rem', textAlign: 'left' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" style={{ color: 'white', padding: '1rem', textAlign: 'center' }}>Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="5" style={{ color: '#9ca3af', padding: '1rem', textAlign: 'center' }}>No users found</td></tr>
              ) : (
                filtered.map((user, i) => (
                  <tr key={i} style={{ borderTop: '1px solid #374151' }}>
                    <td style={{ color: 'white', padding: '0.75rem 1rem' }}>{user.roblox_username}</td>
                    <td style={{ color: '#9ca3af', padding: '0.75rem 1rem' }}>{user.roblox_id}</td>
                    <td style={{ color: '#9ca3af', padding: '0.75rem 1rem' }}>{user.discord_id}</td>
                    <td style={{ color: '#9ca3af', padding: '0.75rem 1rem' }}>{new Date(user.verified_at).toLocaleDateString()}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <button
                        onClick={() => unverify(user.discord_id)}
                        style={{ backgroundColor: '#dc2626', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '0.375rem', border: 'none', cursor: 'pointer', fontSize: '0.875rem' }}
                      >
                        Unverify
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}