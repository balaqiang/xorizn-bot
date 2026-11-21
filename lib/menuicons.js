// Emoji untuk tampilan menu. Satu emoji unik per perintah di dalam kategorinya.
// Plugin boleh punya properti `emoji` sendiri (prioritas tertinggi).
// Plugin baru (.addfitur) yang belum terdaftar di sini otomatis memakai emoji kategorinya.
const CAT = { info: 'ℹ️', group: '👥', sticker: '🎨', downloader: '📥', game: '🎮', fun: '🎉', tools: '🧰', image: '🖼️', audio: '🎧', video: '🎬', dokumen: '📄', islam: '🕌', channel: '📢', owner: '👑', store: '🛒' }

const CMD = {
  // info
  botinfo: '📊', id: '🆔', menu: '📋', owner: '👑', ping: '🏓', report: '📩', runtime: '⏱️',
  // grup
  absen: '📋', add: '➕', antibadword: '🤬', antilink: '🔗', antispam: '🛑', botmute: '🔇', cekwarn: '📑', close: '🔒',
  del: '🗑️', demote: '⬇️', hidetag: '🙈', infogc: 'ℹ️', kick: '🦵', leave: '🚪', linkgc: '📎', listadmin: '🛡️',
  open: '🔓', pasangan: '💞', promote: '⬆️', revoke: '♻️', rules: '📜', setdesc: '📝', setname: '✏️', setppgc: '🖼️',
  setrules: '🧾', setultah: '🥳', tagall: '📣', topchat: '🏅', ultah: '🎂', undi: '🎉', unwarn: '✅', warn: '⚠️', welcome: '👋',
  // stiker
  brat: '🟩', bratgif: '🎞️', bratvid: '🎬', s: '✨', smeme: '😂', take: '🏷️', toimg: '🖼️', tovideo: '📹', ttp: '🔠',
  // downloader
  dl: '⬇️', dla: '🎼', fb: '📘', ig: '📸', pinterest: '📌', play: '▶️', play2: '🎧', play3: '🎠', reddit: '👽',
  soundcloud: '☁️', tiktok: '🎵', ttmp3: '🎤', twitter: '🐦', ytmp3: '🎶', ytmp4: '📺', yts: '🔎',
  // game
  balance: '💰', blackjack: '🃏', buylimit: '🛒', cf: '🪙', chess: '♟️', daily: '🎁', deposit: '🏦', dino: '🦖',
  fruitslot: '🍒', hangman: '🔤', hilo: '🎴', kuis: '🧠', leaderboard: '🏆', mancing: '🎣', math: '🧮', profile: '👤',
  rob: '🦹', roulette: '🎡', rps: '🖐️', slot: '🎰', sonik: '🦔', suit: '✊', tebakan: '🤔', tebakbendera: '🏳️',
  tetris: '🧱', tictactoe: '⭕', transfer: '💸', tts: '🔊', withdraw: '🏧', work: '💼',
  // fun
  apakah: '❓', dadu: '🎲', dare: '😈', fakta: '💡', gombal: '💘', jodoh: '💑', jokes: '😆', khodam: '👻', koin: '🪙',
  motivasi: '💬', pantun: '📜', pilih: '🤔', ramalan: '🔮', rate: '📈', sifat: '🧬', tebakangka: '🔢', tod: '🎭', truth: '🗣️',
  // tools
  acak: '🔀', afk: '💤', ai: '🤖', amfind: '🎞️', amprem: '💎', balik: '🔁', base64: '🔐', biner: '🔢', bmi: '⚖️',
  bulat: '⭕', calc: '🧮', cicilan: '💳', compress: '🗜️', convert: '📐', crypto: '🪙', cuaca: '🌦️', diskon: '🏷️',
  fancy: '🔤', filter: '🎨', gempa: '🌋', getpp: '🖼️', hari: '📅', hash: '#️⃣', hitungmundur: '⏳', igstalk: '🕵️',
  kalori: '🔥', kurs: '💱', mat: '➗', mock: '🤪', morse: '📡', note: '📒', password: '🔑', patungan: '🧾', poll: '📊',
  pomodoro: '🍅', qr: '🔳', quran: '📖', remind: '⏰', resize: '📏', rvo: '👀', selisih: '📆', sholat: '🕌',
  shorten: '✂️', speed: '⏩', ssweb: '🖥️', tempmail: '📧', todo: '📝', tomp3: '🎧', tourl: '☁️', translate: '🌐',
  uang: '💵', umur: '🎂', waktu: '🕒', warna: '🌈', wiki: '📚', zodiak: '♈',
  // owner
  addfitur: '➕', addlimit: '🎟️', addmoney: '💵', addowner: '👑', backup: '💾', ban: '⛔', bc: '📢', block: '🚫',
  claimowner: '🔑', delfitur: '➖', delowner: '❌', getfitur: '📤', join: '📥', listgc: '📜', listowner: '📋',
  mode: '⚙️', reloadfitur: '🔄', restart: '♻️', setbio: '✍️', setppbot: '🖼️', ytcookies: '🍪', ytdebug: '🔬', ytdlp: '🛠️'
}

const catIcon = (cat) => require('./categories').iconOf(cat) || CAT[cat] || '📂'

function cmdIcon(plugin, cat) {
  const cmds = Array.isArray(plugin.command) ? plugin.command : [plugin.command]
  if (plugin.emoji) return plugin.emoji
  // cek command utama dulu, lalu alias-nya (mis. 'tic' / 'ttt' untuk tictactoe)
  for (const c of cmds) {
    const hit = CMD[String(c).toLowerCase()]
    if (hit) return hit
  }
  return catIcon(cat)
}

module.exports = { catIcon, cmdIcon }
