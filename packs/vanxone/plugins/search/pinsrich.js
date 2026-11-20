// Fitur search/pinsrich — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("search/pinsrich", {
  "name": "pinsrich",
  "command": [
    "pinsrich",
    "pinrich",
    "pinz",
    "pinterestrich",
    "pinsr"
  ],
  "category": "search",
  "desc": "Cari gambar Pinterest dalam bentuk grid Rich HTML yang bisa di-scroll",
  "usage": ".pinsrich <query> [jumlah]",
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
