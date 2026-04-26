import { DEFAULT_CONTENT, DEFAULT_NEWS, DEFAULT_CAREERS, DEFAULT_SETTINGS, DEFAULT_PHOTOS, type SiteData } from './defaults';

const BASE_URL = () => process.env.TURSO_DATABASE_URL!.replace('libsql://', 'https://');
const TOKEN    = () => process.env.TURSO_AUTH_TOKEN!;

// ── Turso HTTP API types ──────────────────────────────────────────────────────
type Val  = { type: 'text' | 'integer' | 'float' | 'null'; value?: string };
type Col  = { name: string };
type TRow = Val[];
type TResult = { cols: Col[]; rows: TRow[]; affected_row_count: number; last_insert_rowid: string | null };

function arg(v: string | number | null): Val {
  if (v === null)           return { type: 'null' };
  if (typeof v === 'number') return { type: 'integer', value: String(v) };
  return { type: 'text', value: String(v) };
}

function toObj(result: TResult): Record<string, string | number | null>[] {
  return result.rows.map(row =>
    Object.fromEntries(result.cols.map((col, i) => {
      const v = row[i];
      if (!v || v.type === 'null') return [col.name, null];
      if (v.type === 'integer' || v.type === 'float') return [col.name, Number(v.value)];
      return [col.name, v.value ?? null];
    }))
  );
}

async function pipeline(
  stmts: { sql: string; args?: (string | number | null)[] }[]
): Promise<TResult[]> {
  const res = await fetch(`${BASE_URL()}/v2/pipeline`, {
    method:  'POST',
    headers: { Authorization: `Bearer ${TOKEN()}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      requests: [
        ...stmts.map(s => ({ type: 'execute', stmt: { sql: s.sql, args: (s.args ?? []).map(arg) } })),
        { type: 'close' },
      ],
    }),
  });
  if (!res.ok) throw new Error(`Turso HTTP ${res.status}: ${await res.text()}`);
  const json = await res.json();
  return json.results
    .filter((r: { type: string }) => r.type === 'ok')
    .map((r: { response: { result: TResult } }) => r.response.result);
}

// ── Public helpers ────────────────────────────────────────────────────────────
export async function execute(sql: string, args: (string | number | null)[] = []): Promise<{ rows: Record<string, string | number | null>[]; lastInsertRowid: number | null }> {
  const [result] = await pipeline([{ sql, args }]);
  return { rows: toObj(result), lastInsertRowid: result.last_insert_rowid ? Number(result.last_insert_rowid) : null };
}

export async function batch(stmts: { sql: string; args?: (string | number | null)[] }[]): Promise<void> {
  if (stmts.length === 0) return;
  await pipeline(stmts);
}

// ── Init & seed ───────────────────────────────────────────────────────────────
let ready = false;

export async function init(): Promise<void> {
  if (ready) return;
  await batch([
    { sql: 'CREATE TABLE IF NOT EXISTS content  (key TEXT PRIMARY KEY, value TEXT NOT NULL)' },
    { sql: 'CREATE TABLE IF NOT EXISTS news     (id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT NOT NULL DEFAULT \'\', category TEXT NOT NULL DEFAULT \'\', title TEXT NOT NULL DEFAULT \'\', body TEXT NOT NULL DEFAULT \'\', created_at INTEGER DEFAULT (unixepoch()))' },
    { sql: 'CREATE TABLE IF NOT EXISTS careers  (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL DEFAULT \'\', location TEXT NOT NULL DEFAULT \'\', type TEXT NOT NULL DEFAULT \'Full-time\')' },
    { sql: 'CREATE TABLE IF NOT EXISTS photos   (slot TEXT PRIMARY KEY, url TEXT NOT NULL)' },
    { sql: 'CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL)' },
  ]);
  // Only seed once — check persistent flag in DB, not module-level var (which resets on every serverless cold start)
  const { rows } = await execute("SELECT value FROM settings WHERE key='_seeded'");
  if (rows.length === 0) await seed();
  ready = true;
}

async function seed(): Promise<void> {
  const [{ rows: cr }, { rows: nr }, { rows: car }] = await Promise.all([
    execute('SELECT COUNT(*) as n FROM content'),
    execute('SELECT COUNT(*) as n FROM news'),
    execute('SELECT COUNT(*) as n FROM careers'),
  ]);

  const stmts: { sql: string; args?: (string | number | null)[] }[] = [];

  if (Number(cr[0]?.n ?? 0) === 0) {
    stmts.push(
      ...Object.entries(DEFAULT_CONTENT).map(([k, v])  => ({ sql: 'INSERT OR IGNORE INTO content  (key, value) VALUES (?, ?)', args: [k, v] as (string | number | null)[] })),
      ...Object.entries(DEFAULT_SETTINGS).map(([k, v]) => ({ sql: 'INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)', args: [k, v] as (string | number | null)[] })),
    );
  }
  if (Number(nr[0]?.n ?? 0) === 0) {
    stmts.push(
      ...DEFAULT_NEWS.map(n => ({ sql: 'INSERT INTO news (date, category, title, body) VALUES (?, ?, ?, ?)', args: [n.date, n.category, n.title, n.body] as (string | number | null)[] })),
    );
  }
  if (Number(car[0]?.n ?? 0) === 0) {
    stmts.push(
      ...DEFAULT_CAREERS.map(c => ({ sql: 'INSERT INTO careers (title, location, type) VALUES (?, ?, ?)', args: [c.title, c.location, c.type] as (string | number | null)[] })),
    );
  }

  // Always mark as seeded, even if stmts were empty (tables already had data)
  await execute("INSERT OR IGNORE INTO settings (key, value) VALUES ('_seeded', '1')");
  if (stmts.length > 0) await batch(stmts);
}

// ── getSiteData ───────────────────────────────────────────────────────────────
export async function getSiteData(): Promise<SiteData> {
  await init();
  const [[cr], [nr], [car], [pr], [sr]] = await Promise.all([
    pipeline([{ sql: 'SELECT key, value FROM content' }]),
    pipeline([{ sql: 'SELECT id, date, category, title, body FROM news ORDER BY created_at DESC' }]),
    pipeline([{ sql: 'SELECT id, title, location, type FROM careers' }]),
    pipeline([{ sql: 'SELECT slot, url FROM photos' }]),
    pipeline([{ sql: 'SELECT key, value FROM settings' }]),
  ]);

  const content:  Record<string, string> = { ...DEFAULT_CONTENT };
  const photos:   Record<string, string> = { ...DEFAULT_PHOTOS };
  const settings: Record<string, string> = { ...DEFAULT_SETTINGS };

  toObj(cr).forEach(r  => { content [r.key  as string] = r.value as string; });
  toObj(pr).forEach(r  => { photos  [r.slot as string] = r.url   as string; });
  toObj(sr).forEach(r  => { settings[r.key  as string] = r.value as string; });

  return {
    content,
    photos,
    settings,
    news:    toObj(nr).map(r => ({ id: Number(r.id), date: r.date as string, category: r.category as string, title: r.title as string, body: r.body as string })),
    careers: toObj(car).map(r => ({ id: Number(r.id), title: r.title as string, location: r.location as string, type: r.type as string })),
  };
}
