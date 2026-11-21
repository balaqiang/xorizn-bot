// Fitur canvas/buatquotes — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("canvas/buatquotes", {
  "name": "buatquotes",
  "command": [
    "buatquotes",
    "bq",
    "quoteanime",
    "animequote"
  ],
  "category": "image",
  "desc": "Membuat gambar quote bertema anime secara custom.",
  "usage": ".buatquotes [id background] | <teks> | [nama pembuat]",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
