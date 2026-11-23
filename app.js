const $=s=>document.querySelector(s),app=$("#app");
const KEY="awsingo",MAXH=5;
let S=load();
function load(){try{return Object.assign({xp:0,hearts:MAXH,streak:0,last:"",done:{}},JSON.parse(localStorage.getItem(KEY)))}catch(e){return{xp:0,hearts:MAXH,streak:0,last:"",done:{}}}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}hud()}
function hud(){$("#xp").textContent=S.xp;$("#hearts").textContent=S.hearts;$("#streak").textContent=S.streak}
const today=()=>new Date().toISOString().slice(0,10);
function touchStreak(){const t=today();if(S.last===t)return;const y=new Date(Date.now()-864e5).toISOString().slice(0,10);S.streak=S.last===y?S.streak+1:1;S.last=t}
const shuffle=a=>a.map(x=>[Math.random(),x]).sort((p,q)=>p[0]-q[0]).map(x=>x[1]);

function home(){
  hud();let html="";
  UNITS.forEach((u,ui)=>{
    const unlocked=ui===0||S.done[UNITS[ui-1].id+":0"];
    html+=`<div class="unit"><h2>ユニット${ui+1}: ${u.title}</h2><p>${u.desc}</p></div><div class="path">`;
    u.lessons.forEach((_,li)=>{const k=u.id+":"+li,d=S.done[k];
      html+=`<button class="node ${d?"done":unlocked?"":"locked"}" ${unlocked?`data-u="${ui}" data-l="${li}"`:"disabled"}>${d?"★":unlocked?"▶":"🔒"}</button>`});
    html+="</div>";
  });
  html+=`<div class="center"><button class="btn red" id="reset" style="max-width:240px">進捗をリセット</button></div>`;
  app.innerHTML=html;
  app.querySelectorAll(".node[data-u]").forEach(b=>b.onclick=()=>start(+b.dataset.u,+b.dataset.l));
  let armed=false;$("#reset").onclick=e=>{if(!armed){armed=true;e.target.textContent="もう一度押すとリセット";return}S={xp:0,hearts:MAXH,streak:0,last:"",done:{}};save();home()};
}

function start(ui,li){
  if(S.hearts<=0){app.innerHTML=`<div class="center"><div class="big">💔</div><h1>ハートがありません</h1><button class="btn" id="b" style="max-width:260px">ハートを回復して戻る</button></div>`;$("#b").onclick=()=>{S.hearts=MAXH;save();home()};return}
  const u=UNITS[ui],qs=shuffle(u.lessons[li]).map(q=>{const c=q.o[q.a],o=shuffle(q.o);return{...q,o,a:o.indexOf(c)}});
  let i=0,ok=0,queue=[...qs];
  function show(){
    if(!queue.length)return finish();
    const q=queue[0],pct=Math.round(i/qs.length*100);let sel=-1,checked=false;
    app.innerHTML=`<div style="display:flex;align-items:center;gap:12px"><button class="quit" id="x">✕</button><div class="bar" style="flex:1;margin:0"><i style="width:${pct}%"></i></div></div>
      <div class="q">${q.q}</div>${q.o.map((t,n)=>`<button class="opt" data-n="${n}">${t}</button>`).join("")}
      <div class="foot" id="foot"><div class="in"><button class="btn" id="go" disabled>チェック</button></div></div>`;
    $("#x").onclick=home;
    const opts=[...app.querySelectorAll(".opt")];
    opts.forEach(b=>b.onclick=()=>{if(checked)return;sel=+b.dataset.n;opts.forEach(o=>o.classList.remove("sel"));b.classList.add("sel");$("#go").disabled=false});
    $("#go").onclick=()=>{
      if(!checked){checked=true;const right=sel===q.a;
        opts[q.a].classList.add("ok");if(!right)opts[sel].classList.add("ng");
        $("#foot").className="foot "+(right?"ok":"ng");
        $("#foot .in").innerHTML=`<p><b>${right?"正解！":"不正解…"}</b><br>${q.e}</p><button class="btn ${right?"":"red"}" id="go">続ける</button>`;
        if(right){ok++;i++;queue.shift();S.xp+=10}else{S.hearts--;queue.push(queue.shift())}
        save();
        $("#go").onclick=()=>{if(S.hearts<=0){start(ui,li)}else show()};
      }
    };
  }
  function finish(){
    touchStreak();S.xp+=20;S.done[u.id+":"+li]=true;save();
    app.innerHTML=`<div class="center"><div class="big">🎉</div><h1>レッスン完了！</h1><p>+${ok*10+20} XP</p><button class="btn" id="b" style="max-width:260px">続ける</button></div>`;
    $("#b").onclick=home;
  }
  show();
}
home();
