// Fitur tools/uppastebin — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("tools/uppastebin", {
  "name": "up-pb",
  "command": [
    "up-pb",
    "uppastebin"
  ],
  "category": "tools",
  "desc": "",
  "usage": "",
  "owner": true,
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
