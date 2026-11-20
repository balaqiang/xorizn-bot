// Fitur sticker/bratvid — kode inti di engine/orbit
module.exports = require('../../lib/engine/orbit').plugin("sticker/bratvid", {
  "name": "teksvid",
  "command": [
    "teksvid",
    "teksvideo"
  ],
  "category": "sticker",
  "desc": "Membuat sticker brat animated",
  "usage": ".teksvid <text>",
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
