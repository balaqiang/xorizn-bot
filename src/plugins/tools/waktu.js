const ZONES = {
  wib: 'Asia/Jakarta', jakarta: 'Asia/Jakarta', wita: 'Asia/Makassar', makassar: 'Asia/Makassar', bali: 'Asia/Makassar',
  wit: 'Asia/Jayapura', jayapura: 'Asia/Jayapura', tokyo: 'Asia/Tokyo', seoul: 'Asia/Seoul', singapore: 'Asia/Singapore',
  singapura: 'Asia/Singapore', kualalumpur: 'Asia/Kuala_Lumpur', bangkok: 'Asia/Bangkok', manila: 'Asia/Manila',
  beijing: 'Asia/Shanghai', shanghai: 'Asia/Shanghai', hongkong: 'Asia/Hong_Kong', delhi: 'Asia/Kolkata', india: 'Asia/Kolkata',
  dubai: 'Asia/Dubai', mekkah: 'Asia/Riyadh', makkah: 'Asia/Riyadh', madinah: 'Asia/Riyadh', riyadh: 'Asia/Riyadh',
  istanbul: 'Europe/Istanbul', cairo: 'Africa/Cairo', moscow: 'Europe/Moscow', london: 'Europe/London', paris: 'Europe/Paris',
  berlin: 'Europe/Berlin', amsterdam: 'Europe/Amsterdam', madrid: 'Europe/Madrid', roma: 'Europe/Rome', rome: 'Europe/Rome',
  newyork: 'America/New_York', washington: 'America/New_York', chicago: 'America/Chicago', losangeles: 'America/Los_Angeles',
  sanfrancisco: 'America/Los_Angeles', sydney: 'Australia/Sydney', melbourne: 'Australia/Melbourne', perth: 'Australia/Perth',
  auckland: 'Pacific/Auckland', utc: 'UTC', gmt: 'UTC'
}
const DEFAULT = [['WIB', 'Asia/Jakarta'], ['WITA', 'Asia/Makassar'], ['WIT', 'Asia/Jayapura'], ['Mekkah', 'Asia/Riyadh'], ['London', 'Europe/London'], ['New York', 'America/New_York'], ['Tokyo', 'Asia/Tokyo']]

function show(label, tz) {
  const now = new Date()
  const t = new Intl.DateTimeFormat('id-ID', { timeZone: tz, weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }).format(now)
  return `▬ *${label}:* ${t.replace(/\./g, ':')}`
}

module.exports = {
  name: 'waktu',
  command: ['waktu', 'jam', 'time'],
  category: 'tools',
  desc: 'Jam di berbagai kota/zona waktu',
  usage: '[kota]',
  run: async ({ text, prefix, reply }) => {
    if (!text) return reply(['*WAKTU SEKARANG*', '', ...DEFAULT.map(([l, tz]) => show(l, tz))].join('\n'))

    const key = text.toLowerCase().replace(/[\s_-]+/g, '')
    let tz = ZONES[key]
    if (!tz) {
      // coba sebagai nama zona IANA, mis. "Asia/Tokyo"
      try {
        new Intl.DateTimeFormat('id-ID', { timeZone: text.trim() })
        tz = text.trim()
      } catch {}
    }
    if (!tz) return reply(`Kota "${text}" belum dikenal.\nCoba: ${prefix}waktu tokyo, london, newyork, mekkah, atau nama zona seperti Asia/Seoul.`)
    await reply(['*WAKTU*', '', show(text, tz)].join('\n'))
  }
}
