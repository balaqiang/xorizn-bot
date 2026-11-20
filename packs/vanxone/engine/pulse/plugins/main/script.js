const handler = async (m, { sock, usedPrefix, text, getPluginStats }) => {
	const info = getPluginStats()

	let teks = `Hai @${m.sender.split("@")[0]}, berikut adalah informasi tentang script *${global.namaBot}*

*Source info*
- Script name : ${global.namaBot}
- Creator : ${global.namaOwner}
- Script type : ${global.typeSc}
- Total plugins : *${info.totalFiles}*
- Library : ${global.library}
- Version : ${global.versi}
- Runtime : ${global.rtBot}
- Database : ${global.data}

*Fetures on bot*
- Available *${info.totalFiles}* fitur  
- Auto reload Plugins, auto add command, & category command 
- Set menu
- Support rich mesage, a2ui, buttons, produk, call command with poll, dll (example code lumayan lengkap)
- Auto deteksi, jika user sudah punya username akan ambil @lid & jika user belum memiliki username akan ambil jid
- Template fake quoted 
- No enc 100%
- No newsletter follow 
- Rapih & ter struktur
- Stabil, no bad sessios 

Dll chat saja.

*📞 support contact:*
- +${global.owner[0]}
- ${global.tele}.t.me`

sock.sendProductList(m.chat, {
  text: teks,
  thumbnail: thumbnail,
  footer: "© " + global.namaBot,
  businessJid: '6285181833750@s.whatsapp.net',
  sections: [
    {
      title: global.namaBot,
      products: [
        { productId: "29024707263781599" }, 
      ]
    }
  ]
}, { quoted: qpix })
}

handler.command = ['sc', 'script']
export default handler