// Fitur ai/o-sologo — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("ai/sologo", {
  "name": "sologo",
  "command": [
    "sologo",
    "ailogo",
    "bikinlogo"
  ],
  "category": "ai",
  "desc": "Membuat logo menggunakan AI dari teks (prompt)",
  "usage": ".sologo <prompt>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 10,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
