module.exports = {
  name: 'tutorial', command: ['faq', 'carapakai'], category: 'info', emoji: '🎓', desc: 'Panduan singkat memakai bot', usage: '',
  run: async ({ prefix, reply }) => reply([
    '🎓 *PANDUAN SINGKAT*', '',
    '*1. Lihat fitur*', `➥ ${prefix}menu → daftar kategori`, `➥ ${prefix}allmenu → semua perintah`, `➥ ${prefix}carifitur <kata> → cari perintah`, `➥ ${prefix}cmd <perintah> → detail & contoh`, '',
    '*2. Main & kumpulkan uang*', `➥ ${prefix}daily • ${prefix}hourly • ${prefix}weekly • ${prefix}work`, `➥ ${prefix}profile → level, saldo, peringkat`, '',
    '*3. Unduh media*', `➥ ${prefix}play <judul> • ${prefix}tiktok <link> • ${prefix}ig <link>`, '',
    '*4. Tombol tidak jalan?*', '➥ Balas pesan bot dengan angka/kata pada tombol', '',
    '*5. Ganti tampilan*', `➥ ${prefix}uimode text / rich (owner) • ${prefix}setmenu (tipe menu, owner)`
  ].join('\n'))
}
