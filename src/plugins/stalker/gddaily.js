// Fitur stalker/gddaily — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("stalker/gddaily", {
  "name": "gddaily",
  "command": [
    "gddaily",
    "gdweekly",
    "gdevent",
    "dailygd",
    "weeklygd"
  ],
  "category": "stalker",
  "desc": "Cek level Daily/Weekly Geometry Dash hari ini",
  "usage": ".gddaily | .gdweekly",
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
