// RPG inti: inventory, shop, buy, sell, heal, makan, masak, craft, claim, bank/atm, rank, dll.
const kit = require('../../lib/kit')
const { panel } = require('../../lib/uitext')
const { getTargets, userOf } = require('../../lib/utils')
const R = require('../../lib/engine/lumen_rpg')
const { P, amt, give, bad, emo, rp, fmtN } = R

const RPG_CD = { claim: 86400000, hunt: 300000, mining: 300000, nebang: 300000, fishing: 300000, dungeon: 600000, petualang: 900000, nguli: 240000, mulung: 180000, warnet: 600000, warteg: 600000, berdagang: 1200000, berkebun: 1800000, merampok: 1800000, korupsi: 3600000 }
const bank = (c) => { const p = P(c.sender); R.regen(p); return { p, u: R.wallet(c.sender) } }
const ITEM_ALIAS = { kayu: 'wood', batu: 'rock', besi: 'iron', tali: 'string', emas: 'gold', sampah: 'trash', umpan: 'bait', fertilizer: 'pupuk', crate: 'common' }
const norm = (s) => { s = String(s || '').toLowerCase(); return ITEM_ALIAS[s] || s }

const specs = {
  inventory: { desc: 'Lihat status, uang, item, alat & peti RPG kamu', run: async (c) => {
    const { p, u } = bank(c)
    const items = Object.entries(p.items).filter(([k]) => !R.TOOLS[k])
    const sec = [
      { head: '🧍 *STATUS*', lines: [`${emo('health')} Health : ${p.health}/100 ${R.bar(p.health)}`, `${emo('stamina')} Stamina : ${p.stamina}/100 ${R.bar(p.stamina)}`, `${emo('exp')} Exp : ${fmtN(u.exp)}`, `${emo('money')} Uang : ${rp(u.money)}`, `${emo('bank')} Bank : ${rp(u.bank)}  (ATM Lv.${p.atm})`] },
      { head: '⚒️ *ALAT*', lines: Object.keys(R.TOOLS).map((t) => `${emo(t)} ${t} : ${amt(p, t) ? `${p.dur[t] ?? R.TOOLS[t]}/${R.TOOLS[t]}` : '—'}`) },
      { head: '📦 *ITEM*', lines: items.length ? items.map(([k, n]) => `${emo(k)} ${k} : ${fmtN(n)}`) : ['(kosong) — mulai dengan .mining, .nebang, .fishing'] }
    ]
    return panel('RPG INVENTORY', sec, { tip: '.shop untuk belanja • .sell untuk menjual • .craft untuk membuat alat' })
  } },
  shop: { desc: 'Toko RPG: daftar harga alat, peti & bahan', run: async (c) => panel('RPG SHOP', [
    { head: '🛒 *ALAT & ITEM*', lines: ['potion', 'sword', 'pickaxe', 'axe', 'fishingrod', 'armor', 'bait', 'pupuk'].map((k) => `${emo(k)} ${k} : ${rp(R.BUY[k])}`) },
    { head: '🎁 *PETI (buka dengan .bukapeti)*', lines: ['common', 'uncommon', 'mythic', 'legendary'].map((k) => `${emo(k)} ${k} crate : ${rp(R.BUY[k])}`) }
  ], { tip: `Beli: ${c.prefix}buy <item> [jumlah] • contoh ${c.prefix}buy potion 5` }) },
  buy: { desc: 'Beli item dari toko RPG', usage: '<item> [jumlah]', example: 'potion 5', args: true, run: async (c) => {
    const item = norm(c.args[0]); const n = Math.max(1, Math.min(999, parseInt(c.args[1]) || 1))
    if (!(item in R.BUY)) throw bad(`Item tidak ada di toko. Lihat ${c.prefix}shop`)
    const u = R.wallet(c.sender); const cost = R.BUY[item] * n
    if (u.money < cost) throw bad(`Uang kurang. Butuh ${rp(cost)}, kamu punya ${rp(u.money)}.`)
    R.addMoney(c.sender, -cost); const p = P(c.sender)
    if (R.TOOLS[item]) { if (amt(p, item)) throw bad(`Kamu sudah punya ${item}.`); give(p, item, 1); p.dur[item] = R.TOOLS[item]; R.addMoney(c.sender, cost - R.BUY[item]); R.st.save(); return `✅ Membeli ${emo(item)} ${item} seharga ${rp(R.BUY[item])}` }
    give(p, item, n); R.st.save()
    return `✅ Membeli ${emo(item)} ${item} x${n}\n💸 -${rp(cost)}`
  } },
  sell: { desc: 'Jual hasil tambang, ikan, ternak, buah, dll', usage: '<item|semua> [jumlah]', example: 'ikan 5', run: async (c) => {
    const p = P(c.sender)
    const a0 = norm(c.args[0])
    if (!a0) return panel('RPG SELL', [{ head: '💰 *HARGA JUAL*', lines: Object.entries(R.SELL).map(([k, v]) => `${emo(k)} ${k} : ${rp(v)}`) }], { tip: `Contoh: ${c.prefix}sell ikan 5 • ${c.prefix}sell semua (jual semua hasil buruan)` })
    if (a0 === 'semua') {
      let tot = 0; const out = []
      for (const k of Object.keys(R.SELL)) { const n = amt(p, k); if (n && !['diamond', 'emerald', 'gold'].includes(k)) { tot += n * R.SELL[k]; out.push(`${emo(k)} ${k} x${n}`); give(p, k, -n) } }
      if (!tot) throw bad('Tidak ada yang bisa dijual (diamond/emerald/emas harus dijual manual).')
      R.addMoney(c.sender, tot); R.st.save()
      return panel('JUAL SEMUA', [{ head: '📦 *TERJUAL*', lines: out }, { head: '💰 *TOTAL*', lines: [`+${rp(tot)}`] }])
    }
    if (!(a0 in R.SELL)) throw bad('Item tidak bisa dijual.')
    const n = c.args[1] === 'semua' ? amt(p, a0) : Math.max(1, parseInt(c.args[1]) || 1)
    if (amt(p, a0) < n || !n) throw bad(`${a0} kamu tidak cukup (punya ${amt(p, a0)}).`)
    give(p, a0, -n); const tot = R.SELL[a0] * n; R.addMoney(c.sender, tot); R.st.save()
    return `✅ Menjual ${emo(a0)} ${a0} x${n}\n💰 +${rp(tot)}`
  } },
  heal: { desc: 'Pulihkan health dengan potion', usage: '[jumlah]', run: async (c) => {
    const p = P(c.sender); const n = Math.max(1, parseInt(c.args[0]) || 1)
    if (p.health >= 100) throw bad('Health kamu sudah penuh.')
    if (amt(p, 'potion') < n) throw bad(`Potion kurang (punya ${amt(p, 'potion')}). Beli: ${c.prefix}buy potion`)
    const use = Math.min(n, Math.ceil((100 - p.health) / 40))
    give(p, 'potion', -use); p.health = Math.min(100, p.health + 40 * use); p.stamina = Math.min(100, p.stamina + 5 * use); R.st.save()
    return `🥤 Memakai ${use} potion\n❤️ Health sekarang ${p.health}/100`
  } },
  makan: { desc: 'Makan untuk memulihkan stamina (ayamgoreng, ayambakar, rendang, steak, ikanbakar)', usage: '<makanan> [jumlah]', example: 'rendang 2', run: async (c) => {
    const p = P(c.sender); R.regen(p)
    const f = norm(c.args[0])
    if (!f) return panel('MENU MAKANAN', [{ head: '🍽️ *MAKANAN*', lines: Object.entries(R.FOOD).map(([k, v]) => `${emo(k)} ${k} : stamina +${v} (kamu punya ${amt(p, k)})`) }], { tip: `Masak dulu: ${c.prefix}masak <makanan> • lalu ${c.prefix}makan <makanan>` })
    if (!(f in R.FOOD)) throw bad('Makanan tidak dikenal.')
    const n = Math.max(1, parseInt(c.args[1]) || 1)
    if (p.stamina >= 100) throw bad('Stamina kamu sudah penuh.')
    if (amt(p, f) < n) throw bad(`${f} kamu kurang. Masak dengan ${c.prefix}masak ${f}`)
    give(p, f, -n); p.stamina = Math.min(100, p.stamina + R.FOOD[f] * n); R.st.save()
    return `${emo(f)} Memakan ${f} x${n}\n🔋 Stamina ${p.stamina}/100`
  } },
  masak: { desc: 'Masak bahan (ayam/sapi/ikan) jadi makanan penambah stamina', usage: '<makanan> [jumlah]', example: 'ayamgoreng 2', run: async (c) => {
    const f = norm(c.args[0]); const p = P(c.sender)
    if (!f) return panel('RESEP MASAK', [{ head: '👩‍🍳 *RESEP*', lines: Object.entries(R.COOK).map(([k, r]) => `${emo(k)} ${k} ← ${Object.entries(r).map(([i, n]) => `${n} ${i}`).join(', ')}`) }])
    const r = R.COOK[f]; if (!r) throw bad('Resep tidak ada.')
    const n = Math.max(1, Math.min(50, parseInt(c.args[1]) || 1))
    for (const [i, q] of Object.entries(r)) if (amt(p, i) < q * n) throw bad(`Bahan kurang: butuh ${q * n} ${i}, kamu punya ${amt(p, i)}.`)
    for (const [i, q] of Object.entries(r)) give(p, i, -q * n)
    give(p, f, n); R.st.save()
    return `👩‍🍳 Berhasil memasak ${emo(f)} ${f} x${n}`
  } },
  craft: { desc: 'Buat alat dari bahan (pickaxe, sword, axe, fishingrod, armor)', usage: '<alat>', example: 'pickaxe', run: async (c) => {
    const t = norm(c.args[0]); const p = P(c.sender)
    if (!t) return panel('DAFTAR CRAFT', [{ head: '🔨 *RESEP*', lines: Object.entries(R.RECIPE).map(([k, r]) => `${emo(k)} ${k} ← ${Object.entries(r).map(([i, n]) => `${n} ${i}`).join(', ')}`) }], { tip: `Contoh: ${c.prefix}craft sword` })
    const r = R.RECIPE[t]; if (!r) throw bad('Resep tidak ada.')
    if (amt(p, t)) throw bad(`Kamu sudah punya ${t}.`)
    const lack = Object.entries(r).filter(([i, n]) => amt(p, i) < n).map(([i, n]) => `${n - amt(p, i)} ${i}`)
    if (lack.length) throw bad(`Bahan kurang: ${lack.join(', ')}`)
    for (const [i, n] of Object.entries(r)) give(p, i, -n)
    give(p, t, 1); p.dur[t] = R.TOOLS[t]; R.st.save()
    return `🔨 Berhasil membuat ${emo(t)} ${t}!`
  } },
  bukapeti: { desc: 'Buka peti (common/uncommon/mythic/legendary) untuk hadiah acak', usage: '<jenis> [jumlah]', example: 'mythic 2', run: async (c) => {
    const k = norm(c.args[0]); const p = P(c.sender)
    const L = R.CRATE_LOOT[k]; if (!L) throw bad('Jenis peti: common, uncommon, mythic, legendary')
    const n = Math.max(1, Math.min(20, parseInt(c.args[1]) || 1))
    if (amt(p, k) < n) throw bad(`Peti ${k} kamu kurang (punya ${amt(p, k)}).`)
    give(p, k, -n); let money = 0; const got = {}
    for (let i = 0; i < n; i++) { money += R.rnd(...L.money); for (const [it, [a, b]] of Object.entries(L.items)) { const q = R.rnd(a, b); if (q) got[it] = (got[it] || 0) + q } }
    R.addMoney(c.sender, money); for (const [it, q] of Object.entries(got)) give(p, it, q); R.st.save()
    return panel('BUKA PETI', [{ head: `${emo(k)} *${k} x${n}*`, lines: [`${emo('money')} ${rp(money)}`, ...Object.entries(got).map(([it, q]) => `${emo(it)} ${it} x${q}`)] }])
  } },
  claim: { desc: 'Hadiah harian RPG (uang, exp, limit)', run: async (c) => {
    const p = P(c.sender); const left = R.cool(p, 'claim', 86400000)
    if (left) throw bad(`Hadiah harian sudah diambil. Coba lagi ${R.dur(left)} lagi.`)
    const money = R.rnd(20000, 70000); const exp = R.rnd(1000, 6000); const lim = R.rnd(1, 5)
    const u = R.wallet(c.sender); u.money += money; u.exp += exp; u.limit += lim; require('../../lib/db').save(); R.st.save()
    return panel('HADIAH HARIAN', [{ head: '🎁 *KAMU DAPAT*', lines: [`${emo('money')} ${rp(money)}`, `${emo('exp')} ${fmtN(exp)} exp`, `🎫 ${lim} limit`] }], { tip: 'Datang lagi besok!' })
  } },
  atm: { desc: 'Lihat rekening bank RPG & kapasitas ATM', run: async (c) => {
    const { p, u } = bank(c)
    return panel('ATM & BANK', [{ head: '🏦 *REKENING*', lines: [`Saldo bank : ${rp(u.bank)}`, `Kapasitas : ${rp(R.bankCap(p))}`, `Level ATM : ${p.atm}`, `Uang tunai : ${rp(u.money)}`] }], { tip: `${c.prefix}upgradeatm untuk menambah kapasitas • ${c.prefix}dep / ${c.prefix}wd untuk setor/tarik` })
  } },
  upgradeatm: { desc: 'Tingkatkan level ATM agar kapasitas bank membesar', run: async (c) => {
    const p = P(c.sender); const cost = 500000 * (p.atm + 1) ** 2
    if (p.atm >= 10) throw bad('ATM sudah level maksimal (10).')
    if (R.wallet(c.sender).money < cost) throw bad(`Biaya upgrade ${rp(cost)} — uang tunai kamu kurang.`)
    R.addMoney(c.sender, -cost); p.atm++; R.st.save()
    return `🏧 ATM naik ke level ${p.atm}!\nKapasitas bank sekarang ${rp(R.bankCap(p))}`
  } },
  bagiuang: { desc: 'Bagikan uang tunai ke teman (mention/reply)', usage: '@user <jumlah>', example: '@user 5000', args: true, group: true, run: async (c) => {
    const [t] = getTargets(c.msg, c.args); const n = parseInt(c.args.find((a) => /^\d+$/.test(a) && a.length < 12))
    if (!t) throw bad('Tag atau reply orang yang mau diberi uang.'); if (!n || n < 1) throw bad('Jumlah tidak valid.')
    if (userOf(t) === userOf(c.sender)) throw bad('Tidak bisa ke diri sendiri.')
    if (R.wallet(c.sender).money < n) throw bad('Uang kamu tidak cukup.')
    R.addMoney(c.sender, -n); R.addMoney(t, n)
    await c.sock.sendMessage(c.from, { text: `💸 @${userOf(c.sender)} memberi @${userOf(t)} ${rp(n)}\nBaik sekali kamu hari ini ✨`, mentions: [c.sender, t] }, { quoted: c.msg })
    return null
  } },
  cooldown: { desc: 'Lihat cooldown semua aktivitas RPG', run: async (c) => {
    const p = P(c.sender); const L = Object.entries(RPG_CD)
    return panel('COOLDOWN RPG', [{ head: '⏱️ *STATUS*', lines: L.map(([k, ms]) => { const left = (p.cd[k] || 0) + ms - Date.now(); return `${left > 0 ? '⏳' : '✅'} ${k} : ${left > 0 ? R.dur(left) : 'siap'}` }) }])
  } },
  rank: { desc: 'Peringkat terkaya & terbanyak exp (data RPG)', run: async (c) => {
    const users = require('../../lib/db')
    const all = Object.keys(R.st.data.users).map((id) => ({ id, u: users.getUser(id) }))
    const top = all.sort((a, b) => b.u.money + b.u.bank - (a.u.money + a.u.bank)).slice(0, 10)
    const medal = ['🥇', '🥈', '🥉']
    return panel('PERINGKAT RPG', [{ head: '🏆 *TOP 10 KEKAYAAN*', lines: top.map((x, i) => `${medal[i] || `${i + 1}.`} ${x.u.name || x.id} — ${rp(x.u.money + x.u.bank)} • ${fmtN(x.u.exp)} exp`) }])
  } },
  merpg: { desc: 'Ringkasan cepat kondisi RPG kamu', run: async (c) => {
    const { p, u } = bank(c)
    return `🧍 *${u.name || 'Kamu'}*\n❤️ ${p.health}/100 ${R.bar(p.health)}\n🔋 ${p.stamina}/100 ${R.bar(p.stamina)}\n💰 ${rp(u.money)} • 🏦 ${rp(u.bank)}\n✨ ${fmtN(u.exp)} exp`
  } },
  listbuah: { desc: 'Daftar buah di kebun & harga jualnya', run: async (c) => {
    const p = P(c.sender); const f = ['apel', 'mangga', 'jeruk', 'pisang', 'anggur']
    return panel('BUAH-BUAHAN', [{ head: '🍎 *PANEN KAMU*', lines: f.map((k) => `${emo(k)} ${k} : ${amt(p, k)} (jual ${rp(R.SELL[k])}/buah)`) }], { tip: `Tanam: ${c.prefix}berkebun` })
  } }
}
module.exports = kit.multi({ name: 'rpg-core', category: 'rpg', emoji: '⚔️', desc: 'Sistem RPG: inventory, toko, craft, masak, bank', specs, alias: { inv: 'inventory', eat: 'makan', cook: 'masak', bank: 'atm', fruits: 'listbuah', peti: 'bukapeti' } })
module.exports.RPG_CD = RPG_CD
