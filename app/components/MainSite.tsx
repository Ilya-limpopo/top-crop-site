'use client';

import { useState, useEffect, useRef } from 'react';
import type { SiteData } from '@/lib/defaults';

const THEMES: Record<string, Record<string, string>> = {
  dark: {
    '--bg': '#091f10', '--bg-card': '#0d2717', '--bg-sub': '#112e1c',
    '--fg': '#edf8ed', '--fg-muted': '#6aab7a', '--accent': '#7ed63a',
    '--border': 'rgba(255,255,255,0.07)',
  },
  light: {
    '--bg': '#f0f9eb', '--bg-card': '#e4f2dc', '--bg-sub': '#f8fef4',
    '--fg': '#0a2014', '--fg-muted': '#457553', '--accent': '#2b8c30',
    '--border': 'rgba(0,0,0,0.1)',
  },
  earth: {
    '--bg': '#14100a', '--bg-card': '#1c1710', '--bg-sub': '#211c12',
    '--fg': '#f5ece0', '--fg-muted': '#9a7850', '--accent': '#c6d638',
    '--border': 'rgba(255,255,255,0.07)',
  },
};

function applyTheme(t: string) {
  const vars = THEMES[t] || THEMES.light;
  Object.entries(vars).forEach(([k, v]) => document.documentElement.style.setProperty(k, v));
}

// ── Img ──────────────────────────────────────────────────────────────────────
function Img({ src, alt, style = {} }: { src: string; alt: string; style?: React.CSSProperties }) {
  const [err, setErr] = useState(false);
  if (src && !err) {
    return (
      <div style={{ overflow: 'hidden', flexShrink: 0, ...style }}>
        <img src={src} alt={alt} onError={() => setErr(true)}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.5s ease' }}
          onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.04)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')} />
      </div>
    );
  }
  return (
    <div className="placeholder-img" style={style}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.28 }}>
        <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M21 15l-5-5L5 21" stroke="currentColor" strokeWidth="1.5" />
      </svg>
      <span style={{ opacity: 0.45 }}>{alt}</span>
    </div>
  );
}

// ── FadeIn ────────────────────────────────────────────────────────────────────
function FadeIn({ children, delay = 0, style = {} }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setTimeout(() => e.target.classList.add('vis'), delay); obs.disconnect(); }
    }, { threshold: 0.08 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [delay]);
  return <div ref={ref} className="fade-in" style={style}>{children}</div>;
}

// ── Counter ───────────────────────────────────────────────────────────────────
function Counter({ end, suffix = '' }: { end: number; suffix?: string }) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        let s: number | null = null;
        const step = (ts: number) => { if (!s) s = ts; const p = Math.min((ts - s) / 1600, 1); setN(Math.floor(p * end)); if (p < 1) requestAnimationFrame(step); };
        requestAnimationFrame(step);
        obs.disconnect();
      }
    });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [end]);
  return <span ref={ref}>{n.toLocaleString()}{suffix}</span>;
}

// ── Nav ───────────────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);
  const links = [['About', '#about'], ['Products', '#products'], ['Sustainability', '#sustainability'], ['Farm', '#farm'], ['News', '#news'], ['Careers', '#careers']];
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, padding: '18px 0',
      background: scrolled ? 'rgba(9,31,16,0.95)' : 'transparent',
      backdropFilter: scrolled ? 'blur(14px)' : 'none',
      borderBottom: scrolled ? '1px solid var(--border)' : 'none',
      transition: 'all 0.35s ease',
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <a href="#" style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
          <span style={{ fontFamily: 'var(--font-playfair, Playfair Display, serif)', fontSize: '19px', fontWeight: 700, letterSpacing: '0.06em', color: scrolled ? '#edf8ed' : 'var(--fg)' }}>TOP CROP</span>
          <span style={{ fontSize: '8px', letterSpacing: '0.35em', color: 'var(--accent)', textTransform: 'uppercase' }}>Tanzania</span>
        </a>
        <div style={{ display: 'flex', gap: '28px', alignItems: 'center' }}>
          {links.map(([l, h]) => (
            <a key={l} href={h} style={{ fontSize: '12.5px', letterSpacing: '0.04em', color: 'var(--fg-muted)', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--fg)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--fg-muted)')}>{l}</a>
          ))}
          <a href="#contact" className="btn-banana" style={{ fontSize: '11.5px', padding: '9px 22px' }}>Contact</a>
        </div>
      </div>
    </nav>
  );
}

// ── Hero Minimal ──────────────────────────────────────────────────────────────
function HeroMinimal({ c }: { c: Record<string, string> }) {
  return (
    <section id="hero" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', paddingTop: '80px' }}>
      <div className="container">
        <FadeIn>
          <div className="label" style={{ marginBottom: '36px' }}>Top Crop · Tanzania · Est. 2024</div>
          <h1 style={{ fontSize: 'clamp(52px, 8vw, 110px)', fontWeight: 400, lineHeight: 1.0, letterSpacing: '-0.025em', marginBottom: '36px' }}>
            Agriculture<br /><em style={{ fontStyle: 'italic', color: 'var(--fg-muted)' }}>done right.</em>
          </h1>
          <p style={{ fontSize: '18px', color: 'var(--fg-muted)', maxWidth: '480px', margin: '0 auto 52px', lineHeight: 1.8 }}>
            {c['hero.sub']}
          </p>
          <div style={{ width: '1px', height: '72px', background: 'var(--accent)', margin: '0 auto', opacity: 0.5 }} />
        </FadeIn>
      </div>
    </section>
  );
}

// ── Hero Bold ─────────────────────────────────────────────────────────────────
function HeroBold({ c, photos }: { c: Record<string, string>; photos: Record<string, string> }) {
  return (
    <section id="hero" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden', paddingTop: '80px' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 60% at 75% 50%, rgba(125,214,58,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '38%', display: 'flex', flexDirection: 'column' }}>
        <Img src={photos['aerial plantation view']} alt="aerial plantation view" style={{ height: '58%' }} />
        <Img src={photos['banana harvest']} alt="banana harvest" style={{ height: '42%' }} />
      </div>
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '660px' }}>
          <FadeIn>
            <div className="label" style={{ marginBottom: '28px' }}>Tanzania · Est. 2024</div>
            <h1 style={{ fontSize: 'clamp(44px, 6vw, 84px)', fontWeight: 700, lineHeight: 1.05, marginBottom: '28px', letterSpacing: '-0.015em' }}>
              {c['hero.headline'].split('.')[0]}.<br />
              <em style={{ color: 'var(--accent)', fontStyle: 'italic' }}>World&apos;s Table.</em>
            </h1>
          </FadeIn>
          <FadeIn delay={180}>
            <p style={{ fontSize: '17px', color: 'var(--fg-muted)', maxWidth: '480px', lineHeight: 1.85, marginBottom: '44px' }}>{c['hero.sub']}</p>
            <div style={{ display: 'flex', gap: '14px' }}>
              <a href="#products" className="btn-banana" style={{ padding: '15px 34px', fontSize: '12px' }}>Explore Products</a>
              <a href="#about" style={{ padding: '15px 34px', borderRadius: '2px', fontSize: '12px', fontWeight: 400, letterSpacing: '0.08em', textTransform: 'uppercase', background: 'transparent', color: 'var(--fg)', border: '1px solid rgba(255,255,255,0.2)', transition: 'border-color 0.2s', display: 'inline-block' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)')}>Our Story</a>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

// ── Stats ─────────────────────────────────────────────────────────────────────
function Stats() {
  const items: [number, string, string][] = [[5000, '+', 'Hectares Cultivated'], [12, 'K+', 'Tonnes Exported Yearly'], [30, '+', 'Global Partners'], [800, '+', 'Local Employees']];
  return (
    <div style={{ background: 'var(--bg-sub)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '52px 0' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)' }}>
          {items.map(([v, s, l], i) => (
            <div key={i} style={{ textAlign: 'center', padding: '20px 16px', borderRight: i < 3 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ fontSize: '46px', fontFamily: 'var(--font-playfair, Playfair Display, serif)', fontWeight: 600, color: 'var(--accent)', lineHeight: 1 }}>
                <Counter end={v} suffix={s} />
              </div>
              <div style={{ fontSize: '10.5px', color: 'var(--fg-muted)', marginTop: '10px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── About ─────────────────────────────────────────────────────────────────────
function About({ c, photos }: { c: Record<string, string>; photos: Record<string, string> }) {
  return (
    <section id="about" style={{ padding: '120px 0' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '88px', alignItems: 'center' }}>
          <FadeIn>
            <div className="label" style={{ marginBottom: '16px' }}>About Top Crop</div>
            <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 50px)', fontWeight: 600, marginBottom: '28px' }}>{c['about.headline']}</h2>
            <p style={{ fontSize: '16px', color: 'var(--fg-muted)', lineHeight: 1.85, marginBottom: '18px' }}>{c['about.body1']}</p>
            <p style={{ fontSize: '16px', color: 'var(--fg-muted)', lineHeight: 1.85, marginBottom: '44px' }}>{c['about.body2']}</p>
            <div style={{ display: 'flex', gap: '36px' }}>
              {[['2024', 'Founded'], ['ISO 9001', 'Certified'], ['3 Regions', 'Tanzania']].map(([v, l]) => (
                <div key={v}>
                  <div style={{ fontSize: '20px', fontFamily: 'var(--font-playfair, Playfair Display, serif)', fontWeight: 600, marginBottom: '5px' }}>{v}</div>
                  <div style={{ fontSize: '10px', color: 'var(--fg-muted)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{l}</div>
                </div>
              ))}
            </div>
          </FadeIn>
          <FadeIn delay={160}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: 'auto auto', gap: '8px' }}>
              <Img src={photos['field workers']} alt="field workers" style={{ aspectRatio: '3/4', gridRow: '1/3' }} />
              <Img src={photos['palm nursery']} alt="palm nursery" style={{ aspectRatio: '4/3' }} />
              <Img src={photos['quality check']} alt="quality check" style={{ aspectRatio: '4/3' }} />
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

// ── Products ──────────────────────────────────────────────────────────────────
function Products({ c, photos }: { c: Record<string, string>; photos: Record<string, string> }) {
  const [tab, setTab] = useState<'banana' | 'palm'>('banana');
  const prods = {
    banana: {
      latin: 'Musa acuminata', img: photos['banana bunch close-up'],
      title: c['products.banana.title'], body: c['products.banana.body'],
      specs: [['Varieties', 'Cavendish, Red Banana, Plantain'], ['Season', 'Year-round harvest'], ['Certifications', 'GlobalG.A.P., Rainforest Alliance'], ['Export Markets', 'EU, UAE, Southeast Asia']],
    },
    palm: {
      latin: 'Elaeis guineensis', img: photos['palm fruit cluster'],
      title: c['products.palm.title'], body: c['products.palm.body'],
      specs: [['Products', 'CPO, RBDPO, Palm Kernel Oil'], ['Processing', 'On-site mill, cold-press'], ['Certifications', 'RSPO, ISO 22000'], ['Applications', 'Food, cosmetics, biofuel']],
    },
  };
  const p = prods[tab];
  return (
    <section id="products" style={{ padding: '120px 0', background: 'var(--bg-sub)' }}>
      <div className="container">
        <FadeIn>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '64px', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <div className="label" style={{ marginBottom: '14px' }}>Our Products</div>
              <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 50px)', fontWeight: 600 }}>What We Grow</h2>
            </div>
            <div style={{ display: 'flex', border: '1px solid var(--border)', borderRadius: '3px', overflow: 'hidden' }}>
              {(['banana', 'palm'] as const).map(k => (
                <button key={k} onClick={() => setTab(k)} style={{ padding: '11px 28px', border: 'none', cursor: 'pointer', background: tab === k ? '#f5c800' : 'transparent', color: tab === k ? '#1a1100' : 'var(--fg-muted)', fontSize: '13px', fontWeight: tab === k ? 500 : 400, letterSpacing: '0.05em', transition: 'all 0.2s', fontFamily: 'inherit' }}>
                  {k === 'banana' ? 'Bananas' : 'Palm Oil'}
                </button>
              ))}
            </div>
          </div>
        </FadeIn>
        <FadeIn delay={100}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '72px', alignItems: 'start' }}>
            <Img src={p.img} alt={p.title} style={{ aspectRatio: '5/4' }} />
            <div>
              <div style={{ fontSize: '13px', fontStyle: 'italic', color: 'var(--fg-muted)', marginBottom: '14px' }}>{p.latin}</div>
              <h3 style={{ fontSize: '38px', fontWeight: 600, marginBottom: '22px' }}>{p.title}</h3>
              <p style={{ fontSize: '15.5px', color: 'var(--fg-muted)', lineHeight: 1.85, marginBottom: '36px' }}>{p.body}</p>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '32px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {p.specs.map(([k, v]) => (
                  <div key={k} style={{ display: 'grid', gridTemplateColumns: '148px 1fr', gap: '12px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--fg-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', paddingTop: '2px' }}>{k}</span>
                    <span style={{ fontSize: '14px', color: 'var(--fg)' }}>{v}</span>
                  </div>
                ))}
              </div>
              <a href="#contact" className="btn-banana" style={{ marginTop: '36px', padding: '12px 30px', fontSize: '12px', letterSpacing: '0.1em', display: 'inline-block' }}>Request Samples</a>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// ── Sustainability ────────────────────────────────────────────────────────────
function Sustainability({ c, photos }: { c: Record<string, string>; photos: Record<string, string> }) {
  const pillars = [
    ['◈', 'Land Stewardship', 'We farm with regenerative practices — rotating crops, maintaining soil health, and preserving wildlife corridors across our 5,000+ hectare operations.'],
    ['◉', 'Community Impact', 'Over 800 permanent employees and thousands of seasonal workers. We invest in local schools, healthcare, and professional training throughout rural Tanzania.'],
    ['◎', 'Clean Supply Chain', 'Full traceability from seed to shipment. RSPO-certified palm oil and GlobalG.A.P. bananas — transparent at every step for our global partners.'],
  ];
  return (
    <section id="sustainability" style={{ padding: '120px 0' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '88px', alignItems: 'start' }}>
          <FadeIn>
            <div className="label" style={{ marginBottom: '16px' }}>Sustainability & ESG</div>
            <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 50px)', fontWeight: 600, marginBottom: '24px' }}>{c['sustainability.headline']}</h2>
            <p style={{ fontSize: '15.5px', color: 'var(--fg-muted)', lineHeight: 1.85, marginBottom: '36px' }}>{c['sustainability.body']}</p>
            <Img src={photos['ESG annual report']} alt="ESG annual report" style={{ aspectRatio: '4/3' }} />
          </FadeIn>
          <FadeIn delay={150}>
            <div style={{ paddingTop: '64px' }}>
              {pillars.map(([icon, title, body], i) => (
                <div key={i} style={{ padding: '36px 0', borderBottom: i < 2 ? '1px solid var(--border)' : 'none', display: 'flex', gap: '24px' }}>
                  <span style={{ fontSize: '20px', color: 'var(--accent)', marginTop: '3px', flexShrink: 0 }}>{icon}</span>
                  <div>
                    <h4 style={{ fontSize: '21px', fontWeight: 600, marginBottom: '12px' }}>{title}</h4>
                    <p style={{ fontSize: '15px', color: 'var(--fg-muted)', lineHeight: 1.8 }}>{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

// ── Gallery ───────────────────────────────────────────────────────────────────
function Gallery({ photos }: { photos: Record<string, string> }) {
  const imgs = [
    { key: 'banana plantation rows', wide: true },
    { key: 'palm tree canopy', wide: false },
    { key: 'harvesting team', wide: false },
    { key: 'processing facility', wide: false },
    { key: 'export packaging', wide: true },
    { key: 'irrigation system', wide: false },
    { key: 'sunrise over farm', wide: false },
    { key: 'soil sampling', wide: false },
  ];
  return (
    <section id="farm" style={{ padding: '120px 0', background: 'var(--bg-sub)' }}>
      <div className="container">
        <FadeIn>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '52px' }}>
            <div>
              <div className="label" style={{ marginBottom: '14px' }}>Farm Gallery</div>
              <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 50px)', fontWeight: 600 }}>See Our Operations</h2>
            </div>
            <a href="#contact" style={{ fontSize: '13px', color: 'var(--accent)', textDecoration: 'underline', textUnderlineOffset: '5px', letterSpacing: '0.05em' }}>Schedule a Visit →</a>
          </div>
        </FadeIn>
        <FadeIn delay={100}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            {imgs.map(img => (
              <Img key={img.key} src={photos[img.key]} alt={img.key} style={{ aspectRatio: img.wide ? '16/7' : '4/3', gridColumn: img.wide ? 'span 2' : 'span 1' }} />
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// ── News ──────────────────────────────────────────────────────────────────────
function News({ news }: { news: SiteData['news'] }) {
  return (
    <section id="news" style={{ padding: '120px 0' }}>
      <div className="container">
        <FadeIn>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '56px' }}>
            <div>
              <div className="label" style={{ marginBottom: '14px' }}>Latest News</div>
              <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 50px)', fontWeight: 600 }}>Updates</h2>
            </div>
          </div>
        </FadeIn>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1px', background: 'var(--border)', border: '1px solid var(--border)' }}>
          {news.map((a, i) => (
            <FadeIn key={a.id} delay={i * 90}>
              <div style={{ background: 'var(--bg)', padding: '40px 36px', cursor: 'pointer', transition: 'background 0.2s', height: '100%' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-sub)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'var(--bg)')}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <span style={{ fontSize: '9.5px', color: 'var(--accent)', letterSpacing: '0.16em', textTransform: 'uppercase' }}>{a.category}</span>
                  <span style={{ fontSize: '11px', color: 'var(--fg-muted)' }}>{a.date}</span>
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '14px', lineHeight: 1.3 }}>{a.title}</h3>
                <p style={{ fontSize: '14px', color: 'var(--fg-muted)', lineHeight: 1.8 }}>{a.body}</p>
                <div style={{ marginTop: '28px', fontSize: '12px', color: 'var(--accent)', letterSpacing: '0.04em' }}>Read More →</div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Careers ───────────────────────────────────────────────────────────────────
function Careers({ careers }: { careers: SiteData['careers'] }) {
  return (
    <section id="careers" style={{ padding: '120px 0', background: 'var(--bg-sub)' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '88px', alignItems: 'start' }}>
          <FadeIn>
            <div className="label" style={{ marginBottom: '16px' }}>Careers</div>
            <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 46px)', fontWeight: 600, marginBottom: '20px' }}>Join the<br />Top Crop Team</h2>
            <p style={{ fontSize: '15.5px', color: 'var(--fg-muted)', lineHeight: 1.85 }}>We&apos;re always looking for people who believe in sustainable agriculture and want to make a real impact in East Africa and beyond.</p>
          </FadeIn>
          <FadeIn delay={150}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--border)' }}>
              {careers.map(r => (
                <div key={r.id} style={{ background: 'var(--bg)', padding: '28px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', transition: 'background 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-card)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'var(--bg)')}>
                  <div>
                    <div style={{ fontSize: '17px', fontWeight: 500, marginBottom: '6px' }}>{r.title}</div>
                    <div style={{ fontSize: '12px', color: 'var(--fg-muted)' }}>{r.location} · {r.type}</div>
                  </div>
                  <span style={{ color: 'var(--accent)', fontSize: '18px', flexShrink: 0 }}>→</span>
                </div>
              ))}
              <div style={{ background: 'var(--bg)', padding: '20px 32px', textAlign: 'center' }}>
                <a href="mailto:careers@topcrop.tz" style={{ fontSize: '13px', color: 'var(--fg-muted)', letterSpacing: '0.03em' }}>Don&apos;t see a fit? Send an open application →</a>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

// ── Contact ───────────────────────────────────────────────────────────────────
function Contact({ settings }: { settings: Record<string, string> }) {
  const [form, setForm] = useState({ name: '', email: '', role: 'Buyer / Distributor', message: '' });
  const [sent, setSent] = useState(false);
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setForm(f => ({ ...f, [k]: e.target.value }));
  return (
    <section id="contact" style={{ padding: '120px 0' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '88px' }}>
          <FadeIn>
            <div className="label" style={{ marginBottom: '16px' }}>Contact</div>
            <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 50px)', fontWeight: 600, marginBottom: '28px' }}>Let&apos;s Talk<br />Business</h2>
            <p style={{ fontSize: '15.5px', color: 'var(--fg-muted)', lineHeight: 1.85, marginBottom: '48px' }}>Whether you&apos;re a buyer, investor, or potential partner — our team responds within 24 hours.</p>
            {[['HQ', settings.hq], ['Processing', settings.processing], ['Email', settings.email], ['Phone', settings.phone]].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', gap: '24px', marginBottom: '20px' }}>
                <span style={{ fontSize: '10px', color: 'var(--accent)', letterSpacing: '0.14em', textTransform: 'uppercase', width: '80px', paddingTop: '3px', flexShrink: 0 }}>{k}</span>
                <span style={{ fontSize: '15px', color: 'var(--fg-muted)' }}>{v}</span>
              </div>
            ))}
          </FadeIn>
          <FadeIn delay={150}>
            {sent ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '400px', gap: '16px' }}>
                <div style={{ width: '52px', height: '52px', border: '1px solid var(--accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', color: 'var(--accent)' }}>✓</div>
                <h3 style={{ fontSize: '24px', fontWeight: 600 }}>Message Sent</h3>
                <p style={{ fontSize: '15px', color: 'var(--fg-muted)' }}>We&apos;ll be in touch within 24 hours.</p>
                <button onClick={() => setSent(false)} style={{ marginTop: '8px', fontSize: '12px', color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.08em', textDecoration: 'underline', textUnderlineOffset: '4px', fontFamily: 'inherit' }}>Send another</button>
              </div>
            ) : (
              <form onSubmit={e => { e.preventDefault(); setSent(true); }} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {[['name', 'Full Name', 'text'], ['email', 'Email Address', 'email']].map(([n, l, t]) => (
                  <div key={n}>
                    <label style={{ fontSize: '10px', color: 'var(--fg-muted)', letterSpacing: '0.14em', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>{l}</label>
                    <input type={t} required value={form[n as keyof typeof form]} onChange={set(n)} />
                  </div>
                ))}
                <div>
                  <label style={{ fontSize: '10px', color: 'var(--fg-muted)', letterSpacing: '0.14em', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>I am a</label>
                  <select value={form.role} onChange={set('role')}>
                    {['Buyer / Distributor', 'Investor', 'Business Partner', 'Other'].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '10px', color: 'var(--fg-muted)', letterSpacing: '0.14em', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Message</label>
                  <textarea required rows={5} value={form.message} onChange={set('message')} style={{ resize: 'vertical' }} />
                </div>
                <button type="submit" className="btn-banana" style={{ padding: '16px', fontSize: '12px', letterSpacing: '0.1em', width: '100%' }}>Send Message</button>
              </form>
            )}
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  const cols = [
    { title: 'Company', links: ['About', 'Sustainability', 'News', 'Careers'] },
    { title: 'Products', links: ['Bananas', 'Palm Oil', 'Certifications', 'Traceability'] },
    { title: 'Connect', links: ['Contact', 'Investors', 'Media', 'Partners'] },
  ];
  return (
    <footer style={{ background: 'var(--bg-sub)', borderTop: '1px solid var(--border)', padding: '64px 0 40px' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '48px', marginBottom: '56px' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-playfair, Playfair Display, serif)', fontSize: '21px', fontWeight: 700, marginBottom: '5px' }}>TOP CROP</div>
            <div style={{ fontSize: '8px', letterSpacing: '0.32em', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '20px' }}>Tanzania</div>
            <p style={{ fontSize: '13px', color: 'var(--fg-muted)', lineHeight: 1.85, maxWidth: '260px' }}>Growing premium bananas and sustainable palm oil from Tanzania&apos;s most fertile lands since 2024.</p>
          </div>
          {cols.map(col => (
            <div key={col.title}>
              <div style={{ fontSize: '9.5px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '20px' }}>{col.title}</div>
              {col.links.map(l => (
                <a key={l} href={`#${l.toLowerCase()}`} style={{ display: 'block', fontSize: '13px', color: 'var(--fg-muted)', marginBottom: '12px', transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--fg)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--fg-muted)')}>{l}</a>
              ))}
            </div>
          ))}
        </div>
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', color: 'var(--fg-muted)' }}>© 2026 Top Crop Ltd. · All rights reserved</span>
          <span style={{ fontSize: '12px', color: 'var(--fg-muted)' }}>Registered in Tanzania · TIN 123-456-789</span>
        </div>
      </div>
    </footer>
  );
}

// ── Tweaks Panel ──────────────────────────────────────────────────────────────
function TweaksPanel({ theme, heroStyle, onTheme, onHero }: { theme: string; heroStyle: string; onTheme: (t: string) => void; onHero: (h: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(o => !o)} style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999, width: '40px', height: '40px', borderRadius: '50%', background: '#f5c800', border: 'none', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>⚙</button>
      {open && (
        <div style={{ position: 'fixed', bottom: '72px', right: '24px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', padding: '22px', width: '220px', zIndex: 9999, boxShadow: '0 8px 40px rgba(0,0,0,0.4)' }}>
          <div style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '16px', fontWeight: 500 }}>Tweaks</div>
          <label style={{ fontSize: '10px', color: 'var(--fg-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Theme</label>
          <select value={theme} onChange={e => onTheme(e.target.value)} style={{ marginBottom: '14px', padding: '8px 10px', fontSize: '12.5px', cursor: 'pointer' }}>
            <option value="light">Light Meadow</option>
            <option value="dark">Dark Forest</option>
            <option value="earth">Earth Tones</option>
          </select>
          <label style={{ fontSize: '10px', color: 'var(--fg-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Hero</label>
          <select value={heroStyle} onChange={e => onHero(e.target.value)} style={{ padding: '8px 10px', fontSize: '12.5px', cursor: 'pointer' }}>
            <option value="minimal">Minimal</option>
            <option value="bold">Bold</option>
          </select>
        </div>
      )}
    </>
  );
}

// ── Main Site ─────────────────────────────────────────────────────────────────
export default function MainSite({ initialData }: { initialData: SiteData }) {
  const [theme, setTheme]         = useState('light');
  const [heroStyle, setHeroStyle] = useState('minimal');

  useEffect(() => { applyTheme(theme); }, [theme]);

  const { content, news, careers, photos, settings } = initialData;

  return (
    <>
      <Nav />
      {heroStyle === 'bold'
        ? <HeroBold c={content} photos={photos} />
        : <HeroMinimal c={content} />}
      <Stats />
      <About c={content} photos={photos} />
      <Products c={content} photos={photos} />
      <Sustainability c={content} photos={photos} />
      <Gallery photos={photos} />
      <News news={news} />
      <Careers careers={careers} />
      <Contact settings={settings} />
      <Footer />
      <TweaksPanel theme={theme} heroStyle={heroStyle} onTheme={t => { setTheme(t); applyTheme(t); }} onHero={setHeroStyle} />
    </>
  );
}
