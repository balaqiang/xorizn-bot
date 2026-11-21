const pluginConfig = {
  name: "tocodeqr",
  alias: ["qrurl", "linktoqr"],
  category: "tools",
  description: "Convert link menjadi QR Code",
  usage: ".tocodeqr <link>",
  example: ".tocodeqr https://youtube.com",
  cooldown: 3,
  energi: 0,
  isOwner: false,
  isGroup: false,
  isPrivate: false,
  isPremium: false,
  isEnabled: true,
};

async function handler(m, { sock }) {

  const text = m.args[0]

  if (!text) {
    return m.reply(
`🌸 *XORIZN-BOT QR GENERATOR*

Konichiwa darling ${m.pushName || ""} ✨

Gunakan seperti ini yaa :

.tocodeqr https://example.com

xorizn-bot akan mengubah link itu
menjadi QR Code yang bisa discan 😋`
    )
  }

  try {

    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(text)}`

    await sock.sendMessage(m.chat, {
      image: { url: qrUrl },
      caption:
`💗 *XORIZN-BOT QR CODE*

🔗 Link :
${text}

✨ Scan QR ini untuk membuka link nya yaa darling`
    }, { quoted: m })

  } catch (err) {

    m.reply(
`❌ *ERROR*

xorizn-bot gagal membuat QR Code 😢

${err.message}`
    )

  }

}

export { pluginConfig as config, handler };
