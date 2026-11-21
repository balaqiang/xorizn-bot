// Fitur tools/searchgist — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("tools/searchgist", {
  "name": "searchgist",
  "command": [
    "searchgist"
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
