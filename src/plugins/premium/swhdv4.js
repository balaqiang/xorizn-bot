// Fitur premium/swhdv4 — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("premium/swhdv4", {
  "name": "swhdv4",
  "command": [
    "swhdv4",
    "swhd4"
  ],
  "category": "Premium",
  "desc": "Convert document/URL to image/video (HD, Heavy File Support, Ultra Fast & Zero Buffering)",
  "usage": ".swhdv4 [caption] atau .swhdv4 <link_tourl>",
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
