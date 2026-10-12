JARVIS V26 — INTERFACE BUTTON FIX

This update is based on the supplied V25 project and preserves the existing inline SVG icons and current visual theme.

Fixes:
- Bottom Apps button opens the app launcher.
- Bottom A button opens SIM verification/profile flow after unlock.
- Back button closes the current full-screen panel/profile/map view before leaving the dashboard.
- Main data-open buttons route to their existing screens (Chat, Memory, Settings, Location, Files, Planner, Notifications, Permissions, Smart Home/Cyber interface, etc.).
- Settings and modal interfaces occupy the full mobile screen; the modal close cross is hidden as requested. Use the bottom Back button to return.
- Location/navigation screen retains real browser GPS, blue HUD map, destination coordinate entry and route memory from the existing project.

How to run:
1. Extract the ZIP.
2. Open JARVIS--main/index.html through a secure origin (HTTPS hosting or localhost recommended).
3. Unlock with your configured password (default in this project: AK@111).
4. Allow Camera/Location permissions when the browser asks.

Important real-world limits:
- GPS and live map require browser permission and internet access. Location permission prompts may not work when opening the HTML as content:// or file://; use HTTPS hosting or localhost.
- Road routing depends on the public OSRM service and may be unavailable temporarily.
- Browser-only pages cannot guarantee background GPS alerts or read all Android app notifications; those need the Android companion and system permissions.
- SIM lookup searches records that the user has explicitly added to this local project. It does not retrieve telecom subscriber records from a phone number.
- Cyber interface is a visual terminal interface; it does not scan or access external systems.
