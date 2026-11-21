// Fitur sticker/animebrat2 — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("sticker/animebrat2", {
  "name": "bratanime2",
  "command": [
    "bratanime2",
    "animebrat2"
  ],
  "category": "sticker",
  "desc": "Membuat sticker brat anime versi 2",
  "usage": ".animebrat2 <text>",
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
