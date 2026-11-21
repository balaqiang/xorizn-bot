// Fitur premium/kasedaiki — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("premium/kasedaiki", {
  "name": "kasedaiki",
  "command": [
    "kasedaiki",
    "kasedai",
    "aiki"
  ],
  "category": "Premium",
  "desc": "Kirim gambar random kasedaiki",
  "usage": ".kasedaiki",
  "owner": false,
  "group": false,
  "private": false,
  "premium": true,
  "cooldown": 5,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
