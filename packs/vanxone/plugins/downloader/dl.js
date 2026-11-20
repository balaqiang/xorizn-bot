const { make } = require('../../lib/dlplugin')

module.exports = make({
  name: 'dl',
  command: ['dl', 'unduh', 'download'],
  desc: 'Unduh video dari situs mana pun yang didukung yt-dlp',
  hosts: null,
  example: 'https://situs.com/video',
  label: 'DOWNLOADER',
  audio: false
})
