// Fitur owner/menuaudiostyle — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/menuaudiostyle", {
  "name": "menuaudiostyle",
  "command": [
    "menuaudiostyle",
    "gayaaudiomenu",
    "audiostylemenu",
    "setgayaaudio"
  ],
  "category": "owner",
  "desc": "Mengatur gaya pengiriman audio untuk .menu",
  "usage": ".menuaudiostyle <1-5>",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 0,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
