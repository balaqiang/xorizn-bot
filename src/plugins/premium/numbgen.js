// Fitur premium/numbgen — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("premium/numbgen", {
  "name": "numbgen",
  "command": [
    "numbgen"
  ],
  "category": "Premium",
  "desc": "",
  "usage": "",
  "owner": false,
  "group": false,
  "private": false,
  "premium": true,
  "cooldown": 3,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
