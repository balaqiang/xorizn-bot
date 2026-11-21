// Fitur fun/simi2 — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("fun/simi2", {
  "name": "simi2",
  "command": [
    "simi2",
    "simisimi2"
  ],
  "category": "fun",
  "desc": "Simi chat variant dari Tensura.",
  "usage": ".simi2 <teks>",
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
