// Fitur premium/swhdv2 — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("premium/swhdv2", {
  "name": "swhdv2",
  "command": [
    "swhdv2",
    "swhd2"
  ],
  "category": "Premium",
  "desc": "Convert document/URL to image/video (HD, Anti-Buffering & Heavy File Support)",
  "usage": ".swhdv2 [caption] atau .swhdv2 <link_tourl>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": true,
  "cooldown": 10,
  "energi": 10,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
