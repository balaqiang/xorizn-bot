// Fitur search/putar-play2 — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("search/putar-play2", {
  "name": "putar-play2",
  "command": [
    "putar-play2"
  ],
  "category": "search",
  "desc": "Putar musik dari YouTube (Siputzx API)",
  "usage": ".putar-play2 <query>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 15,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
