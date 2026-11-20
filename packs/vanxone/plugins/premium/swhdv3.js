// Fitur premium/swhdv3 — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("premium/swhdv3", {
  "name": "swhdv3",
  "command": [
    "swhdv3",
    "swhd3"
  ],
  "category": "Premium",
  "desc": "Convert document to image/video (Ultra Fast & Zero Buffering)",
  "usage": ".swhdv3 [caption]",
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
