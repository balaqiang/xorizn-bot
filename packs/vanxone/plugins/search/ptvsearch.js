// Fitur search/ptvsearch — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("search/ptvsearch", {
  "name": "ptvsearch",
  "command": [
    "ptvsearch",
    "ptvs"
  ],
  "category": "search",
  "desc": "Cari video TikTok",
  "usage": ".ptvsearch <query>",
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
