// Alat gambar: upscale, potong rasio, fit story, grid, palet warna, ASCII, info, gradien, konversi format
const kit = require('../../lib/kit')
const io = require('../../lib/imgops')
const { panel, num } = require('../../lib/uitext')

const nums = (args) => args.map((a) => Number(String(a).replace(',', '.'))).filter((n) => Number.isFinite(n))
const gcd = (a, b) => (b ? gcd(b, a % b) : a)

const specs = {
  upscale: { desc: 'Perbesar gambar 2x-4x dengan ketajaman terjaga (dikirim sebagai file)', usage: '[2-4]', needs: 'image', heavy: true, run: async (c, m) => {
    const f = kit.numArg(c.args[0], 2, 1.5, 4)
    const r = await io.upscale(m.buffer, f)
    return { document: r.buffer, mimetype: 'image/png', fileName: `upscale-${f}x.png`, caption: `✅ Diperbesar ${f}x → ${r.w}×${r.h}px` }
  } },
  ratio: { desc: 'Potong gambar ke rasio tertentu (1:1, 4:5, 16:9, 9:16, dll)', usage: '<rasio>', example: '16:9', needs: 'image', heavy: true, run: async (c, m) => {
    const r = (c.args[0] || '').replace('x', ':')
    if (!io.RATIOS[r]) throw Object.assign(new Error('rasio'), { userMessage: `Rasio tersedia: ${Object.keys(io.RATIOS).join(', ')}` })
    return { image: await io.cropRatio(m.buffer, r), caption: `✅ Dipotong ${r}` }
  } },
  storyfit: { desc: 'Muat gambar ke ukuran Story/Status 9:16 dengan latar blur', needs: 'image', heavy: true, run: async (c, m) => ({ image: await io.blurFit(m.buffer, 1080, 1920), caption: '✅ Siap untuk Story/Status (1080×1920)' }) },
  postfit: { desc: 'Muat gambar ke ukuran post 4:5 dengan latar blur', needs: 'image', heavy: true, run: async (c, m) => ({ image: await io.blurFit(m.buffer, 1080, 1350), caption: '✅ Siap untuk post 4:5 (1080×1350)' }) },
  splitgrid: { desc: 'Potong gambar jadi grid (mis. 3x3) untuk feed puzzle', usage: '[kolom]x[baris]', example: '3x3', needs: 'image', heavy: true, run: async (c, m) => {
    const mt = (c.args[0] || '3x3').toLowerCase().match(/^(\d)[x×*](\d)$/)
    const cols = mt ? +mt[1] : 3
    const rows = mt ? +mt[2] : 3
    if (cols < 1 || rows < 1 || cols * rows < 2 || cols * rows > 12) throw Object.assign(new Error('grid'), { userMessage: 'Grid harus 2-12 potongan, contoh 3x3 atau 2x2.' })
    const tiles = await io.splitGrid(m.buffer, cols, rows)
    // urutan posting Instagram: dari kanan-bawah ke kiri-atas
    const order = tiles.map((t, i) => ({ t, i })).reverse()
    return { images: order.map((o) => o.t), captions: order.map((o, k) => `Potongan ${o.i + 1}/${tiles.length} • posting urutan ke-${k + 1}`) }
  } },
  palette: { desc: 'Ambil palet warna dominan dari gambar', usage: '[2-10]', needs: 'image', heavy: true, run: async (c, m) => {
    const n = Math.round(kit.numArg(c.args[0], 5, 2, 10))
    const pal = await io.palette(m.buffer, n)
    return { image: await io.swatch(pal), caption: `🎨 *PALET WARNA*\n\n${pal.map((p, i) => `${i + 1}. ${p.hex.toUpperCase()}  rgb(${p.rgb.join(', ')})  ${Math.round(p.share * 100)}%`).join('\n')}` }
  } },
  ascii: { desc: 'Ubah gambar jadi seni ASCII (teks)', usage: '[lebar 20-80]', needs: 'image', heavy: true, run: async (c, m) => {
    const art = await io.ascii(m.buffer, Math.round(kit.numArg(c.args[0], 48, 20, 80)))
    return `\`\`\`\n${art}\n\`\`\``
  } },
  imginfo: { desc: 'Info gambar: ukuran, format, rasio, warna dominan', needs: 'image', run: async (c, m) => {
    const i = await io.info(m.buffer)
    const g = gcd(i.width, i.height)
    return panel('INFO GAMBAR', [
      { head: '📐 *UKURAN*', lines: [`Resolusi : ${i.width} × ${i.height} px`, `Megapiksel : ${num((i.width * i.height) / 1e6, 2)} MP`, `Rasio : ${i.width / g}:${i.height / g}`, `Berkas : ${kit.fmtSize(i.size)}`] },
      { head: '🧬 *DETAIL*', lines: [`Format : ${String(i.format).toUpperCase()}`, `Ruang warna : ${i.space}`, `Kanal : ${i.channels}${i.hasAlpha ? ' (ada transparansi)' : ''}`, `Kedalaman : ${i.depth}`, i.density ? `Densitas : ${i.density} dpi` : '', i.isProgressive ? 'Progresif : ya' : ''].filter(Boolean) },
      { head: '🎨 *WARNA DOMINAN*', lines: [i.dominant.toUpperCase()] }
    ])
  } },
  gradient: { desc: 'Buat gambar gradien dua warna', usage: '<warna1> <warna2> [sudut] [PxL]', example: 'pink ungu 135 1080x1920', args: true, heavy: true, run: async (c) => {
    const a = io.parseColor(c.args[0])
    const b = io.parseColor(c.args[1])
    if (!a || !b) throw Object.assign(new Error('warna'), { userMessage: 'Warna tidak dikenali. Pakai nama (merah, biru, ungu…) atau hex seperti #ff0080.' })
    const dim = (c.args.find((x) => /^\d{2,4}x\d{2,4}$/i.test(x)) || '1080x1080').toLowerCase().split('x').map(Number)
    const ang = nums(c.args.slice(2).filter((x) => !/x/i.test(x)))[0] ?? 135
    const w = kit.clamp(dim[0], 64, 3000)
    const h = kit.clamp(dim[1], 64, 3000)
    return { image: await io.gradient(a, b, w, h, ang), caption: `🌈 ${a} → ${b} • ${w}×${h} • ${ang}°` }
  } },
  topng: { desc: 'Konversi gambar/stiker ke PNG (dikirim sebagai file)', needs: 'image', run: async (c, m) => ({ document: await require('sharp')(m.buffer, { failOn: 'none' }).png().toBuffer(), mimetype: 'image/png', fileName: `xorizn-bot-${Date.now()}.png`, caption: '✅ PNG' }) },
  tojpg: { desc: 'Konversi gambar ke JPG (dikirim sebagai file)', usage: '[kualitas 40-100]', needs: 'image', run: async (c, m) => ({ document: await require('sharp')(m.buffer, { failOn: 'none' }).flatten({ background: '#ffffff' }).jpeg({ quality: Math.round(kit.numArg(c.args[0], 90, 40, 100)), mozjpeg: true }).toBuffer(), mimetype: 'image/jpeg', fileName: `xorizn-bot-${Date.now()}.jpg`, caption: '✅ JPG' }) },
  towebp: { desc: 'Konversi gambar ke WebP (dikirim sebagai file)', usage: '[kualitas 40-100]', needs: 'image', run: async (c, m) => ({ document: await require('sharp')(m.buffer, { failOn: 'none' }).webp({ quality: Math.round(kit.numArg(c.args[0], 85, 40, 100)) }).toBuffer(), mimetype: 'image/webp', fileName: `xorizn-bot-${Date.now()}.webp`, caption: '✅ WebP' }) }
}

module.exports = kit.multi({ name: 'imgtools', category: 'image', emoji: '🧰', desc: 'Alat gambar: upscale, rasio, grid, palet, ASCII, info', specs })
