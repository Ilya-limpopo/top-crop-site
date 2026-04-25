import { createClient } from '@libsql/client';
import { DEFAULT_CONTENT, DEFAULT_NEWS, DEFAULT_CAREERS, DEFAULT_SETTINGS, DEFAULT_PHOTOS, type SiteData } from './defaults';

const db = createClient({
  url:       process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

let ready = false;

async function init() {
  if (ready) return;
  await db.executeMultiple(`
    CREATE TABLE IF NOT EXISTS content (
      key   TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS news (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      date       TEXT NOT NULL DEFAULT '',
      category   TEXT NOT NULL DEFAULT '',
      title      TEXT NOT NULL DEFAULT '',
      body       TEXT NOT NULL DEFAULT '',
      created_at INTEGER DEFAULT (unixepoch())
    );
    CREATE TABLE IF NOT EXISTS careers (
      id       INTEGER PRIMARY KEY AUTOINCREMENT,
      title    TEXT NOT NULL DEFAULT '',
      location TEXT NOT NULL DEFAULT '',
      type     TEXT NOT NULL DEFAULT 'Full-time'
    );
    CREATE TABLE IF NOT EXISTS photos (
      slot TEXT PRIMARY KEY,
      url  TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS settings (
      key   TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);
  await seed();
  ready = true;
}

async function seed() {
  const { rows } = await db.execute('SELECT COUNT(*) as n FROM content');
  if (Number(rows[0].n) > 0) return;

  await db.batch([
    ...Object.entries(DEFAULT_CONTENT).map(([k, v]) => ({
      sql: 'INSERT OR IGNORE INTO content (key, value) VALUES (?, ?)',
      args: [k, v],
    })),
    ...DEFAULT_NEWS.map(n => ({
      sql: 'INSERT INTO news (date, category, title, body) VALUES (?, ?, ?, ?)',
      args: [n.date, n.category, n.title, n.body],
    })),
    ...DEFAULT_CAREERS.map(c => ({
      sql: 'INSERT INTO careers (title, location, type) VALUES (?, ?, ?)',
      args: [c.title, c.location, c.type],
    })),
    ...Object.entries(DEFAULT_SETTINGS).map(([k, v]) => ({
      sql: 'INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)',
      args: [k, v],
    })),
  ]);
}

export async function getSiteData(): Promise<SiteData> {
  await init();
  const [contentRes, newsRes, careersRes, photosRes, settingsRes] = await Promise.all([
    db.execute('SELECT key, value FROM content'),
    db.execute('SELECT id, date, category, title, body FROM news ORDER BY created_at DESC'),
    db.execute('SELECT id, title, location, type FROM careers'),
    db.execute('SELECT slot, url FROM photos'),
    db.execute('SELECT key, value FROM settings'),
  ]);

  const content: Record<string, string> = { ...DEFAULT_CONTENT };
  contentRes.rows.forEach(r => { content[r.key as string] = r.value as string; });

  const photos: Record<string, string> = { ...DEFAULT_PHOTOS };
  photosRes.rows.forEach(r => { photos[r.slot as string] = r.url as string; });

  const settings: Record<string, string> = { ...DEFAULT_SETTINGS };
  settingsRes.rows.forEach(r => { settings[r.key as string] = r.value as string; });

  return {
    content,
    photos,
    settings,
    news:    newsRes.rows.map(r => ({ id: Number(r.id), date: r.date as string, category: r.category as string, title: r.title as string, body: r.body as string })),
    careers: careersRes.rows.map(r => ({ id: Number(r.id), title: r.title as string, location: r.location as string, type: r.type as string })),
  };
}

export { db, init };
