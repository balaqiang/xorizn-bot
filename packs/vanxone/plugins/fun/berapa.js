// Fitur fun/berapa — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("fun/berapa", {
  "name": "berapa",
  "command": [
    "berapa",
    "howmuch",
    "howmany"
  ],
  "category": "fun",
  "desc": "Tanya bot berapa sesuatu",
  "usage": ".berapa <pertanyaan>",
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
