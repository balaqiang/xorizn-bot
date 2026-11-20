// Fitur sticker/bratfilter — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("sticker/bratfilter", {
  "name": "bratfilter",
  "command": [
    "bratfilter",
    "bfilter",
    "bratf",
    "filterbrat"
  ],
  "category": "sticker",
  "desc": "Sticker anime dengan 3 kotak teks",
  "usage": ".bratfilter <atas>|<kiri>|<kanan>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 10,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
