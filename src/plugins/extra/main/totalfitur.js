
let handler = async (m, { registry }) => {
  let totalPlugins = registry.plugins.size
  let totalCommands = registry.commands.size

  let text = `*TOTAL FITUR*\n\n` +
    `• Plugin : ${totalPlugins}\n` +
    `• Command : ${totalCommands}`

  await m.reply(text)
}

handler.help = ['totalfitur']
handler.tags = ['main']
handler.command = /^(totalfitur|totalfeature|totalplugins|totalcmd|fitur)$/i

export default handler
