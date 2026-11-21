// Fitur clan/clanlevel — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("clan/clanlevel", {
  "name": "clanlevel",
  "command": [
    "clanlevel",
    "levelclan",
    "clanlvl"
  ],
  "category": "rpg",
  "desc": "Lihat level clan",
  "usage": ".clanlevel",
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
