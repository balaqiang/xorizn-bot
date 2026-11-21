// .allmenu — semua perintah (menu xorizn-bot: `menu all`)
const zt = require('./menu')
module.exports = {
  name: 'allmenu',
  command: ['allmenu', 'menuall'],
  category: 'info',
  desc: 'Tampilkan semua perintah',
  run: async (ctx) => zt.run({ ...ctx, args: ['all'], text: 'all' })
}
