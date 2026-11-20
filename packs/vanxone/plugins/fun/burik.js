// Fitur fun/burik — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("fun/burik", {
  "name": "burik",
  "command": [
    "burik",
    "rusak",
    "jelek"
  ],
  "category": "fun",
  "desc": "Membuat foto menjadi burik/rusak",
  "usage": ".burik (reply foto)",
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
