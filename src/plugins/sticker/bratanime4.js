// Fitur sticker/bratanime4 — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("sticker/bratanime4", {
  "name": "bratanime4",
  "command": [
    "bratanime4",
    "bratanimegura",
    "bratgura",
    "bratganime"
  ],
  "category": "sticker",
  "desc": "Membuat sticker anime chibi dengan teks brat style",
  "usage": ".bratanime4 <text>",
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
