# Personal JARVIS AI — Gemini Ready

This project is the Phase 1 JARVIS interface with a secure Node.js backend and Gemini API integration.

## Requirements

- Windows / macOS / Linux
- Node.js 22+ recommended
- npm
- VS Code
- A Gemini API key from Google AI Studio

## Quick start

```bash
npm install
```

Copy `.env.example` to `.env` and set:

```env
GEMINI_API_KEY=YOUR_REAL_GEMINI_API_KEY
GEMINI_MODEL=gemini-3.8-flash
PORT=3000
```

Then:

```bash
npm start
```

Open `http://localhost:3000`.

Health check: `http://localhost:3000/api/health`

## Important security rule

Never put your Gemini API key in frontend JavaScript, HTML, GitHub, screenshots, or chat messages. Keep it in `.env`. The `.gitignore` file already excludes `.env`.

## AI architecture

Browser → JARVIS Node.js backend → Gemini API → JARVIS browser

The API key never needs to be sent to the browser.

## Current limitations

- Gemini chat backend is connected.
- Tasks, memories, theme controls and the browser file list remain Phase 1 local features.
- Android companion, system notifications, battery/device status, location, web research, file-content intelligence, authentication, provider fallback and hologram fan integration are later phases.
