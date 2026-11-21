// Fitur premium/ewepaksa — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("premium/ewepaksa", {
  "name": "ewepaksa",
  "command": [
    "ewepaksa",
    "perkosa"
  ],
  "category": "Premium",
  "desc": "",
  "usage": "",
  "owner": false,
  "group": true,
  "private": false,
  "premium": true,
  "cooldown": 3,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
