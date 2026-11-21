
import util from 'util'
import { exec } from 'child_process'

let handler = async (m, { sock, conn, text, command, usedPrefix }) => {
  const code = text || ''
  if (!code) return

  if (command === '$' || usedPrefix === '$') {
    exec(code, (err, stdout, stderr) => {
      if (err) return m.reply(String(err))
      if (stderr) return m.reply(stderr)
      if (stdout) return m.reply(stdout)
      m.reply('Done (no output)')
    })
    return
  }

  let result
  try {
    if (command === '=>' || usedPrefix === '=>') {
      result = await eval(`(async () => { return ${code} })()`)
    } else {
      result = await eval(`(async () => { ${code} })()`)
    }
  } catch (e) {
    result = e
  }

  const output = typeof result === 'string' ? result : util.inspect(result, { depth: 2 })
  await m.reply(output)
}

handler.command = ['eval', '>', '=>', '$']
handler.owner = true
handler.premium = false
handler.group = false
handler.private = false
handler.admin = false
handler.botadmin = false
handler.noJadiBot = false
handler.hidden = true

export default handler
