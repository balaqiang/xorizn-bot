/**
 * Adapter fitur vanXone (CommonJS, ±2.250 perintah dari 7 engine). Memuat lib/runtime.js lalu
 * mendaftarkan semua plugin di plugins/<kategori> ke registri core.
 */
import path from 'node:path'
import { createRequire } from 'node:module'
import bot from '../core/bot.js'
import logger from '../logger.js'
import { extractText } from '../core/serialize.js'
import { normalizeMessageContent } from 'baileys'

const log = logger.child('vanxone')

export async function loadVanxone() {
  const require = createRequire(path.join(bot.config.paths.lib, 'runtime.js'))
  const runtime = require('./runtime.js')
  runtime.init()
  const result = runtime.loadPlugins()

  const toEntries = () =>
    runtime.list().map((p) => {
      const names = [].concat(p.command).map((c) => String(c).toLowerCase())
      return {
        name: names[0],
        aliases: names,
        category: p.category || 'other',
        description: p.desc || '',
        usage: p.usage || '',
        hidden: !!p.hidden,
        file: p.__file ? path.relative(bot.config.paths.root, p.__file).replace(/\\/g, '/') : '',
        flags: {
          owner: !!p.owner,
          premium: !!p.premium,
          group: !!(p.group || p.admin || p.botAdmin),
          admin: !!p.admin,
          botAdmin: !!p.botAdmin,
          nsfw: p.category === 'nsfw' || !!p.nsfw
        },
        exec: (m, ctx) =>
          runtime.execute(p, ctx.sock, m.raw, {
            isOwner: ctx.isOwner,
            command: ctx.command,
            prefix: ctx.prefix,
            args: ctx.args,
            text: ctx.text,
            groupMetadata: ctx.groupMetadata,
            isAdmin: ctx.isAdmin,
            isBotAdmin: ctx.isBotAdmin
          })
      }
    })

  bot.registry.register('vanxone', toEntries())
  // Plugin vanXone bisa memuat ulang dirinya (.reload / .addfitur) → daftarkan ulang ke core
  const origReload = runtime.loadPlugins
  const reload = () => {
    const r = origReload()
    bot.registry.register('vanxone', toEntries())
    return r
  }

  log.success(`${runtime.list().length} plugin (${result.failed.length} gagal) + ${runtime.hookList().length} hook dimuat`)
  if (result.failed.length) log.debug('plugin gagal:', result.failed.slice(0, 20))

  return {
    name: 'vanxone',
    failed: result.failed,
    reload,
    async passive(m, base) {
      const content = normalizeMessageContent(m.raw.message)
      return runtime.passive(base.sock, m.raw, {
        isOwner: base.isOwner,
        body: m.text || extractText(content),
        prefixes: bot.settings.prefixes,
        dispatch: async (body) => {
          const { dispatchText } = await import('../core/handler.js')
          return dispatchText(m, body)
        }
      })
    },
    onParticipants: (sock, ev) => runtime.onParticipants(sock, ev),
    onOpen: (sock) => runtime.onOpen(sock)
  }
}
