/* Alola packing list PWA — form + validation + autosave. PDF in pl-report.js */
(function(){
'use strict';
const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const AD=s=>String(s??'').replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d)).replace(/[۰-۹]/g,d=>'۰۱۲۳۴۵۶۷۸۹'.indexOf(d));
const nf=(x,d=0)=>Number(Math.round((Number(x)||0)*10**d)/10**d).toLocaleString('en-US',{maximumFractionDigits:d});
const BASE={v:['أبو سرة','صيفي','موركيت كيني','موركيت إسباني','ليمون'],s:['20','28','32','36','40','42','48','56','64','72','80','88','100','113'],c:['أوبن توب 7 ك','مقفول صغير 7 ك','مقفول 14 ك','مقفول 15 ك'],b:['العلا','الحسن','كوكلو']};
const NAMES={v:'الصنف',s:'المقاس',c:'نوع الكرتون',b:'اسم الكرتون'};
const KEY='alola_packing_v1',XK='alola_packing_extra',HK='alola_packing_hist';
let XL={};try{XL=JSON.parse(localStorage.getItem(XK))||{}}catch(e){}['v','s','c','b'].forEach(k=>XL[k]=XL[k]||[]);
let HI={};try{HI=JSON.parse(localStorage.getItem(HK))||{}}catch(e){}['customer','dest','line','driver'].forEach(k=>HI[k]=HI[k]||[]);
const LST=k=>[...BASE[k],...XL[k].filter(x=>!BASE[k].includes(x))];
const today=()=>new Date().toLocaleDateString('en-CA',{timeZone:'Africa/Cairo'});
function newRef(){const d=new Date();const p=n=>String(n).padStart(2,'0');return 'PL-'+d.getFullYear()+p(d.getMonth()+1)+p(d.getDate())+'-'+p(d.getHours())+p(d.getMinutes())+'-'+Math.random().toString(16).slice(2,6).toUpperCase()}
const blank=()=>({p:'',v:'',s:'',c:'',b:'العلا',n:''});
let S;try{S=JSON.parse(localStorage.getItem(KEY))}catch(e){}
if(!S||!S.h||!Array.isArray(S.rows))S={h:{ref:newRef(),date:today(),kind:'براد'},rows:[blank()]};
const HF=['ref','date','kind','cont','reefer','lot','customer','dest','line','driver','freight','adv'];
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}};
function toast(t){const el=$('toast');el.textContent=t;el.style.display='block';clearTimeout(toast.t);toast.t=setTimeout(()=>el.style.display='none',2600)}
function initHeader(){HF.forEach(k=>{const el=$('h_'+k);if(!el)return;el.value=S.h[k]??'';el.oninput=el.onchange=()=>{S.h[k]=k==='cont'?el.value.toUpperCase():el.value;if(k==='cont'&&el.value!==S.h[k]){const p=el.selectionStart;el.value=S.h[k];el.setSelectionRange(p,p)}rest();save();upd()}});
 ['customer','dest','line','driver'].forEach(k=>{$('dl_'+k).innerHTML=HI[k].map(x=>`<option value="${esc(x)}">`).join('')});rest()}
function rest(){const f=parseFloat(AD(S.h.freight))||0,a=parseFloat(AD(S.h.adv))||0;$('h_rest').value=f?nf(f-a,2):''}
const opts=(k,v)=>{const L=LST(k);let o=`<option value="">— ${NAMES[k]} —</option>`+L.map(x=>`<option${x===v?' selected':''}>${esc(x)}</option>`).join('');if(v&&!L.includes(v))o+=`<option selected>${esc(v)}</option>`;return o+'<option value="__new">+ إضافة جديد…</option>'};
const palId=r=>{const d=AD(r.p).replace(/\s+/g,'');return d?'P'+d:''};
const validP=r=>/^\d{1,11}$/.test(AD(r.p));
function renderRows(){$('rows').innerHTML=S.rows.map((r,i)=>`<div class="row" data-row="${i}"><div class="top"><div class="num">${i+1}</div><div class="pin"><span>P</span><input data-i="${i}" data-k="p" value="${esc(r.p)}" inputmode="numeric" pattern="[0-9]*" autocomplete="off" maxlength="11" placeholder="رقم الباليت"></div><div class="rb"><button type="button" class="btn2" data-cp="${i}" title="نسخ">نسخ</button><button type="button" class="btn3" data-rm="${i}" title="حذف">حذف</button></div></div>
 <div class="rgrid">${['v','s','c','b'].map(k=>`<div><div class="sl">${NAMES[k]}</div><select data-i="${i}" data-k="${k}">${opts(k,r[k])}</select></div>`).join('')}<div><div class="sl">عدد الكراتين / الصناديق</div><input data-i="${i}" data-k="n" type="number" inputmode="numeric" min="1" step="1" value="${esc(r.n)}"></div><div><div class="sl">وزن الكرتونة</div><input readonly data-w="${i}" value="${PL.unitKg(r.c)?PL.unitKg(r.c)+' كجم':'—'}"></div></div><div class="msg" data-m="${i}"></div></div>`).join('');upd()}
$('rows').addEventListener('input',ev=>{const t=ev.target,i=+t.dataset.i,k=t.dataset.k;if(isNaN(i)||!k||t.tagName==='SELECT')return;let v=t.value;if(k==='p'){const c=AD(v).replace(/\D/g,'');if(c!==v){t.value=c}v=c}S.rows[i][k]=v;save();upd()});
$('rows').addEventListener('change',ev=>{const t=ev.target,i=+t.dataset.i,k=t.dataset.k;if(t.tagName!=='SELECT')return;let v=t.value;
 if(v==='__new'){const x=(prompt('اكتب '+NAMES[k]+' الجديد')||'').trim();if(x){if(!LST(k).includes(x)){XL[k].push(x);localStorage.setItem(XK,JSON.stringify(XL))}v=x}else v=S.rows[i][k]||'';S.rows[i][k]=v;save();renderRows();return}
 S.rows[i][k]=v;if(k==='c'){const w=document.querySelector(`[data-w="${i}"]`);if(w)w.value=PL.unitKg(v)?PL.unitKg(v)+' كجم':'—'}save();upd()});
$('rows').addEventListener('click',ev=>{const t=ev.target;if(t.dataset.rm!=null){const i=+t.dataset.rm;const r=S.rows[i];if((r.p||r.n)&&!confirm('حذف الباليت رقم '+(i+1)+'؟'))return;S.rows.splice(i,1);if(!S.rows.length)S.rows.push(blank());save();renderRows()}
 else if(t.dataset.cp!=null){const i=+t.dataset.cp;const r={...S.rows[i],p:''};S.rows.splice(i+1,0,r);save();renderRows();focusP(i+1)}});
function focusP(i){const el=document.querySelector(`input[data-i="${i}"][data-k="p"]`);if(el){el.focus();el.scrollIntoView({block:'center'})}}
function addRows(n){const last=S.rows[S.rows.length-1]||blank();const base=S.rows.length&&(last.v||last.s)?{...last,p:''}:blank();const at=S.rows.length;for(let j=0;j<n;j++)S.rows.push({...base});save();renderRows();focusP(at)}
$('bAdd').onclick=()=>addRows(1);$('bAdd5').onclick=()=>addRows(5);
function check(){const used=S.rows.filter(r=>r.p||r.v||r.s||r.n);const cnt={};used.forEach(r=>{const p=palId(r);if(p)cnt[p]=(cnt[p]||0)+1});const errs=[];let bad=0;
 S.rows.forEach((r,i)=>{const o={};const any=r.p||r.v||r.s||r.n;if(any){if(!r.p)o.p='miss';else if(!validP(r))o.p='err';else if(cnt[palId(r)]>1)o.p='dup';['v','s','c','b'].forEach(k=>{if(!r[k])o[k]='miss'});if(!(parseInt(AD(r.n),10)>0)||!/^\d+$/.test(AD(r.n)))o.n=r.n?'err':'miss'}r._st=o;if(Object.keys(o).length)bad++});
 if(!S.h.cont)errs.push('رقم الحاوية / البراد ناقص');if(!S.h.date)errs.push('تاريخ التحميل ناقص');
 const dups=Object.keys(cnt).filter(p=>cnt[p]>1);if(dups.length)errs.push('أرقام باليتات مكررة: '+dups.join('، '));
 if(bad)errs.push(bad+' باليت بياناتهم ناقصة أو غلط (باللون الأحمر/الأصفر)');if(!used.length)errs.push('مفيش باليتات');return{errs,used}}
function upd(){const{errs,used}=check();
 S.rows.forEach((r,i)=>{const row=document.querySelector(`[data-row="${i}"]`);if(!row)return;const st=r._st||{};row.classList.toggle('dup',st.p==='dup');
  row.querySelectorAll('[data-k]').forEach(el=>{const k=el.dataset.k,s=st[k];el.classList.toggle('err',s==='err'||s==='dup');el.classList.toggle('miss',s==='miss')});
  const m=row.querySelector('[data-m]');m.textContent=st.p==='err'?'رقم الباليت لازم يكون أرقام بس':st.p==='dup'?'رقم الباليت ده متكرر':st.n==='err'?'عدد الكراتين لازم رقم صحيح أكبر من صفر':''});
 const A=PL.analyse(used.filter(r=>validP(r)).map(r=>({...r,P:palId(r),n:AD(r.n)})));
 $('stat').innerHTML=`${A.P} باليت<br>${nf(A.N)} كرتونة`;
 let b='';A.list.forEach(g=>{g.sizes.forEach((x,j)=>{b+=`<tr>${j?'':`<td rowspan="${g.sizes.length}"><b>${esc(g.v)}</b></td>`}<td dir="ltr">${esc(x.s)}</td><td>${x.rows.length}</td><td>${nf(x.n)}</td></tr>`});b+=`<tr class="sub"><td colspan="2">إجمالي ${esc(g.v)}</td><td>${g.p}</td><td>${nf(g.n)}</td></tr>`});
 $('sum').innerHTML=A.P?`<table class="sum"><tr><th>الصنف</th><th>المقاس</th><th>باليتات</th><th>كراتين / صناديق</th></tr>${b}<tr class="gt"><td colspan="2">الإجمالي العام</td><td>${A.P}</td><td>${nf(A.N)}</td></tr></table>`:'<div class="hint">لسه مفيش باليتات</div>';
 $('alerts').innerHTML=errs.length?errs.map(x=>`<div class="a-bad">⚠ ${esc(x)}</div>`).join(''):'<div class="a-ok">✔ البيانات كاملة — جاهز لحفظ الـ PDF</div>'}
function data(){return{h:{...S.h,cont:(S.h.cont||'').trim(),freight:AD(S.h.freight),adv:AD(S.h.adv)},rows:check().used.map(r=>({p:AD(r.p),P:palId(r),v:r.v,s:r.s,c:r.c,b:r.b,n:AD(r.n)}))}}
function ready(){const{errs}=check();if(errs.length){alert('مينفعش نطلع الـ PDF قبل تصليح:\n\n• '+errs.join('\n• '));return false}return true}
function remember(){['customer','dest','line','driver'].forEach(k=>{const v=(S.h[k]||'').trim();if(v&&!HI[k].includes(v)){HI[k].unshift(v);HI[k]=HI[k].slice(0,30)}});localStorage.setItem(HK,JSON.stringify(HI))}
async function makePdf(){if(!ready())return null;$('busy').style.display='flex';try{const d=data();const r=await PL.pdf(d);remember();initHeader();return{blob:r.blob,name:PL.fileName(d.h)}}catch(e){alert('حصل خطأ أثناء تجهيز الـ PDF: '+e.message);return null}finally{$('busy').style.display='none'}}
function download(f){const u=URL.createObjectURL(f.blob);const a=document.createElement('a');a.href=u;a.download=f.name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),60000);toast('✔ اتحفظ: '+f.name)}
$('bPdf').onclick=$('pvPdf').onclick=async()=>{const f=await makePdf();if(f)download(f)};
$('bShare').onclick=async()=>{const f=await makePdf();if(!f)return;const file=new File([f.blob],f.name,{type:'application/pdf'});if(navigator.canShare&&navigator.canShare({files:[file]})){try{await navigator.share({files:[file],title:f.name})}catch(e){}}else download(f)};
$('bPrev').onclick=async()=>{$('busy').style.display='flex';try{const w=$('pvw');const fit=await PL.preview(data(),w);const sc=Math.min(1,(window.innerWidth-24)/794);w.style.transform=`scale(${sc})`;w.style.height=(1123*sc)+'px';$('pv').style.display='block';if(fit.scale<1||fit.k<1)toast('تم تصغير الخط تلقائياً عشان الباكينج يطلع في صفحة واحدة')}finally{$('busy').style.display='none'}};
$('pvClose').onclick=()=>{$('pv').style.display='none'};
$('bNew').onclick=()=>{if(!confirm('بدء باكينج ليست جديد؟ البيانات الحالية هتتمسح من الشاشة (احفظ الـ PDF الأول).'))return;S={h:{ref:newRef(),date:today(),kind:S.h.kind||'براد'},rows:[blank()]};save();initHeader();renderRows()};
window.APP={S,data,check,render:()=>{initHeader();renderRows()},set(x){S.h=x.h;S.rows=x.rows;save();initHeader();renderRows()}};
initHeader();renderRows();
})();
