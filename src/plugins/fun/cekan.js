// Cek-cekan hiburan: .cekganteng, .cekpintar, .cekbucin, dst. (hasil tetap per orang per hari) + .cekprofil
const { getTargets, userOf } = require('../../lib/utils')

// [kata kunci perintah, label, kata sifat, emoji]
const TRAITS = [
  ['ganteng', 'Kegantengan', 'ganteng', '😎'], ['cantik', 'Kecantikan', 'cantik', '💅'], ['pintar', 'Kepintaran', 'pintar', '🧠'],
  ['kaya', 'Kekayaan', 'kaya', '💰'], ['jomblo', 'Kejombloan', 'jomblo', '💔'], ['bucin', 'Kebucinan', 'bucin', '😍'],
  ['baper', 'Kebaperan', 'baper', '🥺'], ['galau', 'Kegalauan', 'galau', '😢'], ['kepo', 'Kekepoan', 'kepo', '🔍'],
  ['mager', 'Kemageran', 'mager', '🛋️'], ['rajin', 'Kerajinan', 'rajin', '💪'], ['sabar', 'Kesabaran', 'sabar', '🧘'],
  ['lucu', 'Kelucuan', 'lucu', '🤣'], ['keren', 'Kekerenan', 'keren', '🕶️'], ['setia', 'Kesetiaan', 'setia', '🐕'],
  ['romantis', 'Keromantisan', 'romantis', '🌹'], ['cuek', 'Kecuekan', 'cuek', '😐'], ['pelit', 'Kepelitan', 'pelit', '🤏'],
  ['boros', 'Keborosan', 'boros', '💸'], ['gaul', 'Kegaulan', 'gaul', '🕺'], ['alay', 'Keanehan alay', 'alay', '🤪'],
  ['pemalu', 'Kepemaluan', 'pemalu', '🙈'], ['cerewet', 'Kecerewetan', 'cerewet', '🗣️'], ['ceria', 'Keceriaan', 'ceria', '😄'],
  ['sombong', 'Kesombongan', 'sombong', '😏'], ['polos', 'Kepolosan', 'polos', '😇'], ['bijak', 'Kebijaksanaan', 'bijak', '🦉'],
  ['hoki', 'Kehokian', 'hoki', '🍀'], ['sial', 'Kesialan', 'sial', '⛈️'], ['ngantuk', 'Tingkat ngantuk', 'ngantuk', '😴'],
  ['ambis', 'Keambisan', 'ambis', '🎯'], ['santuy', 'Kesantuyan', 'santuy', '😌'], ['sultan', 'Kesultanan', 'sultan', '👑'],
  ['receh', 'Kerecehan', 'receh', '🪙'], ['kalem', 'Kekalemam', 'kalem', '🍃'], ['garang', 'Kegarangan', 'garang', '🐯'],
  ['imut', 'Keimutan', 'imut', '🧸'], ['wibu', 'Kewibuan', 'wibu', '🎌'], ['kutubuku', 'Kekutubukuan', 'kutu buku', '📚'],
  ['penakut', 'Kepenakutan', 'penakut', '😱'], ['pemberani', 'Keberanian', 'pemberani', '🦁'], ['jenius', 'Kejeniusan', 'jenius', '💡'],
  ['gamer', 'Kegameran', 'gamer', '🎮'], ['ceroboh', 'Keceroboan', 'ceroboh', '🤦'], ['disiplin', 'Kedisiplinan', 'disiplin', '⏰'],
  ['kreatif', 'Kekreatifan', 'kreatif', '🎨'], ['dermawan', 'Kedermawanan', 'dermawan', '🎁'], ['ramah', 'Keramahan', 'ramah', '🤝'],
  ['panik', 'Kepanikan', 'panik', '😰']
].map(([key, label, adj, emoji]) => ({ key, cmd: `cek${key}`, label, adj, emoji }))

const TIERS = [
  [20, ['Hampir nol besar, {adj}-nya belum kelihatan 😅', 'Belum ada tanda-tanda {adj}, tapi tenang, masih ada hari esok.']],
  [40, ['Level {adj}-nya masih pemula, terus semangat!', 'Ada sedikit {adj}-nya, tipis tapi nyata.']],
  [60, ['Lumayan {adj}, ya standar manusia normal lah.', 'Tingkat {adj}-nya pas-pasan, nggak kurang nggak lebih.']],
  [80, ['Wah, {adj}-nya di atas rata-rata!', 'Cukup {adj}, banyak yang diam-diam iri nih.']],
  [100, ['Legenda {adj}! Levelnya sudah dewa 👑', 'Sulit dipercaya, {adj}-nya maksimal!']]
]

// FNV-1a 32-bit: hasil sama untuk orang + perintah + tanggal (WIB) yang sama
function hash(s) {
  let h = 0x811c9dc5
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 0x01000193) >>> 0
  }
  return h
}
const today = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jakarta' }).format(new Date())
const bar = (p) => '▰'.repeat(Math.round(p / 10)) + '▱'.repeat(10 - Math.round(p / 10))
const score = (key, trait, day = today()) => hash(`${trait}|${key}|${day}`) % 101

function comment(t, p, key) {
  const tier = TIERS.find(([max]) => p <= max)[1]
  return tier[hash(`${t.key}!${key}`) % tier.length].replace(/\{adj\}/g, t.adj)
}

const PROFILE = ['pintar', 'kaya', 'sabar', 'lucu', 'keren', 'setia', 'rajin', 'mager', 'baper', 'hoki']

module.exports = {
  name: 'cekan',
  command: [...TRAITS.map((t) => t.cmd), 'cekprofil', 'daftarcek'],
  category: 'fun',
  emoji: '🎲',
  desc: 'Cek-cekan hiburan: ganteng, pintar, bucin, sultan, dll (50 jenis)',
  usage: '[@user | nama]',
  run: async ({ sock, msg, from, sender, command, args, prefix, reply }) => {
    const target = getTargets(msg, args)[0]
    const nameArg = !target && args.length ? args.join(' ').slice(0, 40) : ''
    const who = target || sender
    const key = nameArg ? nameArg.toLowerCase() : userOf(who)
    const label = nameArg ? `*${nameArg}*` : `@${userOf(who)}`
    const mentions = nameArg ? [] : [who]
    const send = (text) => sock.sendMessage(from, { text, mentions }, { quoted: msg })

    if (command === 'daftarcek') {
      const rows = TRAITS.map((t) => `${t.emoji} ${prefix}${t.cmd}`)
      return reply(['> ―――《 ❝ DAFTAR CEK-CEKAN ❞ 》―――', '', `> [ 🎲 *${TRAITS.length} JENIS* ]`, ...rows.map((r) => `> ➥ ${r}`), '', '> ──────────────────────', `> 💡 Pakai: ${prefix}cekganteng  /  ${prefix}cekganteng @user  /  ${prefix}cekprofil`].join('\n'))
    }

    if (command === 'cekprofil') {
      const rows = PROFILE.map((k) => TRAITS.find((t) => t.key === k)).map((t) => ({ t, p: score(key, t.key) }))
      const top = [...rows].sort((a, b) => b.p - a.p)[0]
      return send(
        [
          '> ―――《 ❝ CEK PROFIL ❞ 》―――',
          `> 👤 ${label}`,
          '',
          '> [ 📊 *HASIL HARI INI* ]',
          ...rows.map(({ t, p }) => `> ➥ ${t.emoji} ${t.key.padEnd(8)} ${bar(p)} ${p}%`),
          '',
          '> ──────────────────────',
          `> 🏆 Paling menonjol : ${top.t.emoji} ${top.t.adj} (${top.p}%)`,
          `> 🎲 Hanya hiburan. Hasil berubah tiap hari. Coba ${prefix}cek<sifat> lain!`
        ].join('\n')
      )
    }

    const t = TRAITS.find((x) => x.cmd === command)
    const p = score(key, t.key)
    await send(
      [
        `> ―――《 ❝ CEK ${t.key.toUpperCase()} ❞ 》―――`,
        `> 👤 ${label}`,
        '',
        `> ${t.emoji} ${t.label} : ${bar(p)} *${p}%*`,
        `> 💬 ${comment(t, p, key)}`,
        '',
        '> ──────────────────────',
        '> 🎲 Hanya hiburan. Hasil berubah tiap hari.'
      ].join('\n')
    )
  }
}
module.exports.TRAITS = TRAITS
module.exports.score = score
