// Fitur sticker/bratvid2 — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("sticker/bratvid2", {
  "name": "bratvid2",
  "command": [
    "bratvid2"
  ],
  "category": "sticker",
  "desc": "Generate brat video v2",
  "usage": ".bratvid2 <text>",
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
