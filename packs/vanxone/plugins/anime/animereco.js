// Fitur anime/animereco — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("anime/animereco", {
  "name": "animereco",
  "command": [
    "animereco",
    "animekomen",
    "rekomenanime",
    "animerank",
    "recoanime"
  ],
  "category": "anime",
  "desc": "Dapat rekomendasi anime berdasarkan genre atau top rating",
  "usage": ".animereco [genre]",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "cooldown": 8,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
