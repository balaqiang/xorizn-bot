// Fitur search/mangatoon — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("search/mangatoon", {
  "name": "mangatoon",
  "command": [
    "mangatoon",
    "mtoon",
    "mangatoonsearch",
    "searchmangatoon"
  ],
  "category": "search",
  "desc": "Cari komik di Mangatoon",
  "usage": ".mangatoon <query>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 8,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
