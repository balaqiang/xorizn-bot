// Fitur rich/tiktoksc — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("rich/tiktoksc", {
  "name": "tiktoksc",
  "command": [
    "tiktoksc",
    "searchtt",
    "tthtml"
  ],
  "category": "downloader",
  "desc": "TikTok HTML Feed Airich — video vertikal langsung di WhatsApp",
  "usage": ".tiktoksc <kata kunci>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 15,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
