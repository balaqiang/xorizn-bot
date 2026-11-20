module.exports = {
  name: 'cs',
  command: ['cs','channelsend','cstatus'],
  category: 'tools',
  desc: 'Kirim status ke channel',
  owner: true,
  run: async ({ sock, msg, from, args, text, reply }) => {
    if (!text) return reply("Cara: .cs tes | atau .cs <teks> | <link channel>\nContoh: .cs Halo guys https://whatsapp.com/channel/0029Vb7JOvhEwEjnQgO8Ui3d");
    
    let parts = text.split('|');
    let pesan = parts[0].trim();
    let channelUrl = parts[1] ? parts[1].trim() : (args[args.length-1]?.includes('whatsapp.com/channel') ? args[args.length-1] : null);
    
    if (!channelUrl) {
      // coba ambil dari args terakhir kalo gak pake |
      if (args.length > 1 && args[args.length-1].includes('whatsapp.com')) {
        channelUrl = args[args.length-1];
        pesan = args.slice(0,-1).join(' ');
      } else {
        return reply("Link channel mana? Contoh: .cs Halo | https://whatsapp.com/channel/...");
      }
    }
    
    try {
      if (!sock.newsletterCreateTextPost) {
        return reply("❌ Fungsi newsletterCreateTextPost gak ada. Update:\nnpm i @whiskeysockets/baileys@latest\n\nBaileys lu versi lama.");
      }
      
      const invite = channelUrl.split('/')[4] || channelUrl.split('/').pop();
      const meta = await sock.newsletterMetadata("invite", invite);
      if (!meta) return reply("❌ Channel gak ketemu");
      
      const jid = meta.id;
      // Kirim text ke channel
      await sock.newsletterCreateTextPost(jid, pesan);
      return reply(`✅ Berhasil kirim status ke channel: ${meta.name}\n\nPesan: ${pesan}`);
      
    } catch (e) {
      console.error(e);
      return reply(`❌ GAGAL KIRIM STATUS:\n${e.message}\n\nKemungkinan:\n1. Bot belum jadi admin channel\n2. Baileys belum update\nFix: npm i @whiskeysockets/baileys@latest`);
    }
  }
};
