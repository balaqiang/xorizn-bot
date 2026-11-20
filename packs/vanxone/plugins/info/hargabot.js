// Fitur main/hargabot — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("main/hargabot", {
  "name": "hargabot",
  "command": [
    "hargabot",
    "sethargabot"
  ],
  "category": "info",
  "desc": "Menampilkan dan mengatur daftar harga sewa bot",
  "usage": ".hargabot / .sethargabot <teks>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 3,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
