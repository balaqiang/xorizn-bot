// Fitur group/resettopaktif — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("group/resettopaktif", {
  "name": "resettopaktif",
  "command": [
    "resettopaktif",
    "resetactive",
    "resetleaderboard"
  ],
  "category": "group",
  "desc": "",
  "usage": ".resettopaktif",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
