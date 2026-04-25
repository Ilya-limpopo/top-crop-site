'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    setLoading(false);
    if (res.ok) {
      router.push('/admin');
    } else {
      setError('Invalid email or password.');
      setPassword('');
    }
  }

  const label: React.CSSProperties = { display: 'block', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8ab496', marginBottom: '8px' };
  const input: React.CSSProperties = { width: '100%', padding: '12px 14px', border: '1px solid #d4e8d0', borderRadius: '2px', fontSize: '14.5px', fontFamily: 'inherit', color: '#0a2014', background: '#fff', outline: 'none', marginBottom: '18px' };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: '#f0f9eb', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', WebkitFontSmoothing: 'antialiased' }}>
      <div style={{ width: '100%', maxWidth: '380px', padding: '52px 44px 44px', background: '#fff', border: '1px solid #d8edd4', borderRadius: '4px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: '22px', fontWeight: 700, letterSpacing: '0.06em', color: '#0a2014' }}>TOP CROP</div>
          <div style={{ fontSize: '8px', letterSpacing: '0.35em', textTransform: 'uppercase', color: '#2b8c30', marginTop: '3px' }}>Tanzania</div>
          <div style={{ fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#8ab496', marginTop: '14px' }}>Admin Panel</div>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <label style={label}>Email</label>
          <input type="email" placeholder="admin@topcrop.tz" autoComplete="username" required value={email} onChange={e => { setEmail(e.target.value); setError(''); }} style={input} />
          <label style={label}>Password</label>
          <input type="password" placeholder="••••••••" autoComplete="current-password" required value={password} onChange={e => { setPassword(e.target.value); setError(''); }} style={{ ...input, marginBottom: '6px' }} />
          {error && <div style={{ fontSize: '12px', color: '#c0392b', marginBottom: '12px', textAlign: 'center' }}>{error}</div>}
          <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', background: loading ? '#e6b800' : '#f5c800', color: '#1a1100', border: 'none', borderRadius: '2px', fontFamily: 'inherit', fontSize: '11.5px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: loading ? 'default' : 'pointer', marginTop: '8px', transition: 'background 0.18s' }}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <a href="/" style={{ display: 'block', textAlign: 'center', marginTop: '28px', fontSize: '12px', color: '#8ab496', letterSpacing: '0.04em', textDecoration: 'none' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#2b8c30')}
          onMouseLeave={e => (e.currentTarget.style.color = '#8ab496')}>← View Website</a>
      </div>
    </div>
  );
}
