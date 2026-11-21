// Fitur random/cosba — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("random/cosba", {
  "name": "cosba",
  "command": [
    "cosba",
    "cosplayba"
  ],
  "category": "fun",
  "desc": "Random gambar cosplay Blue Archive",
  "usage": ".cosba",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
