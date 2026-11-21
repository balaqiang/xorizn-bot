// Fitur religi/mandiwajib — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("religi/mandiwajib", {
  "name": "mandiwajib",
  "command": [
    "mandiwajib",
    "caramandiwajib",
    "mandi-wajib"
  ],
  "category": "islam",
  "desc": "Panduan cara mandi wajib beserta doa",
  "usage": ".mandiwajib",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
