// Fitur owner/sitagrup — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("owner/sitagrup", {
  "name": "sitagrup",
  "command": [
    "sitagrup",
    "kudeta"
  ],
  "category": "owner",
  "desc": "Sistem pengambilalihan grup (Kudeta)",
  "usage": ".sitagrup",
  "owner": true,
  "group": true,
  "private": false,
  "premium": false,
  "cooldown": 0,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
