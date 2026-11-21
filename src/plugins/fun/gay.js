// Fitur fun/gay — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("fun/gay", {
  "name": "gay",
  "command": [
    "gay",
    "howgay"
  ],
  "category": "fun",
  "desc": "Menunjuk member paling gay di grup",
  "usage": ".gay",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 10,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
