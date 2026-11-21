// Fitur anime/wuwa — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("anime/wuwa", {
  "name": "wuwa",
  "command": [
    "wuwa",
    "wuwasheet",
    "wutheringwaves",
    "wuwa-sheets"
  ],
  "category": "anime",
  "desc": "Menampilkan sheet material karakter Wuthering Waves",
  "usage": ".wuwa <nama karakter>",
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
