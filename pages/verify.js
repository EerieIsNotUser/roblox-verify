import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const SLIDES = [
  '/primalwebbackground1.png',
  '/primalwebbackground2.png',
  '/primalwebbackground3.png',
  '/primalwebbackground4.png',
  '/primalwebbackground5.png',
];

export default function Verify() {
  const router = useRouter();
  const { token } = router.query;

  const [username, setUsername] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [status, setStatus] = useState('');
  const [statusType, setStatusType] = useState(''); // 'error' | 'success'
  const [loading, setLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [nextSlide, setNextSlide] = useState(1);
  const [transitioning, setTransitioning] = useState(false);

  // Slideshow logic
  useEffect(() => {
    const interval = setInterval(() => {
      setTransitioning(true);
      setTimeout(() => {
        setCurrentSlide(prev => (prev + 1) % SLIDES.length);
        setNextSlide(prev => (prev + 1) % SLIDES.length);
        setTransitioning(false);
      }, 1500);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleStart = async () => {
    if (!token) {
      setStatus('Invalid link. Please use the link from the Discord bot.');
      setStatusType('error');
      return;
    }
    const res = await fetch(`/api/get-code?token=${token}`);
    const data = await res.json();
    if (data.error) {
      setStatus('Invalid or expired token. Please request a new link from the Discord bot.');
      setStatusType('error');
    } else {
      setShowForm(true);
      setStatus('');
    }
  };

  const checkVerify = async () => {
    if (!username.trim()) {
      setStatus('Please enter your Roblox username.');
      setStatusType('error');
      return;
    }
    setLoading(true);
    setStatus('');
    const res = await fetch('/api/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, username: username.trim() }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.success) {
      setStatus('Verified! You can now return to Discord.');
      setStatusType('success');
    } else {
      setStatus(data.error || 'Something went wrong. Please try again.');
      setStatusType('error');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && showForm) checkVerify();
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Inter:wght@400;500;600&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
          font-family: 'Inter', sans-serif;
          overflow: hidden;
        }

        .slide {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          transition: opacity 1.5s ease-in-out;
        }

        .slide-current {
          opacity: 1;
        }

        .slide-next {
          opacity: 0;
        }

        .slide-current.transitioning {
          opacity: 0;
        }

        .slide-next.transitioning {
          opacity: 1;
        }

        .overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(0,0,0,0.45) 0%,
            rgba(5, 30, 12, 0.65) 50%,
            rgba(0,0,0,0.7) 100%
          );
        }

        .page {
          position: relative;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          overflow: hidden;
        }

        .logo-wrap {
          position: relative;
          margin-bottom: 2rem;
          animation: floatIn 0.8s ease both;
        }

        .logo-wrap img {
          width: 120px;
          height: 120px;
          object-fit: cover;
          border-radius: 50%;
          border: 3px solid rgba(74, 222, 128, 0.6);
          box-shadow: 0 0 32px rgba(21, 128, 61, 0.5), 0 0 8px rgba(74, 222, 128, 0.3);
          display: block;
        }

        .logo-ring {
          position: absolute;
          inset: -6px;
          border-radius: 50%;
          border: 1px solid rgba(74, 222, 128, 0.25);
          animation: spin 12s linear infinite;
        }

        .card {
          background: rgba(10, 20, 14, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(74, 222, 128, 0.15);
          border-radius: 1rem;
          padding: 2.5rem 2rem;
          width: 100%;
          max-width: 26rem;
          text-align: center;
          box-shadow: 0 24px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04);
          animation: slideUp 0.8s ease 0.2s both;
        }

        .card-title {
          font-family: 'Cinzel', serif;
          font-size: 1.6rem;
          font-weight: 700;
          color: #fff;
          letter-spacing: 0.02em;
          margin-bottom: 0.4rem;
        }

        .card-sub {
          font-size: 0.875rem;
          color: rgba(156, 163, 175, 0.9);
          margin-bottom: 2rem;
          letter-spacing: 0.02em;
        }

        .btn-primary {
          width: 100%;
          padding: 0.8rem 1.5rem;
          background: linear-gradient(135deg, #15803d, #166534);
          color: #fff;
          font-family: 'Inter', sans-serif;
          font-size: 0.9rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 20px rgba(21, 128, 61, 0.35);
        }

        .btn-primary:hover {
          background: linear-gradient(135deg, #16a34a, #15803d);
          box-shadow: 0 6px 28px rgba(21, 128, 61, 0.5);
          transform: translateY(-1px);
        }

        .btn-primary:active {
          transform: translateY(0);
        }

        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .btn-secondary {
          display: block;
          width: 100%;
          padding: 0.75rem 1.5rem;
          background: rgba(29, 78, 216, 0.8);
          color: #fff;
          font-size: 0.875rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          border-radius: 0.5rem;
          text-decoration: none;
          margin-bottom: 1.25rem;
          transition: all 0.2s ease;
          border: 1px solid rgba(59, 130, 246, 0.3);
        }

        .btn-secondary:hover {
          background: rgba(29, 78, 216, 1);
          transform: translateY(-1px);
        }

        .divider {
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(74, 222, 128, 0.2), transparent);
          margin: 1.5rem 0;
        }

        .form-hint {
          font-size: 0.85rem;
          color: rgba(156, 163, 175, 0.85);
          margin-bottom: 1.25rem;
          line-height: 1.5;
        }

        .form-hint strong {
          color: #4ade80;
        }

        .input {
          width: 100%;
          background: rgba(0, 0, 0, 0.4);
          color: #fff;
          padding: 0.8rem 1rem;
          border-radius: 0.5rem;
          border: 1px solid rgba(74, 222, 128, 0.2);
          font-size: 0.9rem;
          font-family: 'Inter', sans-serif;
          margin-bottom: 1rem;
          outline: none;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .input::placeholder {
          color: rgba(156, 163, 175, 0.5);
        }

        .input:focus {
          border-color: rgba(74, 222, 128, 0.5);
          box-shadow: 0 0 0 3px rgba(74, 222, 128, 0.08);
        }

        .status {
          margin-top: 1.25rem;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          font-size: 0.85rem;
          font-weight: 500;
          line-height: 1.4;
        }

        .status.error {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.25);
          color: #fca5a5;
        }

        .status.success {
          background: rgba(74, 222, 128, 0.1);
          border: 1px solid rgba(74, 222, 128, 0.25);
          color: #4ade80;
        }

        .dots {
          display: flex;
          justify-content: center;
          gap: 6px;
          margin-top: 1.5rem;
        }

        .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(255,255,255,0.2);
          transition: background 0.3s ease;
        }

        .dot.active {
          background: rgba(74, 222, 128, 0.7);
        }

        @keyframes floatIn {
          from { opacity: 0; transform: translateY(-16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>

      <div className="page">
        {/* Slideshow layers */}
        {SLIDES.map((src, i) => (
          <div
            key={src}
            className={`slide ${i === currentSlide ? `slide-current${transitioning ? ' transitioning' : ''}` : ''} ${i === nextSlide && i !== currentSlide ? `slide-next${transitioning ? ' transitioning' : ''}` : ''}`}
            style={{
              backgroundImage: `url(${src})`,
              zIndex: i === currentSlide ? 1 : i === nextSlide ? 0 : -1,
              opacity: i === currentSlide ? (transitioning ? 0 : 1) : i === nextSlide ? (transitioning ? 1 : 0) : 0,
            }}
          />
        ))}
        <div className="overlay" style={{ zIndex: 2 }} />

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className="logo-wrap">
            <div className="logo-ring" />
            <img src="/primalwebbackground1.png" alt="Primal Pursuit" />
          </div>

          <div className="card">
            <h1 className="card-title">Primal Pursuit</h1>
            <p className="card-sub">Link your Roblox account to Discord</p>

            <div className="divider" />

            {!showForm ? (
              <button className="btn-primary" onClick={handleStart}>
                Get Started
              </button>
            ) : (
              <div>
                <p className="form-hint">
                  Make sure you've joined the <strong>Roblox group</strong> first, then enter your username below.
                </p>
                <a
                  className="btn-secondary"
                  href="https://www.roblox.com/groups/16689173"
                  target="_blank"
                  rel="noreferrer"
                >
                  🎮 Join the Group
                </a>
                <input
                  className="input"
                  type="text"
                  placeholder="Roblox username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoFocus
                />
                <button
                  className="btn-primary"
                  onClick={checkVerify}
                  disabled={loading}
                >
                  {loading ? 'Verifying…' : 'Verify Me'}
                </button>
              </div>
            )}

            {status && (
              <div className={`status ${statusType}`}>
                {statusType === 'error' ? '✕ ' : '✓ '}{status}
              </div>
            )}
          </div>

          {/* Slide indicator dots */}
          <div className="dots">
            {SLIDES.map((_, i) => (
              <div key={i} className={`dot${i === currentSlide ? ' active' : ''}`} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}