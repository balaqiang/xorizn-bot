// Fitur search/playvid — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("search/playvid", {
  "name": "playvid",
  "command": [
    "playvid",
    "playvideo",
    "playmp4"
  ],
  "category": "search",
  "desc": "Cari dan putar video dari YouTube",
  "usage": ".playvid <query>",
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
