// Editor gambar: efek & penyesuaian (reply/kirim gambar atau stiker). Memakai sharp.
const kit = require('../../lib/kit')
const io = require('../../lib/imgops')

const nums = (args) => args.map((a) => Number(String(a).replace(',', '.'))).filter((n) => Number.isFinite(n))
const done = (image, caption) => ({ image, caption: `✅ ${caption}` })

const specs = {
  blur: { desc: 'Buramkan gambar (kekuatan 1-80)', usage: '[1-80]', needs: 'image', heavy: true, run: async (c, m) => done(await io.ops.blur(m.buffer, nums(c.args)), `Blur ${nums(c.args)[0] ?? 10}`) },
  pixelate: { desc: 'Efek pixel / mosaik', usage: '[ukuran blok]', needs: 'image', heavy: true, run: async (c, m) => done(await io.pixelate(m.buffer, nums(c.args)[0]), 'Pixelate') },
  gray: { desc: 'Hitam putih', needs: 'image', heavy: true, run: async (c, m) => done(await io.ops.gray(m.buffer), 'Hitam putih') },
  sepia: { desc: 'Efek sepia klasik', needs: 'image', heavy: true, run: async (c, m) => done(await io.ops.sepia(m.buffer), 'Sepia') },
  negate: { desc: 'Balik warna (negatif)', needs: 'image', heavy: true, run: async (c, m) => done(await io.ops.negate(m.buffer), 'Negatif') },
  sharpen: { desc: 'Pertajam gambar', usage: '[1-8]', needs: 'image', heavy: true, run: async (c, m) => done(await io.ops.sharpen(m.buffer, nums(c.args)), 'Dipertajam') },
  denoise: { desc: 'Kurangi bintik / noise', usage: '[3-9]', needs: 'image', heavy: true, run: async (c, m) => done(await io.ops.denoise(m.buffer, nums(c.args)), 'Noise dikurangi') },
  enhance: { desc: 'Perbaiki otomatis: kontras, warna, ketajaman', needs: 'image', heavy: true, run: async (c, m) => done(await io.ops.enhance(m.buffer), 'Enhance otomatis') },
  fliph: { desc: 'Balik gambar kiri-kanan', needs: 'image', run: async (c, m) => done(await io.ops.fliph(m.buffer), 'Dibalik horizontal') },
  flipv: { desc: 'Balik gambar atas-bawah', needs: 'image', run: async (c, m) => done(await io.ops.flipv(m.buffer), 'Dibalik vertikal') },
  rotate: { desc: 'Putar gambar (derajat, bawaan 90)', usage: '[derajat]', needs: 'image', run: async (c, m) => done(await io.ops.rotate(m.buffer, nums(c.args)), `Diputar ${nums(c.args)[0] ?? 90}°`) },
  brightness: { desc: 'Atur kecerahan (-90 s/d 200, bawaan 30)', usage: '[persen]', needs: 'image', run: async (c, m) => done(await io.ops.brightness(m.buffer, nums(c.args)), 'Kecerahan diubah') },
  contrast: { desc: 'Atur kontras (-80 s/d 200, bawaan 30)', usage: '[persen]', needs: 'image', run: async (c, m) => done(await io.ops.contrast(m.buffer, nums(c.args)), 'Kontras diubah') },
  saturate: { desc: 'Atur kepekatan warna (-100 s/d 300)', usage: '[persen]', needs: 'image', run: async (c, m) => done(await io.ops.saturate(m.buffer, nums(c.args)), 'Saturasi diubah') },
  tint: { desc: 'Beri sentuhan warna pada gambar', usage: '<warna>', example: 'biru', needs: 'image', heavy: true, run: async (c, m) => {
    const col = io.parseColor(c.args[0]) || '#ff9800'
    return done(await io.ops.tint(m.buffer, [col]), `Tint ${col}`)
  } },
  duotone: { desc: 'Gaya dua warna (gelap → terang)', usage: '<warna1> <warna2>', example: 'navy gold', needs: 'image', heavy: true, run: async (c, m) => {
    const a = io.parseColor(c.args[0]) || '#1a1a40'
    const b = io.parseColor(c.args[1]) || '#ffb703'
    return done(await io.duotone(m.buffer, a, b), `Duotone ${a} → ${b}`)
  } },
  emboss: { desc: 'Efek relief / timbul', needs: 'image', heavy: true, run: async (c, m) => done(await io.ops.emboss(m.buffer), 'Emboss') },
  edge: { desc: 'Deteksi tepi (gaya sketsa)', needs: 'image', heavy: true, run: async (c, m) => done(await io.ops.edge(m.buffer), 'Sketsa tepi') },
  posterize: { desc: 'Kurangi jumlah warna (poster)', usage: '[2-32]', needs: 'image', heavy: true, run: async (c, m) => done(await io.ops.posterize(m.buffer, nums(c.args)), 'Posterize') },
  glitch: { desc: 'Efek glitch RGB ala video rusak', usage: '[1-40]', needs: 'image', heavy: true, run: async (c, m) => done(await io.glitch(m.buffer, nums(c.args)[0] ?? 12), 'Glitch') },
  grain: { desc: 'Butiran film analog', usage: '[10-90]', needs: 'image', heavy: true, run: async (c, m) => done(await io.grain(m.buffer, nums(c.args)[0] ?? 40), 'Film grain') },
  vignette: { desc: 'Gelapkan tepi gambar (vignette)', usage: '[10-95]', needs: 'image', heavy: true, run: async (c, m) => done(await io.vignette(m.buffer, nums(c.args)[0] ?? 60), 'Vignette') },
  mirror: { desc: 'Cerminkan sisi kiri ke kanan (simetris)', needs: 'image', heavy: true, run: async (c, m) => done(await io.mirror(m.buffer), 'Cermin simetris') },
  roundimg: { desc: 'Sudut gambar dibuat membulat', usage: '[0-50 persen]', needs: 'image', heavy: true, run: async (c, m) => done(await io.roundImage(m.buffer, nums(c.args)[0] ?? 12), 'Sudut membulat (PNG transparan)') },
  border: { desc: 'Tambah bingkai warna', usage: '[warna] [tebal px]', example: 'merah 20', needs: 'image', heavy: true, run: async (c, m) => {
    const col = io.parseColor(c.args[0]) || '#ffffff'
    return done(await io.border(m.buffer, col, nums(c.args.slice(1))[0]), `Bingkai ${col}`)
  } },
  polaroid: { desc: 'Bingkai foto polaroid miring dengan bayangan', needs: 'image', heavy: true, run: async (c, m) => done(await io.polaroid(m.buffer), 'Polaroid') }
}

module.exports = kit.multi({ name: 'imgfx', category: 'image', emoji: '🖼️', desc: 'Editor gambar: efek & penyesuaian', specs })
