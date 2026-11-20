// Fitur sticker/tekss — kode inti di engine/orbit
module.exports = require('../../lib/engine/orbit').plugin("sticker/tekss", {
  "name": "tekss",
  "command": [
    "tekss",
    "tekssticker",
    "stikerteks"
  ],
  "category": "sticker",
  "desc": "Membuat sticker Brat dari teks",
  "usage": ".tekss <text>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 10,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
