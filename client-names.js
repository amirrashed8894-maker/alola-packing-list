/* Al Ola client names, Arabic + English (Amir t199u, 27/11/2026). Shared by the packing-list app and Al-Ola Station 1.4.12.
   One client = {code, ar, en}. code = the Station party id (C1…C10). Only names found in Al Ola / Maggi data; nothing translated.
   Matching: Arabic spelling (hamza, ة/ه, ى/ي, tatweel, spaces, «شركة / مؤسسة» prefix) OR English (case, dots, dashes,
   «TRADING / COMPANY / CO / LLC / LTD …» words ignored) OR the code. */
(function(root){
'use strict';
const MASTER=[
 {code:'C1',ar:'جبار',en:'JABBAR NASSER ALBISHI TRADING CO'},
 {code:'C2',ar:'فاكهة الصيف',en:'SUMMER FRUIT TRADING COMPANY'},
 {code:'C3',ar:'حامد',en:'HAMED BIN SAEED BIN MUSAED TRADING COMPANY'},
 {code:'C4',ar:'فواكه الإنجازات',en:'FAWAKIH ALANJAZAT L.L.C'},
 {code:'C5',ar:'',en:'LLC "FORTUNE"'},
 {code:'C6',ar:'',en:'TADJ-TREID LLC'},
 {code:'C7',ar:'',en:'AL-HASSAN OVERSEAS PRIVATE LIMITED'},
 {code:'C8',ar:'',en:'BIC GIDA INSAAT PETROL TASIMACILIK VE DIS TIC.LTD.STI'},
 {code:'C9',ar:'',en:'RM GOLDEN WINGS GIDA YAZILIM VE DIS. TIC. LTD. STI.'},
 {code:'C10',ar:'',en:'ARMES ULUSLARARASI TASIMACILIK AMBALAJ GIDA INSAAT TAAHHUT ITHALAT IHRACAT SANAYI VE TIC. LTD.'}
];
const AD=s=>String(s==null?'':s).replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d)).replace(/[۰-۹]/g,d=>'۰۱۲۳۴۵۶۷۸۹'.indexOf(d));
const hasAr=s=>/[\u0600-\u06FF]/.test(String(s||''));
const hasLat=s=>/[A-Za-z]/.test(String(s||''));
/* same rule as packing list app.js nameKey and Station v141 custKey */
const arKey=s=>AD(s).trim().replace(/[\u0640\u064B-\u065F\u0670]/g,'').replace(/[أإآٱ]/g,'ا').replace(/ة/g,'ه').replace(/ى/g,'ي').replace(/ؤ/g,'و').replace(/ئ/g,'ي')
  .replace(/^\s*(مؤسس[هة]|موسس[هة]|شرك[هة]|مكتب|السيد|الساده|السادة)\s+/,'').replace(/[\s.\-_,،]+/g,'').toLowerCase();
const GEN=new Set(['CO','COMPANY','CORP','TRADING','TRADE','LLC','LTD','LIMITED','PRIVATE','PVT','EST','ESTABLISHMENT','THE','FOR','STI','TIC','INC','GROUP']);
const enKey=s=>{const w=AD(s).toUpperCase().replace(/L\.L\.C\.?/g,' LLC ').replace(/[^A-Z0-9]+/g,' ').trim().split(' ').filter(x=>x&&!GEN.has(x));return w.join('')};
const keyOf=s=>hasAr(s)?'a:'+arKey(s):(hasLat(s)?'e:'+enKey(s):'');
/* find a client in list (default MASTER + extra) by {code, ar, en}. Returns the list entry or null. */
function find(q,extra){q=q||{};const L=(extra||[]).concat(MASTER);const code=String(q.code||'').trim().toUpperCase();
 if(code){const h=L.find(c=>String(c.code||'').toUpperCase()===code);if(h)return h}
 const tries=[q.ar,q.en].filter(Boolean);
 for(const v of tries){if(hasAr(v)){const k=arKey(v);if(k){const h=L.find(c=>c.ar&&arKey(c.ar)===k)||L.find(c=>(c.alias||[]).some(a=>arKey(a)===k));if(h)return h}}
  else if(hasLat(v)){const k=enKey(v);if(k){const h=L.find(c=>c.en&&enKey(c.en)===k);if(h)return h}}}
 return null}
function label(ar,en){ar=String(ar||'').trim();en=String(en||'').trim();return ar&&en?ar+' / '+en:(ar||en)}
const api={MASTER,arKey,enKey,keyOf,find,label,hasAr,hasLat};
if(typeof module!=='undefined'&&module.exports)module.exports=api;
root.ClientNames=api;
})(typeof window!=='undefined'?window:globalThis);
