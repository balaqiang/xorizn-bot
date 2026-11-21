
const sendCecan = async (sock, m, reply, category) => {
    try {
        const url = global.API('kyzz', `/api/cecan/${category}`, {}, 'apikey')
        await sock.sendMessage(m.chat, {
            image: { url },
            caption: `🎴 Cewe Random — ${category}`
        }, { quoted: m })
    } catch (e) {
        console.error(`[CEWERANDOM:${category}]`, e.response?.data || e)
        if (typeof reply === 'function') {
            reply(`❌ Gagal ambil gambar ${category}.`)
        } else if (typeof m.reply === 'function') {
            m.reply(`❌ Gagal ambil gambar ${category}.`)
        }
    }
}

export default sendCecan
