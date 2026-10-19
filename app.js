
const $=id=>document.getElementById(id);
const API=location.protocol==='file:'?'':location.origin;
const {same,parseP,conv}=CookingCore;
const strip=s=>s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim();
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const vr=w=>[CookingCore.canonical(w)];
const PR={papa:['g',3.5],cebolla:['g',3],tomate:['g',4],carne:['g',34],pollo:['g',13],pescado:['g',30],arroz:['g',4.8],fideo:['g',5.5],queso:['g',28],salchicha:['g',16],camote:['g',3],huevo:['u',.65],limon:['u',.4],tortilla:['u',.4],palta:['u',2.2],pan:['u',.35],ajo:['u',.15],'cebolla china':['u',.5]};
const STORES={mercado:['Mercado',.9],super:['Supermercado',1.05],bodega:['Bodega',1]};
const mkI=s=>{const[n,q='']=s.split(':'),m=q.match(/^(\d+(?:\.\d+)?)(g|ml)?$/);return{name:n,n:m?+m[1]:null,u:m&&m[2]?m[2]:'u'}};
const D=[
['b1','Arroz con huevo frito','🍳','Perú','20 min','Fácil',480,6.0,'arroz:100g,huevo:2',['Lava el arroz hasta que el agua salga casi clara.','Hierve el doble de agua que de arroz, agrega el arroz, tapa y cocina 15 minutos a fuego mínimo.','Fríe los huevos en aceite caliente 2 a 3 minutos.','Sirve el arroz con los huevos encima y sal.']],
['b2','Lomo saltado','🥩','Perú','45 min','Media',720,5.8,'carne:250g,cebolla:1,tomate:2,papa:300g,arroz:150g',['Cocina el arroz y mantenlo caliente.','Fríe las papas en bastones hasta que doren.','Corta la carne en tiras, sazona y saltea a fuego máximo en tandas.','Saltea cebolla y tomate 1 minuto; deben quedar crocantes.','Mezcla todo con sillao, agrega las papas y sirve con arroz.']],
['b3','Tallarines rojos','🍝','Perú','50 min','Fácil',610,6.1,'fideo:250g,tomate:4,cebolla:1,carne:250g',['Licúa o ralla los tomates.','Sofríe la cebolla, agrega la carne y dórala.','Vierte el tomate y cocina 15 minutos hasta que espese.','Hierve los fideos al dente, escúrrelos y mézclalos con la salsa.']],
['b4','Arroz chaufa','🍚','Perú','25 min','Media',560,6.4,'arroz:100g,huevo:2,pollo:150g,cebolla china:3',['Usa arroz cocido y frío, del día anterior si es posible.','Saltea el pollo en cubos en wok muy caliente y resérvalo.','Haz una tortilla fina con los huevos y córtala en tiras.','Saltea el arroz, agrega sillao, el pollo y el huevo.','Termina con cebolla china picada.']],
['b5','Ceviche clásico','🐟','Perú','40 min','Media',350,8.5,'pescado:300g,limon:8,cebolla:1,camote:1',['Hierve el camote 20 minutos.','Corta la cebolla en pluma y lávala con agua fría.','Corta el pescado en cubos y sálalo.','Exprime los limones, mezcla con el pescado y espera 3 a 4 minutos.','Agrega la cebolla y sirve con el camote.']],
['b6','Tacos de pollo','🌮','México','35 min','Fácil',440,7.4,'tortilla:6,pollo:300g,cebolla:1,tomate:2',['Corta el pollo en tiras y sazona con sal y comino.','Dóralo en sartén caliente 5 a 6 minutos.','Pica cebolla y tomate con limón y cilantro.','Calienta las tortillas y rellena con pollo y pico de gallo.']],
['b7','Pasta al pomodoro','🍅','Italia','30 min','Fácil',520,7.0,'fideo:200g,tomate:5,ajo:2',['Pela y pica los tomates.','Dora el ajo en aceite 30 segundos.','Agrega el tomate y cocina 15 a 20 minutos hasta que espese.','Hierve la pasta al dente y mézclala con la salsa.']],
['b8','Guacamole','🥑','México','15 min','Fácil',230,8.4,'palta:2,tomate:1,cebolla:1,limon:1',['Pica el tomate y la cebolla en cubos pequeños.','Aplasta la palta con un tenedor.','Mezcla todo con limón y sal; prueba y ajusta.']],
['b9','Sándwich de queso','🧀','Estados Unidos','8 min','Fácil',420,4.8,'pan:2,queso:40g',['Unta mantequilla por fuera del pan.','Pon el queso entre las rebanadas.','Dora 2 a 3 minutos por lado a fuego medio-bajo.']],
['b10','Salchipapa','🌭','Perú','25 min','Fácil',780,3.5,'salchicha:4,papa:500g',['Corta las papas en bastones, lávalas y sécalas bien.','Fríelas dos veces: primero sin dorar, luego hasta que queden crocantes.','Fríe las salchichas en rodajas.','Sirve juntas con mayonesa y kétchup.']]
].map(([id,name,em,pais,time,lvl,kcal,hs,ing,steps])=>({id,name,em,pais,time,lvl,kcal,hs,steps,serv:2,items:ing.split(',').map(mkI)}));

D.push(...EXTRA_RECIPES);
const K='qch2',ld=()=>{try{return JSON.parse(localStorage.getItem(K))||{}}catch(e){return{}}};
const L=ld();
try{if(localStorage.getItem(K)&&!localStorage.getItem('qch2-before-v3'))localStorage.setItem('qch2-before-v3',localStorage.getItem(K))}catch{}

const S={av:L.av||{name:'Chef',skin:1,hair:0,hc:0,top:0,tc:0,acc:0,ex:0,bgc:0},pantry:L.pantry||[],fav:L.fav||[],mine:L.mine||[],plan:L.plan||[],lista:L.lista||[],notes:L.notes||{},votes:L.votes||{},people:L.people||2,store:L.store||'super',unit:L.unit||'m',theme:L.theme||'light',
 q:'',chip:'todos',pais:'',lvl:'',bud:false,budv:40,cur:null,dtab:'ing',done:{},ksub:'diario',at:0,focus:null,remote:L.remote||[],suggesting:false,fotoBusy:false,det:[]};
const save=()=>{try{const{av,pantry,fav,mine,plan,lista,notes,votes,people,store,unit,theme,remote}=S;localStorage.setItem(K,JSON.stringify({version:3,av,pantry,fav,mine,plan,lista,notes,votes,people,store,unit,theme,remote,preferences:S.preferences,chat:S.chat,muted:S.muted,game:S.game}))}catch(e){toast('No se pudo guardar. Exporta una copia de tus datos.')}};
const all=()=>[...D,...S.mine,...S.remote],find=id=>all().find(r=>r.id===id);
async function pedirRecetas(ingredientes){
  const r=await fetch(API+'/recetas',{
    signal:AbortSignal.timeout(80000),method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({ingredientes})
  });
  if(!r.ok){let m='';try{m=(await r.json()).error}catch{}throw new Error(m||`El servicio respondió con estado ${r.status}.`)}
  const recetas=await r.json();
  if(!Array.isArray(recetas))throw new Error('El servicio devolvió una respuesta inválida.');
  return recetas;
}
function adaptarReceta(receta,index){
  if(!receta||typeof receta.nombre!=='string')return null;
  const items=Array.isArray(receta.ingredientes)
    ?receta.ingredientes.filter(i=>typeof i==='string'&&i.trim()).map(parseP)
    :[];
  if(!receta.nombre.trim()||!items.length)return null;
  return{
    id:`api-${Date.now()}-${index}`,
    name:receta.nombre.trim(),
    em:'🍲',
    pais:'Sugerida por IA',
    time:typeof receta.tiempo==='string'?receta.tiempo:'',
    serv:2,
    items:items.map(({name,n,u})=>({name,n,u})),
    steps:Array.isArray(receta.pasos)?receta.pasos.filter(s=>typeof s==='string'&&s.trim()):[]
  };
}
async function sugerirRecetas(){
  if(S.suggesting)return;
  const ingredientes=S.pantry.map(p=>p.raw||p.name).filter(Boolean);
  if(!ingredientes.length){toast('Agrega ingredientes a tu despensa primero');return}
  S.suggesting=true;
  render();
  try{
    const recetas=await pedirRecetas(ingredientes);
    const nuevas=recetas.map(adaptarReceta).filter(Boolean);
    if(!nuevas.length)throw new Error('No se recibieron recetas válidas.');
    S.remote=[...S.remote.filter(r=>S.fav.includes(r.id)||S.plan.some(e=>e.id===r.id)),...nuevas];
    save();
    S.q='';S.pais='';S.lvl='';S.chip='todos';
    toast(`Se cargaron ${nuevas.length} sugerencias`);
  }catch(e){
    toast(e instanceof Error?e.message:'No se pudieron cargar las sugerencias');
  }finally{
    S.suggesting=false;
    render();
  }
}
const hue=id=>{let h=0;for(const c of id)h=(h*31+c.charCodeAt(0))%360;return h};
const bg=id=>`background:linear-gradient(135deg,hsl(${hue(id)} 70% 48%),hsl(${(hue(id)+50)%360} 65% 32%))`;
const mins=r=>{const t=r.time||'',h=t.match(/(\d+)\s*h/),m=t.match(/(\d+)\s*min/);return(h?+h[1]*60:0)+(m?+m[1]:0)||60};
const money=x=>'S/ '+x.toFixed(2);
const today=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
const fdate=s=>{try{return new Date(s+'T12:00:00').toLocaleDateString('es-PE',{weekday:'short',day:'numeric',month:'short'})}catch(e){return s}};
const uid=()=>'x'+Date.now().toString(36)+Math.floor(Math.random()*1e5).toString(36);
const col=p=>p===100?'var(--ok)':p>=50?'var(--pa)':'var(--no)';
function toast(m){const t=$('toast');t.textContent=m;t.style.opacity=1;clearTimeout(toast.t);toast.t=setTimeout(()=>t.style.opacity=0,2200)}
function fmt(n,u){
  if(u==='u')return Number(n.toFixed(2)).toLocaleString('es-PE')+' u';
  if(S.unit==='i'){if(u==='g')return n>=454?(n/453.6).toFixed(1)+' lb':(n/28.35).toFixed(n>=100?0:1)+' oz';return(n/29.57).toFixed(1)+' fl oz'}
  if(u==='g')return n>=1000?(n/1000).toFixed(1)+' kg':(Math.round(n/5)*5||5)+' g';
  return(Math.round(n/5)*5||5)+' ml';
}
function cost(name,u,n){
  const p=vr(name).map(k=>PR[k]).find(Boolean);if(!p||n==null)return 0;
  const v=conv(name,n,u,p[0]);if(v==null)return 0;
  return(p[0]==='u'?v:v/1000)*p[1]*STORES[S.store][1];
}
function score(r,ppl=S.people){
 const items=CookingCore.scoreItems(r.items,S.pantry,ppl/r.serv);let tot=0,own=0;
 for(const i of items){const c=cost(i.name,i.u,i.need);tot+=c;own+=c*i.ratio}
 const avg=items.reduce((a,i)=>a+i.ratio,0)/(items.length||1);
 return {...r,ppl,items,pct:items.length&&items.every(i=>i.st==='ok')?100:Math.min(99,Math.floor(avg*100)),cost:tot,own,buy:tot-own};
}
function addPantry(t){const parsed=CookingCore.split(t).map(parseP);parsed.forEach(p=>CookingCore.mergePantry(S.pantry,p))}
function addList(name,n,u,from){const x=S.lista.find(i=>!i.done&&!i.source&&same(i.name,name)&&i.u===u);if(x&&n!=null&&x.n!=null)x.n+=n;else S.lista.push({id:uid(),name,n,u,done:false,from});}
function syncShopping(source,entries){
 const rows=CookingCore.missing(entries,S.pantry),prev=S.lista.filter(x=>x.source===source);
 S.lista=S.lista.filter(x=>x.source!==source);
 rows.forEach(x=>{const old=prev.find(o=>same(o.name,x.name)&&o.u===x.u&&o.n===x.n);S.lista.push({...x,id:old?.id||uid(),done:old?.done||false,source,from:source==='plan'?'Plan completo':entries[0].recipe.name})});
 return rows.length;
}
function addMissing(r){return syncShopping('recipe:'+r.id,[{recipe:find(r.id),people:S.people}])}
const stat=i=>i.st==='unknown'?'<span class="pa">Confirma cantidad/unidad</span>':i.st==='ok'?'<span class="ok">Te alcanza</span>':i.st==='pa'?`<span class="pa">Faltan ${fmt(i.need-i.have,i.u)}</span>`:'<span class="no">Te falta</span>';
const pplBtns=(a='ppl')=>[1,2,3,4,5,6].map(n=>`<button type="button" aria-pressed="${n===S.people}" data-a="${a}" data-v="${n}">${n}</button>`).join('');
const storeBtns=()=>Object.entries(STORES).map(([k,[n]])=>`<button class="gh${S.store===k?' on':''}" data-a="store" data-v="${k}">${n}</button>`).join('');

function v1(){
  return `<h2>Tu despensa</h2><p class="sub">Escribe lo que tienes, con cantidad si la sabes: "2 huevos" o "200 g arroz".</p>
  <form class="add" onsubmit="return false"><input id="ing" placeholder="Ej: 3 tomates, 1 kg papa" aria-label="Ingrediente" autocomplete="off"><button type="button" data-a="addp">Agregar</button></form>
  <label class="cta" style="display:block;text-align:center;cursor:pointer">${S.fotoBusy?'Analizando foto…':'📷 Tomar foto de mis ingredientes'}<input type="file" id="foto" accept="image/jpeg,image/png,image/webp" capture="environment" hidden ${S.fotoBusy?'disabled':''}></label><label class="gh" style="display:block;text-align:center;margin-top:10px;cursor:pointer">Elegir foto de la galería<input type="file" id="fotoGaleria" accept="image/jpeg,image/png,image/webp" hidden ${S.fotoBusy?'disabled':''}></label>
  ${S.photoURL?`<img class="photo-preview" src="${S.photoURL}" alt="Foto que estás revisando">`:''}${S.photoMessage?`<p class="box" role="status">${esc(S.photoMessage)}</p>`:''}${S.det.length?`<div class="box"><p class="sm" style="margin:0 0 8px">Revisa la foto. Corrige nombres y cantidades; elimina cualquier objeto que no sea alimento:</p><div class="chips">${S.det.map((x,i)=>`<span class="detection"><input aria-label="Ingrediente detectado ${i+1}" data-det="${i}" value="${esc(x)}"><button type="button" aria-label="Quitar detección" data-a="rmd" data-v="${i}">×</button></span>`).join('')}</div><button class="cta roc" data-a="okd">Agregar a mi despensa</button></div>`:''}
  <div class="chips">${S.pantry.length?S.pantry.map((p,i)=>`<span class="chip">${esc(p.raw)}<button type="button" aria-label="Quitar ${esc(p.name)}" data-a="rmp" data-v="${i}">×</button></span>`).join(''):'<span class="sm">Aún no hay nada. Agrega tu primer ingrediente.</span>'}</div>
  <p class="sm" style="margin:0">¿Para cuántas personas?</p><div class="ppl">${pplBtns()}</div>
  <p class="sm" style="margin:6px 0">¿Dónde compras? (para estimar precios)</p><div class="row">${storeBtns()}</div>
  <button class="cta" data-a="go" data-v="2">Ver qué puedo cocinar</button>
  ${S.pantry.length?'<button class="gh" style="width:100%;margin-top:10px" data-a="clr">Vaciar despensa</button>':''}`;
}
function list(){
  const q=strip(S.q),qw=q.split(/[\s,]+/).filter(w=>w.length>2);
  let l=all().map(r=>score(r));
  if(q)l=l.filter(r=>strip(r.name).includes(q)||strip(r.pais).includes(q)||r.items.some(i=>same(i.name,q)));
  if(S.pais)l=l.filter(r=>r.pais===S.pais);
  if(S.lvl)l=l.filter(r=>r.lvl===S.lvl);
  if(S.chip==='listos')l=l.filter(r=>r.pct===100);
  if(S.chip==='casi')l=l.filter(r=>r.pct>=50&&r.pct<100);
  if(S.chip==='rapidos')l=l.filter(r=>mins(r)<=30);
  if(S.bud)l=l.filter(r=>r.cost<=S.budv);
  return l.sort((a,b)=>S.pantry.length?b.pct-a.pct||a.cost-b.cost:a.name.localeCompare(b.name));
}
function res(){
  const l=list(),ready=l.filter(r=>r.pct===100).length;
  if(!l.length)return '<div class="empty"><b>🤷</b>Ningún plato coincide. Cambia los filtros o agrega ingredientes.</div>';
  return `<p class="sm">${l.length} platos${S.pantry.length?' · '+ready+' listos para '+S.people+(S.people===1?' persona':' personas'):''}</p>`+l.slice(0,S.limit||24).map(r=>{
    const no=r.items.filter(i=>i.st!=='ok').map(i=>i.name),f=S.fav.includes(r.id);
    return `<article class="dish" tabindex="0" role="button" data-a="open" data-v="${r.id}" aria-label="Ver receta de ${esc(r.name)}">${dishImage(r,'em')}<div><div class="nm"><span>${esc(r.name)}</span>${S.pantry.length?`<span style="color:${col(r.pct)}">${r.pct}%</span>`:''}</div>${S.pantry.length?`<div class="bar"><i style="width:${r.pct}%;background:${col(r.pct)}"></i></div>`:''}<div class="sm">${esc(r.pais)}${r.time?' · '+esc(r.time):''} · subtotal orientativo ${money(r.cost)} · <b class="xp-mini">+${xpFor(r)} XP</b></div>${S.pantry.length?`<div class="sm ${no.length?'no':'ok'}">${no.length?'Te falta: '+esc(no.join(', ')):'Tienes todo'}</div>`:''}</div><button class="hb" data-a="fav" data-v="${r.id}" aria-label="Guardar receta">${f?'❤️':'🤍'}</button></article>`}).join('')+(l.length>(S.limit||24)?'<button class="cta" data-a="more">Mostrar más recetas</button>':'');
}
function v2(){
  const ps=[...new Set(all().map(r=>r.pais))];
  return `<h2>Platos para ti</h2><p class="sub">101 recetas de casa, del Perú y del mundo. Cada plato con su propia ilustración.</p>
  <button class="gh" style="width:100%;margin-bottom:8px" data-a="suggest" ${S.suggesting?'disabled':''}>${S.suggesting?'Buscando sugerencias…':'✨ Sugerir platos con mi despensa'}</button>
  <input class="fld" id="q" type="search" placeholder="Ej: pollo, México, huevo" value="${esc(S.q)}" aria-label="Buscar" autocomplete="off">
  <div class="row">${[['todos','Todos'],['listos','Listos'],['casi','Casi listos'],['rapidos','Rápidos']].map(([k,l])=>`<button class="gh${S.chip===k?' on':''}" data-a="chip" data-v="${k}">${l}</button>`).join('')}</div>
  <div class="row"><select data-a="pais" aria-label="País"><option value="">Todos los países</option>${ps.map(p=>`<option${p===S.pais?' selected':''}>${esc(p)}</option>`).join('')}</select><select data-a="lvl" aria-label="Dificultad"><option value="">Cualquier dificultad</option>${['Fácil','Media'].map(p=>`<option${p===S.lvl?' selected':''}>${p}</option>`).join('')}</select></div>
  <label class="sm" style="display:flex;gap:8px;align-items:center"><input type="checkbox" id="bud" ${S.bud?'checked':''}> Tope del subtotal conocido: <b id="bv">S/ ${S.budv}</b></label>
  <input type="range" id="br" min="5" max="80" value="${S.budv}" ${S.bud?'':'disabled'} aria-label="Presupuesto" style="width:100%;border:0;padding:6px 0;accent-color:var(--roc)">
  <div id="res" style="margin-top:6px">${res()}</div>`;
}
function v3(){
  const b=S.cur&&find(S.cur);
  if(!b)return '<div class="empty"><b>📖</b>Elige un plato para ver su receta.<button class="cta" data-a="go" data-v="2">Ver platos</button></div>';
  const r=score(b),f=S.fav.includes(r.id),vo=S.votes[r.id]||0,nt=S.notes[r.id];
  let p='';
  if(S.dtab==='ing')p=`<div class="top"><span class="sm">Para ${S.people} ${S.people===1?'persona':'personas'}</span><button class="gh" data-a="unit">${S.unit==='m'?'Métrico':'Imperial'}</button></div><div class="ppl">${pplBtns()}</div>
   <ul class="lst">${r.items.map(i=>`<li><span>${i.need!=null?'<b>'+fmt(i.need,i.u)+'</b> ':''}${esc(i.name)}</span>${stat(i)}</li>`).join('')}</ul>
   <button class="gh" style="width:100%" data-a="lmiss">🛒 Agregar faltantes a la lista de compras</button>`;
  else if(S.dtab==='pas')p=r.steps&&r.steps.length?`<p class="sm">Toca un paso para marcarlo como hecho.</p><ol class="st">${r.steps.map((s,i)=>`<li class="${S.done[i]?'dn':''}" data-a="sdone" data-v="${i}">${esc(s)}</li>`).join('')}</ol>`:'<p class="sm">Esta receta no tiene pasos.</p>';
  else p=`<div class="box"><h3>Compra con criterio</h3><p>Subtotal de ingredientes con precio de referencia: <b>${money(r.cost)}</b>.</p><p class="sm">No es el costo total: algunos ingredientes no tienen precio registrado. Los precios de ejemplo no son cotizaciones actuales. No se muestran calorías ni puntuaciones de salud sin una fuente nutricional validada.</p></div>`;
  return `<div class="top"><button class="gh" data-a="go" data-v="2">‹ Platos</button><span><button class="gh" data-a="fav" data-v="${r.id}">${f?'❤️ Guardada':'🤍 Guardar'}</button> <button class="gh" data-a="share" aria-label="Compartir">📤</button></span></div>
  ${dishImage(r,'big')}<p class="sm image-note">${lastPhoto(r.id)?'Tu foto de la última vez que lo cocinaste':'Ilustración del plato · cocínalo y tu foto aparecerá aquí'}</p>
  <h2>${esc(r.name)}</h2><p class="sm">${esc(r.pais)}${r.time?' · '+esc(r.time):''}${r.lvl?' · '+esc(r.lvl):''}</p>
  <div class="bar"><i style="width:${r.pct}%;background:${col(r.pct)}"></i></div><p class="sm" style="margin:0">Cubres el ${r.pct}% con tu despensa.</p><button class="duo-btn cook-cta" data-a="cook">▶ Iniciar receta <span class="xp-pill">+${xpFor(r)} XP</span></button>${cookedCount(r.id)?`<p class="sm cook-note">Cocinada ${cookedCount(r.id)} ${cookedCount(r.id)===1?'vez':'veces'}${cookedToday(r.id)?' · hoy ya no suma XP':''}</p>`:`<p class="sm cook-note">Primera vez: ganas ${xpBreakdown(r).bonus} XP de bonus</p>`}
  <div class="tabs">${[['ing','Ingredientes'],['pas','Pasos'],['sal','Información']].map(([k,l])=>`<button class="${S.dtab===k?'on':''}" data-a="dtab" data-v="${k}">${l}</button>`).join('')}</div>${p}
  <button class="cta nubi-action" data-a="chat">✦ Adaptar esta receta con Nubi</button><h3>Planificar</h3><div class="add"><input type="date" id="pd" value="${today()}" aria-label="Fecha"><button data-a="padd">Agregar al plan</button></div>
  <h3>Tu opinión</h3><div class="row"><button class="gh${vo===1?' on':''}" data-a="vote" data-v="1">👍 Me gustó</button><button class="gh${vo===-1?' on':''}" data-a="vote" data-v="-1">👎 No me gustó</button></div>
  <h3>Notas</h3>${nt?`<div class="box">${esc(nt)}</div><button class="gh" data-a="ndel">Borrar nota</button>`:`<textarea class="fld" id="nt" rows="2" placeholder="Ej: le puse menos sal" aria-label="Nota"></textarea><button class="cta" data-a="nsave">Guardar nota</button>`}
  <button class="cta roc" data-a="go" data-v="4">Ir a Mi cocina</button>`;
}
function v4(){
  const tabs=[['diario','Mi diario'],['fav','Guardadas'],['plan','Plan'],['lista','Lista'],['mias','Mías']];
  let p='';
  if(S.ksub==='diario'){p=diaryView()}else if(S.ksub==='fav'){
    const l=S.fav.map(find).filter(Boolean);
    p=l.length?l.map(r=>`<article class="dish" tabindex="0" role="button" data-a="open" data-v="${r.id}">${dishImage(r,'em')}<div class="nm"><span>${esc(r.name)}</span></div></article>`).join(''):'<div class="empty"><b>❤️</b>Aún no guardaste platos. Toca el corazón en cualquier plato.</div>';
  }else if(S.ksub==='plan'){
    const P=S.plan.filter(e=>find(e.id)).map(e=>({e,r:score(find(e.id),e.people)})).sort((a,b)=>a.e.date.localeCompare(b.e.date));
    p=P.length?`<div class="box grid"><div><b>${money(CookingCore.missing(S.plan.map(e=>({recipe:find(e.id),people:e.people})),S.pantry).reduce((a,x)=>a+cost(x.name,x.u,x.n),0))}</b><span class="sm">subtotal orientativo por comprar</span></div><div><b>${P.reduce((a,x)=>a+mins(x.r),0)} min</b><span class="sm">de cocina</span></div></div><button class="cta" style="margin:0 0 10px" data-a="lplan">🛒 Generar lista de compras</button>`+P.map(({e,r})=>`<div class="box top"><div class="t"><b>${esc(r.name)}</b><div class="sm">${e.people} ${e.people===1?'porción':'porciones'} · ${esc(fdate(e.date))}</div><input type="date" data-a="pdate" data-v="${e.uid}" value="${e.date}" aria-label="Fecha" style="margin-top:6px;padding:6px 8px"></div><button class="gh" data-a="pdel" data-v="${e.uid}" aria-label="Quitar del plan">🗑️</button></div>`).join(''):'<div class="empty"><b>📅</b>Nada planificado. Abre una receta y toca "Agregar al plan".</div>';
  }else if(S.ksub==='lista'){
    const op=S.lista.filter(x=>!x.done),dn=S.lista.filter(x=>x.done),tot=op.reduce((a,x)=>a+cost(x.name,x.u,x.n),0);
    const row=x=>`<div class="li${x.done?' dn':''}"><button class="ck${x.done?' on':''}" data-a="ltog" data-v="${x.id}" aria-label="Marcar">${x.done?'✓':''}</button><div class="t"><b>${esc(x.name)}</b><div class="sm">${esc([x.n!=null?fmt(x.n,x.u):'',x.from].filter(Boolean).join(' · '))}</div></div><button data-a="ldel" data-v="${x.id}" aria-label="Borrar">✕</button></div>`;
    p=`<div class="add"><input id="lin" placeholder="Agregar artículo (ej: 2 tomates)" aria-label="Artículo"><button data-a="ladd">Agregar</button></div><p class="sm">${op.length} por comprar · subtotal orientativo ${money(tot)} (precios incompletos)</p>${S.lista.length?op.map(row).join('')+dn.map(row).join(''):'<div class="empty"><b>🛒</b>Tu lista está vacía.</div>'}${dn.length?'<button class="cta" data-a="lpantry">Pasar lo comprado a mi despensa</button>':''}${S.lista.length?'<button class="gh" style="width:100%;margin-top:10px" data-a="lclr">Vaciar lista</button>':''}`;
  }else{
    p=`<div class="box"><input class="fld" id="rn" placeholder="Nombre del plato" aria-label="Nombre"><input class="fld" id="ri" placeholder="Ingredientes para 2: 2 huevos, 200 g arroz" aria-label="Ingredientes" style="margin-top:8px"><input class="fld" id="rs" placeholder="Pasos separados por punto y coma" aria-label="Pasos" style="margin-top:8px"><button class="cta roc" data-a="rsave">Guardar receta</button></div>${S.mine.map(r=>`<div class="top box"><span>${esc(r.name)}</span><span><button class="gh" data-a="open" data-v="${r.id}">Ver</button> <button class="gh" data-a="rdel" data-v="${r.id}">Borrar</button></span></div>`).join('')}`;
  }
  return `<h2>Mi cocina</h2><div class="row">${tabs.map(([k,l])=>`<button class="gh${S.ksub===k?' on':''}" data-a="ksub" data-v="${k}">${l}</button>`).join('')}</div>${p}<button class="cta" data-a="go" data-v="1">Volver a empezar</button>`;
}
const SKIN=['#fde0c8','#f3c4a0','#d9a07a','#b87a52','#8a5636','#5d3a24'],HC=['#2b1b14','#6b3f23','#c9822b','#e8c15a','#d9452f','#8a8a99','#7a3fb5','#2b7fd9'],TC=['#ffffff','#ff3d5a','#ffc531','#4cc38a','#2b7fd9','#8a4fd1','#2a2a33','#ff8a3d'],BG=['#ffd9a0','#ffc2d1','#bfe9ff','#d4f5c4','#e0cffc','#ffe9a8','#c9c9d6'];
const AVC=[['skin','Piel',SKIN],['hair','Peinado',['Corto','Largo','Rizado','Moño','Calvo']],['hc','Color de pelo',HC],['top','Ropa',['Chaqueta de chef','Delantal','Camiseta','Buzo']],['tc','Color de ropa',TC],['acc','Accesorio',['Ninguno','Gorro de chef','Gorra','Lentes','Pañuelo']],['ex','Expresión',['Sonrisa','Risa','Guiño']],['bgc','Fondo',BG]];
function avSVG(a,w){
 const sk=SKIN[a.skin],hc=HC[a.hc],tc=TC[a.tc],O='rgba(0,0,0,.2)',B='<path d="M36 240c0-44 30-68 64-68s64 24 64 68z" fill=';
 const back=a.hair===1?`<path d="M52 100c-8 58 2 80 18 86h60c16-6 26-28 18-86-2-42-30-62-48-62S54 58 52 100z" fill="${hc}"/>`:'';
 const body=[`${B}"${tc}"/><path d="M84 172l16 22 16-22" fill="#fff" stroke="${O}" stroke-width="2"/><g fill="${O}"><circle cx="92" cy="206" r="3"/><circle cx="108" cy="206" r="3"/><circle cx="92" cy="224" r="3"/><circle cx="108" cy="224" r="3"/></g>`,
 `${B}"#e9e4f0"/><path d="M74 184h52l10 56H64z" fill="${tc}" stroke="${O}" stroke-width="2"/><rect x="84" y="208" width="32" height="18" rx="4" fill="${O}"/>`,
 `${B}"${tc}"/><path d="M82 172q18 24 36 0z" fill="${sk}"/>`,
 `${B}"${tc}"/><ellipse cx="100" cy="176" rx="30" ry="12" fill="${O}"/><path d="M90 186v26M110 186v26" stroke="${O}" stroke-width="4" stroke-linecap="round"/>`][a.top];
 const eyeR=a.ex===2?'<path d="M111 103q5-6 10 0" stroke="#2a1a22" stroke-width="3" fill="none" stroke-linecap="round"/>':'<circle cx="116" cy="102" r="5.5" fill="#2a1a22"/><circle cx="118" cy="100" r="1.8" fill="#fff"/>';
 const mouth=a.ex===1?'<path d="M86 121q14 26 28 0z" fill="#7a1f2e"/><path d="M94 130q6 5 12 0" stroke="#ff7b8f" stroke-width="3" fill="none"/>':'<path d="M88 123q12 12 24 0" stroke="#2a1a22" stroke-width="3" fill="none" stroke-linecap="round"/>';
 const face=`<circle cx="56" cy="104" r="8" fill="${sk}"/><circle cx="144" cy="104" r="8" fill="${sk}"/><ellipse cx="100" cy="100" rx="45" ry="49" fill="${sk}"/><circle cx="84" cy="102" r="5.5" fill="#2a1a22"/><circle cx="86" cy="100" r="1.8" fill="#fff"/>${eyeR}<path d="M76 91q8-5 16 0M108 91q8-5 16 0" stroke="${O}" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="72" cy="117" r="7" fill="#ff6b8a" opacity=".35"/><circle cx="128" cy="117" r="7" fill="#ff6b8a" opacity=".35"/>${mouth}`;
 const cut=`<path d="M53 100C48 56 82 44 100 46c20-2 52 12 47 54-8-22-26-30-47-30S61 78 53 100z" fill="${hc}"/>`;
 const hair=[cut,cut,['60,80','78,62','100,56','122,62','140,80','54,98','146,98'].map(p=>{const[x,y]=p.split(',');return `<circle cx="${x}" cy="${y}" r="17" fill="${hc}"/>`}).join(''),cut+`<circle cx="100" cy="38" r="15" fill="${hc}"/>`,''][a.hair];
 const acc=['',`<g fill="#fff" stroke="${O}" stroke-width="2"><circle cx="72" cy="46" r="17"/><circle cx="100" cy="36" r="19"/><circle cx="128" cy="46" r="17"/><rect x="68" y="46" width="64" height="26" rx="4"/></g>`,'<path d="M54 80C54 38 146 38 146 80z" fill="#ff3d5a"/><ellipse cx="132" cy="80" rx="30" ry="6" fill="#c42a43"/>','<g fill="rgba(255,255,255,.3)" stroke="#2a1a22" stroke-width="3"><circle cx="84" cy="102" r="14"/><circle cx="116" cy="102" r="14"/></g><path d="M98 102h4" stroke="#2a1a22" stroke-width="3"/>','<path d="M54 86C70 60 130 60 146 86v8C130 80 70 80 54 94z" fill="#ff3d5a"/><g fill="#fff"><circle cx="76" cy="78" r="2.5"/><circle cx="100" cy="72" r="2.5"/><circle cx="124" cy="78" r="2.5"/></g>'][a.acc];
 return `<svg viewBox="0 0 200 240" width="${w}" role="img" aria-label="Tu avatar"><rect width="200" height="240" rx="30" fill="${BG[a.bgc]}"/>${back}<rect x="86" y="140" width="28" height="40" rx="10" fill="${sk}"/>${body}${face}${hair}${acc}</svg>`;
}
function v0(){return `<header class="brand"><span class="brand-mark">✦</span> Qué cocino hoy <span class="version">TU COCINA, CONTIGO</span></header>
<div class="home-hero"><div class="hero-copy"><span class="eyebrow">MENOS DUDAS, MÁS SABOR</span><h1>Algo rico empieza<br>con lo que tienes.</h1><p>Hola, ${esc(S.av.name)}. Tu próxima receta está más cerca de lo que imaginas.</p><button class="cta" data-a="go" data-v="1">Explorar mi despensa <span>→</span></button><button class="gh" data-a="go" data-v="2">Descubrir 101 recetas</button></div><div class="hero-food" role="img" aria-label="Comida peruana, imagen ilustrativa"></div></div>
<div class="nubi-welcome">${ghost()}<div><b>Soy Nubi, tu compañera de cocina.</b><p id="encourage">${encouragement()}</p><button class="text-button" data-a="chat">Conversemos sobre tu receta ↗</button></div><button class="gh" data-a="mute" aria-label="${S.muted?'Activar':'Pausar'} ánimos">${S.muted?'Activar':'Pausar'}</button></div>
${chefCard()}<div class="home-stats"><div><b>${all().length}</b><span>recetas para descubrir</span></div><div><b>${S.pantry.length}</b><span>ingredientes en casa</span></div><div><b>${S.game.log.length}</b><span>platos cocinados</span></div></div>
<div class="section-heading"><h2>¿Qué se te antoja?</h2><button class="text-button" data-a="go" data-v="2">Ver todos →</button></div><div class="featured">${['b2','b14','b7'].map(id=>find(id)).filter(Boolean).map(r=>`<button class="feature" data-a="open" data-v="${r.id}">${dishImage(r,'feature-photo')}<span>${esc(r.name)}</span><small>${esc(r.time)} · ${esc(r.pais)}</small></button>`).join('')}</div>
<details class="profile"><summary>Mi perfil y mi avatar</summary><div class="profile-avatar">${avSVG(S.av,100)}</div><label>¿Cómo te llamas?<input class="fld" id="an" maxlength="14" value="${esc(S.av.name)}"></label><button class="gh" data-a="avr">Avatar al azar</button>${AVC.map(([k,t,o])=>`<h3>${t}</h3><div class="row">${o.map((x,i)=>x[0]==='#'?`<button class="sw" style="background:${x}" aria-label="${t} ${i+1}" aria-pressed="${S.av[k]===i}" data-a="av" data-k="${k}" data-v="${i}"></button>`:`<button class="gh${S.av[k]===i?' on':''}" data-a="av" data-k="${k}" data-v="${i}">${x}</button>`).join('')}</div>`).join('')}</details><button class="gh" data-a="demo">Probar despensa de ejemplo</button><button class="gh" data-a="export">Exportar mis datos</button>`}
function render(){
 const profileOpen=document.querySelector('.profile')?.open;const views=[v0,v1,v2,v3,v4];$('s'+S.at).innerHTML=views[S.at]();if(profileOpen&&document.querySelector('.profile'))document.querySelector('.profile').open=true;
 document.documentElement.dataset.theme=S.theme;document.documentElement.dataset.nubiMuted=String(!!S.muted);$('t-d').classList.toggle('on',S.theme==='dark');$('t-l').classList.toggle('on',S.theme==='light');
 if(S.focus){const f=$(S.focus);if(f)f.focus();S.focus=null}
}
function go(n){if(!Number.isInteger(n)||n<0||n>4)return;S.at=n;document.querySelectorAll('.s').forEach((s,i)=>{s.classList.toggle('active',i===n);s.inert=i!==n;s.setAttribute('aria-hidden',String(i!==n))});document.querySelectorAll('nav button').forEach(b=>{b.classList.toggle('on',+b.dataset.n===n);b.setAttribute('aria-current',+b.dataset.n===n?'page':'false')});render();$('s'+n).scrollTop=0;}
function act(a,v,el){
  try { switch(a){
  case 'chat':openChat();return;
  case 'cook':startCook(S.cur);return;
  case 'pver':verifyPending(v);return;
  case 'pdrop':if(!confirm('¿Descartar este plato sin verificar?'))return;S.game.pending=S.game.pending.filter(x=>x.id!==v);break;
  case 'more':S.limit=(S.limit||24)+24;break;
  case 'export':exportData();return;
  case 'mute':S.muted=!S.muted;break;
  case 'go':go(+v);break;
  case 'av':S.av[el.dataset.k]=+v;break;
  case 'avr':AVC.forEach(([k,,o])=>S.av[k]=Math.floor(Math.random()*o.length));break;
  case 'theme':S.theme=S.theme==='dark'?'light':'dark';break;
  case 'demo':if(S.pantry.length&&!confirm('¿Reemplazar tu despensa por el ejemplo?'))return;S.pantry=['2 huevos','200 g arroz','3 tomates','1 cebolla','300 g papa','250 g carne'].map(parseP);go(1);break;
  case 'ppl':S.people=+v;break;
  case 'store':S.store=v;break;
  case 'addp':addPantry(($('ing')||{}).value||'');S.focus='ing';break;
  case 'rmp':S.pantry.splice(+v,1);break;
  case 'clr':if(!confirm('¿Vaciar la despensa?'))return;S.pantry=[];break;
  case 'rmd':S.det.splice(+v,1);break;
  case 'okd':{const parsed=S.det.map(parseP);if(parsed.some(p=>p.n==null)){toast('Indica cantidades reales: por ejemplo, 2 papas o 500 g papa.');return}parsed.forEach(p=>CookingCore.mergePantry(S.pantry,p));S.det=[];S.photoMessage='Ingredientes confirmados y guardados.';}toast('Agregado a tu despensa');break;
  case 'chip':S.limit=24;S.chip=v;break;
  case 'pais':S.limit=24;S.pais=el.value;break;
  case 'lvl':S.limit=24;S.lvl=el.value;break;
  case 'open':S.cur=v;S.dtab='ing';S.done={};go(3);break;
  case 'fav':{const id=v||S.cur,i=S.fav.indexOf(id);if(i>=0){S.fav.splice(i,1);toast('Quitada de guardadas')}else{S.fav.push(id);toast('Receta guardada')}break}
  case 'dtab':S.dtab=v;break;
  case 'sdone':S.done[v]=!S.done[v];break;
  case 'unit':S.unit=S.unit==='m'?'i':'m';break;
  case 'lmiss':{const c=addMissing(score(find(S.cur)));toast(c?c+' agregados a tu lista':'No te falta nada');break}
  case 'share':{const r=score(find(S.cur)),t=r.name+' ('+r.pais+')\n\nIngredientes:\n'+r.items.map(i=>'- '+(i.need!=null?fmt(i.need,i.u)+' ':'')+i.name).join('\n')+'\n\nPasos:\n'+(r.steps||[]).map((s,i)=>(i+1)+'. '+s).join('\n');
    if(navigator.share)navigator.share({title:r.name,text:t}).catch(()=>{});else if(navigator.clipboard)navigator.clipboard.writeText(t).then(()=>toast('Receta copiada')).catch(()=>toast('No se pudo copiar'));else toast('No se pudo compartir');break}
  case 'padd':{const d=($('pd')||{}).value||today();S.plan.push({uid:uid(),id:S.cur,date:d,people:S.people});S.ksub='plan';toast('Agregada al plan');break}
  case 'vote':S.votes[S.cur]=S.votes[S.cur]===+v?0:+v;break;
  case 'nsave':{const t=(($('nt')||{}).value||'').trim();if(t){S.notes[S.cur]=t;toast('Nota guardada')}break}
  case 'ndel':delete S.notes[S.cur];break;
  case 'ksub':S.ksub=v;break;
  case 'pdel':S.plan=S.plan.filter(e=>e.uid!==v);break;
  case 'pdate':{const e=S.plan.find(x=>x.uid===v);if(e&&el.value)e.date=el.value;break}
  case 'lplan':{const c=syncShopping('plan',S.plan.map(e=>({recipe:find(e.id),people:e.people})));S.ksub='lista';toast(c?'Lista recalculada sin duplicar':'No te falta nada');break}
  case 'ladd':{CookingCore.split(($('lin')||{value:''}).value).map(x=>x.trim()).filter(Boolean).forEach(t=>{const p=parseP(t);addList(p.name,p.n,p.u,'Agregado por ti')});S.focus='lin';break}
  case 'ltog':{const x=S.lista.find(i=>i.id===v);if(x)x.done=!x.done;break}
  case 'ldel':S.lista=S.lista.filter(i=>i.id!==v);break;
  case 'lclr':if(!confirm('¿Vaciar la lista?'))return;S.lista=[];break;
  case 'lpantry':{S.lista.filter(x=>x.done).forEach(x=>{addPantry(x.n==null?x.name:(x.u==='u'?x.n:x.n+' '+x.u)+' '+x.name)});S.lista=S.lista.filter(x=>!x.done);toast('Pasado a tu despensa');break}
  case 'rsave':{const n=($('rn').value||'').trim(),it=CookingCore.split($('ri').value).map(x=>x.trim()).filter(Boolean).map(parseP).map(p=>({name:p.name,n:p.n,u:p.u}));
    if(!n||!it.length){toast('Escribe nombre e ingredientes');return}
    S.mine.push({id:'m'+Date.now(),name:n,em:'🍲',pais:'Mi receta',time:'',lvl:'',serv:2,items:it,steps:$('rs').value.split(';').map(s=>s.trim()).filter(Boolean)});toast('Receta creada');break}
  case 'rdel':S.mine=S.mine.filter(r=>r.id!==v);S.fav=S.fav.filter(x=>x!==v);S.plan=S.plan.filter(e=>e.id!==v);if(S.cur===v)S.cur=null;break;
  }
  save();render();
  }catch(error){toast(error.message||'Revisa los datos introducidos.')}
}
document.addEventListener('click',e=>{const el=e.target.closest('[data-a]');if(!el||el.tagName==='SELECT'||el.type==='date')return;if(el.dataset.a==='suggest'){sugerirRecetas();return}act(el.dataset.a,el.dataset.v,el)});
document.addEventListener('change',e=>{const t=e.target;if(t.id==='bud'){S.bud=t.checked;$('br').disabled=!t.checked;$('res').innerHTML=res()}else if(t.dataset.a&&(t.tagName==='SELECT'||t.type==='date'))act(t.dataset.a,t.dataset.v,t)});
document.addEventListener('input',e=>{const t=e.target;if(t.id==='q'){S.limit=24;S.q=t.value;$('res').innerHTML=res()}else if(t.id==='br'){S.budv=+t.value;$('bv').textContent='S/ '+S.budv;$('res').innerHTML=res()}else if(t.id==='an'){S.av.name=t.value.trim().slice(0,14)||'Chef';save()}});
document.addEventListener('keydown',e=>{const t=e.target;
  if(e.key==='Enter'&&t.id==='ing'){e.preventDefault();act('addp')}
  else if(e.key==='Enter'&&t.id==='lin'){e.preventDefault();act('ladd')}
  else if((e.key==='Enter'||e.key===' ')&&t.getAttribute&&t.getAttribute('role')==='button'&&t.dataset.a){e.preventDefault();act(t.dataset.a,t.dataset.v,t)}});
function cfg(abrir){
  $('ov').classList.toggle('open',abrir);$('cfg').classList.toggle('open',abrir);
  $('cfg').setAttribute('aria-hidden',String(!abrir));
  (abrir?$('t-'+(S.theme==='dark'?'d':'l')):$('th')).focus({preventScroll:true});
  document.querySelector('.phone').scrollLeft=0;
}
$('th').onclick=()=>cfg(true);
$('ov').onclick=()=>cfg(false);
$('cfgx').onclick=()=>cfg(false);
$('t-d').onclick=()=>{if(S.theme!=='dark')act('theme')};
$('t-l').onclick=()=>{if(S.theme!=='light')act('theme')};
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&$('cfg').classList.contains('open'))cfg(false)});
document.querySelector('nav').onclick=e=>{const b=e.target.closest('button');if(b)go(+b.dataset.n)};
function saludar(intentos){
  intentos=intentos||0;
  var ai=window.AppInventor;
  var valor=ai&&typeof ai.getWebViewString==="function"?ai.getWebViewString():"";
  if(typeof valor!=="string"||!valor.trim()){
    if(ai&&intentos<10)setTimeout(function(){saludar(intentos+1)},500);
    return;
  }
  var nombre=valor.trim().slice(0,14);
  nombre=nombre.charAt(0).toUpperCase()+nombre.slice(1);
  if(S.av.name===nombre)return;
  S.av.name=nombre;save();render();
}
function reducir(file,max=1400){return new Promise((ok,mal)=>{if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>15*1024*1024)return mal(new Error('Usa JPG, PNG o WebP de hasta 15 MB.'));const img=new Image(),url=URL.createObjectURL(file);img.onload=()=>{try{if(img.width*img.height>40000000)throw new Error('La imagen es demasiado grande.');const scale=Math.min(1,max/Math.max(img.width,img.height)),canvas=document.createElement('canvas');canvas.width=Math.round(img.width*scale);canvas.height=Math.round(img.height*scale);canvas.getContext('2d').drawImage(img,0,0,canvas.width,canvas.height);ok(canvas.toDataURL('image/jpeg',.88).split(',')[1])}catch(e){mal(e)}finally{URL.revokeObjectURL(url)}};img.onerror=()=>{URL.revokeObjectURL(url);mal(new Error('No se pudo leer la imagen.'))};img.src=url})}
async function analizarFoto(file){if(S.fotoBusy)return;S.fotoBusy=true;S.det=[];S.photoMessage='Revisando si hay alimentos y verificando las detecciones…';if(S.photoURL)URL.revokeObjectURL(S.photoURL);S.photoURL=URL.createObjectURL(file);render();try{const imagen=await reducir(file);const r=await fetch(API+'/ingredientes',{signal:AbortSignal.timeout(80000),method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({imagen,mimeType:'image/jpeg'})});const d=await r.json();if(!r.ok)throw new Error(d.error||'No se pudo analizar la foto.');if(!Array.isArray(d.items))throw new Error('Respuesta de imagen inválida.');S.det=d.items.map(x=>x.name);S.photoMessage=d.message;}catch(e){S.photoMessage=e.name==='TimeoutError'?'La revisión tardó demasiado. Prueba nuevamente.':e.message;}finally{S.fotoBusy=false;render()}}
document.addEventListener('change',e=>{if(['foto','fotoGaleria'].includes(e.target.id)&&e.target.files?.[0])analizarFoto(e.target.files[0])});
document.addEventListener('input',e=>{if(e.target.dataset.det!=null)S.det[+e.target.dataset.det]=e.target.value});

// Version 3 additions: local-first catalogue, contextual assistant and companion.
const baseExtras={b1:'aceite:15ml,sal:2g',b2:'sillao:20ml,vinagre:10ml,aceite:30ml,sal:2g',b3:'aceite:15ml,ajo:2,sal:2g',b4:'sillao:20ml,aceite:15ml',b5:'cilantro:10g,aji amarillo:10g,sal:2g',b6:'aceite:15ml,limon:1,cilantro:10g,comino:1g,sal:2g',b7:'aceite:15ml,sal:2g',b8:'sal:2g',b9:'mantequilla:15g',b10:'aceite:100ml,mayonesa:30g,ketchup:30g,sal:2g'};
Object.entries(baseExtras).forEach(([id,ing])=>find(id).items.push(...ing.split(',').map(mkI)));
find('b4').items[0]={name:'arroz cocido',n:300,u:'g'};
find('b4').steps[0]='Usa arroz cocido enfriado rápidamente y conservado en refrigeración. No uses arroz que haya pasado horas a temperatura ambiente.';
find('b5').steps[0]='Usa pescado apto para consumo crudo con tratamiento de congelación adecuado, adquirido de proveedor confiable, y mantenlo refrigerado. El limón no elimina los parásitos ni sustituye la cocción. Si no puedes verificarlo, elige pescado sudado.';
find('b5').steps.splice(1,0,'Hierve el camote 20 minutos o hasta que esté tierno.');
find('b6').steps[1]='Dora las tiras de pollo hasta que estén completamente cocidas en el centro, ajustando el tiempo al grosor.';
S.preferences=L.preferences||{time:30,budget:20,notes:''};S.chat=Array.isArray(L.chat)?L.chat.filter(x=>['user','assistant','error'].includes(x.role)&&typeof x.text==='string').slice(-30):[];S.muted=!!L.muted;
S.limit=24;
const ghost=()=>`<svg class="nubi" viewBox="0 0 120 128" role="img" aria-label="Nubi, fantasmita cocinera"><ellipse cx="60" cy="117" rx="31" ry="6" fill="#264d3b" opacity=".12"/><g class="float"><path d="M24 69C24 20 96 20 96 69v35q-9 12-18 0-9 15-18 0-9 15-18 0-9 12-18 0Z" fill="#fffdf7" stroke="#d8d9cf" stroke-width="2"/><path d="M38 38v-9c-13-12 2-28 14-20 8-15 29-8 27 4 19-2 24 21 9 25Z" fill="#fff" stroke="#d8d9cf" stroke-width="2"/><path d="M38 38h50" stroke="#df8a66" stroke-width="5"/><ellipse cx="47" cy="67" rx="4" ry="6" fill="#254c40"/><ellipse cx="74" cy="67" rx="4" ry="6" fill="#254c40"/><path d="M53 80q8 9 16 0" fill="none" stroke="#254c40" stroke-width="3" stroke-linecap="round"/><ellipse cx="36" cy="79" rx="7" ry="4" fill="#efb4a3"/><ellipse cx="85" cy="79" rx="7" ry="4" fill="#efb4a3"/><path d="m49 95 12 8 12-8" fill="#dc7957"/></g></svg>`;
function encouragement(){if(S.muted)return 'Aquí estaré cuando quieras conversar.';if(S.pantry.length)return '¡Vamos paso a paso! Con tu despensa ya podemos buscar algo rico.';return 'No necesitas una cocina perfecta para preparar algo rico. ¡Empecemos con un ingrediente!'}
function category(r){if(r.category)return r.category;return({b1:'desayuno',b2:'carne',b3:'pasta',b4:'arroz',b5:'ensalada',b6:'pollo',b7:'pasta',b8:'ensalada',b9:'desayuno',b10:'carne'})[r.id]||'vegetales'}
function exportData(){const blob=new Blob([JSON.stringify({...ld(),exportedAt:new Date().toISOString()},null,2)],{type:'application/json'});const u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download='mi-cocina-respaldo.json';a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);toast('Copia de datos preparada')}
async function openChat(){const r=S.cur&&S.at===3?find(S.cur):null;S.chatRecipe=r||null;$('chat-context').textContent=r?`Conversamos sobre: ${r.name} · ${S.people} personas`:`Cocina libre · ${S.people} personas · ${S.pantry.length} ingredientes`;$('pref-time').value=S.preferences.time;$('pref-budget').value=S.preferences.budget;$('pref-notes').value=S.preferences.notes;$('chat-dialog').showModal();renderChat();$('chat-input').focus();try{const response=await fetch(API+'/api/health',{signal:AbortSignal.timeout(5000)});const status=await response.json();$('ai-status').textContent=status.aiConfigured?'IA conectada · lista para ayudarte':'IA pendiente de activar'}catch{$('ai-status').textContent='Sin conexión al servidor de IA'}}
function offlineTip(message){const r=S.chatRecipe;const m=strip(message);let advice='Puedo mostrarte una orientación local; el chat de IA no está disponible en este momento. ';if(/econom|gast|barat/.test(m))advice+='Para reducir gastos, revisa primero los ingredientes de tu despensa y compara los platos con mayor porcentaje disponible. No puedo calcular precios actuales.';else if(/tiempo|rap|simplif/.test(m))advice+='Abre Platos y activa «Rápidos» para ver recetas de hasta 30 minutos. No acortes los tiempos necesarios de cocción de carnes.';else if(r){const missing=score(r).items.filter(i=>i.st!=='ok').map(i=>i.name);advice+=`En ${r.name}, revisa: ${missing.join(', ')||'las cantidades de tu despensa'}. Las sustituciones dependen de la función del ingrediente; no las aplicaré automáticamente.`}else advice+='Agrega cantidades en la despensa y abre una receta. Puedo ayudarte a ver qué falta.';return advice}
// Nubi interactive chat: follow-up chips, action buttons (confirmed by the user) and retry.
const cleanReply=t=>String(t).replace(/\*\*(.+?)\*\*/g,'$1').replace(/^#{1,6}\s*/gm,'').replace(/^\s*[*•]\s+/gm,'• ').trim();
function catalogSummary(){return all().map(r=>`${r.id}|${r.name}|${r.pais||''}|${r.time||''}|${(r.items||[]).filter(i=>!['sal','aceite'].includes(i.name)).map(i=>i.name).join(',')}`).join('\n').slice(0,14000)}
const DEFAULT_CHIPS=[['¿Qué cocino hoy con lo que tengo?','¿Qué cocino hoy?'],['Quiero algo peruano y rápido','Algo peruano y rápido'],['¿Cómo adapto esta receta si me falta un ingrediente?','Me falta algo'],['¿Cómo preparo una versión más económica?','Gastar menos']];
function chatButton(label,cls,onClick){const b=document.createElement('button');b.type='button';b.className=cls;b.textContent=label;b.disabled=!!S.chatBusy;b.onclick=onClick;return b}
function runChatAction(a){
  try{
    if(a.tipo==='abrir_receta'){const r=find(a.receta_id);if(!r){toast('No encontré esa receta en la app');return}$('chat-dialog').close();act('open',r.id);return}
    if(a.tipo==='buscar'){$('chat-dialog').close();S.q=a.texto||'';S.chip='todos';S.pais='';S.lvl='';S.limit=24;go(2);return}
    const items=(a.items||[]).filter(Boolean);if(!items.length)return;
    if(a.tipo==='agregar_compras'){if(!confirm('¿Agregar a tu lista de compras?\n\n'+items.join('\n')))return;items.forEach(t=>{const p=parseP(t);addList(p.name,p.n,p.u,'Sugerido por Nubi')});save();toast(items.length+' artículos en tu lista');return}
    if(a.tipo==='agregar_despensa'){if(!confirm('¿Agregar a tu despensa?\n\n'+items.join('\n')))return;items.forEach(t=>CookingCore.mergePantry(S.pantry,parseP(t)));save();render();toast('Despensa actualizada');return}
  }catch(e){toast(e.message||'No se pudo aplicar esa acción')}
}
function renderChat(){
  const log=$('chat-log');log.replaceChildren();
  if(!S.chat.length){const p=document.createElement('p');p.className='bubble assistant';p.textContent='¡Hola! Soy Nubi 👻 Cuéntame qué tienes en casa, qué se te antoja o cuánto tiempo tienes, y buscamos algo rico juntos. También puedo abrirte recetas o armar tu lista de compras.';log.append(p)}
  const lastAssistant=S.chat.map(x=>x.role).lastIndexOf('assistant');
  S.chat.forEach((entry,i)=>{
    const p=document.createElement('p');p.className='bubble '+entry.role;p.textContent=entry.role==='assistant'?cleanReply(entry.text):entry.text;log.append(p);
    if(entry.role==='assistant'&&Array.isArray(entry.acciones)&&entry.acciones.length){const row=document.createElement('div');row.className='chat-actions';entry.acciones.forEach(a=>{if(a.tipo==='abrir_receta'&&!find(a.receta_id))return;const icon={abrir_receta:'📖 ',agregar_compras:'🛒 ',agregar_despensa:'🧺 ',buscar:'🔎 '}[a.tipo]||'';row.append(chatButton(icon+a.etiqueta,'chat-action',()=>runChatAction(a)))});if(row.children.length)log.append(row)}
    if(entry.role==='error'&&i===S.chat.length-1&&entry.retry){const row=document.createElement('div');row.className='chat-actions';row.append(chatButton('↻ Reintentar','chat-action',()=>{S.chat.pop();const last=S.chat.pop();sendChat(last?.text||entry.retry)}));log.append(row)}
  });
  if(S.chatBusy){const p=document.createElement('p');p.className='bubble assistant typing';p.setAttribute('aria-label','Nubi está escribiendo');p.innerHTML='<span></span><span></span><span></span>';log.append(p)}
  // Follow-up chips come from Nubi's last answer; otherwise show starters.
  const box=document.querySelector('.chat-suggestions');box.replaceChildren();
  const dyn=lastAssistant>=0&&lastAssistant===S.chat.length-1&&Array.isArray(S.chat[lastAssistant].sugerencias)?S.chat[lastAssistant].sugerencias:[];
  const chips=dyn.length?dyn.map(s=>[s,s]):DEFAULT_CHIPS.filter(([q])=>S.chatRecipe||!/esta receta/.test(q)).slice(0,3);
  chips.forEach(([q,l])=>box.append(chatButton(l,'',()=>sendChat(q))));
  log.scrollTop=log.scrollHeight;$('chat-send').disabled=!!S.chatBusy;$('chat-input').disabled=!!S.chatBusy;
}
async function sendChat(message){
  message=String(message||'').trim();if(!message||S.chatBusy)return;
  S.preferences={time:Math.min(300,Math.max(5,Number($('pref-time').value)||30)),budget:Math.min(1000,Math.max(1,Number($('pref-budget').value)||20)),notes:$('pref-notes').value.slice(0,500)};
  const history=S.chat.filter(x=>x.role!=='error').slice(-8).map(x=>({role:x.role,text:String(x.text).slice(0,3000)}));
  S.chat.push({role:'user',text:message});S.chatBusy=true;$('chat-input').value='';renderChat();
  const r=S.chatRecipe;
  const recipe=r?{id:r.id,nombre:r.name,pais:r.pais,tiempo:r.time,porciones_base:r.serv,ingredientes:r.items.map(i=>(i.n!=null?i.n+' '+i.u+' ':'')+i.name),pasos:r.steps}:null;
  try{
    const response=await fetch(API+'/chat',{signal:AbortSignal.timeout(85000),method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message,history,context:{receta_abierta:recipe,despensa:S.pantry.map(p=>p.raw||p.name),personas:S.people,preferencias:S.preferences},catalogo:catalogSummary(),catalogIds:all().map(x=>x.id)})});
    let data;try{data=await response.json()}catch{throw new Error('El servidor respondió sin datos (código '+response.status+').')}
    if(!response.ok)throw new Error(data.error||'No se pudo consultar a Nubi.');
    if(typeof data.reply!=='string')throw new Error('Respuesta no válida.');
    S.chat.push({role:'assistant',text:data.reply,sugerencias:Array.isArray(data.sugerencias)?data.sugerencias:[],acciones:Array.isArray(data.acciones)?data.acciones:[]});
  }catch(error){
    S.chat.push({role:'error',retry:message,text:(error.name==='TimeoutError'?'La consulta tardó demasiado.':error.message)+'\n\nOrientación local (sin IA): '+offlineTip(message)});
  }finally{S.chat=S.chat.slice(-30);S.chatBusy=false;save();renderChat();$('chat-input').focus()}
}
$('chat-form').addEventListener('submit',e=>{e.preventDefault();sendChat($('chat-input').value)});
$('chat-input').addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendChat($('chat-input').value)}});
$('chat-reset').onclick=()=>{if(S.chatBusy||!S.chat.length)return;if(!confirm('¿Empezar una conversación nueva?'))return;S.chat=[];save();renderChat()};
$('nubi-fab').onclick=openChat;$('chat-close').onclick=()=>$('chat-dialog').close();document.querySelector('.mini-ghost').innerHTML=ghost();
document.addEventListener('input',e=>{if(e.target.id==='q')S.limit=24});
// Keep the existing App Inventor name bridge. Load the app URL in WebViewer.

// ===== Imágenes por plato =====
// The 3x3 photo only shows 9 specific dishes: use it only for those exact recipes.
// Every catalog recipe (b1–b101) has its own illustration in assets/dish-<id>.webp.
const HAS_ART=id=>/^b([1-9]|[1-9]\d|10[01])$/.test(String(id));
const EXACT_PHOTO={b2:'0% 0%',b14:'50% 0%',b3:'100% 0%',b7:'100% 0%',b34:'0% 50%',b55:'50% 50%',b43:'100% 50%',b96:'0% 100%',b63:'50% 100%',b19:'100% 100%'};
const CAT_COL={carne:['#c75b3c','#7c2d1b'],arroz:['#e9b949','#a6701a'],pasta:['#e5743f','#a03c1b'],sopa:['#dc9b3b','#8d5a16'],ensalada:['#74b35f','#2f6c34'],pollo:['#e39b40','#9b5916'],desayuno:['#f0c35a','#b37d14'],postre:['#dc8eaa','#8f4462'],vegetales:['#6caa76','#2e5f3a']};
const EMOJI_RULES=[[/^pan con|sandwich/,'🥪'],[/tostadas/,'🍞'],[/panqueque/,'🥞'],[/taco|fajita/,'🌮'],[/burrito/,'🌯'],[/quesadilla/,'🧀'],[/hamburguesa/,'🍔'],[/salchipapa/,'🍟'],[/arroz con leche|mazamorra|quinua con leche/,'🍮'],[/compota/,'🍎'],[/platano/,'🍌'],[/avena|yogur/,'🥣'],[/pasta|tallarin|fideo/,'🍝'],[/guacamole/,'🥑'],[/ceviche|pescado|atun/,'🐟'],[/tortilla|shakshuka|huevo/,'🍳'],[/gazpacho/,'🍅'],[/sopa|caldo|crema|chupe|aguadito|menestron|locro/,'🍲'],[/curry/,'🍛'],[/hummus|garbanzo|lenteja|frejol|frijol|tacu/,'🫘'],[/huancaina|ocopa|papa|yuca|pure/,'🥔'],[/ensalada|solterito|causa/,'🥗'],[/arroz|chaufa|risotto/,'🍚'],[/pollo|gallina|cau cau/,'🍗'],[/lomo|bistec|seco|adobo|olluquito|albondiga|saltado|carne|res/,'🥩'],[/humita|choclo/,'🌽'],[/zapallito|acelga|vainita|verdura/,'🥬']];
function dishEmoji(r){const n=strip(r.name||'');const hit=EMOJI_RULES.find(([re])=>re.test(n));return hit?hit[1]:'🍲'}
function dishImage(r,cls){
  const own=lastPhoto(r.id);
  if(own)return `<div class="food-photo own ${cls}" style="background-image:url(${own});background-size:cover;background-position:center" role="img" aria-label="Tu foto de ${esc(r.name)}"><span class="own-tag">📸 Tu plato</span></div>`;
  if(HAS_ART(r.id))return `<div class="food-photo ${cls}" style="background-image:url(assets/dish-${r.id}.webp);background-size:cover;background-position:center" role="img" aria-label="Ilustración de ${esc(r.name)}"></div>`;
  const [a,b]=CAT_COL[category(r)]||CAT_COL.vegetales;
  return `<div class="dish-art ${cls}" style="--a:${a};--b:${b}" role="img" aria-label="Ilustración de ${esc(r.name)}"><span class="plate"><span>${dishEmoji(r)}</span></span></div>`;
}

// ===== XP y niveles =====
S.game=Object.assign({xp:0,log:[],pending:[],hashes:[],streak:{last:'',count:0}},L.game||{});
const TITLES=[[1,'Aprendiz'],[3,'Ayudante de cocina'],[5,'Cocinero casero'],[8,'Chef de partida'],[12,'Sous chef'],[16,'Chef ejecutivo'],[20,'Gran chef'],[30,'Leyenda de la cocina']];
const r5=x=>Math.max(5,Math.round(x/5)*5);
// XP needed to go from `level` to `level+1`: grows ~30% per level plus a linear term.
const xpToNext=level=>Math.round((80*Math.pow(1.3,level-1)+20*(level-1))/10)*10;
function levelInfo(xp=S.game.xp){let level=1,rest=xp;while(rest>=xpToNext(level)){rest-=xpToNext(level);level++}const need=xpToNext(level);return{level,into:rest,need,pct:Math.min(100,Math.round(rest/need*100)),title:TITLES.filter(([l])=>level>=l).at(-1)[1],xp}}
function recipeXP(r){const base=r.lvl==='Media'?70:r.lvl==='Difícil'?100:45;return r5(base+Math.min(mins(r),90)/2+(r.steps?.length||0)*5)}
const cookedCount=id=>S.game.log.filter(x=>x.recipeId===id).length;
const cookedToday=id=>S.game.log.some(x=>x.recipeId===id&&x.date===today());
function xpBreakdown(r){if(cookedToday(r.id))return{base:0,bonus:0,total:0,reason:'Ya cocinaste este plato hoy'};const base=recipeXP(r),bonus=cookedCount(r.id)?0:r5(base*.5);return{base,bonus,total:base+bonus,reason:bonus?'¡Primera vez!':''}}
const xpFor=r=>xpBreakdown(r).total;
function lastPhoto(id){for(let i=S.game.log.length-1;i>=0;i--){const e=S.game.log[i];if(e.recipeId===id&&e.photo)return e.photo}return null}
function yesterday(){const d=new Date();d.setDate(d.getDate()-1);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
function streakNow(){const s=S.game.streak;return s.last===today()||s.last===yesterday()?s.count:0}
function chefCard(){const L1=levelInfo(),s=streakNow();return `<section class="chef-card" aria-label="Tu nivel de chef"><div class="lvl-badge"><small>NIVEL</small><b>${L1.level}</b></div><div class="chef-main"><div class="chef-top"><b>${esc(L1.title)}</b><span class="streak${s?' on':''}" title="Días seguidos cocinando">🔥 ${s}</span></div><div class="xpbar" role="progressbar" aria-valuemin="0" aria-valuemax="${L1.need}" aria-valuenow="${L1.into}"><i style="width:${L1.pct}%"></i></div><small>${L1.into} / ${L1.need} XP para nivel ${L1.level+1} · ${S.game.log.length} platos cocinados</small></div></section>`}
function grantXP(entry){
  const before=levelInfo();S.game.xp+=entry.xp;const after=levelInfo();
  const st=S.game.streak;if(st.last!==today()){st.count=st.last===yesterday()?st.count+1:1;st.last=today()}
  S.game.log.push(entry);if(entry.hash)S.game.hashes=[...S.game.hashes,entry.hash].slice(-200);
  // Keep localStorage small: only the latest 25 photos are kept.
  let photos=0;for(let i=S.game.log.length-1;i>=0;i--){if(S.game.log[i].photo&&++photos>25)delete S.game.log[i].photo}
  save();return{before,after,leveled:after.level>before.level}
}

// ===== Modo cocina (estilo Duolingo) =====
let CK=null;
const CHEERS=['¡Vas muy bien!','Paso a paso se llega lejos.','¡Huele delicioso desde aquí!','Tómate tu tiempo, la cocina no es carrera.','¡Eso es! Sigue así.','Tú puedes, chef.','¡Qué buena mano tienes!'];
const MOODS=[['feliz','😄','Feliz'],['orgulloso','💪','Orgulloso/a'],['relajado','😌','Relajado/a'],['me-costo','😅','Me costó'],['cansado','😴','Cansado/a'],['frustrado','😤','Frustrado/a']];
const MOOD_REPLY={feliz:'¡Me encanta verte feliz cocinando! 💛',orgulloso:'¡Y con razón! Lo hiciste tú.',relajado:'Cocinar también es una forma de descansar.',['me-costo']:'Lo difícil de hoy es lo fácil de mañana. ¡Cada vez te saldrá mejor!',cansado:'Mereces disfrutar ese plato con calma.',frustrado:'Respira: cocinar es práctica. La próxima vez te ayudo con los pasos difíciles.'};
function beep(f=880,d=.12){try{const a=beep.ctx||(beep.ctx=new (window.AudioContext||window.webkitAudioContext)());const o=a.createOscillator(),g=a.createGain();o.frequency.value=f;g.gain.value=.05;o.connect(g);g.connect(a.destination);o.start();o.stop(a.currentTime+d)}catch{}}
const buzz=ms=>{try{navigator.vibrate?.(ms)}catch{}};
function stepMinutes(t){const m=String(t).match(/(\d+)(?:\s*(?:a|-)\s*(\d+))?\s*min/i);return m?Math.min(240,+(m[2]||m[1])):0}
function startCook(id){const r=find(id);if(!r)return;if(!r.steps?.length){toast('Esta receta no tiene pasos');return}CK={id,phase:'prep',step:0,checked:{},rating:0,mood:'',note:'',verify:null,cheer:0};openCook()}
function openCook(){$('cook').hidden=false;renderCook();$('cook').focus()}
function closeCook(force){if(!force&&CK&&['step','photo','check'].includes(CK.phase)&&!confirm('¿Salir de la receta? Perderás el progreso de esta sesión.'))return;CK=null;$('cook').hidden=true;render()}
function ckProgress(r){const n=r.steps.length+2;const p={prep:0,step:CK.step+1,photo:n-1,check:n,reward:n}[CK.phase]??0;return Math.round(p/n*100)}
function timerChip(){const t=S.timer;if(!t)return '';const m=Math.floor(t.left/60),s=t.left%60;return `<button class="ck-timer${t.left<=0?' done':''}" data-c="tstop" aria-label="Detener temporizador">⏱ <span id="ck-tleft">${m}:${String(s).padStart(2,'0')}</span></button>`}
function startTimer(min){clearInterval(S.timer?.id);S.timer={left:min*60,id:setInterval(()=>{if(!S.timer)return;S.timer.left--;const el=$('ck-tleft');if(S.timer.left<=0){clearInterval(S.timer.id);beep(988,.25);setTimeout(()=>beep(1318,.35),300);buzz([300,150,300]);toast('⏰ ¡Tiempo cumplido!');if(el)el.textContent='¡Listo!';$('cook').querySelector('.ck-timer')?.classList.add('done');return}if(el)el.textContent=Math.floor(S.timer.left/60)+':'+String(S.timer.left%60).padStart(2,'0')},1000)};renderCook()}
function renderCook(){
  const el=$('cook');if(!CK){el.hidden=true;return}
  const r=find(CK.id);if(!r){closeCook(true);return}
  const sc=score(r),n=r.steps.length,xb=xpBreakdown(r);
  const head=CK.phase==='reward'?'':`<header class="ck-head"><button class="ck-x" data-c="close" aria-label="Salir del modo cocina">✕</button><div class="ck-prog" role="progressbar" aria-valuenow="${ckProgress(r)}" aria-valuemin="0" aria-valuemax="100"><i style="width:${ckProgress(r)}%"></i></div>${timerChip()}<span class="ck-xp">+${xb.total} XP</span></header>`;
  let body='',foot='';
  if(CK.phase==='prep'){
    const all=sc.items.length,ok=sc.items.filter((_,i)=>CK.checked[i]).length;
    body=`<div class="ck-body"><p class="ck-kicker">ANTES DE EMPEZAR</p><h2 class="ck-title">${esc(r.name)}</h2><p class="ck-sub">Para ${S.people} ${S.people===1?'persona':'personas'} · ${esc(r.time||'')} · ${n} pasos. Toca cada ingrediente cuando lo tengas listo.</p><ul class="ck-ings">${sc.items.map((i,k)=>`<li><button class="ck-ing${CK.checked[k]?' on':''}" data-c="ing" data-v="${k}" aria-pressed="${!!CK.checked[k]}"><span class="ck-box">${CK.checked[k]?'✓':''}</span><span>${i.need!=null?'<b>'+fmt(i.need,i.u)+'</b> ':''}${esc(i.name)}</span></button></li>`).join('')}</ul></div>`;
    foot=`<button class="duo-btn" data-c="begin">${ok===all?'¡Todo listo, a cocinar!':'Empezar a cocinar'}</button>`;
  }else if(CK.phase==='step'){
    const t=r.steps[CK.step],min=stepMinutes(t),last=CK.step===n-1;
    body=`<div class="ck-body ck-step" key="${CK.step}"><p class="ck-kicker">PASO ${CK.step+1} DE ${n}</p><p class="ck-text">${esc(t)}</p>${min&&!S.timer?`<button class="ck-tbtn" data-c="timer" data-v="${min}">⏱ Iniciar temporizador de ${min} min</button>`:''}<div class="ck-nubi">${ghost()}<p class="ck-bubble">${CK.step===0?'¡Empecemos! Lee el paso con calma y avísame cuando termines.':last?'¡Último paso! Ya casi lo tienes.':CHEERS[(CK.step+CK.cheer)%CHEERS.length]}</p></div></div>`;
    foot=`${CK.step>0?'<button class="ck-back" data-c="prev">‹ Paso anterior</button>':''}<button class="duo-btn" data-c="next">${last?'¡Terminé mi plato! 📸':'✓ Listo, siguiente paso'}</button>`;
  }else if(CK.phase==='photo'){
    body=`<div class="ck-body ck-center"><div class="ck-cam">📸</div><h2 class="ck-title">¡Muéstrale tu plato a Nubi!</h2><p class="ck-sub">Toma una foto de tu ${esc(r.name)} servido. Nubi la revisará para darte tus <b>+${xb.total} XP</b>.${xb.reason?` <span class="ck-tag">${esc(xb.reason)}</span>`:''}</p><p class="sm">Consejo: buena luz, plato completo y sin pantallas ni fotos de internet.</p></div>`;
    foot=`<label class="duo-btn">📷 Abrir cámara<input type="file" id="ck-cam" accept="image/*" capture="environment" hidden></label><label class="ck-back ck-gal">Elegir de la galería<input type="file" id="ck-gal" accept="image/jpeg,image/png,image/webp" hidden></label>`;
  }else if(CK.phase==='check'){
    const v=CK.verify||{};
    const status=v.state==='loading'?`<div class="ck-verify loading"><span class="spin"></span>Nubi está mirando tu plato…</div>`:v.state==='ok'?`<div class="ck-verify ok">✅ <div><b>¡Nubi reconoce tu ${esc(r.name)}!</b><p>${esc(v.comment||'')}</p></div></div>`:v.state==='no'?`<div class="ck-verify no">🤔 <div><b>No coincide con la receta</b><p>${esc(v.comment||'')}</p><button class="ck-small" data-c="retake">Tomar otra foto</button></div></div>`:v.state==='error'?`<div class="ck-verify err">⚠️ <div><b>No pude verificar ahora</b><p>${esc(v.comment||'')}</p><button class="ck-small" data-c="reverify">Reintentar</button> <button class="ck-small" data-c="later">Guardar y verificar después</button></div></div>`:'';
    body=`<div class="ck-body"><img class="ck-photo" src="${CK.photo.thumb}" alt="Foto de tu plato">${status}<h3 class="ck-q">¿Qué te pareció?</h3><div class="ck-stars" role="radiogroup" aria-label="Calificación">${[1,2,3,4,5].map(k=>`<button role="radio" aria-checked="${CK.rating===k}" aria-label="${k} estrellas" class="${k<=CK.rating?'on':''}" data-c="star" data-v="${k}">★</button>`).join('')}</div><h3 class="ck-q">¿Cómo te sentiste?</h3><div class="ck-moods">${MOODS.map(([k,e,l])=>`<button class="${CK.mood===k?'on':''}" aria-pressed="${CK.mood===k}" data-c="mood" data-v="${k}"><span>${e}</span>${l}</button>`).join('')}</div><textarea id="ck-note" class="fld" rows="2" maxlength="300" placeholder="Nota opcional: qué cambiarías la próxima vez…">${esc(CK.note)}</textarea></div>`;
    const ready=v.state==='ok'&&CK.rating&&CK.mood;
    foot=`<button class="duo-btn" data-c="claim" ${ready?'':'disabled'}>${v.state!=='ok'?'Esperando a Nubi…':!CK.rating||!CK.mood?'Cuéntame cómo te fue':xb.total?`Reclamar +${xb.total} XP`:'Guardar en mi diario'}</button>`;
  }else if(CK.phase==='reward'){
    const R=CK.result;
    body=`<div class="ck-body ck-center ck-reward"><div class="confetti" aria-hidden="true">${Array.from({length:36},(_,i)=>`<i style="left:${(i*97)%100}%;background:${['#58cc02','#ffc800','#ff4b4b','#1cb0f6','#ce82ff'][i%5]};animation-delay:${(i%9)*.12}s"></i>`).join('')}</div><img class="ck-rphoto" src="${R.photo}" alt="Tu plato"><h2 class="ck-title">¡Plato completado!</h2><p class="ck-sub">${esc(R.recipeName)}</p><div class="ck-gain"><b id="ck-count">+0</b><span>XP</span></div>${R.bonus?`<p class="ck-tag">Incluye +${R.bonus} XP de bonus por primera vez</p>`:''}${R.gained===0?'<p class="sm">Ya habías cocinado este plato hoy: se guardó en tu diario sin XP extra.</p>':''}<div class="ck-lvl"><span>Nivel ${R.after.level}</span><div class="xpbar big"><i id="ck-bar" style="width:${R.leveled?0:R.before.pct}%"></i></div><small>${R.after.into} / ${R.after.need} XP para nivel ${R.after.level+1}</small></div>${R.leveled?`<div class="ck-levelup">🎉 ¡Subiste a nivel ${R.after.level}! <b>${esc(R.after.title)}</b></div>`:''}<p class="ck-streak">🔥 Racha: ${streakNow()} ${streakNow()===1?'día':'días'}</p><div class="ck-nubi">${ghost()}<p class="ck-bubble">${esc(MOOD_REPLY[R.mood]||'¡Qué rico se ve!')}${R.comment?' '+esc(R.comment):''}</p></div></div>`;
    foot=`<button class="duo-btn" data-c="done">Continuar</button>`;
  }
  const key=CK.phase+':'+CK.step,anim=key!==renderCook.last;renderCook.last=key;
  if(anim)body=body.replace('class="ck-body','class="anim ck-body');
  el.innerHTML=head+body+`<footer class="ck-foot">${foot}</footer>`;
  if(CK.phase==='reward')animateReward();
}
function animateReward(){const R=CK.result,c=$('ck-count'),bar=$('ck-bar');if(!c)return;const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;const t0=performance.now(),dur=reduce?1:1100;const tick=t=>{const k=Math.min(1,(t-t0)/dur);c.textContent='+'+Math.round(R.gained*k);if(k<1)requestAnimationFrame(tick)};requestAnimationFrame(tick);setTimeout(()=>{if(bar)bar.style.width=R.after.pct+'%'},reduce?0:250);beep(784,.12);setTimeout(()=>beep(988,.12),130);setTimeout(()=>beep(1318,.25),260);buzz(60)}
function loadImg(src){return new Promise((ok,mal)=>{const i=new Image();i.onload=()=>ok(i);i.onerror=()=>mal(new Error('No se pudo leer la imagen.'));i.src=src})}
function hashStr(s){let h=2166136261;for(let i=0;i<s.length;i+=7){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return (h>>>0).toString(36)+s.length.toString(36)}
async function dishPhoto(file){const full=await reducir(file,1024);const img=await loadImg('data:image/jpeg;base64,'+full);const sc=Math.min(1,480/Math.max(img.width,img.height)),c=document.createElement('canvas');c.width=Math.round(img.width*sc);c.height=Math.round(img.height*sc);c.getContext('2d').drawImage(img,0,0,c.width,c.height);return{full,thumb:c.toDataURL('image/jpeg',.74),hash:hashStr(full)}}
async function verifyDish(recipe,base64){
  const res=await fetch(API+'/verificar-plato',{signal:AbortSignal.timeout(85000),method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({imagen:base64,mimeType:'image/jpeg',receta:{nombre:recipe.name,ingredientes:recipe.items.map(i=>i.name).filter(x=>!['sal','aceite'].includes(x)).slice(0,20)}})});
  let d;try{d=await res.json()}catch{throw new Error('El servidor no respondió correctamente.')}
  if(!res.ok)throw new Error(d.error||'No se pudo verificar la foto.');return d;
}
async function runVerify(){
  const r=find(CK.id);CK.verify={state:'loading'};renderCook();
  if(S.game.hashes.includes(CK.photo.hash)){CK.verify={state:'no',comment:'Esta foto ya se usó antes. Toma una foto nueva de tu plato.'};renderCook();return}
  try{const d=await verifyDish(r,CK.photo.full);if(!CK)return;CK.verify=d.verificado?{state:'ok',comment:d.comentario}:{state:'no',comment:(d.comentario||'')+(d.plato_detectado?` (Veo: ${d.plato_detectado}.)`:'')};if(d.verificado){beep(1046,.15);buzz(40)}}
  catch(e){if(!CK)return;CK.verify={state:'error',comment:e.name==='TimeoutError'?'La revisión tardó demasiado.':e.message}}
  renderCook();
}
function finishClaim(recipeId,photo,hash,rating,mood,note,comment){
  const r=find(recipeId),xb=xpBreakdown(r);
  const g=grantXP({id:uid(),recipeId,name:r.name,date:today(),at:Date.now(),xp:xb.total,rating,mood,note,photo,hash,comment});
  S.votes[recipeId]=rating>=4?1:rating<=2?-1:0;save();
  CK={id:recipeId,phase:'reward',result:{gained:xb.total,bonus:xb.bonus,recipeName:r.name,photo,mood,comment,...g}};openCook();
}
async function verifyPending(pid){
  const p=S.game.pending.find(x=>x.id===pid),r=p&&find(p.recipeId);if(!r)return;
  toast('Nubi está revisando tu foto…');
  try{const d=await verifyDish(r,p.photo.split(',')[1]);
    if(!d.verificado){toast('Nubi no reconoce el plato en esa foto');S.game.pending=S.game.pending.filter(x=>x.id!==pid);save();render();return}
    S.game.pending=S.game.pending.filter(x=>x.id!==pid);finishClaim(p.recipeId,p.photo,p.hash,p.rating,p.mood,p.note,d.comentario);
  }catch(e){toast(e.message||'No se pudo verificar todavía')}
}
function cookAct(c,v){
  if(!CK)return;const r=find(CK.id);
  switch(c){
    case 'close':closeCook();return;
    case 'ing':CK.checked[v]=!CK.checked[v];if(CK.checked[v])beep(660,.05);break;
    case 'begin':CK.phase='step';CK.step=0;CK.cheer=Math.floor(Math.random()*CHEERS.length);break;
    case 'prev':CK.step=Math.max(0,CK.step-1);break;
    case 'next':beep(880,.08);buzz(25);if(CK.step<r.steps.length-1)CK.step++;else CK.phase='photo';break;
    case 'timer':startTimer(+v);return;
    case 'tstop':clearInterval(S.timer?.id);S.timer=null;break;
    case 'retake':CK.phase='photo';CK.verify=null;break;
    case 'reverify':runVerify();return;
    case 'star':CK.rating=+v;break;
    case 'mood':CK.mood=v;break;
    case 'later':{if(S.game.pending.length>=5){toast('Ya tienes 5 platos por verificar. Verifica alguno primero.');return}S.game.pending.push({id:uid(),recipeId:CK.id,date:today(),photo:CK.photo.thumb,hash:CK.photo.hash,rating:CK.rating,mood:CK.mood,note:CK.note});save();CK=null;$('cook').hidden=true;S.ksub='diario';go(4);toast('Guardado. Verifícalo desde «Mi diario» cuando Nubi esté disponible.');return}
    case 'claim':{if(CK.verify?.state!=='ok'||!CK.rating||!CK.mood)return;finishClaim(CK.id,CK.photo.thumb,CK.photo.hash,CK.rating,CK.mood,CK.note,CK.verify.comment);return}
    case 'done':CK=null;$('cook').hidden=true;S.ksub='diario';go(4);return;
  }
  renderCook();
}
$('cook').addEventListener('click',e=>{const b=e.target.closest('[data-c]');if(b&&!b.disabled)cookAct(b.dataset.c,b.dataset.v)});
$('cook').addEventListener('input',e=>{if(e.target.id==='ck-note'&&CK)CK.note=e.target.value.slice(0,300)});
$('cook').addEventListener('change',async e=>{if(!['ck-cam','ck-gal'].includes(e.target.id)||!e.target.files?.[0]||!CK)return;try{CK.photo=await dishPhoto(e.target.files[0]);CK.phase='check';runVerify()}catch(err){toast(err.message||'No se pudo usar esa foto')}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&CK&&!$('cook').hidden){e.preventDefault();closeCook()}});
function diaryView(){
  const pend=S.game.pending.map(p=>{const r=find(p.recipeId);return `<div class="diary pending"><img src="${p.photo}" alt=""><div class="t"><b>${esc(r?.name||'Receta')}</b><div class="sm">${esc(fdate(p.date))} · por verificar</div><button class="gh" data-a="pver" data-v="${p.id}">✓ Verificar ahora</button> <button class="gh" data-a="pdrop" data-v="${p.id}" aria-label="Descartar">🗑️</button></div></div>`}).join('');
  const log=[...S.game.log].reverse().map(x=>{const m=MOODS.find(([k])=>k===x.mood);return `<div class="diary">${x.photo?`<img src="${x.photo}" alt="Foto de ${esc(x.name)}">`:'<div class="diary-ph">🍽️</div>'}<div class="t"><b>${esc(x.name)}</b><div class="sm">${esc(fdate(x.date))} · <span class="stars">${'★'.repeat(x.rating||0)}${'☆'.repeat(5-(x.rating||0))}</span> · ${m?m[1]+' '+m[2]:''}</div>${x.note?`<div class="sm">“${esc(x.note)}”</div>`:''}</div><span class="xp-pill">+${x.xp} XP</span></div>`}).join('');
  return chefCard()+pend+(log||(!pend?'<div class="empty"><b>👩‍🍳</b>Aún no cocinaste ningún plato. Abre una receta y toca «Iniciar receta» para ganar tu primera XP.</div>':''));
}

go(0);saludar();
if('serviceWorker' in navigator&&location.protocol!=='file:')navigator.serviceWorker.register('/sw.js').catch(()=>{});

// Keep keyboard focus inside the settings overlay.
document.addEventListener('keydown',e=>{if(e.key!=='Tab'||!$('cfg').classList.contains('open'))return;const nodes=[...$('cfg').querySelectorAll('button,input,select,textarea')].filter(x=>!x.disabled);const first=nodes[0],last=nodes.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}});

// ===== Instalar la app (PWA) y descarga del APK =====
let installEvt=null;
const standalone=()=>matchMedia('(display-mode: standalone)').matches||navigator.standalone===true||!!window.AppInventor;
function updateInstallBox(){
  const box=$('install-box');if(!box)return;
  if(standalone()){box.hidden=true;return}
  $('btn-install').hidden=!installEvt;
  const ios=/iphone|ipad|ipod/i.test(navigator.userAgent);
  $('install-hint').textContent=installEvt?'':ios?'En iPhone: toca Compartir y luego «Agregar a pantalla de inicio».':'Desde Chrome: menú ⋮ → «Instalar aplicación» o «Agregar a pantalla principal».';
}
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installEvt=e;updateInstallBox()});
window.addEventListener('appinstalled',()=>{installEvt=null;toast('¡Nubi quedó instalada! 🎉');updateInstallBox()});
$('btn-install').onclick=async()=>{if(!installEvt)return;installEvt.prompt();try{await installEvt.userChoice}catch{}installEvt=null;updateInstallBox()};
if(location.protocol!=='file:')fetch('/descargas/nubi.apk',{method:'HEAD'}).then(r=>{if(r.ok&&!standalone())$('btn-apk').hidden=false}).catch(()=>{});
updateInstallBox();
