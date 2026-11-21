// Fitur clan/clanupgrade — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("clan/clanupgrade", {
  "name": "clanupgrade",
  "command": [
    "clanupgrade",
    "upgradeclan",
    "levelupclan"
  ],
  "category": "rpg",
  "desc": "Upgrade level clan menggunakan kas clan",
  "usage": ".clanupgrade",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 60,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
