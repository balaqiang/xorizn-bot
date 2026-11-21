
import axios from "axios"

const handler = async (m, { conn, sock, text, reply, usedPrefix, command }) => {
  const client = conn || sock
  if (!text) {
    return reply(`🔍 *APKMODY SEARCH*\n\nPencarian aplikasi & game mod APKMody.\n\nContoh:\n${usedPrefix}${command} GTA\n${usedPrefix}${command} Minecraft`)
  }

  await m.react("⏳")

  try {
    const apiUrl = global.API("kyzz", "/api/search/apkmody", { query: text, page: 1 }, "apikey")
    const { data } = await axios.get(apiUrl, { timeout: 15000 }).catch(() => ({ data: null }))

    let items = []
    if (data && data.status && data.result && Array.isArray(data.result.items)) {
      items = data.result.items
    }

    if (items.length === 0) {
      await m.react("✖️")
      return reply(`❌ Aplikasi *"${text}"* tidak ditemukan di APKMody.`)
    }

    await m.react("✅")

    let caption = `📦 *APKMODY SEARCH RESULTS*\n\nDitemukan *${items.length}* hasil untuk *"${text}"*.\n\n`
    items.slice(0, 10).forEach((item, idx) => {
      caption += `*${idx + 1}. ${item.title}*\n`
      caption += `   ℹ️ Version: ${item.version || "-"}\n`
      caption += `   🔗 Link: ${item.url || "-"}\n\n`
    })
    return reply(caption)
  } catch (e) {
    console.error("[APKMODY SEARCH ERROR]", e)
    await m.react("❌")
    return reply("❌ Terjadi kesalahan saat mengakses API APKMody.")
  }
}

handler.help = ["apkmody <query>", "apkmodysearch <query>"]
handler.tags = ["search"]
handler.command = ["apkmody", "apkmodysearch"]
handler.limit = true;
handler.register = true

export default handler
