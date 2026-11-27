/* Alola packing list — net weight exactly like the costs statement (Al-Ola Station SupplyCost.quote, 1.4.9) — Amir t419u:
   الوزن القائم = صافي ميزان البسكول (the mandatory field)
   الخصم = Σ (كراتين كل صنف × نوع عبوة × وزن العبوة الفاضية، مقرّب لـ 0.1) + عدد الباليتات × 20 كجم مستلزمات (خشب + زوايا + كلبس + شنمر)
   الوزن الصافي = القائم − الخصم ؛ والصافي بيتوزع على الباليتات بنسبة (الكراتين × وزن الكرتونة) زي سطور بيان التكلفة.
   Empty weights: ONE editable table (item × packaging, «كل الأصناف» = '*'), same values as Station 1.4.9 «الأوزان الفاضية» (approved by Amir t412u/t413u). */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;root.PLTare=api})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const ALL='*',KEY='alola_packing_tares',PALLET_NAME='بالتات خشبية وزوايا وكلبس وشنمر',PALLET_KG=20;
/* defaults = Station 1.4.9 tare table (أوزان المهمات + GradeCore EMPTY_KG, approved t412u; jumbo 0.65 / plastic 8 ك 0.35 t413u) */
const DEFAULTS=[
 {v:ALL,c:'أوبن توب 7 ك',kg:0.35,src:'المحطة 1.4.9 — معتمد أمير (t412u)'},
 {v:ALL,c:'مقفول صغير 7 ك',kg:0.45,src:'المحطة 1.4.9 — معتمد أمير (t412u)'},
 {v:ALL,c:'مقفول 14 ك',kg:0.8,src:'المحطة 1.4.9 — معتمد أمير (t412u)'},
 {v:ALL,c:'مقفول 15 ك',kg:0.85,src:'المحطة 1.4.9 — معتمد أمير (t412u)'},
 {v:ALL,c:'كرتون مقفول 8 ك',kg:0.45,src:'المحطة 1.4.9 — معتمد أمير (t412u)'},
 {v:ALL,c:'كرتون مقفول 14 ك',kg:0.8,src:'المحطة 1.4.9 — معتمد أمير (t412u)'},
 {v:ALL,c:'صندوق بلاستيك 8 ك',kg:0.35,src:'أمير 26/11 (t413u): صندوق 8 ك فاضي 350 جرام'},
 {v:ALL,c:'جامبو بلاستيك 15 ك',kg:0.65,src:'أمير 26/11 (t413u): صندوق الجامبو فاضي 650 جرام'}
];
const norm=s=>String(s==null?'':s).replace(/[أإآ]/g,'ا').replace(/ة/g,'ه').replace(/ى/g,'ي').toLowerCase().replace(/\s+/g,'');
const tnorm=s=>norm(String(s==null?'':s).replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d)).replace(/كيلو|كجم|كغ/g,'ك'));
function tareNum(v){if(v==null||v==='')return null;const x=Number(String(v).replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d)).replace('٫','.').replace(',','.'));return isFinite(x)&&x>=0?x:null}
/* same rounding helpers as SupplyCost */
function round1(v){return Math.round((Number(v)+Number.EPSILON)*10)/10}
function mul1(count,unit){const u=Math.round(Number(unit)*1000);return Math.round((Number(count)*u)/100)/10}
function add1(vals){return vals.reduce((a,v)=>a+Math.round(Number(v)*10),0)/10}
const unitKg=c=>{const m=String(c||'').replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d)).match(/(\d+(?:\.\d+)?)\s*(?:ك|كجم|kg)/i);return m?parseFloat(m[1]):0};
function fresh(){return {v:1,rows:DEFAULTS.map(r=>Object.assign({},r)),pallet:PALLET_KG}}
function clean(T){T=T&&typeof T==='object'?T:fresh();if(!Array.isArray(T.rows))T.rows=fresh().rows;const p=tareNum(T.pallet);T.pallet=p==null?PALLET_KG:p;return T}
/* item row wins, then «كل الأصناف»; unknown → known:false (blocks the PDF, never a silent 0) */
function lookup(T,variety,ctype){const R=clean(T).rows,c=tnorm(ctype),v=tnorm(variety);
 let hit=v?R.find(r=>r&&r.v!==ALL&&tnorm(r.v)===v&&tnorm(r.c)===c&&tareNum(r.kg)!=null):null;if(hit)return {kg:tareNum(hit.kg),known:true,src:'item',row:hit};
 hit=R.find(r=>r&&r.v===ALL&&tnorm(r.c)===c&&tareNum(r.kg)!=null);if(hit)return {kg:tareNum(hit.kg),known:true,src:'all',row:hit};
 return {kg:0,known:false,src:'none',row:null}}
/* rows: [{P|p, v, c, n}] ; scale: kg (gross) or 0/null */
function calc(rows,scale,T){T=clean(T);const g={},seen=new Set(),R=(rows||[]).map(r=>{const n=parseInt(r.n,10)||0;const P=String(r.P||r.p||'');if(P)seen.add(P);return {r,n,P,fruit:n*unitKg(r.c)}});
 R.forEach(x=>{const variety=x.r.v||'',ctype=x.r.c||'';const k=variety+'|'+ctype;if(!g[k])g[k]={key:k,variety,ctype,cartons:0,fruit:0};g[k].cartons+=x.n;g[k].fruit+=x.fruit});
 const lines=Object.values(g).map(l=>{const L=lookup(T,l.variety,l.ctype);return Object.assign(l,{unit:L.kg,known:L.known,src:L.src,packWeight:mul1(l.cartons,L.kg)})});
 const palletCount=seen.size||R.length,palletUnit=T.pallet,palletWeight=mul1(palletCount,palletUnit);
 const cartonTare=add1(lines.map(l=>l.packWeight)),tare=add1([cartonTare,palletWeight]);
 const unknown=[...new Set(lines.filter(l=>l.cartons&&!l.known).map(l=>l.ctype||'—'))];
 const sc=Number(scale);const gross=isFinite(sc)&&sc>0?round1(sc):null;const net=gross==null?null:round1(gross-tare);
 const fruitSum=R.reduce((a,x)=>a+x.fruit,0),cSum=R.reduce((a,x)=>a+x.n,0);
 /* per pallet: share of the net by (cartons × carton kg) like the statement's lines; cartons when no carton kg; drift on the last pallet */
 const per=new Array(R.length).fill(null);
 if(net!=null&&R.length){const w=x=>fruitSum?x.fruit:x.n,W=fruitSum||cSum;if(W){R.forEach((x,i)=>{per[i]=round1(net*w(x)/W)});const drift=round1(net-add1(per));let j=R.length-1;while(j>0&&!w(R[j]))j--;per[j]=round1(per[j]+drift)}}
 /* tare lines for the printed box: one row per packaging (+ item when an item row was used) */
 const box=new Map();lines.filter(l=>l.cartons).forEach(l=>{const k=tnorm(l.ctype)+'|'+(l.src==='item'?tnorm(l.variety):'');const o=box.get(k)||{c:l.ctype,v:l.src==='item'?l.variety:'',unit:l.unit,known:l.known,cartons:0,weight:0};o.cartons+=l.cartons;o.weight=add1([o.weight,l.packWeight]);box.set(k,o)});
 return {lines,box:[...box.values()],palletCount,palletUnit,palletWeight,cartonTare,tare,gross,net,per,unknown,ready:gross!=null&&!unknown.length&&net>0,fruitSum:round1(fruitSum),cartons:cSum,bad:gross!=null&&!(net>0)}}
function load(ls){let T=null;try{T=JSON.parse((ls||globalThis.localStorage).getItem(KEY))}catch(e){}return clean(T)}
function save(T,ls){try{(ls||globalThis.localStorage).setItem(KEY,JSON.stringify(clean(T)));return true}catch(e){return false}}
/* add a row if that item × packaging isn't there yet */
function addRow(T,r){T=clean(T);const v=r.v||ALL;if(T.rows.some(x=>(x.v||ALL)===v&&tnorm(x.c)===tnorm(r.c)))return false;T.rows.push({v,c:String(r.c||'').trim(),kg:r.kg===''||r.kg==null?'':tareNum(r.kg),src:r.src||'أُضيف من الباكينج ليست',at:new Date().toISOString()});return true}
return {ALL,KEY,PALLET_NAME,PALLET_KG,DEFAULTS,norm,tnorm,tareNum,round1,mul1,add1,unitKg,fresh,clean,lookup,calc,load,save,addRow}});
