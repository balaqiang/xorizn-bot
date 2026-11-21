// Preset warna ala aplikasi foto: sekali ketik, langsung jadi.
const kit = require('../../lib/kit')
const io = require('../../lib/imgops')

const PRESET = {
  warm: ['Nuansa hangat keemasan', '🌅'],
  cool: ['Nuansa dingin kebiruan', '🧊'],
  vintage: ['Gaya foto jadul', '📷'],
  dramatic: ['Kontras tinggi, suasana dramatis', '🎭'],
  noir: ['Hitam putih kontras tajam (film noir)', '🎞️'],
  fade: ['Warna pudar lembut (matte)', '🌫️'],
  cinematic: ['Teal & orange ala film bioskop', '🎬'],
  pastel: ['Warna pastel lembut dan cerah', '🍬'],
  vivid: ['Warna super hidup', '🌈']
}

const specs = {}
for (const [name, [desc]] of Object.entries(PRESET)) {
  specs[name] = { desc, needs: 'image', heavy: true, run: async (c, m) => ({ image: await io.preset(m.buffer, name), caption: `✅ Preset ${name}` }) }
}
specs.presetgambar = {
  desc: 'Daftar semua preset warna',
  run: async ({ prefix }) => `*PRESET WARNA GAMBAR*\n\n${Object.entries(PRESET).map(([k, [d, e]]) => `${e} ${prefix}${k} — ${d}`).join('\n')}\n\nKirim/reply gambar dengan perintah di atas.`
}

module.exports = kit.multi({ name: 'imgpreset', category: 'image', emoji: '🎨', desc: 'Preset warna foto (warm, cool, vintage, cinematic, dll)', specs })
