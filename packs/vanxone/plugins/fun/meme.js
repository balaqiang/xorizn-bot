// Fitur random/meme — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("random/meme", {
  "name": "meme",
  "command": [
    "memeindonesia"
  ],
  "category": "fun",
  "desc": "Random meme Indonesia",
  "usage": ".meme",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [
      "neoxr"
    ],
    "scrapers": [],
    "assets": []
  }
})
