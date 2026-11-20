// Fitur fun/gachawaifu — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("fun/gachawaifu", {
  "name": "gachaistri",
  "command": [
    "gachaistri"
  ],
  "category": "fun",
  "desc": "Gacha waifu impianmu, jaga perasaannya, dan jadikan dia pasanganmu!",
  "usage": ".gachawaifu | .waifuku | .tinggalinwaifu",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
