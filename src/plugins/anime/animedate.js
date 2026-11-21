// Fitur anime/animedate — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("anime/animedate", {
  "name": "animedate",
  "command": [
    "animedate",
    "animerilis",
    "animekalender",
    "animerelease"
  ],
  "category": "anime",
  "desc": "Kalender rilis anime musim ini (Spring/Summer/Fall/Winter)",
  "usage": ".animedate [season]",
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
