// Fitur clan/clanrename — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("clan/clanrename", {
  "name": "clanrename",
  "command": [
    "clanrename",
    "renameclan",
    "guildrename"
  ],
  "category": "rpg",
  "desc": "Ganti nama clan",
  "usage": ".clanrename <nama baru>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 30,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
