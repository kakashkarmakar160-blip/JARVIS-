JARVIS V18 CAMERA STARTUP UPDATE

WHAT CHANGED
- Startup now requests camera access before beginning the 10-second eye-scan sequence.
- The scan timer starts only after a live camera stream successfully opens.
- If permission is denied or camera access is unavailable, the password screen does not silently appear. A Retry Camera Access button is shown.
- The interface uses concise startup/scan labels and removes the visible 'visual demo only' label from the camera preview and cyber-terminal footer.
- The camera preview is not biometric identity verification and does not match a person's iris/retina.
- Existing inline SVG icons and core dashboard structure are retained.

IMPORTANT FOR ANDROID
Camera access in a browser normally requires a secure origin (HTTPS) and browser permission. Open the deployed GitHub Pages HTTPS URL in Chrome, not a local content:// file preview. If Chrome previously blocked camera access, open Site settings for that website, set Camera to Allow, reload, then press RETRY CAMERA ACCESS if shown.

The ZIP does not contain or request any API keys. Cyber-terminal command output is a local interface; it does not perform real network scanning or intrusion.
