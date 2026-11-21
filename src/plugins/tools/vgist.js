// Fitur tools/vgist — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("tools/vgist", {
  "name": "vgist",
  "command": [
    "vgist"
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
