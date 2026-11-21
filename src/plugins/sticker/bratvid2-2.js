// Fitur sticker/bratvid2 — kode inti di engine/orbit
module.exports = require('../../lib/engine/orbit').plugin("sticker/bratvid2", {
  "name": "teksvid2",
  "command": [
    "teksvid2",
    "teksv2"
  ],
  "category": "sticker",
  "desc": "Generate brat video v2",
  "usage": ".teksvid2 <text>",
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
