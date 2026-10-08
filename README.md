# Akash AI JARVIS — Internal V8

This build preserves the existing inline SVG icon system from Internal V7 and upgrades functionality without replacing the icons.

## Included
- `index.html`: all CSS + JavaScript internal to one file
- `server.js`: minimal static Express server
- `package.json`: start script
- `.env.example`: safe configuration template

## Features
- 10-second visual camera scan demo, then password `AK@111`
- Startup-audio hook is retained through browser interaction; add your own audio file if desired
- ChatGPT button opens the real `https://chatgpt.com/`
- Gemini button opens the real `https://gemini.google.com/`
- Main JARVIS chat can call Gemini `gemini-3.8-flash` after a user enters an API key in Settings
- Functional local calendar notes/reminders
- Browser live geolocation
- Safe fake cyber simulation with SL / DIT / npm start / npm commands
- Existing SVG icons are preserved; no icon library replacement

## Run
```bash
npm install
npm start
```
Then open `http://localhost:3000`.

## Important limits
The cyber terminal is visual simulation only and performs no real scanning, exploitation, or unauthorized access.
Browser-only location and notifications have platform limitations. Reliable background Android notification access/location requires a native Android companion.
A Gemini API key entered in a static frontend is visible to that browser; production deployments should proxy AI calls through a secure server.
