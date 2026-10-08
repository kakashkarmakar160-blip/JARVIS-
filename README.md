# Akash's AI — JARVIS V4

A mobile-first, cinematic JARVIS web dashboard based on the supplied reference layout.

## Included
- Exact mobile-first dashboard structure: header, holographic world/core, left menu, right quick actions, AI dock, Ask AI box, activity, status cards and bottom navigation.
- 60-second **visual eye-camera sequence** before the password gate.
- The eye sequence is deliberately **NOT biometric**: it does not perform iris recognition, face recognition, identity matching, or save camera footage. It simply shows the user's live front-camera preview with a cinematic scanning overlay.
- Server-side password authentication (`JARVIS_PASSWORD`). Default development password: `AK@111`.
- Gemini server integration with API key kept on the server.
- Notification bridge API + WebSocket event stream.
- Android NotificationListenerService bridge.
- Android location safety bridge: user-defined risky locations, radius alerts, vibration/browser notification where supported.
- File vault, memory/notes, planner, settings, permissions and device/smart-home UI foundations.
- ChatGPT and Gemini launcher buttons.

## Run website
```bash
npm install
cp .env.example .env
npm start
```
Open `http://localhost:3000`.

### Environment
```env
GEMINI_API_KEY=PASTE_YOUR_GEMINI_API_KEY_HERE
GEMINI_MODEL=gemini-3.8-flash
JARVIS_PASSWORD=AK@111
BRIDGE_TOKEN=CHANGE_THIS_TO_A_LONG_RANDOM_TOKEN
PORT=3000
CHATGPT_URL=https://chatgpt.com/
GEMINI_URL=https://gemini.google.com/
```

Never put a real API key in frontend files or commit `.env`.

## Visual eye gate
The site requests the browser camera and displays the live front-camera feed for at least 60 seconds. This is a visual/cinematic gate only. The code intentionally does not implement biometric matching.

A browser cannot silently grant camera access; the user must approve the browser permission prompt. If permission is denied/unavailable, the sequence continues with a visual fallback and still requires the password.

## Android companion
The `android-bridge/` module is a starter companion. It provides:
- Notification Access via `NotificationListenerService`.
- Location monitoring via a foreground location service.
- Authenticated bridge POSTs using `BRIDGE_TOKEN`.

Android permission screens and background behavior must be tested on a real device. Notification Access gives the bridge notification data supplied by Android; it does not grant access to private WhatsApp/Telegram databases.

## Safety locations
Create a risky location from the website Location Center. Example rule:
- radius: 500 m
- warning message: "You are approaching a place you marked as risky."

The Android bridge sends location updates; the server calculates distance and pushes an alert over WebSocket. The system only alerts for locations the user configured.

## Production checklist
Use HTTPS, a real authentication/session store, secure cookies, rate limiting, encrypted sensitive storage, CSRF protection where applicable, proper bridge key rotation, Android signing, Play policy review, privacy policy/Data Safety declarations, and real-device testing before release.
