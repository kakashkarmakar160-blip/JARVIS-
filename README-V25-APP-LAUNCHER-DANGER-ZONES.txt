JARVIS V25 — APP LAUNCHER + DANGER ZONE ALERTS

Changes:
- Apps bottom button opens a compact app launcher.
- Settings includes APP LINK & ICON MANAGER.
- Add an app name, an https:// link, and an image icon uploaded from Files; save/delete app shortcuts.
- The central A button remains the SIM number verification/profile entry point.
- The Back button acts as an in-app back/close control.
- The bottom Apps/A/Back dock is hidden while the eye-scan/password gate is displayed and appears after unlock.
- Location has the existing danger-zone form with 500 m default radius, custom coordinates and message.
- Danger-zone alerts use the audio uploaded under Settings > Danger Zone Audio.

Important limitations:
- App icons and app shortcut settings are stored locally in this browser (IndexedDB/localStorage), not synced to other devices.
- Danger-zone monitoring works only while the website is open/active and location permission is granted. A browser page cannot guarantee alerts or audio when closed or restricted in the background; use the Android companion/background location service for that.
- Audio autoplay may require a prior user interaction and browser notification permission is optional.
- SIM profile records are user-entered local records; this feature does not read SIM-card data from Android.
- Use HTTPS or localhost for browser camera and geolocation permissions.
