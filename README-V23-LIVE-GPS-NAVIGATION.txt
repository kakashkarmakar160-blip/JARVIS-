JARVIS V23 — LIVE GPS MAP & ROUTE

WHAT CHANGED
- The existing dashboard, original inline SVG icons, core Earth video, cyber interface, SIM profile/database features, and settings have been preserved.
- The dashboard Location button now opens a full-screen blue/cyan JARVIS navigation interface.
- It requests the device's real browser GPS location and updates the live position while the page is open and permission is granted.
- It displays live latitude/longitude, GPS accuracy, and last update time.
- You can enter a destination latitude and longitude, save it locally, and request a real road route from the current position.
- The destination and route are drawn on an OpenStreetMap map with a blue HUD-style filter. Route distance/estimated time and available route steps are displayed.
- Destination coordinates are saved in this browser's localStorage. Use CLEAR DESTINATION to remove them.

HOW TO USE
1. Run the project through its existing local server (`npm install`, then `npm start`) or host it on an HTTPS website.
2. Open JARVIS and allow Location permission when prompted.
3. Tap the Location card.
4. Enter destination latitude and longitude.
5. Tap SET DESTINATION / BUILD ROUTE.
6. Keep the page open to receive live GPS position updates.

IMPORTANT LIMITATIONS
- Real GPS permission generally requires HTTPS or localhost. Opening index.html directly with a content:// or file:// address may prevent location access.
- Map tiles and route calculation require an internet connection and use OpenStreetMap tiles plus the public OSRM demo routing endpoint. Public services may rate-limit or be temporarily unavailable.
- Road routing uses the driving profile and may not cover every mode of travel or every region equally well. This is a route display, not certified turn-by-turn navigation.
- Browser geolocation does not guarantee continuous background tracking when the tab is closed or suspended. Reliable background tracking requires a properly permissioned Android companion app/service.
- GPS accuracy depends on the phone, environment, and signal.
- The map is real map data; no prerecorded video or fake location animation is used for the location panel.

SECURITY
- The previous archive contained a populated API-key file. It has been removed from this new archive. Put your own key in a local .env file if needed; do not publish API keys.
