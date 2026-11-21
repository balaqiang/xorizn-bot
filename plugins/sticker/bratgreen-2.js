// Fitur sticker/bratgreen — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("sticker/bratgreen", {
  "name": "bratgreen",
  "command": [
    "brat2"
  ],
  "category": "sticker",
  "desc": "Membuat sticker brat ijo",
  "usage": ".brat2 <text>",
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
