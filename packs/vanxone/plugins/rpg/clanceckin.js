// Fitur clan/clanceckin — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("clan/clanceckin", {
  "name": "clancheckin",
  "command": [
    "clancheckin",
    "checkin",
    "dailyclan"
  ],
  "category": "rpg",
  "desc": "Checkin harian untuk dapet XP clan",
  "usage": ".clancheckin",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 86400,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
