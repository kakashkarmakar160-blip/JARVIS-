# Akash AI JARVIS — Internal V13

This version builds on the provided JARVIS project. Existing inline SVG icons and the established HUD design are preserved.

## V13 additions
- Press the large bottom **A** button to open SIM Number Verification.
- A matching saved SIM number opens a full-screen JARVIS profile dashboard. A non-matching number shows `SIM NUMBER NOT FOUND`.
- Settings includes **SIM Database Manager** to add, edit, search, open, and delete records. Profile fields include name, nickname, DOB, age, gender, phone, email, location, occupation, education, languages, hobbies, quote, stats, current location, system status, recent activity, notes, and optional profile photo.
- In the visual cyber terminal, type `SIM` and press RUN to list all SIM numbers saved in this browser database. Type `SIM <number>` to open a matching saved profile. This is local database lookup only; it does not access carrier or SIM-provider systems.
- Settings includes **Location Video Manager**. Save a video and it appears in the Current Location card and in a verified profile. The button label remains **Open Map**. The button can open a map using the saved location text or the browser's current location when available.
- Existing alarm, memory, files, chat, theme, and other project functions remain in the project.

## Run
```bash
npm install
npm start
```
Then open `http://localhost:3000`. For best browser storage and media-permission support, use localhost or HTTPS instead of opening the HTML directly as a `file://` URL.

## Data and privacy
- SIM records are stored in this browser's localStorage; uploaded profile photos and location videos use IndexedDB. They do not automatically sync across browsers/devices.
- Only user-entered data is displayed. A SIM number does not reveal carrier-held private information.
- `.env` contains a placeholder, not an API key. Add your own key locally if needed; never share it.
- Cyber terminal commands are a visual simulation/local database feature only; they do not perform real network scanning or unauthorized access.
- Background alarms/location alerts and device-wide Android notifications may require an Android companion because browser background execution is limited.


## V14 hotfix: A button
The bottom A button now explicitly replaces the older click handler and opens SIM NUMBER VERIFICATION. After extracting this ZIP, redeploy the updated site files to your hosting (for GitHub Pages, commit/push the updated index.html and assets); downloading the ZIP alone does not update an already-published website.
