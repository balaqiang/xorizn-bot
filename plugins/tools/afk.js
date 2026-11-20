import { setAfk } from '../../src/features/afk.js'
import { userPart } from '../../src/core/jid.js'

export default {
  command: ['afk'],
  category: 'tools',
  description: 'Tandai dirimu sedang AFK; yang men-tag kamu akan diberi tahu',
  usage: '[alasan]',
  async run(m, { text }) {
    setAfk(m.sender, text)
    return m.reply(`💤 @${userPart(m.sender)} sekarang AFK${text ? `: _${text}_` : ''}.`)
  }
}
