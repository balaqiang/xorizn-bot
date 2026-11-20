// RPG aktivitas: mining, nebang, fishing, hunt, dungeon, petualang, nguli, mulung, warnet, warteg, berdagang, berkebun, quest, guild, merampok, korupsi, judi, casino
const kit = require('../../lib/kit')
const { panel } = require('../../lib/uitext')
const { getTargets, userOf } = require('../../lib/utils')
const R = require('../../lib/engine/lumen_rpg')
const { RPG_CD } = require('./rpg-core')
const { P, amt, give, bad, emo, rp, rnd, pick, fmtN } = R

const begin = (c, key) => { const p = P(c.sender); R.regen(p); const left = R.cool(p, key, RPG_CD[key]); if (left) throw bad(`Masih lelah. Tunggu ${R.dur(left)} lagi untuk .${key}`); return p }
// hasil: {money, exp, items:{}} → diberikan & diformat
function award(c, p, { money = 0, exp = 0, items = {} }) {
  if (money) R.addMoney(c.sender, money); if (exp) R.addExp(c.sender, exp)
  const out = []
  for (const [k, n] of Object.entries(items)) if (n > 0) { give(p, k, n); out.push(`${emo(k)} ${k} +${fmtN(n)}`) }
  p.rpgExp += exp; R.st.save()
  return [...(money ? [`${emo('money')} ${rp(money)}`] : []), ...(exp ? [`${emo('exp')} +${fmtN(exp)} exp`] : []), ...out]
}
const rollItems = (table) => Object.fromEntries(Object.entries(table).map(([k, [a, b]]) => [k, rnd(a, b)]))
const MONSTERS = [['Goblin', 'F', 1000, 200], ['Orc', 'E', 2000, 400], ['Skeleton Knight', 'D', 4000, 800], ['Dark Mage', 'C', 6000, 1200], ['Wyvern', 'B', 12000, 2500], ['Ancient Dragon', 'S', 40000, 8000]]
const BOSS = ['Dark Oni', 'Shadow Dragon', 'Blood Demon', 'Ancient Golem', 'Night Reaper']

const specs = {
  mining: { desc: 'Menambang batu, besi, emas & permata (butuh pickaxe, stamina 20)', run: async (c) => {
    const p = begin(c, 'mining'); R.needStamina(p, 20)
    const wear = R.useTool(p, 'pickaxe', 4)
    const items = rollItems({ rock: [3, 12], iron: [0, 6], string: [0, 8], trash: [0, 6], gold: [0, 1], emerald: [0, 1], diamond: [0, 1] })
    if (Math.random() < 0.08) items.common = 1; if (Math.random() < 0.02) items.mythic = 1
    return panel('MINING', [{ head: '⛏️ *HASIL TAMBANG*', lines: award(c, p, { exp: rnd(300, 900), items }) }, { head: '🔋 *KONDISI*', lines: [`Stamina ${p.stamina}/100${wear}`] }])
  } },
  nebang: { desc: 'Menebang pohon cari kayu (butuh axe, stamina 15)', run: async (c) => {
    const p = begin(c, 'nebang'); R.needStamina(p, 15); const wear = R.useTool(p, 'axe', 4)
    return panel('MENEBANG', [{ head: '🪓 *HASIL*', lines: award(c, p, { exp: rnd(200, 600), items: rollItems({ wood: [6, 20], string: [0, 4], trash: [0, 3] }) }) }, { head: '🔋 *KONDISI*', lines: [`Stamina ${p.stamina}/100${wear}`] }])
  }, },
  fishing: { desc: 'Memancing ikan (butuh fishingrod + bait, stamina 10)', run: async (c) => {
    const p = begin(c, 'fishing'); R.needStamina(p, 10)
    if (amt(p, 'bait') < 1) throw bad(`Butuh bait. Beli: ${c.prefix}buy bait 10`)
    const wear = R.useTool(p, 'fishingrod', 3); give(p, 'bait', -1)
    const fish = pick(['ikan', 'lele', 'nila', 'bawal', 'udang', 'kepiting', 'ikan', 'lele', 'trash', 'paus'])
    const n = fish === 'paus' ? 1 : rnd(1, 4)
    return panel('MEMANCING', [{ head: '🎣 *TANGKAPAN*', lines: award(c, p, { exp: rnd(200, 500), items: { [fish]: n } }) }, { head: '🔋 *KONDISI*', lines: [`Stamina ${p.stamina}/100${wear}`] }])
  } },
  hunt: { desc: 'Berburu monster untuk uang & exp (butuh sword disarankan)', run: async (c) => {
    const p = begin(c, 'hunt'); R.needHealth(p, 25); R.needStamina(p, 15)
    const m = pick(MONSTERS); const hp = R.hurt(p, rnd(10, 40) + (amt(p, 'sword') ? -5 : 5)); const wear = amt(p, 'sword') ? R.useTool(p, 'sword', 3) : ''
    if (hp.dead) { R.st.save(); return `💀 Kamu dikalahkan *${m[0]}* (${m[1]})\n❤️ Health dipulihkan ke ${p.health}. Gunakan .heal & coba lagi.` }
    const mult = amt(p, 'sword') ? 1.3 : 1
    return panel('BATTLE RESULT', [{ head: `🐉 *${m[0]}* (Rank ${m[1]})`, lines: award(c, p, { money: Math.round(m[2] * mult), exp: Math.round(m[3] * mult) }) }, { head: '❤️ *KONDISI*', lines: [`Health ${p.health}/100 (-${hp.dmg})${wear}`] }])
  } },
  dungeon: { desc: 'Masuk dungeon melawan boss — hadiah besar (health min. 70)', run: async (c) => {
    const p = P(c.sender); R.needHealth(p, 70); const p2 = begin(c, 'dungeon'); R.needStamina(p2, 25)
    const boss = pick(BOSS); const hp = R.hurt(p, rnd(20, 60))
    if (hp.dead) { R.st.save(); return `💀 *${boss}* terlalu kuat... Kamu terpental keluar dungeon.\n❤️ Health ${p.health}` }
    const items = { diamond: rnd(0, 3), emerald: rnd(0, 3), gold: rnd(0, 4) }; if (Math.random() < 0.35) items.mythic = 1; if (Math.random() < 0.08) items.legendary = 1
    return panel('DUNGEON', [{ head: `👹 *${boss} dikalahkan!*`, lines: award(c, p, { money: rnd(20000, 100000), exp: rnd(2000, 7000), items }) }, { head: '❤️ *KONDISI*', lines: [`Health ${p.health}/100 (-${hp.dmg})`] }], { tip: 'Dungeon berikutnya lebih kuat…' })
  } },
  petualang: { desc: 'Berpetualang ke tempat acak: bisa untung, bisa rugi', run: async (c) => {
    const p = begin(c, 'petualang'); R.needStamina(p, 20); R.needHealth(p, 20)
    const spots = ['Hutan Terlarang', 'Gua Kristal', 'Pantai Berhantu', 'Gunung Salju', 'Reruntuhan Kuno', 'Kota Terapung']
    const spot = pick(spots); const hp = R.hurt(p, rnd(5, 30)); const good = Math.random() < 0.8 && !hp.dead
    if (!good) { const lost = Math.min(R.wallet(c.sender).money, rnd(2000, 10000)); R.addMoney(c.sender, -lost); R.st.save(); return `🏞️ Di *${spot}* kamu disergap bandit!\n💸 -${rp(lost)}\n❤️ Health ${p.health}/100` }
    return panel('PETUALANGAN', [{ head: `🏞️ *${spot}*`, lines: award(c, p, { money: rnd(5000, 30000), exp: rnd(500, 2500), items: rollItems({ iron: [0, 3], gold: [0, 1], trash: [0, 3], potion: [0, 1] }) }) }, { head: '❤️ *KONDISI*', lines: [`Health ${p.health}/100 (-${hp.dmg})`] }])
  } },
  nguli: { desc: 'Jadi kuli bangunan — gaji kecil tanpa risiko', run: async (c) => { const p = begin(c, 'nguli'); R.needStamina(p, 10); return panel('KULI BANGUNAN', [{ head: '👷 *GAJI*', lines: award(c, p, { money: rnd(3000, 9000), exp: rnd(100, 400) }) }]) } },
  mulung: { desc: 'Memulung barang bekas lalu jual', run: async (c) => { const p = begin(c, 'mulung'); R.needStamina(p, 5); return panel('MEMULUNG', [{ head: '♻️ *HASIL*', lines: award(c, p, { exp: rnd(50, 200), items: rollItems({ trash: [3, 15], string: [0, 3], iron: [0, 1] }) }) }], { tip: `Jual dengan ${c.prefix}sell semua` }) } },
  warnet: { desc: 'Jaga warnet — pendapatan stabil', run: async (c) => { const p = begin(c, 'warnet'); R.needStamina(p, 10); return panel('JAGA WARNET', [{ head: '🖥️ *PENDAPATAN*', lines: award(c, p, { money: rnd(6000, 18000), exp: rnd(200, 600) }) }]) } },
  warteg: { desc: 'Buka warteg — untung lebih besar jika punya bahan masakan', run: async (c) => {
    const p = begin(c, 'warteg'); R.needStamina(p, 10)
    const foods = Object.keys(R.FOOD).filter((f) => amt(p, f)); let bonus = 0
    for (const f of foods.slice(0, 2)) { give(p, f, -1); bonus += 8000 }
    return panel('WARTEG', [{ head: '🍛 *HASIL JUALAN*', lines: award(c, p, { money: rnd(5000, 15000) + bonus, exp: rnd(200, 500) }) }], { tip: bonus ? 'Bonus dari masakan di stok!' : `Simpan masakan (${c.prefix}masak) untuk bonus` })
  } },
  berdagang: { desc: 'Berdagang antar kota (modal 5.000, untung/rugi acak)', run: async (c) => {
    const p = begin(c, 'berdagang'); if (R.wallet(c.sender).money < 5000) throw bad('Modal minimal Rp5.000.')
    const city = pick(['Jakarta', 'Surabaya', 'Medan', 'Makassar', 'Bandung']); const profit = rnd(-4000, 18000)
    R.addMoney(c.sender, profit); R.addExp(c.sender, 300); R.st.save()
    return `🧳 Berdagang ke *${city}*\n${profit >= 0 ? `📈 Untung ${rp(profit)}` : `📉 Rugi ${rp(-profit)}`}`
  } },
  berkebun: { desc: 'Berkebun buah (butuh 1 pupuk) — panen 30 menit sekali', run: async (c) => {
    const p = begin(c, 'berkebun'); if (amt(p, 'pupuk') < 1) { delete p.cd.berkebun; throw bad(`Butuh pupuk. Beli: ${c.prefix}buy pupuk 3`) }
    give(p, 'pupuk', -1)
    const items = rollItems({ apel: [3, 15], mangga: [3, 15], jeruk: [3, 15], pisang: [3, 15], anggur: [3, 15] })
    return panel('BERKEBUN', [{ head: '🌳 *PANEN*', lines: award(c, p, { exp: rnd(200, 600), items }) }], { tip: `Jual buah: ${c.prefix}sell semua` })
  } },
  quest: { desc: 'Ambil misi harian RPG & klaim hadiahnya', usage: '[klaim]', run: async (c) => {
    const p = P(c.sender); const day = new Date().toISOString().slice(0, 10)
    if (!p.quest || p.quest.day !== day) { const k = pick([['wood', 20, 'Kumpulkan 20 kayu'], ['rock', 25, 'Kumpulkan 25 batu'], ['iron', 10, 'Kumpulkan 10 besi'], ['ikan', 5, 'Kumpulkan 5 ikan']]); p.quest = { day, item: k[0], n: k[1], text: k[2], done: false }; R.st.save() }
    const q = p.quest
    if (c.args[0] === 'klaim') {
      if (q.done) throw bad('Misi hari ini sudah diklaim.'); if (amt(p, q.item) < q.n) throw bad(`Belum cukup: ${amt(p, q.item)}/${q.n} ${q.item}`)
      give(p, q.item, -q.n); q.done = true; R.addMoney(c.sender, 30000); R.addExp(c.sender, 2500); give(p, 'common', 1); R.st.save()
      return `🎉 Misi selesai!\n💰 ${rp(30000)} • ✨ 2.500 exp • 📦 1 common crate`
    }
    return panel('MISI HARIAN', [{ head: '📜 *MISI*', lines: [q.text, `Progres : ${Math.min(amt(p, q.item), q.n)}/${q.n} ${q.item}`, `Status : ${q.done ? '✅ sudah diklaim' : '⏳ belum'}`] }], { tip: `Klaim: ${c.prefix}quest klaim` })
  } },
  guild: { desc: 'Guild petualang: buat, gabung, keluar, lihat anggota', usage: '[buat <nama>|gabung <nama>|keluar|info]', example: 'buat Naga Api', run: async (c) => {
    const p = P(c.sender); const G = R.st.data.guilds; const sub = (c.args[0] || 'info').toLowerCase(); const name = c.args.slice(1).join(' ').slice(0, 24)
    if (sub === 'buat') { if (p.guild) throw bad('Kamu sudah punya guild.'); if (!name) throw bad('Nama guild?'); if (G[name.toLowerCase()]) throw bad('Nama sudah dipakai.'); if (R.wallet(c.sender).money < 50000) throw bad('Biaya pendirian Rp50.000.'); R.addMoney(c.sender, -50000); G[name.toLowerCase()] = { name, owner: userOf(c.sender), members: [userOf(c.sender)] }; p.guild = name.toLowerCase(); R.st.save(); return `🏰 Guild *${name}* berdiri!` }
    if (sub === 'gabung') { if (p.guild) throw bad('Keluar dulu dari guild sekarang.'); const g = G[name.toLowerCase()]; if (!g) throw bad('Guild tidak ditemukan.'); g.members.push(userOf(c.sender)); p.guild = name.toLowerCase(); R.st.save(); return `🏰 Bergabung ke guild *${g.name}*` }
    if (sub === 'keluar') { const g = G[p.guild]; if (!g) throw bad('Kamu tidak punya guild.'); g.members = g.members.filter((m) => m !== userOf(c.sender)); if (!g.members.length) delete G[p.guild]; p.guild = null; R.st.save(); return '👋 Kamu keluar dari guild.' }
    const g = G[p.guild]
    if (!g) return panel('GUILD', [{ head: '🏰 *DAFTAR GUILD*', lines: Object.values(G).length ? Object.values(G).map((x) => `${x.name} — ${x.members.length} anggota`) : ['(belum ada)'] }], { tip: `${c.prefix}guild buat <nama> • ${c.prefix}guild gabung <nama>` })
    return panel('GUILD KAMU', [{ head: `🏰 *${g.name}*`, lines: [`Pendiri : ${g.owner}`, `Anggota : ${g.members.length}`, ...g.members.slice(0, 15).map((m) => `• ${m}`)] }])
  } },
  merampok: { desc: 'Merampok uang tunai orang (mention/reply) — bisa gagal & kena denda', usage: '@user', args: true, group: true, run: async (c) => {
    const [t] = getTargets(c.msg, c.args); if (!t) throw bad('Tag atau reply target.'); if (userOf(t) === userOf(c.sender)) throw bad('Tidak bisa merampok diri sendiri.')
    const p = begin(c, 'merampok'); const v = R.wallet(t); const me = R.wallet(c.sender)
    if (v.money < 20000) throw bad('Target terlalu miskin untuk dirampok.')
    if (Math.random() < 0.45) { const fine = Math.min(me.money, rnd(5000, 20000)); R.addMoney(c.sender, -fine); R.st.save(); return `🚓 Kamu ketahuan! Denda ${rp(fine)}.` }
    const take = Math.min(Math.floor(v.money * rnd(5, 20) / 100), 150000); R.addMoney(t, -take); R.addMoney(c.sender, take); R.st.save()
    await c.sock.sendMessage(c.from, { text: `🥷 @${userOf(c.sender)} merampok @${userOf(t)} dan membawa kabur ${rp(take)}!`, mentions: [c.sender, t] }, { quoted: c.msg }); return null
  } },
  korupsi: { desc: 'Korupsi dana bansos — besar tapi risiko ditangkap tinggi (denda besar)', run: async (c) => {
    const p = begin(c, 'korupsi')
    if (Math.random() < 0.55) { const fine = Math.min(R.wallet(c.sender).money, rnd(30000, 120000)); R.addMoney(c.sender, -fine); R.st.save(); return `🚔 KPK menangkapmu! Denda ${rp(fine)}.` }
    const g = rnd(60000, 200000); R.addMoney(c.sender, g); R.st.save(); return `🕴️ Aman terkendali… kamu mengantongi ${rp(g)}.`
  } },
  judi: { desc: 'Taruhan sederhana: tebak angka 1-10 (bayar x8 bila tepat)', usage: '<taruhan> <angka 1-10>', example: '5000 7', args: true, run: async (c) => {
    const bet = parseInt(c.args[0]); const g = parseInt(c.args[1]); const u = R.wallet(c.sender)
    if (!bet || bet < 500) throw bad('Taruhan minimal Rp500.'); if (!(g >= 1 && g <= 10)) throw bad('Tebak angka 1-10.'); if (u.money < bet) throw bad('Uang tunai kurang.')
    const n = rnd(1, 10)
    if (n === g) { R.addMoney(c.sender, bet * 7); return `🎯 Angka *${n}* — TEPAT! Menang ${rp(bet * 8)}` }
    R.addMoney(c.sender, -bet); return `🎲 Angka *${n}* — tebakanmu ${g}. Kalah ${rp(bet)}.`
  } },
  casino: { desc: 'Casino: lawan bandar dengan angka 1-100 (menang bila lebih besar)', usage: '<taruhan>', example: '10000', args: true, run: async (c) => {
    const bet = parseInt(c.args[0]); const u = R.wallet(c.sender)
    if (!bet || bet < 1000) throw bad('Taruhan minimal Rp1.000.'); if (u.money < bet) throw bad('Uang tunai kurang.')
    const me = rnd(1, 100); const bd = rnd(1, 100)
    const res = me > bd ? bet : me === bd ? 0 : -bet; R.addMoney(c.sender, res)
    return panel('CASINO', [{ head: '🎰 *HASIL*', lines: [`Kamu : ${me}`, `Bandar : ${bd}`, res > 0 ? `✅ Menang ${rp(res)}` : res < 0 ? `❌ Kalah ${rp(bet)}` : '🤝 Seri'] }])
  } }
}
module.exports = kit.multi({ name: 'rpg-adventure', category: 'rpg', emoji: '🗡️', desc: 'Aktivitas RPG: tambang, berburu, dungeon, guild, quest, judi', specs, alias: { menebang: 'nebang', adventure: 'petualang', csn: 'casino', bet: 'judi' } })
