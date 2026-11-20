const { make } = require('../../lib/dlplugin')

module.exports = make({
  name: 'fb',
  command: ['fb', 'facebook', 'fbdl'],
  desc: 'Download video Facebook',
  hosts: ['facebook.com', 'fb.watch', 'fb.com'],
  example: 'https://fb.watch/xxxx',
  label: 'FACEBOOK DOWNLOADER',
  audio: false
})
