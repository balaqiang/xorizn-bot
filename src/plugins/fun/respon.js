// Fitur fun/respon — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("fun/respon", {
  "name": "autozenith",
  "command": [
    "autozenith"
  ],
  "category": "fun",
  "desc": "Auto respon jika ada yang menyebut xorizn-bot",
  "usage": ".autozenith on/off",
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
