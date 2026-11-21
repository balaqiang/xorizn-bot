const { make } = require('../../lib/dlplugin')

module.exports = make({
  name: 'twitter',
  command: ['twitter', 'x', 'twdl'],
  desc: 'Download video/foto Twitter (X)',
  hosts: ['twitter.com', 'x.com', 't.co'],
  example: 'https://x.com/user/status/123',
  label: 'TWITTER DOWNLOADER',
  playlist: true
})
