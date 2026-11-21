// Fitur info/market — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("info/market", {
  "name": "market",
  "command": [
    "market"
  ],
  "category": "info",
  "desc": "",
  "usage": "",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 3,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
