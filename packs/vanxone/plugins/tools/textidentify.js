// Fitur tools/textidentify — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("tools/textidentify", {
  "name": "textidentify",
  "command": [
    "textidentify",
    "scantext",
    "identifytext"
  ],
  "category": "tools",
  "desc": "Mengambil/membaca teks dari gambar (OCR)",
  "usage": ".textidentify (reply/kirim gambar)",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 10,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
