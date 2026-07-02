const express = require('express');
const { createClient } = require('@libsql/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const { pathToFileURL } = require('url');

const JWT_SECRET = process.env.JWT_SECRET || 'jsab-local-secret-change-in-production';
const PORT = process.env.PORT || 3000;

// --- Turso/Local DB setup ---
const hasTursoConfig = Boolean(process.env.TURSO_DB_URL);
const localDbDir = path.join(__dirname, 'db');
const localDbPath = path.join(localDbDir, 'jsab.db');
if (!hasTursoConfig) {
  fs.mkdirSync(localDbDir, { recursive: true });
}
const turso = createClient(
  hasTursoConfig
    ? { url: process.env.TURSO_DB_URL, authToken: process.env.TURSO_DB_TOKEN }
    : { url: pathToFileURL(localDbPath).href }
);

// --- Schema ---
async function initDB() {
  await turso.execute(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    progress TEXT DEFAULT '{}'
  )`);
  try { await turso.execute(`ALTER TABLE users ADD COLUMN token_version INTEGER DEFAULT 0`); } catch (e) {}
  console.log('DB ready');
}
initDB().catch(console.error);

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});
app.use(express.static(path.join(__dirname)));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'JustShapesAndBeats.html')));

// --- Auth Middleware ---
async function authenticate(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'No token' });
  try {
    req.user = jwt.verify(auth.slice(7), JWT_SECRET);
    const result = await turso.execute({ sql: 'SELECT COALESCE(token_version, 0) AS token_version FROM users WHERE id = ?', args: [req.user.id] });
    const user = result.rows[0];
    if (!user || user.token_version !== req.user.token_version) {
      return res.status(401).json({ error: 'Logged in elsewhere', code: 'TOKEN_STALE' });
    }
    next();
  } catch (e) {
    if (e.name === 'JsonWebTokenError' || e.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    res.status(500).json({ error: 'Server error' });
  }
}

// --- Routes ---

app.post('/api/signup', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password || username.length < 1 || username.length > 20 || !/^[a-zA-Z0-9_]+$/.test(username))
    return res.status(400).json({ error: 'Invalid username (1-20 chars, letters/numbers/underscores)' });
  if (password.length < 3) return res.status(400).json({ error: 'Password must be at least 3 characters' });
  try {
    const hash = bcrypt.hashSync(password, 10);
    await turso.execute({ sql: 'INSERT INTO users (username, password, token_version) VALUES (?, ?, 1)', args: [username, hash] });
    const result = await turso.execute({ sql: 'SELECT id, username, progress, token_version FROM users WHERE username = ?', args: [username] });
    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, username: user.username, token_version: user.token_version }, JWT_SECRET, { expiresIn: '30d' });
    res.json({ token, username: user.username, progress: JSON.parse(user.progress || '{}') });
  } catch (e) {
    if (e.message && e.message.includes('UNIQUE')) return res.status(400).json({ error: 'Username already taken' });
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await turso.execute({ sql: 'SELECT * FROM users WHERE username = ?', args: [username] });
    const user = result.rows[0];
    if (!user || !bcrypt.compareSync(password, user.password))
      return res.status(401).json({ error: 'Invalid username or password' });
    await turso.execute({ sql: 'UPDATE users SET token_version = COALESCE(token_version, 0) + 1 WHERE id = ?', args: [user.id] });
    const updated = await turso.execute({ sql: 'SELECT token_version FROM users WHERE id = ?', args: [user.id] });
    const token = jwt.sign({ id: user.id, username: user.username, token_version: updated.rows[0].token_version }, JWT_SECRET, { expiresIn: '30d' });
    res.json({ token, username: user.username, progress: JSON.parse(user.progress || '{}') });
  } catch { res.status(500).json({ error: 'Server error' }); }
});

app.get('/api/progress', authenticate, async (req, res) => {
  const result = await turso.execute({ sql: 'SELECT progress FROM users WHERE id = ?', args: [req.user.id] });
  const user = result.rows[0];
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(JSON.parse(user.progress || '{}'));
});

app.post('/api/progress', authenticate, async (req, res) => {
  const { completedLevels, unlockedLevels } = req.body;
  await turso.execute({ sql: 'UPDATE users SET progress = ? WHERE id = ?', args: [JSON.stringify({ completedLevels, unlockedLevels }), req.user.id] });
  res.json({ ok: true });
});

app.get('/api/verify', authenticate, async (req, res) => {
  const result = await turso.execute({ sql: 'SELECT progress FROM users WHERE id = ?', args: [req.user.id] });
  const user = result.rows[0];
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ username: req.user.username, progress: JSON.parse(user.progress || '{}') });
});

app.listen(PORT, () => console.log('JSAB server running at http://localhost:' + PORT));
