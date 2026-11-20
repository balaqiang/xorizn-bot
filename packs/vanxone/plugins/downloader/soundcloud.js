const { make } = require('../../lib/dlplugin')

module.exports = make({
  name: 'soundcloud',
  command: ['soundcloud', 'scdl'],
  desc: 'Download lagu SoundCloud (MP3)',
  hosts: ['soundcloud.com', 'on.soundcloud.com'],
  example: 'https://soundcloud.com/artis/lagu',
  label: undefined,
  audio: true
})
