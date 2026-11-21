const { make } = require('../../lib/dlplugin')

module.exports = make({
  name: 'reddit',
  command: ['reddit', 'rdl'],
  desc: 'Download video Reddit',
  hosts: ['reddit.com', 'redd.it'],
  example: 'https://www.reddit.com/r/xxx/comments/xxx',
  label: 'REDDIT DOWNLOADER',
  audio: false
})
