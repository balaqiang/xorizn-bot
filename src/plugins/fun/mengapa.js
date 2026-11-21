// Fitur fun/mengapa — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("fun/mengapa", {
  "name": "mengapa",
  "command": [
    "mengapa",
    "kenapa",
    "why"
  ],
  "category": "fun",
  "desc": "Tanya bot mengapa sesuatu",
  "usage": ".mengapa <pertanyaan>",
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
