// Cuaca dari Open-Meteo (gratis, tanpa API key). Di-cache 10 menit.
const TTL = 10 * 60 * 1000
let cache = { at: 0, text: '' }

function describe(code) {
  if (code === 0) return 'Cerah'
  if (code <= 2) return 'Cerah Berawan'
  if (code === 3) return 'Berawan'
  if (code === 45 || code === 48) return 'Berkabut'
  if (code >= 51 && code <= 57) return 'Gerimis'
  if (code >= 61 && code <= 67) return 'Hujan'
  if (code >= 71 && code <= 77) return 'Salju'
  if (code >= 80 && code <= 82) return 'Hujan Lebat'
  if (code >= 95) return 'Badai Petir'
  return 'Tidak diketahui'
}

async function getWeather(cfg) {
  if (!cfg) return '-'
  if (cache.text && Date.now() - cache.at < TTL) return cache.text
  try {
    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${cfg.lat}&longitude=${cfg.lon}` +
      '&current=temperature_2m,weather_code&timezone=auto'
    const res = await fetch(url, { signal: AbortSignal.timeout(4000) })
    const data = await res.json()
    const { temperature_2m: temp, weather_code: code } = data.current
    cache = { at: Date.now(), text: `${cfg.name}: ${describe(code)} (${temp}°C)` }
    return cache.text
  } catch {
    return cache.text || `${cfg.name}: -`
  }
}

module.exports = { getWeather, describe }
