module.exports = {
  name: 'cscheck',
  command: ['cscheck','ccheck','channelcheck'],
  category: 'tools',
  desc: 'Cek apakah bot bisa posting di channel',
  run: async ({ sock, from, args, reply }) => {
    let url = args[0] || "";
    if (!url) return reply("Cara: .cscheck https://whatsapp.com/channel/0029VbEAM5cGJP8FzJH1JH0R");
    
    try {
      // xorizn-bot lama gak ada newsletterCanPostStatus, kita cek manual
      const id = url.split('/')[4] || url.split('/').pop();
      if (!sock.newsletterMetadata) {
        return reply("❌ Baileys lu belum support channel.\nJalanin: npm i @whiskeysockets/baileys@latest");
      }
      
      const meta = await sock.newsletterMetadata("invite", id).catch(() => null) || 
                   await sock.newsletterMetadata("jid", id+"@newsletter").catch(() => null);
      
      if (!meta) return reply("❌ Channel gak ketemu / invite salah");
      
      let canPost = meta.role === "ADMIN" || meta.role === "OWNER" || meta.viewer_metadata?.role === "ADMIN";
      
      return reply(`✅ *CSCHECK*

ID: ${meta.id}
Name: ${meta.name}
Followers: ${meta.subscribers}
Role lu: ${meta.role || meta.viewer_metadata?.role || "GUEST"}
Bisa posting: ${canPost ? "✅ BISA" : "❌ TIDAK BISA (jadiin bot admin channel dulu)"}`);
    } catch (e) {
      return reply(`❌ Error: ${e.message}\n\nFix: update baileys -> npm i @whiskeysockets/baileys@latest`);
    }
  }
};
