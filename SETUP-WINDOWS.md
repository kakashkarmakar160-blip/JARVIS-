# JARVIS Gemini Setup — Windows

This version uses the Gemini API through a secure Node.js backend. Your Gemini API key stays in `.env` and is never placed in the browser code.

## 1. Open the project

Open this folder in VS Code.

## 2. Install dependencies

Open the VS Code terminal and run:

```bash
npm install
```

## 3. Create `.env`

Copy `.env.example` and rename the copy to:

```text
.env
```

Then put your own Gemini API key in it:

```env
GEMINI_API_KEY=YOUR_REAL_GEMINI_KEY_HERE
GEMINI_MODEL=gemini-3.8-flash
PORT=3000
```

Never send your key to anyone or commit `.env` to GitHub.

## 4. Start JARVIS

```bash
npm start
```

You should see something like:

```text
JARVIS server running at http://localhost:3000
Gemini configured: true
Gemini model: gemini-3.8-flash
```

## 5. Open JARVIS

Open:

```text
http://localhost:3000
```

Do NOT use VS Code Live Server for the backend-connected version.

## 6. Check health

Open:

```text
http://localhost:3000/api/health
```

You should see JSON containing:

```text
"ok": true
"aiConfigured": true
```

If `aiConfigured` is `false`, check that `.env` exists beside `package.json`, the variable is named `GEMINI_API_KEY`, and you restarted `npm start` after changing `.env`.

## 7. Test chat

Try:

- `Hello JARVIS`
- `বাংলায় বলো, তুমি কে?`
- `Translate "I am building my own JARVIS" into Bengali.`

## Security

Keep the API key only in `.env`. The browser calls `/api/chat`; the server calls Gemini. Do not put the key in `index.html`, `js/app.js`, or any public frontend file.

## Current scope

This version connects the JARVIS chat to Gemini. Tasks, memories, file list, themes and other Phase 1 browser features remain local browser features. Android controls, notifications, battery/location, document processing, web research, authentication, Gemini fallback providers and hologram integration are later phases.
