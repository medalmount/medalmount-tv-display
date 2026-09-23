/* Medal Mount TV — live world-conflict news ticker */
(function(){
var style=document.createElement('style');
style.textContent=`
/* Portrait layout polish */
#screen{padding-bottom:7.2vh!important;grid-template-rows:8.8fr 40fr 17.5fr 26.7fr!important}
.card{min-height:0!important;overflow:hidden!important}

/* Shop hours: show all actual days/times clearly */
.hours{padding:.9vh 1.05vh!important;display:flex!important;flex-direction:column!important;justify-content:flex-start!important}
.hours .kicker{font-size:1.55vh!important;line-height:1.05!important;margin:0 0 .25vh!important}
.hours h2{font-size:2.65vh!important;line-height:1!important;margin:.15vh 0 .45vh!important}
.hours .row{display:flex!important;justify-content:space-between!important;align-items:center!important;font-size:1.55vh!important;line-height:1.25!important;margin:.08vh 0!important}
.hours .row b{font-size:1.55vh!important;line-height:1.25!important;white-space:nowrap!important}
.hours>div:last-child{font-size:1.15vh!important;line-height:1.15!important;margin-top:.3vh!important}

/* Weather: keep CANBERRA and all conditions inside the panel */
.weather{padding:.8vh!important;justify-content:flex-start!important}
.weather .kicker{font-size:1.45vh!important;line-height:1!important;margin:0 0 .15vh!important}
.weather h2{font-size:2.15vh!important;line-height:1!important;margin:.1vh 0 .25vh!important}
.weather .placeholder{display:flex!important;flex-direction:column!important;justify-content:center!important;flex:1!important;min-height:0!important}
.weather-now{font-size:4.55vh!important;line-height:1!important}
.weather-condition{font-size:1.85vh!important;line-height:1.05!important;margin-top:.15vh!important}
.weather-range{font-size:1.35vh!important;line-height:1.1!important;margin-top:.25vh!important}
.weather-detail{font-size:1.05vh!important;line-height:1.1!important;margin-top:.2vh!important}

/* History: fit complete entry instead of losing lower lines */
.history{padding:.9vh 1.05vh!important;display:flex!important;flex-direction:column!important}
.history .kicker{font-size:1.35vh!important;line-height:1.05!important;margin:0 0 .25vh!important}
.history h2{font-size:2.2vh!important;line-height:1.08!important;margin:.15vh 0 .35vh!important}
.history p{font-size:1.38vh!important;line-height:1.17!important;margin:.1vh 0!important;display:-webkit-box!important;-webkit-line-clamp:7!important;-webkit-box-orient:vertical!important;overflow:hidden!important}
.history .medal{font-size:.98vh!important;line-height:1.1!important;margin-top:.35vh!important}

/* QR/contact panel */
.contact{padding:.45vh!important}
.qrbox{width:17.2vh!important;margin:0 auto .1vh!important}
.qrbox img{width:15.4vh!important;height:15.4vh!important;padding:.35vh!important}
.qrbox div{font-size:1.45vh!important;line-height:1!important}
.contact .web{font-size:2.05vh!important;line-height:1!important;margin-top:.1vh!important}
.contact .phone{font-size:1.45vh!important;line-height:1!important;margin-top:.2vh!important}
.contact small{font-size:.95vh!important;line-height:1!important;margin-top:.2vh!important}

/* Bottom ticker: readable but no longer crowds the cards */
.conflict-ticker{position:absolute;left:0;right:0;bottom:0;height:6.4vh;background:#07111d;border-top:2px solid #d5aa45;border-bottom:1px solid #d5aa45;display:flex;align-items:center;z-index:9999;overflow:hidden;font-family:Arial,Helvetica,sans-serif}
.conflict-label{height:100%;display:flex;align-items:center;justify-content:center;padding:0 .85vh;background:#f0cf25;color:#071526;font-size:1.85vh;line-height:1.02;font-weight:900;letter-spacing:.02em;white-space:normal;text-align:center;max-width:16vh;z-index:2}
.conflict-window{overflow:hidden;flex:1;height:100%;display:flex;align-items:center}
.conflict-track{display:inline-block;white-space:nowrap;padding-left:100%;font-size:2.75vh;line-height:1;font-weight:700;color:#f2f5f8;animation:conflictScroll 115s linear infinite;will-change:transform}
.conflict-track .src{color:#f0cf25;font-weight:900}.conflict-track .sep{color:#6f8498;padding:0 1.5vh}
@keyframes conflictScroll{from{transform:translateX(0)}to{transform:translateX(-100%)}}
`;
document.head.appendChild(style);
var bar=document.createElement('div');bar.className='conflict-ticker';bar.innerHTML='<div class="conflict-label">CURRENT WORLD CONFLICTS</div><div class="conflict-window"><div class="conflict-track" id="conflictTrack">Updating current conflict headlines…</div></div>';
var rotator=document.getElementById('tv-rotator')||document.body;rotator.appendChild(bar);
var track=document.getElementById('conflictTrack');
function clean(s){return String(s||'').replace(/<[^>]*>/g,'').replace(/\s+/g,' ').trim()}
function host(u){try{return new URL(u).hostname.replace(/^www\./,'').split('.')[0].toUpperCase()}catch(e){return'NEWS'}}
function englishOnly(s){s=clean(s);if(!s)return false;if(/[\u0600-\u06ff\u0750-\u077f\u08a0-\u08ff\u0400-\u052f\u0590-\u05ff\u3040-\u30ff\u3400-\u9fff]/.test(s))return false;var letters=s.match(/[A-Za-z]/g)||[];return letters.length>=Math.max(8,Math.floor(s.length*.35))}
function render(items){if(!items||!items.length)items=[{source:'LIVE NEWS',title:'Current conflict headlines temporarily unavailable — display will retry automatically'}];var seen={},out=[];items.forEach(function(x){var t=clean(x.title);if(!englishOnly(t)||seen[t.toLowerCase()])return;seen[t.toLowerCase()]=1;out.push('<span class="src">'+clean(x.source||host(x.url))+'</span> — '+t)});if(!out.length)out.push('<span class="src">LIVE NEWS</span> — Current English-language conflict headlines temporarily unavailable — display will retry automatically');track.innerHTML=out.slice(0,12).join('<span class="sep">◆</span>');track.style.animation='none';void track.offsetWidth;track.style.animation='conflictScroll 115s linear infinite'}
function loadFallback(){var q='(Ukraine OR Gaza OR Israel OR Iran OR Sudan OR Myanmar OR Congo OR Yemen) (war OR conflict OR fighting OR ceasefire OR strike OR attack) sourcelang:english (domainis:reuters.com OR domainis:apnews.com OR domainis:abc.net.au OR domainis:bbc.com)';var u='https://api.gdeltproject.org/api/v2/doc/doc?query='+encodeURIComponent(q)+'&mode=ArtList&maxrecords=40&format=json&sort=HybridRel&timespan=24h';fetch(u,{cache:'no-store'}).then(function(r){if(!r.ok)throw Error();return r.json()}).then(function(j){render((j.articles||[]).filter(function(x){return x.title&&x.url&&englishOnly(x.title)}).map(function(x){return{title:x.title,url:x.url,source:host(x.url)}}))}).catch(function(){render([])})}
function load(){fetch('conflict-headlines.json?v='+Date.now(),{cache:'no-store'}).then(function(r){if(!r.ok)throw Error();return r.json()}).then(function(j){if(!j.items||!j.items.length)throw Error();render(j.items)}).catch(loadFallback)}
load();setInterval(load,15*60*1000);
})();