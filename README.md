# JARVIS Website + Android Notification Bridge

এই project-এ JARVIS-এর website এবং Android Notification Access bridge একসাথে আছে।

## কী করবে
- Android NotificationListenerService ব্যবহার করে user-approved Notification Access থেকে notification নেয়।
- App/package name, title, text, time, notification key এবং কিছু basic metadata website backend-এ পাঠায়।
- Website dashboard-এ WhatsApp/Telegram/Gmail ইত্যাদির notification দেখা যায়।
- Website-এ প্রশ্ন করলে stored notification context থেকে “আজ WhatsApp-এ কে কী message করেছে?” ধরনের query-এর জন্য data প্রস্তুত থাকে।
- Android app নিজে WhatsApp/Telegram-এর private database পড়ে না।
- Notification preview বন্ধ থাকলে message text-ও পাওয়া যাবে না।

## গুরুত্বপূর্ণ
এই ZIP একটি working development foundation। Android Notification Access, real phone testing, HTTPS deployment, production authentication, battery/background behavior এবং Play Store policy compliance বাস্তব device-এ যাচাই করতে হবে। 100% production-ready দাবি করা হচ্ছে না।

## 1. Website চালানো
Requirements: Node.js 20+

```bash
cd web
npm install
copy .env.example .env
npm start
```

Linux/macOS:
```bash
cp .env.example .env
npm install
npm start
```

তারপর:
http://localhost:3000

`.env`:
- `GEMINI_API_KEY` = তোমার Gemini key (server-side only)
- `GEMINI_MODEL` = তোমার available Gemini model
- `JARVIS_PASSWORD` = website password
- `BRIDGE_TOKEN` = Android bridge-এর shared token
- `PORT` = 3000

## 2. Android app
Android Studio-তে `android-bridge` folder open করো।

তারপর:
1. ফোনে app install করো।
2. JARVIS Bridge খুলে Server URL এবং Bridge Token সেট করো।
3. “Open Notification Access Settings” চাপো।
4. Android Settings-এ JARVIS Bridge-এর Notification Access ON করো।
5. Website backend যে device/server-এ চলছে সেটি ফোন থেকে reachable হতে হবে।
   - একই Wi-Fi হলে PC-এর LAN IP ব্যবহার করতে পারো, যেমন `http://192.168.1.10:3000`
   - Internet deployment হলে HTTPS URL ব্যবহার করো।
6. “Test connection” দিয়ে connection যাচাই করো।
7. Notification আসলে bridge website backend-এ পাঠাবে।

## 3. Website API
POST `/api/bridge/notifications`
Header:
`Authorization: Bearer <BRIDGE_TOKEN>`

GET `/api/bridge/notifications`
Website session token প্রয়োজন।

GET `/api/bridge/health`
Bridge token প্রয়োজন।

## 4. Security
- Gemini API key frontend-এ রাখা হয়নি।
- Bridge token Android app-এর settings-এ রাখা হয়; production-এ encrypted storage/pairing system যোগ করা উচিত।
- Public internet-এ plain HTTP ব্যবহার কোরো না; HTTPS ব্যবহার করো।
- Notification data sensitive হতে পারে। Storage retention, delete/export এবং app filtering production-এর আগে configure করা উচিত।

## 5. Android permission scope
Notification Access একটি system-level permission। Android সাধারণত listener-কে notification stream দেয়; JARVIS-এর ভিতরে package/app filtering করা হয়েছে। WhatsApp-এর private database বা full chat history এই bridge পড়ে না।

## 6. AI query
Website chat endpoint notification records-কে context হিসেবে Gemini-তে পাঠাতে পারে। ফলে প্রশ্ন যেমন:
- “আজ WhatsApp-এ কে কে মেসেজ করেছে?”
- “আজকের WhatsApp notifications-এর summary দাও”
- “আজ রাতের গুরুত্বপূর্ণ notification কোনগুলো?”

এর উত্তর notification data-এর ভিত্তিতে তৈরি করা যায়।

