# JARVIS Personal AI Web v2

Futuristic responsive JARVIS website with a visual-only retina-style intro, password gate, Gemini backend, Bengali/English chat, voice hooks, notification-monitor configuration, memory, files, contacts, planner, alerts, permissions and settings.

## Run
1. Copy `.env.example` to `.env`.
2. Put your Gemini API key in `.env`.
3. Keep `JARVIS_PASSWORD=AK@111` or change it.
4. `npm install`
5. `npm start`
6. Open `http://localhost:3000`

The retina screen is only a demo animation; it performs no biometric matching.

A normal website cannot read other Android apps' private databases or Android Notification Access data. The Notification Monitor UI is the control/dashboard layer; real cross-app monitoring requires an Android/native bridge or companion app.

For production, use HTTPS and a secure server-side password/secret. Never expose Gemini keys in frontend code.
