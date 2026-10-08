AKASH'S AI — JARVIS INTERNAL V6

This build follows the requested structure:
- The main frontend is a single index.html.
- All CSS is inside <style> in index.html.
- All frontend JavaScript is inside <script> in index.html.
- No external CSS or frontend JS file is required.

Security gate:
- Visual front-camera preview when permission is granted.
- 60-second visual sequence.
- No iris scanning, biometric matching, face recognition, or recording.
- Password: AK@111 (static demo; production authentication should be server-side).

The UI is mobile-first and follows the supplied JARVIS reference layout: top header, holographic world core, left/right control cards, app dock, Ask AI, activity, status cards, and bottom navigation.

Important:
GitHub Pages can host this frontend. Android Notification Access, background location, Gemini/API secrets, and native device controls require a secure backend and/or Android companion bridge. Do not put API keys or bridge secrets in public index.html.
