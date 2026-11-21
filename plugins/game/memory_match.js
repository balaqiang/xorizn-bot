// Fitur game/memory_match — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("game/memory_match", {
  "name": "memorymatch",
  "command": [
    "memorymatch",
    "memorymatchgame",
    "mmatch"
  ],
  "category": "game",
  "desc": "Game hafalan kartu - cocokin pasangan emoji!",
  "usage": "",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 3,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
