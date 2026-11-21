// Fitur canvas/iqcmerah — kode inti di engine/orbit
module.exports = require('../../lib/engine/orbit').plugin("canvas/iqcmerah", {
  "name": "iqcmerah",
  "command": [
    "iqcmerah",
    "iqc-red",
    "rediqc"
  ],
  "category": "image",
  "desc": "Membuat Fake Quote iOS style tema merah, teks panjang + WEmoji.",
  "usage": ".iqcmerah [teks/reply]",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
