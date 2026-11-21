// Fitur random/superhero — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("random/superhero", {
  "name": "superhero",
  "command": [
    "superhero",
    "hero",
    "pahlawan"
  ],
  "category": "fun",
  "desc": "Cari informasi superhero",
  "usage": ".superhero <nama>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
