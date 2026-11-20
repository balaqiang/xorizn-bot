// Fitur maker/logometal — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("maker/logometal", {
  "name": "logo-metal",
  "command": [
    "logo-metal",
    "logometal",
    "metallogo",
    "steellogo",
    "metaltext"
  ],
  "category": "maker",
  "desc": "Buat logo dengan efek logam/steel",
  "usage": "",
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
