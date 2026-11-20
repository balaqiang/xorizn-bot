// Fitur sticker/animebrat — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("sticker/animebrat", {
  "name": "bratanime",
  "command": [
    "bratanime",
    "animebrat"
  ],
  "category": "sticker",
  "desc": "Membuat sticker brat",
  "usage": ".animebrat <text>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 10,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
