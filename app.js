(function(){
var DATA={cats:[],posts:[]},q='',cat='',dt='';
var $=function(i){return document.getElementById(i)};
function esc(x){var d=document.createElement('div');d.textContent=x;return d.innerHTML}
function days(p){return Math.floor((new Date()-new Date(p.d+'T00:00:00'))/864e5)}
function fmt(d){return new Date(d+'T12:00:00').toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})}
function wdiff(a,b){var x=a.split(/\s+/).filter(Boolean),y=b.split(/\s+/).filter(Boolean),m=x.length,n=y.length,L=[],i,j;for(i=0;i<=m;i++){L.push(new Array(n+1).fill(0))}for(i=m-1;i>=0;i--)for(j=n-1;j>=0;j--)L[i][j]=x[i]==y[j]?L[i+1][j+1]+1:Math.max(L[i+1][j],L[i][j+1]);var o='',w='';i=0;j=0;while(i<m&&j<n){if(x[i]==y[j]){o+=esc(x[i])+' ';w+=esc(y[j])+' ';i++;j++}else if(L[i+1][j]>=L[i][j+1]){o+='<del>'+esc(x[i])+'</del> ';i++}else{w+='<ins>'+esc(y[j])+'</ins> ';j++}}while(i<m){o+='<del>'+esc(x[i++])+'</del> '}while(j<n){w+='<ins>'+esc(y[j++])+'</ins> '}return [o,w]}
function label(p){return days(p)<=7?p.l:'ACTIVE'}
function card(p){
var hh=(p.h||[]).slice().reverse();
var hist=hh.map(function(x,k){var d=wdiff(x.o,x.n);return '<div style="margin-bottom:12px"><b>'+(k==0?'Latest change – follow the new version (v'+esc(p.v)+')':'Earlier change')+'</b><div class="diff"><div class="old"><b>Previous (v'+esc(x.v)+')</b><br>'+d[0]+'</div><div class="new"><b>New</b><br>'+d[1]+'</div></div></div>'}).join('');
var tags='<div class="tags">'+[label(p),p.p].filter(Boolean).map(function(x){return '<span class="tag '+esc(x)+'">'+esc(x)+'</span>'}).join('')+'</div>';
return '<div class="panel card">'+tags+'<h3>'+esc(p.t)+'</h3><div class="meta">'+esc(p.c)+' · '+fmt(p.d)+' · Version '+esc(p.v)+' · Posted by '+esc(p.by)+'</div><p>'+esc(p.b)+'</p>'+(hh.length?'<div class="row"><button class="btn pri">What changed?</button></div><div class="drawer hide">'+hist+'</div>':'')+'</div>'}
function stats(){var n=DATA.posts.filter(function(p){return days(p)<=7&&(p.l=='NEW'||p.l=='UPDATED')}).length;
$('stats').innerHTML=[[n,'New / Updated'],[DATA.posts.length,'Total posts']].map(function(x){return '<div class="panel stat"><b>'+String(x[0]).padStart(2,'0')+'</b><span>'+x[1]+'</span></div>'}).join('')}
function build(){
var cs=DATA.cats.slice();DATA.posts.forEach(function(p){if(cs.indexOf(p.c)<0)cs.push(p.c)});
$('view').innerHTML='<div class="tools"><input id="q" placeholder="Search policies, announcements, or processes..."><select id="cat"><option value="">All categories</option>'+cs.map(function(c){return '<option>'+esc(c)+'</option>'}).join('')+'</select><select id="dt"><option value="">All dates</option><option value="0">Today</option><option value="7">Last 7 days</option><option value="30">Last 30 days</option></select></div><div id="list"></div>';
$('q').oninput=function(e){q=e.target.value;list()};$('cat').onchange=function(e){cat=e.target.value;list()};$('dt').onchange=function(e){dt=e.target.value;list()}}
function list(){
var r=DATA.posts.filter(function(p){var s=(p.t+p.b+p.c).toLowerCase();return(!q||s.indexOf(q.toLowerCase())>-1)&&(!cat||p.c==cat)&&(dt===''||days(p)<=+dt)});
r.sort(function(a,b){return(b.p=='CRITICAL')-(a.p=='CRITICAL')||b.d.localeCompare(a.d)});
$('list').innerHTML='<div class="meta" style="margin-bottom:8px">'+r.length+' results · Critical updates pinned first · Always follow the latest version</div>'+(r.map(card).join('')||'<div class="panel">'+(DATA.posts.length?'No matching announcements.':'No updates have been published yet.')+'</div>');
document.querySelectorAll('#list .card').forEach(function(c){var b=c.querySelector('button');if(b)b.onclick=function(){c.querySelector('.drawer').classList.toggle('hide')}})}
fetch('updates.json',{cache:'no-store'}).then(function(r){if(!r.ok)throw 0;return r.json()}).then(function(j){DATA={cats:j.cats||[],posts:j.posts||[]};stats();build();list()}).catch(function(){$('view').innerHTML='<div class="panel">Could not load updates. If you opened this file straight from your computer, host the site (for example on GitHub Pages) or use a local web server, because browsers block loading updates.json from a local file.</div>'});
(function(){var s='INTERNAL ONLY · NOT FOR MEMBERS      ',l='';for(var i=0;i<18;i++)l+=s.repeat(5)+'\n';var w=document.createElement('div');w.className='wm';w.textContent=l;document.body.appendChild(w)})();
})();
