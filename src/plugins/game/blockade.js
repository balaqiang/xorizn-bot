// Fitur game/blockade — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("game/blockade", {
  "name": "blockade",
  "command": [
    "blockade",
    "bade",
    "gembok"
  ],
  "category": "game",
  "desc": "Game mengunci batu lawan! Kunci semua batu lawan untuk menang.",
  "usage": ".blockade [@lawan]",
  "owner": false,
  "group": true,
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
