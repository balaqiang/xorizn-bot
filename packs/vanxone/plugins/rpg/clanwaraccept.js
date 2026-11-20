// Fitur clan/clanwaraccept — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("clan/clanwaraccept", {
  "name": "clanwaraccept",
  "command": [
    "clanwaraccept",
    "acceptwar",
    "waraccept",
    "terimawar"
  ],
  "category": "rpg",
  "desc": "Terima tantangan clan war",
  "usage": ".clanwaraccept",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 10,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
