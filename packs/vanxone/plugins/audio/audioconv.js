// Konverter format audio: WAV, OGG, FLAC, AAC, M4A (dikirim sebagai file)
const kit = require('../../lib/kit')
const ffm = require('../../lib/ffm')

const FMT = {
  towav: { ext: 'wav', mime: 'audio/wav', desc: 'Ubah audio/VN/video jadi WAV (tanpa kompresi)', args: ['-vn', '-c:a', 'pcm_s16le', '-ar', '44100'] },
  toogg: { ext: 'ogg', mime: 'audio/ogg', desc: 'Ubah audio/VN/video jadi OGG Vorbis', args: ['-vn', '-c:a', 'libvorbis', '-q:a', '5'] },
  toflac: { ext: 'flac', mime: 'audio/flac', desc: 'Ubah audio/VN/video jadi FLAC (lossless)', args: ['-vn', '-c:a', 'flac'] },
  toaac: { ext: 'aac', mime: 'audio/aac', desc: 'Ubah audio/VN/video jadi AAC', args: ['-vn', '-c:a', 'aac', '-b:a', '192k'] },
  tom4a: { ext: 'm4a', mime: 'audio/mp4', desc: 'Ubah audio/VN/video jadi M4A', args: ['-vn', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart'] }
}
const specs = {}
for (const [k, f] of Object.entries(FMT)) {
  specs[k] = { desc: f.desc, needs: 'audio', heavy: true, run: async (c, m) => {
    const out = await ffm.run(m.buffer, f.ext, (i, o) => ['-i', i, ...f.args, o], 120000)
    return { document: out, mimetype: f.mime, fileName: `audio-${Date.now().toString(36)}.${f.ext}`, caption: `✅ ${f.ext.toUpperCase()} • ${kit.fmtSize(out.length)}` }
  } }
}
module.exports = kit.multi({ name: 'audioconv', category: 'audio', emoji: '🔁', desc: 'Konversi audio ke WAV/OGG/FLAC/AAC/M4A', specs })
