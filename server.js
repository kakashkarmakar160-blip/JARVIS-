import express from "express";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();

const PORT = Number(process.env.PORT || 3000);
const MODEL = process.env.GEMINI_MODEL || "gemini-3.8-flash";

const OWNER_NAME = "Akash Karmakar";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, "..");

const client = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY
    })
  : null;

app.use(express.json({ limit: "1mb" }));
app.use(express.static(projectRoot));


// ==========================================
// HEALTH CHECK
// ==========================================

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    aiConfigured: Boolean(process.env.GEMINI_API_KEY),
    provider: "Gemini",
    model: MODEL,
    owner: OWNER_NAME,
    serverTime: new Date().toISOString()
  });
});


// ==========================================
// ERROR HANDLER
// ==========================================

function getFriendlyGeminiError(error) {
  const status = Number(error?.status || error?.code || 500);
  const rawMessage = String(error?.message || "");

  // 429 = Quota exceeded
  if (status === 429 || rawMessage.includes("RESOURCE_EXHAUSTED")) {
    return {
      status: 429,
      code: "QUOTA_EXCEEDED",
      message:
        "Gemini API-এর বর্তমান Free Tier quota শেষ হয়ে গেছে। " +
        "এখন নতুন request পাঠানো বন্ধ রাখা ভালো।" +
        "Quota reset হলে আবার JARVIS ব্যবহার করা যাবে।  I AM TOK ONLEY A.K"
    };
  }

  // 503 = Temporary server overload
  if (
    status === 503 ||
    rawMessage.includes("UNAVAILABLE") ||
    rawMessage.includes("high demand")
  ) {
    return {
      status: 503,
      code: "MODEL_UNAVAILABLE",
      message:
        "Gemini model বর্তমানে high demand-এর কারণে সাময়িকভাবে unavailable। " +
        "কিছুক্ষণ পরে আবার চেষ্টা করুন।"
    };
  }

  // 401 / 403 = API key/authentication
  if (status === 401 || status === 403) {
    return {
      status,
      code: "API_AUTH_ERROR",
      message:
        "Gemini API authentication সমস্যা হয়েছে। " +
        "GEMINI_API_KEY সঠিকভাবে configured আছে কিনা পরীক্ষা করুন।"
    };
  }

  // 400 = Bad request
  if (status === 400) {
    return {
      status: 400,
      code: "BAD_REQUEST",
      message:
        "JARVIS-এর request গ্রহণ করতে Gemini API সমস্যা পেয়েছে। " +
        "আপনার command আবার চেষ্টা করুন।"
    };
  }

  // Other errors
  return {
    status: status >= 400 && status < 600 ? status : 500,
    code: "GEMINI_ERROR",
    message:
      "JARVIS-এর Gemini service-এ একটি সমস্যা হয়েছে: " +
      (rawMessage || "Unknown error")
  };
}


// ==========================================
// CHAT
// ==========================================

app.post("/api/chat", async (req, res) => {
  try {
    const message =
      typeof req.body?.message === "string"
        ? req.body.message.trim()
        : "";

    // Empty message
    if (!message) {
      return res.status(400).json({
        ok: false,
        errorCode: "EMPTY_MESSAGE",
        error:
          "কোনো command পাওয়া যায়নি। দয়া করে JARVIS-কে একটি প্রশ্ন বা command দিন।"
      });
    }

    // API key missing
    if (!client) {
      return res.status(503).json({
        ok: false,
        errorCode: "API_NOT_CONFIGURED",
        error:
          "Gemini API configure করা হয়নি। .env ফাইলে GEMINI_API_KEY যোগ করে JARVIS server restart করুন।"
      });
    }


    // ======================================
    // JARVIS SYSTEM INSTRUCTION
    // ======================================

    const systemInstruction = `
You are JARVIS, a personal AI operating assistant.

OWNER:
Your owner/user is ${OWNER_NAME}.

IDENTITY RULE:
- You are JARVIS.
- You are configured to assist only ${OWNER_NAME}.
- When asked "Who are you?", explain that you are JARVIS, the personal AI assistant configured for ${OWNER_NAME}.
- Do not invent another owner name.
- Do not claim that you have verified the user's real-world identity unless the application actually provides authentication information.

LANGUAGE:
- The user may communicate in Bengali or English.
- Reply in the same language as the user whenever appropriate.

PERSONALITY:
- Professional
- Helpful
- Calm
- Futuristic
- Clear
- Respectful

ERROR TRANSPARENCY:
- Never hide an actual application or service problem.
- If the application provides an error message, explain the problem clearly.
- Never pretend that an unavailable service worked successfully.

CAPABILITY RULE:
Never claim that you accessed a phone, file, notification, location, camera, microphone, contact, calendar, another application, or another device unless the application actually provided that information to you.

CURRENT CAPABILITY:
At this stage, you are the AI conversation layer.
Local browser features such as tasks, memories, files, notifications, device information and permissions are not automatically available to you unless the website explicitly sends that information.

SECURITY:
- Never reveal or invent API keys.
- Never ask the user to send their API key in chat.
- Never claim that a security or authentication check was completed unless the application actually performed it.
`;

    // ======================================
    // GEMINI REQUEST
    // ======================================

    const response = await client.models.generateContent({
      model: MODEL,
      contents: message,
      config: {
        systemInstruction
      }
    });

    const reply =
      response?.text ||
      "আমি আপনার request পেয়েছি, কিন্তু Gemini কোনো text response ফেরত দেয়নি।";

    return res.json({
      ok: true,
      reply,
      owner: OWNER_NAME,
      provider: "Gemini",
      model: MODEL
    });

  } catch (error) {
    console.error("JARVIS Gemini Error:", error);

    const friendlyError = getFriendlyGeminiError(error);

    return res.status(friendlyError.status).json({
      ok: false,
      errorCode: friendlyError.code,
      error: friendlyError.message,

      // Debug information terminal-এ থাকবে,
      // browser/user-এর কাছে raw Gemini error দেখানো হবে না।
      provider: "Gemini",
      model: MODEL
    });
  }
});


// ==========================================
// SERVER
// ==========================================

app.listen(PORT, () => {
  console.log("======================================");
  console.log("        JARVIS PERSONAL AI");
  console.log("======================================");
  console.log(`Server: http://localhost:${PORT}`);
  console.log(`Gemini configured: ${Boolean(process.env.GEMINI_API_KEY)}`);
  console.log(`Gemini model: ${MODEL}`);
  console.log(`Owner: ${OWNER_NAME}`);
  console.log("======================================");
});