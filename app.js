const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
$('#year').textContent=new Date().getFullYear();
const ageScreen=$('#ageScreen');
if(sessionStorage.getItem('wywAdultConfirmed')==='yes')ageScreen.hidden=true;
$('#ageYes').addEventListener('click',()=>{sessionStorage.setItem('wywAdultConfirmed','yes');ageScreen.hidden=true});
$('#ageNo').addEventListener('click',()=>{$('.age-card').innerHTML='<h1>Access unavailable</h1><p>This experience is restricted to adults aged 18 or older.</p>'});
let mode='actress',step=0,answers={},recentMode='actress';
const history=JSON.parse(localStorage.getItem('wywRecent')||'[]');
const questions=[
 {title:'Which hair colour do you prefer?',options:['Black','Brown','Blonde','Red','No preference'],icons:['◐','◒','◑','◓','✳']},
 {title:'Which appearance do you prefer?',options:['Natural','Glamorous','Athletic','Alternative','No preference'],icons:['✧','✦','◈','◇','✳']},
 {title:'Which age range?',options:['18–24','25–30','31–40','41+','No preference'],icons:['18+','25+','31+','41+','✳']},
 {title:'Which region interests you?',options:['North America','Europe','Asia','Other','No preference'],icons:['◎','◉','◌','◇','✳']}
];
function toast(s){let t=$('#toast');t.textContent=s;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2300)}
function openSearch(which){mode=which;$('#searchPanel').hidden=false;$('#searchTitle').textContent=which==='actress'?'Find Actress':'Find Videos';$('#searchEyebrow').textContent=which==='actress'?'PERFORMER DISCOVERY':'TOPIC DISCOVERY';$('#nameQuery').placeholder=which==='actress'?'Enter a performer name':'Enter a topic or keyword';
 $('#filterGrid').innerHTML=which==='actress'
 ?'<label><span>Country</span><select><option>Any country</option><option>United States</option><option>Japan</option><option>United Kingdom</option><option>Other</option></select></label><label><span>Age range</span><select><option>Any (18+ only)</option><option>18–24</option><option>25–30</option><option>31–40</option><option>41+</option></select></label><label><span>Hair colour</span><select><option>Any</option><option>Black</option><option>Brown</option><option>Blonde</option><option>Red</option></select></label><label><span>Appearance</span><select><option>Any</option><option>Natural</option><option>Glamorous</option><option>Athletic</option></select></label>'
 :'<label><span>Topic category</span><select><option>Any category</option><option>Category A</option><option>Category B</option></select></label><label><span>Duration</span><select><option>Any duration</option><option>Short</option><option>Medium</option><option>Long</option></select></label><label><span>Production</span><select><option>Any</option><option>Professional</option><option>Independent</option></select></label><label><span>Region</span><select><option>Any region</option><option>North America</option><option>Europe</option><option>Asia</option></select></label>';
 $('#resultsArea').hidden=true;$('#manualPane').hidden=false;$('#guidedPane').hidden=true;$$('.tab').forEach(x=>x.classList.toggle('active',x.dataset.tab==='manual'));$('#searchPanel').scrollIntoView({behavior:'smooth',block:'start'});
}
$$('.discover-card').forEach(b=>b.addEventListener('click',()=>openSearch(b.dataset.mode)));
$('#globalSearchBtn').addEventListener('click',()=>{openSearch('actress');$('#nameQuery').value=$('#globalSearch').value});
$('#globalSearch').addEventListener('keydown',e=>{if(e.key==='Enter')$('#globalSearchBtn').click()});
$('#closeSearch').addEventListener('click',()=>$('#searchPanel').hidden=true);
$$('.tab').forEach(tab=>tab.addEventListener('click',()=>{let guided=tab.dataset.tab==='guided';$$('.tab').forEach(x=>x.classList.toggle('active',x===tab));$('#manualPane').hidden=guided;$('#guidedPane').hidden=!guided;$('#resultsArea').hidden=true;if(guided){step=0;answers={};renderQuestion()}}));
function renderQuestion(){let q=questions[step];$('#questionTitle').textContent=q.title;$('#questionCount').textContent=`QUESTION ${step+1} OF ${questions.length}`;$('#progressBar').style.width=`${(step+1)/questions.length*100}%`;$('#choiceGrid').innerHTML=q.options.map((o,i)=>`<button class="choice ${answers[step]===o?'selected':''}" data-choice="${o}"><div class="choice-art">${q.icons[i]}</div><span>${o}</span></button>`).join('');$$('.choice').forEach(c=>c.addEventListener('click',()=>{answers[step]=c.dataset.choice;renderQuestion()}));$('#prevQuestion').disabled=step===0;$('#nextQuestion').textContent=step===questions.length-1?'Show matches':'Next step →'}
$('#prevQuestion').addEventListener('click',()=>{if(step>0){step--;renderQuestion()}});
$('#nextQuestion').addEventListener('click',()=>{if(!answers[step]){toast('Choose an option to continue.');return}if(step<questions.length-1){step++;renderQuestion()}else showResults()});
function saveSearch(which,query){let item={mode:which,query:query|| (which==='actress'?'Actress preferences':'Video preferences'),time:Date.now()};let next=[item,...history.filter(x=>x.mode!==item.mode||x.query!==item.query)].slice(0,12);history.splice(0,history.length,...next);localStorage.setItem('wywRecent',JSON.stringify(history));renderHistory()}
function showResults(){let q=$('#nameQuery').value.trim()||Object.values(answers).join(' · ');saveSearch(mode,q);$('#resultsArea').hidden=false;$('#resultsArea').scrollIntoView({behavior:'smooth',block:'nearest'})}
$('#runSearch').addEventListener('click',showResults);
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function renderHistory(){let a=history.filter(x=>x.mode==='actress').length,v=history.filter(x=>x.mode==='video').length;$('#actressCount').textContent=a;$('#videoCount').textContent=v;let items=history.filter(x=>x.mode===recentMode);$('#recentGrid').innerHTML=items.length?items.map(x=>`<button class="history-card" data-query="${encodeURIComponent(x.query)}"><span class="history-thumb">${x.mode==='actress'?'◉':'▶'}</span><span><strong>${esc(x.query)}</strong><small>${x.mode==='actress'?'Actress search':'Video topic'} · ${new Date(x.time).toLocaleDateString()}</small></span></button>`).join(''):'<div class="empty-state"><span class="empty-icon">◷</span><h3>Your searches will appear here</h3><p>Search for a profile or topic and it will be saved here on this device.</p></div>';
 $$('.history-card').forEach(c=>c.addEventListener('click',()=>{openSearch(recentMode);$('#nameQuery').value=decodeURIComponent(c.dataset.query);$('#runSearch').click()}))}
$$('.recent-tab').forEach(t=>t.addEventListener('click',()=>{$$('.recent-tab').forEach(x=>x.classList.toggle('active',x===t));recentMode=t.dataset.recent;renderHistory()}));
$('#clearHistory').addEventListener('click',()=>{history.splice(0);localStorage.removeItem('wywRecent');renderHistory();toast('Search history cleared')});
$('#menuBtn').addEventListener('click',()=>toast('Use the discovery sections below to explore'));
renderHistory();
