# JARVIS — GitHub Pages Internal Edition

তোমার screenshot-এ website-এর CSS/JS load হয়নি। তাই এই edition-এ **পুরো website-এর HTML + CSS + JavaScript একই `index.html` ফাইলে internal/inline করা হয়েছে**।

## GitHub Pages
শুধু `index.html` GitHub Pages-এ upload/publish করলেই UI ঠিকভাবে render হবে। আলাদা `css/` বা `js/` file লাগবে না।

### Password
Visual retina-style boot animation-এর পরে:
`AK@111`

**নোট:** GitHub Pages static হওয়ায় এই password client-side। এটি real server security নয়।

## Android Notification Access
GitHub Pages নিজে Android Notification Access পড়তে পারে না। Real notification monitoring-এর জন্য আলাদা backend + Android Notification Bridge প্রয়োজন।

Settings → Backend / Bridge URL → তোমার backend URL
Settings → Bridge Token → backend-এর bridge token

তারপর Android Bridge-এ একই URL/token দিয়ে Notification Access ON করতে হবে।

## Gemini
Gemini API key browser-এর `index.html`-এ রাখা হয়নি। AI request backend-এর মাধ্যমে করা উচিত।

## Included backend
`backend/server.js` একটি backend foundation হিসেবে রাখা হয়েছে। এটাকে Node.js server-এ চালাতে হবে। GitHub Pages-এ `server.js` চালানো যায় না।

## গুরুত্বপূর্ণ
Public GitHub repository-তে API key বা secret bridge token commit কোরো না।
