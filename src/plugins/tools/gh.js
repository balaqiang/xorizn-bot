// Fitur tools/gh — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("tools/gh", {
  "name": "ghuser",
  "command": [
    "ghuser",
    "ghsearch",
    "ghgist"
  ],
  "category": "tools",
  "desc": "",
  "usage": "",
  "owner": false,
  "group": false,
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
