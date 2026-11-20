// Fitur search/play4 — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("search/play4", {
  "name": "play4",
  "command": [
    "play4",
    "playaudio4"
  ],
  "category": "search",
  "desc": "Putar musik dari YouTube (Faa API)",
  "usage": ".play4 <query>",
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
