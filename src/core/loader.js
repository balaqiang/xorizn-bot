/**
 * Loader plugin native (folder src/plugins/core). Format plugin:
 *
 *   export default {
 *     command: ['kick', 'tendang'],   // nama pertama = nama utama
 *     category: 'group',              // default: nama folder
 *     description: 'Keluarkan anggota',
 *     usage: '@user',
 *     group: true, admin: true, botAdmin: true,   // juga: owner, premium, private, nsfw, hidden
 *     cooldown: 3,                    // detik (opsional)
 *     limit: 1,                       // biaya limit harian (pengguna free); panggil ctx.spendLimit() saat berhasil
 *     noRegister: true,               // boleh dipakai walau belum .daftar (saat wajib daftar aktif)
 *     async run(m, ctx) { ... },      // ctx: { sock, bot, args, text, command, prefix, group, isAdmin, ... }
 *     async before(m, ctx) { ... }    // opsional: dipanggil untuk SETIAP pesan, return true = hentikan
 *   }
 */
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import logger from './logger.js'

const log = logger.child('plugins')

function walk(dir) {
  if (!fs.existsSync(dir)) return []
  const out = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || entry.name.startsWith('_')) continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) out.push(...walk(full))
    else if (/\.(m?js)$/.test(entry.name)) out.push(full)
  }
  return out.sort()
}

export async function loadNativePlugins(dir) {
  const entries = []
  const hooks = []
  const failed = []
  for (const file of walk(dir)) {
    const rel = path.relative(dir, file).replace(/\\/g, '/')
    try {
      const mod = await import(`${pathToFileURL(file).href}?v=${Date.now()}`)
      const plugins = [].concat(mod.default || [])
      for (const p of plugins) {
        if (!p || typeof p !== 'object') continue
        if (typeof p.before === 'function' || typeof p.onParticipants === 'function' || typeof p.onOpen === 'function') {
          hooks.push({ ...p, file: rel })
        }
        if (typeof p.run !== 'function' || !p.command) continue
        const names = [].concat(p.command).map((c) => String(c).toLowerCase())
        entries.push({
          name: names[0],
          aliases: names,
          category: p.category || rel.split('/')[0] || 'other',
          description: p.description || p.desc || '',
          usage: p.usage || '',
          hidden: !!p.hidden,
          cooldown: p.cooldown,
          file: `plugins/${rel}`,
          flags: {
            owner: !!p.owner,
            premium: !!p.premium,
            group: !!p.group,
            private: !!p.private,
            admin: !!p.admin,
            botAdmin: !!p.botAdmin,
            nsfw: !!p.nsfw,
            limit: Math.max(0, Number(p.limit) || 0),
            noRegister: !!p.noRegister
          },
          plugin: p,
          exec: (m, ctx) => p.run(m, ctx)
        })
      }
    } catch (err) {
      failed.push({ file: rel, error: err.message })
      log.error(`gagal memuat plugins/${rel}:`, err.message)
    }
  }
  return { entries, hooks, failed }
}
