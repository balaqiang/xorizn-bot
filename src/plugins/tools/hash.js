const crypto = require('crypto')
const { getQuotedText } = require('../../lib/utils')

const ALGO = { md5: 'md5', sha1: 'sha1', sha256: 'sha256', sha512: 'sha512' }

module.exports = {
  name: 'hash',
  command: ['hash', 'checksum'],
  category: 'tools',
  desc: 'Hitung hash teks (md5, sha1, sha256, sha512)',
  usage: '<algoritma> <teks>',
  run: async ({ msg, args, prefix, reply }) => {
    const algo = ALGO[(args[0] || '').toLowerCase()]
    const text = args.slice(1).join(' ') || getQuotedText(msg)
    if (!algo || !text) return reply(`Format: ${prefix}hash <md5|sha1|sha256|sha512> <teks>\nContoh: ${prefix}hash sha256 halo`)
    await reply(`🔐 *${algo.toUpperCase()}*\n\n${crypto.createHash(algo).update(text).digest('hex')}`)
  }
}
