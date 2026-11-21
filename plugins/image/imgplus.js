// Paket gambar lanjutan: HD, scan dokumen, pas foto, hapus warna latar, sketsa, kartun, watermark, kartu ucapan
const kit = require('../../lib/kit')
const io = require('../../lib/imgops')

const stamp = () => Date.now().toString(36)
const bad = (m) => Object.assign(new Error('arg'), { userMessage: m })

const specs = {
  hd: { desc: 'Jernihkan & perbesar foto buram (peningkatan lokal, dikirim sebagai file kualitas penuh)', needs: 'image', heavy: true, run: async (c, m) => {
    const r = await io.hd(m.buffer)
    return { document: r.buffer, mimetype: 'image/jpeg', fileName: `hd-${stamp()}.jpg`, caption: `✅ Foto dipertajam${r.scale > 1 ? ` & diperbesar ${r.scale.toFixed(1)}x` : ''} → ${r.w}×${r.h}px\n\n_Catatan: ini peningkatan lokal (ketajaman, kontras, detail), bukan rekonstruksi AI. Foto yang sangat buram tidak bisa dipulihkan penuh._` }
  } },
  scan: { desc: 'Ubah foto dokumen/kertas jadi hasil scan bersih (bayangan hilang, teks jelas)', needs: 'image', heavy: true, run: async (c, m) => ({ document: await io.scan(m.buffer, false), mimetype: 'image/jpeg', fileName: `scan-${stamp()}.jpg`, caption: '📄 Hasil scan. Mau hitam-putih tegas? Pakai .scanbw' }) },
  scanbw: { desc: 'Scan dokumen mode hitam-putih tegas (hemat tinta, cocok untuk teks)', needs: 'image', heavy: true, run: async (c, m) => ({ document: await io.scan(m.buffer, true), mimetype: 'image/jpeg', fileName: `scanbw-${stamp()}.jpg`, caption: '📄 Hasil scan hitam-putih' }) },
  hapuswarna: { desc: 'Hapus latar/warna jadi transparan (otomatis dari tepi, atau warna tertentu)', usage: '[warna|auto] [toleransi 5-60]', example: 'putih 20', needs: 'image', heavy: true, run: async (c, m) => {
    const w = (c.args[0] || 'auto').toLowerCase()
    let hex = null
    if (w !== 'auto') {
      hex = io.parseColor(w)
      if (!hex) throw bad('Warna tidak dikenali. Pakai nama (putih, hijau, biru…), hex seperti #00ff00, atau "auto".')
    }
    const tol = kit.numArg(c.args[1], 22, 5, 60)
    return { document: await io.removeColor(m.buffer, hex, tol), mimetype: 'image/png', fileName: `transparan-${stamp()}.png`, caption: `✅ Latar ${hex ? hex : 'otomatis'} dihapus (toleransi ${tol}%).\nBelum bersih? Naikkan toleransi, contoh: .hapuswarna ${hex || 'auto'} 35` }
  } },
  pasfoto: { desc: 'Buat pas foto 2x3 / 3x4 / 4x6 + lembar cetak 10x15 cm (300 dpi), latar bisa diganti', usage: '[2x3|3x4|4x6] [warna latar]', example: '3x4 merah', needs: 'image', heavy: true, run: async (c, m) => {
    const size = (c.args[0] || '3x4').toLowerCase().replace(/[*×]/g, 'x')
    if (!io.PAS[size]) throw bad('Ukuran tersedia: 2x3, 3x4, 4x6')
    const bg = c.args[1] ? io.parseColor(c.args[1]) : null
    if (c.args[1] && !bg) throw bad('Warna latar tidak dikenali. Contoh: merah, biru, putih, #cc0000')
    const r = await io.pasfoto(m.buffer, size, bg)
    return { documents: [
      { buffer: r.sheet, mime: 'image/jpeg', name: `pasfoto-${size}-lembar.jpg`, caption: `🪪 Pas foto ${size} cm • ${r.copies} lembar dalam kertas 10x15 cm (300 dpi, siap cetak)${bg ? `\nLatar: ${bg}` : ''}\n_Pastikan wajah menghadap depan & latar polos agar hasil rapi._` },
      { buffer: r.single, mime: 'image/jpeg', name: `pasfoto-${size}.jpg`, caption: `Satuan ${r.px[0]}×${r.px[1]}px` }
    ] }
  } },
  sketsa: { desc: 'Ubah foto jadi sketsa pensil', needs: 'image', heavy: true, run: async (c, m) => ({ image: await io.sketch(m.buffer), caption: '✏️ Sketsa pensil' }) },
  kartun: { desc: 'Ubah foto jadi gaya kartun/ilustrasi', needs: 'image', heavy: true, run: async (c, m) => ({ image: await io.cartoon(m.buffer), caption: '🎨 Gaya kartun' }) },
  watermark: { desc: 'Tambah watermark teks (pojok/tengah) pada gambar', usage: '<teks> [| posisi]', example: 'Toko Saya | kiri-atas', needs: 'image', args: true, heavy: true, run: async (c, m) => {
    const raw = kit.rest(c.body).trim()
    if (!raw) throw bad('Tulis teks watermark.')
    const [t, pos] = raw.split('|').map((s) => s.trim())
    return { document: await io.watermark(m.buffer, t.slice(0, 80), pos || 'kanan-bawah'), mimetype: 'image/png', fileName: `watermark-${stamp()}.png`, caption: '✅ Watermark ditambahkan\nPosisi: kiri-atas, kanan-atas, kiri-bawah, kanan-bawah, tengah, tengah-tengah' }
  } },
  wmtile: { desc: 'Watermark teks berulang diagonal (anti-curi, untuk dokumen/foto produk)', usage: '<teks>', example: 'CONTOH ONLY', needs: 'image', args: true, heavy: true, run: async (c, m) => ({ document: await io.watermarkTile(m.buffer, kit.rest(c.body).trim().slice(0, 40)), mimetype: 'image/png', fileName: `wmtile-${stamp()}.png`, caption: '✅ Watermark diagonal ditambahkan' }) },
  caption: { desc: 'Tambah teks caption di atas gambar (gaya meme/quote modern)', usage: '<teks>', example: 'Senin lagi…', needs: 'image', args: true, heavy: true, run: async (c, m) => ({ image: await io.captionBar(m.buffer, kit.rest(c.body).trim().slice(0, 200)), caption: '' }) },
  textcard: { desc: 'Buat kartu quote/teks bergradien (siap jadi status)', usage: '<teks> | [warna1] [warna2]', example: 'Tetap semangat! | pink ungu', args: true, heavy: true, run: async (c) => {
    const [t, cols] = kit.rest(c.body).split('|').map((s) => s.trim())
    if (!t) throw bad('Tulis teksnya.')
    const [a, b] = (cols || '').split(/\s+/).filter(Boolean)
    const c1 = a ? io.parseColor(a) : '#7f00ff'
    const c2 = b ? io.parseColor(b) : '#e100ff'
    if (!c1 || !c2) throw bad('Warna tidak dikenali. Contoh: pink ungu / #ff0080 #7928ca')
    return { image: await io.textCard(t.slice(0, 300), c1, c2), caption: '' }
  } },
  ucapan: { desc: 'Kartu ucapan siap kirim (ultah, lebaran, natal, tahunbaru, nikah, wisuda, terimakasih, gws, sukses)', usage: '<jenis> [nama] [| pesan sendiri]', example: 'ultah Budi', args: true, heavy: true, run: async (c) => {
    const kind = (c.args[0] || '').toLowerCase()
    if (!io.THEMES[kind]) throw bad(`Jenis tersedia:\n${Object.keys(io.THEMES).join(', ')}\n\nContoh: ${c.prefix}ucapan ultah Budi | Semoga makin sukses!`)
    const tail = kit.rest(c.body).replace(/^\S+\s*/, '')
    const [name, custom] = tail.split('|').map((s) => s.trim())
    return { image: await io.greetingCard(kind, (name || '').slice(0, 40), (custom || '').slice(0, 160)), caption: '' }
  } }
}

delete specs.hd // .hd / .hdr kini dari plugins/tools/hd.js (plugin baru)
module.exports = kit.multi({ name: 'imgplus', category: 'image', emoji: '🖼️', desc: 'HD foto, scan dokumen, pas foto, hapus latar, watermark, kartu ucapan', specs })
