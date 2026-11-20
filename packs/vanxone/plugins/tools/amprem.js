const axios = require('axios');
const crypto = require('crypto');

const cfg = {
  key: 'AIzaSyDtG1AU22ErnQD60AzBAcaknySiz9_CEq0',
  idt: 'https://www.googleapis.com/identitytoolkit/v3/relyingparty',
  stk: 'https://securetoken.googleapis.com/v1/token',
  vfy: 'https://us-central1-alight-creative.cloudfunctions.net/verifyPurchase'
};
const dip = () => [crypto.randomInt(1,255), crypto.randomInt(0,255), crypto.randomInt(1,255)].join('.');
const sp = h => ({...h, 'x-forwarded-for': dip(), 'x-real-ip': dip() });
const h1 = { 'content-type': 'application/json', 'x-android-package': 'com.alightcreative.motion', 'x-android-cert': 'ECA6BF91B8715A6F810ED0BBFC65B6CD578F52A8', 'user-agent': 'dalvik/2.1.0 (linux; u; android 15; 23127pn0cc build/bp1a.250505.005)' };
const h2 = { 'content-type': 'application/json; charset=utf-8', 'user-agent': 'okhttp/3.12.1' };
const bad = e => { const d = e.response?.data; return d? (typeof d === 'object'? JSON.stringify(d) : String(d)) : e.message; };

async function link(email){
  const c1={identifier:email,continueUri:'http://localhost'};
  const c2={requestType:6,email:email,androidInstallApp:true,canHandleCodeInApp:true,continueUrl:'https://alightcreative.com?ui_sid=0366624874&ui_sd=0',iosBundleId:'com.alightcreative.motion',androidPackageName:'com.alightcreative.motion',androidMinimumVersion:'585',clientType:'CLIENT_TYPE_ANDROID'};
  try{ await axios.post(`${cfg.idt}/createAuthUri?key=${cfg.key}`,c1,{headers:sp(h1)}); const r=await axios.post(`${cfg.idt}/getOobConfirmationCode?key=${cfg.key}`,c2,{headers:sp(h1)}); return {ok:true}; }catch(e){ return {ok:false,why:bad(e)}; }
}
function code(raw){
  if(!raw) return null; let s=String(raw); try{s=decodeURIComponent(s)}catch{} try{ const u=new URL(s); let c=u.searchParams.get('oobCode'); if(!c){ const n=u.searchParams.get('link')||u.searchParams.get('q'); if(n){ try{c=new URL(n).searchParams.get('oobCode')}catch{} } } if(c) return c; }catch{} const m=s.match(/oobCode=([a-zA-Z0-9_-]+)/i); return m?m[1]:null;
}
async function auth(email,raw){
  const c=code(raw); if(!c) return {ok:false,why:'Code tidak ditemukan'};
  try{ const a=await axios.post(`${cfg.idt}/emailLinkSignin?key=${cfg.key}`,{email:email,oobCode:c,clientType:'CLIENT_TYPE_ANDROID'},{headers:sp(h1)}); return {ok:true,id:a.data.idToken,ref:a.data.refreshToken}; }catch(e){ return {ok:false,why:bad(e)}; }
}
async function pro(id,customId){
  const o=customId||('neo-'+crypto.randomBytes(6).toString('hex')); const b={data:{productId:'am.full.sub.annual.19q4',token:'mmgaobamlahbbeccfplmbkbb.AO-J1OzqG0or_GJJIx-ms8GrTm-jaglCRfhQSRPUZKpl2YspYS-oN7_94uv8RC5vQbvd_Ios2pPDStZ2n7F0hLE3FiOU7HS3R6Fquulv5xLXFECSv4ctElw',skuType:'subs',orderId:o}};
  const h={...h2,authorization:'Bearer '+id,'firebase-instance-id-token':'cSDnCyp3T-uwp07z3tL86T:APA91bFkmvvsHw5nnqa1SBFci-99DRsKClLiETdRrVcJjS5yBx1v_FbCb1d8WhBuea_zmwnYBktyTIzcRhN4b6uNOUur9wPc0gKXmJDoZic0LhNq5V2s0xI'};
  try{ await axios.post(cfg.vfy,b,{headers:sp(h)}); return {ok:true,order:o}; }catch(e){ return {ok:false,why:bad(e)}; }
}

const sessions = new Map();

module.exports = {
  name: 'amprem',
  command: ['amprem','amprem-send','amprem-verif'],
  category: 'tools',
  desc: 'Alight Motion Premium Sender & Verif',
  usage: '<email> | <link>',
  run: async ({ sock, msg, from, sender, args, text, prefix, reply }) => {
    if(!text) return reply(`⚠️ Format salah!\n\n📌 Cara:\n1️⃣ ${prefix}amprem-send eaaavan4@gmail.com\n2️⃣ ${prefix}amprem-verif eaaavan4@gmail.com | <link>\n3️⃣ ${prefix}amprem-verif email | link | CUSTOM-ID`);

    if(text.includes('|')){
      const parts=text.split('|').map(p=>p.trim());
      const em=parts[0]; const linkUrl=parts[1]; const customId=parts[2]||null;
      if(!em||!linkUrl) return reply(`Format: ${prefix}amprem-verif email | link`);
      const v=await auth(em,linkUrl);
      if(!v.ok) return reply(`❌ Gagal verif: ${v.why}`);
      await reply(`✅ Login OK!\n📧 ${em}\n⏳ Promosi...`);
      const q=await pro(v.id,customId);
      if(q.ok) return reply(`✅ *PREMIUM SUCCESS!*\n📧 ${em}\n🆔 Order: ${q.order}\n🎉 Premium aktif!`);
      else return reply(`❌ Gagal promo: ${q.why}`);
    }else{
      const isEmail=text.includes('@')&&!text.includes('http');
      const isLink=text.includes('http');
      if(isEmail){
        const r=await link(text.trim());
        if(r.ok){
          const s=sessions.get(sender)||{}; s.email=text.trim(); sessions.set(sender,s);
          return reply(`✅ Link terkirim ke ${text.trim()}\n📬 Cek inbox/spam\nLanjut: ${prefix}amprem-verif ${text.trim()} | <link>`);
        }else return reply(`❌ Gagal: ${r.why}`);
      }else if(isLink){
        const sess=sessions.get(sender);
        let em=sess?.email;
        // coba ambil email dari args kalau user lupa session
        if(!em && args[0] && args[0].includes('@')) em=args[0];
        if(!em) return reply(`Email belum ada! Pakai format lengkap:\n${prefix}amprem-verif email | ${text}`);
        const v=await auth(em,text);
        if(!v.ok) return reply(`❌ Gagal verif: ${v.why}`);
        await reply(`✅ Login OK! Promosi...`);
        const q=await pro(v.id,null);
        if(q.ok) return reply(`✅ PREMIUM SUCCESS!\n📧 ${em}\n🆔 ${q.order}`);
        else return reply(`❌ Gagal: ${q.why}`);
      }else{
        return reply(`Email gak valid wok!\nContoh: ${prefix}amprem-send eaaavan4@gmail.com`);
      }
    }
  }
};
