// Fitur random/quotesimage — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("random/quotesimage", {
  "name": "quotesimage",
  "command": [
    "quotesimage",
    "quoteimg",
    "quotes-image",
    "qimg"
  ],
  "category": "fun",
  "desc": "Random quotes image",
  "usage": ".quotesimage",
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
