
let handler = async (m, { usedPrefix, registry }) => {
  const structure = registry.getMenuStructure()
  const categories = Object.keys(structure.categories).sort()

  let text = `╭─「 *DAFTAR PLUGIN AKTIF* 」\n`
  text += `│ ❃ Total Plugin : *${registry.plugins.size}*\n`
  text += `│ ❃ Total Perintah: *${registry.commands.size}*\n`
  text += `╰────────────────────\n\n`

  for (const cat of categories) {
    const plugins = structure.categories[cat] || []
    text += `📁 *KATEGORI: ${cat.toUpperCase()}* (${plugins.length})\n`
    for (let i = 0; i < plugins.length; i++) {
      const p = plugins[i]
      let badge = ' Ⓕ'
      if (p.owner) badge = ' Ⓞ'
      else if (p.premium) badge = ' Ⓟ'
      else if (p.admin) badge = ' Ⓐ'
      text += `  ${i + 1}. \`${p.name}\`${badge}\n`
    }
    text += `\n`
  }

  text += `💡 *Keterangan Badge:*\n`
  text += `Ⓞ : Khusus Owner | Ⓟ : Premium | Ⓐ : Admin | Ⓕ : Free\n\n`
  text += `_Gunakan *${usedPrefix}getplugin <nama>* untuk melihat kode plugin._`

  return m.reply(text.trim())
}

handler.command = ['listplugin', 'lp', 'plugins']
handler.owner = true
handler.premium = false
handler.group = false
handler.private = false
handler.admin = false
handler.botadmin = false
handler.noJadiBot = false

export default handler
