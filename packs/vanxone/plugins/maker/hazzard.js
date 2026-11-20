// Fitur maker/hazzard — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("maker/hazzard", {
  "name": "hazzard",
  "command": [
    "hazzard",
    "hazard",
    "halfmirror",
    "symmetry"
  ],
  "category": "maker",
  "desc": "Setengah gambar normal, setengah di-mirror (horizontal/vertikal)",
  "usage": ".hazzard <h/v> (reply gambar)",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
