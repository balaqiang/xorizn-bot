// Fitur sticker/bratemon — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("sticker/bratemon", {
  "name": "bratemon",
  "command": [
    "bratemon",
    "bratemontext"
  ],
  "category": "sticker",
  "desc": "Membuat sticker Doraemon dengan teks di papan",
  "usage": ".bratemon <text>",
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
