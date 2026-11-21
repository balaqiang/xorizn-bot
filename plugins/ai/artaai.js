// Fitur ai/artaai — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("ai/artaai", {
  "name": "arta",
  "command": [
    "arta",
    "artagen",
    "artai",
    "aiarta"
  ],
  "category": "ai",
  "desc": "Membuat gambar AI menggunakan Arta AI Generator",
  "usage": ".arta Prompt | Style | Negative Prompt",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 15,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
