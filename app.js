let token = localStorage.getItem("jarvis_session") || "";

const $ = id => document.getElementById(id);

setTimeout(() => $("boot").classList.add("hidden"), 2200);

function api(path, options = {}) {
  options.headers = {...(options.headers || {}), "Content-Type":"application/json"};
  if (token) options.headers.Authorization = `Bearer ${token}`;
  return fetch(path, options);
}

function addChat(who, text) {
  const d = document.createElement("div");
  d.className = "msg";
  d.innerHTML = `<b>${who}</b><div>${String(text).replace(/[<>&]/g,c=>({"<":"&lt;",">":"&gt;","&":"&amp;"}[c]))}</div>`;
  $("chatLog").appendChild(d);
}

async function login() {
  const r = await api("/api/login",{method:"POST",body:JSON.stringify({password:$("password").value})});
  const data = await r.json();
  if (!r.ok) return $("loginStatus").textContent = data.error || "Login failed";
  token = data.token;
  localStorage.setItem("jarvis_session",token);
  $("login").classList.add("hidden");
  $("dashboard").classList.remove("hidden");
  refreshAll();
}

async function refreshNotifications() {
  const app = $("appFilter").value;
  const r = await api("/api/bridge/notifications?app="+encodeURIComponent(app));
  if (r.status === 401) return;
  const data = await r.json();
  const box = $("notifications");
  box.innerHTML = "";
  for (const n of [...(data.notifications||[])].reverse()) {
    const el = document.createElement("div");
    el.className = "notice";
    el.innerHTML = `<b>${escapeHtml(n.appName)}</b> — ${escapeHtml(n.title)}<br>${escapeHtml(n.text)}<br><small>${new Date(n.timestamp).toLocaleString()}</small>`;
    box.appendChild(el);
  }
  $("bridgeStatus").textContent = "Bridge data connected";
  $("bridgeDot").style.background = "#63ffad";
}

function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}

async function refreshAll(){ await refreshNotifications(); }

$("loginBtn").onclick = login;
$("password").onkeydown = e => { if(e.key==="Enter") login(); };
$("refresh").onclick = refreshNotifications;
$("appFilter").onchange = refreshNotifications;

$("clear").onclick = async () => {
  if(!confirm("Delete stored notification records?")) return;
  await api("/api/bridge/notifications",{method:"DELETE"});
  refreshNotifications();
};

$("send").onclick = async () => {
  const message = $("message").value.trim();
  if(!message) return;
  addChat("YOU",message);
  $("message").value="";
  const r = await api("/api/chat",{method:"POST",body:JSON.stringify({message})});
  const d = await r.json();
  addChat("JARVIS", d.reply || d.error || "No response");
};

$("message").onkeydown = e => { if(e.key==="Enter") $("send").click(); };

$("logout").onclick = async () => {
  await api("/api/logout",{method:"POST"});
  localStorage.removeItem("jarvis_session");
  token="";
  location.reload();
};

if(token){
  $("login").classList.add("hidden");
  $("dashboard").classList.remove("hidden");
  setTimeout(refreshAll,2500);
}
