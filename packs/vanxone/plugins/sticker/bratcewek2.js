// Fitur sticker/bratcewek2 — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("sticker/bratcewek2", {
  "name": "bratcewek2",
  "command": [
    "bratcewek2",
    "cewekbrat2",
    "bratperempuan2",
    "bratgirl2"
  ],
  "category": "sticker",
  "desc": "Membuat sticker brat cewek versi 2",
  "usage": ".bratcewek2 <text>",
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
