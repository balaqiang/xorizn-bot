// Fitur search/brainly — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("search/brainly", {
  "name": "brainly",
  "command": [
    "brainly",
    "brain",
    "jawab"
  ],
  "category": "search",
  "desc": "Cari jawaban di Brainly",
  "usage": ".brainly <pertanyaan>",
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
