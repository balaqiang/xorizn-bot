// Fitur search/dramabox — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("search/dramabox", {
  "name": "dramabox",
  "command": [
    "dramabox",
    "drama",
    "dramasearch"
  ],
  "category": "search",
  "desc": "Cari drama di DramaBox",
  "usage": ".dramabox <query>",
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
