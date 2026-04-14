import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Verify() {
  const router = useRouter();
  const { token } = router.query;
  const [username, setUsername] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    if (!token) return setStatus('❌ Invalid link. Please use the link from the Discord bot.');
    const res = await fetch(`/api/get-code?token=${token}`);
    const data = await res.json();
    if (data.error) {
      setStatus('❌ Invalid or expired token.');
    } else {
      setShowForm(true);
    }
  };

  const checkVerify = async () => {
    if (!username) return setStatus('❌ Please enter your Roblox username.');
    setLoading(true);
    const res = await fetch('/api/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, username }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.success) {
      setStatus('✅ Verified! You can now go back to Discord.');
    } else {
      setStatus(`❌ ${data.error}`);
    }
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#1a3320' }}>

      <img
        src="/primalwebbackground1.png"
        alt="Game Logo"
        style={{ width: '250px', height: '250px', objectFit: 'cover', borderRadius: '50%', border: '4px solid #15803d', marginBottom: '2rem' }}
      />

      <div style={{ backgroundColor: 'rgba(31,41,55,0.95)', padding: '2rem', borderRadius: '0.75rem', width: '100%', maxWidth: '28rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: 'white', marginBottom: '0.5rem' }}>Roblox Verification</h1>
        <p style={{ color: '#9ca3af', marginBottom: '1.5rem' }}>Link your Roblox account to Discord</p>

        {!showForm ? (
          <button
            onClick={handleStart}
            style={{ backgroundColor: '#15803d', color: 'white', fontWeight: 'bold', padding: '0.5rem 1.5rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', width: '100%', fontSize: '1rem' }}
          >
            Get Started
          </button>
        ) : (
          <div>
            <p style={{ color: 'white', marginBottom: '1rem' }}>
              Make sure you have joined the <strong style={{ color: '#4ade80' }}>Roblox group</strong> first, then enter your Roblox username below!
            </p>
            <a
              href="https://www.roblox.com/groups/16689173"
              target="_blank"
              style={{ display: 'block', backgroundColor: '#1d4ed8', color: 'white', fontWeight: 'bold', padding: '0.5rem 1.5rem', borderRadius: '0.5rem', marginBottom: '1rem', textDecoration: 'none' }}
            >
              🎮 Join the Group
            </a>
            <input
              type="text"
              placeholder="Enter your Roblox username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              style={{ width: '100%', backgroundColor: '#111827', color: 'white', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem', border: '1px solid #374151', fontSize: '1rem', boxSizing: 'border-box' }}
            />
            <button
              onClick={checkVerify}
              style={{ backgroundColor: '#15803d', color: 'white', fontWeight: 'bold', padding: '0.5rem 1.5rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', width: '100%', fontSize: '1rem' }}
            >
              {loading ? 'Checking...' : "Verify Me!"}
            </button>
          </div>
        )}
        {status && <p style={{ marginTop: '1rem', color: 'white' }}>{status}</p>}
      </div>
    </div>
  );
}