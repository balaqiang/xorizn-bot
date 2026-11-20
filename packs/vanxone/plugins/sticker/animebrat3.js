// Fitur sticker/animebrat3 — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("sticker/animebrat3", {
  "name": "bratanime3",
  "command": [
    "bratanime3",
    "animebrat3"
  ],
  "category": "sticker",
  "desc": "Membuat sticker brat anime versi 3",
  "usage": ".animebrat3 <text>",
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
