// Cinematic visual eye gate: camera preview only, no biometric/iris recognition.
(function(){
  const $ = id => document.getElementById(id);
  const eye = $('eyeScan');
  const boot = $('boot');
  const login = $('login');
  const video = $('eyeVideo');
  const fallback = $('eyeFallback');
  const secondsEl = $('scanSeconds');
  const statusEl = $('scanStatus');
  const progressEl = $('scanProgress');
  let stream = null;
  let timer = null;
  let remaining = 60;

  function stopCamera(){
    if(stream){ stream.getTracks().forEach(t=>t.stop()); stream=null; }
    if(video) video.srcObject=null;
  }
  function showLogin(){
    stopCamera();
    eye.classList.add('hidden');
    login.classList.remove('hidden');
    const input=$('password'); if(input) setTimeout(()=>input.focus(),250);
  }
  async function start(){
    boot.classList.add('hidden');
    eye.classList.remove('hidden');
    remaining=60; secondsEl.textContent=remaining; progressEl.textContent='0%';
    statusEl.textContent='Opening camera preview…';
    try{
      stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user',width:{ideal:1280},height:{ideal:720}},audio:false});
      video.srcObject=stream;
      await video.play();
      statusEl.textContent='Eyes visible in live preview — visual sequence active';
    }catch(err){
      fallback.classList.remove('hidden');
      statusEl.textContent='Camera unavailable — continuing visual security sequence';
    }
    const started=Date.now();
    timer=setInterval(()=>{
      const elapsed=Math.floor((Date.now()-started)/1000);
      remaining=Math.max(0,60-elapsed);
      secondsEl.textContent=remaining;
      progressEl.textContent=Math.min(100,Math.round(elapsed/60*100))+'%';
      if(remaining<=0){ clearInterval(timer); timer=null; showLogin(); }
    },250);
  }
  window.addEventListener('beforeunload',stopCamera);
  window.JarvisEyeGate={start};
})();
