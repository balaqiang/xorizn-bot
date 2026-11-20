// Fitur tools/convertfile — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("tools/convertfile", {
  "name": "convertfile",
  "command": [
    "convertfile",
    "cvf"
  ],
  "category": "tools",
  "desc": "Konversi file audio atau gambar ke format lain (reply ke media)",
  "usage": ".convertfile <format>",
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
