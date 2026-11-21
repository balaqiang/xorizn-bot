// .wordle — tebak kata 5 huruf dalam 6 percobaan. Kotak: 🟩 tepat, 🟨 ada di posisi lain, ⬛ tidak ada
const { getUser, save, rp, pick } = require('../../lib/game')
const { userOf } = require('../../lib/utils')
const WORDS = 'api,apel,atlas,babi,bakso,bakar,bangun,bantu,batik,benar,bening,besar,bumbu,cabai,candi,cinta,damai,dapur,datar,dingin,doyan,emas,gagah,garam,gelap,gigih,gulai,hadir,halus,hujan,ikhlas,impor,indah,jalan,jambu,janji,jeruk,kabar,kaget,kakak,kapal,karya,kasih,kebun,kecil,kopi,kursi,lancar,langit,lapar,lemah,lemak,luwes,madu,makan,malam,manis,masak,mata,minum,mobil,motor,musim,nasib,nyata,obat,pagar,pasar,payung,pelan,pintu,pohon,puisi,rajin,ramai,rapat,rasa,rindu,roti,rumah,sabar,salju,santai,sapi,sawah,sehat,semut,senja,sunyi,surat,tahan,tamat,tanah,tebal,teman,tidur,tikus,topi,tulis,ubin,udara,ular,untuk,wajah,warga,warna,yakin,zaman'.split(',').filter((w) => w.length === 5)
const games = new Map()
module.exports = {
  name: 'wordle', command: ['wordle', 'tebakkata5'], category: 'game', emoji: '🟩', desc: 'Tebak kata 5 huruf dalam 6 percobaan (hadiah uang)', usage: '[tebakan] | menyerah',
  run: async ({ sender, args, prefix, reply }) => {
    const me = userOf(sender)
    const g = games.get(me)
    const w = (args[0] || '').toLowerCase()
    if (!g || Date.now() > g.exp) {
      if (w && w !== 'mulai') { games.delete(me) }
      const word = pick(WORDS)
      games.set(me, { word, tries: [], exp: Date.now() + 15 * 60e3 })
      return reply(`🟩 *WORDLE*\n\nAku memikirkan kata *5 huruf*. Kamu punya *6* percobaan.\n\n🟩 huruf & posisi tepat\n🟨 huruf ada, posisi salah\n⬛ huruf tidak ada\n\n➥ Tebak dengan: ${prefix}wordle <kata>\n➥ Menyerah: ${prefix}wordle menyerah`)
    }
    if (w === 'menyerah') { games.delete(me); return reply(`🏳️ Kata tadi: *${g.word.toUpperCase()}*`) }
    if (!/^[a-z]{5}$/.test(w)) return reply(`Tebakan harus 5 huruf. Contoh: ${prefix}wordle rumah`)
    const res = Array(5).fill('⬛'); const left = [...g.word]
    for (let i = 0; i < 5; i++) if (w[i] === g.word[i]) { res[i] = '🟩'; left[i] = null }
    for (let i = 0; i < 5; i++) if (res[i] === '⬛') { const k = left.indexOf(w[i]); if (k >= 0) { res[i] = '🟨'; left[k] = null } }
    g.tries.push({ w, r: res.join('') })
    const board = g.tries.map((t) => `${t.r}  ${t.w.toUpperCase()}`).join('\n')
    if (w === g.word) {
      games.delete(me)
      const prize = 4000 * (7 - g.tries.length), u = getUser(sender); u.money += prize; u.exp += 800; save()
      return reply(`🟩 *WORDLE — MENANG!*\n\n${board}\n\n🎉 Benar dalam ${g.tries.length} percobaan!\n▬ *Hadiah:* ${rp(prize)}\n▬ *EXP:* +800`)
    }
    if (g.tries.length >= 6) { games.delete(me); return reply(`🟥 *WORDLE — KALAH*\n\n${board}\n\nKata yang benar: *${g.word.toUpperCase()}*`) }
    await reply(`🟩 *WORDLE* (${g.tries.length}/6)\n\n${board}\n\n_Sisa percobaan: ${6 - g.tries.length}_`)
  }
}
