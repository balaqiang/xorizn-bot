// Sosial & fun: jadian (tembak/terima/tolak/putus/pasanganku), cek ganteng/cantik, quotes, dimanakah, angka, dll
const kit = require('../../lib/kit')
const { panel } = require('../../lib/uitext')
const { getTargets, userOf } = require('../../lib/utils')
const { open } = require('../../lib/jstore')
const { getUser, save } = require('../../lib/db')

const st = open('relationship', { users: {} })
const bad = (m) => Object.assign(new Error('arg'), { userMessage: m })
const pick = (l) => l[Math.floor(Math.random() * l.length)]
const R = (jid) => { const id = userOf(jid); return (st.data.users[id] ||= { pasangan: '', pending: '', dari: '', sejak: 0, exp: 0 }) }
const tag = (j) => `@${userOf(j)}`
const days = (t) => Math.max(0, Math.floor((Date.now() - t) / 86400000))
const hash = (s) => { let h = 2166136261; for (const ch of s) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619) } return h >>> 0 }
const dayKey = () => new Date().toISOString().slice(0, 10)

const send = (c, text, mentions) => c.sock.sendMessage(c.from, { text, mentions }, { quoted: c.msg })

const TEMBAK_EXP = 600000
const meter = (kind, c) => {
  const pct = hash(`${userOf(c.sender)}|${kind}|${dayKey()}`) % 101
  const L = {
    ganteng: [['Cermin aja nangis liat muka lo 😭', 'Sabar ya bro, jangan ngaca siang bolong'], ['Ganteng tipis-tipis, kayak sinyal di gunung 📶', 'Dari jauh keren, dari deket ngagetin'], ['Bisa lah kalau gelap dikit dan pakai filter 😅', 'Lumayan, nilai plus di kepribadian'], ['Bikin cewek lupa password IG-nya 😎', 'Auto jadi FYP cewek-cewek TikTok'], ['COWOK TERGANTENG SEALAM SEMESTA!! 😎🔥', 'Kalau nongol, cermin nyalamin dulu']],
    cantik: [['Kamera depan lagi error kayaknya 😭', 'Sabar ya, yang penting hati'], ['Manis kalau diliat dari samping 😅', 'Cantik natural, tanpa filter berasa'], ['Senyum dikit, banyak yang naksir 😊', 'Glowing walau tanpa skincare'], ['Bikin cowok lupa chat mantannya 💘', 'Cantiknya bikin sinyal naik'], ['CEWEK TERCANTIK SEJAGAT RAYA!! 👑✨', 'Bidadari jatuh dari mana nih?']]
  }[kind]
  const tier = L[Math.min(4, Math.floor(pct / 20.01))]
  return `📊 *Level ${kind} kamu hari ini*\n${'█'.repeat(Math.round(pct / 10))}${'░'.repeat(10 - Math.round(pct / 10))} *${pct}%*\n\n${pick(tier)}`
}

const BUCIN = ['Aku bukan orang sempurna, tapi aku bisa jadi sempurna buat kamu.', 'Kamu itu kayak kopi, bikin susah tidur tapi bikin ketagihan.', 'Cinta itu bukan soal siapa yang paling lama, tapi siapa yang paling bertahan.', 'Kalau kamu jadi masalah, aku rela nggak punya solusi.', 'Hari-hariku berwarna sejak ada kamu, sisanya cuma abu-abu.', 'Gak perlu jadi bintang, cukup jadi alasan aku senyum tiap hari.', 'Aku nggak butuh Google, karena semua yang aku cari ada di kamu.', 'Kamu itu seperti WiFi: tanpamu aku kehilangan koneksi dengan dunia.']
const SADBOY = ['Yang paling sakit bukan ditinggal pergi, tapi dibiarkan berharap.', 'Kadang diam bukan berarti baik-baik saja, hanya lelah menjelaskan.', 'Aku pernah jadi alasan senyummu, sekarang cuma jadi cerita di masa lalumu.', 'Jangan terlalu baik pada orang yang tidak pernah menghargai.', 'Ikhlas itu bukan lupa, tapi berhenti berharap.', 'Rindu itu berat, apalagi kalau yang dirindukan sudah tak peduli.', 'Malam ini sepi, seperti hatiku yang kau tinggal pergi.']

const specs = {
  tembak: { desc: 'Nembak seseorang jadi pacar (mention/reply). Dia balas dengan .terima / .tolak', usage: '@user', example: '@user', args: true, group: true, run: async (c) => {
    const [t] = getTargets(c.msg, c.args); if (!t) throw bad('Tag atau reply orang yang mau ditembak.')
    if (userOf(t) === userOf(c.sender)) throw bad('Masa nembak diri sendiri 😅')
    const me = R(c.sender); const he = R(t)
    if (me.pasangan) throw bad(`Kamu masih berpacaran dengan ${tag(me.pasangan)}. Putus dulu (.putus).`)
    if (he.pasangan) throw bad(`${tag(t)} sudah punya pasangan.`)
    if (he.pending && Date.now() - he.pendingAt < TEMBAK_EXP) throw bad(`${tag(t)} sedang menunggu jawaban orang lain.`)
    he.pending = userOf(c.sender); he.pendingAt = Date.now(); st.save()
    await send(c, `💘 *PERNYATAAN CINTA* 💘\n\n${tag(c.sender)} menembak ${tag(t)}!\n\nBalas dengan:\n✅ ${c.prefix}terima\n❌ ${c.prefix}tolak\n\n_(berlaku 10 menit)_`, [c.sender, t]); return null
  } },
  terima: { desc: 'Terima tembakan cinta yang masuk', run: async (c) => {
    // .terima / .tolak <kode order> milik toko (plugins/store/produk.js) berbagi nama dengan jadian: serahkan ke toko kalau argumen = kode order yang ada
    if (c.args[0] && require('../../lib/shop').getOrder(c.args[0])) return require('../store/produk').run(c)
    if (!c.isGroup) throw bad('Fitur ini hanya bisa dipakai di grup.')
    const me = R(c.sender)
    if (!me.pending || Date.now() - (me.pendingAt || 0) > TEMBAK_EXP) throw bad('Tidak ada yang menembakmu (atau sudah kedaluwarsa).')
    const from = `${me.pending}@s.whatsapp.net`; const he = R(from)
    if (he.pasangan) { me.pending = ''; st.save(); throw bad('Dia sudah punya pasangan lain 😬') }
    me.pasangan = userOf(from); he.pasangan = userOf(c.sender); me.sejak = he.sejak = Date.now(); me.pending = ''; st.save()
    await send(c, `🎉 *SELAMAT, KALIAN RESMI JADIAN!* 🎉\n\n💑 ${tag(from)} ❤️ ${tag(c.sender)}\n📅 ${new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}\n\nSemoga langgeng ya 💞`, [from, c.sender]); return null
  } },
  tolak: { desc: 'Tolak tembakan cinta yang masuk', run: async (c) => {
    // .terima / .tolak <kode order> milik toko (plugins/store/produk.js) berbagi nama dengan jadian: serahkan ke toko kalau argumen = kode order yang ada
    if (c.args[0] && require('../../lib/shop').getOrder(c.args[0])) return require('../store/produk').run(c)
    if (!c.isGroup) throw bad('Fitur ini hanya bisa dipakai di grup.')
    const me = R(c.sender)
    if (!me.pending) throw bad('Tidak ada yang menembakmu.')
    const from = `${me.pending}@s.whatsapp.net`; me.pending = ''; st.save()
    await send(c, `💔 ${tag(c.sender)} menolak cinta ${tag(from)}.\n${pick(['Sabar ya, masih banyak ikan di laut 🐟', 'Tetap semangat, jodoh nggak ke mana 🌱', 'Tenang, cinta sejati pasti datang 💫'])}`, [from, c.sender]); return null
  } },
  putus: { desc: 'Putuskan hubungan pacaran', group: true, run: async (c) => {
    const me = R(c.sender); if (!me.pasangan) throw bad('Kamu belum punya pasangan.')
    const partner = `${me.pasangan}@s.whatsapp.net`; const he = R(partner); const d = days(me.sejak)
    me.pasangan = ''; me.sejak = 0; if (he.pasangan === userOf(c.sender)) { he.pasangan = ''; he.sejak = 0 }; st.save()
    await send(c, `💔 *KALIAN RESMI PUTUS!*\n\n${tag(c.sender)} ✖️ ${tag(partner)}\nHubungan bertahan ${d} hari.\n${pick(['Semoga kalian menemukan kebahagiaan masing-masing.', 'Semua ada masanya, tetap semangat ya.', 'Mungkin ini memang yang terbaik.'])}`, [c.sender, partner]); return null
  } },
  pasanganku: { desc: 'Cek status pacaran kamu (atau orang yang di-mention)', usage: '[@user]', group: true, optional: true, run: async (c) => {
    const [t] = getTargets(c.msg, c.args); const who = t || c.sender; const me = R(who)
    if (!me.pasangan) { await send(c, `💔 ${tag(who)} masih jomblo.\nCoba tembak seseorang: ${c.prefix}tembak @user`, [who]); return null }
    const p = `${me.pasangan}@s.whatsapp.net`; const d = days(me.sejak)
    await send(c, `💞 *STATUS HUBUNGAN*\n\n${tag(who)} ❤️ ${tag(p)}\n📅 Jadian sejak ${new Date(me.sejak).toLocaleDateString('id-ID', { dateStyle: 'long' })}\n⏳ Sudah *${d} hari*${d >= 365 ? ' 🎊 lebih dari setahun!' : d >= 100 ? ' 🎉' : ''}`, [who, p]); return null
  } },
  gantengcek: { desc: 'Cek level kegantengan kamu hari ini', run: async (c) => meter('ganteng', c) },
  cantikcek: { desc: 'Cek level kecantikan kamu hari ini', run: async (c) => meter('cantik', c) },
  quotebucin: { desc: 'Kata-kata bucin acak', run: async () => `💘 ${pick(BUCIN)}` },
  sadboy: { desc: 'Kata-kata galau acak', run: async () => `🥀 ${pick(SADBOY)}` },
  dimanakah: { desc: 'Tanya "dimanakah ...?" dijawab acak', usage: '<pertanyaan>', example: 'dimanakah jodohku', args: true, run: async (c) => `❓ *Pertanyaan:* dimanakah ${c.text}\n💬 *Jawaban:* ${pick(['di neraka', 'di surga', 'di mars', 'di tengah laut', 'di dadamu', 'di hatimu >///<', 'di bawah kasur', 'di dalam mimpi'])}` },
  carabalikan: { desc: 'Cara balikan sama mantan', run: async () => pick(['Badut paling setia yang masih berharap dia balik lagi padahal udah punya yang baru 🤡', 'Cukup move on, nanti dia yang nyariin 😌', 'Mulai dari upgrade diri, bukan upgrade kuota buat stalking 📱']) },
  angka: { desc: 'Tebak angka 0-9, benar dapat bonus exp', usage: '<0-9>', example: '5', args: true, run: async (c) => {
    if (!/^[0-9]$/.test(c.args[0])) throw bad('Masukkan angka 0 sampai 9.')
    const bot = String(Math.floor(Math.random() * 10)); const ok = bot === c.args[0]; const bonus = ok ? 100 + Math.floor(Math.random() * 200) : 1 + Math.floor(Math.random() * 99)
    getUser(c.sender).exp += bonus; save()
    return `🎲 *TEBAK ANGKA*\n\n🎯 Kamu : *${c.args[0]}*\n🤖 Bot : *${bot}*\n\n${ok ? '✅ BENAR!' : '❌ Salah'}  +${bonus} exp`
  } }
}
module.exports = kit.multi({ name: 'anya-social', category: 'fun', emoji: '💘', desc: 'Jadian (tembak/terima/putus), cek ganteng/cantik, quotes bucin & galau', specs, alias: { pacarku: 'pasanganku', jadian: 'tembak' } })
