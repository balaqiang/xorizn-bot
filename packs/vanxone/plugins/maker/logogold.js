// Fitur maker/logogold — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("maker/logogold", {
  "name": "logo-gold",
  "command": [
    "logo-gold",
    "logogold",
    "goldlogo",
    "goldtext",
    "emastulisan"
  ],
  "category": "maker",
  "desc": "Buat logo dengan efek emas mewah (gold premium)",
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
