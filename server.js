import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { WebSocketServer } from 'ws';
import http from 'http';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const publicDir = path.join(root, 'public');
const dataDir = path.join(root, 'data');
const zonesFile = path.join(dataDir, 'zones.json');
fs.mkdirSync(dataDir, { recursive: true });
if (!fs.existsSync(zonesFile)) fs.writeFileSync(zonesFile, '[]');

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: '/ws' });
const sessions = new Map();
const ai = process.env.GEMINI_API_KEY ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }) : null;
const port = Number(process.env.PORT || 3000);
const password = process.env.JARVIS_PASSWORD || 'AK@111';
const bridgeToken = process.env.BRIDGE_TOKEN || 'CHANGE_THIS_TO_A_LONG_RANDOM_TOKEN';

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.static(publicDir));

function readZones() {
  try { return JSON.parse(fs.readFileSync(zonesFile, 'utf8')); } catch { return []; }
}
function writeZones(zones) { fs.writeFileSync(zonesFile, JSON.stringify(zones, null, 2)); }
function sessionUser(req) {
  const h = req.headers.authorization || '';
  const token = h.startsWith('Bearer ') ? h.slice(7) : '';
  return sessions.get(token) ? { token, user: sessions.get(token) } : null;
}
function requireSession(req, res, next) {
  if (!sessionUser(req)) return res.status(401).json({ error: 'Unauthorized' });
  next();
}
function requireBridge(req, res, next) {
  if (req.headers['x-bridge-token'] !== bridgeToken) return res.status(401).json({ error: 'Invalid bridge token' });
  next();
}
function haversineMeters(aLat, aLng, bLat, bLng) {
  const R = 6371000, rad = Math.PI / 180;
  const dLat = (bLat - aLat) * rad, dLng = (bLng - aLng) * rad;
  const x = Math.sin(dLat/2)**2 + Math.cos(aLat*rad)*Math.cos(bLat*rad)*Math.sin(dLng/2)**2;
  return 2 * R * Math.asin(Math.sqrt(x));
}
function evaluateLocation(lat, lng) {
  return readZones().filter(z => z.enabled !== false).map(z => ({
    zone: z,
    distance: haversineMeters(lat, lng, z.lat, z.lng)
  })).filter(x => x.distance <= Number(x.zone.radiusMeters || 500));
}
function broadcast(payload) {
  const data = JSON.stringify(payload);
  for (const client of wss.clients) if (client.readyState === 1) client.send(data);
}

app.get('/api/health', (_req,res) => res.json({ ok:true, service:'Akash AI JARVIS', time:new Date().toISOString(), geminiConfigured:!!ai }));
app.post('/api/login', (req,res) => {
  const { password: supplied } = req.body || {};
  if (supplied !== password) return res.status(401).json({ error:'Incorrect password' });
  const token = crypto.randomBytes(32).toString('hex');
  sessions.set(token, { name:'Akash', createdAt:Date.now() });
  res.json({ ok:true, token });
});
app.post('/api/logout', requireSession, (req,res) => { const s=sessionUser(req); sessions.delete(s.token); res.json({ok:true}); });

app.get('/api/chatgpt-url', requireSession, (_req,res) => res.json({ url: process.env.CHATGPT_URL || 'https://chatgpt.com/' }));
app.get('/api/gemini-url', requireSession, (_req,res) => res.json({ url: process.env.GEMINI_URL || 'https://gemini.google.com/' }));

app.get('/api/zones', requireSession, (_req,res) => res.json({ zones: readZones() }));
app.post('/api/zones', requireSession, (req,res) => {
  const z = req.body || {};
  if (!z.id || !z.name || !Number.isFinite(Number(z.lat)) || !Number.isFinite(Number(z.lng))) return res.status(400).json({error:'id, name, lat and lng are required'});
  const zones = readZones().filter(x => x.id !== z.id);
  const safe = { id:String(z.id), name:String(z.name), lat:Number(z.lat), lng:Number(z.lng), radiusMeters:Number(z.radiusMeters||500), warningMeters:Number(z.warningMeters||500), enabled:z.enabled !== false, message:String(z.message||'You are approaching a place you marked as risky.'), updatedAt:new Date().toISOString() };
  zones.push(safe); writeZones(zones); broadcast({type:'zones_updated', zones}); res.json({ok:true, zone:safe});
});
app.delete('/api/zones/:id', requireSession, (req,res) => { const zones=readZones().filter(x=>x.id!==req.params.id); writeZones(zones); broadcast({type:'zones_updated', zones}); res.json({ok:true}); });

app.post('/api/chat', requireSession, async (req,res) => {
  if (!ai) return res.status(503).json({ error:'Gemini is not configured. Put GEMINI_API_KEY in .env.' });
  const message = String(req.body?.message || '').trim();
  const context = req.body?.context || {};
  if (!message) return res.status(400).json({error:'Message required'});
  const system = `You are Akash's personal JARVIS AI. Be concise, helpful, and honest. You may use only the context supplied by the application. Never claim access to phone notifications, WhatsApp, location, files, contacts, camera, microphone, or other device data unless it appears in the supplied context. If the user asks about risky locations, explain based only on configured zones. User language may be Bengali or English.`;
  try {
    const prompt = `${system}\n\nApplication context:\n${JSON.stringify(context).slice(0,12000)}\n\nUser: ${message}`;
    const result = await ai.models.generateContent({ model: process.env.GEMINI_MODEL || 'gemini-3.8-flash', contents: prompt });
    res.json({ ok:true, text: result.text || 'No response.' });
  } catch (e) {
    const status = Number(e?.status || e?.code || 500);
    if (status === 429) return res.status(429).json({error:'Gemini quota/rate limit reached. Try again later.'});
    if (status === 401 || status === 403) return res.status(status).json({error:'Gemini API authentication/permission failed.'});
    if (status === 503) return res.status(503).json({error:'Gemini service is temporarily unavailable.'});
    res.status(500).json({error:'AI request failed.'});
  }
});

app.post('/api/bridge/location', requireBridge, (req,res) => {
  const { lat, lng, accuracy, timestamp } = req.body || {};
  if (!Number.isFinite(Number(lat)) || !Number.isFinite(Number(lng))) return res.status(400).json({error:'lat/lng required'});
  const hits = evaluateLocation(Number(lat), Number(lng));
  const payload = { type:'location', location:{lat:Number(lat),lng:Number(lng),accuracy:Number(accuracy||0),timestamp:timestamp||Date.now()}, alerts:hits.map(x=>({zone:x.zone,distanceMeters:Math.round(x.distance)})) };
  broadcast(payload);
  res.json({ok:true, alerts:payload.alerts});
});

app.post('/api/bridge/notification', requireBridge, (req,res) => {
  const n = req.body || {};
  const item = { id:crypto.randomUUID(), app:String(n.app||'Unknown'), packageName:String(n.packageName||''), title:String(n.title||''), text:String(n.text||''), timestamp:n.timestamp||Date.now() };
  broadcast({type:'notification', notification:item});
  res.json({ok:true});
});

wss.on('connection', ws => { ws.send(JSON.stringify({type:'hello', zones:readZones()})); });

app.get('/{*splat}', (req,res) => {
  if (req.path.startsWith('/api/')) return res.status(404).json({error:'Not found'});
  res.sendFile(path.join(publicDir,'index.html'));
});

server.listen(port, () => console.log(`Akash AI JARVIS running on http://localhost:${port}`));
