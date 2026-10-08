# Akash's AI — JARVIS V5

Mobile-first futuristic JARVIS website + Android bridge foundation.

## What is fixed in V5
- Mobile HUD/glass/neon interface closely follows the supplied reference layout.
- CSS/JS asset paths are relative so the frontend can render from GitHub Pages/project pages instead of relying on root `/css/...` paths.
- 60-second visual eye/camera sequence. It is **camera preview only**; no iris scan, biometric matching, face recognition, or camera recording is performed.
- Password: `AK@111`.
- GitHub Pages/static mode can unlock with the password and use local UI/file/memory features.
- Full Gemini AI, WebSocket notification bridge, server-side password validation and location bridge require the Node server.
- Files are stored locally in the browser vault in the web version.
- Location safety zones and notification UI are included in the architecture.

## Local full mode
1. `npm install`
2. Copy `.env.example` to `.env`
3. Put your Gemini API key in `.env` (never put it in frontend code).
4. `npm start`
5. Open `http://localhost:3000`

## GitHub Pages
Upload the contents of `public/` to the Pages source. The UI will render in static mode. Browser-only features work, but a GitHub Pages site cannot run the Node API/WebSocket/Android bridge itself. For live Gemini and Android notifications/location, host the Node server separately and connect the companion to that backend.

## Android bridge
`android-bridge/` contains the NotificationListenerService and location-monitor foundation. Real Android permissions must be granted by the user and tested on a physical device before production release.
