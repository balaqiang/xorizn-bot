// Fitur clan/clandemote — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("clan/clandemote", {
  "name": "clandemote",
  "command": [
    "clandemote",
    "demoteclan",
    "removerole"
  ],
  "category": "rpg",
  "desc": "Turunkan jabatan member",
  "usage": ".clandemote @user",
  "owner": false,
  "group": true,
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
