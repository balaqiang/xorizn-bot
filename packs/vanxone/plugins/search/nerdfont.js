// Fitur search/nerdfont — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("search/nerdfont", {
  "name": "dafont",
  "command": [
    "dafont",
    "nerdfont"
  ],
  "category": "search",
  "desc": "Cari font di DaFont",
  "usage": ".dafont <query>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
