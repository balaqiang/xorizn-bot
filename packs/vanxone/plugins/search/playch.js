// Fitur search/playch — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("search/playch", {
  "name": "playch",
  "command": [
    "pch",
    "playsaluran"
  ],
  "category": "search",
  "desc": "Putar musik ke saluran (convert opus)",
  "usage": ".playch <query> atau .playch --idch <id> <query>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 15,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
