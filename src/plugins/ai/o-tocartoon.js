// Fitur ai/o-tocartoon — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("ai/tocartoon", {
  "name": "tocartoon",
  "command": [
    "tocartoon",
    "cartoon",
    "cartoonify",
    "tooncartoon"
  ],
  "category": "ai",
  "desc": "Ubah foto menjadi gaya kartun",
  "usage": ".tocartoon (reply/kirim gambar)",
  "owner": false,
  "group": false,
  "private": false,
  "premium": true,
  "admin": false,
  "botAdmin": false,
  "cooldown": 60,
  "energi": 3,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
