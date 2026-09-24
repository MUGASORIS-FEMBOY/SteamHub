const state = { service: null };

const services = {
  twitch: {
    name: "Twitch",
    placeholder: "https://www.twitch.tv/channel",
    links: [
      ["Twitch", "https://www.twitch.tv/"],
      ["Browse", "https://www.twitch.tv/directory"]
    ]
  },
  youtube: {
    name: "YouTube",
    placeholder: "https://www.youtube.com/watch?v=...",
    links: [
      ["YouTube", "https://www.youtube.com/"],
      ["Live", "https://www.youtube.com/live"]
    ]
  },
  tiktok: {
    name: "TikTok",
    placeholder: "https://www.tiktok.com/@user/video/...",
    links: [
      ["TikTok", "https://www.tiktok.com/"],
      ["Following", "https://www.tiktok.com/following"]
    ]
  },
  vrm: {
    name: "VR-M.net",
    placeholder: "Paste a VR-M.net URL",
    links: [
      ["VR-M.net", "https://vr-m.net/"]
    ]
  }
};

const $ = id => document.getElementById(id);
const player = $("player"), empty = $("emptyPlayer"), external = $("externalCard");
const notice = $("notice"), urlInput = $("urlInput"), title = $("playerTitle");
const playerPanel = $("playerPanel"), fsBtn = $("fullscreenBtn");

function resetPlayer(){
  player.hidden = true; player.src = ""; empty.hidden = false; external.hidden = true;
  fsBtn.hidden = true;
}
function setService(key){
  state.service = key;
  document.querySelectorAll(".service").forEach(x=>x.classList.toggle("active",x.dataset.service===key));
  const s=services[key];
  title.textContent=s.name;
  urlInput.placeholder=s.placeholder;
  $("quickLinks").innerHTML=s.links.map(([name,url])=>`<button data-url="${url}">${name}</button>`).join("");
  $("quickLinks").querySelectorAll("button").forEach(b=>b.onclick=()=>{urlInput.value=b.dataset.url;load()});
  resetPlayer();
  notice.textContent = key==="twitch"
    ? "Twitch embeds require the parent domain to be included. This page automatically uses the current hostname."
    : "Paste a URL and press Load. If the platform blocks embedding, StreamHub will give you an Open button instead.";
}

function ytId(url){
  try{
    const u=new URL(url);
    if(u.hostname.includes("youtu.be")) return u.pathname.slice(1).split("/")[0];
    if(u.searchParams.get("v")) return u.searchParams.get("v");
    const m=u.pathname.match(/\/(?:embed|shorts|live)\/([^/?]+)/); return m?m[1]:null;
  }catch{return null}
}
function twitchPath(url){
  try{
    const u=new URL(url);
    if(!/twitch\.tv$/i.test(u.hostname) && !u.hostname.endsWith(".twitch.tv")) return null;
    const p=u.pathname.split("/").filter(Boolean);
    if(!p.length || ["directory","videos","search","downloads"].includes(p[0])) return null;
    return p[0];
  }catch{return null}
}
function tikTokEmbed(url){
  try{
    const u=new URL(url);
    const m=u.pathname.match(/\/video\/(\d+)/);
    return m ? `https://www.tiktok.com/player/v1/${m[1]}?description=1&music_info=1&rel=0` : null;
  }catch{return null}
}

function showExternal(url, msg){
  player.hidden=true; player.src=""; empty.hidden=true; external.hidden=false;
  $("externalLink").href=url; $("externalLink").textContent="Open "+(state.service?services[state.service].name:"site");
  notice.textContent=msg;
}

function load(){
  const raw=urlInput.value.trim();
  if(!raw) return;
  let url; try{url=new URL(raw)}catch{notice.textContent="Please enter a complete URL starting with https://";return}
  resetPlayer();
  if(state.service==="youtube"){
    const id=ytId(url.href);
    if(id){player.src=`https://www.youtube.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0`;player.hidden=false;empty.hidden=true;fsBtn.hidden=false;return}
    showExternal(url.href,"That YouTube URL could not be converted to an embed, so it will open normally.");
  } else if(state.service==="twitch"){
    const channel=twitchPath(url.href);
    if(channel){
      const parent=location.hostname||"localhost";
      player.src=`https://player.twitch.tv/?channel=${encodeURIComponent(channel)}&parent=${encodeURIComponent(parent)}&autoplay=false`;
      player.hidden=false;empty.hidden=true;fsBtn.hidden=false;return;
    }
    showExternal(url.href,"Use a Twitch channel URL such as https://www.twitch.tv/channel.");
  } else if(state.service==="tiktok"){
    const embed=tikTokEmbed(url.href);
    if(embed){player.src=embed;player.hidden=false;empty.hidden=true;fsBtn.hidden=false;return}
    showExternal(url.href,"TikTok only provides an embeddable player for supported video URLs. This one will open normally.");
  } else if(state.service==="vrm"){
    showExternal(url.href,"VR-M.net content may block iframe embedding. The safe fallback is to open it in a new tab.");
  }
}

document.querySelectorAll(".service").forEach(b=>b.addEventListener("click",()=>setService(b.dataset.service)));
$("loadBtn").onclick=load;
urlInput.addEventListener("keydown",e=>{if(e.key==="Enter")load()});
$("clearBtn").onclick=()=>{urlInput.value="";resetPlayer();title.textContent="Choose a service";state.service=null;document.querySelectorAll(".service").forEach(x=>x.classList.remove("active"))};
$("themeBtn").onclick=()=>{document.body.classList.toggle("light");localStorage.setItem("streamhub-light",document.body.classList.contains("light"))};
if(localStorage.getItem("streamhub-light")==="true")document.body.classList.add("light");
fsBtn.onclick=()=>{
  if(document.fullscreenElement){
    document.exitFullscreen();
  } else if(playerPanel.requestFullscreen){
    playerPanel.requestFullscreen();
  }
};
document.addEventListener("fullscreenchange",()=>{
  fsBtn.textContent = document.fullscreenElement ? "⤢" : "⛶";
  fsBtn.title = document.fullscreenElement ? "Exit fullscreen" : "Fullscreen";
});
$("aboutBtn").onclick=()=>$("aboutDialog").showModal();
$("closeAbout").onclick=()=>$("aboutDialog").close();
$("aboutDialog").addEventListener("click",e=>{if(e.target===$("aboutDialog"))$("aboutDialog").close()});
