// Fitur fun/puisi — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("fun/puisi", {
  "name": "puisi",
  "command": [
    "puisi",
    "puisiku",
    "sajak"
  ],
  "category": "fun",
  "desc": "Random puisi Indonesia",
  "usage": ".puisi",
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
