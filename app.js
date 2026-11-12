const $=id=>document.getElementById(id);
let stream=null,sourceBlob=null,resultBlob=null,photos=[];
const CFG="k4_v2_ai_cfg";
function msg(s){$("toast").textContent=s;$("toast").style.display="block";setTimeout(()=>$("toast").style.display="none",3000)}
function cfg(){try{return JSON.parse(localStorage.getItem(CFG))||{}}catch{return {}}}
function tab(t){document.querySelectorAll(".panel").forEach(x=>x.classList.toggle("active",x.id===t));document.querySelectorAll("nav button").forEach(x=>x.classList.toggle("active",x.dataset.tab===t))}
document.querySelectorAll("nav button").forEach(b=>b.onclick=()=>tab(b.dataset.tab));
function setSource(blob,name){sourceBlob=blob;$("preview").src=URL.createObjectURL(blob);$("preview").hidden=false;$("sourceThumb").src=$("preview").src;$("sourceName").textContent=name;$("save").disabled=false;$("toAI").disabled=false;ready()}
async function start(){
  const video=$("video");
  if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia){msg("Camera API unavailable. Open the HTTPS website in Chrome.");return}
  $("start").disabled=true;
  try{
    if(stream)stopCamera();
    let media;
    try{media=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:"user"},width:{ideal:1280},height:{ideal:720}},audio:false})}
    catch(firstError){media=await navigator.mediaDevices.getUserMedia({video:true,audio:false})}
    stream=media;
    video.muted=true;video.autoplay=true;video.playsInline=true;
    video.setAttribute("playsinline","");
    video.setAttribute("webkit-playsinline","");
    video.srcObject=stream;
    await new Promise((resolve,reject)=>{
      if(video.readyState>=1&&video.videoWidth>0){resolve();return}
      const timer=setTimeout(()=>reject(new Error("Camera connected, but video did not become ready. Close other camera apps and retry.")),10000);
      video.onloadedmetadata=()=>{clearTimeout(timer);resolve()};
      video.onerror=()=>{clearTimeout(timer);reject(new Error("Video preview could not load."))};
    });
    await video.play();
    $("capture").disabled=false;$("stop").disabled=false;
    msg("Camera preview started successfully");
  }catch(e){
    if(stream){stream.getTracks().forEach(t=>t.stop());stream=null}
    video.srcObject=null;
    msg("Camera error: "+(e.message||e.name||"Unknown error"));
    console.error("K4 camera startup:",e);
  }finally{$("start").disabled=false}
}
function stopCamera(){
  if(stream){stream.getTracks().forEach(t=>t.stop());stream=null}
  const video=$("video");video.pause();video.srcObject=null;
  $("capture").disabled=true;$("stop").disabled=true;
}
$("start").onclick=start;
$("stop").onclick=stopCamera;
$("capture").onclick=()=>{
  const v=$("video");
  if(!stream||!v.videoWidth||!v.videoHeight){msg("Camera preview is not ready. Tap Start camera again.");return}
  const c=document.createElement("canvas");c.width=v.videoWidth;c.height=v.videoHeight;
  c.getContext("2d").drawImage(v,0,0);
  c.toBlob(b=>{if(b)setSource(b,"Camera capture");else msg("Could not capture photo")}, "image/jpeg",.9);
};
$("upload").onclick=()=>$("file").click();
$("file").onchange=e=>{const f=e.target.files[0];if(f?.type.startsWith("image/"))setSource(f,f.name)};
function dataURL(b){return new Promise((ok,no)=>{let r=new FileReader();r.onload=()=>ok(r.result);r.onerror=no;r.readAsDataURL(b)})}
async function save(b,kind){if(!b)return;try{photos.push({data:await dataURL(b),name:$("guest").value||kind,kind,date:new Date().toLocaleString()});localStorage.setItem("k4_v2_gallery",JSON.stringify(photos));render();msg("Saved to gallery")}catch(e){msg("Storage full; export or delete photos")}}
$("save").onclick=()=>save(sourceBlob,"Original");
$("toAI").onclick=()=>tab("ai");
const prompts={
royal:"Transform this photo into a premium photorealistic Indian royal wedding portrait with elegant palace architecture, tasteful traditional attire and warm golden lighting.",
cinema:"Create a cinematic celebration portrait with dramatic natural film lighting and beautiful depth of field.",
studio:"Create a polished professional studio portrait with softbox lighting and a premium neutral background.",
heritage:"Create an elegant South Indian heritage portrait with tasteful traditional styling and heritage architecture.",
floral:"Create a refined portrait in a beautiful floral garden with soft daylight and shallow depth of field.",
festive:"Create a premium festive celebration portrait with elegant warm lights and tasteful decorations."
};
function ready(){let c=cfg();$("generate").disabled=!(sourceBlob&&c.url&&c.token&&$("consent").checked)}
$("consent").onchange=ready;
$("generate").onclick=async()=>{
  let c=cfg();if(!sourceBlob||!$("consent").checked)return msg("Select a photo and confirm permission");
  $("generate").disabled=true;$("aiStatus").textContent="Generating. This may take a few minutes…";
  try{
    let fd=new FormData();fd.append("image",sourceBlob,"source.jpg");
    let s=$("style").value,p=s==="custom"?"Edit the uploaded photo according to this instruction. Preserve the subject's recognizable identity, facial features, age and skin tone.":prompts[s];
    if($("custom").value.trim())p+=" Additional direction: "+$("custom").value.trim();
    p+=" Preserve the person's recognizable face, age, skin tone and natural features as closely as possible. Do not add people, text or watermarks.";
    fd.append("prompt",p);
    let r=await fetch(c.url.replace(/\/$/,"")+"/generate",{method:"POST",headers:{Authorization:"Bearer "+c.token},body:fd});
    let d=await r.json();if(!r.ok)throw Error(d.error||"Request failed");
    let img=await fetch(d.image);resultBlob=await img.blob();
    $("result").src=URL.createObjectURL(resultBlob);$("result").hidden=false;
    $("saveAI").disabled=false;$("downloadAI").disabled=false;
    $("aiStatus").textContent="AI portrait generated. Review before sharing.";msg("AI portrait ready");
  }catch(e){$("aiStatus").textContent="AI error: "+e.message;msg(e.message)}
  finally{ready()}
};
$("saveAI").onclick=()=>save(resultBlob,"AI Portrait");
$("downloadAI").onclick=()=>{if(!resultBlob)return;let a=document.createElement("a");a.href=URL.createObjectURL(resultBlob);a.download="K4-AI-Portrait.jpg";a.click()};
function render(){let g=$("gallery");g.innerHTML=photos.map(p=>`<div class="item"><img src="${p.data}"><div><b>${p.name}</b><p class="muted">${p.kind} · ${p.date}</p></div></div>`).join("")||'<p class="muted">No photos saved yet.</p>'}
try{photos=JSON.parse(localStorage.getItem("k4_v2_gallery"))||[]}catch{}
render();
$("saveConfig").onclick=()=>{let c={url:$("workerUrl").value.trim().replace(/\/$/,""),token:$("token").value.trim()};localStorage.setItem(CFG,JSON.stringify(c));ready();msg("AI connection saved on this phone")};
$("test").onclick=async()=>{let c=cfg();try{let r=await fetch(c.url+"/health",{headers:{Authorization:"Bearer "+c.token}});let d=await r.json();if(!r.ok)throw Error(d.error||r.status);$("configStatus").textContent="Connected: "+d.service}catch(e){$("configStatus").textContent="Connection failed: "+e.message}};
let c=cfg();$("workerUrl").value=c.url||"";$("token").value=c.token||"";ready();