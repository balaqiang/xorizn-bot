// Fitur tools/npmshield — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("tools/npmshield", {
  "name": "npmshield",
  "command": [
    "npmshield"
  ],
  "category": "tools",
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
