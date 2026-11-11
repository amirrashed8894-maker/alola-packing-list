/* Alola packing list — one-page A4 PDF on Alola letterhead.
   Embedded import data (read by Al-Ola Station 1.3.0 pdf-import.js):
   PDF Keywords + invisible text on page 1 = ALOLADATA1:<base64 utf-8 JSON {v:1,app:'alola',kind:'load',rows}>:<crc32> */
(function(){
const e=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const nf=(x,d=0)=>Number(Math.round((Number(x)||0)*10**d)/10**d).toLocaleString('en-US',{maximumFractionDigits:d});
const VORDER=['أبو سرة','صيفي','موركيت كيني','موركيت إسباني','ليمون'];
const vRank=v=>{const i=VORDER.indexOf(v);return i<0?50:i};
const sRank=s=>{const n=parseFloat(s);return isNaN(n)?9999:n};
const unitKg=c=>{const m=String(c||'').replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d)).match(/(\d+(?:\.\d+)?)\s*(?:ك|كجم|kg)/i);return m?parseFloat(m[1]):0};
function parts(iso){const m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(iso||'');if(!m)return{iso:iso||'—',dmy:iso||'—',slash:iso||'—'};return{iso,dmy:m[3]+'-'+m[2]+'-'+m[1],slash:m[3]+' / '+m[2]+' / '+m[1]}}
const K=x=>`calc(var(--k)*${x}px)`;
const CSS=`@font-face{font-family:Cairo;font-weight:200 1000;src:url(fonts/cairo-arabic.woff2) format('woff2');unicode-range:U+0600-06FF,U+0750-077F,U+FB50-FDFF,U+FE70-FEFF,U+200C-200E}
@font-face{font-family:Cairo;font-weight:200 1000;src:url(fonts/cairo-latin.woff2) format('woff2')}
#plstage{position:fixed;left:-10000px;top:0}
#plstage .page{--k:1;width:794px;height:1123px;background:#fff;color:#1c241c;font-family:Cairo,Tahoma,Arial,sans-serif;direction:rtl;position:relative;overflow:hidden;box-sizing:border-box}
#plstage .mast{display:flex;align-items:center;justify-content:space-between;padding:12px 22px 8px;min-height:78px;box-sizing:border-box}
#plstage .mast .nm{font-size:18px;font-weight:800;color:#1f8a12;line-height:1.25}
#plstage .mast .sub{font-size:11px;color:#3e6434;font-weight:600;margin-top:1px;direction:ltr;text-align:right}
#plstage .mast img{height:62px;width:auto;display:block}
#plstage .rule1{height:6px;background:#1f8a12}#plstage .rulegap{height:3px}#plstage .rule2{height:2px;background:#16700c}
#plstage .body{box-sizing:border-box;padding:${K(8)} 18px 0;}
#plstage .meta{display:flex;justify-content:space-between;align-items:flex-end;gap:12px;margin:2px;font-size:${K(12)}}
#plstage .meta b{font-weight:800}#plstage .edt b{border-bottom:2px solid #1f8a12;padding:0 8px 1px}
#plstage .ttl{display:flex;justify-content:space-between;align-items:flex-end;margin:${K(5)} 2px ${K(7)}}
#plstage .tt h1{margin:0;font-size:${K(22)};line-height:1.15;color:#1f8a12;font-weight:800}
#plstage .tt .en{direction:ltr;text-align:right;font-size:${K(8.5)};letter-spacing:.4px;color:#1f8a12;font-weight:700;margin-top:1px}
#plstage .pill{border:1.5px solid #1f8a12;color:#1f8a12;border-radius:999px;padding:${K(3)} 12px;font-weight:800;font-size:${K(12)};white-space:nowrap}
#plstage .inf{display:grid;grid-template-columns:repeat(4,1fr);border:1px solid #d5ddd4;border-radius:8px;overflow:hidden;margin-bottom:${K(7)}}
#plstage .inf>div{padding:${K(4)} 8px ${K(3)};border-left:1px solid #e3ece2;border-bottom:1px solid #e3ece2;display:flex;justify-content:space-between;align-items:baseline;gap:6px}
#plstage .inf>div:nth-child(4n){border-left:0}
#plstage .inf small{color:#6a7b68;font-size:${K(9.5)};white-space:nowrap}#plstage .inf b{font-size:${K(12)};font-weight:800;text-align:left}
#plstage .k{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin:0 0 ${K(6)}}
#plstage .k>div{background:#f3f8f1;border:1px solid #c9e2c4;border-radius:10px;padding:${K(4)} 8px;text-align:center}
#plstage .k small{display:block;color:#245c28;font-size:${K(10.5)};font-weight:800}
#plstage .k b{display:block;font-size:${K(22)};color:#16700c;font-weight:800;line-height:1.15}
#plstage h4{display:flex;align-items:baseline;gap:6px;font-size:${K(12.5)};margin:${K(6)} 0 ${K(3)};color:#16331a;font-weight:800}
#plstage h4 i{width:8px;height:8px;background:#1f8a12;display:inline-block;flex:none}
#plstage h4 small{font-weight:600;color:#66786a;font-size:${K(9.5)}}
#plstage table{width:100%;border-collapse:collapse;font-size:${K(10.5)};margin:0 0 3px}
#plstage th{background:#1f8a12;color:#fff;padding:${K(3)} 4px;font-weight:700;border:1px solid #18740f;text-align:center}
#plstage td{border:1px solid #d5e6d1;padding:${K(2)} 4px;text-align:center;line-height:1.35}
#plstage td.v{font-weight:800;color:#16331a;background:#fbfdfb}
#plstage td.r{text-align:right}
#plstage tr.sub td{background:#eaf5e6;font-weight:800;color:#1b4d1f}
#plstage tr.gt td{background:#1f8a12;color:#fff;font-weight:800;border-color:#18740f}
#plstage .pns{display:grid;grid-template-columns:1fr 1fr;gap:0 6px}#plstage .pn{border:1px solid #d5e6d1;border-radius:8px;padding:${K(3)} 8px;margin-bottom:${K(3)};background:#fbfdfb}
#plstage .pn .h{font-size:${K(10.5)};font-weight:800;color:#16331a;display:flex;justify-content:space-between;gap:8px}
#plstage .pn .h span{color:#4b5f4a;font-weight:700}
#plstage .pn .ids{direction:ltr;text-align:left;font-size:${K(10)};line-height:1.5;color:#1c241c;font-weight:700;word-spacing:2px}
#plstage .pn .ids span{display:inline-block;white-space:nowrap;margin-right:8px}#plstage .pn .ids em{font-style:normal;color:#222;font-weight:700;font-size:${K(9)};background:#ececec;border-radius:3px;padding:0 4px;margin-inline-start:2px}
#plstage .note{font-size:${K(9)};color:#5c735b;margin:${K(2)} 2px}
#plstage .sg{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;margin-top:${K(14)};padding:0 8px;font-size:${K(11)};text-align:center}
#plstage .sg div{border-top:1.5px solid #9fb59c;padding-top:4px;color:#2d3b2c;font-weight:700}
#plstage .foot{position:absolute;left:0;right:0;bottom:0;background:#fff}
#plstage .pmeta{display:grid;grid-template-columns:1fr auto 1fr;gap:8px;align-items:center;padding:4px 14px 5px;font-size:9px;color:#243024}
#plstage .pmeta span:nth-child(1){justify-self:start}#plstage .pmeta span:nth-child(2){text-align:center}#plstage .pmeta span:nth-child(3){justify-self:end}
#plstage .co{background:#1f8a12;color:#fff;min-height:84px;box-sizing:border-box;display:flex;flex-direction:column;justify-content:center;padding:8px 16px;font-size:9.5px;line-height:1.45}
#plstage .co .r{display:flex;justify-content:space-between;gap:12px;align-items:center}#plstage .co .ln{height:1px;background:rgba(255,255,255,.8);margin:4px 0}
#plstage .dep{display:flex;align-items:center;gap:6px;font-size:9.5px;color:#4b5f4a;margin-top:6px}#plstage .dep img{height:20px}`;
function mast(){return `<div class="mast"><div><div class="nm">شركة العلا لفرز الحاصلات الزراعية</div><div class="sub">Al Ola for Agricultural Crops Sorting</div></div><img src="alola_logo_green.png" alt=""></div><div class="rule1"></div><div class="rulegap"></div><div class="rule2"></div>`}
function foot(h,dt){return `<div class="foot"><div class="pmeta"><span dir="ltr">${e(h.ref||'')}</span><span>باكينج ليست — ${e(h.cont||'')} — <span dir="ltr">${e(dt.dmy)}</span></span><span>صفحة 1 من 1</span></div><div class="co"><div class="r"><span>العنوان: قطعة رقم ٢٠٦ ورقم ٢٠٨ - حوض البطن رقم ٥ - ترسا - طوخ - قليوبية</span><span dir="ltr">E-mail: alola.co2023@gmail.com</span></div><div class="ln"></div><div class="r"><span dir="ltr">Tel: 013/2604937 | Fax: 013/2604938</span><span>ب.ض 206232 · س.ت 798-899-781</span></div></div></div>`}
// groups: variety -> size -> {pallets[], cartons, kg, ctypes}
function analyse(rows){const R=rows.map(r=>({...r,_n:parseInt(r.n,10)||0,_kg:(parseInt(r.n,10)||0)*unitKg(r.c)}));const V=new Map();
 R.forEach(r=>{const v=r.v||'غير محدد';if(!V.has(v))V.set(v,new Map());const S=V.get(v);const s=String(r.s||'—');if(!S.has(s))S.set(s,{s,rows:[],n:0,kg:0,ct:new Map()});const g=S.get(s);g.rows.push(r);g.n+=r._n;g.kg+=r._kg;const ck=[r.c,r.b].filter(Boolean).join(' · ');g.ct.set(ck,(g.ct.get(ck)||0)+1)});
 const list=[...V.entries()].map(([v,S])=>({v,sizes:[...S.values()].sort((a,b)=>sRank(a.s)-sRank(b.s)||String(a.s).localeCompare(String(b.s)))})).sort((a,b)=>vRank(a.v)-vRank(b.v)||a.v.localeCompare(b.v,'ar'));
 list.forEach(g=>{g.p=g.sizes.reduce((a,x)=>a+x.rows.length,0);g.n=g.sizes.reduce((a,x)=>a+x.n,0);g.kg=g.sizes.reduce((a,x)=>a+x.kg,0);g.sizes.forEach(x=>x.rows.sort((a,b)=>String(a.p).localeCompare(String(b.p),'en',{numeric:true})))});
 return{R,list,P:R.length,N:R.reduce((a,r)=>a+r._n,0),KG:R.reduce((a,r)=>a+r._kg,0),S:list.reduce((a,g)=>a+g.sizes.length,0)}}
function summary(A){let b='';A.list.forEach(g=>{g.sizes.forEach((x,j)=>{const ct=[...x.ct.entries()].map(([k,c])=>e(k)+(x.ct.size>1?` <small>(${c})</small>`:'')).join('، ');
  b+=`<tr>${j?'':`<td class="v" rowspan="${g.sizes.length}">${e(g.v)}</td>`}<td><b dir="ltr">${e(x.s)}</b></td><td class="r">${ct}</td><td>${x.rows.length}</td><td>${nf(x.n)}</td></tr>`});
  b+=`<tr class="sub"><td class="r" colspan="3">إجمالي ${e(g.v)} — ${g.sizes.length} مقاس</td><td>${g.p}</td><td>${nf(g.n)}</td></tr>`});
 b+=`<tr class="gt"><td class="r" colspan="3">الإجمالي العام — ${A.list.length} صنف · ${A.S} مقاس</td><td>${A.P}</td><td>${nf(A.N)}</td></tr>`;
 return `<table><thead><tr><th style="width:15%">الصنف</th><th style="width:9%">المقاس</th><th>نوع الكرتون · اسم الكرتون</th><th style="width:10%">باليتات</th><th style="width:16%">كراتين / صناديق</th></tr></thead><tbody>${b}</tbody></table>`}
function palBlock(A){return '<div class="pns">'+A.list.map(g=>g.sizes.map(x=>`<div class="pn"><div class="h"><b>${e(g.v)} · مقاس <span dir="ltr">${e(x.s)}</span></b><span>${x.rows.length} باليت · ${nf(x.n)} كرتونة</span></div><div class="ids">${x.rows.map(r=>`<span>${e(r.P)}<em>(${r._n})</em></span>`).join('')}</div></div>`).join('')).join('')+'</div>'}
function infoCell(l,v,ltr){return `<div><small>${l}</small><b${ltr?' dir="ltr"':''}>${e(v||'—')}</b></div>`}
function pageHTML(d){const h=d.h,dt=parts(h.date),A=analyse(d.rows);const kind=h.kind||'براد';
 const fr=Number(h.freight)||0,adv=Number(h.adv)||0;
 const info=[infoCell('العميل',h.customer),infoCell('الوجهة',h.dest),infoCell('رقم الحاوية / البراد',h.cont,1),infoCell('رقم جهاز التبريد',h.reefer,1),
  infoCell('رقم اللوط',h.lot,1),infoCell('تاريخ التحميل',dt.iso,1),infoCell('الخط الملاحي',h.line),infoCell('اسم السائق',h.driver),
  infoCell('المُصدّر','العلا'),infoCell('النولون (ر.س)',fr?nf(fr,2):'—',1),infoCell('سلف السائق (ر.س)',adv?nf(adv,2):'—',1),infoCell('الباقي للسائق (ر.س)',fr?nf(fr-adv,2):'—',1)].join('');
 return `<div class="page">${mast()}<div class="body">
 <div class="meta"><div>الرقم المرجعي: <b dir="ltr">${e(h.ref||'')}</b></div><div class="edt">تحريراً في: <b dir="ltr">${e(dt.slash)}</b></div></div>
 <div class="ttl"><div class="tt"><h1>باكينج ليست</h1><div class="en">PACKING LIST · LOADING</div></div><div class="pill">${e(kind)} <span dir="ltr">${e(h.cont||'—')}</span> · <span dir="ltr">${e(dt.dmy)}</span></div></div>
 <div class="inf">${info}</div>
 <div class="k"><div><small>عدد الباليتات</small><b>${A.P}</b></div><div><small>إجمالي الكراتين / الصناديق</small><b>${nf(A.N)}</b></div><div><small>الوزن الصافي (كجم)</small><b>${A.KG?nf(A.KG):'—'}</b></div><div><small>الأصناف · المقاسات</small><b>${A.list.length} · ${A.S}</b></div></div>
 <h4><i></i>ملخص الأصناف حسب المقاس <small>— باليتات وكراتين كل مقاس، إجمالي كل صنف، والإجمالي العام</small></h4>${summary(A)}
 <h4><i></i>أرقام الباليتات <small>— مجمعة حسب الصنف والمقاس، وبين القوسين عدد الكراتين على الباليت</small></h4>${palBlock(A)}
 <div class="note">بيانات الاستيراد لبرنامج العلا مدمجة داخل ملف الـ PDF.</div>
 <div class="sg"><div>مسؤول التحميل</div><div>السائق${h.driver?': '+e(h.driver):''}</div><div>التوقيع والاعتماد</div></div>
 <div class="dep"><img src="rashed_logo_gray.png" alt=""><span>يعتمد: شركة الراشد للتجارة</span></div>
 </div>${foot(h,dt)}</div>`}
// fit everything on ONE page: shrink var(--k) step by step, then scale as last resort
function fit(page){const body=page.querySelector('.body'),ft=page.querySelector('.foot');const avail=()=>ft.offsetTop-body.offsetTop-6;
 let k=1;page.style.setProperty('--k',k);while(body.scrollHeight>avail()&&k>0.62){k=Math.round((k-0.04)*100)/100;page.style.setProperty('--k',k)}
 if(body.scrollHeight>avail()){let s=1;body.style.transformOrigin='top right';for(let i=0;i<4;i++){s=avail()/body.scrollHeight;body.style.width=(794/s)+'px'}s=Math.min(s,avail()/body.scrollHeight);body.style.transform=`scale(${s})`;return{k,scale:Math.round(s*100)/100}}return{k,scale:1}}
function aoa(d){const h=d.h;return [['باكينج ليست — شركة العلا'],['رقم الحاوية / البراد',h.cont||''],['تاريخ التحميل',h.date||''],['اسم العميل',h.customer||''],['رقم اللوط',h.lot||''],['الوجهة',h.dest||''],['الخط الملاحي',h.line||''],['اسم السائق',h.driver||''],['رقم جهاز التبريد',h.reefer||''],['المُصدر','العلا'],['نوع الشحنة',h.kind||''],['الرقم المرجعي',h.ref||''],[],
 ['رقم الباليت','الصنف','المقاس','نوع الكرتون','اسم الكرتون','عدد الكراتين','وزن الكرتونة (كجم)'],...d.rows.map(r=>[r.P,r.v||'',r.s||'',r.c||'',r.b||'',parseInt(r.n,10)||0,unitKg(r.c)||''])]}
function embed(rows){const CT=new Uint32Array(256);for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;CT[n]=c}
 const u=new TextEncoder().encode(JSON.stringify({v:1,app:'alola',kind:'load',rows}));let o='';for(let i=0;i<u.length;i+=32768)o+=String.fromCharCode.apply(null,u.subarray(i,i+32768));const b=btoa(o);let c=~0;for(let i=0;i<b.length;i++)c=CT[(c^b.charCodeAt(i))&255]^(c>>>8);return 'ALOLADATA1:'+b+':'+((~c)>>>0).toString(16).padStart(8,'0')}
function utf16PdfHex(s){let h='FEFF';for(let i=0;i<s.length;i++)h+=s.charCodeAt(i).toString(16).toUpperCase().padStart(4,'0');return '<'+h+'>'}
function idxBytes(u8,s,from){const n=s.length;for(let i=from||0;i<=u8.length-n;i++){let ok=1;for(let j=0;j<n;j++)if(u8[i+j]!==s.charCodeAt(j)){ok=0;break}if(ok)return i}return -1}
function lastIdxBytes(u8,s){const n=s.length;for(let i=u8.length-n;i>=0;i--){let ok=1;for(let j=0;j<n;j++)if(u8[i+j]!==s.charCodeAt(j)){ok=0;break}if(ok)return i}return -1}
function asciiLen(s){return new TextEncoder().encode(s).length}
function spliceBytes(u8,at,remove,insert){const ins=typeof insert==='string'?new TextEncoder().encode(insert):insert;const out=new Uint8Array(u8.length-remove+ins.length);out.set(u8.subarray(0,at),0);out.set(ins,at);out.set(u8.subarray(at+remove),at+ins.length);return out}
function literalSpan(u8,key){const at=idxBytes(u8,key);if(at<0)return null;let i=at+key.length;if(u8[i]!==0x28)return null;const lit=i;i++;while(i<u8.length){if(u8[i]===0x5c){i+=2;continue}if(u8[i]===0x29)break;i++}if(u8[i]!==0x29)return null;return {at:lit,remove:i+1-lit}}
function patchPdfTitle(buf,title){let u8=buf instanceof Uint8Array?buf:new Uint8Array(buf);const hex=utf16PdfHex(title);const cuts=[];for(const key of ['/Title ','/Subject ']){const hit=literalSpan(u8,key);if(hit)cuts.push({at:hit.at,remove:hit.remove,insert:hex})}const cat=idxBytes(u8,'/Type /Catalog');if(cat>=0&&idxBytes(u8,'/DisplayDocTitle')<0)cuts.push({at:cat+'/Type /Catalog'.length,remove:0,insert:' /ViewerPreferences <</DisplayDocTitle true>>'});if(!cuts.length)return u8;cuts.sort((a,b)=>a.at-b.at);const growth=off=>cuts.reduce((g,c)=>c.at<off?g+asciiLen(c.insert)-c.remove:g,0);const orig=u8;for(let i=cuts.length-1;i>=0;i--)u8=spliceBytes(u8,cuts[i].at,cuts[i].remove,cuts[i].insert);const sx=lastIdxBytes(orig,'startxref');if(sx<0)return orig;let p=sx+'startxref'.length;if(orig[p]===10||orig[p]===13)p++;let q=p;while(q<orig.length&&orig[q]>=48&&orig[q]<=57)q++;const xrefOld=parseInt(String.fromCharCode.apply(null,orig.subarray(p,q)),10);if(!xrefOld)return orig;const xrefAt=xrefOld+growth(xrefOld);const head='xref\n';if(idxBytes(u8,head,xrefAt)!==xrefAt)return orig;let i=xrefAt+head.length;const readLine=()=>{const a=i;while(i<u8.length&&u8[i]!==10&&u8[i]!==13)i++;const s=String.fromCharCode.apply(null,u8.subarray(a,i));if(u8[i]===13)i++;if(u8[i]===10)i++;return s};let guard=0;while(guard++<8){const sub=readLine();const m=/^(\d+)\s+(\d+)$/.exec(sub);if(!m)break;const count=+m[2];for(let n=0;n<count;n++){const entAt=i;const ent=readLine();const em=/^(\d{10}) (\d{5}) ([nf])/.exec(ent);if(!em||em[3]!=='n')continue;const off=+em[1];const shifted=off+growth(off);const digits=String(shifted).padStart(10,'0');for(let k=0;k<10;k++)u8[entAt+k]=digits.charCodeAt(k)}}const sxNew=lastIdxBytes(u8,'startxref');if(sxNew<0)return u8;let a=sxNew+'startxref'.length;if(u8[a]===10||u8[a]===13)a++;let b=a;while(b<u8.length&&u8[b]>=48&&u8[b]<=57)b++;const num=String(xrefAt);if(b-a===num.length){for(let k=0;k<num.length;k++)u8[a+k]=num.charCodeAt(k);return u8}return spliceBytes(u8,a,b-a,num)}

function stage(){let st=document.getElementById('plstage');if(!st){st=document.createElement('div');st.id='plstage';document.body.appendChild(st)}
 if(!document.getElementById('plcss')){const s=document.createElement('style');s.id='plcss';s.textContent=CSS;document.head.appendChild(s)}return st}
async function render(d){const st=stage();st.innerHTML=pageHTML(d);if(document.fonts&&document.fonts.ready)await document.fonts.ready;
 await Promise.all([...st.querySelectorAll('img')].map(img=>img.complete&&img.naturalWidth?1:new Promise(r=>{img.onload=img.onerror=r})));
 const page=st.querySelector('.page');const f=fit(page);return{st,page,f}}
window.PL={CSS,aoa,analyse,unitKg,
 fileName(h){const dt=parts(h.date);const c=String(h.cont||'').replace(/[^A-Za-z0-9-]+/g,'-').replace(/-+/g,'-').replace(/^-|-$/g,'')||'NA';const d=/^\d{4}-\d{2}-\d{2}$/.test(dt.iso)?dt.iso:new Date().toISOString().slice(0,10);return 'PackingList_'+c+'_'+d+'.pdf'},
 async preview(d,host){const{page,f}=await render(d);const cl=page.cloneNode(true);host.innerHTML='';host.appendChild(cl);return f},
 async pdf(d){const{st,page,f}=await render(d);const{jsPDF}=window.jspdf;const pdf=new jsPDF({unit:'pt',format:'a4',compress:true});const W=595.28,H=841.89;
  const cv=await html2canvas(page,{scale:2,backgroundColor:'#fff',logging:false,width:794,height:1123,windowWidth:794});
  pdf.addImage(cv.toDataURL('image/jpeg',.92),'JPEG',0,0,W,H);
  const emb=embed(aoa(d));pdf.setFont('helvetica');pdf.setFontSize(2);(emb.match(/.{1,400}/g)||[]).forEach((l,i)=>pdf.text(l,2,3+i*2.2,{renderingMode:'invisible'}));
  const title='باكينج ليست العلا '+(d.h.cont||'')+' '+(d.h.date||'');pdf.setProperties({title,subject:title,keywords:emb,creator:'Al-Ola Packing List'});
  st.innerHTML='';return{blob:new Blob([patchPdfTitle(pdf.output('arraybuffer'),title)],{type:'application/pdf'}),fit:f}}};
})();
