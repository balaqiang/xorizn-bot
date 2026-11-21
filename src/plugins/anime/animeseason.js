// Fitur anime/animeseason — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("anime/animeseason", {
  "name": "animeseason",
  "command": [
    "animeseason",
    "season",
    "musimanime",
    "animemusim"
  ],
  "category": "anime",
  "desc": "Info lengkap anime musim ini (Spring/Summer/Fall/Winter) + statistik",
  "usage": ".animeseason [season]",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "cooldown": 10,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
