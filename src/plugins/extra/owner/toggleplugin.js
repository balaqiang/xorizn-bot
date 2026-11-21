
import { databaseApi } from '../../../lib/extra/database.js'

function getDisabledDb() {
  if (false) {
    return global.db.getDisabledPlugins()
  }
  return databaseApi.getDisabledPlugins()
}

function saveDisabledDb(data) {
  if (false) {
    return global.db.setDisabledPlugins(data)
  }
  return databaseApi.setDisabledPlugins(data)
}

let handler = async (m, { text, args, usedPrefix, command, registry }) => {
  const query = (args[0] || text || '').toLowerCase().trim()

  if (!query) {
    const disabled = getDisabledDb()
    return m.reply(
      `Format penggunaan:\n` +
      `• *${usedPrefix + command} <nama_perintah/plugin>*\n\n` +
      `*Daftar Plugin Nonaktif:*\n` +
      (disabled.length ? disabled.map(p => `• ${p}`).join('\n') : 'Tidak ada plugin yang dinonaktifkan.')
    )
  }

  const plugin = registry.getCommand(query)
  const targetName = plugin ? plugin.primaryCommand : query
  let disabledList = getDisabledDb()

  const isDisable = command.includes('off') || command.includes('disable')
  const isEnable = command.includes('on') || command.includes('enable')

  if (isDisable) {
    if (disabledList.includes(targetName)) {
      return m.reply(`Plugin *${targetName}* sudah dalam keadaan nonaktif.`)
    }
    disabledList.push(targetName)
    saveDisabledDb(disabledList)
    return m.reply(`Berhasil menonaktifkan plugin/fitur *${targetName}*.`)
  }

  if (isEnable) {
    if (!disabledList.includes(targetName)) {
      return m.reply(`Plugin *${targetName}* sudah dalam keadaan aktif.`)
    }
    disabledList = disabledList.filter(p => p !== targetName)
    saveDisabledDb(disabledList)
    return m.reply(`Berhasil mengaktifkan kembali plugin/fitur *${targetName}*.`)
  }

  if (disabledList.includes(targetName)) {
    disabledList = disabledList.filter(p => p !== targetName)
    saveDisabledDb(disabledList)
    return m.reply(`Berhasil mengaktifkan plugin/fitur *${targetName}*.`)
  } else {
    disabledList.push(targetName)
    saveDisabledDb(disabledList)
    return m.reply(`Berhasil menonaktifkan plugin/fitur *${targetName}*.`)
  }
}

handler.command = ['pluginoff', 'pluginon', 'disableplugin', 'enableplugin', 'toggleplugin']
handler.owner = true
handler.group = false
handler.private = false
handler.admin = false
handler.botadmin = false
handler.premium = false
handler.noJadiBot = false

export default handler
