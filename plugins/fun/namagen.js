const { pick, rand } = require('../../lib/fx')
const A = ['Shadow', 'Neo', 'Blaze', 'Frost', 'Nova', 'Zero', 'Ghost', 'Astra', 'Pixel', 'Cyber', 'Luna', 'Storm', 'Echo', 'Viper', 'Orion', 'Kuro', 'Aether', 'Rogue']
const B = ['Wolf', 'Hunter', 'Knight', 'Dragon', 'Fox', 'Rider', 'Slayer', 'Phantom', 'Raven', 'Samurai', 'Wizard', 'Falcon', 'Tiger', 'Reaper', 'Mage', 'Ninja']
const F1 = ['Ar', 'El', 'Thal', 'Kael', 'Mor', 'Lyr', 'Zan', 'Eri', 'Dra', 'Vel'], F2 = ['andor', 'wyn', 'ithas', 'orin', 'ael', 'adis', 'oth', 'ielle', 'ion', 'ara']
module.exports = {
  name: 'namagen', command: ['namagen', 'nickgen', 'namaff', 'namafantasi'], category: 'fun', emoji: '🪪', desc: 'Generator nama panggilan game & nama fantasi', usage: '[kata dasar]',
  run: async ({ text, reply }) => {
    const base = text.replace(/[^\p{L}\p{N}]/gu, '').slice(0, 12)
    const nicks = Array.from({ length: 6 }, () => base ? pick([`${base}${pick(B)}`, `${pick(A)}${base}`, `${base}_${rand(10, 99)}`, `xX${base}Xx`, `${base}${pick(A)}`]) : `${pick(A)}${pick(B)}${pick(['', '_', 'x'])}${rand(1, 99)}`)
    const fant = Array.from({ length: 4 }, () => pick(F1) + pick(F2) + ' ' + pick(F1) + pick(F2))
    await reply(`🪪 *GENERATOR NAMA*\n\n*Nama game*\n${nicks.map((n) => `➥ ${n}`).join('\n')}\n\n*Nama fantasi*\n${fant.map((n) => `➥ ${n}`).join('\n')}`)
  }
}
