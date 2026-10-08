import express from "express";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import crypto from "crypto";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();
const PORT = Number(process.env.PORT || 3000);
const MODEL = process.env.GEMINI_MODEL || "gemini-3.8-flash";
const PASSWORD = process.env.JARVIS_PASSWORD || "AK@111";
const __filename = fileURLToPath(import.meta.url);
const projectRoot = path.join(path.dirname(__filename), "..");
const sessions = new Map();
const client = process.env.GEMINI_API_KEY ? new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY}) : null;

app.use(express.json({limit:"1mb"}));
app.use(express.static(path.join(projectRoot, "public")));

function auth(req,res,next){
  const token = String(req.headers.authorization||"").replace(/^Bearer\s+/i,"");
  if(!token || !sessions.has(token)) return res.status(401).json({ok:false,error:"JARVIS session is locked."});
  next();
}
function friendly(error){
  const s=Number(error?.status||error?.code||500), m=String(error?.message||"");
  if(s===429||m.includes("RESOURCE_EXHAUSTED")) return [429,"QUOTA_EXCEEDED","Gemini-এর বর্তমান quota শেষ হয়েছে। Quota reset হলে আবার চেষ্টা করুন।"];
  if(s===503||m.includes("UNAVAILABLE")||m.includes("high demand")) return [503,"MODEL_UNAVAILABLE","Gemini model বর্তমানে ব্যস্ত বা সাময়িকভাবে unavailable। কিছুক্ষণ পরে আবার চেষ্টা করুন।"];
  if(s===401||s===403) return [s,"API_AUTH_ERROR","Gemini API authentication সমস্যা হয়েছে। .env-এর GEMINI_API_KEY পরীক্ষা করুন।"];
  if(s===400) return [400,"BAD_REQUEST","Gemini request গ্রহণ করতে পারেনি। Commandটি আবার চেষ্টা করুন।"];
  return [500,"GEMINI_ERROR",m||"JARVIS Gemini service failed."];
}
app.get("/api/health",(req,res)=>res.json({ok:true,provider:"Gemini",model:MODEL,aiConfigured:Boolean(process.env.GEMINI_API_KEY)}));
app.post("/api/login",(req,res)=>{
  if((req.body?.password||"")!==PASSWORD) return res.status(401).json({ok:false,error:"Incorrect access password."});
  const token=crypto.randomBytes(32).toString("hex"); sessions.set(token,Date.now());
  res.json({ok:true,token,owner:"Akash Karmakar"});
});
app.post("/api/logout",auth,(req,res)=>{
  const token=String(req.headers.authorization||"").replace(/^Bearer\s+/i,""); sessions.delete(token); res.json({ok:true});
});
app.post("/api/chat",auth,async(req,res)=>{
  try{
    const message=typeof req.body?.message==="string"?req.body.message.trim():"";
    if(!message) return res.status(400).json({ok:false,errorCode:"EMPTY_MESSAGE",error:"কোনো command পাওয়া যায়নি।"});
    if(!client) return res.status(503).json({ok:false,errorCode:"API_NOT_CONFIGURED",error:"Gemini API configure করা হয়নি। .env-এ GEMINI_API_KEY যোগ করুন।"});
    const systemInstruction=`You are JARVIS, a personal AI operating assistant for Akash Karmakar.
Be professional, calm, helpful, futuristic and clear. Reply in the same language as the user when appropriate.
Never claim to have accessed a phone, app, notification, file, location, camera, microphone, contact or device unless the application actually provided that information.
The web app may provide selected application data in context; treat it as application-provided data, not private database access.
If information is unavailable, say so honestly. Never reveal or request API keys.`;
    const response=await client.models.generateContent({model:MODEL,contents:message,config:{systemInstruction}});
    res.json({ok:true,reply:response?.text||"কোনো text response পাওয়া যায়নি।"});
  }catch(error){
    console.error("JARVIS Gemini Error:",error);
    const [status,errorCode,message]=friendly(error);
    res.status(status).json({ok:false,errorCode,error:message});
  }
});
app.get("*",(req,res)=>res.sendFile(path.join(projectRoot,"public","index.html")));
app.listen(PORT,()=>console.log(`JARVIS server running at http://localhost:${PORT} | Gemini configured: ${Boolean(process.env.GEMINI_API_KEY)} | Model: ${MODEL}`));
