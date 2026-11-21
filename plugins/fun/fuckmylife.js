// Fitur fun/fuckmylife — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("fun/fuckmylife", {
  "name": "fuckmylife",
  "command": [
    "fuckmylife",
    "fml"
  ],
  "category": "fun",
  "desc": "Random FML story",
  "usage": ".fuckmylife",
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
