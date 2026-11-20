(function(){
var DATA={cats:[],posts:[]},q='',cat='',dt='',so='new';
var $=function(i){return document.getElementById(i)};
function esc(x){var d=document.createElement('div');d.textContent=x;return d.innerHTML}
function days(p){return Math.floor((new Date()-new Date(p.d+'T00:00:00'))/864e5)}
function fmt(d){return new Date(d+'T12:00:00').toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})}
function bold(t){return esc(t).replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')}
function clean(t){return esc(t.split('**').join(''))}
function wdiff(a,b){var x=a.split(/\s+/).filter(Boolean),y=b.split(/\s+/).filter(Boolean),m=x.length,n=y.length,L=[],i,j;for(i=0;i<=m;i++){L.push(new Array(n+1).fill(0))}for(i=m-1;i>=0;i--)for(j=n-1;j>=0;j--)L[i][j]=x[i]==y[j]?L[i+1][j+1]+1:Math.max(L[i+1][j],L[i][j+1]);var o='',w='';i=0;j=0;while(i<m&&j<n){if(x[i]==y[j]){o+=clean(x[i])+' ';w+=clean(y[j])+' ';i++;j++}else if(L[i+1][j]>=L[i][j+1]){o+='<del>'+clean(x[i])+'</del> ';i++}else{w+='<ins>'+clean(y[j])+'</ins> ';j++}}while(i<m){o+='<del>'+clean(x[i++])+'</del> '}while(j<n){w+='<ins>'+clean(y[j++])+'</ins> '}return [o,w]}
function gal(p){return p.img&&p.img.length?'<div class="gal">'+p.img.map(function(s){return '<img class="pi" src="'+s+'" alt="Update photo">'}).join('')+'</div>':''}
function label(p){return days(p)<=7?p.l:'ACTIVE'}
var STOP='a an the of for to and or in on at is are with by'.split(' ');
function words(t){return t.toLowerCase().replace(/[^a-z0-9 ]+/g,' ').split(/\s+/).filter(function(w){return w&&STOP.indexOf(w)<0})}
function sim(a,b){var x=words(a),y=words(b);if(!x.length||!y.length)return 0;var i=x.filter(function(w){return y.indexOf(w)>-1}).length;return i/(x.length+y.length-i)}
function prevOf(p){
if(p.rep){var r=DATA.posts.filter(function(q){return q.id==p.rep})[0];if(r)return r}
var best=null,bs=0;DATA.posts.forEach(function(q){if(q.id>=p.id||q.c!=p.c)return;var s=sim(p.t,q.t);if(s>=0.5&&(s>bs||(s==bs&&best&&q.id>best.id))){best=q;bs=s}});return best}
function sup(p){return DATA.posts.some(function(q){return q.rep==p.id})}
function card(p){
var pv=prevOf(p),d=pv?wdiff(pv.b,p.b):null;
var tags='<div class="tags">'+[label(p),p.p].filter(Boolean).map(function(x){return '<span class="tag '+esc(x)+'">'+esc(x)+'</span>'}).join('')+(sup(p)?'<span class="tag SUPERSEDED">REPLACED BY A NEWER UPDATE</span>':'')+'</div>';
return '<div class="panel card"><div class="head" role="button" tabindex="0" aria-expanded="false">'+tags+'<div class="trow"><h3>'+esc(p.t)+'</h3><span class="chev">▾</span></div></div><div class="details hide">'+gal(p)+'<div class="meta">'+esc(p.c)+' · '+fmt(p.d)+' · Version '+esc(p.v)+' · Posted by '+esc(p.by)+'</div><p>'+bold(p.b)+'</p>'+(pv?'<div class="row"><button class="btn pri">What changed?</button></div><div class="drawer hide"><b>Compared with the earlier update “'+esc(pv.t)+'” ('+fmt(pv.d)+') – follow this newer update</b><div class="diff"><div class="old"><b>Earlier update</b><br>'+d[0]+'</div><div class="new"><b>This update</b><br>'+d[1]+'</div></div></div>':'')+'</div></div>'}
function autoscroll(){document.querySelectorAll('.card .gal').forEach(function(g){var t=null,dir=1,pos=0;
function stop(){if(t){cancelAnimationFrame(t);t=null}}
function step(){var max=g.scrollWidth-g.clientWidth;if(max<=2){t=null;return}pos+=dir*1.5;if(pos>=max){pos=max;dir=-1}else if(pos<=0){pos=0;dir=1}g.scrollLeft=pos;t=requestAnimationFrame(step)}
g.onmouseenter=function(){if(!t){pos=g.scrollLeft;t=requestAnimationFrame(step)}};
g.onmouseleave=stop})}
function stats(){var n=DATA.posts.filter(function(p){return days(p)<=7&&(p.l=='NEW'||p.l=='UPDATED')}).length;
$('stats').innerHTML=[[n,'New / Updated'],[DATA.posts.length,'Total posts']].map(function(x){return '<div class="panel stat"><b>'+String(x[0]).padStart(2,'0')+'</b><span>'+x[1]+'</span></div>'}).join('')}
function build(){
var cs=DATA.cats.slice();DATA.posts.forEach(function(p){if(cs.indexOf(p.c)<0)cs.push(p.c)});
$('view').innerHTML='<div class="tools"><input id="q" placeholder="Search policies, announcements, or processes..."><select id="cat"><option value="">All categories</option>'+cs.map(function(c){return '<option>'+esc(c)+'</option>'}).join('')+'</select><select id="dt"><option value="">All dates</option><option value="0">Today</option><option value="7">Last 7 days</option><option value="30">Last 30 days</option></select><select id="so"><option value="new">Sort: Critical first, then newest</option><option value="old">Sort: Oldest first</option><option value="az">Sort: Title A–Z</option><option value="cat">Sort: Category</option></select></div><div id="list"></div>';
$('q').oninput=function(e){q=e.target.value;list()};$('cat').onchange=function(e){cat=e.target.value;list()};$('dt').onchange=function(e){dt=e.target.value;list()};$('so').onchange=function(e){so=e.target.value;list()}}
function list(){
var r=DATA.posts.filter(function(p){var s=(p.t+p.b+p.c).toLowerCase();return(!q||s.indexOf(q.toLowerCase())>-1)&&(!cat||p.c==cat)&&(dt===''||days(p)<=+dt)});
r.sort(function(a,b){var n=b.d.localeCompare(a.d)||b.id-a.id;if(so=='old')return -n;if(so=='az')return a.t.localeCompare(b.t);if(so=='cat')return a.c.localeCompare(b.c)||n;return(b.p=='CRITICAL')-(a.p=='CRITICAL')||n});
$('list').innerHTML='<div class="meta" style="margin-bottom:8px">'+r.length+' results'+(so=='new'?' · Critical updates pinned first':'')+' · Always follow the latest version</div>'+(r.map(card).join('')||'<div class="panel">'+(DATA.posts.length?'No matching announcements.':'No updates have been published yet.')+'</div>');
document.querySelectorAll('#list .card').forEach(function(c){var h=c.querySelector('.head');function tg(){var dt=c.querySelector('.details'),o=dt.classList.toggle('hide')===false;h.setAttribute('aria-expanded',o);c.classList.toggle('open',o)}h.onclick=tg;h.onkeydown=function(e){if(e.key=='Enter'||e.key==' '){e.preventDefault();tg()}};var b=c.querySelector('button');if(b)b.onclick=function(){c.querySelector('.drawer').classList.toggle('hide')}});document.querySelectorAll('.pi').forEach(function(im){im.onclick=function(){var o=document.createElement('div');o.className='lb';o.innerHTML='<img src="'+im.src+'" alt="">';o.onclick=function(){o.remove()};document.body.appendChild(o)}});autoscroll()}
fetch('updates.json',{cache:'no-store'}).then(function(r){if(!r.ok)throw 0;return r.json()}).then(function(j){DATA={cats:j.cats||[],posts:j.posts||[]};stats();build();list()}).catch(function(){$('view').innerHTML='<div class="panel">Could not load updates. If you opened this file straight from your computer, host the site (for example on GitHub Pages) or use a local web server, because browsers block loading updates.json from a local file.</div>'});
(function(){var s='INTERNAL ONLY · NOT FOR MEMBERS      ',l='';for(var i=0;i<18;i++)l+=s.repeat(5)+'\n';var w=document.createElement('div');w.className='wm';w.textContent=l;document.body.appendChild(w)})();
})();
