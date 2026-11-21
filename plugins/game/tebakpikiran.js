// Fitur game/tebakpikiran — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("game/tebakpikiran", {
  "name": "tebakpikiran",
  "command": [
    "tebakpikiran",
    "mindread",
    "tebakin",
    "tbpikiran"
  ],
  "category": "game",
  "desc": "Bot menebak apa yang kamu pikirkan lewat pertanyaan AI",
  "usage": ".tebakpikiran",
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
