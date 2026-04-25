'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import type { SiteData } from '@/lib/defaults';
import { DEFAULT_PHOTOS } from '@/lib/defaults';

// ── Shared styles ─────────────────────────────────────────────────────────────
const card: React.CSSProperties = { background: '#fff', border: '1px solid #e4ede0', borderRadius: '4px', padding: '28px 32px', marginBottom: '16px' };
const sectionLbl: React.CSSProperties = { fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#5a9e6a', fontWeight: 500, marginBottom: '10px', display: 'block' };
const fieldLbl: React.CSSProperties = { fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#8ab496', marginBottom: '7px', display: 'block', marginTop: '18px' };
const inp: React.CSSProperties = { width: '100%', padding: '10px 13px', border: '1px solid #d4e8d0', borderRadius: '2px', fontSize: '14px', fontFamily: 'inherit', color: '#0a2416', background: '#fff', outline: 'none' };
const greenBtn: React.CSSProperties = { padding: '9px 22px', background: '#2b8c30', color: '#fff', border: 'none', borderRadius: '2px', cursor: 'pointer', fontSize: '12px', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'inherit' };
const ghostBtn: React.CSSProperties = { padding: '9px 22px', background: 'transparent', color: '#8ab496', border: '1px solid #d4e8d0', borderRadius: '2px', cursor: 'pointer', fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'inherit' };

function Field({ label, value, onChange, multiline = false, rows = 3 }: { label: string; value: string; onChange: (v: string) => void; multiline?: boolean; rows?: number }) {
  return (
    <div>
      <label style={fieldLbl}>{label}</label>
      {multiline
        ? <textarea rows={rows} value={value} onChange={e => onChange(e.target.value)} style={{ ...inp, resize: 'vertical', lineHeight: 1.7 }} />
        : <input type="text" value={value} onChange={e => onChange(e.target.value)} style={inp} />}
    </div>
  );
}

// ── Content section ───────────────────────────────────────────────────────────
function ContentSection({ data, onChange }: { data: SiteData; onChange: (d: SiteData) => void }) {
  function setKey(key: string) {
    return (val: string) => onChange({ ...data, content: { ...data.content, [key]: val } });
  }
  const c = data.content;
  return (
    <div>
      <div style={card}>
        <span style={sectionLbl}>Hero</span>
        <Field label="Headline" value={c['hero.headline'] ?? ''} onChange={setKey('hero.headline')} multiline rows={2} />
        <Field label="Subtext"  value={c['hero.sub']      ?? ''} onChange={setKey('hero.sub')}      multiline rows={3} />
      </div>
      <div style={card}>
        <span style={sectionLbl}>About</span>
        <Field label="Headline"         value={c['about.headline'] ?? ''} onChange={setKey('about.headline')} />
        <Field label="First paragraph"  value={c['about.body1']    ?? ''} onChange={setKey('about.body1')} multiline rows={4} />
        <Field label="Second paragraph" value={c['about.body2']    ?? ''} onChange={setKey('about.body2')} multiline rows={3} />
      </div>
      <div style={card}>
        <span style={sectionLbl}>Products — Bananas</span>
        <Field label="Title"       value={c['products.banana.title'] ?? ''} onChange={setKey('products.banana.title')} />
        <Field label="Description" value={c['products.banana.body']  ?? ''} onChange={setKey('products.banana.body')} multiline rows={4} />
      </div>
      <div style={card}>
        <span style={sectionLbl}>Products — Palm Oil</span>
        <Field label="Title"       value={c['products.palm.title'] ?? ''} onChange={setKey('products.palm.title')} />
        <Field label="Description" value={c['products.palm.body']  ?? ''} onChange={setKey('products.palm.body')} multiline rows={4} />
      </div>
      <div style={card}>
        <span style={sectionLbl}>Sustainability</span>
        <Field label="Headline"  value={c['sustainability.headline'] ?? ''} onChange={setKey('sustainability.headline')} />
        <Field label="Body text" value={c['sustainability.body']     ?? ''} onChange={setKey('sustainability.body')} multiline rows={3} />
      </div>
    </div>
  );
}

// ── Photos section ────────────────────────────────────────────────────────────
const PHOTO_SLOTS: [string, string][] = [
  ['aerial plantation view', 'Hero — right top'],   ['banana harvest',        'Hero — right bottom'],
  ['field workers',          'About — left'],        ['palm nursery',          'About — top right'],
  ['quality check',          'About — bottom right'],['banana bunch close-up', 'Products — Bananas'],
  ['palm fruit cluster',     'Products — Palm Oil'], ['ESG annual report',     'Sustainability'],
  ['banana plantation rows', 'Gallery — wide 1'],    ['palm tree canopy',      'Gallery — 1'],
  ['harvesting team',        'Gallery — 2'],         ['processing facility',   'Gallery — 3'],
  ['export packaging',       'Gallery — wide 2'],    ['irrigation system',     'Gallery — 4'],
  ['sunrise over farm',      'Gallery — 5'],         ['soil sampling',         'Gallery — 6'],
];

function PhotosSection({ data, onChange }: { data: SiteData; onChange: (d: SiteData) => void }) {
  const [uploading, setUploading] = useState<string | null>(null);

  async function handleFile(slot: string, file: File) {
    setUploading(slot);
    const form = new FormData();
    form.append('file', file);
    form.append('slot', slot);
    const res  = await fetch('/api/photos', { method: 'POST', body: form });
    const json = await res.json();
    if (json.url) onChange({ ...data, photos: { ...data.photos, [slot]: json.url } });
    setUploading(null);
  }

  async function handleDelete(slot: string) {
    await fetch(`/api/photos/${encodeURIComponent(slot)}`, { method: 'DELETE' });
    const next = { ...data.photos };
    delete next[slot];
    onChange({ ...data, photos: next });
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
      {PHOTO_SLOTS.map(([slot, label]) => {
        const customUrl = data.photos[slot];
        const fallback  = DEFAULT_PHOTOS[slot];
        const url       = customUrl || fallback;
        const isCustom  = !!customUrl;
        return (
          <div key={slot} style={{ ...card, marginBottom: 0, padding: '20px' }}>
            <div style={{ fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#5a9e6a', marginBottom: '8px' }}>{label}</div>
            <div style={{ position: 'relative' }}>
              {url && <img src={url} alt={slot} style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', borderRadius: '2px', display: 'block', opacity: uploading === slot ? 0.4 : 1 }} />}
              {uploading === slot && (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: '#5a9e6a' }}>Uploading…</div>
              )}
              {isCustom && uploading !== slot && (
                <button onClick={() => handleDelete(slot)} style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', width: '26px', height: '26px', borderRadius: '50%', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'inherit' }}>×</button>
              )}
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px', cursor: 'pointer' }}>
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { if (e.target.files?.[0]) handleFile(slot, e.target.files[0]); }} />
              <span style={{ fontSize: '11px', color: '#2b8c30', textDecoration: 'underline', textUnderlineOffset: '3px' }}>{isCustom ? 'Replace photo' : 'Upload custom photo'}</span>
              {isCustom && <span style={{ fontSize: '10px', color: '#aac4b0' }}>(using your photo)</span>}
              {!isCustom && <span style={{ fontSize: '10px', color: '#aac4b0' }}>(using default)</span>}
            </label>
            <div style={{ fontSize: '10px', color: '#c0d4bc', marginTop: '4px' }}>{slot}</div>
          </div>
        );
      })}
    </div>
  );
}

// ── News section ──────────────────────────────────────────────────────────────
type NewsItem = SiteData['news'][number];

function NewsSection({ data, onChange }: { data: SiteData; onChange: (d: SiteData) => void }) {
  const [editing, setEditing] = useState<number | 'new' | null>(null);
  const [form, setForm]       = useState({ date: '', cat: '', title: '', body: '' });
  const news = data.news;

  function startNew()         { setForm({ date: '', cat: '', title: '', body: '' }); setEditing('new'); }
  function startEdit(n: NewsItem) { setForm({ date: n.date, cat: n.category, title: n.title, body: n.body }); setEditing(n.id); }

  async function save() {
    if (editing === 'new') {
      const res  = await fetch('/api/news', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ date: form.date, category: form.cat, title: form.title, body: form.body }) });
      const item = await res.json();
      onChange({ ...data, news: [item, ...news] });
    } else {
      await fetch(`/api/news/${editing}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ date: form.date, category: form.cat, title: form.title, body: form.body }) });
      onChange({ ...data, news: news.map(n => n.id === editing ? { ...n, date: form.date, category: form.cat, title: form.title, body: form.body } : n) });
    }
    setEditing(null);
  }

  async function remove(id: number) {
    const res = await fetch(`/api/news/${id}`, { method: 'DELETE' });
    if (!res.ok) { alert('Failed to delete article. Please try again.'); return; }
    onChange({ ...data, news: news.filter(n => n.id !== id) });
  }

  const sf = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
        <button onClick={startNew} style={greenBtn}>+ Add Article</button>
      </div>
      {editing !== null && (
        <div style={{ ...card, border: '1px solid #b8dcc0' }}>
          <span style={sectionLbl}>{editing === 'new' ? 'New Article' : 'Edit Article'}</span>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div><label style={fieldLbl}>Date</label><input style={inp} value={form.date}  onChange={sf('date')}  placeholder="April 2026" /></div>
            <div><label style={fieldLbl}>Category</label><input style={inp} value={form.cat} onChange={sf('cat')} placeholder="Press Release" /></div>
          </div>
          <label style={fieldLbl}>Title</label><input style={inp} value={form.title} onChange={sf('title')} />
          <label style={fieldLbl}>Body</label><textarea rows={4} value={form.body} onChange={sf('body')} style={{ ...inp, resize: 'vertical', lineHeight: 1.7 }} />
          <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
            <button onClick={save} style={greenBtn}>Save</button>
            <button onClick={() => setEditing(null)} style={ghostBtn}>Cancel</button>
          </div>
        </div>
      )}
      {news.map(item => (
        <div key={item.id} style={{ ...card, display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '6px' }}>
              <span style={{ fontSize: '10px', color: '#5a9e6a', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{item.category}</span>
              <span style={{ fontSize: '11px', color: '#aac4b0' }}>{item.date}</span>
            </div>
            <div style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: '17px', fontWeight: 600, marginBottom: '6px' }}>{item.title}</div>
            <div style={{ fontSize: '13px', color: '#6a8e74', lineHeight: 1.7 }}>{item.body}</div>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
            <button onClick={() => startEdit(item)} style={{ padding: '7px 16px', border: '1px solid #d4e8d0', background: 'transparent', color: '#2b8c30', borderRadius: '2px', cursor: 'pointer', fontSize: '11px', fontFamily: 'inherit' }}>Edit</button>
            <button onClick={() => remove(item.id)}  style={{ padding: '7px 16px', border: '1px solid #f5c6c0', background: 'transparent', color: '#c0392b', borderRadius: '2px', cursor: 'pointer', fontSize: '11px', fontFamily: 'inherit' }}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Careers section ───────────────────────────────────────────────────────────
type CareerItem = SiteData['careers'][number];

function CareersSection({ data, onChange }: { data: SiteData; onChange: (d: SiteData) => void }) {
  const [editing, setEditing] = useState<number | 'new' | null>(null);
  const [form, setForm]       = useState({ title: '', location: '', type: 'Full-time' });
  const careers = data.careers;

  function startNew()              { setForm({ title: '', location: '', type: 'Full-time' }); setEditing('new'); }
  function startEdit(c: CareerItem) { setForm({ title: c.title, location: c.location, type: c.type }); setEditing(c.id); }

  async function save() {
    if (editing === 'new') {
      const res  = await fetch('/api/careers', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const item = await res.json();
      onChange({ ...data, careers: [...careers, item] });
    } else {
      await fetch(`/api/careers/${editing}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      onChange({ ...data, careers: careers.map(c => c.id === editing ? { ...c, ...form } : c) });
    }
    setEditing(null);
  }

  async function remove(id: number) {
    const res = await fetch(`/api/careers/${id}`, { method: 'DELETE' });
    if (!res.ok) { alert('Failed to delete position. Please try again.'); return; }
    onChange({ ...data, careers: careers.filter(c => c.id !== id) });
  }

  const sf = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
        <button onClick={startNew} style={greenBtn}>+ Add Position</button>
      </div>
      {editing !== null && (
        <div style={{ ...card, border: '1px solid #b8dcc0' }}>
          <span style={sectionLbl}>{editing === 'new' ? 'New Position' : 'Edit Position'}</span>
          <label style={fieldLbl}>Job Title</label>
          <input style={inp} value={form.title} onChange={sf('title')} placeholder="e.g. Field Manager" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div><label style={fieldLbl}>Location</label><input style={inp} value={form.location} onChange={sf('location')} placeholder="Arusha" /></div>
            <div>
              <label style={fieldLbl}>Type</label>
              <select value={form.type} onChange={sf('type')} style={{ ...inp }}>
                {['Full-time', 'Part-time', 'Contract', 'Internship'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
            <button onClick={save} style={greenBtn}>Save</button>
            <button onClick={() => setEditing(null)} style={ghostBtn}>Cancel</button>
          </div>
        </div>
      )}
      {careers.map(item => (
        <div key={item.id} style={{ ...card, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '16px', fontWeight: 500, marginBottom: '4px' }}>{item.title}</div>
            <div style={{ fontSize: '12px', color: '#8ab496' }}>{item.location} · {item.type}</div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => startEdit(item)} style={{ padding: '7px 16px', border: '1px solid #d4e8d0', background: 'transparent', color: '#2b8c30', borderRadius: '2px', cursor: 'pointer', fontSize: '11px', fontFamily: 'inherit' }}>Edit</button>
            <button onClick={() => remove(item.id)}  style={{ padding: '7px 16px', border: '1px solid #f5c6c0', background: 'transparent', color: '#c0392b', borderRadius: '2px', cursor: 'pointer', fontSize: '11px', fontFamily: 'inherit' }}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Settings section ──────────────────────────────────────────────────────────
function SettingsSection({ data, onChange }: { data: SiteData; onChange: (d: SiteData) => void }) {
  const set = (k: string) => (v: string) => onChange({ ...data, settings: { ...data.settings, [k]: v } });
  const s   = data.settings;
  return (
    <div style={card}>
      <span style={sectionLbl}>Company Details</span>
      <Field label="Email"                value={s.email      ?? ''} onChange={set('email')} />
      <Field label="Phone"                value={s.phone      ?? ''} onChange={set('phone')} />
      <Field label="Headquarters"         value={s.hq         ?? ''} onChange={set('hq')} />
      <Field label="Processing facility"  value={s.processing ?? ''} onChange={set('processing')} />
    </div>
  );
}

// ── Admin App ─────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: 'content',  label: 'Content'   },
  { id: 'photos',   label: 'Photos'    },
  { id: 'news',     label: 'News'      },
  { id: 'careers',  label: 'Careers'   },
  { id: 'settings', label: 'Settings'  },
];

const TITLES: Record<string, string> = { content: 'Text Content', photos: 'Photos', news: 'News Articles', careers: 'Open Positions', settings: 'Settings' };

const EMPTY_DATA: SiteData = { content: {}, news: [], careers: [], photos: {}, settings: {} };

export default function AdminPage() {
  const router    = useRouter();
  const [section, setSection] = useState('content');
  const [data,    setData]    = useState<SiteData>(EMPTY_DATA);
  const [loaded,  setLoaded]  = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);

  useEffect(() => {
    fetch('/api/auth/check')
      .then(r => r.json())
      .then(j => { if (!j.authenticated) router.push('/admin/login'); })
      .catch(() => router.push('/admin/login'));

    fetch('/api/data')
      .then(r => { if (!r.ok) throw new Error(`${r.status}`); return r.json(); })
      .then((d: SiteData) => { if (d && 'content' in d) setData(d); })
      .catch(e => console.error('[Admin] data fetch failed:', e))
      .finally(() => setLoaded(true));
  }, [router]);

  async function handleSave() {
    setSaving(true);
    await Promise.all([
      fetch('/api/content',  { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data.content) }),
      fetch('/api/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data.settings) }),
    ]);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  async function handleSignOut() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  }

  if (!loaded) {
    return (
      <div style={{ fontFamily: 'inherit', background: '#f2f7f0', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5a9e6a', fontSize: '13px', letterSpacing: '0.1em' }}>
        Loading…
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', fontFamily: "'DM Sans', sans-serif", background: '#f2f7f0', color: '#0a2416', WebkitFontSmoothing: 'antialiased' }}>

      {/* Sidebar */}
      <aside style={{ width: '220px', background: '#fff', borderRight: '1px solid #e4ede0', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: '28px 24px 20px' }}>
          <div style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: '17px', fontWeight: 600, letterSpacing: '0.04em', color: '#0a2416' }}>TOP CROP</div>
          <div style={{ fontSize: '8px', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#5a9e6a', marginTop: '2px' }}>Admin Panel</div>
        </div>
        <nav style={{ flex: 1, padding: '8px 12px' }}>
          {NAV_ITEMS.map(item => (
            <button key={item.id} onClick={() => setSection(item.id)} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '10px 14px', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '13.5px', letterSpacing: '0.02em', background: section === item.id ? '#eef8e8' : 'transparent', color: section === item.id ? '#2b8c30' : '#4a7a58', fontWeight: section === item.id ? 500 : 400, fontFamily: 'inherit', marginBottom: '2px', transition: 'background 0.15s, color 0.15s' }}
              onMouseEnter={e => { if (section !== item.id) e.currentTarget.style.background = '#f4faf0'; }}
              onMouseLeave={e => { if (section !== item.id) e.currentTarget.style.background = 'transparent'; }}>
              {item.label}
            </button>
          ))}
        </nav>
        <div style={{ padding: '20px 24px', borderTop: '1px solid #e4ede0' }}>
          <a href="/" target="_blank" style={{ fontSize: '12px', color: '#8ab496', display: 'block', marginBottom: '10px', letterSpacing: '0.04em', textDecoration: 'none' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#2b8c30')}
            onMouseLeave={e => (e.currentTarget.style.color = '#8ab496')}>↗ View Website</a>
          <button onClick={handleSignOut} style={{ fontSize: '12px', color: '#aac4b0', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.04em', fontFamily: 'inherit', padding: 0 }}
            onMouseEnter={e => (e.currentTarget.style.color = '#c0392b')}
            onMouseLeave={e => (e.currentTarget.style.color = '#aac4b0')}>Sign out</button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, overflow: 'auto', padding: '40px 48px' }}>
        <div style={{ maxWidth: '860px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
            <h1 style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: '26px', fontWeight: 600 }}>{TITLES[section]}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {saved  && <span style={{ fontSize: '12px', color: '#5a9e6a', letterSpacing: '0.05em' }}>✓ Saved</span>}
              {saving && <span style={{ fontSize: '12px', color: '#8ab496', letterSpacing: '0.05em' }}>Saving…</span>}
              <button onClick={handleSave} disabled={saving} style={{ padding: '10px 28px', background: saving ? '#e6b800' : '#f5c800', color: '#1a1100', border: 'none', borderRadius: '2px', cursor: saving ? 'default' : 'pointer', fontSize: '11.5px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'inherit', transition: 'background 0.15s' }}
                onMouseEnter={e => { if (!saving) e.currentTarget.style.background = '#ffd400'; }}
                onMouseLeave={e => { if (!saving) e.currentTarget.style.background = '#f5c800'; }}>
                Save & Publish
              </button>
            </div>
          </div>

          {section === 'content'  && <ContentSection  data={data} onChange={setData} />}
          {section === 'photos'   && <PhotosSection   data={data} onChange={setData} />}
          {section === 'news'     && <NewsSection     data={data} onChange={setData} />}
          {section === 'careers'  && <CareersSection  data={data} onChange={setData} />}
          {section === 'settings' && <SettingsSection data={data} onChange={setData} />}
        </div>
      </main>
    </div>
  );
}
