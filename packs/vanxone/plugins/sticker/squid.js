// Fitur sticker/squid — kode inti di engine/orbit
module.exports = require('../../lib/engine/orbit').plugin("sticker/squid", {
  "name": "squid",
  "command": [
    "squid",
    "squidboard",
    "squidward"
  ],
  "category": "sticker",
  "desc": "Stiker Squid 3D dengan teks hitam besar dan emoji/WEmoji",
  "usage": ".squid <teks>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 8,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
