# JARVIS V4 Architecture

## Website
The browser is the main JARVIS control center and keeps the supplied mobile dashboard layout. The central holographic world is the visual AI core. The Ask AI box is the primary JARVIS command surface.

## Security gate
1. Cinematic boot.
2. 60-second front-camera visual eye sequence.
3. Password gate.
4. Server verifies password and creates a session token.

The eye sequence is not biometric. No iris/face matching is implemented and camera frames are not uploaded by the eye-gate code.

## AI
The website sends a bounded context to the server. Gemini is called server-side. The frontend never receives the Gemini API key.

## Notifications
Android NotificationListenerService -> authenticated bridge POST -> Node server -> WebSocket -> website notification center / AI context.

The listener receives notification data exposed by Android. It does not read private app databases.

## Location safety
User saves a risky location -> server persists the rule -> Android foreground location service sends coordinates -> server calculates distance -> matching rules create alerts -> WebSocket sends alert -> website can show notification/vibration/speech where supported.

The browser geolocation API is a supplemental option; reliable background monitoring requires the Android companion.
