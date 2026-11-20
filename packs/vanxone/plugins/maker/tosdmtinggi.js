// Fitur maker/tosdmtinggi — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("maker/tosdmtinggi", {
  "name": "tosdmtinggi",
  "command": [
    "tosdmtinggi",
    "tosdm",
    "dmtinggi"
  ],
  "category": "maker",
  "desc": "🎀 Bikin gambar Fake DM Tinggi biar temen kamu panik~ Hehe! 🤭",
  "usage": ".tosdm (reply/kirim gambar)",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 10,
  "energi": 5,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
