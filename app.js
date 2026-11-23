/* Alola packing list PWA v9 (entry like the production app) — form + validation + autosave. PDF in pl-report.js */
(function(){
'use strict';
const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const AD=s=>String(s??'').replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d)).replace(/[۰-۹]/g,d=>'۰۱۲۳۴۵۶۷۸۹'.indexOf(d));
const nf=(x,d=0)=>Number(Math.round((Number(x)||0)*10**d)/10**d).toLocaleString('en-US',{maximumFractionDigits:d});
const BASE={v:['أبو سرة','صيفي','موركيت كيني','موركيت إسباني','ليمون'],s:['20','24','28','32','36','40','42','48','56','64','72','80','88','100','113'],c:['أوبن توب 7 ك','مقفول صغير 7 ك','مقفول 14 ك','مقفول 15 ك'],b:['العلا','الحسن','كوكلو']};
const NAMES={v:'الصنف',s:'المقاس',c:'نوع الكرتون',b:'اسم الكرتون'};
const KEY='alola_packing_v1',XK='alola_packing_extra',HK='alola_packing_hist';
let XL={};try{XL=JSON.parse(localStorage.getItem(XK))||{}}catch(e){}['v','s','c','b'].forEach(k=>XL[k]=XL[k]||[]);
let HI={};try{HI=JSON.parse(localStorage.getItem(HK))||{}}catch(e){}['customer','dest','line','driver'].forEach(k=>HI[k]=HI[k]||[]);
const LST=k=>[...BASE[k],...XL[k].filter(x=>!BASE[k].includes(x))];
const today=()=>new Date().toLocaleDateString('en-CA',{timeZone:'Africa/Cairo'});
/* v5: الرقم المرجعي جواه تاريخ التحميل نفسه (مش يوم إنشاء الفورم) — PL-YYYYMMDD-HHMM-XXXX */
function newRef(date){const d=new Date();const p=n=>String(n).padStart(2,'0');const day=/^\d{4}-\d{2}-\d{2}$/.test(String(date||''))?String(date).replace(/-/g,''):today().replace(/-/g,'');return 'PL-'+day+'-'+p(d.getHours())+p(d.getMinutes())+'-'+Math.random().toString(16).slice(2,6).toUpperCase()}
const refDay=r=>{const m=String(r||'').match(/^PL-(\d{8})-/);return m?m[1]:''};
const normNo=s=>AD(s).toUpperCase().replace(/[\s\/\\\-_.|]+/g,'');
/* اسم العميل: نفس الاسم حتى لو اختلفت الهمزة أو ة/ه أو ى/ي أو التطويل أو المسافات أو «مؤسسة / شركة» */
const nameKey=s=>AD(s).replace(/[\u0640\u064B-\u065F\u0670]/g,'').replace(/[أإآٱ]/g,'ا').replace(/ة/g,'ه').replace(/ى/g,'ي').replace(/ؤ/g,'و').replace(/ئ/g,'ي').replace(/^\s*(مؤسس[هة]|موسس[هة]|شرك[هة]|مكتب|السيد|الساده|السادة)\s+/,'').replace(/[\s.\-_,،]+/g,'').toLowerCase();
const sigOf=h=>[normNo(h.cont),h.date||'',nameKey(h.customer)].join('|');
const blank=()=>({p:'',v:'',s:'',c:'',b:'العلا',n:''});
let S;try{S=JSON.parse(localStorage.getItem(KEY))}catch(e){}
if(!S||!S.h||!Array.isArray(S.rows))S={h:{ref:newRef(today()),date:today(),kind:'براد'},rows:[blank()]};
/* لو الرقم المرجعي تاريخه مش تاريخ التحميل → رقم جديد بتاريخ التحميل (القديم بيتشال من الشاشة بس، الـ PDF اللي طلع قبل كده زي ما هو) */
function syncRef(){if(!S.h.date)return false;if(refDay(S.h.ref)===S.h.date.replace(/-/g,''))return false;S.h.ref=newRef(S.h.date);delete S.h.sig;return true}
/* فورم اتطبع يوم قديم واتفتح النهارده لعربية جديدة: التاريخ يبقى النهارده ورقم مرجعي جديد */
let _reuse=false;if(S.h.issued&&String(S.h.issued).slice(0,10)<today()&&S.h.date&&S.h.date<today()){S.h.date=today();_reuse=true}
const _fixed=syncRef();
const HF=['ref','date','kind','cont','reefer','lot','customer','dest','line','driver','freight','adv'];
const save=()=>{S._ts=Date.now();let okS=true;try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){okS=false}const w=document.getElementById('fullWarn');if(w)w.style.display=okS?'none':'block'};
/* v8: البرنامج مفتوح في تابتين على نفس الموبايل — التاب القديمة بتاخد آخر حفظ من التاب التانية بدل ما تمسحه */
window.addEventListener('storage',e=>{if(e.key!==KEY||!e.newValue)return;let x;try{x=JSON.parse(e.newValue)}catch(_){return}if(!x||!x.h||!Array.isArray(x.rows)||(x._ts||0)<=(S._ts||0))return;S.h=x.h;S.rows=x.rows.length?x.rows:[blank()];S._ts=x._ts;try{initHeader();renderRows()}catch(_){}});
function toast(t){const el=$('toast');el.textContent=t;el.style.display='block';clearTimeout(toast.t);toast.t=setTimeout(()=>el.style.display='none',2600)}
function initHeader(){HF.forEach(k=>{const el=$('h_'+k);if(!el)return;el.value=S.h[k]??'';el.oninput=el.onchange=()=>{S.h[k]=k==='cont'?el.value.toUpperCase():el.value;if(k==='cont'&&el.value!==S.h[k]){const p=el.selectionStart;el.value=S.h[k];el.setSelectionRange(p,p)}if(k==='date'&&syncRef()){$('h_ref').value=S.h.ref;toast('اتغير التاريخ ← رقم مرجعي جديد: '+S.h.ref)}rest();save();upd()}});
 const ce=$('h_customer');if(ce)ce.onblur=()=>{const v=(S.h.customer||'').trim();if(!v)return;const k=nameKey(v);const hit=HI.customer.find(x=>x!==v&&nameKey(x)===k);if(hit){S.h.customer=hit;ce.value=hit;save();toast('العميل ده متسجل باسم «'+hit+'» — اتكتب بنفس الاسم')}};
 ['customer','dest','line','driver'].forEach(k=>{$('dl_'+k).innerHTML=HI[k].map(x=>`<option value="${esc(x)}">`).join('')});rest()}
function rest(){const f=parseFloat(AD(S.h.freight))||0,a=parseFloat(AD(S.h.adv))||0;$('h_rest').value=f?nf(f-a,2):''}
const opts=(k,v)=>{const L=LST(k);let o=`<option value="">— ${NAMES[k]} —</option>`+L.map(x=>`<option${x===v?' selected':''}>${esc(x)}</option>`).join('');if(v&&!L.includes(v))o+=`<option selected>${esc(v)}</option>`;return o+'<option value="__new">+ إضافة جديد…</option>'};
const palId=r=>{const d=AD(r.p).replace(/\s+/g,'');return d?'P'+d:''};
const palKey=r=>{const d=AD(r.p).replace(/\D/g,'');return d?'P'+String(parseInt(d,10)).padStart(4,'0'):''};
const validP=r=>/^\d{1,11}$/.test(AD(r.p));
/* ---------- v9: الإدخال زي برنامج الإنتاج — تختار الصنف/المواصفة الأول وبعدين أرقام باليتاته؛ الباليتات متجمعة تحت كل صنف ---------- */
const SZL=()=>LST('s');
function mixLines(r){return (Array.isArray(r&&r.mix)?r.mix:[]).map(x=>{const s=String(x&&x.s||'').trim();const n=AD(String(x&&x.n||'')).trim();if(!s||!/^[1-9]\d*$/.test(n))return null;return{s,n:parseInt(n,10)}}).filter(Boolean)}
function mixSum(r){return mixLines(r).reduce((a,x)=>a+x.n,0)}
function sizeLabel(r){if(!r||r.s!=='MIX')return r&&r.s||'';const L=mixLines(r);return L.length?'MIX ('+L.map(x=>x.s+'×'+x.n).join('، ')+')':'MIX'}
const specFull=r=>['v','s','c','b'].every(k=>String(r[k]||'').trim());
const gKey=r=>specFull(r)?[r.v,sizeLabel(r),r.c,r.b].join('|'):'';
const filled=r=>!!(r&&(r.p||r.v||r.s||r.n));
const RK='alola_packing_specs';
const specOf=r=>({v:r.v||'',s:r.s||'',c:r.c||'',b:r.b||'',n:String(r.n??''),mix:r.s==='MIX'&&Array.isArray(r.mix)?JSON.parse(JSON.stringify(r.mix)):[]});
const specK=o=>[o.v,sizeLabel(o),o.c,o.b,o.n].join('|');
const nOk=n=>/^[1-9]\d*$/.test(AD(String(n||'')).trim());
function mixOk(W){if(W.s!=='MIX')return true;const L=mixLines(W);return L.length>=2&&new Set(L.map(x=>x.s)).size===L.length}
function specOk(W,keepN){if(!specFull(W)||!mixOk(W))return false;if(W.s==='MIX')return true;return keepN||nOk(W.n)}
function missing(W,keepN){const N={v:'الصنف',c:'نوع الكرتون',s:'المقاس',b:'اسم الكرتون'};const m=Object.keys(N).filter(k=>!String(W[k]||'').trim()).map(k=>N[k]);if(W.s!=='MIX'&&!keepN&&!nOk(W.n))m.push('عدد الكراتين');if(W.s==='MIX'&&!mixOk(W))m.push('مقاسين MIX على الأقل بكراتينهم');return m}
function recent(){let L=[];try{L=JSON.parse(localStorage.getItem(RK)||'[]')}catch(e){}if(!L.length){const cnt={};S.rows.forEach(r=>{if(r.p&&specOk(r)){const o=specOf(r),k=specK(o);cnt[k]=cnt[k]||{o,n:0};cnt[k].n++}});L=Object.values(cnt).sort((a,b)=>b.n-a.n).map(x=>x.o)}
 const seen=new Set(),out=[];L.forEach(o=>{if(!o||!specOk(o))return;const k=specK(o);if(seen.has(k))return;seen.add(k);out.push(o)});return out.slice(0,5)}
function rememberSpec(W){const o=specOf(W);if(o.s==='MIX')o.n=String(mixSum(o));let L=[];try{L=JSON.parse(localStorage.getItem(RK)||'[]')}catch(e){}const k=specK(o);L=[o].concat(L.filter(x=>x&&specK(x)!==k)).slice(0,8);try{localStorage.setItem(RK,JSON.stringify(L))}catch(e){}}
const pkey=d=>{d=AD(String(d||'')).replace(/\D/g,'');return d?'P'+String(parseInt(d,10)).padStart(4,'0'):''};
function rangesOf(list){const a=list.slice().sort((x,y)=>parseInt(x,10)-parseInt(y,10));const out=[];let s=null,p=null;a.forEach(x=>{if(s!==null&&parseInt(x,10)===parseInt(p,10)+1){p=x;return}if(s!==null)out.push(s===p?'P'+s:'P'+s+' → P'+p);s=p=x});if(s!==null)out.push(s===p?'P'+s:'P'+s+' → P'+p);return out.join('، ')}
let GR=[];
function groups(){const G=[],M={};S.rows.forEach((r,i)=>{if(!filled(r))return;const k=gKey(r);const key=k||('?'+i);if(!M[key]){M[key]={key,inc:!k,rows:[],r};G.push(M[key])}M[key].rows.push(i)});return G}
function renderRows(){const R=recent();const G=groups();GR=G;
 const bar=`<div class="pbar${R[0]?' two':''}"><button type="button" class="btn" id="pAdd">+ باليتات جديدة</button>${R[0]?`<button type="button" class="pl" id="pLast">↺ نفس آخر مواصفة<br><small>${esc(R[0].v)} · ${esc(R[0].s==='MIX'?'MIX':R[0].s)}</small></button>`:''}</div>`;
 const body=G.length?G.map((g,gi)=>{const r=g.r;const kg=PL.unitKg(r.c);
  const head=g.inc?`<div class="gh inc"><div class="gt2"><b>⚠ مواصفة ناقصة</b><small>${esc(['v','s','c','b'].filter(k=>r[k]).map(k=>k==='s'?'مقاس '+sizeLabel(r):r[k]).join(' · ')||'لسه متحددتش')}</small></div><div class="gc" data-gc="${gi}"></div></div>`
   :`<div class="gh"><div class="gt2"><b>${esc(r.v)} · ${r.s==='MIX'?'MIX':'مقاس '+esc(r.s)}</b>${r.s==='MIX'?`<small class="mx">${mixLines(r).map(x=>`<bdi dir="ltr">${esc(x.s)}×${x.n}</bdi>`).join(' + ')} كرتونة</small>`:''}<small>${esc(r.c)} · ${esc(r.b)}${kg?' · '+kg+' كجم/كرتونة':''}</small></div><div class="gc" data-gc="${gi}"></div></div>`;
  const lines=g.rows.map((i,j)=>{const x=S.rows[i];const mix=x.s==='MIX';return `<div class="row pr" data-row="${i}"><div class="top"><div class="num">${j+1}</div><div class="pin"><span>P</span><input data-i="${i}" data-k="p" value="${esc(x.p)}" inputmode="numeric" pattern="[0-9]*" autocomplete="off" maxlength="11" placeholder="رقم الباليت"></div><div class="pcn"><input data-i="${i}" data-k="n" type="number" inputmode="numeric" min="1" step="1" value="${esc(x.n)}"${mix?' readonly':''} aria-label="عدد الكراتين"><small>${mix?'كرتونة (MIX)':'كرتونة'}</small></div><button type="button" class="btn3 rmb" data-rm="${i}" title="حذف">حذف</button></div><div class="msg" data-m="${i}"></div></div>`}).join('');
  const ft=`<div class="gf${g.inc?' one':''}">${g.inc?'':`<button type="button" class="btn2" data-gadd="${gi}">+ باليتات للصنف ده</button>`}<button type="button" class="${g.inc?'btn':'btn2'}" data-gedit="${gi}">${g.inc?'كمّل المواصفة':'تعديل المواصفة'}</button></div>`;
  return `<div class="grpc${g.inc?' inc':''}" data-g="${gi}">${head}${lines}${ft}</div>`}).join(''):'<div class="hint" style="text-align:center;padding:14px 0">لسه مفيش باليتات — دوس «+ باليتات جديدة» واختار الصنف الأول</div>';
 $('rows').innerHTML=bar+body;upd()}
function paintHeads(){GR.forEach((g,gi)=>{const el=document.querySelector(`[data-gc="${gi}"]`);if(!el)return;const n=g.rows.reduce((a,i)=>a+((S.rows[i]&&parseInt(AD(S.rows[i].n),10))||0),0);el.innerHTML=`${g.rows.length} باليت<br>${nf(n)} كرتونة`})}
/* ---- the sheet (same look as the production app) ---- */
let cur=null;
function mount(){let el=$('pp');if(el)el.remove();el=document.createElement('div');el.id='pp';document.body.appendChild(el);return el}
function closeS(){const el=$('pp');if(el)el.remove();cur=null}
const steps=s=>`<div class="steps"><span class="${s==='spec'?'on':'done'}">١ الصنف والمواصفة</span><span class="${s==='nums'?'on':s==='spec'?'':'done'}">٢ أرقام الباليتات</span><span>٣ تأكيد</span></div>`;
const chip=(f,v,on,lab)=>`<button type="button" class="ch${on?' on':''}" data-sf="${f}" data-sv="${esc(v)}">${esc(lab||v)}</button>`;
function grp(title,f,list,val,extra){const need=!String(val||'').trim();return `<div class="grp${need&&cur.tried?' need':''}" id="g_${f}"><div class="gt"><span>${title}</span><b>${esc(val||'')}</b></div><div class="chips">${list.map(x=>chip(f,x,x===val)).join('')}${extra||''}</div></div>`}
function specText(W){return [W.v,'مقاس '+sizeLabel(W),W.c,W.b,(W.s==='MIX'?mixSum(W):W.n)?(W.s==='MIX'?mixSum(W):W.n)+' كرتونة/باليت':''].filter(x=>x&&!/undefined/.test(x)).map(x=>'<span>'+esc(x)+'</span>').join('')}
const keepN=()=>!!(cur&&cur.edit&&!cur.nT);
function goLabel(W){if(!specOk(W,keepN()))return 'كمّل: '+missing(W,keepN()).join('، ');return cur.edit?'✓ حفظ المواصفة'+(cur.edit.length>1?' لـ '+cur.edit.length+' باليت':''):'التالي: أرقام الباليتات ←'}
function drawSpec(el){const W=cur.spec;const R=cur.edit?[]:recent();const mix=W.s==='MIX';const kg=PL.unitKg(W.c);
 let sz=grp('المقاس','s',SZL(),mix?'':W.s,chip('s','MIX',mix,'MIX أكتر من مقاس')+'<button type="button" class="ch add" data-sadd="s">+ مقاس</button>');
 if(mix){const picked=(W.mix||[]).map(x=>x.s);sz+=`<div class="grp${cur.tried&&!mixOk(W)?' need':''}" id="g_mix"><div class="gt"><span>دوس على المقاسات اللي في الباليت واكتب كراتين كل مقاس</span></div><div class="chips">${SZL().map(x=>`<button type="button" class="ch${picked.includes(x)?' on':''}" data-mixs="${esc(x)}">${esc(x)}</button>`).join('')}</div>${(W.mix||[]).map((m,j)=>`<div class="mixl"><b>${esc(m.s)}</b><input type="number" inputmode="numeric" data-mixn="${j}" value="${esc(m.n)}" placeholder="كراتين"></div>`).join('')}<div class="hint" style="margin-top:6px" id="ppms">المجموع: ${mixSum(W)} كرتونة</div></div>`}
 const many=cur.edit&&cur.edit.length>1;
 el.innerHTML=`<div class="h"><button type="button" data-pp="x">✕ إلغاء</button><b>${cur.edit?'تعديل المواصفة':'باليتات جديدة'}</b></div>${cur.edit?'':steps('spec')}
 <div class="body">
 ${R.length?`<div class="grp"><div class="gt"><span>⚡ مواصفة استخدمتها قبل كده — دوسة واحدة وتروح للأرقام</span></div><div class="rec">${R.map((o,j)=>`<button type="button" class="rc" data-rec="${j}"><b>${esc(o.v)} · مقاس ${esc(sizeLabel(o))}</b><small>${esc([o.c,o.b,(o.s==='MIX'?mixSum(o):o.n)+' كرتونة/باليت'].join(' · '))}</small></button>`).join('')}</div></div><div class="gt" style="margin:12px 2px 0"><span>أو اختار / غيّر المواصفة:</span><button type="button" class="ch add" style="min-height:34px;padding:2px 10px;font-size:13px" data-pp="clear">مسح المواصفة</button></div>`:''}
 ${grp('الصنف','v',LST('v'),W.v,'<button type="button" class="ch add" data-sadd="v">+ صنف</button>')}
 ${grp('نوع الكرتون','c',LST('c'),W.c,'<button type="button" class="ch add" data-sadd="c">+ نوع</button>')}
 ${sz}
 ${grp('اسم الكرتون','b',LST('b'),W.b,'<button type="button" class="ch add" data-sadd="b">+ اسم</button>')}
 <div class="grp${!mix&&!keepN()&&!nOk(W.n)&&cur.tried?' need':''}" id="g_n"><div class="gt"><span>عدد الكراتين في الباليت${many?' (لكل الـ '+cur.edit.length+' باليت)':''}</span>${mix?'<b>من تفصيل MIX</b>':''}</div><div class="nbx"><button type="button" data-nd="-1">−</button><input id="ppnn" type="number" inputmode="numeric" value="${esc(mix?String(mixSum(W)||''):W.n)}" ${mix?'disabled':''} placeholder="${keepN()?'زي ما هو لكل باليت':'العدد'}"><button type="button" data-nd="1">+</button></div><div class="hint" style="margin-top:6px">وزن الكرتونة: ${kg?kg+' كجم (من نوع الكرتون)':'—'}${cur.edit?'':' · العدد ده بيتحط لكل باليت وتقدر تغيّره بعدين في القايمة'}</div></div>
 </div>
 <div class="ft"><button type="button" class="btn go" data-pp="tonums" ${specOk(W,keepN())?'':'style="background:#9db59f"'}>${goLabel(W)}</button></div>`}
function inList(d){const k=pkey(d);return S.rows.some(r=>filled(r)&&r.p&&pkey(r.p)===k)}
function addNum(d,quiet){d=AD(String(d||'')).replace(/\D/g,'');if(!d)return false;if(d.length>11){cur.msg='الرقم طويل أوي (11 رقم بالكتير)';return false}const k=pkey(d);
 if(cur.sel.some(x=>pkey(x)===k)){if(!quiet){const o=cur.sel.find(x=>pkey(x)===k);cur.msg=o===d?'P'+d+' مضاف قبل كده في القايمة دي':'P'+d+' هو نفس P'+o+' — مضاف قبل كده';}return false}
 if(inList(d)){cur.msg='⚠ P'+d+' موجود قبل كده في الباكينج ليست — مش هيتضاف مرتين';return false}
 cur.sel.push(d);return true}
function skipMsg(sk){if(!sk.length)return;cur.msg='اتشال '+sk.length+' رقم موجود قبل كده في الباكينج ليست أو في القايمة دي: '+rangesOf(sk)}
function addNext(n){const last=cur.sel.length?cur.sel[cur.sel.length-1]:null;if(!last){cur.msg='اكتب أول رقم الأول ودوس «إضافة»';return}const w=last.length;let x=parseInt(last,10),c=0,g=0;const sk=[];while(c<n&&g<500){x++;g++;const d=String(x).padStart(w,'0');if(addNum(d,true))c++;else sk.push(d)}cur.msg='';skipMsg(sk)}
function drawNums(el){const W=cur.spec;const k=cur.sel.length;const short=cur.sel.filter(d=>d.length<4);
 el.innerHTML=`<div class="h"><button type="button" data-pp="x">✕ إلغاء</button><b>أرقام الباليتات</b></div>${steps('nums')}
 <div class="sum"><div class="t">${specText(W)}</div><button type="button" data-pp="tospec">تعديل</button></div>
 <div class="ent"><div class="pin"><span>P</span><input id="ppn" inputmode="numeric" pattern="[0-9]*" autocomplete="off" maxlength="11" placeholder="رقم الاستيكر"></div><button type="button" class="btn" data-pp="add">إضافة</button></div>
 <div class="tools"><button type="button" data-pp="range" class="${cur.range?'on':''}">↔ من رقم لرقم</button><button type="button" data-addn="1">+1</button><button type="button" data-addn="5">+5</button><button type="button" data-addn="10">+10</button></div>
 ${cur.range?`<div class="rng"><div class="pin"><span>P</span><input id="ppa" inputmode="numeric" placeholder="من"></div><div class="pin"><span>P</span><input id="ppb" inputmode="numeric" placeholder="لحد"></div><button type="button" class="btn2" data-pp="addr">إضافة</button></div>`:''}
 ${cur.msg?`<div class="hint2">${esc(cur.msg)}</div>`:''}
 ${short.length?`<div class="hint2">⚠ ${esc(short.map(d=>'P'+d).join('، '))}: أقصر من 4 أرقام — أرقام الإنتاج زي P${String(parseInt(short[0],10)).padStart(4,'0')}. المحطة هترفض الرقم لو مش متسجل كده في الإنتاج</div>`:''}
 <div class="grid">${k?cur.sel.map(d=>`<button type="button" class="c on${d.length<4?' sh':''}" data-unsel="${esc(d)}">P${esc(d)}<small> ✕</small></button>`).join(''):'<div class="none">اكتب رقم الاستيكر اللي على الباليت ودوس «إضافة»<br>وبعدها +1 / +5 / +10 للأرقام اللي بعده</div>'}</div>
 <div class="ft"><div class="cnt"><b>${k}</b><div class="rgs">${k?esc(rangesOf(cur.sel)):'<span style="direction:rtl;display:block;color:#666">لسه مفيش أرقام</span>'}</div>${k?'<button type="button" data-pp="clr">مسح</button>':''}</div>
 <button type="button" class="btn go" data-pp="review" ${k?'':'disabled'}>${k?'مراجعة وتأكيد '+k+' باليت ←':'اكتب رقم واحد على الأقل'}</button></div>
 ${cur.confirm?`<div class="cf" data-pp="noconf"><div class="cfb" data-pp="none"><h3>هيتضاف ${k} باليت</h3><div class="big">${specText(W)}</div><div class="nums">${esc(rangesOf(cur.sel))}</div><div class="row2"><button type="button" class="btn2" data-pp="noconf">رجوع</button><button type="button" class="btn" data-pp="go">✓ تأكيد</button></div></div></div>`:''}`;
 cur.msg='';if(cur.focus&&!cur.confirm){const i=$(cur.range?'ppa':'ppn');if(i)i.focus();cur.focus=false}}
function draw(){const el=$('pp');if(!el||!cur)return;const sc0=el.querySelector('.body')||el.querySelector('.grid');const y=sc0?sc0.scrollTop:0;if(cur.step==='spec')drawSpec(el);else drawNums(el);const sc=el.querySelector('.body')||el.querySelector('.grid');if(sc&&cur.keep)sc.scrollTop=y;cur.keep=false}
function openNew(){const R=recent();cur={step:'spec',spec:R[0]?JSON.parse(JSON.stringify(R[0])):{v:'',s:'',c:'',b:'',n:'',mix:[]},edit:null,sel:[]};mount();draw()}
function startNums(W){cur={step:'nums',spec:W,edit:null,sel:[],focus:true};mount();draw()}
function openAdd(gi){const g=GR[gi];if(!g)return;const W=specOf(S.rows[g.rows[g.rows.length-1]]);startNums(W)}
function openEdit(gi){const g=GR[gi];if(!g)return;const W=specOf(g.r);const ns=new Set(g.rows.map(i=>String(S.rows[i].n||'')));if(ns.size!==1)W.n='';cur={step:'spec',spec:W,edit:g.rows.slice(),ek:g.rows.map(i=>({i,p:S.rows[i].p,g:gKey(S.rows[i])})),sel:[],nT:false};mount();draw()}
function setField(f,v){const W=cur.spec;W[f]=v;if(f==='s'&&v==='MIX'){W.mix=W.mix||[];W.n=String(mixSum(W)||'')}if(f==='s'&&v!=='MIX')W.mix=[]}
function nextNeed(){const W=cur.spec;const k=['v','c','s','b'].find(k=>!String(W[k]||'').trim());if(k)return $('g_'+k);if(W.s==='MIX'&&!mixOk(W))return $('g_mix');if(!keepN()&&W.s!=='MIX'&&!nOk(W.n))return $('g_n');return null}
function flashRows(a,b){for(let j=a;j<=b;j++){const x=document.querySelector(`[data-row="${j}"]`);if(x)x.classList.add('flash')}const f=document.querySelector(`[data-row="${a}"]`);if(f){const g=f.closest('.grpc');(g||f).scrollIntoView({block:'start'})}}
function create(){const W=cur.spec;const nums=cur.sel.slice();if(!nums.length)return;const key=gKey(W);const mix=W.s==='MIX';
 const mk=d=>{const o={p:d,v:W.v,s:W.s,c:W.c,b:W.b,n:String(mix?mixSum(W):AD(W.n).trim())};if(mix)o.mix=mixLines(W).map(x=>({s:x.s,n:String(x.n)}));return o};
 S.rows=S.rows.filter(filled);let at=-1;S.rows.forEach((r,i)=>{if(gKey(r)===key)at=i});if(at<0)at=S.rows.length-1;
 const made=nums.map(mk);S.rows.splice(at+1,0,...made);rememberSpec(W);closeS();save();renderRows();flashRows(at+1,at+nums.length);undoToast(nums,made)}
/* the rows are found again by number + old spec at save time (the other tab may have saved meanwhile and moved them) */
function editRows(){const out=[];(cur.ek||[]).forEach(k=>{let j=-1;if(S.rows[k.i]&&S.rows[k.i].p===k.p&&gKey(S.rows[k.i])===k.g)j=k.i;else if(k.p)j=S.rows.findIndex((r,x)=>!out.includes(x)&&r.p===k.p&&gKey(r)===k.g);if(j>=0&&!out.includes(j))out.push(j)});return out}
function applyEdit(){const W=cur.spec;const mix=W.s==='MIX';const idx=editRows();const n=idx.length;idx.forEach(i=>{const r=S.rows[i];if(!r)return;r.v=W.v;r.s=W.s;r.c=W.c;r.b=W.b;if(mix){r.mix=mixLines(W).map(x=>({s:x.s,n:String(x.n)}));r.n=String(mixSum(W))}else{delete r.mix;if(cur.nT||!keepN())r.n=String(AD(W.n).trim())}});
 if(specOk(W))rememberSpec(W);closeS();save();renderRows();toast('✓ اتعدلت المواصفة لـ '+n+' باليت')}
function undoToast(made,objs){let el=$('pundo');if(!el){el=document.createElement('div');el.id='pundo';document.body.appendChild(el)}
 el.innerHTML=`<span style="flex:1">✓ اتضاف ${made.length} باليت: ${esc(rangesOf(made))}</span><button type="button">تراجع</button>`;el.style.display='flex';
 el.querySelector('button').onclick=()=>{/* only the pallets just added are removed (by number + spec), so a count edited meanwhile stays; works even after the other tab saved */const keys=new Set(objs.map(o=>pkey(o.p)+'|'+gKey(o)));let n=0;S.rows=S.rows.filter(r=>{if(keys.has(pkey(r.p)+'|'+gKey(r))){n++;return false}return true});if(!S.rows.length)S.rows.push(blank());el.style.display='none';save();renderRows();toast('اتلغى — اتشال '+n+' باليت')};
 clearTimeout(undoToast.t);undoToast.t=setTimeout(()=>{el.style.display='none'},15000)}
document.addEventListener('input',e=>{if(!cur||cur.step!=='spec')return;const t=e.target;const W=cur.spec;
 if(t.id==='ppnn'){W.n=t.value;cur.nT=true}else if(t.dataset.mixn!==undefined){const m=W.mix[+t.dataset.mixn];if(m)m.n=t.value;W.n=String(mixSum(W)||'');const nn=$('ppnn');if(nn)nn.value=W.n;const ms=$('ppms');if(ms)ms.textContent='المجموع: '+mixSum(W)+' كرتونة'}else return;
 const go=document.querySelector('#pp [data-pp="tonums"]');if(go){const ok=specOk(W,keepN());go.style.background=ok?'':'#9db59f';go.textContent=goLabel(W)}});
document.addEventListener('keydown',e=>{if(!cur||cur.step!=='nums'||e.key!=='Enter')return;if(e.target.id==='ppn'){e.preventDefault();document.querySelector('#pp [data-pp="add"]').click()}else if(e.target.id==='ppa'||e.target.id==='ppb'){e.preventDefault();document.querySelector('#pp [data-pp="addr"]').click()}});
document.addEventListener('click',e=>{const t=e.target.closest('[data-pp],[data-sf],[data-sadd],[data-rec],[data-mixs],[data-nd],[data-addn],[data-unsel],[data-gadd],[data-gedit],#pAdd,#pLast');if(!t)return;
 if(t.id==='pAdd'){openNew();return}
 if(t.id==='pLast'){const R=recent();if(R[0])startNums(JSON.parse(JSON.stringify(R[0])));return}
 if(t.dataset.gadd!==undefined){openAdd(+t.dataset.gadd);return}
 if(t.dataset.gedit!==undefined){openEdit(+t.dataset.gedit);return}
 if(!cur)return;const W=cur.spec;
 if(t.dataset.rec!==undefined){const o=recent()[+t.dataset.rec];if(o)startNums(JSON.parse(JSON.stringify(o)));return}
 if(t.dataset.sf){setField(t.dataset.sf,t.dataset.sv);cur.keep=true;draw();const nx=nextNeed();if(nx&&t.dataset.sf!=='s')nx.scrollIntoView({block:'center',behavior:'smooth'});return}
 if(t.dataset.sadd){const f=t.dataset.sadd;const x=(prompt('اكتب '+NAMES[f]+' الجديد')||'').trim();if(x){if(!LST(f).includes(x)){XL[f].push(x);try{localStorage.setItem(XK,JSON.stringify(XL))}catch(_){}}setField(f,x)}cur.keep=true;draw();return}
 if(t.dataset.mixs){W.mix=W.mix||[];const j=W.mix.findIndex(m=>m.s===t.dataset.mixs);if(j<0)W.mix.push({s:t.dataset.mixs,n:''});else W.mix.splice(j,1);W.n=String(mixSum(W)||'');cur.keep=true;draw();return}
 if(t.dataset.nd){if(W.s==='MIX')return;W.n=String(Math.max(1,(parseInt(AD(W.n),10)||0)+(+t.dataset.nd)));cur.nT=true;const nn=$('ppnn');if(nn){nn.value=W.n;nn.dispatchEvent(new Event('input',{bubbles:true}))}return}
 if(t.dataset.addn){addNext(+t.dataset.addn);cur.keep=true;draw();return}
 if(t.dataset.unsel){cur.sel=cur.sel.filter(x=>x!==t.dataset.unsel);cur.keep=true;draw();return}
 const a=t.dataset.pp;
 if(a==='x'){closeS();return}
 if(a==='clear'){cur.spec={v:'',s:'',c:'',b:'',n:'',mix:[]};draw();return}
 if(a==='tonums'){if(!specOk(W,keepN())){cur.tried=true;cur.keep=true;draw();const nx=nextNeed();if(nx)nx.scrollIntoView({block:'center'});return}if(cur.edit){applyEdit();return}cur.step='nums';cur.focus=true;draw();return}
 if(a==='tospec'){cur.step='spec';cur.confirm=false;draw();return}
 if(a==='add'){const i=$('ppn');if(i&&i.value){addNum(i.value)}cur.focus=true;cur.keep=true;draw();return}
 if(a==='range'){cur.range=!cur.range;cur.focus=true;draw();return}
 if(a==='addr'){const A=AD(($('ppa')||{}).value||'').replace(/\D/g,''),B=AD(($('ppb')||{}).value||'').replace(/\D/g,'');if(!A||!B){cur.msg='اكتب أول رقم وآخر رقم';draw();return}const x=parseInt(A,10),y=parseInt(B,10);if(y<x||y-x>299){cur.msg='المدى غلط (لحد 300 باليت مرة واحدة)';draw();return}const w=A.length;const sk=[];for(let n=x;n<=y;n++){const d=String(n).padStart(w,'0');if(!addNum(d,true))sk.push(d)}cur.msg='';skipMsg(sk);cur.range=false;cur.keep=true;draw();return}
 if(a==='clr'){cur.sel=[];draw();return}
 if(a==='review'){if(cur.sel.length){cur.confirm=true;cur.keep=true;draw()}return}
 if(a==='noconf'){cur.confirm=false;cur.keep=true;draw();return}
 if(a==='go'){create();return}});
$('rows').addEventListener('input',ev=>{const t=ev.target,i=+t.dataset.i,k=t.dataset.k;if(isNaN(i)||!k||t.tagName==='SELECT')return;let v=t.value;if(k==='p'){const c=AD(v).replace(/\D/g,'');if(c!==v){t.value=c}v=c}S.rows[i][k]=v;save();upd()});
$('rows').addEventListener('change',ev=>{const t=ev.target,i=+t.dataset.i,k=t.dataset.k;if(t.tagName!=='SELECT')return;let v=t.value;
 if(v==='__new'){const x=(prompt('اكتب '+NAMES[k]+' الجديد')||'').trim();if(x){if(!LST(k).includes(x)){XL[k].push(x);localStorage.setItem(XK,JSON.stringify(XL))}v=x}else v=S.rows[i][k]||'';S.rows[i][k]=v;save();renderRows();return}
 S.rows[i][k]=v;if(k==='c'){const w=document.querySelector(`[data-w="${i}"]`);if(w)w.value=PL.unitKg(v)?PL.unitKg(v)+' كجم':'—'}save();upd()});
$('rows').addEventListener('click',ev=>{const t=ev.target;if(t.dataset.rm!=null){const i=+t.dataset.rm;const r=S.rows[i];if((r.p||r.n)&&!confirm(r.p?'حذف الباليت P'+AD(r.p)+'؟':'حذف الباليت ده؟'))return;S.rows.splice(i,1);if(!S.rows.length)S.rows.push(blank());save();renderRows()}
});
function focusP(i){const el=document.querySelector(`input[data-i="${i}"][data-k="p"]`);if(el){el.focus();el.scrollIntoView({block:'center'})}}
function check(){const used=S.rows.filter(r=>r.p||r.v||r.s||r.n);const cnt={};used.forEach(r=>{const p=palKey(r);if(p)cnt[p]=(cnt[p]||0)+1});const errs=[];let bad=0;
 S.rows.forEach((r,i)=>{const o={};const any=r.p||r.v||r.s||r.n;if(any){if(!r.p)o.p='miss';else if(!validP(r))o.p='err';else if(cnt[palKey(r)]>1)o.p='dup';else if(AD(r.p).length<4)o.short=1;['v','s','c','b'].forEach(k=>{if(!r[k])o[k]='miss'});/* MIX made in the new entry carries its breakdown (r.mix) and must add up; a plain «MIX» typed as a custom size in v16 stays valid as before */if(r.s==='MIX'&&Array.isArray(r.mix)&&(!mixOk(r)||parseInt(AD(r.n),10)!==mixSum(r)))o.s='err';if(!(parseInt(AD(r.n),10)>0)||!/^\d+$/.test(AD(r.n)))o.n=r.n?'err':'miss'}r._st=o;if(Object.keys(o).filter(k=>k!=='short').length)bad++});
 if(!S.h.cont)errs.push('رقم الحاوية / البراد ناقص');if(!S.h.date)errs.push('تاريخ التحميل ناقص');
 const dups=Object.keys(cnt).filter(p=>cnt[p]>1);if(dups.length)errs.push('أرقام باليتات مكررة: '+dups.join('، '));const sh=S.rows.filter(r=>r._st&&r._st.short).length;
 if(bad)errs.push(bad+' باليت بياناتهم ناقصة أو غلط (باللون الأحمر/الأصفر)');if(!used.length)errs.push('مفيش باليتات');return{errs,used}}
function upd(){const{errs,used}=check();
 S.rows.forEach((r,i)=>{const row=document.querySelector(`[data-row="${i}"]`);if(!row)return;const st=r._st||{};row.classList.toggle('dup',st.p==='dup');row.classList.toggle('short',!!st.short);
  row.querySelectorAll('[data-k]').forEach(el=>{const k=el.dataset.k,s=st[k];el.classList.toggle('err',s==='err'||s==='dup');el.classList.toggle('miss',s==='miss')});
  const m=row.querySelector('[data-m]');m.textContent=st.p==='err'?'رقم الباليت لازم يكون أرقام بس':st.p==='dup'?'رقم الباليت ده متكرر (نفس رقم باليت تاني — مثلاً 1 و 0001)':st.short?'⚠ الرقم أقصر من 4 أرقام — أرقام الإنتاج زي P'+String(parseInt(AD(r.p),10)).padStart(4,'0')+'. المحطة هترفض P'+AD(r.p)+' لو مش متسجل كده في الإنتاج':st.n==='err'?'عدد الكراتين لازم رقم صحيح أكبر من صفر':st.s==='err'?'تفصيل MIX ناقص أو مجموعه مش مساوي للعدد — دوس «تعديل المواصفة»':(st.v||st.s||st.c||st.b)?'مواصفة الباليت ناقصة — دوس «كمّل المواصفة»':''});
 const A=PL.analyse(used.filter(r=>validP(r)).map(r=>({...r,P:palId(r),n:AD(r.n),s:sizeLabel(r)})));
 $('stat').innerHTML=`${A.P} باليت<br>${nf(A.N)} كرتونة`;
 let b='';A.list.forEach(g=>{g.sizes.forEach((x,j)=>{b+=`<tr>${j?'':`<td rowspan="${g.sizes.length}"><b>${esc(g.v)}</b></td>`}<td dir="ltr">${esc(x.s)}</td><td>${x.rows.length}</td><td>${nf(x.n)}</td></tr>`});b+=`<tr class="sub"><td colspan="2">إجمالي ${esc(g.v)}</td><td>${g.p}</td><td>${nf(g.n)}</td></tr>`});
 $('sum').innerHTML=A.P?`<table class="sum"><tr><th>الصنف</th><th>المقاس</th><th>باليتات</th><th>كراتين / صناديق</th></tr>${b}<tr class="gt"><td colspan="2">الإجمالي العام</td><td>${A.P}</td><td>${nf(A.N)}</td></tr></table>`:'<div class="hint">لسه مفيش باليتات</div>';
 $('alerts').innerHTML=errs.length?errs.map(x=>`<div class="a-bad">⚠ ${esc(x)}</div>`).join(''):'<div class="a-ok">✔ البيانات كاملة — جاهز لعمل الـ PDF</div>';paintHeads()}
function data(){return{h:{...S.h,cont:(S.h.cont||'').trim(),freight:AD(S.h.freight),adv:AD(S.h.adv)},rows:check().used.map(r=>({p:AD(r.p),P:palId(r),v:r.v,s:sizeLabel(r),c:r.c,b:r.b,n:AD(r.n)}))}}
function ready(){const{errs}=check();if(errs.length){alert('مينفعش نطلع الـ PDF قبل تصليح:\n\n• '+errs.join('\n• '));return false}return true}
function remember(){['customer','dest','line','driver'].forEach(k=>{const v=(S.h[k]||'').trim();if(v&&!HI[k].some(x=>x===v||(k==='customer'&&nameKey(x)===nameKey(v)))){HI[k].unshift(v);HI[k]=HI[k].slice(0,30)}});localStorage.setItem(HK,JSON.stringify(HI))}
/* قبل الـ PDF: الرقم المرجعي لازم يكون بتاريخ التحميل، ولو نفس الفورم اتطبع قبل كده لعربية تانية → رقم جديد */
function refCheck(){if(syncRef())toast('الرقم المرجعي اتظبط على تاريخ التحميل: '+S.h.ref);const sg=sigOf(S.h);
 if(S.h.sig&&S.h.sig!==sg){if(confirm('الباكينج ليست ده اتطبع قبل كده برقم '+S.h.ref+' لعربية/عميل تاني.\n\nموافق = دي عربية جديدة (رقم مرجعي جديد)\nإلغاء = ده تصحيح لنفس العربية (نفس الرقم)'))S.h.ref=newRef(S.h.date)}
 if(!(S.h.customer||'').trim()&&!confirm('اسم العميل فاضي. تكمّل من غير عميل؟'))return false;return true}
async function makePdf(){if(!ready())return null;if(!refCheck()){initHeader();return null}save();$('busy').style.display='flex';try{const d=data();const r=await PL.pdf(d);S.h.sig=sigOf(S.h);S.h.issued=new Date().toISOString();save();remember();initHeader();return{blob:r.blob,name:shareName(d.h)}}catch(e){alert('حصل خطأ أثناء تجهيز الـ PDF: '+e.message);return null}finally{$('busy').style.display='none'}}
/* v6: اسم الملف عربي + الرقم المرجعي (الكود) */
function shareName(h){const c=String(h.cont||'').trim().replace(/[\\/:*?"<>|]+/g,'-');return ['باكينج ليست العلا',h.ref,c,h.date].filter(Boolean).join(' — ')+'.pdf'}
/* v6: معاينة داخل البرنامج ثم «إرسال واتساب» (الملف نفسه). مفيش تحميل تلقائي — «تحميل» من جوه المعاينة بس */
function preview(f){PdfShare.open(f.blob,f.name,{title:'باكينج ليست '+(S.h.ref||'')})}
function download(f){const u=URL.createObjectURL(f.blob);const a=document.createElement('a');a.href=u;a.download=f.name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),60000);toast('✔ اتحفظ: '+f.name)}
$('bPdf').onclick=$('pvPdf').onclick=async()=>{const f=await makePdf();if(f)preview(f)};
$('bShare').onclick=async()=>{const f=await makePdf();if(f)preview(f)};
$('bPrev').onclick=async()=>{$('busy').style.display='flex';try{const w=$('pvw');const fit=await PL.preview(data(),w);const sc=Math.min(1,(window.innerWidth-24)/794);w.style.transform=`scale(${sc})`;w.style.height=(1123*sc)+'px';$('pv').style.display='block';if(fit.scale<1||fit.k<1)toast('تم تصغير الخط تلقائياً عشان الباكينج يطلع في صفحة واحدة')}finally{$('busy').style.display='none'}};
$('pvClose').onclick=()=>{$('pv').style.display='none'};
$('bNew').onclick=()=>{if(!confirm('بدء باكينج ليست جديد؟ البيانات الحالية هتتمسح من الشاشة (ابعت الـ PDF الأول).'))return;S={h:{ref:newRef(today()),date:today(),kind:S.h.kind||'براد'},rows:[blank()]};save();initHeader();renderRows()};
window.APP={data,check,render:()=>{initHeader();renderRows()},set(x){S.h=x.h;S.rows=x.rows;save();initHeader();renderRows()}};
initHeader();renderRows();save();
if(_reuse)setTimeout(()=>toast('الفورم ده اتطبع يوم قديم ← التاريخ بقى النهارده ورقم مرجعي جديد '+S.h.ref),300);else if(_fixed)setTimeout(()=>toast('الرقم المرجعي اتظبط على تاريخ التحميل: '+S.h.ref),300);
Object.defineProperty(window.APP,'S',{get:()=>S});window.APP.syncRef=syncRef;window.APP.nameKey=nameKey;window.APP.newRef=newRef;
})();
