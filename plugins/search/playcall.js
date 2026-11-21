// Fitur search/playcall — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("search/playcall", {
  "name": "playcall",
  "command": [
    "playcall",
    "call"
  ],
  "category": "search",
  "desc": "Putar musik dari YouTube lewat telpon",
  "usage": ".playcall <query>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 15,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
