// Fitur sticker/kannabrat — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("sticker/kannabrat", {
  "name": "kannabrat",
  "command": [
    "kannabrat",
    "kanna",
    "kannagen"
  ],
  "category": "sticker",
  "desc": "Membuat sticker Kanna dengan teks",
  "usage": ".kannabrat <teks>",
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
