// Fitur search/lyrics — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("search/lyrics", {
  "name": "lirik",
  "command": [
    "lyric"
  ],
  "category": "search",
  "desc": "Cari lirik lagu",
  "usage": ".lirik <query>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 10,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
