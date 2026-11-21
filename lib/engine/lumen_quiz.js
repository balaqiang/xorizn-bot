// lib/anya_quiz.js — mesin kuis tebak-tebakan: 1 sesi aktif per chat, jawaban lewat pesan biasa (tanpa prefix) atau reply
'use strict'
const fs = require('fs')
const path = require('path')
const { reward, rp } = require('../gamesession')
const { userOf } = require('../utils')

const games = new Map() // chat -> game
const cache = {}
const load = (n) => (cache[n] ||= JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'lumen', `${n}.json`), 'utf8')))
const pick = (l) => l[Math.floor(Math.random() * l.length)]
const norm = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '')

function lev(a, b) {
  if (a === b) return 0
  const m = a.length; const n = b.length
  if (!m || !n) return Math.max(m, n)
  let prev = Array.from({ length: n + 1 }, (_, i) => i)
  for (let i = 1; i <= m; i++) {
    const cur = [i]
    for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1))
    prev = cur
  }
  return prev[n]
}
const near = (guess, answers) => answers.some((a) => a.length >= 4 && guess.length >= 3 && lev(guess, a) <= Math.max(1, Math.floor(a.length / 5)))

function stop(chat) { const g = games.get(chat); if (g) { clearTimeout(g.timer); games.delete(chat) } return g }

// g: {kind, title, answers:[...string], display, prize, ttl, family?:{all:[...], found:Set}}
async function start(sock, from, msg, g, send) {
  stop(from)
  g.answers = g.answers.map(norm).filter(Boolean)
  g.at = Date.now()
  g.timer = setTimeout(async () => {
    if (games.get(from) !== g) return
    games.delete(from)
    await sock.sendMessage(from, { text: `⌛ *Waktu habis!*\n\n🎮 ${g.title}\n✅ Jawaban: *${g.display}*` }).catch(() => {})
  }, g.ttl || 60000)
  if (g.timer.unref) g.timer.unref()
  games.set(from, g)
  await send()
}

// dipanggil dari hook untuk setiap pesan; return true bila pesan itu jawaban benar
async function answer(sock, from, sender, msg, body) {
  const g = games.get(from)
  if (!g) return false
  const guess = norm(body)
  if (!guess || guess.length > 120) return false
  if (g.family) {
    const hit = g.family.all.findIndex((a, i) => !g.family.found.has(i) && norm(a) === guess)
    if (hit < 0) return false
    g.family.found.add(hit)
    const money = Math.round(g.prize / g.family.all.length) + 500
    reward(sender, money)
    const done = g.family.found.size === g.family.all.length
    const board = g.family.all.map((a, i) => `${i + 1}. ${g.family.found.has(i) ? `✅ ${a}` : '▫️ ???'}`).join('\n')
    await sock.sendMessage(from, { text: `🎯 @${userOf(sender)} menjawab *${g.family.all[hit]}*  +${rp(money)}\n\n👨‍👩‍👧‍👦 *${g.title}*\n${g.question}\n\n${board}${done ? '\n\n🏁 *Semua jawaban terbongkar!*' : ''}`, mentions: [sender] }, { quoted: msg })
    if (done) stop(from)
    return true
  }
  if (g.answers.includes(guess)) {
    stop(from)
    const money = reward(sender, g.prize) !== null ? g.prize : 0
    await sock.sendMessage(from, { text: `🎉 *BENAR!* @${userOf(sender)}\n\n🎮 ${g.title}\n✅ Jawaban: *${g.display}*\n💰 Hadiah ${rp(money)}`, mentions: [sender] }, { quoted: msg })
    return true
  }
  if (near(guess, g.answers)) await sock.sendMessage(from, { text: '🔥 Dikit lagi!' }, { quoted: msg })
  return false
}

module.exports = { games, load, pick, norm, start, stop, answer }
