AKASH AI JARVIS — INTERNAL V11

This version builds on V10 and keeps the existing inline SVG icon system and supplied cyber interface assets.

NEW IN V11
1. Alarm Manager: create one-time or daily alarms, optional custom audio, test/enable/disable/delete.
2. Danger Zone Alert Audio: upload and save one custom audio in Settings, preview it, and enable/disable danger alerts.
3. Dangerous locations: save place name, latitude, longitude, alert radius (meters), and warning text. While the page is active and location permission is granted, JARVIS checks proximity and displays an alert/plays the saved danger-zone audio.
4. Keyed Memory: save a Memory Key and its complete content (e.g. key 2008 -> “এই সালে আমার জন্ম হয়েছিল।”); type exactly 2008 in the main chat or JARVIS modal chat to retrieve the saved memory before calling Gemini.

HOW TO USE
- Open Settings -> Alarm Manager to set alarms and optionally attach an audio file to each alarm.
- Open Settings -> Danger Zone Audio to upload, save and preview the common danger-zone alert audio.
- Open the Location card -> enter a place name, latitude, longitude, radius, and message -> Save Danger Zone. Tap Get Live Location and grant browser location permission to enable proximity checks.
- Open Memory -> enter a key and its content -> Save Memory. Enter the exact key in Chat to recall its full saved content.

LIMITATIONS
- Browser alarms and location alerts are dependable only while the page is open/active and the browser allows timers/location/audio. Mobile battery optimization, browser background suspension, and autoplay rules can delay or block them. For reliable alerts while the site is closed, a native Android companion/background service is required.
- Geolocation usually requires HTTPS or localhost and explicit permission.
- Uploaded audio is stored in this browser's IndexedDB. Clearing browser site data may delete it; it does not automatically sync across devices.
- Gemini API key remains in local browser storage. Do not publish the key or the site with your key embedded.
- The cyber terminal remains a visual simulation only.
