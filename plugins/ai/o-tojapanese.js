// Fitur ai/o-tojapanese — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("ai/tojapanese", {
  "name": "tojapanese",
  "command": [
    "tojapanese",
    "japanese",
    "japanesestyle"
  ],
  "category": "ai",
  "desc": "Ubah gambar ke style Japanese",
  "usage": ".tojapanese (reply gambar)",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 30,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
