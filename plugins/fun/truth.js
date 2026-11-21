const { pick } = require('../../lib/game')

const LIST = [
  'Siapa orang terakhir yang kamu stalk di media sosial?',
  'Apa hal paling memalukan yang pernah kamu alami di sekolah?',
  'Kebohongan terbesar apa yang pernah kamu bilang ke orang tua?',
  'Apa kebiasaan anehmu yang jarang diketahui orang?',
  'Lagu apa yang malu kamu akui kamu suka?',
  'Kapan terakhir kali kamu menangis, dan kenapa?',
  'Hal apa yang paling kamu takutkan?',
  'Apa isi galeri HP-mu yang paling random?',
  'Siapa teman di grup ini yang paling sering bikin kamu kesal?',
  'Apa mimpi teraneh yang pernah kamu alami?'
]

module.exports = {
  list: LIST,
  name: 'truth',
  command: ['truth', 'jujur'],
  category: 'fun',
  desc: 'Pertanyaan truth',
  run: async ({ reply }) => reply(`*TRUTH*\n\n${pick(LIST)}`)
}
