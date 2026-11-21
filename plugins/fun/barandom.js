// Fitur random/barandom — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("random/barandom", {
  "name": "barandom",
  "command": [
    "barandom",
    "bluearchive"
  ],
  "category": "fun",
  "desc": "Random gambar Blue Archive",
  "usage": ".barandom",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
