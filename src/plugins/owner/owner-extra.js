const fs = require('fs')
const path = require('path')
const st = require('../../lib/ownerx')
const { getUser, save } = require('../../lib/db')
const { getTargets, isBot, userOf } = require('../../lib/utils')

const ROOT = path.join(__dirname, '..', '..')
const onoff = (a) => (/^(on|aktif|1|true|nyala)$/i.test(a || '') ? true : /^(off|mati|0|false|nonaktif)$/i.test(a || '') ? false : null)
const SWITCH = { anticall: 'Tolak telepon otomatis', autoread: 'Baca pesan otomatis (centang biru)', autotyping: 'Status "mengetik…" saat memproses perintah' }
const tag = (j) => '@' + userOf(j)

function walk(dir, out = []) {
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, f.name)
    if (f.isDirectory()) { if (f.name !== 'node_modules') walk(p, out) } else if (f.name.endsWith('.js')) out.push(p)
  }
  return out
}

module.exports = {
  name: 'owner-extra',
  command: ['banchat', 'unbanchat', 'listbanchat', 'resetlimit', 'anticall', 'autoread', 'autotyping', 'statusowner', 'grepplugin', 'kirimpc', 'getdb', 'cleartmp'],
  category: 'owner',
  emoji: '👑',
  desc: 'Kontrol owner: banchat, resetlimit, anticall, autoread, autotyping, grepplugin, kirimpc, getdb, cleartmp',
  usage: 'banchat | resetlimit @user 50 | anticall on | grepplugin kata',
  owner: true,
  run: async ({ sock, msg, from, args, command, prefix, reply }) => {
    if (SWITCH[command]) {
      const v = onoff(args[0])
      if (v === null) return reply(`${SWITCH[command]}: *${st.data[command] ? 'ON' : 'OFF'}*\nPakai: ${prefix}${command} on / off`)
      st.data[command] = v
      st.save()
      return reply(`✅ ${SWITCH[command]} sekarang *${v ? 'ON' : 'OFF'}*`)
    }

    if (command === 'statusowner') {
      const sw = Object.entries(SWITCH).map(([k, d]) => `${st.data[k] ? '🟢' : '🔴'} ${k} — ${d}`)
      return reply(['👑 *STATUS KONTROL OWNER*', '', ...sw, `🔇 Chat di-banchat: ${st.data.banchat.length}`, '📦 Mode bot: lihat .mode'].join('\n'))
    }

    if (command === 'banchat' || command === 'unbanchat') {
      const jid = /@(g\.us|s\.whatsapp\.net)$/.test(args[0] || '') ? args[0] : from
      const has = st.data.banchat.includes(jid)
      if (command === 'banchat') {
        if (has) return reply('Chat ini sudah di-banchat.')
        st.data.banchat.push(jid)
        st.save()
        return reply('🔇 Chat ini di-banchat: bot tidak akan merespon perintah dari siapa pun (kecuali owner). Buka dengan .unbanchat')
      }
      if (!has) return reply('Chat ini tidak sedang di-banchat.')
      st.data.banchat.splice(st.data.banchat.indexOf(jid), 1)
      st.save()
      return reply('🔊 Banchat dibuka, bot aktif lagi di chat ini.')
    }

    if (command === 'listbanchat') {
      const l = st.data.banchat
      return reply(l.length ? `🔇 *CHAT DI-BANCHAT* (${l.length})\n\n${l.map((j, i) => `${i + 1}. ${j}`).join('\n')}` : 'Tidak ada chat yang di-banchat.')
    }

    if (command === 'resetlimit') {
      const all = /^all$/i.test(args[0] || '')
      const nominal = parseInt([...args].reverse().find((a) => /^\d{1,6}$/.test(a)) || '50', 10)
      if (all) {
        const list = require('../../lib/db').topUsers('level', Infinity)
        let n = 0
        for (const u of list) { getUser(u.id).limit = nominal; n++ }
        save()
        return reply(`✅ Limit ${n} user di-reset ke ${nominal}.`)
      }
      const t = getTargets(msg, args).filter((j) => !isBot(sock, j))
      if (!t.length) return reply(`Tag/reply user, atau "all".\nContoh: ${prefix}resetlimit @user 50\nContoh: ${prefix}resetlimit all 50`)
      t.forEach((j) => { getUser(j).limit = nominal })
      save()
      return sock.sendMessage(from, { text: `✅ Limit di-reset ke ${nominal}: ${t.map(tag).join(', ')}`, mentions: t }, { quoted: msg })
    }

    if (command === 'grepplugin') {
      const q = args.join(' ').trim()
      if (q.length < 3) return reply(`Tulis kata yang dicari (min 3 huruf).\nContoh: ${prefix}grepplugin sendMessage`)
      const hits = []
      for (const f of [...walk(path.join(ROOT, 'plugins')), ...walk(path.join(ROOT, 'lib'))]) {
        fs.readFileSync(f, 'utf8').split('\n').forEach((ln, i) => {
          if (ln.toLowerCase().includes(q.toLowerCase())) hits.push(`${path.relative(ROOT, f)}:${i + 1}  ${ln.trim().slice(0, 70)}`)
        })
      }
      if (!hits.length) return reply(`Tidak ada hasil untuk "${q}".`)
      return reply(`🔎 *GREP: ${q}* (${hits.length} hasil)\n\n${hits.slice(0, 25).join('\n')}${hits.length > 25 ? `\n… +${hits.length - 25} lagi` : ''}`)
    }

    if (command === 'kirimpc') {
      const num = (args[0] || '').replace(/\D/g, '')
      const isi = args.slice(1).join(' ').trim()
      if (num.length < 8 || !isi) return reply(`Format: ${prefix}kirimpc 628xxx pesan\nContoh: ${prefix}kirimpc 628123456789 Halo!`)
      await sock.sendMessage(`${num}@s.whatsapp.net`, { text: isi })
      return reply(`✅ Pesan terkirim ke ${num}.`)
    }

    if (command === 'getdb') {
      const dir = path.join(ROOT, 'database')
      const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith('.json')) : []
      const name = (args[0] || '').replace(/\.json$/i, '')
      if (!name) return reply(`🗄️ *DATABASE* (${files.length})\n\n${files.map((f) => `• ${f.replace('.json', '')}`).join('\n')}\n\nAmbil: ${prefix}getdb <nama>`)
      if (!files.includes(`${name}.json`)) return reply('❌ Database tidak ditemukan.')
      const buf = fs.readFileSync(path.join(dir, `${name}.json`))
      return sock.sendMessage(from, { document: buf, fileName: `${name}.json`, mimetype: 'application/json' }, { quoted: msg })
    }

    if (command === 'cleartmp') {
      const dirs = [path.join(ROOT, 'tmp'), path.join(ROOT, 'temp'), require('os').tmpdir()]
      let n = 0, size = 0
      const cutoff = Date.now() - 10 * 60 * 1000
      for (const d of dirs.slice(0, 2)) {
        if (!fs.existsSync(d)) continue
        for (const f of fs.readdirSync(d)) {
          const p = path.join(d, f)
          try { const s = fs.statSync(p); if (s.isFile() && s.mtimeMs < cutoff) { size += s.size; fs.unlinkSync(p); n++ } } catch {}
        }
      }
      return reply(`🧹 Bersih: ${n} file sementara dihapus (${(size / 1048576).toFixed(2)} MB).`)
    }
  }
}
