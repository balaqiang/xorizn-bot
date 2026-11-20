// Fitur info/harilibur — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("info/harilibur", {
  "name": "harilibur",
  "command": [
    "harilibur",
    "libur",
    "harinasional"
  ],
  "category": "info",
  "desc": "Menampilkan informasi hari libur dan hari nasional mendatang",
  "usage": ".harilibur",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
