// Fitur game/tebakhewan — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("game/tebakhewan", {
  "name": "tebakhewan",
  "command": [
    "tebakhewan",
    "th",
    "guessanimal"
  ],
  "category": "game",
  "desc": "Tebak hewan dari ciri-ciri yang diberikan",
  "usage": ".tebakhewan",
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
