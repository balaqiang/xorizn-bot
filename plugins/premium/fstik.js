// Fitur premium/fstik — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("premium/fstik", {
  "name": "fstik",
  "command": [
    "fstik",
    "stickerinfo"
  ],
  "category": "Premium",
  "desc": "Imported from Rimuru MD V4.6",
  "usage": "",
  "owner": false,
  "group": false,
  "private": false,
  "premium": true,
  "cooldown": 3,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
