// Fitur sticker/bratcewek — kode inti di engine/orbit
module.exports = require('../../lib/engine/orbit').plugin("sticker/bratcewek", {
  "name": "cewek",
  "command": [
    "cewek"
  ],
  "category": "sticker",
  "desc": "Membuat sticker cewek dengan teks",
  "usage": ".cewek <text>",
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
