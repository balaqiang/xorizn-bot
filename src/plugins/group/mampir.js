// Fitur group/mampir — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("group/mampir", {
  "name": "mampir",
  "command": [
    "mampir",
    "dateng",
    "sayhi"
  ],
  "category": "group",
  "desc": "🌸 xorizn-bot Style - Ajak semua anggota mampir ke VT baru! (Admin Only, tag admin pengirim)",
  "usage": ".mampir <link VT TikTok>",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "cooldown": 10,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
