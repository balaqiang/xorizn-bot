module.exports = {
  name: 'umur',
  command: ['umur', 'usia', 'age'],
  category: 'tools',
  desc: 'Hitung umur dari tanggal lahir',
  usage: '<dd-mm-yyyy>',
  run: async ({ text, prefix, reply }) => {
    const m = text.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/) || null
    const iso = text.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/)
    const [d, mo, y] = m ? [+m[1], +m[2], +m[3]] : iso ? [+iso[3], +iso[2], +iso[1]] : []
    if (!d) return reply(`Contoh: ${prefix}umur 17-08-2000`)

    const birth = new Date(Date.UTC(y, mo - 1, d))
    if (birth.getUTCFullYear() !== y || birth.getUTCMonth() !== mo - 1 || birth.getUTCDate() !== d) return reply('Tanggal tidak valid.')

    const now = new Date()
    const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
    if (birth > today) return reply('Tanggal lahir tidak boleh di masa depan.')

    let years = today.getUTCFullYear() - y
    let months = today.getUTCMonth() - (mo - 1)
    let days = today.getUTCDate() - d
    if (days < 0) {
      months--
      days += new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 0)).getUTCDate()
    }
    if (months < 0) {
      years--
      months += 12
    }

    let next = new Date(Date.UTC(today.getUTCFullYear(), mo - 1, d))
    if (next < today) next = new Date(Date.UTC(today.getUTCFullYear() + 1, mo - 1, d))
    const totalDays = Math.floor((today - birth) / 86400000)
    const weekday = birth.toLocaleDateString('id-ID', { weekday: 'long', timeZone: 'UTC' })

    await reply(
      [
        '*HITUNG UMUR*',
        '',
        `▬ *Umur:* ${years} tahun ${months} bulan ${days} hari`,
        `▬ *Total hari:* ${totalDays.toLocaleString('id-ID')}`,
        `▬ *Hari lahir:* ${weekday}`,
        `▬ *Ulang tahun berikutnya:* ${Math.round((next - today) / 86400000)} hari lagi`
      ].join('\n')
    )
  }
}
