module.exports = {
  name: 'umurhewan', command: ['umurhewan', 'umurkucing', 'umuranjing'], category: 'fun', emoji: '🐾', desc: 'Konversi umur kucing/anjing ke umur manusia', usage: '<kucing|anjing> <umur tahun>',
  run: async ({ command, args, prefix, reply }) => {
    let jenis = (args[0] || '').toLowerCase(); let u = Number(String(args[1] || args[0] || '').replace(',', '.'))
    if (command === 'umurkucing') { jenis = 'kucing'; u = Number(String(args[0]).replace(',', '.')) }
    if (command === 'umuranjing') { jenis = 'anjing'; u = Number(String(args[0]).replace(',', '.')) }
    if (!['kucing', 'anjing'].includes(jenis) || !(u > 0 && u <= 40)) return reply(`Contoh: ${prefix}umurhewan kucing 3\natau ${prefix}umuranjing 5`)
    const h = jenis === 'kucing' ? (u <= 1 ? u * 15 : u <= 2 ? 15 + (u - 1) * 9 : 24 + (u - 2) * 4) : (u <= 1 ? u * 15 : u <= 2 ? 15 + (u - 1) * 9 : 24 + (u - 2) * 5)
    await reply(`🐾 *UMUR ${jenis.toUpperCase()}*\n\n▬ *Umur hewan:* ${u} tahun\n▬ *Setara manusia:* ±${Math.round(h)} tahun\n_Perkiraan umum, tiap ras berbeda._`)
  }
}
