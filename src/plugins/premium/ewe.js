// Fitur premium/ewe — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("premium/ewe", {
  "name": "ewe",
  "command": [
    "ewe",
    "anu"
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
