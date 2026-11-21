export const FEATURE_CREDIT = "Fitur By: xorizn-bot\nSaluran Resmi: https://whatsapp.com/channel/0029VbEAM5cGJP8FzJH1JH0R";


/*
*Plugins : Rpg-Reedem*
*atur sesuai sc mu ya adick adick*
   *Credits :*
https://whatsapp.com/channel/0029VbEAM5cGJP8FzJH1JH0R

*/


const pluginConfig = {
  name: "reedem",
  alias: [],
  category: "rpg",
  description: "",
  usage: "",
  example: "",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 3,
  energi: 1,
  isEnabled: true,
};

async function handler(m, { sock, args }) {
    const conn = sock;
  try {
    if (args.length === 0) return conn.reply(m.chat, '[❗] Silakan masukkan kode redeemnya', m)
    
    let kodeValid = ['zenzxcukiganteng']; // ganti aja
    let user = global.db.data.users[m.sender];
    
    if (!user.lastcode) user.lastcode = 0;
    
    if (kodeValid.includes(args[0])) {
      let waktuSekarang = new Date();
      let waktuTerakhir = new Date(user.lastcode);
      let selisihWaktu = waktuSekarang - waktuTerakhir;
      
      if (selisihWaktu > 86400000) { // 1 hari
        user.lastcode = waktuSekarang.getTime();
        user.exp += 250000;
        user.limit += 25;
        user.bank += 25000;
        user.money += 250000;
        conn.reply(m.chat, '*🎉🙀Congratulations!*\n\nKamu telah mendapatkan:\n+25000 XP\n+25000 Money\n+25000 Nabung Money\n+25 Limit', m)
      } else {
        conn.reply(m.chat, '[🐣]Kode sudah digunakan, harap tunggu sampai besok!', m)
      }
    } else {
      conn.reply(m.chat, '[❌] Kode redeem tidak valid!', m)
    }
  } catch (e) {
    console.error(e);
    conn.reply(m.chat, '[🐧]Terjadi kesalahan.', m)
  }
}

/*
https://whatsapp.com/channel/0029VbEAM5cGJP8FzJH1JH0R   

Sesuaikan sama sc mu
*/

export { pluginConfig as config, handler };
