
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const pluginsDir = path.resolve(__dirname, '..')

let handler = async (m, { text, usedPrefix, command, registry }) => {
  const query = (text || '').trim().toLowerCase()

  if (!query) {
    return m.reply(`Format salah!\nContoh:\n*${usedPrefix}${command} menu*\natau\n*${usedPrefix}${command} main/menu.js*`)
  }

  let targetFilePath = ''

  for (const [filePath, pluginData] of registry.plugins.entries()) {
    const rel = pluginData.relativePath.toLowerCase()
    const primary = pluginData.primaryCommand.toLowerCase()
    const allCmds = pluginData.allCommands.map(c => c.toLowerCase())

    if (
      rel === query ||
      rel === `${query}.js` ||
      path.basename(rel, '.js') === query ||
      primary === query ||
      allCmds.includes(query)
    ) {
      targetFilePath = filePath
      break
    }
  }

  if (!targetFilePath) {
    let candidate = query
    if (!candidate.endsWith('.js')) candidate += '.js'
    const directPath = path.resolve(pluginsDir, candidate)
    if (fs.existsSync(directPath)) {
      targetFilePath = directPath
    }
  }

  if (!targetFilePath || !fs.existsSync(targetFilePath)) {
    return m.reply(`Plugin *"${query}"* tidak ditemukan di direktori plugins.`)
  }

  const content = fs.readFileSync(targetFilePath, 'utf-8')
  const relPath = path.relative(pluginsDir, targetFilePath)

  if (content.length > 60000) {
    return await sock.sendMessage(
      m.chat,
      {
        document: Buffer.from(content, 'utf-8'),
        fileName: path.basename(targetFilePath),
        mimetype: 'application/javascript',
        caption: `📄 Plugin: \`plugins/${relPath}\``
      },
      { quoted: m.raw }
    )
  }

  return m.reply(content)
}

handler.command = ['getplugin', 'gp', 'gf', 'getfile']
handler.owner = true
handler.premium = false
handler.group = false
handler.private = false
handler.admin = false
handler.botadmin = false
handler.noJadiBot = false

export default handler
