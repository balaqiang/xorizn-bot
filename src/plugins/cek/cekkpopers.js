// Fitur cek/cekkpopers — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("cek/cekkpopers", {
  "name": "cekkpopers",
  "command": [
    "cekkpopers",
    "kpopers",
    "kpop"
  ],
  "category": "cek",
  "desc": "Cek tingkat kpopers kamu",
  "usage": ".cekkpopers <nama>",
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
