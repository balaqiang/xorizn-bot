import { AIRich } from "../../src/lib/orbit-builder.js";

const pluginConfig = {
  name: "kjzo",
  alias: ["kjzo"],
  category: "game",
  description: "XORIZN-BOT CHASE RUNNER",
  usage: ".kjzo",
  example: ".kjzo",
  isOwner: false,
  isPremium: false,
  isGroup: true,
  isPrivate: false,
  isAdmin: false,
  isBotAdmin: false,
  skipRegistration: true,
  cooldown: 5,
  energi: 0,
  isEnabled: true,
};

async function handler(m, { sock }) {
  const htmlCode = `<style>
*{box-sizing:border-box;margin:0;padding:0}
body{margin:0;min-height:600px;height:100vh;overflow:hidden;background:#050711;color:#fff;font-family:Arial,sans-serif;display:block}
.game{position:relative;width:100%;max-width:700px;height:100vh;min-height:600px;margin:0 auto;overflow:hidden}
canvas{position:absolute;top:0;left:0;width:100%;height:100%;display:block}
.hud{position:absolute;top:15px;left:15px;right:15px;display:flex;gap:8px;z-index:5}
.stat{flex:1;padding:9px;text-align:center;border-radius:14px;background:rgba(15,20,45,.72);border:1px solid rgba(255,255,255,.13);backdrop-filter:blur(12px)}
.stat span{display:block;font-size:9px;color:#aeb6d4;letter-spacing:1px}.stat b{font-size:19px}
.level-info{position:absolute;top:82px;left:15px;right:15px;z-index:5}
.level-title{display:flex;justify-content:space-between;margin-bottom:6px;font-size:10px;color:#b6bfdc}
.level-bar,.bar{height:7px;background:rgba(255,255,255,.08);border-radius:20px;overflow:hidden}
.level-fill{width:10%;height:100%;border-radius:20px;background:linear-gradient(90deg,#00e5ff,#735cff,#ff4f91);transition:width .3s}
.distance{position:absolute;top:108px;left:15px;right:15px;z-index:5}
.distance-text{font-size:10px;color:#a8b0cf;margin-bottom:5px}
.bar-fill{height:100%;width:72%;border-radius:20px;background:linear-gradient(90deg,#00e5ff,#7b5cff,#ff3d82);transition:width .15s}
.controls{position:absolute;bottom:25px;left:50%;transform:translateX(-50%);z-index:6}
.jump{width:180px;height:62px;border:0;border-radius:20px;color:#fff;font-size:18px;font-weight:900;background:linear-gradient(135deg,#7158ff,#00c9ec);box-shadow:0 10px 35px rgba(0,190,255,.25);touch-action:none}
.jump:active{transform:scale(.94)}
.overlay{position:absolute;top:0;left:0;right:0;bottom:0;z-index:10;display:flex;align-items:center;justify-content:center;padding:20px;background:rgba(3,5,14,.92)}
.card{width:100%;max-width:410px;padding:28px 22px;text-align:center;border-radius:28px;background:rgba(18,24,48,.96);border:1px solid rgba(255,255,255,.12);box-shadow:0 25px 80px #000}
.card h1{font-size:38px;margin-bottom:8px;background:linear-gradient(90deg,#fff,#8d7dff,#55eaff);-webkit-background-clip:text;color:transparent}
.card p{margin:8px 0 18px;color:#9ca6c7;line-height:1.5;font-size:14px}
.mode-title{font-size:11px;color:#9fa8c5;margin-bottom:10px;letter-spacing:1px}
.modes{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:18px}
.mode{padding:13px 5px;border-radius:15px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.04);color:#fff;font-weight:900;font-size:12px;cursor:pointer}
.mode small{display:block;margin-top:5px;font-size:8px;color:#8f98b8;font-weight:normal}
.mode.active{border-color:#6e7cff;background:linear-gradient(135deg,rgba(113,88,255,.45),rgba(0,201,236,.25));box-shadow:0 0 20px rgba(80,130,255,.18)}
.mode.easy.active{border-color:#54e38e}.mode.medium.active{border-color:#ffd45c}.mode.hard.active{border-color:#ff5c79}
.start{width:100%;padding:15px;border:0;border-radius:16px;color:#fff;font-size:15px;font-weight:900;background:linear-gradient(135deg,#7158ff,#00c9ec)}
.hidden{display:none}
</style>
<body style="margin:0;background:#050711;color:#fff;touch-action:manipulation;">

<div class="game">
<canvas id="canvas"></canvas>
<div class="hud">
<div class="stat"><span>SKOR</span><b id="score">0</b></div>
<div class="stat"><span>KOIN</span><b id="coins">0</b></div>
<div class="stat"><span>LEVEL</span><b id="level">1</b></div>
</div>
<div class="level-info">
<div class="level-title"><span id="timeName">PAGI</span><span>LEVEL <b id="levelText">1</b>/10</span></div>
<div class="level-bar"><div class="level-fill" id="levelFill"></div></div>
</div>
<div class="distance">
<div class="distance-text">JARAK PENGEJAR</div>
<div class="bar"><div class="bar-fill" id="distanceBar"></div></div>
</div>
<div class="controls"><button class="jump" id="jump">LOMPAT</button></div>
<div class="overlay" id="overlay">
<div class="card">
<h1 id="title">XORIZN-BOT</h1>
<p id="description">Pilih tingkat kesulitan sebelum mulai berlari.</p>
<div class="mode-title">PILIH MODE</div>
<div class="modes">
<button class="mode easy active" data-mode="easy">EASY<small>Tanpa burung</small></button>
<button class="mode medium" data-mode="medium">MEDIUM<small>Ada burung</small></button>
<button class="mode hard" data-mode="hard">HARD<small>Lari cepat</small></button>
</div>
<button class="start" id="start">MULAI BERLARI</button>
</div>
</div>
</div>
<script>
const canvas=document.getElementById("canvas"),ctx=canvas.getContext("2d"),game=document.querySelector(".game");
const scoreEl=document.getElementById("score"),coinsEl=document.getElementById("coins"),levelEl=document.getElementById("level");
const levelText=document.getElementById("levelText"),levelFill=document.getElementById("levelFill"),timeName=document.getElementById("timeName");
const distanceBar=document.getElementById("distanceBar"),overlay=document.getElementById("overlay"),title=document.getElementById("title");
const description=document.getElementById("description"),start=document.getElementById("start"),jumpButton=document.getElementById("jump");
const modeButtons=document.querySelectorAll(".mode");

let W,H,dpr,player,chaser,obstacles=[],coins=[],birds=[],particles=[],running=false,raf,last=0,startTime=0;
let score=0,coinCount=0,level=1,worldSpeed=5,spawnTimer=0,coinTimer=0,birdTimer=0,gameMode="easy";

modeButtons.forEach(button=>button.addEventListener("click",()=>{
 modeButtons.forEach(b=>b.classList.remove("active"));button.classList.add("active");gameMode=button.dataset.mode;
 if(gameMode==="easy")description.textContent="EASY dipilih. Tidak ada burung.";
 if(gameMode==="medium")description.textContent="MEDIUM dipilih. Burung akan muncul.";
 if(gameMode==="hard")description.textContent="HARD dipilih. Lari lebih cepat.";
}));

function resize(){dpr=Math.min(window.devicePixelRatio||1,2);W=game.clientWidth;H=game.clientHeight;canvas.width=W*dpr;canvas.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0)}
window.addEventListener("resize",resize);resize();
function groundY(){return H-135}

const levelData=[
{name:"PAGI",top:"#77c9ff",bottom:"#dff6ff",sun:"#fff2a8",ground:"#263b48",line:"#74e5ff"},
{name:"PAGI CERAH",top:"#49b9ff",bottom:"#c9f2ff",sun:"#fff6bd",ground:"#27444c",line:"#7cf0ff"},
{name:"SIANG",top:"#26a8e0",bottom:"#a7e9ff",sun:"#fff7c2",ground:"#24505b",line:"#6ceaff"},
{name:"SIANG TERANG",top:"#168cd0",bottom:"#82d9ff",sun:"#fff1a1",ground:"#203f52",line:"#53ddff"},
{name:"SORE",top:"#ff8c6b",bottom:"#ffd18c",sun:"#ffe08a",ground:"#4a3441",line:"#ff9c73"},
{name:"SORE SENJA",top:"#d85d83",bottom:"#ffb56e",sun:"#ffd27a",ground:"#392d42",line:"#ff7ea5"},
{name:"MAGHRIB",top:"#784d91",bottom:"#e08380",sun:"#ffc070",ground:"#27263c",line:"#d76cff"},
{name:"MALAM",top:"#20295c",bottom:"#080d27",sun:"#dce7ff",ground:"#11162b",line:"#627bff"},
{name:"MALAM GELAP",top:"#101738",bottom:"#040612",sun:"#c6d6ff",ground:"#090c1c",line:"#5064ff"},
{name:"TENGAH MALAM",top:"#05091d",bottom:"#010207",sun:"#b5c7ff",ground:"#050713",line:"#3d55ff"}
];
function getLevel(){return levelData[level-1]}
function updateLevelUI(){let d=getLevel();levelEl.textContent=level;levelText.textContent=level;timeName.textContent=d.name;levelFill.style.width=(level/10*100)+"%"}

function init(){
 player={x:W*.25,y:groundY(),width:38,height:48,vy:0,jumping:false};
 chaser={x:W*.08,y:groundY(),width:40,height:50};
 obstacles=[];coins=[];birds=[];particles=[];score=0;coinCount=0;level=1;
 worldSpeed=gameMode==="easy"?5:gameMode==="medium"?5.5:8;
 spawnTimer=.8;coinTimer=1;birdTimer=gameMode==="easy"?999999:1.5;
 startTime=performance.now();scoreEl.textContent="0";coinsEl.textContent="0";updateLevelUI();
 distanceBar.style.width="72%";title.textContent="XORIZN-BOT";start.textContent="MULAI BERLARI";
 running=true;last=performance.now();overlay.classList.add("hidden");raf=requestAnimationFrame(loop);
}

function jump(){
 if(!running||player.jumping)return;
 player.vy=-13;player.jumping=true;
 for(let i=0;i<8;i++)particles.push({x:player.x,y:player.y,vx:(Math.random()-.5)*3,vy:-Math.random()*2,life:1});
}
jumpButton.addEventListener("pointerdown",e=>{e.preventDefault();jump()});
window.addEventListener("keydown",e=>{if(e.code==="Space"||e.code==="ArrowUp"){e.preventDefault();jump()}});

function createObstacle(){
 const h=28+Math.random()*35,w=25+Math.random()*25;
 obstacles.push({x:W+50,y:groundY(),width:w,height:h});
}

/* BURUNG: TETAP LURUS, TIDAK NAIK-TURUN */
function createBird(){
 if(gameMode==="easy")return;
 const baseY=groundY()-65;
 birds.push({x:W+80,y:baseY,baseY,width:48,height:30,flap:Math.random()*Math.PI*2});
}

function createCoin(){
 coins.push({x:W+50,y:groundY()-55-Math.random()*75,r:10});
}

function update(dt){
 const elapsed=(performance.now()-startTime)/1000;
 score=Math.floor(elapsed*10);
 const newLevel=Math.min(10,1+Math.floor(elapsed/15));
 if(newLevel!==level){level=newLevel;updateLevelUI()}
 let baseSpeed=gameMode==="easy"?5:gameMode==="medium"?5.5:8;
 worldSpeed=baseSpeed+Math.min(6,(level-1)*.45);

 player.vy+=.65*dt*60;player.y+=player.vy*dt*60;
 if(player.y>=groundY()){player.y=groundY();player.vy=0;player.jumping=false}

 spawnTimer-=dt;
 if(spawnTimer<=0){createObstacle();spawnTimer=.9+Math.random()*.8-Math.min(.25,level*.02)}
 coinTimer-=dt;
 if(coinTimer<=0){createCoin();coinTimer=1+Math.random()*1.1}

 if(gameMode!=="easy"){
  birdTimer-=dt;
  if(birdTimer<=0){createBird();birdTimer=Math.max(.7,2+Math.random()*1.5-level*.08)}
 }

 for(const o of obstacles)o.x-=worldSpeed*dt*60;
 obstacles=obstacles.filter(o=>o.x+o.width>-40);
 for(const c of coins)c.x-=worldSpeed*dt*60;

 coins=coins.filter(c=>{
  const hit=circleRect(c.x,c.y,c.r,player.x-player.width/2,player.y-player.height,player.width,player.height);
  if(hit){
   coinCount++;
   for(let i=0;i<10;i++)particles.push({x:c.x,y:c.y,vx:(Math.random()-.5)*4,vy:(Math.random()-.5)*4,life:1});
  }
  return !hit&&c.x>-30;
 });

 if(gameMode!=="easy"){
  for(const b of birds){
   b.x-=(worldSpeed+2.5)*dt*60;
   b.flap+=dt*18;
   b.y=b.baseY;
   if(rectCollision(player.x-player.width/2,player.y-player.height,player.width,player.height,b.x-b.width/2,b.y-b.height/2,b.width,b.height)){
    gameOver("MENABRAK BURUNG!");return;
   }
  }
  birds=birds.filter(b=>b.x+b.width>-50);
 }

 for(const o of obstacles){
  if(rectCollision(player.x-player.width/2,player.y-player.height,player.width,player.height,o.x,o.y-o.height,o.width,o.height)){
   gameOver("MENABRAK RINTANGAN!");return;
  }
 }

 const targetX=player.x-95;
 chaser.x+=(targetX-chaser.x)*.35*dt;
 const distance=player.x-chaser.x;
 const percent=Math.max(5,Math.min(100,distance/190*100));
 distanceBar.style.width=percent+"%";
 if(distance<45){gameOver("TERTANGKAP PENGEJAR!");return}

 for(const p of particles){p.x+=p.vx*dt*60;p.y+=p.vy*dt*60;p.life-=dt*1.8}
 particles=particles.filter(p=>p.life>0);
 scoreEl.textContent=score;coinsEl.textContent=coinCount;
}

function circleRect(cx,cy,r,rx,ry,rw,rh){
 const nx=Math.max(rx,Math.min(cx,rx+rw)),ny=Math.max(ry,Math.min(cy,ry+rh));
 return Math.hypot(cx-nx,cy-ny)<r;
}
function rectCollision(ax,ay,aw,ah,bx,by,bw,bh){
 return ax<bx+bw&&ax+aw>bx&&ay<by+bh&&ay+ah>by;
}

function drawBackground(){
 const d=getLevel(),g=ctx.createLinearGradient(0,0,0,H);
 g.addColorStop(0,d.top);g.addColorStop(1,d.bottom);ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
 ctx.shadowBlur=30;ctx.shadowColor=d.sun;ctx.fillStyle=d.sun;ctx.globalAlpha=.9;
 ctx.beginPath();ctx.arc(W*.78,H*.22,38,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;ctx.shadowBlur=0;

 if(level>=7){
  for(let i=0;i<60;i++){
   const x=(i*97)%W,y=95+(i*47)%Math.max(100,groundY()-170);
   const twinkle=.35+Math.sin(performance.now()/500+i)*.2;
   ctx.fillStyle="rgba(255,255,255,"+twinkle+")";ctx.fillRect(x,y,2,2);
  }
 }
 if(level<=4){
  for(let i=0;i<5;i++){
   const x=(i*190-performance.now()/60)%(W+220)-100,y=120+i*40;
   ctx.fillStyle="rgba(255,255,255,.18)";ctx.beginPath();ctx.ellipse(x,y,55,15,0,0,Math.PI*2);ctx.fill();
  }
 }
 ctx.fillStyle="rgba(20,30,55,.18)";ctx.beginPath();ctx.moveTo(0,groundY());
 for(let x=0;x<=W;x+=80){const h=45+Math.sin(x*.035)*35;ctx.lineTo(x,groundY()-h)}
 ctx.lineTo(W,groundY());ctx.closePath();ctx.fill();
}

function draw(){
 ctx.clearRect(0,0,W,H);drawBackground();const d=getLevel();
 ctx.fillStyle=d.ground;ctx.fillRect(0,groundY()+2,W,H);
 ctx.strokeStyle=d.line;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,groundY()+2);ctx.lineTo(W,groundY()+2);ctx.stroke();

 for(let x=-(performance.now()/12)%55;x<W;x+=55){
  ctx.strokeStyle="rgba(255,255,255,.12)";ctx.beginPath();ctx.moveTo(x,groundY()+25);ctx.lineTo(x+25,groundY()+25);ctx.stroke();
 }
 for(const c of coins){
  ctx.shadowBlur=18;ctx.shadowColor="#ffe45c";ctx.fillStyle="#ffe45c";ctx.beginPath();ctx.arc(c.x,c.y,c.r,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
 }
 for(const o of obstacles){
  ctx.fillStyle="#705cff";ctx.shadowBlur=15;ctx.shadowColor="rgba(90,80,255,.8)";ctx.fillRect(o.x,o.y-o.height,o.width,o.height);
  ctx.shadowBlur=0;ctx.fillStyle="#a9a0ff";ctx.fillRect(o.x+5,o.y-o.height+5,o.width-10,4);
 }
 if(gameMode!=="easy")for(const b of birds)drawBird(b.x,b.y,b.flap);
 drawCharacter(chaser.x,chaser.y,"#ff477e",true,"KEJAR");
 drawCharacter(player.x,player.y,"#45eaff",false,"XORIZN-BOT");
 for(const p of particles){
  ctx.fillStyle="rgba(70,220,255,"+p.life+")";ctx.beginPath();ctx.arc(p.x,p.y,3*p.life,0,Math.PI*2);ctx.fill();
 }
}

function drawBird(x,y,flap){
 const wing=Math.sin(flap)*12;ctx.save();ctx.translate(x,y);
 ctx.shadowBlur=20;ctx.shadowColor="#ff4f98";ctx.fillStyle="#ff5b9a";
 ctx.beginPath();ctx.ellipse(0,0,18,10,0,0,Math.PI*2);ctx.fill();
 ctx.fillStyle="#ff83b4";
 ctx.beginPath();ctx.moveTo(-5,-3);ctx.quadraticCurveTo(-18,-14-wing,-31,-5);ctx.quadraticCurveTo(-18,2,-5,5);ctx.fill();
 ctx.beginPath();ctx.moveTo(5,-3);ctx.quadraticCurveTo(18,-14-wing,31,-5);ctx.quadraticCurveTo(18,2,5,5);ctx.fill();
 ctx.shadowBlur=0;ctx.fillStyle="#ffe05c";ctx.beginPath();ctx.moveTo(17,0);ctx.lineTo(31,5);ctx.lineTo(17,8);ctx.closePath();ctx.fill();
 ctx.fillStyle="#fff";ctx.beginPath();ctx.arc(10,-4,3,0,Math.PI*2);ctx.fill();
 ctx.fillStyle="#111";ctx.beginPath();ctx.arc(11,-4,1.5,0,Math.PI*2);ctx.fill();ctx.restore();
}

function drawCharacter(x,y,color,angry,name){
 ctx.save();ctx.textAlign="center";ctx.font="900 12px Arial";ctx.shadowBlur=12;ctx.shadowColor=color;ctx.fillStyle="#fff";ctx.fillText(name,x,y-78);
 ctx.shadowBlur=20;ctx.fillStyle=color;ctx.fillRect(x-19,y-48,38,40);ctx.beginPath();ctx.arc(x,y-53,17,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
 ctx.fillStyle="#fff";ctx.beginPath();ctx.arc(x-6,y-56,3,0,Math.PI*2);ctx.arc(x+6,y-56,3,0,Math.PI*2);ctx.fill();
 ctx.strokeStyle=color;ctx.lineWidth=7;ctx.lineCap="round";const run=Math.sin(performance.now()/90)*8;
 ctx.beginPath();ctx.moveTo(x-9,y-8);ctx.lineTo(x-14-run,y+5);ctx.moveTo(x+9,y-8);ctx.lineTo(x+14+run,y+5);ctx.stroke();
 if(angry){ctx.strokeStyle="#ffb1ca";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x-11,y-63);ctx.lineTo(x-3,y-60);ctx.moveTo(x+11,y-63);ctx.lineTo(x+3,y-60);ctx.stroke()}
 ctx.restore();
}

function gameOver(reason){
 running=false;cancelAnimationFrame(raf);title.textContent="GAME OVER";
 description.textContent=reason+" • Skor "+score+" • Koin "+coinCount+" • Level "+level;
 start.textContent="COBA LAGI";overlay.classList.remove("hidden");
}
function loop(now){
 if(!running)return;const dt=Math.min(.035,(now-last)/1000);last=now;update(dt);draw();
 if(running)raf=requestAnimationFrame(loop);
}
start.onclick=init;
draw();
</script>

<script>
const canvas=document.getElementById("canvas"),ctx=canvas.getContext("2d"),game=document.querySelector(".game");
const scoreEl=document.getElementById("score"),coinsEl=document.getElementById("coins"),levelEl=document.getElementById("level");
const levelText=document.getElementById("levelText"),levelFill=document.getElementById("levelFill"),timeName=document.getElementById("timeName");
const distanceBar=document.getElementById("distanceBar"),overlay=document.getElementById("overlay"),title=document.getElementById("title");
const description=document.getElementById("description"),start=document.getElementById("start"),jumpButton=document.getElementById("jump");
const modeButtons=document.querySelectorAll(".mode");

let W,H,dpr,player,chaser,obstacles=[],coins=[],birds=[],particles=[],running=false,raf,last=0,startTime=0;
let score=0,coinCount=0,level=1,worldSpeed=5,spawnTimer=0,coinTimer=0,birdTimer=0,gameMode="easy";

modeButtons.forEach(button=>button.addEventListener("click",()=>{
 modeButtons.forEach(b=>b.classList.remove("active"));button.classList.add("active");gameMode=button.dataset.mode;
 if(gameMode==="easy")description.textContent="EASY dipilih. Tidak ada burung.";
 if(gameMode==="medium")description.textContent="MEDIUM dipilih. Burung akan muncul.";
 if(gameMode==="hard")description.textContent="HARD dipilih. Lari lebih cepat.";
}));

function resize(){dpr=Math.min(window.devicePixelRatio||1,2);W=game.clientWidth;H=game.clientHeight;canvas.width=W*dpr;canvas.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0)}
window.addEventListener("resize",resize);resize();
function groundY(){return H-135}

const levelData=[
{name:"PAGI",top:"#77c9ff",bottom:"#dff6ff",sun:"#fff2a8",ground:"#263b48",line:"#74e5ff"},
{name:"PAGI CERAH",top:"#49b9ff",bottom:"#c9f2ff",sun:"#fff6bd",ground:"#27444c",line:"#7cf0ff"},
{name:"SIANG",top:"#26a8e0",bottom:"#a7e9ff",sun:"#fff7c2",ground:"#24505b",line:"#6ceaff"},
{name:"SIANG TERANG",top:"#168cd0",bottom:"#82d9ff",sun:"#fff1a1",ground:"#203f52",line:"#53ddff"},
{name:"SORE",top:"#ff8c6b",bottom:"#ffd18c",sun:"#ffe08a",ground:"#4a3441",line:"#ff9c73"},
{name:"SORE SENJA",top:"#d85d83",bottom:"#ffb56e",sun:"#ffd27a",ground:"#392d42",line:"#ff7ea5"},
{name:"MAGHRIB",top:"#784d91",bottom:"#e08380",sun:"#ffc070",ground:"#27263c",line:"#d76cff"},
{name:"MALAM",top:"#20295c",bottom:"#080d27",sun:"#dce7ff",ground:"#11162b",line:"#627bff"},
{name:"MALAM GELAP",top:"#101738",bottom:"#040612",sun:"#c6d6ff",ground:"#090c1c",line:"#5064ff"},
{name:"TENGAH MALAM",top:"#05091d",bottom:"#010207",sun:"#b5c7ff",ground:"#050713",line:"#3d55ff"}
];
function getLevel(){return levelData[level-1]}
function updateLevelUI(){let d=getLevel();levelEl.textContent=level;levelText.textContent=level;timeName.textContent=d.name;levelFill.style.width=(level/10*100)+"%"}

function init(){
 player={x:W*.25,y:groundY(),width:38,height:48,vy:0,jumping:false};
 chaser={x:W*.08,y:groundY(),width:40,height:50};
 obstacles=[];coins=[];birds=[];particles=[];score=0;coinCount=0;level=1;
 worldSpeed=gameMode==="easy"?5:gameMode==="medium"?5.5:8;
 spawnTimer=.8;coinTimer=1;birdTimer=gameMode==="easy"?999999:1.5;
 startTime=performance.now();scoreEl.textContent="0";coinsEl.textContent="0";updateLevelUI();
 distanceBar.style.width="72%";title.textContent="XORIZN-BOT";start.textContent="MULAI BERLARI";
 running=true;last=performance.now();overlay.classList.add("hidden");raf=requestAnimationFrame(loop);
}

function jump(){
 if(!running||player.jumping)return;
 player.vy=-13;player.jumping=true;
 for(let i=0;i<8;i++)particles.push({x:player.x,y:player.y,vx:(Math.random()-.5)*3,vy:-Math.random()*2,life:1});
}
jumpButton.addEventListener("pointerdown",e=>{e.preventDefault();jump()});
window.addEventListener("keydown",e=>{if(e.code==="Space"||e.code==="ArrowUp"){e.preventDefault();jump()}});

function createObstacle(){
 const h=28+Math.random()*35,w=25+Math.random()*25;
 obstacles.push({x:W+50,y:groundY(),width:w,height:h});
}

/* BURUNG: TETAP LURUS, TIDAK NAIK-TURUN */
function createBird(){
 if(gameMode==="easy")return;
 const baseY=groundY()-65;
 birds.push({x:W+80,y:baseY,baseY,width:48,height:30,flap:Math.random()*Math.PI*2});
}

function createCoin(){
 coins.push({x:W+50,y:groundY()-55-Math.random()*75,r:10});
}

function update(dt){
 const elapsed=(performance.now()-startTime)/1000;
 score=Math.floor(elapsed*10);
 const newLevel=Math.min(10,1+Math.floor(elapsed/15));
 if(newLevel!==level){level=newLevel;updateLevelUI()}
 let baseSpeed=gameMode==="easy"?5:gameMode==="medium"?5.5:8;
 worldSpeed=baseSpeed+Math.min(6,(level-1)*.45);

 player.vy+=.65*dt*60;player.y+=player.vy*dt*60;
 if(player.y>=groundY()){player.y=groundY();player.vy=0;player.jumping=false}

 spawnTimer-=dt;
 if(spawnTimer<=0){createObstacle();spawnTimer=.9+Math.random()*.8-Math.min(.25,level*.02)}
 coinTimer-=dt;
 if(coinTimer<=0){createCoin();coinTimer=1+Math.random()*1.1}

 if(gameMode!=="easy"){
  birdTimer-=dt;
  if(birdTimer<=0){createBird();birdTimer=Math.max(.7,2+Math.random()*1.5-level*.08)}
 }

 for(const o of obstacles)o.x-=worldSpeed*dt*60;
 obstacles=obstacles.filter(o=>o.x+o.width>-40);
 for(const c of coins)c.x-=worldSpeed*dt*60;

 coins=coins.filter(c=>{
  const hit=circleRect(c.x,c.y,c.r,player.x-player.width/2,player.y-player.height,player.width,player.height);
  if(hit){
   coinCount++;
   for(let i=0;i<10;i++)particles.push({x:c.x,y:c.y,vx:(Math.random()-.5)*4,vy:(Math.random()-.5)*4,life:1});
  }
  return !hit&&c.x>-30;
 });

 if(gameMode!=="easy"){
  for(const b of birds){
   b.x-=(worldSpeed+2.5)*dt*60;
   b.flap+=dt*18;
   b.y=b.baseY;
   if(rectCollision(player.x-player.width/2,player.y-player.height,player.width,player.height,b.x-b.width/2,b.y-b.height/2,b.width,b.height)){
    gameOver("MENABRAK BURUNG!");return;
   }
  }
  birds=birds.filter(b=>b.x+b.width>-50);
 }

 for(const o of obstacles){
  if(rectCollision(player.x-player.width/2,player.y-player.height,player.width,player.height,o.x,o.y-o.height,o.width,o.height)){
   gameOver("MENABRAK RINTANGAN!");return;
  }
 }

 const targetX=player.x-95;
 chaser.x+=(targetX-chaser.x)*.35*dt;
 const distance=player.x-chaser.x;
 const percent=Math.max(5,Math.min(100,distance/190*100));
 distanceBar.style.width=percent+"%";
 if(distance<45){gameOver("TERTANGKAP PENGEJAR!");return}

 for(const p of particles){p.x+=p.vx*dt*60;p.y+=p.vy*dt*60;p.life-=dt*1.8}
 particles=particles.filter(p=>p.life>0);
 scoreEl.textContent=score;coinsEl.textContent=coinCount;
}

function circleRect(cx,cy,r,rx,ry,rw,rh){
 const nx=Math.max(rx,Math.min(cx,rx+rw)),ny=Math.max(ry,Math.min(cy,ry+rh));
 return Math.hypot(cx-nx,cy-ny)<r;
}
function rectCollision(ax,ay,aw,ah,bx,by,bw,bh){
 return ax<bx+bw&&ax+aw>bx&&ay<by+bh&&ay+ah>by;
}

function drawBackground(){
 const d=getLevel(),g=ctx.createLinearGradient(0,0,0,H);
 g.addColorStop(0,d.top);g.addColorStop(1,d.bottom);ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
 ctx.shadowBlur=30;ctx.shadowColor=d.sun;ctx.fillStyle=d.sun;ctx.globalAlpha=.9;
 ctx.beginPath();ctx.arc(W*.78,H*.22,38,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;ctx.shadowBlur=0;

 if(level>=7){
  for(let i=0;i<60;i++){
   const x=(i*97)%W,y=95+(i*47)%Math.max(100,groundY()-170);
   const twinkle=.35+Math.sin(performance.now()/500+i)*.2;
   ctx.fillStyle="rgba(255,255,255,"+twinkle+")";ctx.fillRect(x,y,2,2);
  }
 }
 if(level<=4){
  for(let i=0;i<5;i++){
   const x=(i*190-performance.now()/60)%(W+220)-100,y=120+i*40;
   ctx.fillStyle="rgba(255,255,255,.18)";ctx.beginPath();ctx.ellipse(x,y,55,15,0,0,Math.PI*2);ctx.fill();
  }
 }
 ctx.fillStyle="rgba(20,30,55,.18)";ctx.beginPath();ctx.moveTo(0,groundY());
 for(let x=0;x<=W;x+=80){const h=45+Math.sin(x*.035)*35;ctx.lineTo(x,groundY()-h)}
 ctx.lineTo(W,groundY());ctx.closePath();ctx.fill();
}

function draw(){
 ctx.clearRect(0,0,W,H);drawBackground();const d=getLevel();
 ctx.fillStyle=d.ground;ctx.fillRect(0,groundY()+2,W,H);
 ctx.strokeStyle=d.line;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,groundY()+2);ctx.lineTo(W,groundY()+2);ctx.stroke();

 for(let x=-(performance.now()/12)%55;x<W;x+=55){
  ctx.strokeStyle="rgba(255,255,255,.12)";ctx.beginPath();ctx.moveTo(x,groundY()+25);ctx.lineTo(x+25,groundY()+25);ctx.stroke();
 }
 for(const c of coins){
  ctx.shadowBlur=18;ctx.shadowColor="#ffe45c";ctx.fillStyle="#ffe45c";ctx.beginPath();ctx.arc(c.x,c.y,c.r,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
 }
 for(const o of obstacles){
  ctx.fillStyle="#705cff";ctx.shadowBlur=15;ctx.shadowColor="rgba(90,80,255,.8)";ctx.fillRect(o.x,o.y-o.height,o.width,o.height);
  ctx.shadowBlur=0;ctx.fillStyle="#a9a0ff";ctx.fillRect(o.x+5,o.y-o.height+5,o.width-10,4);
 }
 if(gameMode!=="easy")for(const b of birds)drawBird(b.x,b.y,b.flap);
 drawCharacter(chaser.x,chaser.y,"#ff477e",true,"KEJAR");
 drawCharacter(player.x,player.y,"#45eaff",false,"XORIZN-BOT");
 for(const p of particles){
  ctx.fillStyle="rgba(70,220,255,"+p.life+")";ctx.beginPath();ctx.arc(p.x,p.y,3*p.life,0,Math.PI*2);ctx.fill();
 }
}

function drawBird(x,y,flap){
 const wing=Math.sin(flap)*12;ctx.save();ctx.translate(x,y);
 ctx.shadowBlur=20;ctx.shadowColor="#ff4f98";ctx.fillStyle="#ff5b9a";
 ctx.beginPath();ctx.ellipse(0,0,18,10,0,0,Math.PI*2);ctx.fill();
 ctx.fillStyle="#ff83b4";
 ctx.beginPath();ctx.moveTo(-5,-3);ctx.quadraticCurveTo(-18,-14-wing,-31,-5);ctx.quadraticCurveTo(-18,2,-5,5);ctx.fill();
 ctx.beginPath();ctx.moveTo(5,-3);ctx.quadraticCurveTo(18,-14-wing,31,-5);ctx.quadraticCurveTo(18,2,5,5);ctx.fill();
 ctx.shadowBlur=0;ctx.fillStyle="#ffe05c";ctx.beginPath();ctx.moveTo(17,0);ctx.lineTo(31,5);ctx.lineTo(17,8);ctx.closePath();ctx.fill();
 ctx.fillStyle="#fff";ctx.beginPath();ctx.arc(10,-4,3,0,Math.PI*2);ctx.fill();
 ctx.fillStyle="#111";ctx.beginPath();ctx.arc(11,-4,1.5,0,Math.PI*2);ctx.fill();ctx.restore();
}

function drawCharacter(x,y,color,angry,name){
 ctx.save();ctx.textAlign="center";ctx.font="900 12px Arial";ctx.shadowBlur=12;ctx.shadowColor=color;ctx.fillStyle="#fff";ctx.fillText(name,x,y-78);
 ctx.shadowBlur=20;ctx.fillStyle=color;ctx.fillRect(x-19,y-48,38,40);ctx.beginPath();ctx.arc(x,y-53,17,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
 ctx.fillStyle="#fff";ctx.beginPath();ctx.arc(x-6,y-56,3,0,Math.PI*2);ctx.arc(x+6,y-56,3,0,Math.PI*2);ctx.fill();
 ctx.strokeStyle=color;ctx.lineWidth=7;ctx.lineCap="round";const run=Math.sin(performance.now()/90)*8;
 ctx.beginPath();ctx.moveTo(x-9,y-8);ctx.lineTo(x-14-run,y+5);ctx.moveTo(x+9,y-8);ctx.lineTo(x+14+run,y+5);ctx.stroke();
 if(angry){ctx.strokeStyle="#ffb1ca";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x-11,y-63);ctx.lineTo(x-3,y-60);ctx.moveTo(x+11,y-63);ctx.lineTo(x+3,y-60);ctx.stroke()}
 ctx.restore();
}

function gameOver(reason){
 running=false;cancelAnimationFrame(raf);title.textContent="GAME OVER";
 description.textContent=reason+" • Skor "+score+" • Koin "+coinCount+" • Level "+level;
 start.textContent="COBA LAGI";overlay.classList.remove("hidden");
}
function loop(now){
 if(!running)return;const dt=Math.min(.035,(now-last)/1000);last=now;update(dt);draw();
 if(running)raf=requestAnimationFrame(loop);
}
start.onclick=init;
draw();
</script>
</body>`;

  try {
    const aiRich = new AIRich(sock)
      .addSubmessage({
        messageType: 2,
        messageText: "XORIZN-BOT CHASE RUNNER",
      })
      .addSection(
        AIRich.newLayout("Single", {
          __typename: "GenAIaeacdsnwHtmlPrimitive",
          payload: htmlCode,
          trusted_sources: ["nixel.dev"],
        })
      );

    await aiRich.send(m.chat, {
      quoted: m,
    });
    try { await m.react("🏃"); } catch {}
  } catch (error) {
    console.error("[KJZO] Error:", error);
    try { await m.react("❌"); } catch {}
    return m.reply(`❌ *Gagal menjalankan KJZO*\n\n> ${error.message}`);
  }
  return { handled: true };

}

export { pluginConfig as config, handler };
