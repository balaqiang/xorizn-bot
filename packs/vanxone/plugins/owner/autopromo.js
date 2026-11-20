// Fitur owner/autopromo — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("owner/autopromo", {
  "name": "iklan",
  "command": [
    "iklan"
  ],
  "category": "owner",
  "desc": "Auto promosi saluran ke grup",
  "usage": ".autopromo on/off/test",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 0,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
