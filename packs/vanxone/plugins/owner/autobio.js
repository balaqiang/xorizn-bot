// Fitur owner/autobio — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("owner/autobio", {
  "name": "autobio",
  "command": [
    "autobio",
    "autostatus"
  ],
  "category": "owner",
  "desc": "Mengatur pembaruan bio WhatsApp bot secara otomatis",
  "usage": ".autobio on/off\\n.autobio <teks>",
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
