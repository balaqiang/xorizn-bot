// Fitur religi/alkitab — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("religi/alkitab", {
  "name": "alkitab",
  "command": [
    "alkitab"
  ],
  "category": "islam",
  "desc": "",
  "usage": "",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 3,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
