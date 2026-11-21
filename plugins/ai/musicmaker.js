// Fitur ai/musicmaker — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("ai/musicmaker", {
  "name": "musicmaker",
  "command": [
    "musicmaker",
    "bikinlagu",
    "suno"
  ],
  "category": "ai",
  "desc": "Membuat musik atau lagu menggunakan AI dari teks (prompt)",
  "usage": ".musicmaker <prompt>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 30,
  "energi": 3,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
