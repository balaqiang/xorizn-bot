// Fitur fun/dimana — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("fun/dimana", {
  "name": "dimana",
  "command": [
    "dimana",
    "where",
    "mana"
  ],
  "category": "fun",
  "desc": "Tanya bot dimana sesuatu",
  "usage": ".dimana <pertanyaan>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 3,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
