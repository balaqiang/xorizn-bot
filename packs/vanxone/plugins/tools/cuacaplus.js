// Cuaca lanjutan (open-meteo, tanpa API key): ramalan 7 hari, kualitas udara, matahari terbit/terbenam, fase bulan
const axios = require('axios')
const kit = require('../../lib/kit')
const { panel } = require('../../lib/uitext')
const { describe } = require('../../lib/weather')

const fail = (msg) => Object.assign(new Error(msg), { userMessage: msg })
async function geocode(q) {
  const { data } = await axios.get('https://geocoding-api.open-meteo.com/v1/search', { params: { name: q, count: 1, language: 'id' }, timeout: 10000 })
  const p = data?.results?.[0]
  if (!p) throw fail(`Kota "${q}" tidak ditemukan.`)
  return p
}
const place = (p) => `${p.name}${p.admin1 ? `, ${p.admin1}` : ''}${p.country ? `, ${p.country}` : ''}`
const DAY = (s) => new Date(`${s}T12:00:00Z`).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' })
const hm = (iso) => String(iso).slice(11, 16)

// fase bulan (algoritma sinodik sederhana, akurat ±1 hari)
const SYN = 29.530588853
function moon(d = new Date()) {
  const age = (((d.getTime() / 86400000 + 2440587.5 - 2451550.1) % SYN) + SYN) % SYN
  const names = [['Bulan Baru', '🌑'], ['Sabit Awal', '🌒'], ['Perempat Pertama', '🌓'], ['Cembung Awal', '🌔'], ['Purnama', '🌕'], ['Cembung Akhir', '🌖'], ['Perempat Akhir', '🌗'], ['Sabit Akhir', '🌘']]
  const [name, icon] = names[Math.floor(((age / SYN) * 8 + 0.5) % 8)]
  const illum = (1 - Math.cos((2 * Math.PI * age) / SYN)) / 2
  return { age, name, icon, illum }
}
const AQI = (v) => (v <= 50 ? 'Baik 🟢' : v <= 100 ? 'Sedang 🟡' : v <= 150 ? 'Tidak sehat bagi kelompok sensitif 🟠' : v <= 200 ? 'Tidak sehat 🔴' : v <= 300 ? 'Sangat tidak sehat 🟣' : 'Berbahaya ⚫')

const specs = {
  ramalancuaca: { desc: 'Prakiraan cuaca 7 hari ke depan', usage: '<kota>', example: 'Bandung', args: true, heavy: true, run: async (c) => {
    const p = await geocode(c.text.trim())
    const { data } = await axios.get('https://api.open-meteo.com/v1/forecast', { params: { latitude: p.latitude, longitude: p.longitude, daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum,wind_speed_10m_max', timezone: 'auto', forecast_days: 7 }, timeout: 12000 })
    const d = data.daily
    return panel('RAMALAN 7 HARI', [{ head: `📍 *${place(p)}*`, lines: d.time.map((t, i) => `${DAY(t)} • ${describe(d.weather_code[i])} • ${Math.round(d.temperature_2m_min[i])}–${Math.round(d.temperature_2m_max[i])}°C • hujan ${d.precipitation_probability_max[i] ?? 0}% (${d.precipitation_sum[i]} mm)`) }])
  } },
  aqi: { desc: 'Kualitas udara (AQI, PM2.5, PM10) di suatu kota', usage: '<kota>', example: 'Jakarta', args: true, heavy: true, run: async (c) => {
    const p = await geocode(c.text.trim())
    const { data } = await axios.get('https://air-quality-api.open-meteo.com/v1/air-quality', { params: { latitude: p.latitude, longitude: p.longitude, current: 'us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,ozone,uv_index', timezone: 'auto' }, timeout: 12000 })
    const k = data.current
    if (k?.us_aqi == null) throw fail('Data kualitas udara belum tersedia untuk lokasi ini.')
    return panel('KUALITAS UDARA', [
      { head: `📍 *${place(p)}*`, lines: [`AQI (US) : *${k.us_aqi}* — ${AQI(k.us_aqi)}`, `PM2.5 : ${k.pm2_5} µg/m³`, `PM10 : ${k.pm10} µg/m³`, `Ozon : ${k.ozone} µg/m³`, `NO₂ : ${k.nitrogen_dioxide} µg/m³`, `CO : ${k.carbon_monoxide} µg/m³`, k.uv_index != null ? `Indeks UV : ${k.uv_index}` : ''].filter(Boolean) }
    ], { tip: k.us_aqi > 100 ? '😷 Kurangi aktivitas luar ruangan & pakai masker.' : '✅ Aman untuk beraktivitas di luar.' })
  } },
  matahari: { desc: 'Waktu matahari terbit & terbenam + lama siang', usage: '<kota>', example: 'Medan', args: true, heavy: true, run: async (c) => {
    const p = await geocode(c.text.trim())
    const { data } = await axios.get('https://api.open-meteo.com/v1/forecast', { params: { latitude: p.latitude, longitude: p.longitude, daily: 'sunrise,sunset,daylight_duration,uv_index_max', timezone: 'auto', forecast_days: 3 }, timeout: 12000 })
    const d = data.daily
    const dur = (s) => `${Math.floor(s / 3600)} jam ${Math.round((s % 3600) / 60)} menit`
    return panel('MATAHARI', [{ head: `📍 *${place(p)}* (waktu setempat)`, lines: d.time.map((t, i) => `${DAY(t)} • 🌅 ${hm(d.sunrise[i])} • 🌇 ${hm(d.sunset[i])} • siang ${dur(d.daylight_duration[i])}`) }])
  } },
  bulan: { desc: 'Fase bulan hari ini dan prediksi purnama berikutnya', usage: '', run: async () => {
    const m = moon()
    const untilFull = (((0.5 * SYN - m.age) % SYN) + SYN) % SYN
    const untilNew = (((SYN - m.age) % SYN) + SYN) % SYN
    const when = (days) => new Date(Date.now() + days * 86400000).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Jakarta' })
    return panel('FASE BULAN', [
      { head: `${m.icon} *${m.name.toUpperCase()}*`, lines: [`Umur bulan : ${m.age.toFixed(1)} hari`, `Tingkat terang : ${Math.round(m.illum * 100)}%`] },
      { head: '🔮 *BERIKUTNYA*', lines: [`Purnama : ${when(untilFull)}`, `Bulan baru : ${when(untilNew)}`] }
    ], { tip: '💡 Perkiraan astronomi sederhana (±1 hari).' })
  } }
}

module.exports = kit.multi({ name: 'cuacaplus', category: 'tools', emoji: '🌤️', desc: 'Cuaca lanjutan: ramalan, AQI, matahari, bulan', specs })
