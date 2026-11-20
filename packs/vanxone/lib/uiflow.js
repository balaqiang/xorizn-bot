// lib/uiflow.js — helper tampilan baru untuk .menu dan plugins/ui/*
//
// Pola tombol (satu tombol "Tap Here!" -> sheet "Select Menu"):
//   [ Saluran (link) , Owner (link) , Command (list kategori) ]
const ui = require('./ui')
const { btn } = require('./interactive')
const { getUser, expNeeded, topUsers } = require('./db')
const { userOf } = require('./utils')
const { catIcon } = require('./menuicons')

const line = '──────────────────────'

// ---------------------------------------------------------------- BARIS LIST ("command")
// Badge di kanan baris = header ("81 Fitur" / "🔥 Populer (65 Fitur)")
function categoryRows(order, groups, prefix) {
  const popular = new Set(
    [...order]
      .filter((c) => groups[c].length >= 10)
      .sort((a, b) => groups[b].length - groups[a].length)
      .slice(0, 2)
  )
  return order.map((c) => {
    const n = groups[c].length
    return {
      header: popular.has(c) ? `🔥 Populer (${n} Fitur)` : `${n} Fitur`,
      title: `${catIcon(c)} ${ui.labelOf(c)}`,
      description: ui.longDescOf(c).slice(0, 72),
      id: `${prefix}menu ${c}`
    }
  })
}

function visualRows(prefix) {
  return [
    { header: 'Visual', title: '🎠 Katalog Kategori', description: 'Kartu bergambar yang bisa digeser', id: `${prefix}menu kartu` },
    { header: 'Visual', title: '🪪 Kartu Saya', description: 'Kartu player bergambar: level, saldo, peringkat', id: `${prefix}kartu` },
    { header: 'Visual', title: '📊 Dashboard', description: 'Status server: CPU, RAM, uptime, dan ping', id: `${prefix}dashboard` },
    { header: 'Visual', title: '🏆 Podium', description: 'Juara level tertinggi di bot ini', id: `${prefix}podium` }
  ]
}

function linkButtons(config) {
  if (!ui.OPTS.urlButtons) return []
  const L = config.links || {}
  const out = []
  if (/^https?:\/\//i.test(L.channel || '')) out.push(btn.url('Saluran Resmi', L.channel))
  if (L.wa) out.push(btn.url('Hubungi Owner', `https://${L.wa}`))
  return out
}

// ctx: { plugins, isOwner, prefix, config }
// withHome: tambahkan baris "Beranda" (kembali ke .menu) untuk layar selain menu utama.
function navButtons(ctx, { withHome = false, listTitle } = {}) {
  const { plugins, isOwner, prefix, config } = ctx
  const { groups, order } = ui.collect(plugins, isOwner)
  const rows = [
    ...(withHome ? [{ header: 'Menu', title: '🏠 Beranda', description: 'Kembali ke menu utama', id: `${prefix}menu` }] : []),
    ...categoryRows(order, groups, prefix),
    ...visualRows(prefix)
  ]
  const links = linkButtons(config)
  const title = listTitle || (links.length ? 'Command' : '📂 LIHAT MENU')
  return [...links, btn.list(title, [{ title: 'PILIH MENU', rows }])]
}

// gambar kartu; kalau canvas bermasalah, kirim tanpa gambar (menu tetap tampil)
async function safeImage(fn) {
  try {
    return { image: await fn() }
  } catch (err) {
    console.log('[UI] gagal menggambar kartu, kirim tanpa gambar:', err.message)
    return null
  }
}

// Kartu profil pengguna (foto profil WA, level, saldo, peringkat) -> { image: Buffer } atau null
async function profileCard({ sock, msg, sender, isOwner, config }) {
  const n = userOf(sender)
  const u = getUser(sender)
  if (msg.pushName) u.name = msg.pushName
  const need = expNeeded(u.level)
  const pct = Math.min(100, Math.floor((u.exp / need) * 100))
  const ranking = topUsers('level', 1e9)
  const pos = ranking.findIndex((x) => x.id === n) + 1
  return safeImage(async () =>
    ui.render('card', {
      botName: config.botName,
      name: u.name || ui.maskNumber(n),
      number: ui.maskNumber(n),
      status: isOwner ? 'OWNER' : 'MEMBER',
      level: u.level,
      pct,
      exp: ui.fmt(u.exp),
      expNeed: ui.fmt(need),
      money: ui.rp(u.money),
      bank: ui.rp(u.bank),
      limit: u.limit,
      rank: pos,
      rankTotal: ranking.length,
      avatarBuffer: await ui.avatarOf(sock, sender)
    })
  )
}

module.exports = { categoryRows, visualRows, linkButtons, navButtons, safeImage, profileCard, line }
