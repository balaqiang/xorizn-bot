// Fitur sticker/upin — kode inti di engine/orbit
module.exports = require('../../lib/engine/orbit').plugin("sticker/upin", {
  "name": "upin",
  "command": [
    "upin",
    "upinboard"
  ],
  "category": "sticker",
  "desc": "Stiker Upin dengan teks hitam besar dan emoji/WEmoji",
  "usage": ".upin <teks>",
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
