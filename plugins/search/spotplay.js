// Fitur search/spotplay — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("search/spotplay", {
  "name": "spotplay",
  "command": [
    "spotplay",
    "splay",
    "sp"
  ],
  "category": "search",
  "desc": "Putar musik dari Spotify",
  "usage": ".spotplay <query>",
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
