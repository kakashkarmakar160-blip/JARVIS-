JARVIS V26 — CYAN HUD LIVE MAP UPDATE

This update is based on the supplied JARVIS V25 ZIP. Existing project files, inline SVG icons, app launcher, settings, camera/password gate, live GPS tracking, destination entry, route calculation, and route-memory code are retained.

Location map visual changes:
- The Current Location card now has a cyan/blue HUD navigation treatment over the real OpenStreetMap tiles.
- A subtle blue grid/scan overlay and MAP NAVIGATION // LIVE GPS label are shown inside the existing map box.
- Map tiles are color-filtered toward the blue/cyan sci-fi style in the reference image.
- Current GPS, previous coordinates, destination coordinates, and route are still real data; no prerecorded/fake map video is used.
- The Open Map button remains and opens the real map location in Google Maps.

Requirements/limits:
- Allow location permission in the browser and use the website over HTTPS (for example, GitHub Pages) for GPS access.
- Internet is required for map tiles and road routing.
- Browser GPS updates while the page is active; this is not guaranteed background tracking when the browser is closed.
- OpenStreetMap tile attribution remains visible on the map.
