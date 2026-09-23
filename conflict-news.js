/* Medal Mount TV — live world-conflict news ticker */
(function(){
var style=document.createElement('style');
style.textContent='#screen{padding-bottom:6.4vh!important}.conflict-ticker{position:absolute;left:0;right:0;bottom:0;height:5.4vh;background:#07111d;border-top:2px solid #d5aa45;border-bottom:1px solid #d5aa45;display:flex;align-items:center;z-index:9999;overflow:hidden;font-family:Arial,Helvetica,sans-serif}.conflict-label{height:100%;display:flex;align-items:center;justify-content:center;padding:0 1.4vh;background:#d5aa45;color:#071526;font-size:2.05vh;line-height:1.02;font-weight:900;letter-spacing:.035em;white-space:nowrap;z-index:2}.conflict-window{overflow:hidden;flex:1;height:100%;display:flex;align-items:center}.conflict-track{display:inline-block;white-space:nowrap;padding-left:100%;font-size:3.4vh;line-height:1;font-weight:700;color:#f2f5f8;animation:conflictScroll 115s linear infinite;will-change:transform}.conflict-track .src{color:#d5aa45;font-weight:900}.conflict-track .sep{color:#6f8498;padding:0 1.5vh}@keyframes conflictScroll{from{transform:translateX(0)}to{transform:translateX(-100%)}}';
document.head.appendChild(style);
var bar=document.createElement('div');bar.className='conflict-ticker';bar.innerHTML='<div class="conflict-label">WORLD CONFLICTS</div><div class="conflict-window"><div class="conflict-track" id="conflictTrack">Updating current conflict headlines…</div></div>';
var rotator=document.getElementById('tv-rotator')||document.body;rotator.appendChild(bar);
var track=document.getElementById('conflictTrack');
function clean(s){return String(s||'').replace(/<[^>]*>/g,'').replace(/\s+/g,' ').trim()}
function host(u){try{return new URL(u).hostname.replace(/^www\./,'').split('.')[0].toUpperCase()}catch(e){return'NEWS'}}
function englishOnly(s){s=clean(s);if(!s)return false;if(/[\u0600-\u06ff\u0750-\u077f\u08a0-\u08ff\u0400-\u052f\u0590-\u05ff\u3040-\u30ff\u3400-\u9fff]/.test(s))return false;var letters=s.match(/[A-Za-z]/g)||[];return letters.length>=Math.max(8,Math.floor(s.length*.35))}
function render(items){
 if(!items||!items.length)items=[{source:'LIVE NEWS',title:'Current conflict headlines temporarily unavailable — display will retry automatically'}];
 var seen={},out=[];
 items.forEach(function(x){var t=clean(x.title);if(!englishOnly(t)||seen[t.toLowerCase()])return;seen[t.toLowerCase()]=1;out.push('<span class="src">'+clean(x.source||host(x.url))+'</span> — '+t)});
 if(!out.length)out.push('<span class="src">LIVE NEWS</span> — Current English-language conflict headlines temporarily unavailable — display will retry automatically');
 track.innerHTML=out.slice(0,12).join('<span class="sep">◆</span>');
 track.style.animation='none';void track.offsetWidth;track.style.animation='conflictScroll 115s linear infinite'
}
function load(){
 var q='(Ukraine OR Gaza OR Israel OR Iran OR Sudan OR Myanmar OR Congo OR Yemen) (war OR conflict OR fighting OR ceasefire OR strike OR attack) sourcelang:english (domainis:reuters.com OR domainis:apnews.com OR domainis:abc.net.au OR domainis:bbc.com)';
 var u='https://api.gdeltproject.org/api/v2/doc/doc?query='+encodeURIComponent(q)+'&mode=ArtList&maxrecords=40&format=json&sort=HybridRel&timespan=24h';
 fetch(u,{cache:'no-store'}).then(function(r){if(!r.ok)throw Error();return r.json()}).then(function(j){render((j.articles||[]).filter(function(x){return x.title&&x.url&&englishOnly(x.title)}).map(function(x){return{title:x.title,url:x.url,source:host(x.url)}}))}).catch(function(){render([])})
}
load();setInterval(load,15*60*1000);
})();