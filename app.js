const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
const store={get(k,f=[]){try{return JSON.parse(localStorage.getItem(k))??f}catch{return f}},set(k,v){localStorage.setItem(k,JSON.stringify(v))}};
function toast(t){const el=$('#toast');el.textContent=t;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),2200)}
function showView(name){$$('.view').forEach(v=>v.classList.remove('active'));$(`#${name}View`)?.classList.add('active');$$('.nav-btn').forEach(b=>b.classList.toggle('active',b.dataset.view===name));}
$$('.nav-btn').forEach(b=>b.onclick=()=>showView(b.dataset.view));$$('[data-action]').forEach(b=>b.onclick=()=>showView(b.dataset.action));$('#settingsBtn').onclick=()=>showView('settings');
function clock(){const d=new Date();$('#clock').textContent=d.toLocaleTimeString([], {hour12:false});const h=d.getHours();$('#greeting').textContent=h<5?'night':h<12?'morning':h<17?'afternoon':'evening'}setInterval(clock,1000);clock();
let tasks=store.get('jarvis_tasks');let memories=store.get('jarvis_memories');let files=store.get('jarvis_files');
function renderTasks(){const el=$('#taskList');el.innerHTML='';tasks.forEach((t,i)=>{const row=document.createElement('div');row.className='task-item '+(t.done?'done':'');row.innerHTML=`<input type="checkbox" ${t.done?'checked':''}><span></span><button>Delete</button>`;row.querySelector('span').textContent=t.text;row.querySelector('input').onchange=e=>{tasks[i].done=e.target.checked;store.set('jarvis_tasks',tasks);renderTasks();renderFocus()};row.querySelector('button').onclick=()=>{tasks.splice(i,1);store.set('jarvis_tasks',tasks);renderTasks();renderFocus()};el.appendChild(row)});if(!tasks.length)el.innerHTML='<div class="empty">No tasks yet.</div>'}
function renderFocus(){const el=$('#focusList');const active=tasks.filter(x=>!x.done).slice(0,4);el.innerHTML=active.length?active.map(x=>`<div class="task-item"><span>${escapeHtml(x.text)}</span></div>`).join(''):'<div class="empty">No active tasks. Your dashboard is clear.</div>'}$('#taskForm').onsubmit=e=>{e.preventDefault();const v=$('#taskInput').value.trim();if(!v)return;tasks.push({text:v,done:false});store.set('jarvis_tasks',tasks);$('#taskInput').value='';renderTasks();renderFocus();toast('Task added');};
function renderMem(){const el=$('#memoryList');el.innerHTML=memories.length?memories.map((m,i)=>`<div class="memory-item"><span>${escapeHtml(m)}</span><button data-i="${i}">Delete</button></div>`).join(''):'<div class="empty">No memories stored.</div>';el.querySelectorAll('button').forEach(b=>b.onclick=()=>{memories.splice(+b.dataset.i,1);store.set('jarvis_memories',memories);renderMem();toast('Memory deleted')})}$('#saveMemory').onclick=()=>{const v=$('#memoryInput').value.trim();if(!v)return;memories.push(v);store.set('jarvis_memories',memories);$('#memoryInput').value='';renderMem();toast('Memory saved locally')};
function renderFiles(){const el=$('#fileGrid');el.innerHTML=files.length?files.map(f=>`<div class="file-card"><b>${escapeHtml(f.name)}</b><small>${formatBytes(f.size)} · ${new Date(f.time).toLocaleDateString()}</small></div>`).join(''):'<div class="empty">Your local file vault is empty. Upload a file to begin.</div>'}$('#fileInput').onchange=e=>{[...e.target.files].forEach(f=>files.unshift({name:f.name,size:f.size,type:f.type,time:Date.now()}));store.set('jarvis_files',files);renderFiles();toast('File added to local vault')};
function escapeHtml(s){return s.replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}function formatBytes(n){if(n<1024)return n+' B';if(n<1048576)return (n/1024).toFixed(1)+' KB';return (n/1048576).toFixed(1)+' MB'}
function addMsg(text,type='ai'){const box=$('#messages');const row=document.createElement('div');row.className='message '+type;row.innerHTML='<div class="avatar">'+(type==='ai'?'J':'U')+'</div><div><span class="who">'+(type==='ai'?'JARVIS':'YOU')+'</span><p></p></div>';row.querySelector('p').textContent=text;box.appendChild(row);box.scrollTop=box.scrollHeight}
async function askJarvis(message){
  const response=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message})});
  let data={};
  try{data=await response.json()}catch{}
  if(!response.ok) throw new Error(data.error||'JARVIS backend request failed.');
  return data.reply||'No response was returned.';
}

$('#chatForm').onsubmit=async e=>{
  e.preventDefault();
  const input=$('#chatInput'),v=input.value.trim();
  if(!v)return;
  addMsg(v,'user');
  input.value='';
  const pending=document.createElement('div');
  pending.className='message ai';
  pending.innerHTML='<div class="avatar">J</div><div><span class="who">JARVIS</span><p>Thinking...</p></div>';
  $('#messages').appendChild(pending);
  $('#messages').scrollTop=$('#messages').scrollHeight;
  try{
    const reply=await askJarvis(v);
    pending.querySelector('p').textContent=reply;
  }catch(err){
    console.error(err);
    pending.querySelector('p').textContent=err.message||'JARVIS backend is unavailable. Start the Node server and try again.';
    toast('JARVIS backend error');
  }
  $('#messages').scrollTop=$('#messages').scrollHeight;
};
$('#voiceBtn').onclick=()=>{const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR){toast('Speech recognition is not supported in this browser');return}const r=new SR();r.lang=navigator.language||'en-US';r.onstart=()=>toast('Listening...');r.onresult=e=>{$('#chatInput').value=e.results[0][0].transcript};r.onerror=()=>toast('Voice input unavailable');r.start()};
$('#lockBtn').onclick=()=>$('#lockScreen').classList.add('active');$('#unlockBtn').onclick=()=>$('#lockScreen').classList.remove('active');$('#emergencyBtn').onclick=()=>{$('#lockScreen').classList.add('active');toast('Emergency lock activated')};
$('#glassRange').oninput=e=>document.documentElement.style.setProperty('--glass',e.target.value+'px');$('#glowRange').oninput=e=>document.documentElement.style.setProperty('--glow',e.target.value/100);$('#animToggle').onchange=e=>document.body.classList.toggle('no-animations',!e.target.checked);$('#transparentToggle').onchange=e=>document.body.classList.toggle('transparent',e.target.checked);
renderTasks();renderFocus();renderMem();renderFiles();
