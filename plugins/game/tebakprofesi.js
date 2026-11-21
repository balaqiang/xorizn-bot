// Fitur game/tebakprofesi — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("game/tebakprofesi", {
  "name": "tebakprofesi",
  "command": [
    "tebakprofesi",
    "tp",
    "guessjob"
  ],
  "category": "game",
  "desc": "Tebak profesi dari deskripsi yang diberikan",
  "usage": ".tebakprofesi",
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
