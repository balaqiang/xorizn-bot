const { make } = require('../../lib/dlplugin')

module.exports = make({
  name: 'dla',
  command: ['dla', 'unduhaudio'],
  desc: 'Unduh audio (MP3) dari situs mana pun yang didukung yt-dlp',
  hosts: null,
  example: 'https://situs.com/video',
  label: undefined,
  audio: true
})
