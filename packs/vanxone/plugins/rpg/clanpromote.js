// Fitur clan/clanpromote — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("clan/clanpromote", {
  "name": "clanpromote",
  "command": [
    "clanpromote",
    "promoteclan",
    "setcoleader"
  ],
  "category": "rpg",
  "desc": "Naikkan jabatan member (Co-Leader/Elder)",
  "usage": ".clanpromote @user <coleader|elder>",
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
