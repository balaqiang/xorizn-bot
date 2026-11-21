// Fitur maker/iqcsticker — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("maker/iqcsticker", {
  "name": "iqcsticker",
  "command": [
    "iqcsticker",
    "iqcs",
    "chatiphonesticker"
  ],
  "category": "maker",
  "desc": "Bikin fake chat iPhone style sticker ✨",
  "usage": ".iqcsticker <teks>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
