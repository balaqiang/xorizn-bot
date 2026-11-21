// Fitur fun/respon — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("fun/respon", {
  "name": "autorimuru",
  "command": [
    "autorimuru"
  ],
  "category": "fun",
  "desc": "Auto respon jika ada yang menyebut Rimuru",
  "usage": ".autorimuru on/off",
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
