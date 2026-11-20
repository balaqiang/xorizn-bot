// Kategori Islami: Asmaul Husna dan arah kiblat
const axios = require('axios')
const kit = require('../../lib/kit')
const { panel } = require('../../lib/uitext')

const fail = (msg) => Object.assign(new Error(msg), { userMessage: msg })

const NAMA = [
  ['Ar-Rahmaan', 'Maha Pengasih'], ['Ar-Rahiim', 'Maha Penyayang'], ['Al-Malik', 'Maha Merajai'], ['Al-Quddus', 'Maha Suci'], ['As-Salaam', 'Maha Memberi Kesejahteraan'],
  ["Al-Mu'min", 'Maha Memberi Keamanan'], ['Al-Muhaimin', 'Maha Pemelihara'], ['Al-Aziiz', 'Maha Perkasa'], ['Al-Jabbaar', 'Maha Kuasa'], ['Al-Mutakabbir', 'Maha Megah'],
  ['Al-Khaaliq', 'Maha Pencipta'], ['Al-Baari', 'Maha Melepaskan'], ['Al-Mushawwir', 'Maha Membentuk Rupa'], ['Al-Ghaffaar', 'Maha Pengampun'], ['Al-Qahhaar', 'Maha Memaksa'],
  ['Al-Wahhaab', 'Maha Pemberi Karunia'], ['Ar-Razzaaq', 'Maha Pemberi Rezeki'], ['Al-Fattaah', 'Maha Pembuka Rahmat'], ['Al-Aliim', 'Maha Mengetahui'], ['Al-Qaabidh', 'Maha Menyempitkan'],
  ['Al-Baasith', 'Maha Melapangkan'], ['Al-Khaafidh', 'Maha Merendahkan'], ['Ar-Raafi', 'Maha Meninggikan'], ["Al-Mu'izz", 'Maha Memuliakan'], ['Al-Mudzill', 'Maha Menghinakan'],
  ["As-Samii'", 'Maha Mendengar'], ['Al-Bashiir', 'Maha Melihat'], ['Al-Hakam', 'Maha Menetapkan'], ["Al-'Adl", 'Maha Adil'], ['Al-Lathiif', 'Maha Lembut'],
  ['Al-Khabiir', 'Maha Mengenal'], ['Al-Haliim', 'Maha Penyantun'], ["Al-'Azhiim", 'Maha Agung'], ['Al-Ghafuur', 'Maha Pengampun'], ['Asy-Syakuur', 'Maha Pembalas Budi'],
  ["Al-'Aliy", 'Maha Tinggi'], ['Al-Kabiir', 'Maha Besar'], ['Al-Hafiizh', 'Maha Memelihara'], ['Al-Muqiit', 'Maha Pemberi Kecukupan'], ['Al-Hasiib', 'Maha Membuat Perhitungan'],
  ['Al-Jaliil', 'Maha Luhur'], ['Al-Kariim', 'Maha Pemurah'], ['Ar-Raqiib', 'Maha Mengawasi'], ['Al-Mujiib', 'Maha Mengabulkan'], ["Al-Waasi'", 'Maha Luas'],
  ['Al-Hakiim', 'Maha Bijaksana'], ['Al-Waduud', 'Maha Mencintai'], ['Al-Majiid', 'Maha Mulia'], ["Al-Baa'its", 'Maha Membangkitkan'], ['Asy-Syahiid', 'Maha Menyaksikan'],
  ['Al-Haqq', 'Maha Benar'], ['Al-Wakiil', 'Maha Memelihara Urusan'], ['Al-Qawiyy', 'Maha Kuat'], ['Al-Matiin', 'Maha Kokoh'], ['Al-Waliyy', 'Maha Melindungi'],
  ['Al-Hamiid', 'Maha Terpuji'], ['Al-Mushii', 'Maha Menghitung'], ["Al-Mubdi'", 'Maha Memulai'], ["Al-Mu'iid", 'Maha Mengembalikan'], ['Al-Muhyii', 'Maha Menghidupkan'],
  ['Al-Mumiit', 'Maha Mematikan'], ['Al-Hayy', 'Maha Hidup'], ['Al-Qayyuum', 'Maha Berdiri Sendiri'], ['Al-Waajid', 'Maha Menemukan'], ['Al-Maajid', 'Maha Mulia'],
  ['Al-Waahid', 'Maha Esa'], ['Al-Ahad', 'Maha Tunggal'], ['Ash-Shamad', 'Maha Dibutuhkan'], ['Al-Qaadir', 'Maha Berkuasa'], ['Al-Muqtadir', 'Maha Menentukan'],
  ['Al-Muqaddim', 'Maha Mendahulukan'], ["Al-Mu'akhkhir", 'Maha Mengakhirkan'], ['Al-Awwal', 'Maha Awal'], ['Al-Aakhir', 'Maha Akhir'], ['Azh-Zhaahir', 'Maha Nyata'],
  ['Al-Baathin', 'Maha Tersembunyi'], ['Al-Waalii', 'Maha Memerintah'], ["Al-Muta'aalii", 'Maha Tinggi'], ['Al-Barr', 'Maha Dermawan'], ['At-Tawwaab', 'Maha Penerima Taubat'],
  ['Al-Muntaqim', 'Maha Penyiksa'], ["Al-'Afuww", 'Maha Pemaaf'], ["Ar-Ra'uuf", 'Maha Pengasih'], ['Maalikul-Mulk', 'Penguasa Kerajaan'], ['Dzul-Jalaali wal-Ikraam', 'Pemilik Kebesaran dan Kemuliaan'],
  ['Al-Muqsith', 'Maha Adil'], ['Al-Jaami', 'Maha Mengumpulkan'], ['Al-Ghaniyy', 'Maha Kaya'], ['Al-Mughnii', 'Maha Memberi Kekayaan'], ["Al-Maani'", 'Maha Mencegah'],
  ['Adh-Dhaarr', 'Maha Memberi Mudarat'], ["An-Naafi'", 'Maha Memberi Manfaat'], ['An-Nuur', 'Maha Bercahaya'], ['Al-Haadii', 'Maha Pemberi Petunjuk'], ["Al-Badii'", 'Maha Pencipta Tanpa Contoh'],
  ['Al-Baaqii', 'Maha Kekal'], ['Al-Waarits', 'Maha Pewaris'], ['Ar-Rasyiid', 'Maha Pandai'], ['Ash-Shabuur', 'Maha Sabar']
]

const KAABA = [21.422487, 39.826206]
const rad = (d) => (d * Math.PI) / 180
const deg = (r) => (r * 180) / Math.PI
function bearing(lat, lon) {
  const p1 = rad(lat)
  const p2 = rad(KAABA[0])
  const dl = rad(KAABA[1] - lon)
  const y = Math.sin(dl) * Math.cos(p2)
  const x = Math.cos(p1) * Math.sin(p2) - Math.sin(p1) * Math.cos(p2) * Math.cos(dl)
  return (deg(Math.atan2(y, x)) + 360) % 360
}
function distanceKm(lat, lon) {
  const dp = rad(KAABA[0] - lat)
  const dl = rad(KAABA[1] - lon)
  const a = Math.sin(dp / 2) ** 2 + Math.cos(rad(lat)) * Math.cos(rad(KAABA[0])) * Math.sin(dl / 2) ** 2
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}
const COMPASS = ['Utara', 'Timur Laut', 'Timur', 'Tenggara', 'Selatan', 'Barat Daya', 'Barat', 'Barat Laut']

async function geocode(q) {
  const { data } = await axios.get('https://geocoding-api.open-meteo.com/v1/search', { params: { name: q, count: 1, language: 'id' }, timeout: 10000 })
  const p = data?.results?.[0]
  if (!p) throw fail(`Kota "${q}" tidak ditemukan.`)
  return p
}

const specs = {
  asmaulhusna: { desc: 'Asmaul Husna: 99 nama Allah beserta artinya (nomor 1-99, atau semua)', usage: '[nomor | semua | cari kata]', example: '1', optional: true, run: async (c) => {
    const q = (c.args[0] || '').toLowerCase()
    if (/^\d+$/.test(q)) {
      const n = Number(q)
      if (n < 1 || n > 99) throw fail('Nomor harus 1 sampai 99.')
      const [a, b] = NAMA[n - 1]
      return panel('ASMAUL HUSNA', [{ head: `🕌 *${n}. ${a}*`, lines: [`Arti : ${b}`], plain: true }])
    }
    if (q === 'semua' || q === 'all') {
      const half = Math.ceil(NAMA.length / 2)
      const fmt = (arr, off) => arr.map(([a, b], i) => `${off + i + 1}. ${a} — ${b}`).join('\n')
      return `*ASMAUL HUSNA (1-${half})*\n${fmt(NAMA.slice(0, half), 0)}\n\n*ASMAUL HUSNA (${half + 1}-99)*\n${fmt(NAMA.slice(half), half)}`
    }
    if (q) {
      const hits = NAMA.map((v, i) => [v, i + 1]).filter(([[a, b]]) => `${a} ${b}`.toLowerCase().includes(q)).slice(0, 15)
      if (!hits.length) throw fail('Tidak ketemu. Coba kata lain, mis. "rezeki" atau "pengampun".')
      return panel('ASMAUL HUSNA', [{ head: `🔎 *HASIL "${q}"*`, lines: hits.map(([[a, b], i]) => `${i}. ${a} — ${b}`) }])
    }
    const day = Math.floor(Date.now() / 86400000)
    const [a, b] = NAMA[day % 99]
    return panel('ASMAUL HUSNA', [{ head: `🌙 *NAMA HARI INI: ${(day % 99) + 1}. ${a}*`, lines: [`Arti : ${b}`, 'Ketik .asmaulhusna semua untuk daftar lengkap'], plain: true }])
  } },
  kiblat: { desc: 'Arah kiblat dari kota kamu (derajat dari utara + jarak ke Ka\'bah)', usage: '<kota>', example: 'Surabaya', args: true, heavy: true, run: async (c) => {
    const p = await geocode(c.text.trim())
    const b = bearing(p.latitude, p.longitude)
    const km = distanceKm(p.latitude, p.longitude)
    return panel('ARAH KIBLAT', [
      { head: `📍 *${p.name}${p.admin1 ? `, ${p.admin1}` : ''}${p.country ? `, ${p.country}` : ''}*`, lines: [`Koordinat : ${p.latitude.toFixed(4)}, ${p.longitude.toFixed(4)}`, `Arah kiblat : *${b.toFixed(2)}°* dari Utara (searah jarum jam)`, `Mata angin : ${COMPASS[Math.round(b / 45) % 8]}`, `Jarak ke Ka'bah : ${Math.round(km).toLocaleString('id-ID')} km`] },
      { head: '🧭 *CARA PAKAI*', lines: ['Hadapkan kompas ke arah derajat di atas.', 'Cocokkan dengan aplikasi kompas/kiblat di ponsel untuk memastikan.'] }
    ])
  } }
}

module.exports = kit.multi({ name: 'islamkit', category: 'islam', emoji: '🕌', desc: 'Asmaul Husna & arah kiblat', specs })
