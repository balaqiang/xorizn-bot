// Fitur game/breakout — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("game/breakout", {
  "name": "breakout",
  "command": [
    "breakout",
    "arrowbreakout"
  ],
  "category": "game",
  "desc": "Game webview Arrow Breakout interaktif",
  "usage": ".breakout",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 10,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
