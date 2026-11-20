// Fitur clan/clanbank — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("clan/clanbank", {
  "name": "clanbank",
  "command": [
    "clanbank",
    "kasclan",
    "clanbalance"
  ],
  "category": "rpg",
  "desc": "Cek saldo kas clan",
  "usage": ".clanbank",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 3,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
