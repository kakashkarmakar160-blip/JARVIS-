JARVIS V24 — LIVE GPS MAP + ROUTE MEMORY

What changed:
- Replaced the dashboard Current Location video placeholder with a real OpenStreetMap tile map using browser GPS.
- The dashboard map stays inside the existing Current Location card. The existing Open Map button label and Location status-card appearance are preserved.
- Shows previous and current GPS coordinates, reported accuracy, and update time.
- Allows a destination latitude/longitude to be entered and requests a real road route from the public OSRM routing service.
- Saves route history locally by date, with start time, arrival time (when the GPS location comes within 60 metres of the destination), start/destination coordinates, route distance, and estimated driving time when available.
- Date queries typed into the dashboard chat (for example, 2026-10-12 or “today's route”) can return saved route history without calling the AI API.
- The bottom Apps / A / Back dock is raised above app overlays so it remains accessible in Settings, cyber interface, navigation, and profile views.

Important requirements/limits:
- Use HTTPS (for example, GitHub Pages) or localhost. Browsers generally block geolocation on insecure HTTP pages.
- The user must grant browser location permission and enable the phone's location services.
- Map tiles require internet. Routing uses the public OSRM demo endpoint; its availability and rate limits are not guaranteed.
- The map and route history run in the browser. Browser localStorage is local to that browser/device and is not a cloud/server database.
- Live updates require the website to remain open/active. Reliable background tracking after closing the website requires an Android companion service.
- Arrival time is only recorded when a GPS update comes within 60 metres of the saved destination while the page is running. If the page is closed or GPS stops, arrival cannot be guaranteed.
- Open Map opens the external Google Maps view for the latest known GPS position.

Original inline SVG icon definitions have been retained. No new icon library was introduced.
