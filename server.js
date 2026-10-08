import express from "express";
import dotenv from "dotenv";
import crypto from "crypto";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
app.use(express.json({ limit: "256kb" }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, "..", "public");

const PORT = Number(process.env.PORT || 3000);
const PASSWORD = process.env.JARVIS_PASSWORD || "AK@111";
const BRIDGE_TOKEN = process.env.BRIDGE_TOKEN || "CHANGE_ME";
const MODEL = process.env.GEMINI_MODEL || "gemini-3.8-flash";

const sessions = new Map();
const notifications = [];
const MAX_NOTIFICATIONS = 3000;

const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
  : null;

function newToken() {
  return crypto.randomBytes(32).toString("hex");
}

function auth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!sessions.has(token)) return res.status(401).json({ error: "Unauthorized" });
  req.sessionToken = token;
  next();
}

function bridgeAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!BRIDGE_TOKEN || BRIDGE_TOKEN === "CHANGE_ME" || token !== BRIDGE_TOKEN) {
    return res.status(401).json({ error: "Invalid bridge token" });
  }
  next();
}

app.post("/api/login", (req, res) => {
  if (req.body?.password !== PASSWORD) {
    return res.status(401).json({ error: "Wrong password" });
  }
  const token = newToken();
  sessions.set(token, { createdAt: Date.now() });
  res.json({ ok: true, token });
});

app.post("/api/logout", auth, (req, res) => {
  sessions.delete(req.sessionToken);
  res.json({ ok: true });
});

app.get("/api/bridge/health", bridgeAuth, (req, res) => {
  res.json({ ok: true, service: "JARVIS Notification Bridge", time: new Date().toISOString() });
});

app.post("/api/bridge/notifications", bridgeAuth, (req, res) => {
  const item = req.body;
  if (!item || !item.packageName) {
    return res.status(400).json({ error: "packageName is required" });
  }

  const normalized = {
    id: item.id || crypto.randomUUID(),
    packageName: String(item.packageName).slice(0, 200),
    appName: String(item.appName || item.packageName).slice(0, 200),
    title: String(item.title || "").slice(0, 1000),
    text: String(item.text || "").slice(0, 5000),
    timestamp: Number(item.timestamp || Date.now()),
    category: String(item.category || "").slice(0, 100),
    isOngoing: Boolean(item.isOngoing),
    source: "android-notification-access"
  };

  notifications.push(normalized);
  while (notifications.length > MAX_NOTIFICATIONS) notifications.shift();

  res.json({ ok: true, id: normalized.id, stored: notifications.length });
});

app.get("/api/bridge/notifications", auth, (req, res) => {
  const appFilter = String(req.query.app || "").trim().toLowerCase();
  const since = Number(req.query.since || 0);

  let data = notifications.filter(n => n.timestamp >= since);
  if (appFilter) {
    data = data.filter(n =>
      n.appName.toLowerCase().includes(appFilter) ||
      n.packageName.toLowerCase().includes(appFilter)
    );
  }

  res.json({ ok: true, notifications: data.slice(-500) });
});

app.delete("/api/bridge/notifications", auth, (req, res) => {
  notifications.length = 0;
  res.json({ ok: true });
});

app.post("/api/chat", auth, async (req, res) => {
  if (!ai) return res.status(503).json({ error: "Gemini API key is not configured on the server." });

  const message = String(req.body?.message || "").trim();
  if (!message) return res.status(400).json({ error: "Message is required." });

  const since = Date.now() - 24 * 60 * 60 * 1000;
  const recent = notifications.filter(n => n.timestamp >= since).slice(-200);

  const notificationContext = recent.length
    ? recent.map(n => `[${new Date(n.timestamp).toLocaleString()}] ${n.appName} | ${n.title} | ${n.text}`).join("\n")
    : "(No notification records from the last 24 hours.)";

  const systemInstruction = `
You are JARVIS, a personal AI assistant.
You may use only the notification records supplied in the context below.
Never claim to have read WhatsApp/Telegram/private app databases.
If the notification data does not contain the requested information, say that clearly.
Do not invent message senders, message text, dates, or events.
When asked about “today”, use the timestamps in the supplied records and explain if only notification previews are available.
Answer in the user's language when possible.

RECENT ANDROID NOTIFICATION RECORDS:
${notificationContext}
`;

  try {
    const result = await ai.models.generateContent({
      model: MODEL,
      contents: [{ role: "user", parts: [{ text: message }] }],
      config: { systemInstruction }
    });

    res.json({ ok: true, reply: result.text || "I could not generate a response." });
  } catch (err) {
    console.error(err);
    const status = Number(err?.status || 500);
    res.status(status >= 400 && status < 600 ? status : 500).json({
      error: "Gemini request failed",
      details: String(err?.message || err).slice(0, 500)
    });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`JARVIS Web: http://localhost:${PORT}`);
});
