// Fitur owner/channel-tools — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("owner/channel-tools", {
  "name": "followch",
  "command": [
    "followch",
    "unfollowch",
    "setnamech"
  ],
  "category": "owner",
  "desc": "Manajemen channel/newsletter tambahan dari Aqua",
  "usage": ".followch <channelJid> / .createch <nama>",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 3,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
