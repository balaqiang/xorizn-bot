// Fitur maker/autocrop — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("maker/autocrop", {
  "name": "autocrop",
  "command": [
    "autocrop",
    "crop",
    "acrop"
  ],
  "category": "maker",
  "desc": "Potong gambar/video otomatis sesuai rasio",
  "usage": ".autocrop <rasio> (reply gambar/video)",
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
