const px = require('../../lib/premx')
const zp = require('../../lib/engine/pulse-owner')
const { getTargets, isBot } = require('../../lib/utils')
const { getUser, save } = require('../../lib/db')

const tag = (j) => '@' + String(j).split('@')[0].split(':')[0]
const dateId = (t) => new Date(t).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta', dateStyle: 'medium', timeStyle: 'short' })
const TRIAL_DAYS = 1
const DAILY_MONEY = 5000
const DAILY_LIMIT = 15

module.exports = {
  name: 'prem-extra',
  command: ['premhari', 'tambahprem', 'kurangprem', 'cabutprem', 'listpremhari', 'cekprem', 'premtrial', 'premdaily', 'fiturprem'],
  category: 'owner',
  emoji: '⭐',
  desc: 'Premium sementara: premhari, cekprem, premtrial, premdaily, listpremhari',
  usage: 'premhari @user <hari> | cekprem | premtrial | premdaily',
  run: async ({ sock, msg, from, sender, args, command, prefix, isOwner, reply }) => {
    const mention = (text, jids) => sock.sendMessage(from, { text, mentions: jids.map((j) => (j.includes('@') ? j : `${j}@s.whatsapp.net`)) }, { quoted: msg })
    const needOwner = () => reply('❌ Perintah ini khusus owner.')

    if (command === 'fiturprem') {
      return reply([
        '⭐ *KEUNTUNGAN PREMIUM*', '',
        '▬ Bebas pemakaian limit (fitur berat tidak memotong limit)',
        `▬ Bonus harian: ${prefix}premdaily (+${DAILY_LIMIT} limit & Rp${DAILY_MONEY})`,
        `▬ Cek masa aktif: ${prefix}cekprem`,
        `▬ Coba gratis ${TRIAL_DAYS} hari: ${prefix}premtrial (sekali per user)`, '',
        'Mau upgrade? Hubungi owner.'
      ].join('\n'))
    }

    if (command === 'cekprem') {
      const t = getTargets(msg, args)[0] || sender
      if (t !== sender && !isOwner) return reply('❌ Cek premium orang lain khusus owner.')
      if (!zp.isPremium(t)) return mention(`${tag(t)} bukan user premium.\nCoba ${prefix}premtrial atau hubungi owner.`, [t])
      const l = px.left(t)
      return mention(`⭐ *STATUS PREMIUM*\n\n▬ User: ${tag(t)}\n▬ Tipe: ${l === null ? 'Permanen ♾️' : 'Sementara'}${l === null ? '' : `\n▬ Sisa: ${px.fmt(l)}\n▬ Berakhir: ${dateId(px.st.data.exp[px.id(t)])}`}`, [t])
    }

    if (command === 'premtrial') {
      if (zp.isPremium(sender)) return reply('Kamu sudah premium, trial tidak diperlukan 😄')
      if (px.trialUsed(sender)) return reply('❌ Trial premium hanya bisa dipakai sekali per user.')
      px.markTrial(sender)
      px.give(sender, TRIAL_DAYS)
      return reply(`🎁 Trial premium ${TRIAL_DAYS} hari aktif! Cek dengan ${prefix}cekprem. Selamat mencoba ⭐`)
    }

    if (command === 'premdaily') {
      if (!zp.isPremium(sender) && !isOwner) return reply(`❌ Fitur khusus premium. Lihat ${prefix}fiturprem`)
      const d = px.st.data.daily
      const key = px.id(sender)
      const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' })
      if (d[key] === today) return reply('⏳ Bonus harian premium sudah diambil. Balik lagi besok ya!')
      d[key] = today
      px.st.save()
      const u = getUser(sender)
      u.money = (u.money || 0) + DAILY_MONEY
      u.limit = (u.limit || 0) + DAILY_LIMIT
      save()
      return reply(`🎁 *BONUS HARIAN PREMIUM*\n\n+ Rp${DAILY_MONEY.toLocaleString('id-ID')}\n+ ${DAILY_LIMIT} limit`)
    }

    if (!isOwner) return needOwner()

    if (command === 'listpremhari') {
      const e = Object.entries(px.st.data.exp).sort((a, b) => a[1] - b[1])
      const perm = zp.listPrem().filter((u) => !px.st.data.exp[u])
      if (!e.length && !perm.length) return reply('Belum ada user premium.')
      const lines = e.map(([u, t], i) => `${i + 1}. ${tag(u)} — ${px.fmt(t - Date.now())}`)
      const text = [`⭐ *PREMIUM SEMENTARA* (${e.length})`, '', ...(lines.length ? lines : ['(kosong)']), '', `♾️ *Permanen:* ${perm.length}`, ...perm.map((u) => `• ${tag(u)}`)].join('\n')
      return mention(text, [...e.map(([u]) => u), ...perm])
    }

    const targets = getTargets(msg, args).filter((j) => !isBot(sock, j))
    if (!targets.length) return reply(`Tag/reply user atau tulis nomor.\nContoh: ${prefix}${command} 628123456789${command === 'cabutprem' ? '' : ' 30'}`)

    if (command === 'cabutprem') {
      const done = targets.filter((j) => zp.delPrem(j) | px.clear(j))
      return mention(done.length ? `✅ Premium dicabut: ${done.map(tag).join(', ')}` : 'Bukan user premium.', done)
    }

    const dayArg = [...args].reverse().find((a) => /^\d{1,4}$/.test(a))
    const n = dayArg ? parseInt(dayArg, 10) : null
    if (!n || n < 1) return reply(`Tulis jumlah harinya.\nContoh: ${prefix}${command} @user 30`)

    if (command === 'kurangprem') {
      targets.forEach((j) => px.take(j, n))
      return mention(`✅ Masa premium dikurangi ${n} hari: ${targets.map(tag).join(', ')}`, targets)
    }
    const ends = targets.map((j) => px.give(j, n))
    return mention(`⭐ Premium ${n} hari diberikan:\n${targets.map((j, i) => `• ${tag(j)} → s/d ${dateId(ends[i])}`).join('\n')}`, targets)
  }
}
