// Fitur ai/o-tochibi — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("ai/tochibi", {
  "name": "tochibi",
  "command": [
    "tochibi",
    "chibi",
    "chibistyle"
  ],
  "category": "ai",
  "desc": "Ubah gambar ke style Chibi",
  "usage": ".tochibi (reply gambar)",
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
