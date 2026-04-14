import { useState, useEffect } from 'react';

const backgrounds = [
  '/primalbg1.png',
  '/primalbg2.png',
  '/primalbg3.jpg',
  '/primalbg4.png',
  '/primalbg5.jpg',
];

export default function Home() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % backgrounds.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      
      {/* Background slides */}
      {backgrounds.map((bg, i) => (
        <div
          key={i}
          style={{
            backgroundImage: `url('${bg}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: i === current ? 1 : 0,
            transition: 'opacity 1.5s ease-in-out',
            zIndex: 0,
          }}
        />
      ))}

      {/* Dark overlay */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 1 }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <img
          src="/primalwebbackground1.png"
          alt="Game Logo"
          className="rounded-full border-4 border-green-700 shadow-2xl mb-8"
          style={{ width: '400px', height: '400px', objectFit: 'cover', borderRadius: '50%', border: '4px solid #15803d', marginBottom: '2rem' }}
        />
        <div style={{ backgroundColor: 'rgba(31,41,55,0.9)', padding: '2rem', borderRadius: '0.75rem', width: '100%', maxWidth: '28rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: 'white', marginBottom: '0.5rem' }}>Roblox Verification</h1>
          <p style={{ color: '#9ca3af', marginBottom: '1.5rem' }}>Link your Roblox account to Discord</p>
          <p style={{ color: '#fbbf24' }}>⚠️ Please use the link provided by the Discord bot to verify.</p>
        </div>
      </div>
    </div>
  );
}