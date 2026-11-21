// Fitur group/settop — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("group/settop", {
  "name": "settop",
  "command": [
    "settop",
    "topvariant",
    "topstyle"
  ],
  "category": "group",
  "desc": "Mengatur variant tampilan top 5",
  "usage": ".settop <classic|table>",
  "owner": true,
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
