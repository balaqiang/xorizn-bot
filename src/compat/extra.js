/**
 * Adapter fitur extra (ESM, ±268 perintah di src/plugins/extra). Memakai PluginRegistry & serializer bawaan (src/lib/extra),
 * tetapi berjalan di atas Baileys resmi lewat shim "xorizn-baileys" dan sock turunan (fake-quote
 * khas fitur extra hanya berlaku untuk balasan plugin extra).
 */
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import bot from '../core/bot.js'
import logger from '../core/logger.js'

const log = logger.child('extra')

export async function loadExtra() {
  const imp = (rel) => import(pathToFileURL(path.join(bot.config.paths.lib, 'extra', rel)).href)
  const [{ PluginRegistry }, { serialize }, { bindMessageHelpers }] = await Promise.all([
    imp('plugins.js'),
    imp('serializer.js'),
    imp('message.js')
  ])

  const registry = new PluginRegistry(bot.config.paths.extraPlugins)
  await registry.loadAll()

  const socks = new WeakMap()
  const prep = (real) => {
    if (socks.has(real)) return socks.get(real)
    const sock = Object.create(real)
    bindMessageHelpers(sock)
    socks.set(real, sock)
    return sock
  }

  const toExtraM = async (ctx, raw) => {
    const sock = prep(ctx.sock)
    const rm = await serialize(sock, raw)
    if (!rm) return { sock, rm: null }
    rm.isOwner = !!(ctx.isOwner || rm.isOwner)
    rm.isPremium = !!(ctx.isPremium || rm.isPremium || rm.isOwner)
    return { sock, rm }
  }

  const toEntries = () => {
    const list = []
    for (const p of registry.plugins.values()) {
      const names = p.commands.length ? p.commands : p.allCommands
      if (!names.length) continue
      const help = [].concat(p.handler.help || [])
      const primary = names.includes(p.primaryCommand) ? p.primaryCommand : names[0]
      list.push({
        name: primary,
        aliases: names,
        category: [].concat(p.handler.tags || [])[0] || p.category,
        description: p.handler.description || p.handler.desc || '',
        usage: String(help[0] || '').split(/\s+/).slice(1).join(' '),
        hidden: p.hidden,
        file: path.relative(bot.config.paths.root, p.filePath).replace(/\\/g, '/'),
        flags: {
          owner: p.owner,
          premium: p.premium,
          group: p.group || p.admin || p.botadmin,
          private: p.private,
          admin: p.admin,
          botAdmin: p.botadmin,
          nsfw: p.category === 'nsfw'
        },
        exec: async (m, ctx) => {
          const { sock, rm } = await toExtraM(ctx, m.raw)
          if (!rm) return
          rm.isAdmin = ctx.isAdmin
          rm.isBotAdmin = ctx.isBotAdmin
          rm.groupMetadata = ctx.groupMetadata
          rm.participants = ctx.participants
          await p.handler(rm, {
            sock,
            conn: sock,
            args: ctx.args,
            text: ctx.text,
            command: ctx.command,
            usedPrefix: ctx.prefix || '.',
            prefix: ctx.prefix || '.',
            registry,
            isOwner: rm.isOwner,
            isPremium: rm.isPremium,
            isAdmin: ctx.isAdmin,
            isUserAdmin: ctx.isAdmin,
            isBotAdmin: ctx.isBotAdmin,
            groupMetadata: ctx.groupMetadata,
            participants: ctx.participants,
            reply: (text, opt) => rm.reply(text, opt),
            react: (emoji) => rm.react(emoji)
          })
        }
      })
    }
    return list
  }

  bot.registry.register('extra', toEntries())
  const befores = [...registry.plugins.values()].filter((p) => typeof p.handler?.before === 'function')
  log.success(`${registry.plugins.size} plugin dimuat (${befores.length} hook before)`)

  return {
    name: 'extra',
    registry,
    async reload() {
      await registry.loadAll()
      bot.registry.register('extra', toEntries())
    },
    async passive(m, base) {
      if (!befores.length) return false
      const { sock, rm } = await toExtraM(base, m.raw)
      if (!rm) return false
      for (const p of befores) {
        try {
          if (await p.handler.before(rm, { sock, conn: sock, registry })) break
        } catch (err) {
          log.error(`before ${p.relativePath}:`, err.message)
        }
      }
      return false
    }
  }
}
