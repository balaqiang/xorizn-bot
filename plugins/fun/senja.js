// Fitur fun/senja — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("fun/senja", {
  "name": "senja",
  "command": [
    "senja",
    "katacinta",
    "romanticquotes"
  ],
  "category": "fun",
  "desc": "Random kata-kata senja/romantis",
  "usage": ".senja",
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
