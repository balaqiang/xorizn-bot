// Fitur stalker/stalkcoc — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("stalker/stalkcoc", {
  "name": "stalkcoc",
  "command": [
    "stalkcoc",
    "cocstalk",
    "coc"
  ],
  "category": "stalker",
  "desc": "Lihat stats player Clash of Clans",
  "usage": ".stalkcoc <tag>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 10,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
