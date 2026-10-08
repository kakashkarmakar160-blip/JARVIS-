const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.static(__dirname));
app.get('/api/health', (req,res)=>res.json({ok:true,service:'JARVIS',mode:'safe-static'}));
app.listen(PORT,()=>console.log(`JARVIS running at http://localhost:${PORT}`));
