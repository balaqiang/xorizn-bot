const { pick } = require('../../lib/game')

module.exports = {
  name: 'koin',
  command: ['koin', 'coin', 'flip'],
  category: 'fun',
  desc: 'Lempar koin',
  run: async ({ reply }) => reply(`Hasilnya: *${pick(['Kepala', 'Ekor'])}*`)
}
